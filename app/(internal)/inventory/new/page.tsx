"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  createItemRequest,
  type CreateItemPayload,
  type ItemCategory,
} from "@/lib/api";

const CATEGORIES: ItemCategory[] = [
  "TOBACCO",
  "ACCESSORIES",
  "ELECTRONICS",
  "ART_SUPPLIES",
  "OTHER",
];

export default function NewItemPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    sku: "",
    barcode: "",
    name: "",
    category: "TOBACCO" as ItemCategory,
    price: "",
    retailPrice: "",
    semiWholesalePrice: "",
    wholesalePrice: "",
    cost: "",
    unit: "pcs",
    stockQuantity: "0",
    trackExpiry: false,
    blockFreeGift: false,
    blockDiscount: false,
    maxDiscountPercent: "10",
    additionalBarcodes: [] as string[],
    uoms: [
      { unitName: "Piece", conversionRatio: 1, isBase: true },
      { unitName: "Pack", conversionRatio: 5, isBase: false },
      { unitName: "Box", conversionRatio: 100, isBase: false },
      { unitName: "Carton", conversionRatio: 1000, isBase: false },
    ],
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  function update<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (!form.sku.trim() || !form.name.trim()) {
      setError("SKU and name are required.");
      return;
    }
    const price = Number(form.price);
    const cost = Number(form.cost);
    const stockQuantity = Number(form.stockQuantity);
    if (Number.isNaN(price) || price < 0) {
      setError("Price must be a valid non-negative number.");
      return;
    }
    if (Number.isNaN(cost) || cost < 0) {
      setError("Cost must be a valid non-negative number.");
      return;
    }
    if (Number.isNaN(stockQuantity) || stockQuantity < 0) {
      setError("Stock Quantity must be a valid non-negative number.");
      return;
    }

    const payload: CreateItemPayload = {
      sku: form.sku.trim(),
      name: form.name.trim(),
      category: form.category,
      price,
      cost,
      unit: form.unit.trim() || undefined,
      barcode: form.barcode.trim() || undefined,
      stockQuantity,
      retailPrice: Number(form.retailPrice) || price,
      semiWholesalePrice: Number(form.semiWholesalePrice) || price,
      wholesalePrice: Number(form.wholesalePrice) || price,
      trackExpiry: form.trackExpiry,
      blockFreeGift: form.blockFreeGift,
      blockDiscount: form.blockDiscount,
      maxDiscountPercent: Number(form.maxDiscountPercent) || 10,
      additionalBarcodes: form.additionalBarcodes.filter((b) => b.trim().length > 0),
      uoms: form.uoms,
    };

    setSubmitting(true);
    try {
      await createItemRequest(payload);
      setSuccess(true);
      setTimeout(() => {
        router.push("/inventory");
      }, 1000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create item.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Add New Item Master Record</h1>
        <p className="text-xs text-slate-500 mt-1">
          Configure product SKU, Units of Measure (UOM) ratios, multi-tier pricing, and inventory balances.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">SKU *</label>
            <input
              type="text"
              value={form.sku}
              onChange={(e) => update("sku", e.target.value)}
              className="w-full border border-slate-300 rounded-xl px-3 py-2 text-sm outline-none focus:border-amber-500 font-mono"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Product Name *</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => update("name", e.target.value)}
              className="w-full border border-slate-300 rounded-xl px-3 py-2 text-sm outline-none focus:border-amber-500"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Primary Barcode</label>
            <input
              type="text"
              value={form.barcode}
              onChange={(e) => update("barcode", e.target.value)}
              className="w-full border border-slate-300 rounded-xl px-3 py-2 text-sm outline-none focus:border-amber-500 font-mono"
              placeholder="e.g. 629110023451"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Category *</label>
            <select
              value={form.category}
              onChange={(e) => update("category", e.target.value as ItemCategory)}
              className="w-full border border-slate-300 rounded-xl px-3 py-2 text-sm outline-none focus:border-amber-500 bg-white"
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Pricing Matrix */}
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
          <span className="text-xs font-bold text-slate-800 block">3-Tier Selling Prices & Cost (KWD)</span>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div>
              <label className="block text-[11px] font-medium text-slate-600 mb-1">Cost Price (KD)</label>
              <input
                type="number"
                step="0.001"
                min="0"
                required
                value={form.cost}
                onChange={(e) => update("cost", e.target.value)}
                className="w-full border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs outline-none focus:border-amber-500"
              />
            </div>
            <div>
              <label className="block text-[11px] font-medium text-slate-600 mb-1">Retail Price (KD)</label>
              <input
                type="number"
                step="0.001"
                min="0"
                required
                value={form.price}
                onChange={(e) => {
                  update("price", e.target.value);
                  update("retailPrice", e.target.value);
                }}
                className="w-full border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs outline-none focus:border-amber-500"
              />
            </div>
            <div>
              <label className="block text-[11px] font-medium text-slate-600 mb-1">Semi-Wholesale (KD)</label>
              <input
                type="number"
                step="0.001"
                min="0"
                value={form.semiWholesalePrice}
                onChange={(e) => update("semiWholesalePrice", e.target.value)}
                className="w-full border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs outline-none focus:border-amber-500"
              />
            </div>
            <div>
              <label className="block text-[11px] font-medium text-slate-600 mb-1">Wholesale (KD)</label>
              <input
                type="number"
                step="0.001"
                min="0"
                value={form.wholesalePrice}
                onChange={(e) => update("wholesalePrice", e.target.value)}
                className="w-full border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs outline-none focus:border-amber-500"
              />
            </div>
          </div>
        </div>

        {/* Units of Measure (UOM) Builder */}
        <div className="p-4 rounded-xl bg-indigo-50/60 border border-indigo-100 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-indigo-900">Units of Measure (UOM) Conversion Ratios</span>
            <span className="text-[11px] text-indigo-700 font-mono">1 Carton = 10 Box = 200 Pack = 1,000 Piece</span>
          </div>
          <p className="text-[11px] text-indigo-700/80">
            Define base selling unit and conversion multipliers for automatic stock balance calculations across sales, purchasing, transfers, and stock reports.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {form.uoms.map((uom, idx) => (
              <div key={idx} className="p-3 rounded-xl bg-white border border-indigo-200 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-indigo-950">{uom.unitName}</span>
                  {uom.isBase && <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-indigo-100 text-indigo-800">Base Unit</span>}
                </div>
                <div className="text-[10px] text-slate-500">1 {uom.unitName} =</div>
                <input
                  type="number"
                  step="1"
                  min="1"
                  value={uom.conversionRatio}
                  onChange={(e) => {
                    const updated = [...form.uoms];
                    updated[idx] = { ...uom, conversionRatio: parseFloat(e.target.value) || 1 };
                    setForm({ ...form, uoms: updated });
                  }}
                  className="w-full border border-slate-300 rounded-lg px-2 py-1 text-xs font-mono font-bold"
                />
                <span className="text-[10px] text-slate-400 font-mono block">Base Pieces</span>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Initial Opening Stock Quantity</label>
            <input
              type="number"
              min="0"
              value={form.stockQuantity}
              onChange={(e) => update("stockQuantity", e.target.value)}
              className="w-full border border-slate-300 rounded-xl px-3 py-2 text-sm outline-none focus:border-amber-500"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Default Base Unit Name</label>
            <input
              type="text"
              value={form.unit}
              onChange={(e) => update("unit", e.target.value)}
              className="w-full border border-slate-300 rounded-xl px-3 py-2 text-sm outline-none focus:border-amber-500"
            />
          </div>
        </div>

        {/* System Administrator Operational Governance Controls */}
        <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-950">System Administrator Operational Controls</span>
            <span className="text-[10px] font-bold text-amber-800 bg-amber-200/60 px-2 py-0.5 rounded">Admin Only</span>
          </div>
          <p className="text-[11px] text-amber-900/80">
            Configure expiry tracking, free gift permissions, and cashier discount policy overrides for this product master record.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <label className="flex items-center gap-2 text-amber-950 cursor-pointer font-medium">
              <input
                type="checkbox"
                checked={form.trackExpiry}
                onChange={(e) => update("trackExpiry", e.target.checked)}
                className="rounded border-amber-400 text-amber-600 focus:ring-amber-500"
              />
              📅 Track Expiry Dates
            </label>

            <label className="flex items-center gap-2 text-amber-950 cursor-pointer font-medium">
              <input
                type="checkbox"
                checked={form.blockFreeGift}
                onChange={(e) => update("blockFreeGift", e.target.checked)}
                className="rounded border-amber-400 text-amber-600 focus:ring-amber-500"
              />
              🎁 Block Free Gift Issue
            </label>

            <label className="flex items-center gap-2 text-amber-950 cursor-pointer font-medium">
              <input
                type="checkbox"
                checked={form.blockDiscount}
                onChange={(e) => update("blockDiscount", e.target.checked)}
                className="rounded border-amber-400 text-amber-600 focus:ring-amber-500"
              />
              🏷️ Block All Discounts
            </label>
          </div>

          <div className="pt-2 flex items-center gap-2 text-xs">
            <span className="text-amber-950 font-medium">Max Allowed Discount %:</span>
            <input
              type="number"
              step="1"
              min="0"
              max="100"
              value={form.maxDiscountPercent}
              onChange={(e) => update("maxDiscountPercent", e.target.value)}
              className="w-20 rounded-lg border border-amber-300 px-2 py-1 text-xs font-mono font-bold text-amber-950 bg-white"
            />
            <span className="text-amber-800 text-[11px]">% maximum discount cap for cashiers</span>
          </div>
        </div>

        {error && <p className="text-xs font-bold text-red-600 bg-red-50 p-3 rounded-xl border border-red-200">{error}</p>}
        {success && <p className="text-xs font-bold text-emerald-700 bg-emerald-50 p-3 rounded-xl border border-emerald-200">Item created successfully! Redirecting to inventory...</p>}

        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={() => router.push("/inventory")}
            className="px-5 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="px-6 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs shadow-md transition disabled:opacity-50"
          >
            {submitting ? "Saving..." : "Save Item Master"}
          </button>
        </div>
      </form>
    </div>
  );
}
