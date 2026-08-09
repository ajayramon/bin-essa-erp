"use client";

import { useState } from "react";
import {
  X,
  Printer,
  CheckCircle2,
  ScanBarcode,
  Search,
  User,
  Percent,
  FileText,
  Boxes,
  Clock,
  Trash2,
  ArrowRight,
  Receipt,
  Building2,
} from "lucide-react";
import { useLocale } from "@/lib/i18n/LocaleContext";
import type { Item, Customer, Branch } from "@/lib/types";
import type { CartItemLine, PosPaymentMethod } from "./PosCartPanel";

function formatKD(amount: number) {
  return amount.toLocaleString("en-US", {
    minimumFractionDigits: 3,
    maximumFractionDigits: 3,
  });
}

// 1. RECEIPT MODAL
export interface CompletedSaleRecord {
  invoiceNumber: string;
  date: string;
  branchName: string;
  cashierName: string;
  customerName: string;
  lines: CartItemLine[];
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
  paymentMethod: PosPaymentMethod;
  cashReceived?: number;
  changeDue?: number;
  note?: string;
}

export function PosReceiptModal({
  sale,
  isOpen,
  onClose,
  onNewSale,
}: {
  sale: CompletedSaleRecord | null;
  isOpen: boolean;
  onClose: () => void;
  onNewSale: () => void;
}) {
  const { locale, t } = useLocale();

  if (!isOpen || !sale) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
      <div className="flex max-h-[90vh] w-full max-w-md flex-col rounded-3xl bg-white shadow-2xl overflow-hidden border border-neutral-200">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-neutral-100 bg-neutral-900 p-4 text-white">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-emerald-400" />
            <h3 className="text-base font-bold">{t.posScreen.saleComplete}</h3>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-neutral-400 hover:bg-neutral-800 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Printable Thermal Receipt Area */}
        <div className="flex-1 overflow-y-auto p-6 text-neutral-800 font-mono text-xs space-y-4">
          <div className="text-center space-y-1">
            <h2 className="text-base font-extrabold tracking-wider text-black">
              BIN ESSA ENTERPRISES
            </h2>
            <p className="text-neutral-500 font-sans">{sale.branchName}</p>
            <p className="text-[11px] text-neutral-400 font-sans">
              Invoice #{sale.invoiceNumber}
            </p>
            <p className="text-[11px] text-neutral-400 font-sans">{sale.date}</p>
          </div>

          <div className="border-t border-b border-dashed border-neutral-300 py-2 space-y-1 text-[11px] font-sans">
            <div className="flex justify-between">
              <span className="text-neutral-500">{t.posScreen.cashier}:</span>
              <span className="font-semibold">{sale.cashierName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-500">{t.posScreen.customer}:</span>
              <span className="font-semibold">{sale.customerName}</span>
            </div>
          </div>

          {/* Items Table */}
          <div className="space-y-1.5 pt-1">
            <div className="flex justify-between font-bold text-neutral-500 text-[11px] border-b border-neutral-200 pb-1">
              <span>Item / Qty</span>
              <span>Total</span>
            </div>
            {sale.lines.map(({ item, qty }) => (
              <div key={item.id} className="flex justify-between text-xs py-0.5">
                <div className="min-w-0 pr-2">
                  <p className="font-medium truncate">
                    {locale === "ar" ? item.nameAr : item.nameEn}
                  </p>
                  <p className="text-[10px] text-neutral-500 numeric-ltr">
                    {qty} × {formatKD(item.sellPriceKd)} KD
                  </p>
                </div>
                <span className="numeric-ltr font-bold text-neutral-900 shrink-0">
                  {formatKD(item.sellPriceKd * qty)} KD
                </span>
              </div>
            ))}
          </div>

          {/* Totals */}
          <div className="border-t border-dashed border-neutral-300 pt-3 space-y-1 text-xs font-sans">
            <div className="flex justify-between text-neutral-600">
              <span>{t.posScreen.subtotal}</span>
              <span className="numeric-ltr font-medium">
                {formatKD(sale.subtotal)} KD
              </span>
            </div>
            {sale.discount > 0 && (
              <div className="flex justify-between text-red-600">
                <span>{t.posScreen.discount}</span>
                <span className="numeric-ltr font-medium">
                  -{formatKD(sale.discount)} KD
                </span>
              </div>
            )}
            <div className="flex justify-between text-neutral-600">
              <span>{t.posScreen.tax}</span>
              <span className="numeric-ltr font-medium">
                {formatKD(sale.tax)} KD
              </span>
            </div>
            <div className="flex justify-between text-sm font-extrabold border-t border-neutral-300 pt-2 text-black font-mono">
              <span>{t.posScreen.total}</span>
              <span className="numeric-ltr">{formatKD(sale.total)} KD</span>
            </div>

            <div className="flex justify-between text-[11px] text-neutral-600 pt-1">
              <span>{t.posScreen.paymentMethod}</span>
              <span className="uppercase font-bold">{sale.paymentMethod}</span>
            </div>
            {sale.paymentMethod === "cash" && sale.cashReceived !== undefined && (
              <>
                <div className="flex justify-between text-[11px] text-neutral-600">
                  <span>{t.posScreen.cashReceived}</span>
                  <span className="numeric-ltr">
                    {formatKD(sale.cashReceived)} KD
                  </span>
                </div>
                <div className="flex justify-between text-[11px] font-bold text-emerald-700">
                  <span>{t.posScreen.change}</span>
                  <span className="numeric-ltr">
                    {formatKD(sale.changeDue ?? 0)} KD
                  </span>
                </div>
              </>
            )}
          </div>

          <div className="text-center pt-2 text-[11px] text-neutral-400 font-sans">
            <p>Thank you for shopping with Bin Essa!</p>
            <p>شكراً لزيارتكم</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 border-t border-neutral-200 bg-neutral-50 p-4">
          <button
            type="button"
            onClick={() => window.print()}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-neutral-300 bg-white py-2.5 text-xs font-bold text-neutral-800 hover:bg-neutral-100"
          >
            <Printer className="h-4 w-4" />
            <span>{t.posScreen.printReceipt}</span>
          </button>

          <button
            type="button"
            onClick={onNewSale}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-neutral-950 py-2.5 text-xs font-extrabold text-[#FDCE0C] hover:bg-black"
          >
            <span>{t.posScreen.newSale}</span>
          </button>
        </div>
      </div>
    </div>
  );
}

