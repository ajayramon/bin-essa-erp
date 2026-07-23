"use client";

import { useState } from "react";
import { useLocale } from "@/lib/i18n/LocaleContext";
import { useSession } from "@/lib/context/SessionContext";
import { items } from "@/lib/mock-data/items";
import { suppliers } from "@/lib/mock-data/suppliers";
import { isItemVisibleToBrand } from "@/lib/utils/visibility";
import type { PurchaseOrderLine } from "@/lib/types";

function formatKD(amount: number) {
  return amount.toLocaleString("en-US", { minimumFractionDigits: 3, maximumFractionDigits: 3 });
}

export default function NewPurchaseOrderPage() {
  const { locale, t } = useLocale();
  const { currentBrand } = useSession();

  const [supplierId, setSupplierId] = useState("");
  const [lines, setLines] = useState<PurchaseOrderLine[]>([]);
  const [landedCostKd, setLandedCostKd] = useState(0);
  const [message, setMessage] = useState<string | null>(null);

  const availableItems = currentBrand
    ? items.filter((i) => isItemVisibleToBrand(i, currentBrand.id))
    : [];

  function addLine() {
    const firstUnused = availableItems.find((i) => !lines.some((l) => l.itemId === i.id));
    if (!firstUnused) return;
    setLines([
      ...lines,
      { itemId: firstUnused.id, quantity: 1, unitCostKd: firstUnused.costPriceKd },
    ]);
    setMessage(null);
  }

  function updateLine(index: number, patch: Partial<PurchaseOrderLine>) {
    const next = [...lines];
    next[index] = { ...next[index], ...patch };
    setLines(next);
  }

  function removeLine(index: number) {
    setLines(lines.filter((_, i) => i !== index));
  }

  function itemName(itemId: string) {
    const item = items.find((i) => i.id === itemId);
    if (!item) return itemId;
    return locale === "ar" ? item.nameAr : item.nameEn;
  }

  const subtotal = lines.reduce((sum, l) => sum + l.quantity * l.unitCostKd, 0);

  // Landed cost allocated proportionally across lines by value (unconfirmed
  // business rule — client has not specified a formula; simple placeholder).
  function lineShareOfLandedCost(line: PurchaseOrderLine): number {
    if (subtotal === 0) return 0;
    const lineValue = line.quantity * line.unitCostKd;
    return (lineValue / subtotal) * landedCostKd;
  }

  const grandTotal = subtotal + landedCostKd;

  function handleSave(status: "draft" | "pending_approval") {
    if (!supplierId || lines.length === 0) return;
    setMessage(t.purchaseOrders.poCreated);
  }

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-semibold text-ink">{t.purchaseOrders.title}</h1>
        <p className="mt-1 text-ink/60">{t.purchaseOrders.subtitle}</p>
      </div>

      <div className="rounded-2xl border border-ink/10 bg-white p-5 shadow-sm">
        <label className="mb-2 block text-sm font-medium text-ink">
          {t.purchaseOrders.supplier}
        </label>
        <select
          value={supplierId}
          onChange={(e) => setSupplierId(e.target.value)}
          className="w-full rounded-xl border border-ink/10 px-4 py-2.5 text-sm outline-none focus:border-gold sm:w-96"
        >
          <option value="">{t.purchaseOrders.selectSupplier}</option>
          {suppliers.map((s) => (
            <option key={s.id} value={s.id}>
              {locale === "ar" ? s.nameAr : s.nameEn}
            </option>
          ))}
        </select>
      </div>

      <div className="rounded-2xl border border-ink/10 bg-white p-5 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-ink">{t.purchaseOrders.item}</h2>
          <button
            onClick={addLine}
            className="rounded-lg bg-ink px-3 py-1.5 text-xs font-medium text-white hover:bg-gold hover:text-ink"
          >
            {t.purchaseOrders.addLine}
          </button>
        </div>

        {lines.length === 0 ? (
          <p className="py-6 text-center text-sm text-ink/40">{t.purchaseOrders.noLines}</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-ink/10 text-start text-ink/50">
                  <th className="px-3 py-2 text-start font-medium">{t.purchaseOrders.item}</th>
                  <th className="px-3 py-2 text-start font-medium">{t.purchaseOrders.quantity}</th>
                  <th className="px-3 py-2 text-start font-medium">{t.purchaseOrders.unitCost}</th>
                  <th className="px-3 py-2 text-start font-medium">{t.purchaseOrders.lineTotal}</th>
                  <th className="px-3 py-2"></th>
                </tr>
              </thead>
              <tbody>
                {lines.map((line, index) => (
                  <tr key={index} className="border-b border-ink/5 last:border-0">
                    <td className="px-3 py-2">
                      <select
                        value={line.itemId}
                        onChange={(e) => {
                          const selected = items.find((i) => i.id === e.target.value);
                          updateLine(index, {
                            itemId: e.target.value,
                            unitCostKd: selected ? selected.costPriceKd : line.unitCostKd,
                          });
                        }}
                        className="rounded-lg border border-ink/10 px-2 py-1.5 text-sm"
                      >
                        {availableItems.map((i) => (
                          <option key={i.id} value={i.id}>
                            {locale === "ar" ? i.nameAr : i.nameEn}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-3 py-2">
                      <input
                        type="number"
                        min={1}
                        value={line.quantity}
                        onChange={(e) => updateLine(index, { quantity: Number(e.target.value) })}
                        className="numeric-ltr w-20 rounded-lg border border-ink/10 px-2 py-1.5 text-sm"
                      />
                    </td>
                    <td className="px-3 py-2">
                      <input
                        type="number"
                        min={0}
                        step={0.001}
                        value={line.unitCostKd}
                        onChange={(e) => updateLine(index, { unitCostKd: Number(e.target.value) })}
                        className="numeric-ltr w-24 rounded-lg border border-ink/10 px-2 py-1.5 text-sm"
                      />
                    </td>
                    <td className="numeric-ltr px-3 py-2 text-ink">
                      {formatKD(line.quantity * line.unitCostKd)} KD
                    </td>
                    <td className="px-3 py-2 text-end">
                      <button
                        onClick={() => removeLine(index)}
                        className="text-xs text-ink/40 hover:text-red-600"
                      >
                        {t.purchaseOrders.remove}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="rounded-2xl border border-ink/10 bg-white p-5 shadow-sm">
        <div className="mb-3 flex items-center justify-between text-sm">
          <span className="text-ink/60">{t.purchaseOrders.subtotal}</span>
          <span className="numeric-ltr font-medium text-ink">{formatKD(subtotal)} KD</span>
        </div>

        <div className="mb-1 flex items-center justify-between gap-2 text-sm">
          <div>
            <span className="text-ink/60">{t.purchaseOrders.landedCost}</span>
            <p className="text-xs text-ink/40">{t.purchaseOrders.landedCostNote}</p>
          </div>
          <input
            type="number"
            min={0}
            step={0.001}
            value={landedCostKd}
            onChange={(e) => setLandedCostKd(Number(e.target.value))}
            className="numeric-ltr w-28 rounded-lg border border-ink/10 px-2 py-1.5 text-sm"
          />
        </div>

        <div className="mb-4 flex items-center justify-between border-t border-ink/10 pt-3 text-base">
          <span className="font-semibold text-ink">{t.purchaseOrders.grandTotal}</span>
          <span className="numeric-ltr font-semibold text-ink">{formatKD(grandTotal)} KD</span>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => handleSave("draft")}
            disabled={!supplierId || lines.length === 0}
            className="flex-1 rounded-xl border border-ink/10 py-3 text-sm font-medium text-ink hover:border-gold disabled:opacity-40"
          >
            {t.purchaseOrders.saveDraft}
          </button>
          <button
            onClick={() => handleSave("pending_approval")}
            disabled={!supplierId || lines.length === 0}
            className="flex-1 rounded-xl bg-ink py-3 text-sm font-semibold text-white hover:bg-gold hover:text-ink disabled:opacity-40"
          >
            {t.purchaseOrders.submitForApproval}
          </button>
        </div>

        {message && (
          <p className="mt-3 text-center text-sm font-medium text-green-600">{message}</p>
        )}
      </div>
    </div>
  );
}
