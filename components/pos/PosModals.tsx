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
  Truck,
  History,
  ShieldAlert,
  Gift,
  Lock,
} from "lucide-react";
import { useLocale } from "@/lib/i18n/LocaleContext";
import type { Item, Customer, Branch } from "@/lib/types";
import type { Salesperson } from "@/lib/mock-data/salespersons";
import type { StockRequestRecord } from "@/lib/mock-data/stock-transfers";
import type { CartItemLine, PosPaymentMethod } from "./PosCartPanel";
import { formatKuwaitDateTime } from "@/lib/utils/kuwait-time";

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
  salespersonName?: string;
  customerName: string;
  fulfillmentMode?: "pickup" | "delivery";
  deliveryAddress?: string;
  deliveryFee?: number;
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
      <div className="flex max-h-[90vh] w-full max-w-md flex-col rounded-3xl bg-white shadow-2xl overflow-hidden border border-slate-200">
        <div className="flex items-center justify-between border-b border-slate-100 bg-[#0B1528] p-4 text-white">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-emerald-400" />
            <h3 className="text-base font-bold">{t.posScreen.saleComplete}</h3>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-800 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Printable Thermal Receipt Area */}
        <div className="flex-1 overflow-y-auto p-6 text-slate-800 font-mono text-xs space-y-4">
          <div className="text-center space-y-1">
            <h2 className="text-base font-extrabold tracking-wider text-black">
              BIN ESSA POS
            </h2>
            <p className="text-slate-500 font-sans">{sale.branchName}</p>
            <p className="text-[11px] text-slate-400 font-sans">
              Invoice #{sale.invoiceNumber}
            </p>
            <p className="text-[11px] text-slate-400 font-sans">{sale.date}</p>
          </div>

          <div className="border-t border-b border-dashed border-slate-300 py-2 space-y-1 text-[11px] font-sans">
            <div className="flex justify-between">
              <span className="text-slate-500">{t.posScreen.cashier}:</span>
              <span className="font-semibold">{sale.cashierName}</span>
            </div>
            {sale.salespersonName && (
              <div className="flex justify-between">
                <span className="text-slate-500">{locale === "ar" ? "البائع:" : "Seller:"}</span>
                <span className="font-semibold">{sale.salespersonName}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-slate-500">{t.posScreen.customer}:</span>
              <span className="font-semibold">{sale.customerName}</span>
            </div>
            {sale.fulfillmentMode === "delivery" && sale.deliveryAddress && (
              <div className="flex justify-between">
                <span className="text-slate-500">{locale === "ar" ? "التوصيل:" : "Delivery:"}</span>
                <span className="font-semibold truncate max-w-[200px]">{sale.deliveryAddress}</span>
              </div>
            )}
          </div>

          {/* Items Table */}
          <div className="space-y-1.5 pt-1">
            <div className="flex justify-between font-bold text-slate-500 text-[11px] border-b border-slate-200 pb-1">
              <span>Item / Qty</span>
              <span>Total</span>
            </div>
            {sale.lines.map(({ item, qty, isGift }) => {
              const lineRate = isGift ? 0 : item.sellPriceKd;
              return (
                <div key={item.id} className="flex justify-between text-xs py-0.5">
                  <div className="min-w-0 pr-2">
                    <p className="font-medium truncate">
                      {locale === "ar" ? item.nameAr : item.nameEn}
                    </p>
                    <p className="text-[10px] text-slate-500 numeric-ltr">
                      {qty} × {formatKD(lineRate)} KD {isGift ? "(Free Gift)" : ""}
                    </p>
                  </div>
                  <span className="numeric-ltr font-bold text-slate-900 shrink-0">
                    {formatKD(lineRate * qty)} KD
                  </span>
                </div>
              );
            })}
          </div>

          {/* Totals */}
          <div className="border-t border-dashed border-slate-300 pt-3 space-y-1 text-xs font-sans">
            <div className="flex justify-between text-slate-600">
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
            {sale.deliveryFee && sale.deliveryFee > 0 && (
              <div className="flex justify-between text-slate-600">
                <span>{locale === "ar" ? "رسوم التوصيل" : "Delivery Fee"}</span>
                <span className="numeric-ltr font-medium">
                  {formatKD(sale.deliveryFee)} KD
                </span>
              </div>
            )}
            <div className="flex justify-between text-slate-600">
              <span>{t.posScreen.tax}</span>
              <span className="numeric-ltr font-medium">
                {formatKD(sale.tax)} KD
              </span>
            </div>
            <div className="flex justify-between text-sm font-extrabold border-t border-slate-300 pt-2 text-black font-mono">
              <span>{t.posScreen.total}</span>
              <span className="numeric-ltr">{formatKD(sale.total)} KD</span>
            </div>

            <div className="flex justify-between text-[11px] text-slate-600 pt-1">
              <span>{t.posScreen.paymentMethod}</span>
              <span className="uppercase font-bold">{sale.paymentMethod}</span>
            </div>
            {sale.paymentMethod === "cash" && sale.cashReceived !== undefined && (
              <>
                <div className="flex justify-between text-[11px] text-slate-600">
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

          <div className="text-center pt-2 text-[11px] text-slate-400 font-sans">
            <p>Thank you for shopping with Bin Essa!</p>
            <p>شكراً لزيارتكم</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 border-t border-slate-200 bg-slate-50 p-4">
          <button
            type="button"
            onClick={() => window.print()}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white py-2.5 text-xs font-bold text-slate-800 hover:bg-slate-100"
          >
            <Printer className="h-4 w-4" />
            <span>{t.posScreen.printReceipt}</span>
          </button>

          <button
            type="button"
            onClick={onNewSale}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#2563EB] py-2.5 text-xs font-bold text-white hover:bg-blue-700"
          >
            <span>{t.posScreen.newSale}</span>
          </button>
        </div>
      </div>
    </div>
  );
}

// 2. HELD SALES MODAL
export interface HeldSaleRecord {
  id: string;
  heldAt: string;
  customerName: string;
  salespersonName?: string;
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
      <div className="flex max-h-[85vh] w-full max-w-lg flex-col rounded-3xl bg-white shadow-2xl overflow-hidden border border-slate-200">
        <div className="flex items-center justify-between border-b border-slate-200 bg-[#0B1528] p-4 text-white">
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-[#38BDF8]" />
            <h3 className="text-base font-bold">{t.posScreen.heldSales}</h3>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-800 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-2.5">
          {heldSales.length === 0 ? (
            <div className="py-12 text-center text-slate-400">
              <Clock className="mx-auto h-8 w-8 text-slate-300 mb-2" />
              <p className="text-sm font-medium">{t.posScreen.noHeldSales}</p>
            </div>
          ) : (
            heldSales.map((h) => (
              <div
                key={h.id}
                className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50/70 p-3.5 hover:border-slate-300"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-900">
                      {h.customerName}
                    </span>
                    <span className="text-[11px] text-slate-400">
                      • {h.heldAt}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {h.cartLines.length} {t.posScreen.itemsCount} (
                    {h.cartLines.map((l) => l.item.nameEn).join(", ")})
                  </p>
                  <p className="numeric-ltr text-xs font-extrabold text-slate-950 mt-1">
                    {formatKD(h.total)} KD
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => onRecallSale(h)}
                    className="flex items-center gap-1 rounded-xl bg-[#2563EB] px-3 py-1.5 text-xs font-bold text-white hover:bg-blue-700"
                  >
                    <span>{t.posScreen.recall}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => onDeleteHeldSale(h.id)}
                    className="rounded-lg p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-600"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="border-t border-slate-200 bg-slate-50 p-3 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-100"
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
      <div className="w-full max-w-md rounded-3xl bg-white shadow-2xl overflow-hidden border border-slate-200">
        <div className="flex items-center justify-between border-b border-slate-200 bg-[#0B1528] p-4 text-white">
          <div className="flex items-center gap-2">
            <ScanBarcode className="h-5 w-5 text-[#38BDF8]" />
            <h3 className="text-base font-bold">{t.posScreen.barcodeScan}</h3>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-800 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              {t.posScreen.scanPrompt}
            </label>
            <div className="relative">
              <ScanBarcode className="absolute start-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                autoFocus
                value={code}
                onChange={(e) => {
                  setCode(e.target.value);
                  setError(false);
                }}
                placeholder="e.g. 6281234500019 or VP-IQ-TRY-001"
                className="numeric-ltr w-full rounded-xl border border-slate-300 ps-10 pe-4 py-2.5 text-sm font-semibold outline-none focus:border-[#2563EB]"
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
              className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-100"
            >
              {t.posScreen.close}
            </button>
            <button
              type="submit"
              className="rounded-xl bg-[#2563EB] px-5 py-2 text-xs font-bold text-white hover:bg-blue-700"
            >
              {t.posScreen.addToCart}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// 4. CUSTOMER MODAL
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
      <div className="flex max-h-[85vh] w-full max-w-md flex-col rounded-3xl bg-white shadow-2xl overflow-hidden border border-slate-200">
        <div className="flex items-center justify-between border-b border-slate-200 bg-[#0B1528] p-4 text-white">
          <div className="flex items-center gap-2">
            <User className="h-5 w-5 text-[#38BDF8]" />
            <h3 className="text-base font-bold">{t.posScreen.selectCustomer}</h3>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-800 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-3 border-b border-slate-200">
          <div className="relative">
            <Search className="absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search customer name..."
              className="w-full rounded-xl border border-slate-300 ps-9 pe-3 py-2 text-xs outline-none focus:border-[#2563EB]"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-3 space-y-1.5">
          <button
            type="button"
            onClick={() => {
              onSelectCustomer(null);
              onClose();
            }}
            className={`flex w-full items-center justify-between rounded-xl p-3 text-start border transition-colors ${
              selectedCustomerId === null
                ? "bg-blue-50 border-blue-600 text-blue-900"
                : "bg-slate-50 text-slate-800 border-slate-200 hover:bg-slate-100"
            }`}
          >
            <div>
              <p className="text-xs font-bold">{locale === "ar" ? "عميل نقدي مباشر" : "Walk-in Customer"}</p>
              <p className="text-[11px] text-slate-400">Default retail cash sale</p>
            </div>
            {selectedCustomerId === null && (
              <CheckCircle2 className="h-4 w-4 text-blue-600" />
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
                    ? "bg-blue-50 border-blue-600 text-blue-900"
                    : "bg-white text-slate-800 border-slate-200 hover:bg-slate-50"
                }`}
              >
                <div>
                  <p className="text-xs font-bold">{name}</p>
                  <p className="text-[11px] text-slate-500 capitalize">
                    {c.customerType} • Limit: {formatKD(c.creditLimitKd)} KD
                  </p>
                </div>
                {isSelected && (
                  <CheckCircle2 className="h-4 w-4 text-blue-600" />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// 5. SALESPERSON SELECTOR MODAL
export function PosSalespersonModal({
  isOpen,
  onClose,
  salespersons,
  selectedSalespersonId,
  onSelectSalesperson,
}: {
  isOpen: boolean;
  onClose: () => void;
  salespersons: Salesperson[];
  selectedSalespersonId: string | null;
  onSelectSalesperson: (sp: Salesperson) => void;
}) {
  const { locale } = useLocale();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
      <div className="w-full max-w-sm rounded-3xl bg-white shadow-2xl overflow-hidden border border-slate-200">
        <div className="flex items-center justify-between border-b border-slate-200 bg-[#0B1528] p-4 text-white">
          <div className="flex items-center gap-2">
            <User className="h-5 w-5 text-[#38BDF8]" />
            <h3 className="text-base font-bold">
              {locale === "ar" ? "اختيار مندوب المبيعات" : "Select Salesperson"}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-800 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-3 space-y-1.5 max-h-72 overflow-y-auto">
          {salespersons.map((sp) => {
            const isSelected = selectedSalespersonId === sp.id;
            const name = locale === "ar" ? sp.nameAr : sp.nameEn;

            return (
              <button
                key={sp.id}
                type="button"
                onClick={() => {
                  onSelectSalesperson(sp);
                  onClose();
                }}
                className={`flex w-full items-center justify-between rounded-xl p-3 text-start border transition-colors ${
                  isSelected
                    ? "bg-blue-50 border-blue-600 text-blue-900"
                    : "bg-white text-slate-800 border-slate-200 hover:bg-slate-50"
                }`}
              >
                <div>
                  <p className="text-xs font-bold">{name}</p>
                  <p className="text-[11px] text-slate-500">Code: {sp.code}</p>
                </div>
                {isSelected && (
                  <CheckCircle2 className="h-4 w-4 text-blue-600" />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// 6. ADD GIFT ITEM MODAL
export function PosAddGiftModal({
  isOpen,
  onClose,
  items,
  onSelectGiftItem,
}: {
  isOpen: boolean;
  onClose: () => void;
  items: Item[];
  onSelectGiftItem: (item: Item) => void;
}) {
  const { locale } = useLocale();
  const [search, setSearch] = useState("");

  if (!isOpen) return null;

  const filtered = items.filter((i) => {
    const q = search.trim().toLowerCase();
    if (!q) return true;
    return (
      i.nameEn.toLowerCase().includes(q) ||
      i.nameAr.includes(q) ||
      i.sku.toLowerCase().includes(q)
    );
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
      <div className="flex max-h-[85vh] w-full max-w-md flex-col rounded-3xl bg-white shadow-2xl overflow-hidden border border-slate-200">
        <div className="flex items-center justify-between border-b border-slate-200 bg-[#0B1528] p-4 text-white">
          <div className="flex items-center gap-2">
            <Gift className="h-5 w-5 text-[#38BDF8]" />
            <h3 className="text-base font-bold">
              {locale === "ar" ? "إضافة صنف هدية (خصم 100%)" : "Add Gift Item (100% Free)"}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-800 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-3 border-b border-slate-200">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search promotional gift items..."
            className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs outline-none focus:border-[#2563EB]"
          />
        </div>

        <div className="flex-1 overflow-y-auto p-3 space-y-1.5">
          {filtered.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => {
                onSelectGiftItem(item);
                onClose();
              }}
              className="flex w-full items-center justify-between rounded-xl p-2.5 text-start border border-slate-200 bg-white hover:bg-slate-50"
            >
              <div>
                <p className="text-xs font-bold text-slate-900">
                  {locale === "ar" ? item.nameAr : item.nameEn}
                </p>
                <p className="text-[11px] text-slate-500">Regular: {formatKD(item.sellPriceKd)} KD</p>
              </div>
              <span className="rounded-lg bg-emerald-100 text-emerald-800 font-bold px-2 py-1 text-[10px]">
                + Free Gift
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// 7. STOCK REQUESTS & TRANSFER MODAL (Stock Request from Warehouse + Request History)
export function PosStockRequestsModal({
  isOpen,
  onClose,
  requests,
  onCreateNewRequest,
}: {
  isOpen: boolean;
  onClose: () => void;
  requests: StockRequestRecord[];
  onCreateNewRequest: (data: { itemsSummary: string; count: number }) => void;
}) {
  const { locale } = useLocale();
  const [showNewForm, setShowNewForm] = useState(false);
  const [itemsText, setItemsText] = useState("");
  const [qty, setQty] = useState(10);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
      <div className="flex max-h-[90vh] w-full max-w-3xl flex-col rounded-3xl bg-white shadow-2xl overflow-hidden border border-slate-200">
        <div className="flex items-center justify-between border-b border-slate-200 bg-[#0B1528] p-4 text-white">
          <div className="flex items-center gap-2">
            <Truck className="h-5 w-5 text-[#38BDF8]" />
            <h3 className="text-base font-bold">
              {locale === "ar" ? "طلبات البضاعة من المخزن الرئيسي" : "Stock Request from Main Warehouse"}
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowNewForm((prev) => !prev)}
              className="rounded-xl bg-[#2563EB] px-3 py-1.5 text-xs font-bold text-white hover:bg-blue-700"
            >
              + {locale === "ar" ? "طلب جديد" : "New Request"}
            </button>
            <button
              onClick={onClose}
              className="rounded-lg p-1 text-slate-400 hover:bg-slate-800 hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {showNewForm && (
          <div className="p-4 bg-blue-50/60 border-b border-blue-100 space-y-3">
            <h4 className="font-bold text-slate-900 text-xs">
              {locale === "ar" ? "إنشاء طلب بضاعة جديد من المخزن الرئيسي" : "Create New Stock Request from Shuwaikh Warehouse"}
            </h4>
            <div className="grid grid-cols-3 gap-2">
              <div className="col-span-2">
                <input
                  type="text"
                  value={itemsText}
                  onChange={(e) => setItemsText(e.target.value)}
                  placeholder="e.g. 50x Tropical Mix 6000 Puffs, 20x Clipper Lighters"
                  className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs outline-none focus:border-[#2563EB] bg-white"
                />
              </div>
              <div>
                <button
                  type="button"
                  onClick={() => {
                    if (!itemsText.trim()) return;
                    onCreateNewRequest({ itemsSummary: itemsText, count: qty });
                    setItemsText("");
                    setShowNewForm(false);
                  }}
                  className="w-full rounded-xl bg-[#2563EB] py-2 text-xs font-bold text-white hover:bg-blue-700"
                >
                  {locale === "ar" ? "إرسال للمخزن" : "Submit to Warehouse"}
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="flex-1 overflow-y-auto p-4">
          <table className="w-full text-start text-xs">
            <thead className="border-b border-slate-200 bg-slate-50 font-bold text-slate-600">
              <tr>
                <th className="py-2.5 px-3">REQUEST NO</th>
                <th className="py-2.5 px-3">DATE</th>
                <th className="py-2.5 px-3">ITEMS</th>
                <th className="py-2.5 px-3">DESTINATION</th>
                <th className="py-2.5 px-3 text-center">STATUS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {requests.map((r) => (
                <tr key={r.id} className="hover:bg-slate-50">
                  <td className="py-2.5 px-3 font-mono font-bold text-blue-700">
                    {r.requestNo}
                  </td>
                  <td className="py-2.5 px-3 text-slate-500 font-sans">
                    {r.date}
                  </td>
                  <td className="py-2.5 px-3 text-slate-900">
                    <span className="font-bold">{r.itemsCount} items</span> ({r.itemsSummary})
                  </td>
                  <td className="py-2.5 px-3 text-slate-600">
                    {r.toBranch}
                  </td>
                  <td className="py-2.5 px-3 text-center">
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold ${
                        r.status === "Pending"
                          ? "bg-amber-100 text-amber-800"
                          : r.status === "Approved"
                          ? "bg-blue-100 text-blue-800"
                          : r.status === "Prepared"
                          ? "bg-purple-100 text-purple-800"
                          : "bg-emerald-100 text-emerald-800"
                      }`}
                    >
                      {r.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// 8. CURRENT SHIFT & CLOSE SHIFT (F10) MODAL
export function PosCurrentShiftModal({
  isOpen,
  onClose,
  cashierName,
  salespersonName,
  todaySalesKd,
  salesByMethod,
  onCloseShift,
}: {
  isOpen: boolean;
  onClose: () => void;
  cashierName: string;
  salespersonName: string;
  todaySalesKd: number;
  salesByMethod: Record<PosPaymentMethod, number>;
  onCloseShift: () => void;
}) {
  const { locale } = useLocale();

  if (!isOpen) return null;

  const cashSales = salesByMethod.cash ?? 0;
  const knetSales = salesByMethod.knet ?? 0;
  const hesabiSales = salesByMethod.hesabi ?? 0;
  const tabbySales = salesByMethod.tabby ?? 0;
  const creditSales = salesByMethod.credit ?? 0;
  const openingCash = 100.0;
  const expectedCash = openingCash + cashSales;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
      <div className="w-full max-w-xl rounded-3xl bg-white shadow-2xl overflow-hidden border border-slate-200 text-xs">
        <div className="flex items-center justify-between border-b border-slate-200 bg-[#0B1528] p-4 text-white">
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-[#38BDF8]" />
            <h3 className="text-base font-bold">
              {locale === "ar" ? "الوردية الحالية (مسائي) - مفتوح" : "Current Shift (Evening) - OPEN"}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-800 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4 rounded-2xl bg-slate-50 p-4 border border-slate-200">
            <div>
              <p className="text-slate-500">Shift:</p>
              <p className="font-bold text-slate-900 text-sm">Evening Shift</p>
              <p className="text-slate-500 mt-2">Cashier (User):</p>
              <p className="font-bold text-slate-900">{cashierName || "Ahmed"}</p>
            </div>
            <div>
              <p className="text-slate-500">Salesperson (Seller):</p>
              <p className="font-bold text-slate-900">{salespersonName || "Mohamed Ali"}</p>
              <p className="text-slate-500 mt-2">Start Time / Opening Float:</p>
              <p className="font-bold text-slate-900">100.000 KD Opening Cash</p>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 p-4 space-y-2">
            <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider">
              {locale === "ar" ? "ملخص مبيعات الوردية" : "Sales Summary (This Shift)"}
            </h4>
            <div className="grid grid-cols-2 gap-2 text-slate-600">
              <div className="flex justify-between">
                <span>Total Sales:</span>
                <span className="font-bold text-slate-900">{formatKD(todaySalesKd)} KD</span>
              </div>
              <div className="flex justify-between">
                <span>Cash Sales:</span>
                <span className="font-bold text-slate-900">{formatKD(cashSales)} KD</span>
              </div>
              <div className="flex justify-between">
                <span>KNET:</span>
                <span className="font-bold text-slate-900">{formatKD(knetSales)} KD</span>
              </div>
              <div className="flex justify-between">
                <span>Hesabi:</span>
                <span className="font-bold text-slate-900">{formatKD(hesabiSales)} KD</span>
              </div>
              <div className="flex justify-between">
                <span>Tabby:</span>
                <span className="font-bold text-slate-900">{formatKD(tabbySales)} KD</span>
              </div>
              <div className="flex justify-between">
                <span>Credit (آجل):</span>
                <span className="font-bold text-slate-900">{formatKD(creditSales)} KD</span>
              </div>
              <div className="flex justify-between col-span-2 border-t border-slate-200 pt-2 font-black text-blue-700 text-sm">
                <span>Expected Cash in Drawer:</span>
                <span>{formatKD(expectedCash)} KD</span>
              </div>
            </div>
          </div>

          <div className="flex gap-2 justify-end pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-slate-300 bg-white px-4 py-2 font-bold text-slate-700 hover:bg-slate-50"
            >
              Close
            </button>
            <button
              type="button"
              onClick={() => {
                onCloseShift();
                onClose();
              }}
              className="rounded-xl bg-[#2563EB] px-5 py-2 font-bold text-white hover:bg-blue-700 shadow-md"
            >
              {locale === "ar" ? "إغلاق الوردية (F10)" : "Close Shift (F10)"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// 9. DAILY CLOSING MODAL (F11)
export function PosDailyClosingModal({
  isOpen,
  onClose,
  totalSalesKd,
  totalCashKd,
  totalKnetKd,
  totalHesabiKd,
  onCloseDay,
}: {
  isOpen: boolean;
  onClose: () => void;
  totalSalesKd: number;
  totalCashKd: number;
  totalKnetKd: number;
  totalHesabiKd: number;
  onCloseDay: () => void;
}) {
  const { locale } = useLocale();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
      <div className="w-full max-w-md rounded-3xl bg-white shadow-2xl overflow-hidden border border-slate-200 text-xs">
        <div className="flex items-center justify-between border-b border-slate-200 bg-[#0B1528] p-4 text-white">
          <div className="flex items-center gap-2">
            <Lock className="h-5 w-5 text-[#38BDF8]" />
            <h3 className="text-base font-bold">
              {locale === "ar" ? "إقفال اليومية للفرع" : "Daily Closing (Branch)"}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-800 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div className="rounded-2xl bg-slate-50 p-4 border border-slate-200 space-y-2">
            <div className="flex justify-between">
              <span className="text-slate-500">Date:</span>
              <span className="font-bold text-slate-900">09/08/2026</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Total Shifts Today:</span>
              <span className="font-bold text-slate-900">2 Shifts</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Total Sales:</span>
              <span className="font-black text-slate-900 text-sm">{formatKD(totalSalesKd)} KD</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Total Cash:</span>
              <span className="font-bold text-emerald-700">{formatKD(totalCashKd)} KD</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Total KNET:</span>
              <span className="font-bold text-blue-700">{formatKD(totalKnetKd)} KD</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Total Hesabi:</span>
              <span className="font-bold text-purple-700">{formatKD(totalHesabiKd)} KD</span>
            </div>
          </div>

          <div className="flex gap-2 justify-end pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-slate-300 bg-white px-4 py-2 font-bold text-slate-700 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => {
                onCloseDay();
                onClose();
              }}
              className="rounded-xl bg-[#2563EB] px-5 py-2 font-bold text-white hover:bg-blue-700 shadow-md"
            >
              {locale === "ar" ? "إقفال اليومية (F11)" : "Close Day (F11)"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// 10. STOCK SUMMARY LOOKUP MODAL
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
      <div className="flex max-h-[90vh] w-full max-w-2xl flex-col rounded-3xl bg-white shadow-2xl overflow-hidden border border-slate-200">
        <div className="flex items-center justify-between border-b border-slate-200 bg-[#0B1528] p-4 text-white">
          <div className="flex items-center gap-2">
            <Boxes className="h-5 w-5 text-[#38BDF8]" />
            <h3 className="text-base font-bold">{t.posScreen.stockLookup}</h3>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-800 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-4 border-b border-slate-200 bg-slate-50">
          <div className="relative">
            <Search className="absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t.posScreen.searchPlaceholder}
              className="w-full rounded-xl border border-slate-300 ps-9 pe-3 py-2 text-xs outline-none focus:border-[#2563EB]"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="rounded-2xl border border-slate-200 p-3.5 space-y-2 hover:border-slate-300"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-slate-900">
                    {locale === "ar" ? item.nameAr : item.nameEn}
                  </h4>
                  <p className="numeric-ltr text-[11px] text-slate-400">
                    {item.sku} • {item.barcode}
                  </p>
                </div>
                <span className="numeric-ltr text-xs font-black text-blue-700">
                  {formatKD(item.sellPriceKd)} KD
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 pt-1 text-[11px]">
                {branches.slice(0, 6).map((b) => {
                  const qty = item.stockByBranch[b.id] ?? 0;
                  return (
                    <div
                      key={b.id}
                      className="flex items-center justify-between rounded-lg bg-slate-50 px-2 py-1 border border-slate-200/60"
                    >
                      <span className="truncate text-slate-600">
                        {locale === "ar" ? b.nameAr : b.nameEn}
                      </span>
                      <span
                        className={`numeric-ltr font-bold ${
                          qty > 0 ? "text-slate-900" : "text-red-500"
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
