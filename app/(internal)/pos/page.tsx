"use client";

import { useState } from "react";
import { useLocale } from "@/lib/i18n/LocaleContext";
import { useSession } from "@/lib/context/SessionContext";
import { items } from "@/lib/mock-data/items";
import { isItemVisibleToBrand } from "@/lib/utils/visibility";
import type { Item, PaymentMethod } from "@/lib/types";

function formatKD(amount: number) {
  return amount.toLocaleString("en-US", { minimumFractionDigits: 3, maximumFractionDigits: 3 });
}

export default function PosPage() {
  const { locale, t } = useLocale();
  const { currentBrand, currentBranch, branchesForCurrentBrand } = useSession();

  const [query, setQuery] = useState("");
  const [cart, setCart] = useState<Record<string, number>>({});
  const [discountPct, setDiscountPct] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("cash");
  const [saleMessage, setSaleMessage] = useState<string | null>(null);

  function stockForItem(item: Item): number {
    if (currentBranch) return item.stockByBranch[currentBranch.id] ?? 0;
    return branchesForCurrentBrand.reduce((sum, b) => sum + (item.stockByBranch[b.id] ?? 0), 0);
  }

  const visibleItems = currentBrand
    ? items.filter((i) => isItemVisibleToBrand(i, currentBrand.id))
    : [];

  const searchedItems = visibleItems.filter((i) => {
    const q = query.trim().toLowerCase();
    if (!q) return true;
    return (
      i.nameEn.toLowerCase().includes(q) ||
      i.nameAr.includes(q) ||
      i.sku.toLowerCase().includes(q) ||
      i.barcode.includes(q)
    );
  });

  const quickItems = visibleItems.slice(0, 6);

  function addToCart(item: Item) {
    const stock = stockForItem(item);
    const current = cart[item.id] ?? 0;
    if (current >= stock) return;
    setCart({ ...cart, [item.id]: current + 1 });
    setSaleMessage(null);
  }

  function updateQty(itemId: string, qty: number) {
    if (qty <= 0) {
      const next = { ...cart };
      delete next[itemId];
      setCart(next);
      return;
    }
    setCart({ ...cart, [itemId]: qty });
  }

  function removeFromCart(itemId: string) {
    const next = { ...cart };
    delete next[itemId];
    setCart(next);
  }

  function clearCart() {
    setCart({});
    setDiscountPct(0);
    setSaleMessage(null);
  }

  const cartLines = Object.entries(cart)
    .map(([itemId, qty]) => {
      const item = items.find((i) => i.id === itemId);
      return item ? { item, qty } : null;
    })
    .filter((line): line is { item: Item; qty: number } => line !== null);

  const subtotal = cartLines.reduce((sum, line) => sum + line.item.sellPriceKd * line.qty, 0);
  const discountAmount = subtotal * (discountPct / 100);
  const total = subtotal - discountAmount;
  const needsApproval = discountPct > 10;

  function handleCharge() {
    if (cartLines.length === 0) return;
    setSaleMessage(t.posScreen.saleComplete);
    setCart({});
    setDiscountPct(0);
  }

  const paymentMethods: PaymentMethod[] = ["cash", "card", "knet", "online"];

  return (
    <div className="grid grid-cols-1 gap-6 p-6 lg:grid-cols-3">
      {/* Left: search + product list */}
      <div className="space-y-4 lg:col-span-2">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t.posScreen.searchPlaceholder}
          className="w-full rounded-2xl border border-ink/10 bg-white px-4 py-3 text-sm shadow-sm outline-none focus:border-gold"
        />

        {/* Quick items strip */}
        {quickItems.length > 0 && (
          <div className="flex gap-2 overflow-x-auto pb-1">
            {quickItems.map((item) => {
              const stock = stockForItem(item);
              return (
                <button
                  key={item.id}
                  onClick={() => addToCart(item)}
                  disabled={stock <= 0}
                  className="shrink-0 rounded-xl border border-ink/10 bg-white px-3 py-2 text-xs font-medium text-ink shadow-sm hover:border-gold disabled:opacity-40"
                >
                  {locale === "ar" ? item.nameAr : item.nameEn}
                </button>
              );
            })}
          </div>
        )}

        {/* Product list */}
        <div className="space-y-2 rounded-2xl border border-ink/10 bg-white p-3 shadow-sm">
          {searchedItems.map((item) => {
            const stock = stockForItem(item);
            const inStock = stock > 0;
            return (
              <div
                key={item.id}
                className="flex items-center justify-between rounded-lg px-3 py-2 hover:bg-ink/5"
              >
                <div>
                  <p className="text-sm font-medium text-ink">
                    {locale === "ar" ? item.nameAr : item.nameEn}
                  </p>
                  <p className="numeric-ltr text-xs text-ink/50">{item.sku}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`numeric-ltr text-xs ${inStock ? "text-ink/50" : "text-red-600"}`}>
                    {inStock ? `${stock} ${t.posScreen.inStock}` : t.posScreen.outOfStock}
                  </span>
                  <span className="numeric-ltr text-sm font-semibold text-ink">
                    {formatKD(item.sellPriceKd)} KD
                  </span>
                  <button
                    onClick={() => addToCart(item)}
                    disabled={!inStock}
                    className="rounded-lg bg-ink px-3 py-1.5 text-xs font-medium text-white hover:bg-gold hover:text-ink disabled:opacity-40"
                  >
                    {t.posScreen.addToCart}
                  </button>
                </div>
              </div>
            );
          })}
          {searchedItems.length === 0 && (
            <p className="px-3 py-6 text-center text-sm text-ink/40">{t.posScreen.emptyCart}</p>
          )}
        </div>
      </div>

      {/* Right: cart + checkout */}
      <div className="space-y-4">
        <div className="rounded-2xl border border-ink/10 bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-ink">{t.posScreen.cart}</h2>
            {cartLines.length > 0 && (
              <button onClick={clearCart} className="text-xs text-ink/50 hover:text-red-600">
                {t.posScreen.clearCart}
              </button>
            )}
          </div>

          {cartLines.length === 0 ? (
            <p className="py-6 text-center text-sm text-ink/40">{t.posScreen.emptyCart}</p>
          ) : (
            <div className="space-y-3">
              {cartLines.map(({ item, qty }) => (
                <div key={item.id} className="flex items-center justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-ink">
                      {locale === "ar" ? item.nameAr : item.nameEn}
                    </p>
                    <p className="numeric-ltr text-xs text-ink/50">{formatKD(item.sellPriceKd)} KD</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <label className="sr-only">{t.posScreen.qty}</label>
                    <input
                      type="number"
                      min={0}
                      value={qty}
                      onChange={(e) => updateQty(item.id, Number(e.target.value))}
                      className="numeric-ltr w-14 rounded-lg border border-ink/10 px-2 py-1 text-sm"
                    />
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-xs text-ink/40 hover:text-red-600"
                    >
                      {t.posScreen.remove}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="rounded-2xl border border-ink/10 bg-white p-5 shadow-sm">
          <div className="mb-3 flex items-center justify-between text-sm">
            <span className="text-ink/60">{t.posScreen.subtotal}</span>
            <span className="numeric-ltr font-medium text-ink">{formatKD(subtotal)} KD</span>
          </div>

          <div className="mb-1 flex items-center justify-between gap-2 text-sm">
            <span className="text-ink/60">{t.posScreen.discount} (%)</span>
            <input
              type="number"
              min={0}
              max={100}
              value={discountPct}
              onChange={(e) => setDiscountPct(Number(e.target.value))}
              className="numeric-ltr w-20 rounded-lg border border-ink/10 px-2 py-1 text-sm"
            />
          </div>
          {needsApproval && (
            <p className="mb-3 text-xs font-medium text-red-600">{t.posScreen.discountApprovalNeeded}</p>
          )}

          <div className="mb-4 flex items-center justify-between border-t border-ink/10 pt-3 text-base">
            <span className="font-semibold text-ink">{t.posScreen.total}</span>
            <span className="numeric-ltr font-semibold text-ink">{formatKD(total)} KD</span>
          </div>

          <p className="mb-2 text-sm text-ink/60">{t.posScreen.paymentMethod}</p>
          <div className="mb-4 grid grid-cols-2 gap-2">
            {paymentMethods.map((method) => (
              <button
                key={method}
                onClick={() => setPaymentMethod(method)}
                className={`rounded-lg border px-3 py-2 text-sm ${
                  paymentMethod === method
                    ? "border-gold bg-gold/10 font-medium text-ink"
                    : "border-ink/10 text-ink/60 hover:border-ink/30"
                }`}
              >
                {t.posScreen[method]}
              </button>
            ))}
          </div>

          <button
            onClick={handleCharge}
            disabled={cartLines.length === 0}
            className="w-full rounded-xl bg-ink py-3 text-sm font-semibold text-white hover:bg-gold hover:text-ink disabled:opacity-40"
          >
            {t.posScreen.charge}
          </button>

          {saleMessage && (
            <p className="mt-3 text-center text-sm font-medium text-green-600">{saleMessage}</p>
          )}
        </div>
      </div>
    </div>
  );
}
