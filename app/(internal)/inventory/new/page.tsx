"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Package,
  Plus,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  FolderTree,
  ShieldCheck,
  Percent,
  Gift,
  Clock,
  Eye,
  Tag,
  DollarSign,
  Image as ImageIcon,
  UploadCloud,
  Trash2,
  Link2,
} from "lucide-react";
import { useLocale } from "@/lib/i18n/LocaleContext";
import {
  createItemRequest,
  listCategoriesRequest,
  type CreateItemPayload,
  type Category,
} from "@/lib/api";

const PRESET_ORIGINS = [
  "Kuwait",
  "Sweden",
  "China",
  "United States",
  "United Arab Emirates",
  "United Kingdom",
  "Germany",
  "Spain",
  "Netherlands",
  "France",
  "Japan",
];

export default function NewItemMasterPage() {
  const { locale, dir } = useLocale();
  const router = useRouter();
  const isAr = locale === "ar";

  const [categoriesList, setCategoriesList] = useState<Category[]>([]);
  const [loadingCats, setLoadingCats] = useState(true);
  const [imageUploadMode, setImageUploadMode] = useState<"file" | "url">("file");
  const [imageFileName, setImageFileName] = useState<string>("");

  const [form, setForm] = useState({
    nameEn: "",
    nameAr: "",
    sku: "",
    barcode: "",
    category: "disposable_vapes",
    subCategory: "",
    brand: "Bin Essa",
    countryOfOrigin: "Kuwait",
    imageUrl: "",
    price: "",
    retailPrice: "",
    semiWholesalePrice: "",
    wholesalePrice: "",
    cost: "",
    unit: "pcs",
    stockQuantity: "0",
    isActive: true,
    allowSale: true,
    allowPurchase: true,
    allowDiscount: true,
    maxDiscountPercent: "10",
    allowGift: true,
    expiryRequired: false,
    posVisibility: true,
  });

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    async function loadCategories() {
      try {
        const cats = await listCategoriesRequest();
        setCategoriesList(cats);
        if (cats.length > 0) {
          setForm((prev) => ({
            ...prev,
            category: cats[0].code,
            subCategory: cats[0].subcategories?.[0]?.code || "",
          }));
        }
      } catch (err) {
        console.error("Failed to load categories", err);
      } finally {
        setLoadingCats(false);
      }
    }
    loadCategories();
  }, []);

  function update<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  // Handle local image file selection
  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImageFileName(file.name);
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        update("imageUrl", event.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleClearImage = () => {
    update("imageUrl", "");
    setImageFileName("");
  };

  // Handle Category Change (auto-update subcategory cascade)
  const handleCategoryChange = (catCode: string) => {
    const selected = categoriesList.find((c) => c.code === catCode || c.id === catCode);
    const firstSub = selected?.subcategories?.[0]?.code || "";
    setForm((prev) => ({
      ...prev,
      category: catCode,
      subCategory: firstSub,
    }));
  };

  const currentCategoryObj = categoriesList.find(
    (c) => c.code === form.category || c.id === form.category
  );

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (!form.sku.trim()) {
      setError(isAr ? "رمز الصنف (SKU) مطلوب" : "Item Code / SKU is required.");
      return;
    }
    if (!form.nameEn.trim() && !form.nameAr.trim()) {
      setError(isAr ? "يجب إدخال اسم الصنف (عربي أو إنجليزي)" : "Please enter item name in English or Arabic.");
      return;
    }

    const price = Number(form.price);
    const cost = Number(form.cost);
    const stockQuantity = Number(form.stockQuantity);

    if (Number.isNaN(price) || price < 0) {
      setError(isAr ? "يجب أن يكون سعر البيع رقماً صحيحاً أو عشرياً موجباً" : "Sell price must be a valid non-negative number.");
      return;
    }
    if (Number.isNaN(cost) || cost < 0) {
      setError(isAr ? "يجب أن تكون التكلفة رقماً موجباً" : "Cost price must be a valid non-negative number.");
      return;
    }

    const payload: CreateItemPayload = {
      sku: form.sku.trim(),
      barcode: form.barcode.trim() || undefined,
      name: form.nameEn.trim() || form.nameAr.trim(),
      nameEn: form.nameEn.trim() || form.nameAr.trim(),
      nameAr: form.nameAr.trim() || form.nameEn.trim(),
      category: form.category,
      subCategory: form.subCategory || undefined,
      brand: form.brand.trim() || undefined,
      countryOfOrigin: form.countryOfOrigin.trim() || undefined,
      imageUrl: form.imageUrl.trim() || undefined,
      price,
      cost,
      unit: form.unit.trim() || "pcs",
      stockQuantity,
      retailPrice: Number(form.retailPrice) || price,
      semiWholesalePrice: Number(form.semiWholesalePrice) || price,
      wholesalePrice: Number(form.wholesalePrice) || price,
      isActive: form.isActive,
      allowSale: form.allowSale,
      allowPurchase: form.allowPurchase,
      allowDiscount: form.allowDiscount,
      maxDiscountPercent: Number(form.maxDiscountPercent) || 10,
      allowGift: form.allowGift,
      expiryRequired: form.expiryRequired,
      posVisibility: form.posVisibility,
      blockDiscount: !form.allowDiscount,
      blockFreeGift: !form.allowGift,
      trackExpiry: form.expiryRequired,
    };

    setSubmitting(true);
    try {
      await createItemRequest(payload);
      setSuccess(true);
      setTimeout(() => {
        router.push("/inventory");
      }, 900);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create item master record.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6 text-slate-900" dir={dir}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-slate-200 pb-4 gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-slate-900">
              {isAr ? "إضافة بطاقة صنف جديدة (Item Master Record)" : "Add New Item Master Record"}
            </h1>
            <span className="rounded-full bg-[#FDCE0C] text-black px-2.5 py-0.5 text-xs font-black">
              17 Requirements Standard
            </span>
          </div>
          <p className="text-xs font-semibold text-slate-600 mt-1">
            {isAr
              ? "إنشاء بطاقة صنف جديدة مع ضبط الفئات والأسعار وضوابط نقاط البيع (POS) والتسليم"
              : "Register official product master record with dual language names, category hierarchy, and POS operational controls."}
          </p>
        </div>

        <Link
          href="/inventory"
          className="inline-flex items-center gap-1.5 rounded-xl border border-slate-300 bg-white px-4 py-2 text-xs font-bold text-slate-800 hover:bg-slate-100 transition-colors shadow-2xs"
        >
          {isAr ? (
            <>
              <span>العودة إلى سجل المخزون</span>
              <ArrowLeft className="h-3.5 w-3.5" />
            </>
          ) : (
            <>
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Back to Item Master</span>
            </>
          )}
        </Link>
      </div>

      {/* Notifications */}
      {error && (
        <div className="p-4 rounded-2xl bg-red-50 border border-red-300 text-xs font-bold text-red-800 flex items-center gap-2.5">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-xs font-bold text-emerald-800 flex items-center gap-2.5">
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          <span>{isAr ? "تم حفظ بطاقة الصنف بنجاح! جاري التحويل للمخزون..." : "Item Master Record created successfully! Redirecting..."}</span>
        </div>
      )}

      {/* Item Master Form */}
      <form onSubmit={handleSubmit} className="space-y-6 text-xs text-slate-900">
        {/* Section 1: Identification & Names */}
        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Tag className="h-4 w-4 text-amber-500" />
              <span>{isAr ? "1. التعريف والتسمية الثنائية (English / العربية)" : "1. Product Identification & Bilingual Names"}</span>
            </h2>
            <span className="text-[11px] font-bold text-slate-500">Required Attributes 1 - 9</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">
                {isAr ? "اسم الصنف بالإنجليزية *" : "Item Name (English) *"}
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Beco Pro 6000 Puffs - Tropical Mix"
                value={form.nameEn}
                onChange={(e) => update("nameEn", e.target.value)}
                className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-xs font-semibold text-slate-900 placeholder:text-slate-400 outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1 text-end">
                {isAr ? "* اسم الصنف بالعربية" : "Item Name (Arabic) *"}
              </label>
              <input
                type="text"
                required
                placeholder="مثال: بيكو برو 6000 سحبة - تروبيكال مكس"
                value={form.nameAr}
                onChange={(e) => update("nameAr", e.target.value)}
                className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-xs font-semibold text-slate-900 placeholder:text-slate-400 outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 text-end"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">
                {isAr ? "رمز الصنف (Item Code / SKU) *" : "Item Code / SKU *"}
              </label>
              <input
                type="text"
                required
                placeholder="e.g. VP-BECO-PRO-6K"
                value={form.sku}
                onChange={(e) => update("sku", e.target.value)}
                className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-xs font-mono font-bold text-slate-900 placeholder:text-slate-400 outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">
                {isAr ? "الباركود الأساسي (Barcode)" : "Barcode"}
              </label>
              <input
                type="text"
                placeholder="e.g. 6281234500019"
                value={form.barcode}
                onChange={(e) => update("barcode", e.target.value)}
                className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-xs font-mono text-slate-900 placeholder:text-slate-400 outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">
                {isAr ? "العلامة التجارية (Brand)" : "Brand"}
              </label>
              <input
                type="text"
                placeholder="e.g. Beco, RAW, Cricket, Siberia"
                value={form.brand}
                onChange={(e) => update("brand", e.target.value)}
                className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-xs font-semibold text-slate-900 placeholder:text-slate-400 outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">
                {isAr ? "بلد المنشأ (Country of Origin)" : "Country of Origin"}
              </label>
              <select
                value={form.countryOfOrigin}
                onChange={(e) => update("countryOfOrigin", e.target.value)}
                className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-xs font-semibold text-slate-900 outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
              >
                {PRESET_ORIGINS.map((orig) => (
                  <option key={orig} value={orig}>
                    {orig}
                  </option>
                ))}
              </select>
            </div>

            {/* Product Image Uploader */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-bold text-slate-800">
                  {isAr ? "صورة الصنف (Product Image)" : "Product Image"}
                </label>
                <div className="flex items-center gap-1.5 text-[11px]">
                  <button
                    type="button"
                    onClick={() => setImageUploadMode("file")}
                    className={`px-2 py-0.5 rounded-md font-bold transition-colors ${
                      imageUploadMode === "file"
                        ? "bg-amber-100 text-amber-900 border border-amber-300"
                        : "text-slate-500 hover:text-slate-900"
                    }`}
                  >
                    {isAr ? "رفع ملف" : "Upload File"}
                  </button>
                  <span className="text-slate-300">|</span>
                  <button
                    type="button"
                    onClick={() => setImageUploadMode("url")}
                    className={`px-2 py-0.5 rounded-md font-bold transition-colors ${
                      imageUploadMode === "url"
                        ? "bg-amber-100 text-amber-900 border border-amber-300"
                        : "text-slate-500 hover:text-slate-900"
                    }`}
                  >
                    {isAr ? "رابط URL" : "Image URL"}
                  </button>
                </div>
              </div>

              {imageUploadMode === "file" ? (
                <div className="space-y-2">
                  <label className="flex flex-col items-center justify-center p-3 rounded-2xl border-2 border-dashed border-slate-300 hover:border-amber-500 bg-slate-50 hover:bg-amber-50/20 cursor-pointer transition-all">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageFileChange}
                      className="hidden"
                    />
                    <div className="flex items-center gap-2 text-slate-600">
                      <UploadCloud className="h-5 w-5 text-amber-500" />
                      <span className="text-xs font-bold text-slate-800">
                        {isAr ? "اختر صورة أو اسحبها هنا" : "Choose image or drag & drop"}
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-500 mt-0.5">
                      PNG, JPG, WEBP, GIF (Max 5MB)
                    </p>
                  </label>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <Link2 className="absolute start-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                    <input
                      type="text"
                      placeholder="https://images.example.com/product.jpg"
                      value={form.imageUrl}
                      onChange={(e) => update("imageUrl", e.target.value)}
                      className="w-full rounded-xl border border-slate-300 bg-white ps-9 pe-3.5 py-2.5 text-xs text-slate-900 placeholder:text-slate-400 outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                    />
                  </div>
                </div>
              )}

              {/* Image Preview & Actions */}
              {form.imageUrl && (
                <div className="mt-2.5 flex items-center justify-between p-2 rounded-xl border border-slate-200 bg-slate-50">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <img
                      src={form.imageUrl}
                      alt="Product Preview"
                      className="h-10 w-10 rounded-lg object-cover border border-slate-300 shrink-0 bg-white"
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = "none";
                      }}
                    />
                    <div className="min-w-0">
                      <p className="text-[11px] font-bold text-slate-800 truncate">
                        {imageFileName || (isAr ? "صورة محددة" : "Selected Image")}
                      </p>
                      <p className="text-[10px] text-emerald-600 font-semibold">
                        {isAr ? "تم تحميل الصورة بنجاح" : "Ready for Item Master"}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleClearImage}
                    className="p-1.5 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
                    title={isAr ? "إزالة الصورة" : "Remove image"}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Section 2: Hierarchy & Classification (Category & Subcategory) */}
        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <FolderTree className="h-4 w-4 text-amber-500" />
              <span>{isAr ? "2. التصنيف الهيكلي (الفئة والفئة الفرعية)" : "2. Category & Subcategory Hierarchy"}</span>
            </h2>
            <span className="text-[11px] font-bold text-slate-500">Structured Reporting Base</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">
                {isAr ? "الفئة الرئيسية (Category) *" : "Category *"}
              </label>
              <select
                value={form.category}
                onChange={(e) => handleCategoryChange(e.target.value)}
                className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-xs font-bold text-slate-900 outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
              >
                {categoriesList.map((c) => (
                  <option key={c.id} value={c.code} className="text-slate-900 bg-white">
                    {isAr ? c.nameAr : c.nameEn}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">
                {isAr ? "الفئة الفرعية (Sub Category)" : "Sub Category"}
              </label>
              <select
                value={form.subCategory}
                onChange={(e) => update("subCategory", e.target.value)}
                className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-xs font-bold text-slate-900 outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
              >
                <option value="" className="text-slate-900 bg-white">{isAr ? "بدون فئة فرعية" : "None / Unassigned"}</option>
                {(currentCategoryObj?.subcategories || []).map((s) => (
                  <option key={s.id} value={s.code} className="text-slate-900 bg-white">
                    {isAr ? s.nameAr : s.nameEn}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Section 3: Operational Governance Controls (The Core 17 Rules) */}
        <div className="rounded-3xl border border-amber-300 bg-amber-50/30 p-5 shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-amber-200 pb-3">
            <h2 className="text-sm font-black text-slate-900 flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-amber-600" />
              <span>{isAr ? "3. ضوابط التشغيل والحوكمة المركزية (Operational Governance)" : "3. Master Operational Controls & Rules"}</span>
            </h2>
            <span className="text-[11px] font-bold text-amber-800">Directly Connected to POS & Purchasing</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {/* 1. Allow Sale */}
            <label className="flex items-start gap-2.5 p-3 rounded-2xl border border-slate-200 bg-white cursor-pointer hover:border-amber-500 shadow-2xs">
              <input
                type="checkbox"
                checked={form.allowSale}
                onChange={(e) => update("allowSale", e.target.checked)}
                className="mt-0.5 h-4 w-4 rounded text-amber-600 accent-amber-500"
              />
              <div>
                <p className="font-bold text-slate-900">{isAr ? "السماح بالبيع" : "Allow Sale"}</p>
                <p className="text-[10px] text-slate-400 mt-0.5">
                  {isAr ? "البيع في كاشير POS" : "Sell at POS terminal"}
                </p>
              </div>
            </label>

            {/* 2. Allow Purchase */}
            <label className="flex items-start gap-2.5 p-3 rounded-2xl border border-slate-200 bg-white cursor-pointer hover:border-amber-500 shadow-2xs">
              <input
                type="checkbox"
                checked={form.allowPurchase}
                onChange={(e) => update("allowPurchase", e.target.checked)}
                className="mt-0.5 h-4 w-4 rounded text-amber-600 accent-amber-500"
              />
              <div>
                <p className="font-bold text-slate-900">{isAr ? "السماح بالشراء" : "Allow Purchase"}</p>
                <p className="text-[10px] text-slate-400 mt-0.5">
                  {isAr ? "في أوامر الشراء والفواتير" : "Purchasable in POs"}
                </p>
              </div>
            </label>

            {/* 3. Allow Discount */}
            <label className="flex items-start gap-2.5 p-3 rounded-2xl border border-slate-200 bg-white cursor-pointer hover:border-amber-500 shadow-2xs">
              <input
                type="checkbox"
                checked={form.allowDiscount}
                onChange={(e) => update("allowDiscount", e.target.checked)}
                className="mt-0.5 h-4 w-4 rounded text-amber-600 accent-amber-500"
              />
              <div>
                <p className="font-bold text-slate-900">{isAr ? "السماح بالخصم" : "Allow Discount"}</p>
                <p className="text-[10px] text-slate-400 mt-0.5">
                  {isAr ? "خصم الفاتورة والصنف" : "Invoice/Line Discount"}
                </p>
              </div>
            </label>

            {/* 4. Allow Gift */}
            <label className="flex items-start gap-2.5 p-3 rounded-2xl border border-slate-200 bg-white cursor-pointer hover:border-amber-500 shadow-2xs">
              <input
                type="checkbox"
                checked={form.allowGift}
                onChange={(e) => update("allowGift", e.target.checked)}
                className="mt-0.5 h-4 w-4 rounded text-amber-600 accent-amber-500"
              />
              <div>
                <p className="font-bold text-slate-900">{isAr ? "السماح كهدية" : "Allow Gift"}</p>
                <p className="text-[10px] text-slate-400 mt-0.5">
                  {isAr ? "هدية مجانية 100%" : "Free promo gift item"}
                </p>
              </div>
            </label>

            {/* 5. POS Visibility */}
            <label className="flex items-start gap-2.5 p-3 rounded-2xl border border-slate-200 bg-white cursor-pointer hover:border-amber-500 shadow-2xs">
              <input
                type="checkbox"
                checked={form.posVisibility}
                onChange={(e) => update("posVisibility", e.target.checked)}
                className="mt-0.5 h-4 w-4 rounded text-amber-600 accent-amber-500"
              />
              <div>
                <p className="font-bold text-slate-900">{isAr ? "الظهور في POS" : "POS Visibility"}</p>
                <p className="text-[10px] text-slate-400 mt-0.5">
                  {isAr ? "ظاهر في شبكة الكاشير" : "Visible in Cashier UI"}
                </p>
              </div>
            </label>

            {/* 6. Expiry Required */}
            <label className="flex items-start gap-2.5 p-3 rounded-2xl border border-slate-200 bg-white cursor-pointer hover:border-amber-500 shadow-2xs">
              <input
                type="checkbox"
                checked={form.expiryRequired}
                onChange={(e) => update("expiryRequired", e.target.checked)}
                className="mt-0.5 h-4 w-4 rounded text-amber-600 accent-amber-500"
              />
              <div>
                <p className="font-bold text-slate-900">{isAr ? "تتبع الصلاحية" : "Expiry Required"}</p>
                <p className="text-[10px] text-slate-400 mt-0.5">
                  {isAr ? "تاريخ الانتهاء والباتش" : "Track batch/expiry"}
                </p>
              </div>
            </label>

            {/* 7. Active / Inactive */}
            <label className="flex items-start gap-2.5 p-3 rounded-2xl border border-slate-200 bg-white cursor-pointer hover:border-amber-500 shadow-2xs">
              <input
                type="checkbox"
                checked={form.isActive}
                onChange={(e) => update("isActive", e.target.checked)}
                className="mt-0.5 h-4 w-4 rounded text-amber-600 accent-amber-500"
              />
              <div>
                <p className="font-bold text-slate-900">{isAr ? "حالة النشاط" : "Active Status"}</p>
                <p className="text-[10px] text-slate-400 mt-0.5">
                  {isAr ? "صنف نشط عملياتياً" : "Operational item"}
                </p>
              </div>
            </label>

            {/* 8. Maximum Discount % */}
            <div className="p-3 rounded-2xl border border-slate-200 bg-white shadow-2xs">
              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                {isAr ? "أقصى خصم مسموح %" : "Max Discount %"}
              </label>
              <input
                type="number"
                min={0}
                max={100}
                value={form.maxDiscountPercent}
                onChange={(e) => update("maxDiscountPercent", e.target.value)}
                className="w-full rounded-xl border border-slate-300 px-3 py-1.5 text-xs font-black text-slate-900 outline-none focus:border-amber-500"
              />
            </div>
          </div>
        </div>

        {/* Section 4: Pricing & Inventory Opening */}
        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-amber-500" />
              <span>{isAr ? "4. الأسعار، التكاليف ورصيد الافتتاح (د.ك)" : "4. Pricing, Cost & Opening Stock"}</span>
            </h2>
            <span className="text-[11px] font-bold text-slate-400">Kuwait 3-Decimal Legal Standard</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">
                {isAr ? "سعر البيع الأساسي (د.ك) *" : "Sell Price (KD) *"}
              </label>
              <input
                type="number"
                step="0.001"
                min={0}
                required
                placeholder="0.000"
                value={form.price}
                onChange={(e) => update("price", e.target.value)}
                className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-xs font-black text-slate-900 placeholder:text-slate-400 outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">
                {isAr ? "سعر التكلفة (د.ك) *" : "Cost Price (KD) *"}
              </label>
              <input
                type="number"
                step="0.001"
                min={0}
                required
                placeholder="0.000"
                value={form.cost}
                onChange={(e) => update("cost", e.target.value)}
                className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-xs font-semibold text-slate-900 placeholder:text-slate-400 outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">
                {isAr ? "سعر الجملة (د.ك)" : "Wholesale Price (KD)"}
              </label>
              <input
                type="number"
                step="0.001"
                min={0}
                placeholder="0.000"
                value={form.wholesalePrice}
                onChange={(e) => update("wholesalePrice", e.target.value)}
                className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-xs font-semibold text-slate-900 placeholder:text-slate-400 outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">
                {isAr ? "الوحدة الأساسية" : "Base Unit"}
              </label>
              <input
                type="text"
                placeholder="pcs, box, pack, can"
                value={form.unit}
                onChange={(e) => update("unit", e.target.value)}
                className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-xs font-semibold text-slate-900 placeholder:text-slate-400 outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">
                {isAr ? "رصيد المخزن الافتتاحي" : "Opening Stock Qty"}
              </label>
              <input
                type="number"
                min={0}
                value={form.stockQuantity}
                onChange={(e) => update("stockQuantity", e.target.value)}
                className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-xs font-black text-slate-900 placeholder:text-slate-400 outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
              />
            </div>
          </div>
        </div>

        {/* Submit Actions */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <Link
            href="/inventory"
            className="rounded-xl border border-slate-300 bg-white px-6 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-100 transition-colors shadow-2xs"
          >
            {isAr ? "إلغاء" : "Cancel"}
          </Link>

          <button
            type="submit"
            disabled={submitting}
            className="rounded-xl bg-black text-[#FDCE0C] px-8 py-2.5 text-xs font-bold shadow-md hover:bg-slate-900 disabled:opacity-50 transition-all flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            <span>{submitting ? (isAr ? "جاري الحفظ..." : "Creating Item...") : (isAr ? "حفظ بطاقة الصنف (Item Master)" : "Create Item Master Record")}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
