"use client";

import { useState } from "react";
import {
  Trash2,
  User,
  ShoppingBag,
  CreditCard,
  Banknote,
  Smartphone,
  Layers,
  Gift,
  Printer,
  PauseCircle,
  Truck,
  Building2,
  CheckCircle2,
  SlidersHorizontal,
  ChevronDown,
  ChevronUp,
  FileText,
  Percent,
} from "lucide-react";
import { useLocale } from "@/lib/i18n/LocaleContext";
import type { Item, Customer } from "@/lib/types";
import type { Salesperson } from "@/lib/mock-data/salespersons";

export type PosInvoiceType = "cash" | "credit";
export type PosPaymentMethod = "cash" | "knet" | "hesabi" | "tabby" | "card" | "credit";
export type PosFulfillmentMode = "pickup" | "delivery";

export interface CartItemLine {
  item: Item;
  qty: number;
  discountKd?: number;
  isGift?: boolean;
}

interface PosCartPanelProps {
  cartLines: CartItemLine[];
  onUpdateQty: (itemId: string, qty: number) => void;
  onRemoveItem: (itemId: string) => void;
  onClearCart: () => void;
  onAddGiftItem: () => void;
  selectedCustomer: Customer | null;
  onOpenCustomerModal: () => void;
  selectedSalesperson: Salesperson | null;
  onOpenSalespersonModal: () => void;
  fulfillmentMode: PosFulfillmentMode;
  onFulfillmentModeChange: (mode: PosFulfillmentMode) => void;
  deliveryAddress: string;
  onDeliveryAddressChange: (addr: string) => void;
  deliveryFee: number;
  invoiceType: PosInvoiceType;
  onInvoiceTypeChange: (type: PosInvoiceType) => void;
  paymentMethod: PosPaymentMethod;
  onPaymentMethodChange: (method: PosPaymentMethod) => void;
  discountPct: number;
  onDiscountPctChange: (pct: number) => void;
  subtotal: number;
  itemDiscountsTotal: number;
  invoiceDiscountAmount: number;
  taxAmount: number;
  total: number;
  cashReceived: number;
  onCashReceivedChange: (amt: number) => void;
  orderNote: string;
  onOrderNoteChange: (note: string) => void;
  onCheckout: () => void;
  onHoldSale: () => void;
  isProcessing: boolean;
}

function formatKD(amount: number) {
  return amount.toLocaleString("en-US", {
    minimumFractionDigits: 3,
    maximumFractionDigits: 3,
  });
}

