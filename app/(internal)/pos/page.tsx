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

type PriceTier = "RETAIL" | "SEMI_WHOLESALE" | "WHOLESALE";

export default function PosPage() {
  const { locale, t } = useLocale();
  const { user, currentBranch } = useSession();

  const [items, setItems] = useState<ItemResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [query, setQuery] = useState("");
  const [cart, setCart] = useState<Record<string, number>>({});
  const [cartUom, setCartUom] = useState<Record<string, string>>({});
  const [priceTier, setPriceTier] = useState<PriceTier>("RETAIL");
  const [paymentMethod, setPaymentMethod] = useState<"CASH" | "CARD" | "CREDIT" | "BANK_TRANSFER">("CASH");
  const [saleMessage, setSaleMessage] = useState<string | null>(null);

  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");

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
    function handleFocus() {
      loadItems();
    }
    function handleVisibility() {
      if (document.visibilityState === "visible") {
        loadItems();
      }
    }
    window.addEventListener("focus", handleFocus);
    document.addEventListener("visibilitychange", handleVisibility);
    return () => {
      window.removeEventListener("focus", handleFocus);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, []);

  const categories = ["ALL", ...Array.from(new Set(items.map((i) => i.category)))];

  const searchedItems = items.filter((i) => {
    if (selectedCategory !== "ALL" && i.category !== selectedCategory) return false;
    const q = query.trim().toLowerCase();
    if (!q) return true;
    return (
      i.name.toLowerCase().includes(q) ||
      i.sku.toLowerCase().includes(q) ||
      (i.barcode ?? "").toLowerCase().includes(q) ||
      (i.additionalBarcodes ?? []).some((b) => b.barcode.toLowerCase().includes(q)) ||
      (i.uoms ?? []).some((u) => (u.barcode ?? "").toLowerCase().includes(q))
    );
  });

  function getItemBasePrice(item: ItemResponse, tier: PriceTier): number {
    if (tier === "WHOLESALE" && item.wholesalePrice) return Number(item.wholesalePrice);
    if (tier === "SEMI_WHOLESALE" && item.semiWholesalePrice) return Number(item.semiWholesalePrice);
    if (item.retailPrice) return Number(item.retailPrice);
    return Number(item.price);
  }

  function getUomRatio(item: ItemResponse, unitName?: string): number {
    if (!unitName || !item.uoms || item.uoms.length === 0) return 1;
    const match = item.uoms.find((u) => u.unitName.toLowerCase() === unitName.toLowerCase());
    return match ? Number(match.conversionRatio || 1) : 1;
  }

  function getItemUnitPrice(item: ItemResponse, tier: PriceTier, unitName?: string): number {
    const basePrice = getItemBasePrice(item, tier);
    const ratio = getUomRatio(item, unitName);
    return basePrice * ratio;
  }

  function addToCart(item: ItemResponse) {
    const stock = Number(item.stockQuantity ?? 0);
    const current = cart[item.id] ?? 0;
    const selectedUnit = cartUom[item.id] || item.unit || "Piece";
    const ratio = getUomRatio(item, selectedUnit);
    const totalRequiredBaseStock = (current + 1) * ratio;

    if (totalRequiredBaseStock > stock && stock > 0) {
      setError(`Cannot add more than available stock (${stock} base pieces)`);
      return;
    }
    setCart({ ...cart, [item.id]: current + 1 });
    if (!cartUom[item.id]) {
      setCartUom({ ...cartUom, [item.id]: item.unit || "Piece" });
    }
    setSaleMessage(null);
    setError(null);
  }

  function updateQty(itemId: string, qty: number) {
    if (qty <= 0) {
      const nextCart = { ...cart };
      const nextUom = { ...cartUom };
      delete nextCart[itemId];
      delete nextUom[itemId];
      setCart(nextCart);
      setCartUom(nextUom);
      return;
    }
    const item = items.find((i) => i.id === itemId);
    const stock = item ? Number(item.stockQuantity ?? 0) : 9999;
    const selectedUnit = cartUom[itemId] || item?.unit || "Piece";
    const ratio = item ? getUomRatio(item, selectedUnit) : 1;

    if (qty * ratio > stock && stock > 0) {
      setError(`Cannot exceed available stock (${stock} base pieces)`);
      return;
    }
    setError(null);
    setCart({ ...cart, [itemId]: qty });
  }

  function updateItemUom(itemId: string, unitName: string) {
    setCartUom({ ...cartUom, [itemId]: unitName });
  }

  function removeFromCart(itemId: string) {
    const nextCart = { ...cart };
    const nextUom = { ...cartUom };
    delete nextCart[itemId];
    delete nextUom[itemId];
    setCart(nextCart);
    setCartUom(nextUom);
  }

  function clearCart() {
    setCart({});
    setCartUom({});
    setSaleMessage(null);
    setError(null);
  }

  const cartLines = Object.entries(cart)
    .map(([itemId, qty]) => {
      const item = items.find((i) => i.id === itemId);
      const unitName = cartUom[itemId] || item?.unit || "Piece";
      const unitPrice = item ? getItemUnitPrice(item, priceTier, unitName) : 0;
      const ratio = item ? getUomRatio(item, unitName) : 1;
      const basePieces = qty * ratio;
      return item ? { item, qty, unitName, unitPrice, ratio, basePieces } : null;
    })
    .filter((line): line is { item: ItemResponse; qty: number; unitName: string; unitPrice: number; ratio: number; basePieces: number } => line !== null);

  const subtotal = cartLines.reduce((sum, line) => sum + line.unitPrice * line.qty, 0);

  async function handleCharge() {
    if (cartLines.length === 0) return;

    const branchId = user?.branchId || currentBranch?.id || "cfbb7132-6c84-442b-86a5-3a4d03b5e089";
    const userId = user?.id || "0f4c78ce-14cc-4d67-86f8-a12ddfea3ef7";
    const invoiceNumber = `POS-${Date.now().toString().slice(-6)}`;

    // Snapshot base stock deductions for sold items
    const baseStockDeductions: Record<string, number> = {};
    cartLines.forEach((l) => {
      baseStockDeductions[l.item.id] = l.basePieces;
    });

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
          quantity: l.basePieces,
          unitPrice: l.unitPrice,
        })),
      });

      // Instantly decrement in-memory product stock for sold items
      setItems((prevItems) =>
        prevItems.map((item) => {
          const baseDeduction = baseStockDeductions[item.id] ?? 0;
          if (baseDeduction > 0) {
            const currentStock = Number(item.stockQuantity ?? 0);
            return { ...item, stockQuantity: Math.max(0, currentStock - baseDeduction) };
          }
          return item;
        })
      );

      setSaleMessage(`Sale Complete! Invoice ${invoiceNumber} posted.`);
      setCart({});
      setCartUom({});
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
          <div>
            <h1 className="text-2xl font-bold text-ink">Point of Sale (POS)</h1>
            <p className="text-xs text-ink/50 mt-0.5">Bin Essa Retail & Wholesale Sales Counter</p>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by name, SKU, barcode..."
              className="w-full rounded-xl border border-ink/10 bg-white px-4 py-2.5 text-sm shadow-sm outline-none focus:border-gold sm:w-64 font-mono"
            />
            <button
              type="button"
              onClick={() => loadItems()}
              className="rounded-xl border border-ink/10 bg-white px-3 py-2.5 text-xs font-semibold text-ink hover:bg-gold transition-colors whitespace-nowrap shadow-sm"
              title="Refresh Products Catalog"
            >
              ↻ Sync
            </button>
          </div>
        </div>

        {/* Multi-Price Tier & Category Filters */}
        <div className="flex flex-wrap items-center justify-between gap-2 bg-white p-2.5 rounded-2xl border border-ink/10 shadow-xs">
          {/* Price Tier Selector */}
          <div className="flex items-center gap-1.5 bg-ink/5 p-1 rounded-xl">
            <span className="text-[11px] font-bold text-ink/60 px-2">Price Tier:</span>
            {(["RETAIL", "SEMI_WHOLESALE", "WHOLESALE"] as const).map((tier) => (
              <button
                key={tier}
                type="button"
                onClick={() => setPriceTier(tier)}
                className={`px-2.5 py-1 text-xs font-bold rounded-lg transition whitespace-nowrap ${
                  priceTier === tier
                    ? "bg-ink text-white shadow-xs"
                    : "text-ink/70 hover:text-ink"
                }`}
              >
                {tier === "RETAIL" ? "🏷️ Retail" : tier === "SEMI_WHOLESALE" ? "🏢 Semi-WS" : "📦 Wholesale"}
              </button>
            ))}
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto text-xs py-0.5">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`rounded-lg px-2.5 py-1 font-semibold transition whitespace-nowrap ${
                  selectedCategory === cat
                    ? "bg-gold text-ink font-bold shadow-xs"
                    : "bg-ink/5 text-ink/70 hover:bg-ink/10"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
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
              const stock = Number(item.stockQuantity ?? 0);
              const outOfStock = stock <= 0;
              const isLowStock = stock > 0 && stock <= 10;
              const unitStr = item.unit || "pcs";
              const activePrice = getItemUnitPrice(item, priceTier);

              return (
                <button
                  key={item.id}
                  onClick={() => addToCart(item)}
                  disabled={outOfStock}
                  className={`flex flex-col justify-between rounded-2xl border p-4 text-start transition shadow-sm relative ${
                    outOfStock
                      ? "border-red-200 bg-red-50/30 opacity-60 cursor-not-allowed"
                      : isLowStock
                      ? "border-amber-200 bg-white hover:border-amber-400 hover:shadow-md"
                      : "border-ink/10 bg-white hover:border-gold hover:shadow-md"
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-gold uppercase tracking-wider">{item.category}</span>
                      <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-ink/5 text-ink/70">
                        {priceTier === "RETAIL" ? "Retail" : priceTier === "SEMI_WHOLESALE" ? "Semi-WS" : "Wholesale"}
                      </span>
                    </div>

                    <h3 className="line-clamp-2 text-sm font-bold text-ink mt-0.5">{item.name}</h3>
                    <p className="numeric-ltr text-xs text-ink/50 font-mono">SKU: {item.sku}</p>

                    {/* Admin Governance Controls Badges */}
                    <div className="flex flex-wrap gap-1 mt-1.5">
                      {item.trackExpiry && (
                        <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-amber-100 text-amber-800 border border-amber-200">
                          📅 Expiry
                        </span>
                      )}
                      {item.blockFreeGift && (
                        <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-red-100 text-red-700 border border-red-200">
                          🚫 No Gift
                        </span>
                      )}
                      {item.blockDiscount ? (
                        <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-red-100 text-red-700 border border-red-200">
                          🔒 No Disc
                        </span>
                      ) : (
                        <span className="text-[9px] font-semibold px-1.5 py-0.2 rounded bg-slate-100 text-slate-700 border border-slate-200">
                          🏷️ Max {item.maxDiscountPercent ?? 10}%
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="mt-4 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="numeric-ltr text-sm font-bold text-ink">
                        {formatKD(activePrice)} KD
                      </span>
                    </div>
                    <div>
                      <span
                        className={`inline-block text-[11px] font-bold px-2 py-0.5 rounded-md ${
                          outOfStock
                            ? "bg-red-100 text-red-700 border border-red-200"
                            : isLowStock
                            ? "bg-amber-100 text-amber-800 border border-amber-200"
                            : "bg-emerald-100 text-emerald-800 border border-emerald-200"
                        }`}
                      >
                        {outOfStock
                          ? "Out of Stock (0)"
                          : isLowStock
                          ? `Low Stock: ${stock} ${unitStr}`
                          : `Stock: ${stock} ${unitStr}`}
                      </span>
                    </div>
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
            <div>
              <h2 className="text-base font-bold text-ink">Current Cart</h2>
              <span className="text-xs font-semibold text-ink/50">
                Tier: {priceTier === "RETAIL" ? "Retail Selling" : priceTier === "SEMI_WHOLESALE" ? "Semi-Wholesale" : "Wholesale"}
              </span>
            </div>
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
            <div className="max-h-[360px] overflow-y-auto divide-y divide-ink/5">
              {cartLines.map(({ item, qty, unitName, unitPrice }) => {
                const availableUoms = item.uoms && item.uoms.length > 0
                  ? item.uoms
                  : [
                      { unitName: "Piece", conversionRatio: 1 },
                      { unitName: "Pack", conversionRatio: 5 },
                      { unitName: "Box", conversionRatio: 100 },
                      { unitName: "Carton", conversionRatio: 1000 },
                    ];

                return (
                  <div key={item.id} className="py-3 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <h4 className="line-clamp-1 text-sm font-bold text-ink">{item.name}</h4>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-xs text-red-600 hover:underline px-1"
                      >
                        ✕
                      </button>
                    </div>

                    <div className="flex items-center justify-between text-xs">
                      {/* Multi-UOM Unit Selector */}
                      <select
                        value={unitName}
                        onChange={(e) => updateItemUom(item.id, e.target.value)}
                        className="rounded-lg border border-ink/20 px-2 py-0.5 text-[11px] font-bold text-ink bg-slate-50 outline-none focus:border-gold"
                      >
                        {availableUoms.map((u) => (
                          <option key={u.unitName} value={u.unitName}>
                            {u.unitName} (1:{u.conversionRatio})
                          </option>
                        ))}
                      </select>

                      <span className="numeric-ltr text-xs font-mono font-bold text-ink">
                        {formatKD(unitPrice)} KD × {qty} = {formatKD(unitPrice * qty)} KD
                      </span>

                      {/* Quantity Controls */}
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => updateQty(item.id, qty - 1)}
                          className="h-6 w-6 rounded-lg border border-ink/20 text-xs font-bold text-ink hover:bg-ink/5"
                        >
                          -
                        </button>
                        <span className="w-5 text-center text-xs font-bold text-ink">{qty}</span>
                        <button
                          onClick={() => updateQty(item.id, qty + 1)}
                          className="h-6 w-6 rounded-lg border border-ink/20 text-xs font-bold text-ink hover:bg-ink/5"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Total & Checkout */}
        <div className="mt-6 border-t border-ink/10 pt-4 space-y-4">
          <div className="space-y-2 text-sm">
            <div className="flex justify-between font-bold text-ink text-base">
              <span>Total Payable:</span>
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
              <option value="CASH">Cash Drawer</option>
              <option value="CARD">Card / K-Net Terminal</option>
              <option value="CREDIT">Wholesale Credit</option>
              <option value="BANK_TRANSFER">Bank Wire Transfer</option>
            </select>
          </div>

          <button
            onClick={handleCharge}
            disabled={cartLines.length === 0 || isSubmitting}
            className="w-full rounded-xl bg-ink py-3 text-sm font-bold text-white shadow hover:bg-gold hover:text-ink disabled:opacity-40 transition-colors"
          >
            {isSubmitting ? "Processing Sale..." : "Complete Sale & Post GL"}
          </button>
        </div>
      </div>
    </div>
  );
}
