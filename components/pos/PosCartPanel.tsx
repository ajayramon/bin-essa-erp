"use client";

import { useState } from "react";
import {
  Trash2,
  Plus,
  Minus,
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
  discountKd?: number; // item-level discount
  isGift?: boolean; // 100% free gift item
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

  const changeDue = Math.max(0, cashReceived - total);
  const isCash = paymentMethod === "cash";
  const needsDiscountApproval = discountPct > 10;
  const isCartEmpty = cartLines.length === 0;
  const canCheckout = !isCartEmpty;

  const totalItemsCount = cartLines.reduce((sum, l) => sum + l.qty, 0);

  return (
    <div className="flex h-full w-full flex-col justify-between overflow-y-auto bg-white border-s border-slate-200 shadow-sm select-none text-xs">
      <div className="p-3 space-y-3">
        {/* 1. Customer & Salesperson Cards */}
        <div className="grid grid-cols-1 gap-2">
          {/* Customer */}
          <div>
            <label className="block text-[11px] font-bold text-slate-500 mb-0.5">
              {locale === "ar" ? "العميل" : "Customer"}
            </label>
            <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50/70 px-2.5 py-1.5">
              <div className="flex items-center gap-2 truncate">
                <User className="h-4 w-4 text-slate-500 shrink-0" />
                <span className="truncate font-bold text-slate-900">
                  {selectedCustomer
                    ? locale === "ar"
                      ? selectedCustomer.nameAr
                      : selectedCustomer.nameEn
                    : locale === "ar"
                    ? "عميل نقدي مباشر"
                    : "Walk-in Customer"}
                </span>
              </div>
              <button
                type="button"
                onClick={onOpenCustomerModal}
                className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-white border border-slate-300 text-blue-600 font-bold hover:bg-blue-50"
              >
                +
              </button>
            </div>
          </div>

          {/* Salesperson */}
          <div>
            <label className="block text-[11px] font-bold text-slate-500 mb-0.5">
              {locale === "ar" ? "مندوب المبيعات (البائع)" : "Salesperson (Seller)"}
            </label>
            <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50/70 px-2.5 py-1.5">
              <div className="flex items-center gap-2 truncate">
                <User className="h-4 w-4 text-slate-500 shrink-0" />
                <span className="truncate font-bold text-slate-900">
                  {selectedSalesperson
                    ? locale === "ar"
                      ? selectedSalesperson.nameAr
                      : selectedSalesperson.nameEn
                    : "Mohamed Ali"}
                </span>
              </div>
              <button
                type="button"
                onClick={onOpenSalespersonModal}
                className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-white border border-slate-300 text-blue-600 font-bold hover:bg-blue-50"
              >
                +
              </button>
            </div>
          </div>
        </div>

        {/* 2. Fulfillment Mode: Pickup vs Delivery */}
        <div>
          <label className="block text-[11px] font-bold text-slate-500 mb-0.5">
            {locale === "ar" ? "طريقة الاستلام والتوصيل" : "Delivery"}
          </label>
          <div className="grid grid-cols-2 gap-1.5 rounded-xl bg-slate-100 p-1 border border-slate-200/80">
            <button
              type="button"
              onClick={() => onFulfillmentModeChange("pickup")}
              className={`flex items-center justify-center gap-1.5 rounded-lg py-1.5 font-bold transition-all ${
                fulfillmentMode === "pickup"
                  ? "bg-blue-600 text-white shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Building2 className="h-3.5 w-3.5" />
              <span>{locale === "ar" ? "استلام من الفرع" : "Pickup from Branch"}</span>
            </button>

            <button
              type="button"
              onClick={() => onFulfillmentModeChange("delivery")}
              className={`flex items-center justify-center gap-1.5 rounded-lg py-1.5 font-bold transition-all ${
                fulfillmentMode === "delivery"
                  ? "bg-blue-600 text-white shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Truck className="h-3.5 w-3.5" />
              <span>{locale === "ar" ? "توصيل طلب" : "Delivery"}</span>
            </button>
          </div>

          {fulfillmentMode === "delivery" && (
            <input
              type="text"
              value={deliveryAddress}
              onChange={(e) => onDeliveryAddressChange(e.target.value)}
              placeholder={locale === "ar" ? "عنوان التوصيل..." : "Delivery Address (e.g. Salmiya Blk 5 St 10)"}
              className="mt-1.5 w-full rounded-xl border border-slate-300 px-2.5 py-1.5 text-xs outline-none focus:border-blue-600"
            />
          )}
        </div>

        {/* 3. Invoice Type (Cash vs Credit) & Payment Methods */}
        <div className="space-y-2">
          <div>
            <label className="block text-[11px] font-bold text-slate-500 mb-0.5">
              {locale === "ar" ? "نوع الفاتورة" : "Invoice Type"}
            </label>
            <div className="grid grid-cols-2 gap-1.5 rounded-xl bg-slate-100 p-1 border border-slate-200/80">
              <button
                type="button"
                onClick={() => onInvoiceTypeChange("cash")}
                className={`rounded-lg py-1.5 font-bold transition-all ${
                  invoiceType === "cash"
                    ? "bg-blue-600 text-white shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                {locale === "ar" ? "نقدي" : "Cash"}
              </button>

              <button
                type="button"
                onClick={() => onInvoiceTypeChange("credit")}
                className={`rounded-lg py-1.5 font-bold transition-all ${
                  invoiceType === "credit"
                    ? "bg-blue-600 text-white shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                {locale === "ar" ? "آجل (Credit)" : "Credit (آجل)"}
              </button>
            </div>
          </div>

          {/* Payment Methods Cards */}
          <div>
            <label className="block text-[11px] font-bold text-slate-500 mb-0.5">
              {locale === "ar" ? "طريقة الدفع" : "Payment Method"}
            </label>
            <div className="grid grid-cols-4 gap-1.5">
              {[
                { id: "cash", label: "Cash", icon: Banknote, color: "text-emerald-600" },
                { id: "knet", label: "KNET", icon: Smartphone, color: "text-blue-600" },
                { id: "hesabi", label: "Hesabi", icon: Layers, color: "text-purple-600" },
                { id: "tabby", label: "Tabby", icon: CheckCircle2, color: "text-teal-600" },
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
                    className={`flex flex-col items-center justify-center rounded-xl p-2 font-bold transition-all border ${
                      isSelected
                        ? "bg-blue-50 border-blue-600 text-blue-700 shadow-xs ring-1 ring-blue-600"
                        : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    <Icon className={`h-4 w-4 mb-0.5 ${isSelected ? "text-blue-600" : m.color}`} />
                    <span className="text-[11px] leading-tight">{m.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* 4. Cart Table */}
        <div>
          <div className="flex items-center justify-between pb-1">
            <span className="font-bold text-slate-900 text-xs">
              {locale === "ar" ? "السلة" : "Cart"} ({totalItemsCount} {locale === "ar" ? "أصناف" : "Items"})
            </span>
          </div>

          <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
            <table className="w-full text-start text-[11px]">
              <thead className="border-b border-slate-200 bg-slate-50 font-bold text-slate-600">
                <tr>
                  <th className="py-1.5 ps-2 pe-1 text-center w-6">S.NO</th>
                  <th className="py-1.5 px-1">{locale === "ar" ? "الصنف" : "ITEM NAME"}</th>
                  <th className="py-1.5 px-1 text-center">{locale === "ar" ? "الكمية" : "QTY"}</th>
                  <th className="py-1.5 px-1 text-end">{locale === "ar" ? "السعر" : "RATE"}</th>
                  <th className="py-1.5 px-1 text-end">{locale === "ar" ? "خصم" : "DISC"}</th>
                  <th className="py-1.5 px-1 text-end">{locale === "ar" ? "المجموع" : "AMOUNT"}</th>
                  <th className="py-1.5 pe-2 ps-1 text-center w-6"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {isCartEmpty ? (
                  <tr>
                    <td colSpan={7} className="py-6 text-center text-slate-400 font-medium">
                      {t.posScreen.emptyCart}
                    </td>
                  </tr>
                ) : (
                  cartLines.map(({ item, qty, isGift }, idx) => {
                    const lineRate = isGift ? 0 : item.sellPriceKd;
                    const lineTotal = lineRate * qty;
                    const itemName = locale === "ar" ? item.nameAr : item.nameEn;

                    return (
                      <tr key={item.id} className="hover:bg-slate-50/60">
                        <td className="py-1.5 ps-2 pe-1 text-center font-bold text-slate-400 text-[10px]">
                          {idx + 1}
                        </td>
                        <td className="py-1.5 px-1 font-bold text-slate-900 leading-tight">
                          <span className="line-clamp-1">{itemName}</span>
                          {isGift && (
                            <span className="rounded bg-amber-100 text-amber-800 px-1 text-[9px] font-extrabold uppercase">
                              Gift Promo (100%)
                            </span>
                          )}
                        </td>
                        <td className="py-1.5 px-1 text-center">
                          <div className="inline-flex items-center gap-1 rounded border border-slate-200 bg-slate-50 px-1 py-0.5">
                            <button
                              type="button"
                              onClick={() => onUpdateQty(item.id, qty - 1)}
                              className="text-slate-600 hover:text-black font-bold"
                            >
                              -
                            </button>
                            <span className="numeric-ltr font-bold text-slate-900 px-1">
                              {qty}
                            </span>
                            <button
                              type="button"
                              onClick={() => onUpdateQty(item.id, qty + 1)}
                              className="text-slate-600 hover:text-black font-bold"
                            >
                              +
                            </button>
                          </div>
                        </td>
                        <td className="py-1.5 px-1 text-end numeric-ltr font-semibold text-slate-600">
                          {formatKD(lineRate)}
                        </td>
                        <td className="py-1.5 px-1 text-end numeric-ltr font-semibold text-slate-400">
                          0.000
                        </td>
                        <td className="py-1.5 px-1 text-end numeric-ltr font-black text-slate-900">
                          {formatKD(lineTotal)}
                        </td>
                        <td className="py-1.5 pe-2 ps-1 text-center">
                          <button
                            type="button"
                            onClick={() => onRemoveItem(item.id)}
                            className="text-red-400 hover:text-red-600"
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

          {/* Quick Cart Actions (Add Gift Item / Clear Cart) */}
          <div className="mt-1.5 flex items-center justify-between">
            <button
              type="button"
              onClick={onAddGiftItem}
              className="flex items-center gap-1 text-[11px] font-bold text-red-600 hover:text-red-700"
            >
              <Gift className="h-3.5 w-3.5" />
              <span>{locale === "ar" ? "إضافة صنف هدية" : "Add Gift Item"}</span>
            </button>

            {!isCartEmpty && (
              <button
                type="button"
                onClick={onClearCart}
                className="flex items-center gap-1 text-[11px] font-bold text-red-600 hover:text-red-700"
              >
                <Trash2 className="h-3.5 w-3.5" />
                <span>{t.posScreen.clearCart}</span>
              </button>
            )}
          </div>
        </div>

        {/* 5. Invoice Discount & Notes */}
        <div className="grid grid-cols-2 gap-2 pt-1">
          {/* Discount Stepper */}
          <div>
            <label className="block text-[11px] font-bold text-slate-500 mb-0.5">
              {locale === "ar" ? "نسبة خصم الفاتورة %" : "Invoice Discount %"}
            </label>
            <div className="flex items-center rounded-xl border border-slate-300 bg-white p-1 justify-between">
              <button
                type="button"
                onClick={() => onDiscountPctChange(Math.max(0, discountPct - 1))}
                className="flex h-6 w-6 items-center justify-center rounded-lg bg-slate-100 font-bold hover:bg-slate-200"
              >
                -
              </button>
              <span className="numeric-ltr font-black text-slate-900 text-xs">
                {discountPct}%
              </span>
              <button
                type="button"
                onClick={() => onDiscountPctChange(Math.min(100, discountPct + 1))}
                className="flex h-6 w-6 items-center justify-center rounded-lg bg-slate-100 font-bold hover:bg-slate-200"
              >
                +
              </button>
            </div>
            <p className="text-[10px] text-slate-400 mt-0.5">
              (Max allowed: 10%)
            </p>
          </div>

          {/* Calculated Discount Amount */}
          <div>
            <label className="block text-[11px] font-bold text-slate-500 mb-0.5">
              {locale === "ar" ? "مبلغ الخصم" : "Discount Amount"}
            </label>
            <div className="flex h-8 items-center rounded-xl border border-slate-200 bg-slate-50 px-2.5 numeric-ltr font-black text-slate-900 text-xs">
              {formatKD(invoiceDiscountAmount)} KD
            </div>
          </div>
        </div>

        {/* Notes on Invoice */}
        <div>
          <div className="flex items-center justify-between text-[11px] font-bold text-slate-500 mb-0.5">
            <span>{locale === "ar" ? "ملاحظات على الفاتورة" : "Notes on Invoice"}</span>
            <span className="text-[10px] text-slate-400">{orderNote.length}/200</span>
          </div>
          <input
            type="text"
            maxLength={200}
            value={orderNote}
            onChange={(e) => onOrderNoteChange(e.target.value)}
            placeholder={locale === "ar" ? "اكتب ملاحظة أو تعليمات التوصيل..." : "Please deliver after 7 PM."}
            className="w-full rounded-xl border border-slate-300 px-2.5 py-1.5 text-xs outline-none focus:border-blue-600"
          />
        </div>

        {/* 6. Summary Totals */}
        <div className="rounded-xl border border-slate-200 bg-slate-50/90 p-2.5 space-y-1 text-xs">
          <div className="flex justify-between text-slate-600">
            <span>{t.posScreen.subtotal}</span>
            <span className="numeric-ltr font-bold text-slate-900">{formatKD(subtotal)} KD</span>
          </div>

          {invoiceDiscountAmount > 0 && (
            <div className="flex justify-between text-red-600">
              <span>{t.posScreen.discount}</span>
              <span className="numeric-ltr font-bold">-{formatKD(invoiceDiscountAmount)} KD</span>
            </div>
          )}

          {fulfillmentMode === "delivery" && deliveryFee > 0 && (
            <div className="flex justify-between text-slate-600">
              <span>{locale === "ar" ? "رسوم التوصيل" : "Delivery Fee"}</span>
              <span className="numeric-ltr font-bold text-slate-900">{formatKD(deliveryFee)} KD</span>
            </div>
          )}

          <div className="flex justify-between text-slate-600">
            <span>{locale === "ar" ? "الضريبة (0%)" : "Tax (0%)"}</span>
            <span className="numeric-ltr font-bold text-slate-900">{formatKD(taxAmount)} KD</span>
          </div>

          <div className="flex justify-between border-t border-slate-200 pt-1.5 text-sm font-black text-slate-950">
            <span>{t.posScreen.total}</span>
            <span className="numeric-ltr text-base font-black text-blue-700">{formatKD(total)} KD</span>
          </div>
        </div>

        {/* 7. Cash Received & Change */}
        {isCash && (
          <div className="grid grid-cols-2 gap-2 rounded-xl bg-blue-50/70 border border-blue-100 p-2 text-xs">
            <div>
              <span className="text-[11px] font-bold text-slate-600 block mb-0.5">
                {locale === "ar" ? "المبلغ المدفوع" : "Amount Paid"}
              </span>
              <input
                type="number"
                step="0.250"
                value={cashReceived === 0 ? "" : cashReceived}
                onChange={(e) => onCashReceivedChange(parseFloat(e.target.value) || 0)}
                placeholder={formatKD(total)}
                className="numeric-ltr w-full rounded-lg border border-blue-200 bg-white px-2 py-1 font-black text-slate-950 outline-none focus:border-blue-600"
              />
            </div>

            <div>
              <span className="text-[11px] font-bold text-slate-600 block mb-0.5">
                {locale === "ar" ? "المتبقي / الفكة" : "Remaining / Change"}
              </span>
              <div className="numeric-ltr flex h-7 items-center rounded-lg bg-white border border-blue-200 px-2 font-black text-emerald-700">
                {formatKD(changeDue)} KD
              </div>
            </div>
          </div>
        )}

        {/* 8. Dominant Action Buttons */}
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
            className="flex w-full items-center justify-center gap-1.5 rounded-xl border border-slate-300 bg-white py-2 text-xs font-bold text-slate-700 transition-colors hover:bg-slate-50 disabled:opacity-40"
          >
            <PauseCircle className="h-4 w-4 text-slate-500" />
            <span>{locale === "ar" ? "تعليق الفاتورة (F6)" : "Hold Invoice (F6)"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