// 2. HELD SALES / RECENT ORDERS MODAL
export interface HeldSaleRecord {
  id: string;
  heldAt: string;
  customerName: string;
  cartLines: CartItemLine[];
  total: number;
}

export function PosHeldSalesModal({
  isOpen,
  onClose,
  heldSales,
  onRecallSale,
  onDeleteHeldSale,
}: {
  isOpen: boolean;
  onClose: () => void;
  heldSales: HeldSaleRecord[];
  onRecallSale: (record: HeldSaleRecord) => void;
  onDeleteHeldSale: (id: string) => void;
}) {
  const { t } = useLocale();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
      <div className="flex max-h-[85vh] w-full max-w-lg flex-col rounded-3xl bg-white shadow-2xl overflow-hidden border border-neutral-200">
        <div className="flex items-center justify-between border-b border-neutral-200 bg-neutral-950 p-4 text-white">
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-[#FDCE0C]" />
            <h3 className="text-base font-bold">{t.posScreen.heldSales}</h3>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-neutral-400 hover:bg-neutral-800 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-2.5">
          {heldSales.length === 0 ? (
            <div className="py-12 text-center text-neutral-400">
              <Clock className="mx-auto h-8 w-8 text-neutral-300 mb-2" />
              <p className="text-sm font-medium">{t.posScreen.noHeldSales}</p>
            </div>
          ) : (
            heldSales.map((h) => (
              <div
                key={h.id}
                className="flex items-center justify-between rounded-2xl border border-neutral-200 bg-neutral-50/70 p-3.5 hover:border-neutral-300"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-neutral-900">
                      {h.customerName}
                    </span>
                    <span className="text-[11px] text-neutral-400">
                      • {h.heldAt}
                    </span>
                  </div>
                  <p className="text-xs text-neutral-500 mt-0.5">
                    {h.cartLines.length} {t.posScreen.itemsCount} (
                    {h.cartLines.map((l) => l.item.nameEn).join(", ")})
                  </p>
                  <p className="numeric-ltr text-xs font-extrabold text-neutral-950 mt-1">
                    {formatKD(h.total)} KD
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => onRecallSale(h)}
                    className="flex items-center gap-1 rounded-xl bg-neutral-950 px-3 py-1.5 text-xs font-bold text-[#FDCE0C] hover:bg-black"
                  >
                    <span>{t.posScreen.recall}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => onDeleteHeldSale(h.id)}
                    className="rounded-lg p-1.5 text-neutral-400 hover:bg-red-50 hover:text-red-600"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="border-t border-neutral-200 bg-neutral-50 p-3 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-neutral-300 bg-white px-4 py-2 text-xs font-bold text-neutral-700 hover:bg-neutral-100"
          >
            {t.posScreen.close}
          </button>
        </div>
      </div>
    </div>
  );
}

// 3. BARCODE SCANNER MODAL
export function PosBarcodeModal({
  isOpen,
  onClose,
  onBarcodeSubmit,
}: {
  isOpen: boolean;
  onClose: () => void;
  onBarcodeSubmit: (code: string) => boolean;
}) {
  const { t } = useLocale();
  const [code, setCode] = useState("");
  const [error, setError] = useState(false);

  if (!isOpen) return null;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!code.trim()) return;
    const found = onBarcodeSubmit(code.trim());
    if (found) {
      setCode("");
      setError(false);
      onClose();
    } else {
      setError(true);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
      <div className="w-full max-w-md rounded-3xl bg-white shadow-2xl overflow-hidden border border-neutral-200">
        <div className="flex items-center justify-between border-b border-neutral-200 bg-neutral-950 p-4 text-white">
          <div className="flex items-center gap-2">
            <ScanBarcode className="h-5 w-5 text-[#FDCE0C]" />
            <h3 className="text-base font-bold">{t.posScreen.barcodeScan}</h3>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-neutral-400 hover:bg-neutral-800 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-bold text-neutral-700 mb-1">
              {t.posScreen.scanPrompt}
            </label>
            <div className="relative">
              <ScanBarcode className="absolute start-3 top-1/2 h-5 w-5 -translate-y-1/2 text-neutral-400" />
              <input
                type="text"
                autoFocus
                value={code}
                onChange={(e) => {
                  setCode(e.target.value);
                  setError(false);
                }}
                placeholder="e.g. 6281234500019 or VP-IQ-TRY-001"
                className="numeric-ltr w-full rounded-xl border border-neutral-300 ps-10 pe-4 py-2.5 text-sm font-semibold outline-none focus:border-[#FDCE0C]"
              />
            </div>
            {error && (
              <p className="mt-1.5 text-xs font-bold text-red-600">
                No matching product found with this barcode or SKU.
              </p>
            )}
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-neutral-300 bg-white px-4 py-2 text-xs font-bold text-neutral-700 hover:bg-neutral-100"
            >
              {t.posScreen.close}
            </button>
            <button
              type="submit"
              className="rounded-xl bg-neutral-950 px-5 py-2 text-xs font-extrabold text-[#FDCE0C] hover:bg-black"
            >
              {t.posScreen.addToCart}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// 4. CUSTOMER SELECTOR MODAL
export function PosCustomerModal({
  isOpen,
  onClose,
  customers,
  selectedCustomerId,
  onSelectCustomer,
}: {
  isOpen: boolean;
  onClose: () => void;
  customers: Customer[];
  selectedCustomerId: string | null;
  onSelectCustomer: (customer: Customer | null) => void;
}) {
  const { locale, t } = useLocale();
  const [search, setSearch] = useState("");

  if (!isOpen) return null;

  const filtered = customers.filter((c) => {
    const q = search.trim().toLowerCase();
    if (!q) return true;
    return (
      c.nameEn.toLowerCase().includes(q) ||
      c.nameAr.includes(q) ||
      c.id.toLowerCase().includes(q)
    );
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
      <div className="flex max-h-[85vh] w-full max-w-md flex-col rounded-3xl bg-white shadow-2xl overflow-hidden border border-neutral-200">
        <div className="flex items-center justify-between border-b border-neutral-200 bg-neutral-950 p-4 text-white">
          <div className="flex items-center gap-2">
            <User className="h-5 w-5 text-[#FDCE0C]" />
            <h3 className="text-base font-bold">{t.posScreen.selectCustomer}</h3>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-neutral-400 hover:bg-neutral-800 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-3 border-b border-neutral-200">
          <div className="relative">
            <Search className="absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search customer name..."
              className="w-full rounded-xl border border-neutral-300 ps-9 pe-3 py-2 text-xs outline-none focus:border-[#FDCE0C]"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-3 space-y-1.5">
          {/* Walk-in Customer Option */}
          <button
            type="button"
            onClick={() => {
              onSelectCustomer(null);
              onClose();
            }}
            className={`flex w-full items-center justify-between rounded-xl p-3 text-start border transition-colors ${
              selectedCustomerId === null
                ? "bg-neutral-950 text-white border-neutral-950"
                : "bg-neutral-50 text-neutral-800 border-neutral-200 hover:bg-neutral-100"
            }`}
          >
            <div>
              <p className="text-xs font-bold">{t.posScreen.walkInCustomer}</p>
              <p className="text-[11px] text-neutral-400">Default retail cash sale</p>
            </div>
            {selectedCustomerId === null && (
              <CheckCircle2 className="h-4 w-4 text-[#FDCE0C]" />
            )}
          </button>

          {filtered.map((c) => {
            const isSelected = selectedCustomerId === c.id;
            const name = locale === "ar" ? c.nameAr : c.nameEn;

            return (
              <button
                key={c.id}
                type="button"
                onClick={() => {
                  onSelectCustomer(c);
                  onClose();
                }}
                className={`flex w-full items-center justify-between rounded-xl p-3 text-start border transition-colors ${
                  isSelected
                    ? "bg-neutral-950 text-white border-neutral-950"
                    : "bg-white text-neutral-800 border-neutral-200 hover:bg-neutral-50"
                }`}
              >
                <div>
                  <p className="text-xs font-bold">{name}</p>
                  <p className="text-[11px] text-neutral-500 capitalize">
                    {c.customerType} • Limit: {formatKD(c.creditLimitKd)} KD
                  </p>
                </div>
                {isSelected && (
                  <CheckCircle2 className="h-4 w-4 text-[#FDCE0C]" />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// 5. DISCOUNT MODAL
export function PosDiscountModal({
  isOpen,
  onClose,
  discountPct,
  onApplyDiscount,
}: {
  isOpen: boolean;
  onClose: () => void;
  discountPct: number;
  onApplyDiscount: (pct: number) => void;
}) {
  const { t } = useLocale();
  const [val, setVal] = useState(discountPct);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
      <div className="w-full max-w-sm rounded-3xl bg-white shadow-2xl overflow-hidden border border-neutral-200">
        <div className="flex items-center justify-between border-b border-neutral-200 bg-neutral-950 p-4 text-white">
          <div className="flex items-center gap-2">
            <Percent className="h-5 w-5 text-[#FDCE0C]" />
            <h3 className="text-base font-bold">{t.posScreen.discount}</h3>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-neutral-400 hover:bg-neutral-800 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {/* Preset Discount Chips */}
          <div className="flex gap-2 justify-center">
            {[0, 5, 10, 15, 20].map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setVal(p)}
                className={`rounded-xl px-3 py-1.5 text-xs font-bold border transition-colors ${
                  val === p
                    ? "bg-[#FDCE0C] text-black border-[#FDCE0C]"
                    : "bg-neutral-50 text-neutral-700 border-neutral-200 hover:bg-neutral-100"
                }`}
              >
                {p}%
              </button>
            ))}
          </div>

          <div>
            <label className="block text-xs font-bold text-neutral-700 mb-1">
              {t.posScreen.discount} (%)
            </label>
            <input
              type="number"
              min={0}
              max={100}
              value={val}
              onChange={(e) => setVal(Math.min(100, Math.max(0, parseInt(e.target.value) || 0)))}
              className="numeric-ltr w-full rounded-xl border border-neutral-300 px-3 py-2 text-sm font-bold text-center outline-none focus:border-[#FDCE0C]"
            />
          </div>

          {val > 10 && (
            <p className="text-xs font-bold text-red-600 text-center">
              {t.posScreen.discountApprovalNeeded}
            </p>
          )}

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-neutral-300 bg-white px-4 py-2 text-xs font-bold text-neutral-700 hover:bg-neutral-100"
            >
              {t.posScreen.close}
            </button>
            <button
              type="button"
              onClick={() => {
                onApplyDiscount(val);
                onClose();
              }}
              className="rounded-xl bg-neutral-950 px-5 py-2 text-xs font-extrabold text-[#FDCE0C] hover:bg-black"
            >
              {t.posScreen.apply}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// 6. SALE NOTE MODAL
export function PosNoteModal({
  isOpen,
  onClose,
  note,
  onSaveNote,
}: {
  isOpen: boolean;
  onClose: () => void;
  note: string;
  onSaveNote: (note: string) => void;
}) {
  const { t } = useLocale();
  const [val, setVal] = useState(note);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
      <div className="w-full max-w-md rounded-3xl bg-white shadow-2xl overflow-hidden border border-neutral-200">
        <div className="flex items-center justify-between border-b border-neutral-200 bg-neutral-950 p-4 text-white">
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-[#FDCE0C]" />
            <h3 className="text-base font-bold">{t.posScreen.addNote}</h3>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-neutral-400 hover:bg-neutral-800 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <textarea
            rows={4}
            value={val}
            onChange={(e) => setVal(e.target.value)}
            placeholder={t.posScreen.notePlaceholder}
            className="w-full rounded-2xl border border-neutral-300 p-3 text-xs outline-none focus:border-[#FDCE0C]"
          />

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-neutral-300 bg-white px-4 py-2 text-xs font-bold text-neutral-700 hover:bg-neutral-100"
            >
              {t.posScreen.close}
            </button>
            <button
              type="button"
              onClick={() => {
                onSaveNote(val);
                onClose();
              }}
              className="rounded-xl bg-neutral-950 px-5 py-2 text-xs font-extrabold text-[#FDCE0C] hover:bg-black"
            >
              {t.common.save}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// 7. STOCK LOOKUP MODAL
export function PosStockLookupModal({
  isOpen,
  onClose,
  items,
  branches,
}: {
  isOpen: boolean;
  onClose: () => void;
  items: Item[];
  branches: Branch[];
}) {
  const { locale, t } = useLocale();
  const [query, setQuery] = useState("");

  if (!isOpen) return null;

  const filtered = items.filter((i) => {
    const q = query.trim().toLowerCase();
    if (!q) return true;
    return (
      i.nameEn.toLowerCase().includes(q) ||
      i.nameAr.includes(q) ||
      i.sku.toLowerCase().includes(q) ||
      i.barcode.includes(q)
    );
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
      <div className="flex max-h-[90vh] w-full max-w-2xl flex-col rounded-3xl bg-white shadow-2xl overflow-hidden border border-neutral-200">
        <div className="flex items-center justify-between border-b border-neutral-200 bg-neutral-950 p-4 text-white">
          <div className="flex items-center gap-2">
            <Boxes className="h-5 w-5 text-[#FDCE0C]" />
            <h3 className="text-base font-bold">{t.posScreen.stockLookup}</h3>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-neutral-400 hover:bg-neutral-800 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-4 border-b border-neutral-200 bg-neutral-50">
          <div className="relative">
            <Search className="absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t.posScreen.searchPlaceholder}
              className="w-full rounded-xl border border-neutral-300 ps-9 pe-3 py-2 text-xs outline-none focus:border-[#FDCE0C]"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="rounded-2xl border border-neutral-200 p-3.5 space-y-2 hover:border-neutral-300"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-neutral-900">
                    {locale === "ar" ? item.nameAr : item.nameEn}
                  </h4>
                  <p className="numeric-ltr text-[11px] text-neutral-400">
                    {item.sku} • {item.barcode}
                  </p>
                </div>
                <span className="numeric-ltr text-xs font-extrabold text-neutral-950">
                  {formatKD(item.sellPriceKd)} KD
                </span>
              </div>

              {/* Stock by branch breakdown */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 pt-1 text-[11px]">
                {branches.slice(0, 6).map((b) => {
                  const qty = item.stockByBranch[b.id] ?? 0;
                  return (
                    <div
                      key={b.id}
                      className="flex items-center justify-between rounded-lg bg-neutral-50 px-2 py-1 border border-neutral-200/60"
                    >
                      <span className="truncate text-neutral-600">
                        {locale === "ar" ? b.nameAr : b.nameEn}
                      </span>
                      <span
                        className={`numeric-ltr font-bold ${
                          qty > 0 ? "text-neutral-900" : "text-red-500"
                        }`}
                      >
                        {qty}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// 8. SHIFT & DAILY REPORT MODAL
export function PosShiftReportModal({
  isOpen,
  onClose,
  branchName,
  cashierName,
  todaySalesKd,
  transactionsCount,
  cashInHandKd,
  salesByMethod,
}: {
  isOpen: boolean;
  onClose: () => void;
  branchName: string;
  cashierName: string;
  todaySalesKd: number;
  transactionsCount: number;
  cashInHandKd: number;
  salesByMethod: Record<PosPaymentMethod, number>;
}) {
  const { t } = useLocale();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
      <div className="w-full max-w-md rounded-3xl bg-white shadow-2xl overflow-hidden border border-neutral-200">
        <div className="flex items-center justify-between border-b border-neutral-200 bg-neutral-950 p-4 text-white">
          <div className="flex items-center gap-2">
            <Receipt className="h-5 w-5 text-[#FDCE0C]" />
            <h3 className="text-base font-bold">{t.posScreen.endOfDay}</h3>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-neutral-400 hover:bg-neutral-800 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 space-y-4 text-xs">
          <div className="rounded-2xl bg-neutral-50 p-3.5 border border-neutral-200 space-y-1">
            <div className="flex justify-between">
              <span className="text-neutral-500">{t.posScreen.branch}:</span>
              <span className="font-bold">{branchName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-500">{t.posScreen.cashier}:</span>
              <span className="font-bold">{cashierName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-500">{t.posScreen.currentShift}:</span>
              <span className="font-bold">{t.posScreen.shift1}</span>
            </div>
          </div>

          <div className="space-y-2 border-t border-b border-neutral-200 py-3">
            <div className="flex justify-between font-medium">
              <span className="text-neutral-600">{t.posScreen.todaySales}</span>
              <span className="numeric-ltr font-bold text-neutral-950">
                {formatKD(todaySalesKd)} KD
              </span>
            </div>
            <div className="flex justify-between font-medium">
              <span className="text-neutral-600">{t.posScreen.transactions}</span>
              <span className="numeric-ltr font-bold text-neutral-950">
                {transactionsCount}
              </span>
            </div>
            <div className="flex justify-between font-medium">
              <span className="text-neutral-600">{t.posScreen.cashInHand}</span>
              <span className="numeric-ltr font-bold text-emerald-700">
                {formatKD(cashInHandKd)} KD
              </span>
            </div>
          </div>

          {/* Payment Methods Breakdown */}
          <div className="space-y-1.5">
            <h4 className="text-[11px] font-bold uppercase tracking-wider text-neutral-400">
              Sales by Payment Method
            </h4>
            {(
              [
                { id: "cash", label: t.posScreen.cash },
                { id: "knet", label: t.posScreen.knet },
                { id: "card", label: t.posScreen.card },
                { id: "credit", label: t.posScreen.credit },
                { id: "tabby", label: t.posScreen.tabby },
              ] as const
            ).map((m) => (
              <div
                key={m.id}
                className="flex justify-between rounded-lg bg-neutral-50 px-2.5 py-1 text-neutral-700"
              >
                <span>{m.label}</span>
                <span className="numeric-ltr font-bold">
                  {formatKD(salesByMethod[m.id] ?? 0)} KD
                </span>
              </div>
            ))}
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl bg-neutral-950 px-5 py-2 text-xs font-bold text-white hover:bg-black"
            >
              {t.posScreen.done}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
