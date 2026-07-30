"use client";

import { useEffect, useState } from "react";
import { useLocale } from "@/lib/i18n/LocaleContext";
import { useSession } from "@/lib/context/SessionContext";
import {
  listItemsRequest,
  createSalesInvoiceRequest,
  type ItemResponse,
} from "@/lib/api";

function formatKD(amount: number) {
  return amount.toLocaleString("en-US", { minimumFractionDigits: 3, maximumFractionDigits: 3 });
}

export default function PosPage() {
  const { locale, t } = useLocale();
  const { user, currentBranch } = useSession();

  const [items, setItems] = useState<ItemResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [query, setQuery] = useState("");
  const [cart, setCart] = useState<Record<string, number>>({});
  const [paymentMethod, setPaymentMethod] = useState<"CASH" | "CARD" | "CREDIT" | "BANK_TRANSFER">("CASH");
  const [saleMessage, setSaleMessage] = useState<string | null>(null);

  async function loadItems() {
    setIsLoading(true);
    setError(null);
    try {
      const data = await listItemsRequest();
      setItems(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load products");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadItems();
  }, []);

  const searchedItems = items.filter((i) => {
    const q = query.trim().toLowerCase();
    if (!q) return true;
    return (
      i.name.toLowerCase().includes(q) ||
      i.sku.toLowerCase().includes(q) ||
      (i.barcode ?? "").toLowerCase().includes(q)
    );
  });

  function addToCart(item: ItemResponse) {
    const stock = Number((item as any).stockQuantity ?? 0);
    const current = cart[item.id] ?? 0;
    if (current >= stock && stock > 0) {
      setError(`Cannot add more than available stock (${stock} units)`);
      return;
    }
    setCart({ ...cart, [item.id]: current + 1 });
    setSaleMessage(null);
    setError(null);
  }

  function updateQty(itemId: string, qty: number) {
    if (qty <= 0) {
      const next = { ...cart };
      delete next[itemId];
      setCart(next);
      return;
    }
    const item = items.find((i) => i.id === itemId);
    const stock = item ? Number((item as any).stockQuantity ?? 0) : 9999;
    if (qty > stock && stock > 0) {
      setError(`Cannot exceed available stock (${stock} units)`);
      return;
    }
    setError(null);
    setCart({ ...cart, [itemId]: qty });
  }

  function removeFromCart(itemId: string) {
    const next = { ...cart };
    delete next[itemId];
    setCart(next);
  }

  function clearCart() {
    setCart({});
    setSaleMessage(null);
    setError(null);
  }

  const cartLines = Object.entries(cart)
    .map(([itemId, qty]) => {
      const item = items.find((i) => i.id === itemId);
      return item ? { item, qty } : null;
    })
    .filter((line): line is { item: ItemResponse; qty: number } => line !== null);

  const subtotal = cartLines.reduce((sum, line) => sum + Number(line.item.price) * line.qty, 0);

  async function handleCharge() {
    if (cartLines.length === 0) return;

    const branchId = user?.branchId || currentBranch?.id || "cfbb7132-6c84-442b-86a5-3a4d03b5e089";
    const userId = user?.id || "0f4c78ce-14cc-4d67-86f8-a12ddfea3ef7";
    const invoiceNumber = `POS-${Date.now().toString().slice(-6)}`;

    setIsSubmitting(true);
    setError(null);
    try {
      await createSalesInvoiceRequest({
        invoiceNumber,
        branchId,
        userId,
        paymentMethod,
        lines: cartLines.map((l) => ({
          itemId: l.item.id,
          quantity: l.qty,
          unitPrice: Number(l.item.price),
        })),
      });

      setSaleMessage(`Sale Complete! Invoice ${invoiceNumber} posted.`);
      setCart({});
      await loadItems(); // Refresh live stock numbers from DB
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sale failed");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="grid grid-cols-1 gap-6 p-6 lg:grid-cols-3">
      {/* Left: search + product grid */}
      <div className="space-y-4 lg:col-span-2">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-2xl font-bold text-ink">Point of Sale (POS)</h1>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search items by name, SKU, barcode..."
            className="w-full rounded-xl border border-ink/10 bg-white px-4 py-2.5 text-sm shadow-sm outline-none focus:border-gold sm:w-80"
          />
        </div>

        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-xs font-semibold text-red-700">
            {error}
          </div>
        )}

        {isLoading ? (
          <div className="rounded-2xl border border-ink/10 bg-white p-8 text-center text-sm text-ink/50 shadow-sm">
            Loading database items...
          </div>
        ) : items.length === 0 ? (
          <div className="rounded-2xl border border-ink/10 bg-white p-8 text-center text-sm text-ink/40 shadow-sm">
            No items found in database. Please create products in Inventory.
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
            {searchedItems.map((item) => {
              const stock = Number((item as any).stockQuantity ?? 0);
              const inCart = cart[item.id] ?? 0;
              const outOfStock = stock <= 0;

              return (
                <button
                  key={item.id}
                  onClick={() => addToCart(item)}
                  disabled={outOfStock}
                  className={`flex flex-col justify-between rounded-2xl border p-4 text-start transition shadow-sm ${
                    outOfStock
                      ? "border-ink/10 bg-ink/5 opacity-50 cursor-not-allowed"
                      : "border-ink/10 bg-white hover:border-gold hover:shadow-md"
                  }`}
                >
                  <div>
                    <span className="text-xs font-semibold text-gold uppercase tracking-wider">{item.category}</span>
                    <h3 className="line-clamp-2 text-sm font-bold text-ink mt-0.5">{item.name}</h3>
                    <p className="numeric-ltr text-xs text-ink/50">SKU: {item.sku}</p>
                  </div>

                  <div className="mt-4 flex items-end justify-between">
                    <span className="numeric-ltr text-sm font-bold text-ink">
                      {formatKD(Number(item.price))} KD
                    </span>
                    <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                      stock > 0 ? "bg-emerald-100 text-emerald-800" : "bg-red-100 text-red-700"
                    }`}>
                      Stock: {stock}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Right: Cart sidebar */}
      <div className="flex flex-col justify-between rounded-2xl border border-ink/10 bg-white p-5 shadow-sm">
        <div>
          <div className="mb-4 flex items-center justify-between border-b border-ink/10 pb-3">
            <h2 className="text-base font-bold text-ink">Current Order</h2>
            {cartLines.length > 0 && (
              <button
                onClick={clearCart}
                className="text-xs font-semibold text-red-600 hover:underline"
              >
                Clear Cart
              </button>
            )}
          </div>

          {saleMessage && (
            <div className="mb-4 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-xs font-semibold text-emerald-800">
              {saleMessage}
            </div>
          )}

          {cartLines.length === 0 ? (
            <div className="py-12 text-center text-sm text-ink/40">
              Order cart is empty. Click items on the left to add.
            </div>
          ) : (
            <div className="max-h-[350px] overflow-y-auto divide-y divide-ink/5">
              {cartLines.map(({ item, qty }) => (
                <div key={item.id} className="flex items-center justify-between py-3">
                  <div className="flex-1 pr-2">
                    <h4 className="line-clamp-1 text-sm font-bold text-ink">{item.name}</h4>
                    <span className="numeric-ltr text-xs text-ink/60">
                      {formatKD(Number(item.price))} KD × {qty}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => updateQty(item.id, qty - 1)}
                      className="h-7 w-7 rounded-lg border border-ink/20 text-xs font-bold text-ink hover:bg-ink/5"
                    >
                      -
                    </button>
                    <span className="w-6 text-center text-xs font-bold text-ink">{qty}</span>
                    <button
                      onClick={() => updateQty(item.id, qty + 1)}
                      className="h-7 w-7 rounded-lg border border-ink/20 text-xs font-bold text-ink hover:bg-ink/5"
                    >
                      +
                    </button>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="ml-1 text-xs text-red-600 hover:underline"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Total & Checkout */}
        <div className="mt-6 border-t border-ink/10 pt-4 space-y-4">
          <div className="space-y-2 text-sm">
            <div className="flex justify-between font-bold text-ink text-base">
              <span>Total:</span>
              <span className="numeric-ltr text-gold">{formatKD(subtotal)} KD</span>
            </div>
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold text-ink/70">Payment Method</label>
            <select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value as any)}
              className="w-full rounded-xl border border-ink/15 bg-white px-3 py-2 text-xs font-semibold text-ink outline-none focus:border-gold"
            >
              <option value="CASH">Cash</option>
              <option value="CARD">Card / K-Net</option>
              <option value="CREDIT">Credit</option>
              <option value="BANK_TRANSFER">Bank Transfer</option>
            </select>
          </div>

          <button
            onClick={handleCharge}
            disabled={cartLines.length === 0 || isSubmitting}
            className="w-full rounded-xl bg-ink py-3 text-sm font-bold text-white shadow hover:bg-gold hover:text-ink disabled:opacity-40"
          >
            {isSubmitting ? "Processing Sale..." : "Complete Sale & Post GL"}
          </button>
        </div>
      </div>
    </div>
  );
}
