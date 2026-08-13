"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Package,
  Edit2,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Tag,
  ShieldCheck,
  ShieldAlert,
  Percent,
  Gift,
  Clock,
  Eye,
  Power,
  Globe,
  Building2,
} from "lucide-react";
import { useLocale } from "@/lib/i18n/LocaleContext";
import {
  listItemsRequest,
  updateItemRequest,
  toggleItemActiveRequest,
  listCategoriesRequest,
  type ItemResponse,
  type Category,
} from "@/lib/api";
import { branches } from "@/lib/mock-data/branches";

function formatKD(amount: number | string | undefined) {
  const num = Number(amount) || 0;
  return num.toLocaleString("en-US", {
    minimumFractionDigits: 3,
    maximumFractionDigits: 3,
  });
}

export default function ItemDetailPage() {
  const { locale, t, dir } = useLocale();
  const params = useParams();
  const router = useRouter();
  const itemId = params.itemId as string;
  const isAr = locale === "ar";

  const [item, setItem] = useState<ItemResponse | null>(null);
  const [categoriesList, setCategoriesList] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notFound, setNotFound] = useState(false);

  // Edit Modal State
  const [isEditing, setIsEditing] = useState(false);
  const [editFormData, setEditFormData] = useState({
    name: "",
    nameEn: "",
    nameAr: "",
    sku: "",
    barcode: "",
    category: "disposable_vapes",
    subCategory: "",
    brand: "",
    countryOfOrigin: "Kuwait",
    imageUrl: "",
    price: "",
    retailPrice: "",
    semiWholesalePrice: "",
    wholesalePrice: "",
    cost: "",
    stockQuantity: "0",
    unit: "pcs",
    isActive: true,
    allowSale: true,
    allowPurchase: true,
    allowDiscount: true,
    maxDiscountPercent: "10",
    allowGift: true,
    expiryRequired: false,
    posVisibility: true,
  });
  const [isSaving, setIsSaving] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);

  const fetchItem = async () => {
    setIsLoading(true);
    setError(null);
    setNotFound(false);
    try {
      const [allItems, cats] = await Promise.all([
        listItemsRequest(),
        listCategoriesRequest(),
      ]);
      setCategoriesList(cats);
      const found = allItems.find((i) => i.id === itemId) ?? null;
      if (!found) {
        setNotFound(true);
      } else {
        setItem(found);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load item master record");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchItem();
  }, [itemId]);

  const openEditModal = () => {
    if (!item) return;
    setEditError(null);
    setEditFormData({
      name: item.name,
      nameEn: item.nameEn || item.name,
      nameAr: item.nameAr || item.name,
      sku: item.sku,
      barcode: item.barcode ?? "",
      category: item.category || "disposable_vapes",
      subCategory: item.subCategory || "",
      brand: item.brand || "",
      countryOfOrigin: item.countryOfOrigin || "Kuwait",
      imageUrl: item.imageUrl || "",
      price: String(item.price),
      retailPrice: String(item.retailPrice ?? item.price),
      semiWholesalePrice: String(item.semiWholesalePrice ?? item.price),
      wholesalePrice: String(item.wholesalePrice ?? item.price),
      cost: String(item.cost),
      stockQuantity: String((item as any).stockQuantity ?? 0),
      unit: item.unit || "pcs",
      isActive: item.isActive !== false,
      allowSale: item.allowSale !== false && !item.blockSale,
      allowPurchase: item.allowPurchase !== false,
      allowDiscount: item.allowDiscount !== false && !item.blockDiscount,
      maxDiscountPercent: String(item.maxDiscountPercent ?? 10),
      allowGift: item.allowGift !== false && !item.blockFreeGift,
      expiryRequired: Boolean(item.expiryRequired || item.trackExpiry),
      posVisibility: item.posVisibility !== false,
    });
    setIsEditing(true);
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!item) return;
    setIsSaving(true);
    setEditError(null);
    try {
      const updated = await updateItemRequest(item.id, {
        name: editFormData.nameEn || editFormData.name,
        nameEn: editFormData.nameEn,
        nameAr: editFormData.nameAr,
        sku: editFormData.sku.trim(),
        barcode: editFormData.barcode.trim() || undefined,
        category: editFormData.category,
        subCategory: editFormData.subCategory || undefined,
        brand: editFormData.brand.trim() || undefined,
        countryOfOrigin: editFormData.countryOfOrigin.trim() || undefined,
        imageUrl: editFormData.imageUrl.trim() || undefined,
        price: parseFloat(editFormData.price) || 0,
        retailPrice: parseFloat(editFormData.retailPrice) || parseFloat(editFormData.price) || 0,
        semiWholesalePrice: parseFloat(editFormData.semiWholesalePrice) || parseFloat(editFormData.price) || 0,
        wholesalePrice: parseFloat(editFormData.wholesalePrice) || parseFloat(editFormData.price) || 0,
        cost: parseFloat(editFormData.cost) || 0,
        stockQuantity: parseInt(editFormData.stockQuantity, 10) || 0,
        unit: editFormData.unit.trim() || "pcs",
        isActive: editFormData.isActive,
        allowSale: editFormData.allowSale,
        allowPurchase: editFormData.allowPurchase,
        allowDiscount: editFormData.allowDiscount,
        maxDiscountPercent: parseFloat(editFormData.maxDiscountPercent) || 10,
        allowGift: editFormData.allowGift,
        expiryRequired: editFormData.expiryRequired,
        posVisibility: editFormData.posVisibility,
      });
      setItem(updated);
      setIsEditing(false);
    } catch (err) {
      setEditError(err instanceof Error ? err.message : "Failed to update item master record");
    } finally {
      setIsSaving(false);
    }
  };

  const handleToggleActive = async () => {
    if (!item) return;
    try {
      const updated = await toggleItemActiveRequest(item.id);
      setItem(updated);
    } catch (err) {
      alert("Failed to toggle status");
    }
  };

  if (isLoading) {
    return (
      <div className="p-12 text-center text-xs font-bold text-slate-400">
        Loading Item Master Record...
      </div>
    );
  }

  if (error || notFound || !item) {
    return (
      <div className="p-8 space-y-4 max-w-xl mx-auto text-center" dir={dir}>
        <AlertCircle className="h-10 w-10 text-red-500 mx-auto" />
        <h2 className="text-base font-bold text-slate-900">
          {error || (isAr ? "الصنف غير موجود أو تم حذفه" : "Item not found")}
        </h2>
        <Link
          href="/inventory"
          className="inline-flex items-center gap-1.5 rounded-xl bg-black px-4 py-2 text-xs font-bold text-[#FDCE0C]"
        >
          {isAr ? "← الرجوع لسجل المخزون" : "← Back to Inventory"}
        </Link>
      </div>
    );
  }

  const isInactive = item.isActive === false;
  const saleDisabled = item.allowSale === false || item.blockSale === true;
  const purchaseDisabled = item.allowPurchase === false;
  const discountBlocked = item.allowDiscount === false || item.blockDiscount === true;
  const giftBlocked = item.allowGift === false || item.blockFreeGift === true;
  const posHidden = item.posVisibility === false;
  const expiryReq = item.expiryRequired || item.trackExpiry;

  const currentCategoryObj = categoriesList.find((c) => c.code === item.category || c.id === item.category);

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6" dir={dir}>
      {/* 1. Header with Breadcrumbs & Action Buttons */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-slate-200 pb-4 gap-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Link
              href="/inventory"
              className="text-xs font-bold text-slate-500 hover:text-slate-900"
            >
              {isAr ? "المخزون" : "Inventory"}
            </Link>
            <span className="text-slate-300">/</span>
            <span className="text-xs font-mono font-bold text-amber-600">{item.sku}</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900">
            {item.nameEn || item.name}
          </h1>
          <p className="text-sm font-semibold text-slate-500">
            {item.nameAr || item.name}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Soft Active / Inactive Toggle */}
          <button
            type="button"
            onClick={handleToggleActive}
            className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-black transition-all ${
              isInactive
                ? "bg-red-100 text-red-700 hover:bg-red-200"
                : "bg-emerald-100 text-emerald-800 hover:bg-emerald-200"
            }`}
          >
            <Power className="h-4 w-4" />
            <span>{isInactive ? (isAr ? "صنف معطل (تفعيل)" : "Inactive (Activate)") : (isAr ? "صنف نشط (تعطيل)" : "Active (Deactivate)")}</span>
          </button>

          {/* Edit Button */}
          <button
            type="button"
            onClick={openEditModal}
            className="inline-flex items-center gap-1.5 rounded-xl bg-black text-[#FDCE0C] px-5 py-2 text-xs font-bold shadow-sm hover:bg-slate-900"
          >
            <Edit2 className="h-3.5 w-3.5" />
            <span>{isAr ? "تعديل بطاقة الصنف" : "Edit Item Master"}</span>
          </button>
        </div>
      </div>

      {/* 2. Grid Overview: Product Specs & Governance Status */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column: Product Thumbnail & Core IDs */}
        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-2xs space-y-4">
          <div className="aspect-square w-full rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center overflow-hidden">
            {item.imageUrl ? (
              <img
                src={item.imageUrl}
                alt={item.name}
                className="h-full w-full object-cover"
              />
            ) : (
              <Package className="h-16 w-16 text-slate-300" />
            )}
          </div>

          <div className="space-y-2 pt-2 border-t border-slate-100 text-xs">
            <div className="flex justify-between py-1 border-b border-slate-50">
              <span className="font-semibold text-slate-500">{isAr ? "رمز الصنف (SKU)" : "SKU Code"}</span>
              <span className="font-mono font-bold text-slate-900">{item.sku}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-50">
              <span className="font-semibold text-slate-500">{isAr ? "الباركود" : "Barcode"}</span>
              <span className="font-mono font-bold text-slate-900">{item.barcode || "-"}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-50">
              <span className="font-semibold text-slate-500">{isAr ? "العلامة التجارية" : "Brand"}</span>
              <span className="font-bold text-slate-900">{item.brand || "Bin Essa"}</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="font-semibold text-slate-500">{isAr ? "بلد المنشأ" : "Country of Origin"}</span>
              <span className="font-bold text-slate-900">{item.countryOfOrigin || "Kuwait"}</span>
            </div>
          </div>
        </div>

        {/* Middle Column: Pricing, Costs & Stock */}
        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-2xs space-y-4">
          <h3 className="font-bold text-sm text-slate-900 pb-2 border-b border-slate-100">
            {isAr ? "الأسعار والتكاليف ورصيد المخزون" : "Pricing, Cost & Stock Levels"}
          </h3>

          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 rounded-2xl bg-amber-50/60 border border-amber-200">
              <p className="text-[10px] font-bold uppercase text-amber-800">{isAr ? "سعر البيع الأساسي" : "Retail Sell Price"}</p>
              <p className="numeric-ltr text-lg font-black text-slate-950 mt-1">
                {formatKD(item.price)} <span className="text-xs text-amber-700">KD</span>
              </p>
            </div>

            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
              <p className="text-[10px] font-bold uppercase text-slate-500">{isAr ? "سعر التكلفة" : "Unit Cost"}</p>
              <p className="numeric-ltr text-lg font-bold text-slate-800 mt-1">
                {formatKD(item.cost)} <span className="text-xs text-slate-400">KD</span>
              </p>
            </div>

            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
              <p className="text-[10px] font-bold uppercase text-slate-500">{isAr ? "سعر الجملة" : "Wholesale Price"}</p>
              <p className="numeric-ltr text-base font-bold text-slate-800 mt-1">
                {formatKD(item.wholesalePrice || item.price)} <span className="text-xs text-slate-400">KD</span>
              </p>
            </div>

            <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200">
              <p className="text-[10px] font-bold uppercase text-emerald-800">{isAr ? "إجمالي المخزون" : "Total Stock"}</p>
              <p className="numeric-ltr text-lg font-black text-emerald-900 mt-1">
                {item.stockQuantity ?? 0} <span className="text-xs text-emerald-700">{item.unit || "pcs"}</span>
              </p>
            </div>
          </div>

          <div className="p-3 rounded-2xl border border-slate-200 bg-slate-50 space-y-1.5 text-xs">
            <p className="font-bold text-slate-800">{isAr ? "الفئة والتصنيف الهيكلي:" : "Category Hierarchy:"}</p>
            <p className="text-slate-600">
              <span className="font-semibold">{isAr ? "الفئة الرئيسية: " : "Main Category: "}</span>
              {isAr ? currentCategoryObj?.nameAr : currentCategoryObj?.nameEn || item.category}
            </p>
            <p className="text-slate-600">
              <span className="font-semibold">{isAr ? "الفئة الفرعية: " : "Subcategory: "}</span>
              {item.subCategory || "-"}
            </p>
          </div>
        </div>

        {/* Right Column: 17 Operational Controls Matrix */}
        <div className="rounded-3xl border border-amber-300 bg-amber-50/30 p-5 shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-amber-200 pb-2">
            <h3 className="font-black text-sm text-slate-900 flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4 text-amber-600" />
              <span>{isAr ? "مصفوفة ضوابط التشغيل" : "Operational Controls"}</span>
            </h3>
            <span className="text-[10px] font-bold text-amber-800">17 Governance Attributes</span>
          </div>

          <div className="space-y-2 text-xs">
            {/* Allow Sale */}
            <div className="flex items-center justify-between p-2 rounded-xl bg-white border border-slate-200">
              <div>
                <p className="font-bold text-slate-900">{isAr ? "السماح بالبيع في POS" : "Allow Sale at POS"}</p>
                <p className="text-[10px] text-slate-400">{isAr ? "السماح للكاشير بإتمام البيع" : "Cashier sale authorization"}</p>
              </div>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${saleDisabled ? "bg-red-100 text-red-700" : "bg-emerald-100 text-emerald-800"}`}>
                {saleDisabled ? (isAr ? "ممنوع البيع" : "Disabled") : (isAr ? "مسموح" : "Allowed")}
              </span>
            </div>

            {/* Allow Purchase */}
            <div className="flex items-center justify-between p-2 rounded-xl bg-white border border-slate-200">
              <div>
                <p className="font-bold text-slate-900">{isAr ? "السماح بالشراء (POs)" : "Allow Purchase in POs"}</p>
                <p className="text-[10px] text-slate-400">{isAr ? "إصدار أوامر شراء للموردين" : "Vendor bill / PO selection"}</p>
              </div>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${purchaseDisabled ? "bg-red-100 text-red-700" : "bg-sky-100 text-sky-800"}`}>
                {purchaseDisabled ? (isAr ? "ممنوع الشراء" : "Disabled") : (isAr ? "مسموح" : "Allowed")}
              </span>
            </div>

            {/* Allow Discount & Max Discount % */}
            <div className="flex items-center justify-between p-2 rounded-xl bg-white border border-slate-200">
              <div>
                <p className="font-bold text-slate-900">{isAr ? "السماح بالخصم" : "Allow Discount"}</p>
                <p className="text-[10px] text-slate-400">
                  {discountBlocked ? (isAr ? "ممنوع الخصم" : "Blocked") : `${isAr ? "الحد الأقصى:" : "Max Disc:"} ${item.maxDiscountPercent || 10}%`}
                </p>
              </div>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${discountBlocked ? "bg-stone-100 text-stone-600" : "bg-amber-100 text-amber-800"}`}>
                {discountBlocked ? (isAr ? "ممنوع" : "Blocked") : `${item.maxDiscountPercent || 10}% Cap`}
              </span>
            </div>

            {/* Allow Gift */}
            <div className="flex items-center justify-between p-2 rounded-xl bg-white border border-slate-200">
              <div>
                <p className="font-bold text-slate-900">{isAr ? "السماح كهدية ترويجية" : "Allow Gift (100% Free)"}</p>
                <p className="text-[10px] text-slate-400">{isAr ? "إمكانية إضافته كهدية في POS" : "Free promotional gift line"}</p>
              </div>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${giftBlocked ? "bg-stone-100 text-stone-600" : "bg-yellow-100 text-yellow-900"}`}>
                {giftBlocked ? (isAr ? "ممنوع كهدية" : "Blocked") : (isAr ? "مسموح كهدية" : "Allowed")}
              </span>
            </div>

            {/* POS Visibility */}
            <div className="flex items-center justify-between p-2 rounded-xl bg-white border border-slate-200">
              <div>
                <p className="font-bold text-slate-900">{isAr ? "الظهور في كاشير POS" : "POS Visibility"}</p>
                <p className="text-[10px] text-slate-400">{isAr ? "الظهور في واجهة البيع السريع" : "Visibility on cashier product grid"}</p>
              </div>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${posHidden ? "bg-slate-200 text-slate-700" : "bg-emerald-100 text-emerald-800"}`}>
                {posHidden ? (isAr ? "مخفي من POS" : "Hidden") : (isAr ? "ظاهر في POS" : "Visible")}
              </span>
            </div>

            {/* Expiry Required */}
            <div className="flex items-center justify-between p-2 rounded-xl bg-white border border-slate-200">
              <div>
                <p className="font-bold text-slate-900">{isAr ? "مطلوب تاريخ الصلاحية" : "Expiry Tracking"}</p>
                <p className="text-[10px] text-slate-400">{isAr ? "تتبع الباتشات والصلاحية" : "Batch/Expiry verification"}</p>
              </div>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${expiryReq ? "bg-purple-100 text-purple-800" : "bg-slate-100 text-slate-600"}`}>
                {expiryReq ? (isAr ? "إلزامي" : "Required") : (isAr ? "غير إلزامي" : "Optional")}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Branch Stock Allocation (14 Branches Overview) */}
      <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-2xs space-y-3">
        <h3 className="font-bold text-sm text-slate-900 pb-2 border-b border-slate-100 flex items-center gap-2">
          <Building2 className="h-4 w-4 text-amber-500" />
          <span>{isAr ? "توزيع المخزون عبر الفروع الـ 14 والمستودع الرئيسي" : "Branch Stock Distribution Across 14 Branches"}</span>
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2.5">
          {branches.map((b) => (
            <div key={b.id} className="p-2.5 rounded-xl border border-slate-100 bg-slate-50/70 text-center">
              <p className="text-[10px] font-bold text-slate-500 truncate">{isAr ? b.nameAr : b.nameEn}</p>
              <p className="numeric-ltr text-sm font-black text-slate-900 mt-1">
                {b.id === "br-01" ? (item.stockQuantity ?? 10) : 0} <span className="text-[9px] text-slate-400">{item.unit || "pcs"}</span>
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Edit Modal */}
      {isEditing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="flex max-h-[92vh] w-full max-w-3xl flex-col rounded-3xl bg-white shadow-2xl overflow-hidden border border-slate-200 text-xs">
            <div className="flex items-center justify-between border-b border-black/10 bg-[#0B0F17] p-4 px-6 text-white">
              <div className="flex items-center gap-2">
                <Edit2 className="h-5 w-5 text-[#FDCE0C]" />
                <h3 className="text-base font-bold text-white">
                  {isAr ? "تعديل بطاقة الصنف" : "Edit Item Master"}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white"
              >
                ✕
              </button>
            </div>

            {editError && (
              <div className="mx-6 mt-4 p-3 rounded-xl bg-red-50 border border-red-200 text-xs font-bold text-red-700">
                {editError}
              </div>
            )}

            <form onSubmit={handleSaveEdit} className="flex-1 overflow-y-auto p-6 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">Item Name (EN)</label>
                  <input
                    type="text"
                    required
                    value={editFormData.nameEn}
                    onChange={(e) => setEditFormData({ ...editFormData, nameEn: e.target.value })}
                    className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1 text-end">اسم الصنف (AR)</label>
                  <input
                    type="text"
                    required
                    value={editFormData.nameAr}
                    onChange={(e) => setEditFormData({ ...editFormData, nameAr: e.target.value })}
                    className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs text-end"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">SKU</label>
                  <input
                    type="text"
                    required
                    value={editFormData.sku}
                    onChange={(e) => setEditFormData({ ...editFormData, sku: e.target.value })}
                    className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">Barcode</label>
                  <input
                    type="text"
                    value={editFormData.barcode}
                    onChange={(e) => setEditFormData({ ...editFormData, barcode: e.target.value })}
                    className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">Brand</label>
                  <input
                    type="text"
                    value={editFormData.brand}
                    onChange={(e) => setEditFormData({ ...editFormData, brand: e.target.value })}
                    className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <label className="flex items-center gap-2 p-2.5 rounded-xl border border-slate-200 bg-slate-50">
                  <input
                    type="checkbox"
                    checked={editFormData.allowSale}
                    onChange={(e) => setEditFormData({ ...editFormData, allowSale: e.target.checked })}
                  />
                  <span className="font-bold text-slate-800">Allow Sale</span>
                </label>
                <label className="flex items-center gap-2 p-2.5 rounded-xl border border-slate-200 bg-slate-50">
                  <input
                    type="checkbox"
                    checked={editFormData.allowPurchase}
                    onChange={(e) => setEditFormData({ ...editFormData, allowPurchase: e.target.checked })}
                  />
                  <span className="font-bold text-slate-800">Allow Purchase</span>
                </label>
                <label className="flex items-center gap-2 p-2.5 rounded-xl border border-slate-200 bg-slate-50">
                  <input
                    type="checkbox"
                    checked={editFormData.allowDiscount}
                    onChange={(e) => setEditFormData({ ...editFormData, allowDiscount: e.target.checked })}
                  />
                  <span className="font-bold text-slate-800">Allow Discount</span>
                </label>
                <label className="flex items-center gap-2 p-2.5 rounded-xl border border-slate-200 bg-slate-50">
                  <input
                    type="checkbox"
                    checked={editFormData.allowGift}
                    onChange={(e) => setEditFormData({ ...editFormData, allowGift: e.target.checked })}
                  />
                  <span className="font-bold text-slate-800">Allow Gift</span>
                </label>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">Sell Price (KD)</label>
                  <input
                    type="number"
                    step="0.001"
                    required
                    value={editFormData.price}
                    onChange={(e) => setEditFormData({ ...editFormData, price: e.target.value })}
                    className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs font-black"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">Cost Price (KD)</label>
                  <input
                    type="number"
                    step="0.001"
                    required
                    value={editFormData.cost}
                    onChange={(e) => setEditFormData({ ...editFormData, cost: e.target.value })}
                    className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">Max Disc %</label>
                  <input
                    type="number"
                    min={0}
                    max={100}
                    value={editFormData.maxDiscountPercent}
                    onChange={(e) => setEditFormData({ ...editFormData, maxDiscountPercent: e.target.value })}
                    className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs font-bold"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="rounded-xl border border-slate-300 px-4 py-2 text-xs font-bold text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="rounded-xl bg-black text-[#FDCE0C] px-5 py-2 text-xs font-bold"
                >
                  {isSaving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}