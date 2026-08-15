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
  UploadCloud,
  Trash2,
  Link2,
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
  const [editImageMode, setEditImageMode] = useState<"file" | "url">("file");
  const [editImageFileName, setEditImageFileName] = useState<string>("");

  const handleEditImageFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setEditImageFileName(file.name);
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setEditFormData((prev) => ({ ...prev, imageUrl: event.target?.result as string }));
      }
    };
    reader.readAsDataURL(file);
  };

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
    setEditImageFileName("");
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

    const price = Number(editFormData.price);
    const cost = Number(editFormData.cost);

    if (Number.isNaN(price) || price < 0) {
      setEditError(isAr ? "سعر البيع غير صحيح" : "Sell price is invalid.");
      setIsSaving(false);
      return;
    }
    if (Number.isNaN(cost) || cost < 0) {
      setEditError(isAr ? "سعر التكلفة غير صحيح" : "Cost price is invalid.");
      setIsSaving(false);
      return;
    }

    try {
      await updateItemRequest(item.id, {
        name: editFormData.nameEn.trim() || editFormData.nameAr.trim(),
        nameEn: editFormData.nameEn.trim() || editFormData.nameAr.trim(),
        nameAr: editFormData.nameAr.trim() || editFormData.nameEn.trim(),
        sku: editFormData.sku.trim(),
        barcode: editFormData.barcode.trim() || undefined,
        category: editFormData.category,
        subCategory: editFormData.subCategory || undefined,
        brand: editFormData.brand.trim() || undefined,
        countryOfOrigin: editFormData.countryOfOrigin.trim() || undefined,
        imageUrl: editFormData.imageUrl.trim() || undefined,
        price,
        cost,
        unit: editFormData.unit.trim() || "pcs",
        retailPrice: Number(editFormData.retailPrice) || price,
        semiWholesalePrice: Number(editFormData.semiWholesalePrice) || price,
        wholesalePrice: Number(editFormData.wholesalePrice) || price,
        isActive: editFormData.isActive,
        allowSale: editFormData.allowSale,
        allowPurchase: editFormData.allowPurchase,
        allowDiscount: editFormData.allowDiscount,
        maxDiscountPercent: Number(editFormData.maxDiscountPercent) || 10,
        allowGift: editFormData.allowGift,
        expiryRequired: editFormData.expiryRequired,
        posVisibility: editFormData.posVisibility,
        blockDiscount: !editFormData.allowDiscount,
        blockFreeGift: !editFormData.allowGift,
        blockSale: !editFormData.allowSale,
        trackExpiry: editFormData.expiryRequired,
      });
      setIsEditing(false);
      await fetchItem();
    } catch (err) {
      setEditError(err instanceof Error ? err.message : "Failed to update item record");
    } finally {
      setIsSaving(false);
    }
  };

  const handleToggleActive = async () => {
    if (!item) return;
    try {
      await toggleItemActiveRequest(item.id);
      await fetchItem();
    } catch (err) {
      setError("Failed to toggle item status");
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center p-6 text-slate-800">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-amber-500 border-t-transparent" />
          <p className="text-xs font-bold text-slate-600">
            {isAr ? "جاري تحميل بطاقة الصنف..." : "Loading Item Master Record..."}
          </p>
        </div>
      </div>
    );
  }

  if (notFound || !item) {
    return (
      <div className="max-w-2xl mx-auto p-12 text-center text-slate-900" dir={dir}>
        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <Package className="h-12 w-12 text-slate-400 mx-auto mb-3" />
          <h2 className="text-lg font-bold text-slate-900 mb-1">
            {isAr ? "لم يتم العثور على بطاقة الصنف" : "Item Master Record Not Found"}
          </h2>
          <p className="text-xs text-slate-500 mb-4">
            {isAr
              ? "الصنف المطلوب غير مسجل في قاعدة البيانات المركزية أو تم حذفه."
              : "The requested item code does not exist in the centralized product catalog."}
          </p>
          <Link
            href="/inventory"
            className="inline-flex items-center gap-2 rounded-xl bg-black text-[#FDCE0C] px-5 py-2.5 text-xs font-bold hover:bg-slate-900 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>{isAr ? "العودة لسجل المخزون" : "Return to Inventory"}</span>
          </Link>
        </div>
      </div>
    );
  }

  const categoryObj = categoriesList.find((c) => c.code === item.category || c.id === item.category);
  const categoryName = isAr ? (categoryObj?.nameAr || item.category) : (categoryObj?.nameEn || item.category);
  const subCategoryObj = categoryObj?.subcategories?.find((s) => s.code === item.subCategory || s.id === item.subCategory);
  const subCategoryName = isAr ? (subCategoryObj?.nameAr || item.subCategory) : (subCategoryObj?.nameEn || item.subCategory);

  const discountBlocked = item.blockDiscount || item.allowDiscount === false;
  const giftBlocked = item.blockFreeGift || item.allowGift === false;
  const saleDisabled = item.blockSale || item.allowSale === false;
  const purchaseDisabled = item.allowPurchase === false;
  const posHidden = item.posVisibility === false;
  const expiryReq = item.expiryRequired || item.trackExpiry;

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6 text-slate-900" dir={dir}>
      {/* Top Breadcrumb & Actions Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-slate-200 pb-4 gap-3">
        <div className="flex items-center gap-3">
          <Link
            href="/inventory"
            className="rounded-xl border border-slate-300 bg-white p-2 text-slate-700 hover:bg-slate-100 transition-colors"
            title="Back"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-black text-slate-900">
                {isAr ? (item.nameAr || item.name) : (item.nameEn || item.name)}
              </h1>
              <span
                className={`rounded-full px-2.5 py-0.5 text-xs font-black ${
                  item.isActive !== false
                    ? "bg-emerald-100 text-emerald-800"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {item.isActive !== false ? (isAr ? "نشط" : "Active") : (isAr ? "معطل" : "Inactive")}
              </span>
            </div>
            <p className="text-xs font-mono text-slate-500 mt-0.5">
              SKU: <span className="font-bold text-slate-800">{item.sku}</span> | Barcode:{" "}
              <span className="font-bold text-slate-800">{item.barcode || "N/A"}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleToggleActive}
            className={`inline-flex items-center gap-1.5 rounded-xl border px-3.5 py-2 text-xs font-bold transition-colors ${
              item.isActive !== false
                ? "border-red-200 bg-red-50 text-red-700 hover:bg-red-100"
                : "border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
            }`}
          >
            <Power className="h-3.5 w-3.5" />
            <span>{item.isActive !== false ? (isAr ? "تعطيل الصنف" : "Deactivate") : (isAr ? "تفعيل الصنف" : "Activate")}</span>
          </button>

          <button
            type="button"
            onClick={openEditModal}
            className="inline-flex items-center gap-1.5 rounded-xl bg-black text-[#FDCE0C] px-4 py-2 text-xs font-bold hover:bg-slate-900 transition-colors shadow-2xs"
          >
            <Edit2 className="h-3.5 w-3.5" />
            <span>{isAr ? "تعديل بطاقة الصنف" : "Edit Item Master"}</span>
          </button>
        </div>
      </div>

      {/* Main Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column: Product Card & Hierarchy (1 col) */}
        <div className="space-y-4">
          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-2xs space-y-4">
            <div className="aspect-square rounded-2xl bg-slate-50 border border-slate-200 overflow-hidden flex items-center justify-center p-2">
              {item.imageUrl ? (
                <img
                  src={item.imageUrl}
                  alt={item.name}
                  className="h-full w-full object-contain rounded-xl"
                />
              ) : (
                <Package className="h-16 w-16 text-slate-300" />
              )}
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between border-b border-slate-100 pb-1.5">
                <span className="text-slate-500">{isAr ? "العلامة التجارية" : "Brand"}</span>
                <span className="font-bold text-slate-900">{item.brand || "Bin Essa"}</span>
              </div>
              <div className="flex justify-between border-b border-slate-100 pb-1.5">
                <span className="text-slate-500">{isAr ? "بلد المنشأ" : "Origin"}</span>
                <span className="font-bold text-slate-900">{item.countryOfOrigin || "Kuwait"}</span>
              </div>
              <div className="flex justify-between border-b border-slate-100 pb-1.5">
                <span className="text-slate-500">{isAr ? "الفئة الرئيسية" : "Category"}</span>
                <span className="font-bold text-amber-600">{categoryName}</span>
              </div>
              {subCategoryName && (
                <div className="flex justify-between border-b border-slate-100 pb-1.5">
                  <span className="text-slate-500">{isAr ? "الفئة الفرعية" : "Sub Category"}</span>
                  <span className="font-bold text-slate-800">{subCategoryName}</span>
                </div>
              )}
              <div className="flex justify-between pt-1">
                <span className="text-slate-500">{isAr ? "الوحدة الأساسية" : "Base Unit"}</span>
                <span className="font-bold text-slate-900">{item.unit || "pcs"}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Pricing & Master Operational Controls (2 cols) */}
        <div className="md:col-span-2 space-y-4">
          {/* Pricing Grid */}
          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-2xs space-y-3">
            <h3 className="font-bold text-sm text-slate-900 pb-2 border-b border-slate-100 flex items-center gap-2">
              <Tag className="h-4 w-4 text-amber-500" />
              <span>{isAr ? "هيكل الأسعار والتكاليف (د.ك)" : "Price & Cost Structure (KD)"}</span>
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3 rounded-2xl bg-amber-50/50 border border-amber-200">
                <p className="text-[10px] font-bold uppercase tracking-wider text-amber-900">
                  {isAr ? "سعر البيع (مفرق)" : "Retail Price"}
                </p>
                <p className="numeric-ltr text-lg font-black text-slate-900 mt-1">
                  {formatKD(item.price)} <span className="text-[10px] text-slate-500">KD</span>
                </p>
              </div>

              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-600">
                  {isAr ? "سعر التكلفة" : "Cost Price"}
                </p>
                <p className="numeric-ltr text-lg font-black text-slate-900 mt-1">
                  {formatKD(item.cost)} <span className="text-[10px] text-slate-500">KD</span>
                </p>
              </div>

              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-600">
                  {isAr ? "سعر الجملة" : "Wholesale Price"}
                </p>
                <p className="numeric-ltr text-lg font-black text-slate-900 mt-1">
                  {formatKD(item.wholesalePrice || item.price)} <span className="text-[10px] text-slate-500">KD</span>
                </p>
              </div>

              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-600">
                  {isAr ? "نصف الجملة" : "Semi-Wholesale"}
                </p>
                <p className="numeric-ltr text-lg font-black text-slate-900 mt-1">
                  {formatKD(item.semiWholesalePrice || item.price)} <span className="text-[10px] text-slate-500">KD</span>
                </p>
              </div>
            </div>
          </div>

          {/* Operational Governance Summary */}
          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-2xs space-y-3">
            <h3 className="font-bold text-sm text-slate-900 pb-2 border-b border-slate-100 flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-emerald-600" />
              <span>{isAr ? "ضوابط التشغيل والحوكمة في POS والعمليات" : "Operational Governance & Rules"}</span>
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
              <div className="flex items-center justify-between p-2 rounded-xl bg-white border border-slate-200">
                <div>
                  <p className="font-bold text-slate-900">{isAr ? "السماح بالبيع في POS" : "Allow Sale at POS"}</p>
                  <p className="text-[10px] text-slate-500">{isAr ? "السماح للكاشير بإتمام البيع" : "Cashier sale authorization"}</p>
                </div>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${saleDisabled ? "bg-red-100 text-red-700" : "bg-emerald-100 text-emerald-800"}`}>
                  {saleDisabled ? (isAr ? "ممنوع البيع" : "Disabled") : (isAr ? "مسموح" : "Allowed")}
                </span>
              </div>

              <div className="flex items-center justify-between p-2 rounded-xl bg-white border border-slate-200">
                <div>
                  <p className="font-bold text-slate-900">{isAr ? "السماح بالشراء (POs)" : "Allow Purchase in POs"}</p>
                  <p className="text-[10px] text-slate-500">{isAr ? "إصدار أوامر شراء للموردين" : "Vendor bill / PO selection"}</p>
                </div>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${purchaseDisabled ? "bg-red-100 text-red-700" : "bg-sky-100 text-sky-800"}`}>
                  {purchaseDisabled ? (isAr ? "ممنوع الشراء" : "Disabled") : (isAr ? "مسموح" : "Allowed")}
                </span>
              </div>

              <div className="flex items-center justify-between p-2 rounded-xl bg-white border border-slate-200">
                <div>
                  <p className="font-bold text-slate-900">{isAr ? "السماح بالخصم" : "Allow Discount"}</p>
                  <p className="text-[10px] text-slate-500">
                    {discountBlocked ? (isAr ? "ممنوع الخصم" : "Blocked") : `${isAr ? "الحد الأقصى:" : "Max Disc:"} ${item.maxDiscountPercent || 10}%`}
                  </p>
                </div>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${discountBlocked ? "bg-stone-100 text-stone-600" : "bg-amber-100 text-amber-800"}`}>
                  {discountBlocked ? (isAr ? "ممنوع" : "Blocked") : `${item.maxDiscountPercent || 10}% Cap`}
                </span>
              </div>

              <div className="flex items-center justify-between p-2 rounded-xl bg-white border border-slate-200">
                <div>
                  <p className="font-bold text-slate-900">{isAr ? "السماح كهدية ترويجية" : "Allow Gift (100% Free)"}</p>
                  <p className="text-[10px] text-slate-500">{isAr ? "إمكانية إضافته كهدية في POS" : "Free promotional gift line"}</p>
                </div>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${giftBlocked ? "bg-stone-100 text-stone-600" : "bg-yellow-100 text-yellow-900"}`}>
                  {giftBlocked ? (isAr ? "ممنوع كهدية" : "Blocked") : (isAr ? "مسموح كهدية" : "Allowed")}
                </span>
              </div>

              <div className="flex items-center justify-between p-2 rounded-xl bg-white border border-slate-200">
                <div>
                  <p className="font-bold text-slate-900">{isAr ? "الظهور في كاشير POS" : "POS Visibility"}</p>
                  <p className="text-[10px] text-slate-500">{isAr ? "الظهور في واجهة البيع السريع" : "Visibility on cashier product grid"}</p>
                </div>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${posHidden ? "bg-slate-200 text-slate-700" : "bg-emerald-100 text-emerald-800"}`}>
                  {posHidden ? (isAr ? "مخفي من POS" : "Hidden") : (isAr ? "ظاهر في POS" : "Visible")}
                </span>
              </div>

              <div className="flex items-center justify-between p-2 rounded-xl bg-white border border-slate-200">
                <div>
                  <p className="font-bold text-slate-900">{isAr ? "مطلوب تاريخ الصلاحية" : "Expiry Tracking"}</p>
                  <p className="text-[10px] text-slate-500">{isAr ? "تتبع الباتشات والصلاحية" : "Batch/Expiry verification"}</p>
                </div>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${expiryReq ? "bg-purple-100 text-purple-800" : "bg-slate-100 text-slate-600"}`}>
                  {expiryReq ? (isAr ? "إلزامي" : "Required") : (isAr ? "غير إلزامي" : "Optional")}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {isEditing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="flex max-h-[92vh] w-full max-w-3xl flex-col rounded-3xl bg-white shadow-2xl overflow-hidden border border-slate-200 text-xs text-slate-900">
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
                  <label className="block text-[11px] font-bold text-slate-800 mb-1">Item Name (EN)</label>
                  <input
                    type="text"
                    required
                    value={editFormData.nameEn}
                    onChange={(e) => setEditFormData({ ...editFormData, nameEn: e.target.value })}
                    className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-900 placeholder:text-slate-400 outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-800 mb-1 text-end">اسم الصنف (AR)</label>
                  <input
                    type="text"
                    required
                    value={editFormData.nameAr}
                    onChange={(e) => setEditFormData({ ...editFormData, nameAr: e.target.value })}
                    className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-900 placeholder:text-slate-400 outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 text-end"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-800 mb-1">SKU</label>
                  <input
                    type="text"
                    required
                    value={editFormData.sku}
                    onChange={(e) => setEditFormData({ ...editFormData, sku: e.target.value })}
                    className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-mono font-bold text-slate-900 placeholder:text-slate-400 outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-800 mb-1">Barcode</label>
                  <input
                    type="text"
                    value={editFormData.barcode}
                    onChange={(e) => setEditFormData({ ...editFormData, barcode: e.target.value })}
                    className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-mono text-slate-900 placeholder:text-slate-400 outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-800 mb-1">Brand</label>
                  <input
                    type="text"
                    value={editFormData.brand}
                    onChange={(e) => setEditFormData({ ...editFormData, brand: e.target.value })}
                    className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-900 placeholder:text-slate-400 outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-800 mb-1">Category</label>
                  <select
                    value={editFormData.category}
                    onChange={(e) => setEditFormData({ ...editFormData, category: e.target.value, subCategory: "" })}
                    className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-bold text-slate-900 outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                  >
                    {categoriesList.map((c) => (
                      <option key={c.id} value={c.code} className="text-slate-900 bg-white">
                        {isAr ? c.nameAr : c.nameEn}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-800 mb-1">Subcategory</label>
                  <select
                    value={editFormData.subCategory}
                    onChange={(e) => setEditFormData({ ...editFormData, subCategory: e.target.value })}
                    className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-bold text-slate-900 outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                  >
                    <option value="" className="text-slate-900 bg-white">None</option>
                    {(categoriesList.find((c) => c.code === editFormData.category)?.subcategories || []).map((s) => (
                      <option key={s.id} value={s.code} className="text-slate-900 bg-white">
                        {isAr ? s.nameAr : s.nameEn}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Product Image in Edit Modal */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-[11px] font-bold text-slate-800">Product Image</label>
                  <div className="flex items-center gap-1.5 text-[10px]">
                    <button
                      type="button"
                      onClick={() => setEditImageMode("file")}
                      className={`px-2 py-0.5 rounded font-bold ${
                        editImageMode === "file" ? "bg-amber-100 text-amber-900" : "text-slate-500"
                      }`}
                    >
                      File
                    </button>
                    <span>|</span>
                    <button
                      type="button"
                      onClick={() => setEditImageMode("url")}
                      className={`px-2 py-0.5 rounded font-bold ${
                        editImageMode === "url" ? "bg-amber-100 text-amber-900" : "text-slate-500"
                      }`}
                    >
                      URL
                    </button>
                  </div>
                </div>

                {editImageMode === "file" ? (
                  <label className="flex items-center justify-center gap-2 p-2.5 rounded-xl border border-dashed border-slate-300 bg-slate-50 hover:bg-amber-50/20 cursor-pointer">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleEditImageFile}
                      className="hidden"
                    />
                    <UploadCloud className="h-4 w-4 text-amber-500" />
                    <span className="text-xs font-bold text-slate-700">Choose new image file</span>
                  </label>
                ) : (
                  <div className="relative">
                    <Link2 className="absolute start-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                    <input
                      type="text"
                      placeholder="https://..."
                      value={editFormData.imageUrl}
                      onChange={(e) => setEditFormData({ ...editFormData, imageUrl: e.target.value })}
                      className="w-full rounded-xl border border-slate-300 bg-white ps-8 pe-3 py-2 text-xs text-slate-900 placeholder:text-slate-400 outline-none focus:border-amber-500"
                    />
                  </div>
                )}

                {editFormData.imageUrl && (
                  <div className="mt-2 flex items-center justify-between p-2 rounded-xl border border-slate-200 bg-slate-50">
                    <div className="flex items-center gap-2">
                      <img
                        src={editFormData.imageUrl}
                        alt="Preview"
                        className="h-8 w-8 rounded-lg object-cover border border-slate-300 bg-white"
                      />
                      <span className="text-[11px] font-bold text-slate-800">
                        {editImageFileName || "Image Preview"}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setEditFormData({ ...editFormData, imageUrl: "" })}
                      className="p-1 text-red-600 hover:bg-red-50 rounded"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <label className="flex items-center gap-2 p-2.5 rounded-xl border border-slate-200 bg-slate-50 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editFormData.allowSale}
                    onChange={(e) => setEditFormData({ ...editFormData, allowSale: e.target.checked })}
                    className="h-4 w-4 rounded accent-amber-500"
                  />
                  <span className="font-bold text-slate-800">Allow Sale</span>
                </label>
                <label className="flex items-center gap-2 p-2.5 rounded-xl border border-slate-200 bg-slate-50 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editFormData.allowPurchase}
                    onChange={(e) => setEditFormData({ ...editFormData, allowPurchase: e.target.checked })}
                    className="h-4 w-4 rounded accent-amber-500"
                  />
                  <span className="font-bold text-slate-800">Allow Purchase</span>
                </label>
                <label className="flex items-center gap-2 p-2.5 rounded-xl border border-slate-200 bg-slate-50 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editFormData.allowDiscount}
                    onChange={(e) => setEditFormData({ ...editFormData, allowDiscount: e.target.checked })}
                    className="h-4 w-4 rounded accent-amber-500"
                  />
                  <span className="font-bold text-slate-800">Allow Discount</span>
                </label>
                <label className="flex items-center gap-2 p-2.5 rounded-xl border border-slate-200 bg-slate-50 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editFormData.allowGift}
                    onChange={(e) => setEditFormData({ ...editFormData, allowGift: e.target.checked })}
                    className="h-4 w-4 rounded accent-amber-500"
                  />
                  <span className="font-bold text-slate-800">Allow Gift</span>
                </label>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-800 mb-1">Sell Price (KD)</label>
                  <input
                    type="number"
                    step="0.001"
                    required
                    value={editFormData.price}
                    onChange={(e) => setEditFormData({ ...editFormData, price: e.target.value })}
                    className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-black text-slate-900 placeholder:text-slate-400 outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-800 mb-1">Cost Price (KD)</label>
                  <input
                    type="number"
                    step="0.001"
                    required
                    value={editFormData.cost}
                    onChange={(e) => setEditFormData({ ...editFormData, cost: e.target.value })}
                    className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-900 placeholder:text-slate-400 outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-800 mb-1">Max Disc %</label>
                  <input
                    type="number"
                    min={0}
                    max={100}
                    value={editFormData.maxDiscountPercent}
                    onChange={(e) => setEditFormData({ ...editFormData, maxDiscountPercent: e.target.value })}
                    className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-bold text-slate-900 placeholder:text-slate-400 outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-100"
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