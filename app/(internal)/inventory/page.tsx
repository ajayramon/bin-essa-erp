"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Package,
  Plus,
  Search,
  Filter,
  SlidersHorizontal,
  FolderTree,
  Edit2,
  Eye,
  CheckCircle2,
  XCircle,
  ShieldCheck,
  ShieldAlert,
  Percent,
  Gift,
  Clock,
  Globe,
  Tag,
  Power,
} from "lucide-react";
import { useLocale } from "@/lib/i18n/LocaleContext";
import { useSession } from "@/lib/context/SessionContext";
import {
  listItemsRequest,
  updateItemRequest,
  toggleItemActiveRequest,
  listCategoriesRequest,
  type ItemResponse,
  type Category,
} from "@/lib/api";
import { CategoryManagementModal } from "@/components/inventory/CategoryManagementModal";

function formatKD(amount: number | string | undefined) {
  const num = Number(amount) || 0;
  return num.toLocaleString("en-US", {
    minimumFractionDigits: 3,
    maximumFractionDigits: 3,
  });
}

export default function InventoryItemMasterPage() {
  const { locale, t, dir } = useLocale();
  const { user } = useSession();
  const isAr = locale === "ar";
  const canViewCosts = user?.role !== "storekeeper";

  const [allItems, setAllItems] = useState<ItemResponse[]>([]);
  const [categoriesList, setCategoriesList] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filter States
  const [query, setQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [subCategoryFilter, setSubCategoryFilter] = useState<string>("all");
  const [brandFilter, setBrandFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive">("all");
  const [saleFilter, setSaleFilter] = useState<"all" | "allowSale" | "blockSale">("all");
  const [posVisibilityFilter, setPosVisibilityFilter] = useState<"all" | "visible" | "hidden">("all");
  const [stockFilter, setStockFilter] = useState<"all" | "inStock" | "lowStock" | "outOfStock">("all");

  // Category Management Modal State
  const [isCatModalOpen, setIsCatModalOpen] = useState(false);

  // Edit Modal State
  const [editingItem, setEditingItem] = useState<ItemResponse | null>(null);
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

  const loadData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [items, cats] = await Promise.all([
        listItemsRequest(),
        listCategoriesRequest(),
      ]);
      setAllItems(items);
      setCategoriesList(cats);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load item master records");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Window Focus Auto-Sync
  useEffect(() => {
    function handleFocus() {
      loadData();
    }
    window.addEventListener("focus", handleFocus);
    return () => window.removeEventListener("focus", handleFocus);
  }, [loadData]);

  // Available Filter Options
  const brands = useMemo(() => {
    return Array.from(new Set(allItems.map((i) => i.brand).filter(Boolean))) as string[];
  }, [allItems]);

  const activeCategoryObj = useMemo(() => {
    return categoriesList.find((c) => c.code === categoryFilter || c.id === categoryFilter);
  }, [categoriesList, categoryFilter]);

  const subcategoriesForFilter = useMemo(() => {
    if (!activeCategoryObj) return [];
    return activeCategoryObj.subcategories || [];
  }, [activeCategoryObj]);

  // Filtered Items
  const filteredItems = useMemo(() => {
    return allItems.filter((item) => {
      // 1. Category
      if (categoryFilter !== "all") {
        const itemCat = item.category?.toLowerCase();
        const filterCat = categoryFilter.toLowerCase();
        if (itemCat !== filterCat && item.category !== categoryFilter) return false;
      }
      // 2. Subcategory
      if (subCategoryFilter !== "all" && item.subCategory !== subCategoryFilter) {
        return false;
      }
      // 3. Brand
      if (brandFilter !== "all" && item.brand !== brandFilter) {
        return false;
      }
      // 4. Status
      if (statusFilter === "active" && item.isActive === false) return false;
      if (statusFilter === "inactive" && item.isActive !== false) return false;
      // 5. Allow Sale
      if (saleFilter === "allowSale" && (item.allowSale === false || item.blockSale === true)) return false;
      if (saleFilter === "blockSale" && item.allowSale !== false && item.blockSale !== true) return false;
      // 6. POS Visibility
      if (posVisibilityFilter === "visible" && item.posVisibility === false) return false;
      if (posVisibilityFilter === "hidden" && item.posVisibility !== false) return false;
      // 7. Stock Filter
      const stock = item.stockQuantity ?? 0;
      if (stockFilter === "inStock" && stock <= 0) return false;
      if (stockFilter === "lowStock" && (stock <= 0 || stock > 10)) return false;
      if (stockFilter === "outOfStock" && stock > 0) return false;
      // 8. Search Query
      if (query.trim()) {
        const q = query.trim().toLowerCase();
        const nameMatch = item.name?.toLowerCase().includes(q) ?? false;
        const nameEnMatch = item.nameEn?.toLowerCase().includes(q) ?? false;
        const nameArMatch = item.nameAr?.includes(q) ?? false;
        const skuMatch = item.sku?.toLowerCase().includes(q) ?? false;
        const barcodeMatch = item.barcode?.toLowerCase().includes(q) ?? false;
        const brandMatch = item.brand?.toLowerCase().includes(q) ?? false;
        if (!nameMatch && !nameEnMatch && !nameArMatch && !skuMatch && !barcodeMatch && !brandMatch) {
          return false;
        }
      }
      return true;
    });
  }, [allItems, categoryFilter, subCategoryFilter, brandFilter, statusFilter, saleFilter, posVisibilityFilter, stockFilter, query]);

  // Metrics
  const totalCount = allItems.length;
  const activeCount = allItems.filter((i) => i.isActive !== false).length;
  const inactiveCount = allItems.filter((i) => i.isActive === false).length;
  const posVisibleCount = allItems.filter((i) => i.posVisibility !== false && i.isActive !== false).length;
  const totalValuation = filteredItems.reduce((sum, i) => sum + (Number(i.cost) || 0) * (i.stockQuantity ?? 0), 0);

  // Edit Modal Handlers
  const openEditModal = (item: ItemResponse) => {
    setEditingItem(item);
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
      stockQuantity: String(item.stockQuantity ?? 0),
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
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;
    setIsSaving(true);
    setEditError(null);
    try {
      await updateItemRequest(editingItem.id, {
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
      setEditingItem(null);
      await loadData();
    } catch (err) {
      setEditError(err instanceof Error ? err.message : "Failed to update item master record");
    } finally {
      setIsSaving(false);
    }
  };

  const handleToggleItemActive = async (id: string, currentActive: boolean) => {
    try {
      await toggleItemActiveRequest(id);
      await loadData();
    } catch (err) {
      alert("Failed to toggle item status");
    }
  };

  // Helper to find category display label
  const getCategoryLabel = (catCode: string) => {
    const found = categoriesList.find((c) => c.code === catCode || c.id === catCode);
    if (!found) return catCode;
    return isAr ? found.nameAr : found.nameEn;
  };

  // Helper to find subcategory display label
  const getSubCategoryLabel = (subCode: string | undefined) => {
    if (!subCode) return "-";
    for (const cat of categoriesList) {
      const foundSub = cat.subcategories?.find((s) => s.code === subCode || s.id === subCode);
      if (foundSub) {
        return isAr ? foundSub.nameAr : foundSub.nameEn;
      }
    }
    return subCode;
  };

  return (
    <div className="space-y-6 p-6" dir={dir}>
      {/* 1. Header with Title & Master Actions */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-ink/10 pb-5">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-bold text-ink">
              {isAr ? "سجل بطاقة الأصناف (Item Master)" : "Inventory Item Master"}
            </h1>
            <span className="rounded-full bg-black text-[#FDCE0C] px-2.5 py-0.5 text-xs font-black">
              17 Controls Active
            </span>
          </div>
          <p className="mt-1 text-xs text-ink/70">
            {isAr
              ? "إدارة بطاقات الأصناف الرئيسية، الفئات والفئات الفرعية، وضوابط البيع والشراء والخصومات ونقاط البيع"
              : "Enterprise product master records, bilingual cataloging, Category/Subcategory hierarchy, and operational POS governance."}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Manage Categories Button */}
          <button
            type="button"
            onClick={() => setIsCatModalOpen(true)}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-xs font-bold text-slate-800 shadow-2xs hover:bg-slate-50 hover:border-slate-400 transition-colors"
          >
            <FolderTree className="h-4 w-4 text-amber-600" />
            <span>{isAr ? "إدارة الفئات والفئات الفرعية" : "Categories & Subcategories"}</span>
          </button>

          {/* Add New Item Button */}
          <Link
            href="/inventory/new"
            className="inline-flex items-center gap-1.5 rounded-xl bg-black px-4 py-2.5 text-xs font-bold text-[#FDCE0C] shadow-sm hover:bg-slate-900 transition-colors"
          >
            <Plus className="h-4 w-4" />
            <span>{isAr ? "+ إضافة صنف جديد (Item Master)" : "+ Add New Item Record"}</span>
          </Link>
        </div>
      </div>

      {/* 2. KPI Summary Cards */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
        <div className="rounded-2xl border border-ink/10 bg-white p-4 shadow-2xs">
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
            {isAr ? "إجمالي الأصناف" : "Total Master SKUs"}
          </p>
          <p className="numeric-ltr mt-1 text-2xl font-black text-slate-900">{totalCount}</p>
        </div>

        <div className="rounded-2xl border border-ink/10 bg-white p-4 shadow-2xs">
          <p className="text-[11px] font-bold uppercase tracking-wider text-emerald-600">
            {isAr ? "الأصناف النشطة" : "Active Items"}
          </p>
          <p className="numeric-ltr mt-1 text-2xl font-black text-emerald-700">{activeCount}</p>
        </div>

        <div className="rounded-2xl border border-ink/10 bg-white p-4 shadow-2xs">
          <p className="text-[11px] font-bold uppercase tracking-wider text-red-500">
            {isAr ? "الأصناف المعطلة" : "Inactive Items"}
          </p>
          <p className="numeric-ltr mt-1 text-2xl font-black text-red-600">{inactiveCount}</p>
        </div>

        <div className="rounded-2xl border border-ink/10 bg-white p-4 shadow-2xs">
          <p className="text-[11px] font-bold uppercase tracking-wider text-amber-600">
            {isAr ? "الظاهرة في POS" : "POS Active Items"}
          </p>
          <p className="numeric-ltr mt-1 text-2xl font-black text-amber-600">{posVisibleCount}</p>
        </div>

        <div className="rounded-2xl border border-ink/10 bg-white p-4 shadow-2xs">
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
            {isAr ? "تقييم المخزون الإجمالي" : "Filtered Valuation (KD)"}
          </p>
          <p className="numeric-ltr mt-1 text-xl font-black text-slate-900">
            {formatKD(totalValuation)} <span className="text-xs text-amber-600">KD</span>
          </p>
        </div>
      </div>

      {/* 3. Search & Multi-Filter Control Bar */}
      <div className="rounded-2xl border border-ink/10 bg-white p-4 shadow-2xs space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          {/* Main Search Input */}
          <div className="md:col-span-4 relative">
            <Search className="absolute start-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={
                isAr
                  ? "بحث بالاسم العربي/الإنجليزي، رمز SKU، الباركود، العلامة التجارية..."
                  : "Search SKU, barcode, English/Arabic name, brand..."
              }
              className="w-full rounded-xl border border-slate-300 bg-white ps-9 pe-3 py-2 text-xs font-semibold text-slate-900 placeholder:text-slate-400 outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
            />
          </div>

          {/* Category Filter */}
          <div className="md:col-span-2">
            <select
              value={categoryFilter}
              onChange={(e) => {
                setCategoryFilter(e.target.value);
                setSubCategoryFilter("all");
              }}
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs font-bold text-slate-800 outline-none focus:border-amber-500"
            >
              <option value="all">{isAr ? "جميع الفئات الرئيسية" : "All Categories"}</option>
              {categoriesList.map((c) => (
                <option key={c.id} value={c.code}>
                  {isAr ? c.nameAr : c.nameEn}
                </option>
              ))}
            </select>
          </div>

          {/* Subcategory Filter (Dynamic cascading) */}
          <div className="md:col-span-2">
            <select
              value={subCategoryFilter}
              disabled={categoryFilter === "all" || subcategoriesForFilter.length === 0}
              onChange={(e) => setSubCategoryFilter(e.target.value)}
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs font-bold text-slate-800 outline-none focus:border-amber-500 disabled:bg-slate-100 disabled:text-slate-400"
            >
              <option value="all">{isAr ? "جميع الفئات الفرعية" : "All Subcategories"}</option>
              {subcategoriesForFilter.map((s) => (
                <option key={s.id} value={s.code}>
                  {isAr ? s.nameAr : s.nameEn}
                </option>
              ))}
            </select>
          </div>

          {/* Brand Filter */}
          <div className="md:col-span-2">
            <select
              value={brandFilter}
              onChange={(e) => setBrandFilter(e.target.value)}
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs font-bold text-slate-800 outline-none focus:border-amber-500"
            >
              <option value="all">{isAr ? "جميع العلامات التجارية" : "All Brands"}</option>
              {brands.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>
          </div>

          {/* Active / Inactive Status Filter */}
          <div className="md:col-span-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs font-bold text-slate-800 outline-none focus:border-amber-500"
            >
              <option value="all">{isAr ? "جميع الحالات" : "All Statuses"}</option>
              <option value="active">{isAr ? "الأصناف النشطة فقط" : "Active Only"}</option>
              <option value="inactive">{isAr ? "الأصناف المعطلة فقط" : "Inactive Only"}</option>
            </select>
          </div>
        </div>

        {/* Secondary Governance Filter Badges */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100 text-xs">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[11px] font-bold text-slate-400">
              {isAr ? "فلترة حسب الضوابط:" : "Governance Controls:"}
            </span>

            {/* Allow Sale Filter */}
            <button
              type="button"
              onClick={() =>
                setSaleFilter((prev) => (prev === "all" ? "allowSale" : prev === "allowSale" ? "blockSale" : "all"))
              }
              className={`px-2.5 py-1 rounded-lg font-bold text-[11px] border transition-colors ${
                saleFilter === "allowSale"
                  ? "bg-emerald-100 border-emerald-300 text-emerald-800 font-black"
                  : saleFilter === "blockSale"
                  ? "bg-red-100 border-red-300 text-red-800 font-black"
                  : "bg-slate-100 border-slate-200 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {saleFilter === "allowSale"
                ? isAr ? "✓ مسموح بالبيع في POS" : "✓ Sale Allowed"
                : saleFilter === "blockSale"
                ? isAr ? "✗ ممنوع البيع" : "✗ Sale Prohibited"
                : isAr ? "البيع في POS: الكل" : "Sale: All"}
            </button>

            {/* POS Visibility Filter */}
            <button
              type="button"
              onClick={() =>
                setPosVisibilityFilter((prev) =>
                  prev === "all" ? "visible" : prev === "visible" ? "hidden" : "all"
                )
              }
              className={`px-2.5 py-1 rounded-lg font-bold text-[11px] border transition-colors ${
                posVisibilityFilter === "visible"
                  ? "bg-amber-100 border-amber-300 text-amber-800 font-black"
                  : posVisibilityFilter === "hidden"
                  ? "bg-stone-200 border-stone-300 text-stone-800 font-black"
                  : "bg-slate-100 border-slate-200 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {posVisibilityFilter === "visible"
                ? isAr ? "✓ ظاهر في كاشير POS" : "✓ POS Visible"
                : posVisibilityFilter === "hidden"
                ? isAr ? " مخفي من كاشير POS" : " POS Hidden"
                : isAr ? "الظهور في POS: الكل" : "POS Visibility: All"}
            </button>

            {/* Stock Level Filter */}
            <select
              value={stockFilter}
              onChange={(e) => setStockFilter(e.target.value as any)}
              className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] font-bold text-slate-700 outline-none"
            >
              <option value="all">{isAr ? "مستوى المخزون: الكل" : "Stock: All"}</option>
              <option value="inStock">{isAr ? "متوفر بالمخزن (> 0)" : "In Stock (> 0)"}</option>
              <option value="lowStock">{isAr ? "مخزون منخفض (1-10)" : "Low Stock (1-10)"}</option>
              <option value="outOfStock">{isAr ? "نفذ من المخزن (0)" : "Out of Stock (0)"}</option>
            </select>
          </div>

          <div className="text-[11px] font-bold text-slate-500">
            {isAr ? `عرض ${filteredItems.length} من إجمالي ${allItems.length} صنف` : `Showing ${filteredItems.length} of ${allItems.length} records`}
          </div>
        </div>
      </div>

      {/* 4. Item Master Records Table */}
      {isLoading ? (
        <div className="rounded-2xl border border-ink/10 bg-white p-12 text-center text-xs font-bold text-slate-400 shadow-2xs">
          Loading Item Master Records...
        </div>
      ) : error ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-xs font-bold text-red-700">
          {error}
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-12 text-center shadow-2xs">
          <Package className="mx-auto h-10 w-10 text-slate-300 mb-2" />
          <p className="text-sm font-bold text-slate-800">{isAr ? "لم يتم العثور على أصناف مطابقة" : "No items match your search criteria."}</p>
          <p className="text-xs text-slate-400 mt-1">{isAr ? "جرب تعديل خيارات الفلترة أو أضف صنفاً جديداً" : "Try adjusting your filters or click '+ Add New Item Record' above."}</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-2xs">
          <table className="w-full text-xs text-start">
            <thead className="border-b border-slate-200 bg-slate-50/90 text-slate-600 font-bold uppercase text-[10px] tracking-wider">
              <tr>
                <th className="py-3 px-4 text-start">{isAr ? "الصنف (عربي / إنجليزي)" : "Item (En / Ar)"}</th>
                <th className="py-3 px-3 text-start">{isAr ? "الرمز / الباركود" : "SKU & Barcode"}</th>
                <th className="py-3 px-3 text-start">{isAr ? "الفئة / الفرعية" : "Category & Sub"}</th>
                <th className="py-3 px-3 text-start">{isAr ? "العلامة / المنشأ" : "Brand & Origin"}</th>
                <th className="py-3 px-3 text-end">{isAr ? "سعر البيع (KD)" : "Sell Price"}</th>
                {canViewCosts && <th className="py-3 px-3 text-end">{isAr ? "التكلفة (KD)" : "Cost Price"}</th>}
                <th className="py-3 px-3 text-center">{isAr ? "الرصيد" : "Stock"}</th>
                <th className="py-3 px-3 text-center">{isAr ? "ضوابط التشغيل (17)" : "Operational Controls"}</th>
                <th className="py-3 px-3 text-center">{isAr ? "الحالة" : "Status"}</th>
                <th className="py-3 px-4 text-center">{isAr ? "الإجراءات" : "Actions"}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredItems.map((item) => {
                const isInactive = item.isActive === false;
                const saleDisabled = item.allowSale === false || item.blockSale === true;
                const purchaseDisabled = item.allowPurchase === false;
                const discountBlocked = item.allowDiscount === false || item.blockDiscount === true;
                const giftBlocked = item.allowGift === false || item.blockFreeGift === true;
                const posHidden = item.posVisibility === false;
                const expiryReq = item.expiryRequired || item.trackExpiry;

                return (
                  <tr
                    key={item.id}
                    className={`hover:bg-slate-50/70 transition-colors ${
                      isInactive ? "bg-slate-50/50 opacity-75" : ""
                    }`}
                  >
                    {/* 1. Item Name & Thumbnail */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        {item.imageUrl ? (
                          <img
                            src={item.imageUrl}
                            alt={item.name}
                            className="h-9 w-9 rounded-xl object-cover border border-slate-200 shrink-0"
                          />
                        ) : (
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-600 border border-slate-200">
                            <Package className="h-4 w-4" />
                          </div>
                        )}
                        <div className="min-w-0">
                          <p className="font-bold text-slate-900 line-clamp-1 text-xs">
                            {item.nameEn || item.name}
                          </p>
                          <p className="text-[11px] font-semibold text-slate-500 line-clamp-1">
                            {item.nameAr || item.name}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* 2. SKU & Barcode */}
                    <td className="py-3 px-3 font-mono text-[11px]">
                      <p className="font-bold text-slate-900">{item.sku}</p>
                      <p className="text-slate-400 text-[10px]">{item.barcode || "-"}</p>
                    </td>

                    {/* 3. Category & Subcategory */}
                    <td className="py-3 px-3">
                      <p className="font-bold text-slate-800 text-[11px] truncate">
                        {getCategoryLabel(item.category)}
                      </p>
                      <p className="text-slate-500 text-[10px] truncate">
                        {getSubCategoryLabel(item.subCategory)}
                      </p>
                    </td>

                    {/* 4. Brand & Origin */}
                    <td className="py-3 px-3">
                      <p className="font-bold text-slate-800 text-[11px] truncate">{item.brand || "Bin Essa"}</p>
                      <p className="text-slate-500 text-[10px] truncate">{item.countryOfOrigin || "-"}</p>
                    </td>

                    {/* 5. Sell Price */}
                    <td className="py-3 px-3 text-end numeric-ltr font-black text-slate-900 text-xs">
                      {formatKD(item.price)}{" "}
                      <span className="text-[9px] font-bold text-amber-600">KD</span>
                    </td>

                    {/* 6. Cost Price */}
                    {canViewCosts && (
                      <td className="py-3 px-3 text-end numeric-ltr font-semibold text-slate-600 text-xs">
                        {formatKD(item.cost)}{" "}
                        <span className="text-[9px] text-slate-400">KD</span>
                      </td>
                    )}

                    {/* 7. Stock */}
                    <td className="py-3 px-3 text-center">
                      <span
                        className={`inline-block px-2 py-0.5 rounded-lg text-xs font-black numeric-ltr ${
                          (item.stockQuantity ?? 0) > 10
                            ? "bg-slate-100 text-slate-900"
                            : (item.stockQuantity ?? 0) > 0
                            ? "bg-amber-100 text-amber-900 font-black"
                            : "bg-red-100 text-red-700 font-black"
                        }`}
                      >
                        {item.stockQuantity ?? 0} {item.unit || "pcs"}
                      </span>
                    </td>

                    {/* 8. Operational Controls Badges */}
                    <td className="py-3 px-3 text-center">
                      <div className="flex flex-wrap items-center justify-center gap-1 max-w-[200px] mx-auto">
                        {/* Allow Sale */}
                        <span
                          className={`px-1.5 py-0.2 rounded text-[9px] font-black ${
                            saleDisabled
                              ? "bg-red-100 text-red-700"
                              : "bg-emerald-50 text-emerald-700"
                          }`}
                          title={saleDisabled ? "Sale Prohibited" : "Sale Allowed"}
                        >
                          {saleDisabled ? "No Sale" : "Sale"}
                        </span>

                        {/* Allow Purchase */}
                        <span
                          className={`px-1.5 py-0.2 rounded text-[9px] font-black ${
                            purchaseDisabled
                              ? "bg-red-100 text-red-700"
                              : "bg-sky-50 text-sky-700"
                          }`}
                          title={purchaseDisabled ? "Purchase Blocked" : "Purchasable"}
                        >
                          {purchaseDisabled ? "No PO" : "PO"}
                        </span>

                        {/* Allow Discount */}
                        <span
                          className={`px-1.5 py-0.2 rounded text-[9px] font-black ${
                            discountBlocked
                              ? "bg-stone-100 text-stone-500"
                              : "bg-amber-50 text-amber-800"
                          }`}
                          title={discountBlocked ? "Discount Blocked" : `Max Disc: ${item.maxDiscountPercent || 10}%`}
                        >
                          {discountBlocked ? "No Disc" : `${item.maxDiscountPercent || 10}% Disc`}
                        </span>

                        {/* Allow Gift */}
                        <span
                          className={`px-1.5 py-0.2 rounded text-[9px] font-black ${
                            giftBlocked
                              ? "bg-stone-100 text-stone-400"
                              : "bg-yellow-100 text-yellow-900"
                          }`}
                          title={giftBlocked ? "Gift Blocked" : "Gift Allowed"}
                        >
                          {giftBlocked ? "No Gift" : "Gift"}
                        </span>

                        {/* POS Visibility */}
                        <span
                          className={`px-1.5 py-0.2 rounded text-[9px] font-black ${
                            posHidden
                              ? "bg-slate-200 text-slate-600"
                              : "bg-emerald-100 text-emerald-900"
                          }`}
                          title={posHidden ? "Hidden from POS" : "Visible in POS"}
                        >
                          {posHidden ? "POS Off" : "POS On"}
                        </span>

                        {/* Expiry Required */}
                        {expiryReq && (
                          <span
                            className="px-1.5 py-0.2 rounded text-[9px] font-black bg-purple-100 text-purple-800"
                            title="Expiry Required"
                          >
                            Exp Req
                          </span>
                        )}
                      </div>
                    </td>

                    {/* 9. Active / Inactive Soft Toggle */}
                    <td className="py-3 px-3 text-center">
                      <button
                        type="button"
                        onClick={() => handleToggleItemActive(item.id, item.isActive !== false)}
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black transition-all ${
                          isInactive
                            ? "bg-red-100 text-red-700 hover:bg-red-200"
                            : "bg-emerald-100 text-emerald-800 hover:bg-emerald-200"
                        }`}
                        title="Click to toggle status without deleting historical transactions"
                      >
                        <Power className="h-3 w-3" />
                        <span>{isInactive ? (isAr ? "معطل" : "Inactive") : (isAr ? "نشط" : "Active")}</span>
                      </button>
                    </td>

                    {/* 10. Actions */}
                    <td className="py-3 px-4 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => openEditModal(item)}
                          className="p-1.5 rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-100 hover:border-slate-300"
                          title="Quick Edit Item Master"
                        >
                          <Edit2 className="h-3.5 w-3.5" />
                        </button>
                        <Link
                          href={`/inventory/${item.id}`}
                          className="p-1.5 rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-100 hover:border-slate-300"
                          title="View Full Item Master & Branch Stock"
                        >
                          <Eye className="h-3.5 w-3.5" />
                        </Link>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* 5. Comprehensive Item Master Edit Modal */}
      {editingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="flex max-h-[92vh] w-full max-w-3xl flex-col rounded-3xl bg-white shadow-2xl overflow-hidden border border-slate-200 text-xs">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-black/10 bg-[#0B0F17] p-4 px-6 text-white">
              <div className="flex items-center gap-2">
                <Edit2 className="h-5 w-5 text-[#FDCE0C]" />
                <div>
                  <h3 className="text-base font-bold text-white">
                    {isAr ? "تعديل بطاقة الصنف (Edit Item Master Record)" : "Edit Item Master Record"}
                  </h3>
                  <p className="text-[11px] text-slate-300">
                    SKU: <span className="font-mono text-[#FDCE0C]">{editingItem.sku}</span>
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setEditingItem(null)}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white"
              >
                <XCircle className="h-5 w-5" />
              </button>
            </div>

            {editError && (
              <div className="mx-6 mt-4 p-3 rounded-xl bg-red-50 border border-red-200 text-xs font-bold text-red-700">
                {editError}
              </div>
            )}

            {/* Form Body */}
            <form onSubmit={handleSaveEdit} className="flex-1 overflow-y-auto p-6 space-y-4">
              {/* Section 1: Bilingual Names & Codes */}
              <div className="rounded-2xl border border-slate-200 bg-slate-50/50 p-4 space-y-3">
                <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px]">
                  {isAr ? "1. التعريف والتسمية (عربي / إنجليزي)" : "1. Identification & Dual Language Names"}
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      {isAr ? "اسم الصنف بالإنجليزية *" : "Item Name (English) *"}
                    </label>
                    <input
                      type="text"
                      required
                      value={editFormData.nameEn}
                      onChange={(e) => setEditFormData({ ...editFormData, nameEn: e.target.value })}
                      className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-900 placeholder:text-slate-400 outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1 text-end">
                      {isAr ? "* اسم الصنف بالعربية" : "Item Name (Arabic) *"}
                    </label>
                    <input
                      type="text"
                      required
                      value={editFormData.nameAr}
                      onChange={(e) => setEditFormData({ ...editFormData, nameAr: e.target.value })}
                      className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-900 placeholder:text-slate-400 outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 text-end"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      {isAr ? "رمز SKU *" : "SKU Code *"}
                    </label>
                    <input
                      type="text"
                      required
                      value={editFormData.sku}
                      onChange={(e) => setEditFormData({ ...editFormData, sku: e.target.value })}
                      className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-mono font-bold text-slate-900 placeholder:text-slate-400 outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      {isAr ? "الباركود الأساسي" : "Primary Barcode"}
                    </label>
                    <input
                      type="text"
                      value={editFormData.barcode}
                      onChange={(e) => setEditFormData({ ...editFormData, barcode: e.target.value })}
                      className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-mono text-slate-900 placeholder:text-slate-400 outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      {isAr ? "العلامة التجارية" : "Brand Name"}
                    </label>
                    <input
                      type="text"
                      value={editFormData.brand}
                      onChange={(e) => setEditFormData({ ...editFormData, brand: e.target.value })}
                      placeholder="e.g. Beco, RAW, Cricket"
                      className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-900 placeholder:text-slate-400 outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      {isAr ? "بلد المنشأ" : "Country of Origin"}
                    </label>
                    <input
                      type="text"
                      value={editFormData.countryOfOrigin}
                      onChange={(e) => setEditFormData({ ...editFormData, countryOfOrigin: e.target.value })}
                      placeholder="e.g. Kuwait, Sweden, China, USA"
                      className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-900 placeholder:text-slate-400 outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      {isAr ? "رابط صورة الصنف (URL)" : "Product Image URL"}
                    </label>
                    <input
                      type="text"
                      value={editFormData.imageUrl}
                      onChange={(e) => setEditFormData({ ...editFormData, imageUrl: e.target.value })}
                      placeholder="https://..."
                      className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 placeholder:text-slate-400 outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                    />
                  </div>
                </div>
              </div>

              {/* Section 2: Classification (Category & Subcategory) */}
              <div className="rounded-2xl border border-slate-200 bg-slate-50/50 p-4 space-y-3">
                <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px]">
                  {isAr ? "2. التصنيف والفئات" : "2. Category & Subcategory"}
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">
                      {isAr ? "الفئة الرئيسية *" : "Main Category *"}
                    </label>
                    <select
                      value={editFormData.category}
                      onChange={(e) => {
                        setEditFormData({ ...editFormData, category: e.target.value, subCategory: "" });
                      }}
                      className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-bold text-slate-800 outline-none focus:border-amber-500"
                    >
                      {categoriesList.map((c) => (
                        <option key={c.id} value={c.code}>
                          {isAr ? c.nameAr : c.nameEn}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">
                      {isAr ? "الفئة الفرعية" : "Subcategory"}
                    </label>
                    <select
                      value={editFormData.subCategory}
                      onChange={(e) => setEditFormData({ ...editFormData, subCategory: e.target.value })}
                      className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-bold text-slate-800 outline-none focus:border-amber-500"
                    >
                      <option value="">{isAr ? "بدون فئة فرعية" : "None / Unassigned"}</option>
                      {(categoriesList.find((c) => c.code === editFormData.category)?.subcategories || []).map((s) => (
                        <option key={s.id} value={s.code}>
                          {isAr ? s.nameAr : s.nameEn}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Section 3: Operational Controls & Governance (All 17 Attributes) */}
              <div className="rounded-2xl border border-amber-300 bg-amber-50/40 p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-black text-slate-900 uppercase tracking-wider text-[11px]">
                    {isAr ? "3. ضوابط التشغيل والحوكمة (Operational Controls)" : "3. Operational Controls & Governance"}
                  </h4>
                  <span className="text-[10px] font-bold text-amber-700">
                    Source of Truth for POS & Purchasing
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {/* Allow Sale */}
                  <label className="flex items-center gap-2 p-2.5 rounded-xl border border-slate-200 bg-white cursor-pointer hover:border-amber-500">
                    <input
                      type="checkbox"
                      checked={editFormData.allowSale}
                      onChange={(e) => setEditFormData({ ...editFormData, allowSale: e.target.checked })}
                      className="h-4 w-4 rounded text-amber-600 accent-amber-500"
                    />
                    <div>
                      <p className="font-bold text-slate-900 leading-tight">{isAr ? "السماح بالبيع" : "Allow Sale"}</p>
                      <p className="text-[10px] text-slate-400">{isAr ? "البيع في POS" : "Sell at POS"}</p>
                    </div>
                  </label>

                  {/* Allow Purchase */}
                  <label className="flex items-center gap-2 p-2.5 rounded-xl border border-slate-200 bg-white cursor-pointer hover:border-amber-500">
                    <input
                      type="checkbox"
                      checked={editFormData.allowPurchase}
                      onChange={(e) => setEditFormData({ ...editFormData, allowPurchase: e.target.checked })}
                      className="h-4 w-4 rounded text-amber-600 accent-amber-500"
                    />
                    <div>
                      <p className="font-bold text-slate-900 leading-tight">{isAr ? "السماح بالشراء" : "Allow Purchase"}</p>
                      <p className="text-[10px] text-slate-400">{isAr ? "في أوامر الشراء" : "Purchase in POs"}</p>
                    </div>
                  </label>

                  {/* Allow Discount */}
                  <label className="flex items-center gap-2 p-2.5 rounded-xl border border-slate-200 bg-white cursor-pointer hover:border-amber-500">
                    <input
                      type="checkbox"
                      checked={editFormData.allowDiscount}
                      onChange={(e) => setEditFormData({ ...editFormData, allowDiscount: e.target.checked })}
                      className="h-4 w-4 rounded text-amber-600 accent-amber-500"
                    />
                    <div>
                      <p className="font-bold text-slate-900 leading-tight">{isAr ? "السماح بالخصم" : "Allow Discount"}</p>
                      <p className="text-[10px] text-slate-400">{isAr ? "تطبيق خصومات" : "Invoice/Line Disc"}</p>
                    </div>
                  </label>

                  {/* Allow Gift */}
                  <label className="flex items-center gap-2 p-2.5 rounded-xl border border-slate-200 bg-white cursor-pointer hover:border-amber-500">
                    <input
                      type="checkbox"
                      checked={editFormData.allowGift}
                      onChange={(e) => setEditFormData({ ...editFormData, allowGift: e.target.checked })}
                      className="h-4 w-4 rounded text-amber-600 accent-amber-500"
                    />
                    <div>
                      <p className="font-bold text-slate-900 leading-tight">{isAr ? "السماح كهدية" : "Allow Gift"}</p>
                      <p className="text-[10px] text-slate-400">{isAr ? "هدية مجانية 100%" : "100% Free Promo"}</p>
                    </div>
                  </label>

                  {/* POS Visibility */}
                  <label className="flex items-center gap-2 p-2.5 rounded-xl border border-slate-200 bg-white cursor-pointer hover:border-amber-500">
                    <input
                      type="checkbox"
                      checked={editFormData.posVisibility}
                      onChange={(e) => setEditFormData({ ...editFormData, posVisibility: e.target.checked })}
                      className="h-4 w-4 rounded text-amber-600 accent-amber-500"
                    />
                    <div>
                      <p className="font-bold text-slate-900 leading-tight">{isAr ? "الظهور في POS" : "POS Visibility"}</p>
                      <p className="text-[10px] text-slate-400">{isAr ? "شاشة الكاشير" : "Cashier Grid"}</p>
                    </div>
                  </label>

                  {/* Expiry Required */}
                  <label className="flex items-center gap-2 p-2.5 rounded-xl border border-slate-200 bg-white cursor-pointer hover:border-amber-500">
                    <input
                      type="checkbox"
                      checked={editFormData.expiryRequired}
                      onChange={(e) => setEditFormData({ ...editFormData, expiryRequired: e.target.checked })}
                      className="h-4 w-4 rounded text-amber-600 accent-amber-500"
                    />
                    <div>
                      <p className="font-bold text-slate-900 leading-tight">{isAr ? "تتبع الصلاحية" : "Expiry Req."}</p>
                      <p className="text-[10px] text-slate-400">{isAr ? "تاريخ الانتهاء" : "Batch & Expiry"}</p>
                    </div>
                  </label>

                  {/* Active / Inactive */}
                  <label className="flex items-center gap-2 p-2.5 rounded-xl border border-slate-200 bg-white cursor-pointer hover:border-amber-500">
                    <input
                      type="checkbox"
                      checked={editFormData.isActive}
                      onChange={(e) => setEditFormData({ ...editFormData, isActive: e.target.checked })}
                      className="h-4 w-4 rounded text-amber-600 accent-amber-500"
                    />
                    <div>
                      <p className="font-bold text-slate-900 leading-tight">{isAr ? "حالة النشاط" : "Active Status"}</p>
                      <p className="text-[10px] text-slate-400">{isAr ? "صنف نشط" : "Operational Item"}</p>
                    </div>
                  </label>

                  {/* Max Discount % */}
                  <div className="p-2 rounded-xl border border-slate-200 bg-white">
                    <label className="block text-[10px] font-bold text-slate-700 mb-0.5">
                      {isAr ? "أقصى خصم %" : "Max Disc %"}
                    </label>
                    <input
                      type="number"
                      min={0}
                      max={100}
                      value={editFormData.maxDiscountPercent}
                      onChange={(e) => setEditFormData({ ...editFormData, maxDiscountPercent: e.target.value })}
                      className="w-full rounded border border-slate-300 bg-white px-2 py-1 text-xs font-black text-slate-900 placeholder:text-slate-400 outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                    />
                  </div>
                </div>
              </div>

              {/* Section 4: Pricing & Costs (KD 3-Decimals) */}
              <div className="rounded-2xl border border-slate-200 bg-slate-50/50 p-4 space-y-3">
                <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px]">
                  {isAr ? "4. الأسعار والتكلفة (د.ك بالدقة القانونية 3 خانات)" : "4. Pricing & Unit Costs (KWD 3-Decimal Precision)"}
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      {isAr ? "سعر البيع (د.ك) *" : "Retail Sell Price (KD) *"}
                    </label>
                    <input
                      type="number"
                      step="0.001"
                      min={0}
                      required
                      value={editFormData.price}
                      onChange={(e) => setEditFormData({ ...editFormData, price: e.target.value })}
                      className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-black text-slate-900 placeholder:text-slate-400 outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      {isAr ? "سعر التكلفة (د.ك) *" : "Cost Price (KD) *"}
                    </label>
                    <input
                      type="number"
                      step="0.001"
                      min={0}
                      required
                      value={editFormData.cost}
                      onChange={(e) => setEditFormData({ ...editFormData, cost: e.target.value })}
                      className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-900 placeholder:text-slate-400 outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      {isAr ? "سعر الجملة (د.ك)" : "Wholesale Price (KD)"}
                    </label>
                    <input
                      type="number"
                      step="0.001"
                      min={0}
                      value={editFormData.wholesalePrice}
                      onChange={(e) => setEditFormData({ ...editFormData, wholesalePrice: e.target.value })}
                      className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-900 placeholder:text-slate-400 outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      {isAr ? "الوحدة الأساسية" : "Base Unit"}
                    </label>
                    <input
                      type="text"
                      value={editFormData.unit}
                      onChange={(e) => setEditFormData({ ...editFormData, unit: e.target.value })}
                      placeholder="pcs, box, pack"
                      className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-900 placeholder:text-slate-400 outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                    />
                  </div>
                </div>
              </div>

              {/* Modal Actions */}
              <div className="flex justify-end gap-2.5 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setEditingItem(null)}
                  className="rounded-xl border border-slate-300 bg-white px-5 py-2 text-xs font-bold text-slate-700 hover:bg-slate-100"
                >
                  {isAr ? "إلغاء" : "Cancel"}
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="rounded-xl bg-black text-[#FDCE0C] px-6 py-2 text-xs font-bold shadow-sm hover:bg-slate-900 disabled:opacity-50"
                >
                  {isSaving ? (isAr ? "جاري الحفظ..." : "Saving...") : (isAr ? "حفظ التغييرات" : "Save Item Master")}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 6. Category & Subcategory Management Modal */}
      <CategoryManagementModal
        isOpen={isCatModalOpen}
        onClose={() => setIsCatModalOpen(false)}
        onCategoriesUpdated={() => loadData()}
      />
    </div>
  );
}