export function PosCartPanel({
  cartLines,
  onUpdateQty,
  onRemoveItem,
  onClearCart,
  onAddGiftItem,
  selectedCustomer,
  onOpenCustomerModal,
  selectedSalesperson,
  onOpenSalespersonModal,
  fulfillmentMode,
  onFulfillmentModeChange,
  deliveryAddress,
  onDeliveryAddressChange,
  deliveryFee,
  invoiceType,
  onInvoiceTypeChange,
  paymentMethod,
  onPaymentMethodChange,
  discountPct,
  onDiscountPctChange,
  subtotal,
  itemDiscountsTotal,
  invoiceDiscountAmount,
  taxAmount,
  total,
  cashReceived,
  onCashReceivedChange,
  orderNote,
  onOrderNoteChange,
  onCheckout,
  onHoldSale,
  isProcessing,
}: PosCartPanelProps) {
  const { locale, t } = useLocale();
  const [showOptions, setShowOptions] = useState(false);

  const changeDue = Math.max(0, cashReceived - total);
  const isCash = paymentMethod === "cash";
  const isCartEmpty = cartLines.length === 0;
  const canCheckout = !isCartEmpty;
  const totalItemsCount = cartLines.reduce((sum, l) => sum + l.qty, 0);

  const custLabel = selectedCustomer
    ? locale === "ar"
      ? selectedCustomer.nameAr
      : selectedCustomer.nameEn
    : locale === "ar"
    ? "عميل نقدي"
    : "Walk-in Customer";

  const sellerLabel = selectedSalesperson
    ? locale === "ar"
      ? selectedSalesperson.nameAr
      : selectedSalesperson.nameEn
    : "Mohamed Ali";

  const hasActiveOptions =
    discountPct > 0 ||
    fulfillmentMode === "delivery" ||
    invoiceType === "credit" ||
    orderNote.trim().length > 0;

  return (
    <div className="flex h-full w-full flex-col justify-between overflow-hidden bg-white border-s border-slate-200 shadow-sm select-none text-xs">
      {/* 1. Header: Compact Customer & Seller Selectors */}
      <div className="border-b border-slate-200 bg-slate-50/80 p-2.5">
        <div className="grid grid-cols-2 gap-2">
          {/* Customer Selector */}
          <button
            type="button"
            onClick={onOpenCustomerModal}
            className="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-2.5 py-1.5 text-start shadow-2xs hover:border-[#2563EB] transition-colors"
          >
            <div className="flex items-center gap-1.5 min-w-0">
              <User className="h-3.5 w-3.5 text-slate-400 shrink-0" />
              <div className="min-w-0">
                <p className="text-[10px] font-semibold text-slate-400 leading-none">
                  {locale === "ar" ? "العميل" : "Customer"}
                </p>
                <p className="truncate text-xs font-bold text-slate-900 mt-0.5">
                  {custLabel}
                </p>
              </div>
            </div>
            <span className="text-[10px] font-bold text-blue-600 shrink-0">
              {locale === "ar" ? "تغيير" : "Change"}
            </span>
          </button>

          {/* Salesperson Selector */}
          <button
            type="button"
            onClick={onOpenSalespersonModal}
            className="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-2.5 py-1.5 text-start shadow-2xs hover:border-[#2563EB] transition-colors"
          >
            <div className="flex items-center gap-1.5 min-w-0">
              <User className="h-3.5 w-3.5 text-slate-400 shrink-0" />
              <div className="min-w-0">
                <p className="text-[10px] font-semibold text-slate-400 leading-none">
                  {locale === "ar" ? "البائع" : "Seller"}
                </p>
                <p className="truncate text-xs font-bold text-slate-900 mt-0.5">
                  {sellerLabel}
                </p>
              </div>
            </div>
            <span className="text-[10px] font-bold text-blue-600 shrink-0">
              {locale === "ar" ? "تغيير" : "Change"}
            </span>
          </button>
        </div>
      </div>

      {/* 2. Middle: Cart Items Table (Compact & Scrollable) */}
      <div className="flex-1 overflow-y-auto p-2.5 space-y-2">
        <div className="flex items-center justify-between px-0.5">
          <span className="font-bold text-slate-900 text-xs">
            {locale === "ar" ? "عناصر السلة" : "Cart Items"} ({totalItemsCount})
          </span>
          {!isCartEmpty && (
            <button
              type="button"
              onClick={onClearCart}
              className="flex items-center gap-1 text-[11px] font-bold text-red-500 hover:text-red-700"
            >
              <Trash2 className="h-3 w-3" />
              <span>{t.posScreen.clearCart}</span>
            </button>
          )}
        </div>

        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-2xs">
          <table className="w-full text-start text-xs">
            <thead className="border-b border-slate-200 bg-slate-50/90 font-bold text-slate-600 text-[11px]">
              <tr>
                <th className="py-2 ps-2.5 pe-1">{locale === "ar" ? "الصنف" : "Item"}</th>
                <th className="py-2 px-1 text-center">{locale === "ar" ? "الكمية" : "Qty"}</th>
                <th className="py-2 px-1 text-end">{locale === "ar" ? "السعر" : "Price"}</th>
                <th className="py-2 px-1 text-end">{locale === "ar" ? "المجموع" : "Total"}</th>
                <th className="py-2 pe-2 ps-1 text-center w-6"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isCartEmpty ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-slate-400 font-medium">
                    <ShoppingBag className="mx-auto h-6 w-6 text-slate-300 mb-1" />
                    <span>{t.posScreen.emptyCart}</span>
                  </td>
                </tr>
              ) : (
                cartLines.map(({ item, qty, isGift }) => {
                  const lineRate = isGift ? 0 : item.sellPriceKd;
                  const lineTotal = lineRate * qty;
                  const itemName = locale === "ar" ? item.nameAr : item.nameEn;

                  return (
                    <tr key={item.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-2 ps-2.5 pe-1 font-bold text-slate-900 leading-tight">
                        <p className="line-clamp-1">{itemName}</p>
                        {isGift && (
                          <span className="inline-block rounded bg-amber-100 text-amber-800 px-1 text-[9px] font-extrabold uppercase mt-0.5">
                            Free Gift
                          </span>
                        )}
                      </td>
                      <td className="py-2 px-1 text-center">
                        <div className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-slate-50 px-1 py-0.5">
                          <button
                            type="button"
                            onClick={() => onUpdateQty(item.id, qty - 1)}
                            className="text-slate-600 hover:text-black font-bold h-4 w-4 flex items-center justify-center"
                          >
                            -
                          </button>
                          <span className="numeric-ltr font-bold text-slate-900 px-1 text-[11px]">
                            {qty}
                          </span>
                          <button
                            type="button"
                            onClick={() => onUpdateQty(item.id, qty + 1)}
                            className="text-slate-600 hover:text-black font-bold h-4 w-4 flex items-center justify-center"
                          >
                            +
                          </button>
                        </div>
                      </td>
                      <td className="py-2 px-1 text-end numeric-ltr font-semibold text-slate-600">
                        {formatKD(lineRate)}
                      </td>
                      <td className="py-2 px-1 text-end numeric-ltr font-bold text-blue-700">
                        {formatKD(lineTotal)}
                      </td>
                      <td className="py-2 pe-2 ps-1 text-center">
                        <button
                          type="button"
                          onClick={() => onRemoveItem(item.id)}
                          className="text-slate-300 hover:text-red-500"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* 3. Collapsible "Order Options" (Discount, Delivery, Gift Item, Notes) */}
        <div className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-2xs">
          <button
            type="button"
            onClick={() => setShowOptions((prev) => !prev)}
            className="flex w-full items-center justify-between px-3 py-2 text-start font-bold text-slate-700 bg-slate-50/70 hover:bg-slate-100 transition-colors"
          >
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="h-3.5 w-3.5 text-blue-600" />
              <span>{locale === "ar" ? "خيارات الطلب (خصم / توصيل / ملاحظات)" : "Order Options"}</span>
              {hasActiveOptions && (
                <span className="rounded-full bg-blue-100 text-blue-800 px-1.5 py-0.2 text-[9px] font-extrabold">
                  Active
                </span>
              )}
            </div>
            {showOptions ? (
              <ChevronUp className="h-4 w-4 text-slate-400" />
            ) : (
              <ChevronDown className="h-4 w-4 text-slate-400" />
            )}
          </button>

          {showOptions && (
            <div className="p-3 space-y-2.5 border-t border-slate-200 bg-white">
              {/* Row 1: Invoice Discount & Add Gift Item */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 mb-1">
                    {locale === "ar" ? "خصم الفاتورة %" : "Invoice Discount %"}
                  </label>
                  <div className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 p-1">
                    <button
                      type="button"
                      onClick={() => onDiscountPctChange(Math.max(0, discountPct - 1))}
                      className="flex h-5 w-5 items-center justify-center rounded bg-white border border-slate-200 font-bold hover:bg-slate-100"
                    >
                      -
                    </button>
                    <span className="numeric-ltr font-black text-slate-900 text-xs">
                      {discountPct}%
                    </span>
                    <button
                      type="button"
                      onClick={() => onDiscountPctChange(Math.min(10, discountPct + 1))}
                      className="flex h-5 w-5 items-center justify-center rounded bg-white border border-slate-200 font-bold hover:bg-slate-100"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-500 mb-1">
                    {locale === "ar" ? "صنف هدية ترويجي" : "Promo Gift Line"}
                  </label>
                  <button
                    type="button"
                    onClick={onAddGiftItem}
                    className="flex w-full h-7 items-center justify-center gap-1.5 rounded-lg border border-amber-300 bg-amber-50 text-amber-900 font-bold hover:bg-amber-100 text-[11px]"
                  >
                    <Gift className="h-3.5 w-3.5 text-amber-600" />
                    <span>{locale === "ar" ? "+ إضافة هدية" : "+ Add Gift"}</span>
                  </button>
                </div>
              </div>

              {/* Row 2: Fulfillment & Invoice Type */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 mb-1">
                    {locale === "ar" ? "طريقة التسليم" : "Fulfillment"}
                  </label>
                  <div className="grid grid-cols-2 gap-1 rounded-lg bg-slate-100 p-0.5 border border-slate-200">
                    <button
                      type="button"
                      onClick={() => onFulfillmentModeChange("pickup")}
                      className={`rounded py-1 text-[11px] font-bold transition-all ${
                        fulfillmentMode === "pickup"
                          ? "bg-white text-slate-900 shadow-2xs"
                          : "text-slate-600"
                      }`}
                    >
                      {locale === "ar" ? "استلام" : "Pickup"}
                    </button>
                    <button
                      type="button"
                      onClick={() => onFulfillmentModeChange("delivery")}
                      className={`rounded py-1 text-[11px] font-bold transition-all ${
                        fulfillmentMode === "delivery"
                          ? "bg-white text-slate-900 shadow-2xs"
                          : "text-slate-600"
                      }`}
                    >
                      {locale === "ar" ? "توصيل" : "Delivery"}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-500 mb-1">
                    {locale === "ar" ? "نوع الفاتورة" : "Invoice Type"}
                  </label>
                  <div className="grid grid-cols-2 gap-1 rounded-lg bg-slate-100 p-0.5 border border-slate-200">
                    <button
                      type="button"
                      onClick={() => onInvoiceTypeChange("cash")}
                      className={`rounded py-1 text-[11px] font-bold transition-all ${
                        invoiceType === "cash"
                          ? "bg-white text-slate-900 shadow-2xs"
                          : "text-slate-600"
                      }`}
                    >
                      {locale === "ar" ? "نقدي" : "Cash"}
                    </button>
                    <button
                      type="button"
                      onClick={() => onInvoiceTypeChange("credit")}
                      className={`rounded py-1 text-[11px] font-bold transition-all ${
                        invoiceType === "credit"
                          ? "bg-white text-slate-900 shadow-2xs"
                          : "text-slate-600"
                      }`}
                    >
                      {locale === "ar" ? "آجل" : "Credit"}
                    </button>
                  </div>
                </div>
              </div>

              {/* Delivery Address if active */}
              {fulfillmentMode === "delivery" && (
                <div>
                  <input
                    type="text"
                    value={deliveryAddress}
                    onChange={(e) => onDeliveryAddressChange(e.target.value)}
                    placeholder={locale === "ar" ? "عنوان التوصيل..." : "Delivery Address (Salmiya Block 5)"}
                    className="w-full rounded-lg border border-slate-300 px-2.5 py-1.5 text-xs outline-none focus:border-blue-600"
                  />
                </div>
              )}

              {/* Order Notes */}
              <div>
                <input
                  type="text"
                  maxLength={200}
                  value={orderNote}
                  onChange={(e) => onOrderNoteChange(e.target.value)}
                  placeholder={locale === "ar" ? "ملاحظة الفاتورة..." : "Order notes or delivery instructions..."}
                  className="w-full rounded-lg border border-slate-300 px-2.5 py-1.5 text-xs outline-none focus:border-blue-600"
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 4. Bottom: Totals, Payment Methods & Checkout */}
      <div className="border-t border-slate-200 bg-slate-50/90 p-3 space-y-2.5">
        {/* Totals Summary */}
        <div className="space-y-1 text-xs">
          <div className="flex justify-between text-slate-600">
            <span>{t.posScreen.subtotal}</span>
            <span className="numeric-ltr font-bold text-slate-900">{formatKD(subtotal)} KD</span>
          </div>

          {invoiceDiscountAmount > 0 && (
            <div className="flex justify-between text-red-600">
              <span>{t.posScreen.discount} ({discountPct}%)</span>
              <span className="numeric-ltr font-bold">-{formatKD(invoiceDiscountAmount)} KD</span>
            </div>
          )}

          {fulfillmentMode === "delivery" && deliveryFee > 0 && (
            <div className="flex justify-between text-slate-600">
              <span>{locale === "ar" ? "رسوم التوصيل" : "Delivery Fee"}</span>
              <span className="numeric-ltr font-bold text-slate-900">+{formatKD(deliveryFee)} KD</span>
            </div>
          )}

          <div className="flex justify-between border-t border-slate-200 pt-1.5 text-sm font-black text-slate-950">
            <span>{t.posScreen.total}</span>
            <span className="numeric-ltr text-lg font-black text-blue-700">{formatKD(total)} KD</span>
          </div>
        </div>

        {/* Payment Methods Pills */}
        <div>
          <div className="grid grid-cols-4 gap-1.5">
            {[
              { id: "cash", label: "Cash", icon: Banknote },
              { id: "knet", label: "K-NET", icon: Smartphone },
              { id: "hesabi", label: "Hesabi", icon: Layers },
              { id: "tabby", label: "Tabby", icon: CheckCircle2 },
            ].map((m) => {
              const Icon = m.icon;
              const isSelected = paymentMethod === m.id;

              return (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => {
                    onPaymentMethodChange(m.id as PosPaymentMethod);
                    if (m.id === "cash" && cashReceived === 0) {
                      onCashReceivedChange(total);
                    }
                  }}
                  className={`flex items-center justify-center gap-1 rounded-xl py-2 font-bold transition-all border ${
                    isSelected
                      ? "bg-blue-600 text-white border-blue-600 shadow-xs"
                      : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" />
                  <span className="text-[11px]">{m.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Cash Tendered & Change (Only if Cash is active) */}
        {isCash && (
          <div className="grid grid-cols-2 gap-2 rounded-xl bg-blue-50/80 border border-blue-100 p-2 text-xs">
            <div>
              <span className="text-[10px] font-bold text-slate-600 block mb-0.5">
                {locale === "ar" ? "المبلغ المدفوع" : "Paid"}
              </span>
              <input
                type="number"
                step="0.250"
                value={cashReceived === 0 ? "" : cashReceived}
                onChange={(e) => onCashReceivedChange(parseFloat(e.target.value) || 0)}
                placeholder={formatKD(total)}
                className="numeric-ltr w-full rounded-lg border border-blue-200 bg-white px-2 py-1 font-bold text-slate-950 outline-none focus:border-blue-600 text-xs"
              />
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-600 block mb-0.5">
                {locale === "ar" ? "الباقي" : "Change"}
              </span>
              <div className="numeric-ltr flex h-7 items-center rounded-lg bg-white border border-blue-200 px-2 font-black text-emerald-700 text-xs">
                {formatKD(changeDue)} KD
              </div>
            </div>
          </div>
        )}

        {/* Dominant Checkout Buttons */}
        <div className="space-y-1.5 pt-1">
          <button
            type="button"
            onClick={onCheckout}
            disabled={!canCheckout || isProcessing}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#2563EB] py-3 text-sm font-black text-white shadow-md transition-all hover:bg-blue-700 active:scale-[0.99] disabled:opacity-40 cursor-pointer"
          >
            <Printer className="h-4 w-4" />
            <span>{isProcessing ? "Processing..." : `${locale === "ar" ? "دفع وطباعة" : "Pay & Print"} (F9)`}</span>
          </button>

          <button
            type="button"
            onClick={onHoldSale}
            disabled={isCartEmpty}
            className="flex w-full items-center justify-center gap-1.5 rounded-xl border border-slate-300 bg-white py-1.5 text-xs font-bold text-slate-700 transition-colors hover:bg-slate-50 disabled:opacity-40"
          >
            <PauseCircle className="h-3.5 w-3.5 text-slate-400" />
            <span>{locale === "ar" ? "تعليق الفاتورة (F6)" : "Hold Invoice (F6)"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
