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
  Percent,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { useLocale } from "@/lib/i18n/LocaleContext";
import type { Item, Customer } from "@/lib/types";

export type PosPaymentMethod = "cash" | "card" | "knet" | "credit" | "tabby";

export interface CartItemLine {
  item: Item;
  qty: number;
}

interface PosCartPanelProps {
  cartLines: CartItemLine[];
  onUpdateQty: (itemId: string, qty: number) => void;
  onRemoveItem: (itemId: string) => void;
  onClearCart: () => void;
  selectedCustomer: Customer | null;
  onOpenCustomerModal: () => void;
  discountPct: number;
  onDiscountPctChange: (pct: number) => void;
  subtotal: number;
  discountAmount: number;
  taxAmount: number;
  total: number;
  paymentMethod: PosPaymentMethod;
  onPaymentMethodChange: (method: PosPaymentMethod) => void;
  cashReceived: number;
  onCashReceivedChange: (amt: number) => void;
  onCheckout: () => void;
  isProcessing: boolean;
  orderNote?: string;
  onOpenNoteModal: () => void;
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
  selectedCustomer,
  onOpenCustomerModal,
  discountPct,
  onDiscountPctChange,
  subtotal,
  discountAmount,
  taxAmount,
  total,
  paymentMethod,
  onPaymentMethodChange,
  cashReceived,
  onCashReceivedChange,
  onCheckout,
  isProcessing,
  orderNote,
  onOpenNoteModal,
}: PosCartPanelProps) {
  const { locale, t } = useLocale();

  const changeDue = Math.max(0, cashReceived - total);
  const isCash = paymentMethod === "cash";
  const needsDiscountApproval = discountPct > 10;
  const isCartEmpty = cartLines.length === 0;
  const canCheckout = !isCartEmpty && (!isCash || cashReceived >= total || cashReceived === 0);

  // Quick cash denomination presets
  const cashPresets = [
    { label: t.posScreen.exact, value: total },
    { label: "5 KD", value: 5 },
    { label: "10 KD", value: 10 },
    { label: "20 KD", value: 20 },
    { label: "50 KD", value: 50 },
  ];

  return (
    <div className="flex h-full w-full flex-col justify-between bg-white border-s border-neutral-200 shadow-sm select-none">
      {/* 1. Header: Cart Count & Customer Bar */}
      <div className="border-b border-neutral-200 p-3.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingBag className="h-5 w-5 text-neutral-800" />
            <h2 className="text-base font-bold text-neutral-900">
              {t.posScreen.cart}
            </h2>
            <span className="rounded-full bg-neutral-900 px-2 py-0.5 text-xs font-bold text-[#FDCE0C] numeric-ltr">
              {cartLines.reduce((sum, l) => sum + l.qty, 0)}
            </span>
          </div>

          {!isCartEmpty && (
            <button
              type="button"
              onClick={onClearCart}
              className="text-xs font-medium text-red-600 hover:text-red-700 hover:underline"
            >
              {t.posScreen.clearCart}
            </button>
          )}
        </div>

        {/* Customer Selector Strip */}
        <div className="mt-2.5 flex items-center justify-between rounded-xl bg-neutral-50 p-2 border border-neutral-200/80">
          <div className="flex items-center gap-2 truncate">
            <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-neutral-200 text-neutral-700">
              <User className="h-3.5 w-3.5" />
            </div>
            <span className="truncate text-xs font-medium text-neutral-800">
              {selectedCustomer
                ? locale === "ar"
                  ? selectedCustomer.nameAr
                  : selectedCustomer.nameEn
                : t.posScreen.walkInCustomer}
            </span>
          </div>
          <button
            type="button"
            onClick={onOpenCustomerModal}
            className="shrink-0 text-xs font-semibold text-neutral-700 hover:text-black"
          >
            {selectedCustomer ? t.common.edit : t.posScreen.selectCustomer}
          </button>
        </div>
      </div>

      {/* 2. Scrollable Cart Items List */}
      <div className="flex-1 overflow-y-auto p-3.5 space-y-2.5">
        {isCartEmpty ? (
          <div className="flex h-full flex-col items-center justify-center text-center p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-neutral-100 text-neutral-400 mb-2">
              <ShoppingBag className="h-6 w-6" />
            </div>
            <p className="text-sm font-semibold text-neutral-700">
              {t.posScreen.emptyCart}
            </p>
            <p className="text-xs text-neutral-400 mt-1">
              {t.posScreen.searchPlaceholder}
            </p>
          </div>
        ) : (
          cartLines.map(({ item, qty }) => {
            const lineTotal = item.sellPriceKd * qty;
            const itemName = locale === "ar" ? item.nameAr : item.nameEn;

            return (
              <div
                key={item.id}
                className="group relative flex items-center justify-between gap-2.5 rounded-xl border border-neutral-200/90 bg-white p-2.5 shadow-2xs hover:border-neutral-300"
              >
                {/* Item Name & Unit Price */}
                <div className="min-w-0 flex-1">
                  <h4 className="truncate text-xs font-bold text-neutral-900 leading-tight">
                    {itemName}
                  </h4>
                  <p className="numeric-ltr text-[11px] font-medium text-neutral-500 mt-0.5">
                    {formatKD(item.sellPriceKd)} KD
                  </p>
                </div>

                {/* Quantity Stepper */}
                <div className="flex items-center gap-1.5 rounded-lg border border-neutral-200 bg-neutral-50 p-0.5">
                  <button
                    type="button"
                    onClick={() => onUpdateQty(item.id, qty - 1)}
                    className="flex h-6 w-6 items-center justify-center rounded-md bg-white text-neutral-700 shadow-2xs hover:bg-neutral-100 active:scale-95"
                    title="Decrease"
                  >
                    <Minus className="h-3 w-3" />
                  </button>

                  <input
                    type="number"
                    min={1}
                    value={qty}
                    onChange={(e) =>
                      onUpdateQty(item.id, Math.max(0, parseInt(e.target.value) || 0))
                    }
                    className="numeric-ltr w-8 text-center text-xs font-bold text-neutral-900 bg-transparent outline-none"
                  />

                  <button
                    type="button"
                    onClick={() => onUpdateQty(item.id, qty + 1)}
                    className="flex h-6 w-6 items-center justify-center rounded-md bg-white text-neutral-700 shadow-2xs hover:bg-neutral-100 active:scale-95"
                    title="Increase"
                  >
                    <Plus className="h-3 w-3" />
                  </button>
                </div>

                {/* Line Total & Remove */}
                <div className="flex items-center gap-2">
                  <span className="numeric-ltr text-xs font-extrabold text-neutral-950 min-w-16 text-end">
                    {formatKD(lineTotal)} KD
                  </span>

                  <button
                    type="button"
                    onClick={() => onRemoveItem(item.id)}
                    className="flex h-6 w-6 items-center justify-center rounded-md text-neutral-400 hover:bg-red-50 hover:text-red-600"
                    title={t.posScreen.remove}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* 3. Bottom Summary & Checkout Section */}
      <div className="border-t border-neutral-200 bg-neutral-50/80 p-3.5 space-y-3">
        {/* Calculations Strip */}
        <div className="space-y-1.5 text-xs text-neutral-600">
          <div className="flex items-center justify-between">
            <span>{t.posScreen.subtotal}</span>
            <span className="numeric-ltr font-semibold text-neutral-900">
              {formatKD(subtotal)} KD
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1">
              <span>{t.posScreen.discount}</span>
              {discountPct > 0 && (
                <span className="text-[10px] text-neutral-500">
                  ({discountPct}%)
                </span>
              )}
            </span>
            <span className="numeric-ltr font-semibold text-red-600">
              {discountAmount > 0 ? `-${formatKD(discountAmount)} KD` : "0.000 KD"}
            </span>
          </div>

          {needsDiscountApproval && (
            <p className="text-[10px] font-bold text-red-600">
              {t.posScreen.discountApprovalNeeded}
            </p>
          )}

          <div className="flex items-center justify-between">
            <span>{t.posScreen.tax}</span>
            <span className="numeric-ltr font-semibold text-neutral-900">
              {formatKD(taxAmount)} KD
            </span>
          </div>

          <div className="flex items-center justify-between border-t border-neutral-200 pt-2 text-sm">
            <span className="font-bold text-neutral-900">
              {t.posScreen.total}
            </span>
            <span className="numeric-ltr text-base font-extrabold text-neutral-950">
              {formatKD(total)} KD
            </span>
          </div>
        </div>

        {/* Payment Method Selector */}
        <div>
          <div className="grid grid-cols-5 gap-1.5">
            {(
              [
                { id: "cash", label: t.posScreen.cash, icon: Banknote },
                { id: "knet", label: t.posScreen.knet, icon: Smartphone },
                { id: "card", label: t.posScreen.card, icon: CreditCard },
                { id: "credit", label: t.posScreen.credit, icon: Layers },
                { id: "tabby", label: t.posScreen.tabby, icon: CheckCircle2 },
              ] as const
            ).map((m) => {
              const Icon = m.icon;
              const isSelected = paymentMethod === m.id;

              return (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => {
                    onPaymentMethodChange(m.id);
                    if (m.id === "cash" && cashReceived === 0) {
                      onCashReceivedChange(total);
                    }
                  }}
                  className={`flex flex-col items-center justify-center rounded-xl py-2 px-1 text-[11px] font-bold transition-all ${
                    isSelected
                      ? "bg-neutral-950 text-white shadow-sm ring-2 ring-[#FDCE0C]"
                      : "bg-white text-neutral-700 border border-neutral-200 hover:bg-neutral-100"
                  }`}
                >
                  <Icon
                    className={`h-4 w-4 mb-1 ${
                      isSelected ? "text-[#FDCE0C]" : "text-neutral-500"
                    }`}
                  />
                  <span className="leading-tight truncate max-w-full">
                    {m.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Cash Tender & Change calculation if Cash is selected */}
        {isCash && (
          <div className="rounded-xl border border-neutral-200 bg-white p-2.5 space-y-2">
            {/* Quick Bill Presets */}
            <div className="flex gap-1 overflow-x-auto pb-0.5">
              {cashPresets.map((p, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => onCashReceivedChange(p.value)}
                  className={`shrink-0 rounded-lg px-2 py-1 text-[11px] font-bold border transition-colors ${
                    cashReceived === p.value
                      ? "bg-[#FDCE0C] text-black border-[#FDCE0C]"
                      : "bg-neutral-50 text-neutral-700 border-neutral-200 hover:bg-neutral-100"
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>

            {/* Cash Input & Change Due */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <label className="block text-[11px] font-medium text-neutral-500 mb-1">
                  {t.posScreen.cashReceived}
                </label>
                <input
                  type="number"
                  step="0.250"
                  min={0}
                  value={cashReceived === 0 ? "" : cashReceived}
                  onChange={(e) =>
                    onCashReceivedChange(parseFloat(e.target.value) || 0)
                  }
                  placeholder={formatKD(total)}
                  className="numeric-ltr w-full rounded-lg border border-neutral-300 px-2 py-1.5 text-xs font-bold text-neutral-900 outline-none focus:border-[#FDCE0C]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-neutral-500 mb-1">
                  {t.posScreen.change}
                </label>
                <div className="numeric-ltr flex h-8 items-center rounded-lg bg-neutral-100 px-2 text-xs font-extrabold text-emerald-700">
                  {formatKD(changeDue)} KD
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Dominant Checkout Button */}
        <button
          type="button"
          onClick={onCheckout}
          disabled={!canCheckout || isProcessing}
          className="relative flex w-full items-center justify-center gap-2 rounded-2xl bg-neutral-950 py-3.5 text-sm font-extrabold text-[#FDCE0C] shadow-lg transition-all hover:bg-black hover:shadow-xl active:scale-[0.99] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
        >
          <span>{isProcessing ? "Processing..." : t.posScreen.payAndComplete}</span>
          <span className="numeric-ltr text-white font-black">
            ({formatKD(total)} KD)
          </span>
        </button>
      </div>
    </div>
  );
}
