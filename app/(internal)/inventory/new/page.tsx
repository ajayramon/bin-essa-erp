"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useLocale } from "@/lib/i18n/LocaleContext";
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

const MAIN_CATEGORIES = [
  "CIGAR",
  "DISPOSABLE VAPE",
  "POD SYSTEMS",
  "DOKHA & MEDWAKH",
  "E-LIQUIDS",
  "CIGARETTE LIGHTERS",
  "ROLLING PAPERS",
  "GENERAL ACCESSORIES",
];

export default function NewItemPage() {
  const { locale, dir } = useLocale();
  const router = useRouter();

  const isAr = locale === "ar";

  const [form, setForm] = useState({
    sku: "",
    barcode: "",
    name: "",
    category: "TOBACCO" as ItemCategory,
    mainCategory: "CIGAR",
    brand: "",
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
      { unitName: "Piece", conversionRatio: 1, customCost: 0, customPrice: 0, isBase: true },
      { unitName: "Pack", conversionRatio: 5, customCost: 0, customPrice: 0, isBase: false },
      { unitName: "Box", conversionRatio: 100, customCost: 0, customPrice: 0, isBase: false },
      { unitName: "Carton", conversionRatio: 1000, customCost: 0, customPrice: 0, isBase: false },
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
      setError(isAr ? "رمز SKU واأسم الصنف مطلوبة" : "SKU and Product Name are required.");
      return;
    }
    const price = Number(form.price);
    const cost = Number(form.cost);
    const stockQuantity = Number(form.stockQuantity);
    if (Number.isNaN(price) || price < 0) {
      setError(isAr ? "يجب أن يكون السعر رقماً موجباً" : "Price must be a valid non-negative number.");
      return;
    }
    if (Number.isNaN(cost) || cost < 0) {
      setError(isAr ? "يجب أن تكون التكلفة رقماً موجباً" : "Cost must be a valid non-negative number.");
      return;
    }
    if (Number.isNaN(stockQuantity) || stockQuantity < 0) {
      setError(isAr ? "الكمية الافتتاحية يجب أن تكون رقماً موجباً" : "Stock Quantity must be a valid non-negative number.");
      return;
    }

    const payload: CreateItemPayload = {
      sku: form.sku.trim(),
      name: form.name.trim(),
      category: form.category,
      mainCategory: form.mainCategory,
      brand: form.brand.trim() || undefined,
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
      uoms: form.uoms.map((u) => ({
        ...u,
        customCost: Number(u.customCost) || undefined,
        customPrice: Number(u.customPrice) || undefined,
      })),
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
    <div className="max-w-3xl mx-auto p-6 space-y-6" dir={dir}>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-ink/15 pb-4 gap-3">
        <div>
          <h1 className="text-2xl font-bold text-ink">
            {isAr ? "إضافة صنف جديد (Item Master Record)" : "Add New Item Master Record"}
          </h1>
          <p className="text-xs font-medium text-ink/70 mt-1">
            {isAr
              ? "تعيين رمز SKU، أسعار وتكاليف كل وحدة قياس (حبة، باكيت، كرتون)، الشركة المصنعة والفئة الرئيسية"
              : "Configure item SKU, company brand, per-UOM custom prices & costs (Piece, Pack, Box, Carton)."}
          </p>
        </div>

        <Link
          href="/inventory"
          className="inline-flex items-center gap-1.5 rounded-xl border border-ink/20 bg-white px-4 py-2 text-xs font-bold text-ink hover:bg-slate-100 transition-colors whitespace-nowrap shadow-xs"
        >
          {isAr ? "العودة إلى المخزون ←" : "← Back to Inventory"}
        </Link>
      </div>

      {error && (
        <div className="p-3.5 rounded-xl bg-red-50 border border-red-300 text-xs font-bold text-red-800">
          ⚠️ {error}
        </div>
      )}

      {success && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-300 text-xs font-bold text-emerald-900">
          ✓ {isAr ? "تم حفظ الصنف بنجاح! جاري التوجيه إلى قائمة الأصناف..." : "Item Master created successfully! Redirecting..."}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-2xl border border-ink/15 shadow-sm text-ink">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-ink mb-1">
              {isAr ? "اسم الصنف *" : "Item Name *"}
            </label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => update("name", e.target.value)}
              placeholder={isAr ? "مثال: سيجار كوهيبا إسپلِنديدوس" : "e.g. Cohiba Esplendidos Cigar"}
              className="w-full border border-ink/20 rounded-xl px-3 py-2 text-sm text-ink font-medium bg-white outline-none focus:border-gold"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-ink mb-1">
              {isAr ? "رمز SKU للصنف *" : "Item SKU *"}
            </label>
            <input
              type="text"
              value={form.sku}
              onChange={(e) => update("sku", e.target.value)}
              placeholder="SKU-CIGAR-001"
              className="w-full border border-ink/20 rounded-xl px-3 py-2 text-sm text-ink font-mono font-bold bg-white outline-none focus:border-gold"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold text-ink mb-1">
              {isAr ? "اسم الشركة / الماركة (Brand)" : "Company Name / Brand"}
            </label>
            <input
              type="text"
              value={form.brand}
              onChange={(e) => update("brand", e.target.value)}
              placeholder={isAr ? "مثال: Philip Morris / Davidoff / Cohiba" : "e.g. Davidoff / Cohiba / VNSN"}
              className="w-full border border-ink/20 rounded-xl px-3 py-2 text-sm text-ink font-medium bg-white outline-none focus:border-gold"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-ink mb-1">
              {isAr ? "الفئة الرئيسية (Main Category) *" : "Main Category *"}
            </label>
            <select
              value={form.mainCategory}
              onChange={(e) => update("mainCategory", e.target.value)}
              className="w-full border border-ink/20 rounded-xl px-3 py-2 text-sm text-ink font-bold bg-white outline-none focus:border-gold"
            >
              {MAIN_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-ink mb-1">
              {isAr ? "الفئة العامة *" : "General Category *"}
            </label>
            <select
              value={form.category}
              onChange={(e) => update("category", e.target.value as ItemCategory)}
              className="w-full border border-ink/20 rounded-xl px-3 py-2 text-sm text-ink font-bold bg-white outline-none focus:border-gold"
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-ink mb-1">
            {isAr ? "الباركود الرئيسي (Primary Barcode)" : "Primary Barcode"}
          </label>
          <input
            type="text"
            value={form.barcode}
            onChange={(e) => update("barcode", e.target.value)}
            placeholder="6291100998822"
            className="w-full border border-ink/20 rounded-xl px-3 py-2 text-sm text-ink font-mono font-bold bg-white outline-none focus:border-gold"
          />
        </div>

        <div className="p-4 rounded-xl bg-slate-50 border border-ink/15 space-y-3">
          <span className="text-xs font-bold text-ink block">
            {isAr ? "أسعار البيع الأساسية والتكلفة بالدينار (3-Tier Selling Prices & Cost KWD)" : "3-Tier Selling Prices & Cost (KWD)"}
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div>
              <label className="block text-xs font-bold text-ink/80 mb-1">
                {isAr ? "سعر التكلفة (Cost KD)" : "Cost Price (KD)"}
              </label>
              <input
                type="number"
                step="0.001"
                min="0"
                required
                value={form.cost}
                onChange={(e) => update("cost", e.target.value)}
                className="w-full border border-ink/20 rounded-lg px-2.5 py-1.5 text-xs text-ink font-mono font-bold bg-white outline-none focus:border-gold"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-ink/80 mb-1">
                {isAr ? "سعر التجزئة (Retail KD)" : "Retail Price (KD)"}
              </label>
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
                className="w-full border border-ink/20 rounded-lg px-2.5 py-1.5 text-xs text-ink font-mono font-bold bg-white outline-none focus:border-gold"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-ink/80 mb-1">
                {isAr ? "نصف الجملة (Semi-WS KD)" : "Semi-Wholesale (KD)"}
              </label>
              <input
                type="number"
                step="0.001"
                min="0"
                value={form.semiWholesalePrice}
                onChange={(e) => update("semiWholesalePrice", e.target.value)}
                className="w-full border border-ink/20 rounded-lg px-2.5 py-1.5 text-xs text-ink font-mono font-bold bg-white outline-none focus:border-gold"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-ink/80 mb-1">
                {isAr ? "سعر الجملة (Wholesale KD)" : "Wholesale (KD)"}
              </label>
              <input
                type="number"
                step="0.001"
                min="0"
                value={form.wholesalePrice}
                onChange={(e) => update("wholesalePrice", e.target.value)}
                className="w-full border border-ink/20 rounded-lg px-2.5 py-1.5 text-xs text-ink font-mono font-bold bg-white outline-none focus:border-gold"
              />
            </div>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-100/70 border border-ink/20 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
            <span className="text-xs font-bold text-ink">
              {isAr ? "جدول وحدات القياس وأسعار وتكاليف كل وحدة (UOM Pricing & Ratios)" : "Units of Measure (UOM) Multipliers, Custom Cost & Selling Prices"}
            </span>
            <span className="text-xs text-ink font-mono font-bold dir-ltr">1 Carton = 10 Box = 200 Pack = 1,000 Piece</span>
          </div>
          <p className="text-xs font-medium text-ink/75">
            {isAr
              ? "يمكنك تحديد سعر بيع وتكلفة مخصصة لكل وحدة (حبة، باكيت، صندوق، كرتون) بجانب معامل التحويل"
              : "Define custom cost and selling price per unit size (Piece, Pack, Box, Carton) along with conversion ratio."}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {form.uoms.map((uom, idx) => (
              <div key={idx} className="p-3.5 rounded-xl bg-white border border-ink/20 space-y-2.5 shadow-xs">
                <div className="flex items-center justify-between border-b border-ink/10 pb-2">
                  <span className="text-xs font-bold text-ink">
                    {uom.unitName === "Piece" ? (isAr ? "حبة (Piece)" : "Piece") :
                     uom.unitName === "Pack" ? (isAr ? "باكيت (Pack)" : "Pack") :
                     uom.unitName === "Box" ? (isAr ? "صندوق (Box)" : "Box") :
                     (isAr ? "كرتون (Carton)" : "Carton")}
                  </span>
                  {uom.isBase && (
                    <span className="text-[9px] font-bold px-2 py-0.5 rounded bg-slate-200 text-ink">
                      {isAr ? "الوحدة الأساسية" : "Base Unit"}
                    </span>
                  )}
                </div>

                <div>
                  <label className="text-[11px] font-bold text-ink/80 block mb-0.5">
                    {isAr ? `معامل التحويل (1 ${uom.unitName} = كم حبة)` : `1 ${uom.unitName} = (Pieces)`}
                  </label>
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
                    className="w-full border border-ink/20 rounded-lg px-2 py-1 text-xs font-mono font-bold text-ink bg-white"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-ink/80 block mb-0.5">
                    {isAr ? `تكلفة ${uom.unitName} (Cost KD)` : `${uom.unitName} Cost (KD)`}
                  </label>
                  <input
                    type="number"
                    step="0.001"
                    min="0"
                    placeholder={(Number(form.cost || 0) * uom.conversionRatio).toFixed(3)}
                    value={uom.customCost || ""}
                    onChange={(e) => {
                      const updated = [...form.uoms];
                      updated[idx] = { ...uom, customCost: parseFloat(e.target.value) || 0 };
                      setForm({ ...form, uoms: updated });
                    }}
                    className="w-full border border-ink/20 rounded-lg px-2 py-1 text-xs font-mono font-bold text-ink bg-white"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-ink/80 block mb-0.5">
                    {isAr ? `سعر بيع ${uom.unitName} (Price KD)` : `${uom.unitName} Selling Price (KD)`}
                  </label>
                  <input
                    type="number"
                    step="0.001"
                    min="0"
                    placeholder={(Number(form.price || 0) * uom.conversionRatio).toFixed(3)}
                    value={uom.customPrice || ""}
                    onChange={(e) => {
                      const updated = [...form.uoms];
                      updated[idx] = { ...uom, customPrice: parseFloat(e.target.value) || 0 };
                      setForm({ ...form, uoms: updated });
                    }}
                    className="w-full border border-ink/20 rounded-lg px-2 py-1 text-xs font-mono font-bold text-ink bg-white"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-ink mb-1">
              {isAr ? "الكمية الافتتاحية في المخزون (قطع أساسية)" : "Initial Opening Stock Quantity (Base Pieces)"}
            </label>
            <input
              type="number"
              min="0"
              value={form.stockQuantity}
              onChange={(e) => update("stockQuantity", e.target.value)}
              className="w-full border border-ink/20 rounded-xl px-3 py-2 text-sm text-ink font-mono font-bold bg-white outline-none focus:border-gold"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-ink mb-1">
              {isAr ? "اسم الوحدة الأساسية الافتراضية" : "Default Base Unit Name"}
            </label>
            <input
              type="text"
              value={form.unit}
              onChange={(e) => update("unit", e.target.value)}
              className="w-full border border-ink/20 rounded-xl px-3 py-2 text-sm text-ink font-medium bg-white outline-none focus:border-gold"
            />
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-50 border border-ink/20 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-ink">
              {isAr ? "ضوابط النظام الإدارية والتراخيص (System Admin Operational Controls)" : "System Administrator Operational Controls"}
            </span>
            <span className="text-[10px] font-bold px-2.5 py-0.5 rounded bg-slate-200 text-ink">
              {isAr ? "صلاحيات الأدمن فقط" : "Admin Only"}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <label className="flex items-center gap-2 cursor-pointer bg-white p-2.5 rounded-lg border border-ink/20">
              <input
                type="checkbox"
                checked={form.trackExpiry}
                onChange={(e) => update("trackExpiry", e.target.checked)}
                className="h-4 w-4 rounded accent-gold"
              />
              <span className="font-bold text-ink">{isAr ? "تتبع تاريخ الصلاحية" : "Track Expiry Date"}</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer bg-white p-2.5 rounded-lg border border-ink/20">
              <input
                type="checkbox"
                checked={form.blockFreeGift}
                onChange={(e) => update("blockFreeGift", e.target.checked)}
                className="h-4 w-4 rounded accent-gold"
              />
              <span className="font-bold text-ink">{isAr ? "منع الهدايا المجانية" : "Prevent Free Gift"}</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer bg-white p-2.5 rounded-lg border border-ink/20">
              <input
                type="checkbox"
                checked={form.blockDiscount}
                onChange={(e) => update("blockDiscount", e.target.checked)}
                className="h-4 w-4 rounded accent-gold"
              />
              <span className="font-bold text-ink">{isAr ? "منع الخصومات" : "Prevent Discount"}</span>
            </label>
          </div>

          <div className="pt-2 flex items-center gap-2 text-xs">
            <span className="text-ink font-bold">Max Allowed Discount %:</span>
            <input
              type="number"
              step="1"
              min="0"
              max="100"
              value={form.maxDiscountPercent}
              onChange={(e) => update("maxDiscountPercent", e.target.value)}
              className="w-20 rounded-lg border border-ink/20 px-2 py-1 text-xs font-mono font-bold text-ink bg-white"
            />
            <span className="text-ink/70 text-[11px] font-medium">% maximum discount cap for cashiers</span>
          </div>
        </div>

        {error && <p className="text-xs font-bold text-red-700 bg-red-50 p-3 rounded-xl border border-red-200">{error}</p>}
        {success && <p className="text-xs font-bold text-emerald-800 bg-emerald-50 p-3 rounded-xl border border-emerald-200">Item Master created successfully! Redirecting...</p>}

        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={() => router.push("/inventory")}
            className="px-5 py-2.5 rounded-xl border border-ink/20 bg-white text-xs font-bold text-ink hover:bg-slate-100 transition-colors shadow-xs"
          >
            {isAr ? "إلغاء" : "Cancel"}
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="px-6 py-2.5 rounded-xl bg-ink text-xs font-bold text-white shadow-md hover:bg-gold hover:text-ink transition-colors disabled:opacity-50"
          >
            {submitting
              ? (isAr ? "جاري حفظ الصنف..." : "Saving Item...")
              : (isAr ? "حفظ سجل الصنف في قاعدة البيانات" : "Save Item Master Record")}
          </button>
        </div>
      </form>
    </div>
  );
}
