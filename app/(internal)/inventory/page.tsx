"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { useLocale } from "@/lib/i18n/LocaleContext";
import { useSession } from "@/lib/context/SessionContext";
import {
  listItemsRequest,
  updateItemRequest,
  deleteItemRequest,
  type ItemResponse,
  type ItemCategory,
} from "@/lib/api";

function formatKD(amount: number) {
  return amount.toLocaleString("en-US", {
    minimumFractionDigits: 3,
    maximumFractionDigits: 3,
  });
}

export default function InventoryPage() {
  const { locale, t } = useLocale();
  const { user } = useSession();
  const canViewCosts = user?.role !== "storekeeper";

  const [allItems, setAllItems] = useState<ItemResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [query, setQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string | "all">("all");

  // Edit Modal State
  const [editingItem, setEditingItem] = useState<ItemResponse | null>(null);
  const [editFormData, setEditFormData] = useState({
    name: "",
    sku: "",
    barcode: "",
    category: "OTHER" as ItemCategory,
    price: "",
    retailPrice: "",
    semiWholesalePrice: "",
    wholesalePrice: "",
    cost: "",
    stockQuantity: "0",
    unit: "pcs",
    isActive: true,
    trackExpiry: false,
    blockFreeGift: false,
    blockDiscount: false,
    maxDiscountPercent: "100",
    additionalBarcodes: [] as string[],
    uoms: [
      { unitName: "Piece", conversionRatio: 1, isBase: true },
      { unitName: "Pack", conversionRatio: 5, isBase: false },
      { unitName: "Box", conversionRatio: 100, isBase: false },
      { unitName: "Carton", conversionRatio: 1000, isBase: false },
    ],
  });
  const [isSaving, setIsSaving] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await listItemsRequest();
      setAllItems(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load items");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    function handleFocus() {
      load();
    }
    function handleVisibility() {
      if (document.visibilityState === "visible") {
        load();
      }
    }

    window.addEventListener("focus", handleFocus);
    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      window.removeEventListener("focus", handleFocus);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, [load]);

  const [stockFilter, setStockFilter] = useState<"all" | "inStock" | "lowStock" | "outOfStock">("all");
  const [mainCategoryFilter, setMainCategoryFilter] = useState<string>("all");
  const [brandFilter, setBrandFilter] = useState<string>("all");

  const categories = Array.from(new Set(allItems.map((i) => i.category)));
  const mainCategories = Array.from(new Set(allItems.map((i) => i.mainCategory).filter(Boolean))) as string[];
  const brands = Array.from(new Set(allItems.map((i) => i.brand).filter(Boolean))) as string[];

  const filteredItems = allItems.filter((item) => {
    if (categoryFilter !== "all" && item.category !== categoryFilter) return false;
    if (mainCategoryFilter !== "all" && item.mainCategory !== mainCategoryFilter) return false;
    if (brandFilter !== "all" && item.brand !== brandFilter) return false;

    const stock = item.stockQuantity ?? 0;
    if (stockFilter === "inStock" && stock <= 0) return false;
    if (stockFilter === "lowStock" && (stock <= 0 || stock > 10)) return false;
    if (stockFilter === "outOfStock" && stock > 0) return false;

    const q = query.trim().toLowerCase();
    if (!q) return true;
    return (
      item.name.toLowerCase().includes(q) ||
      item.sku.toLowerCase().includes(q) ||
      (item.barcode ?? "").toLowerCase().includes(q) ||
      (item.brand ?? "").toLowerCase().includes(q) ||
      (item.mainCategory ?? "").toLowerCase().includes(q)
    );
  });

  // Smart Inventory Metrics (Dynamically calculated based on selected Main Category & Brand filter)
  const displayItems = filteredItems;
  const totalValuation = displayItems.reduce(
    (sum, i) => sum + (Number(i.cost) || 0) * (i.stockQuantity ?? 0),
    0
  );
  const totalRetailValuation = displayItems.reduce(
    (sum, i) => sum + (Number(i.retailPrice || i.price) || 0) * (i.stockQuantity ?? 0),
    0
  );
  const potentialMargin = Math.max(0, totalRetailValuation - totalValuation);

  const lowStockCount = displayItems.filter(
    (i) => (i.stockQuantity ?? 0) > 0 && (i.stockQuantity ?? 0) <= 10
  ).length;
  const outOfStockCount = displayItems.filter((i) => (i.stockQuantity ?? 0) <= 0).length;

  const openEditModal = (item: ItemResponse) => {
    setEditingItem(item);
    setEditError(null);
    setEditFormData({
      name: item.name,
      sku: item.sku,
      barcode: item.barcode ?? "",
      category: item.category as any,
      price: String(item.price),
      retailPrice: String(item.retailPrice ?? item.price),
      semiWholesalePrice: String(item.semiWholesalePrice ?? item.price),
      wholesalePrice: String(item.wholesalePrice ?? item.price),
      cost: String(item.cost),
      stockQuantity: String((item as any).stockQuantity ?? 0),
      unit: item.unit || "pcs",
      isActive: item.isActive,
      trackExpiry: item.trackExpiry ?? false,
      blockFreeGift: item.blockFreeGift ?? false,
      blockDiscount: item.blockDiscount ?? false,
      maxDiscountPercent: String(item.maxDiscountPercent ?? 100),
      additionalBarcodes: item.additionalBarcodes ? item.additionalBarcodes.map((b) => b.barcode) : [],
      uoms: item.uoms && item.uoms.length > 0 ? item.uoms.map((u) => ({
        unitName: u.unitName,
        conversionRatio: Number(u.conversionRatio),
        isBase: u.isBase ?? false,
        barcode: u.barcode,
      })) : [
        { unitName: "Piece", conversionRatio: 1, isBase: true },
        { unitName: "Pack", conversionRatio: 5, isBase: false },
        { unitName: "Box", conversionRatio: 100, isBase: false },
        { unitName: "Carton", conversionRatio: 1000, isBase: false },
      ],
    });
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;
    setIsSaving(true);
    setEditError(null);
    try {
      await updateItemRequest(editingItem.id, {
        name: editFormData.name.trim(),
        sku: editFormData.sku.trim(),
        barcode: editFormData.barcode.trim() || undefined,
        category: editFormData.category,
        price: parseFloat(editFormData.price) || 0,
        cost: parseFloat(editFormData.cost) || 0,
        stockQuantity: parseInt(editFormData.stockQuantity, 10) || 0,
        unit: editFormData.unit.trim() || "pcs",
        isActive: editFormData.isActive,
        retailPrice: parseFloat(editFormData.retailPrice) || parseFloat(editFormData.price) || 0,
        semiWholesalePrice: parseFloat(editFormData.semiWholesalePrice) || parseFloat(editFormData.price) || 0,
        wholesalePrice: parseFloat(editFormData.wholesalePrice) || parseFloat(editFormData.price) || 0,
        trackExpiry: editFormData.trackExpiry,
        blockFreeGift: editFormData.blockFreeGift,
        blockDiscount: editFormData.blockDiscount,
        maxDiscountPercent: parseFloat(editFormData.maxDiscountPercent) || 100,
        additionalBarcodes: editFormData.additionalBarcodes.filter((b) => b.trim().length > 0),
        uoms: editFormData.uoms,
      });
      setEditingItem(null);
      await load();
    } catch (err) {
      setEditError(err instanceof Error ? err.message : "Failed to update item");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (item: ItemResponse) => {
    if (!confirm(`Are you sure you want to delete "${item.name}"?`)) return;
    try {
      await deleteItemRequest(item.id);
      await load();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to delete item");
    }
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-ink">{t.inventory.title}</h1>
          <p className="mt-1 text-ink/60">{t.inventory.subtitle}</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Link
            href="/inventory/item-modifiers"
            className="whitespace-nowrap rounded-xl border border-ink/15 bg-white px-3.5 py-2 text-xs font-bold text-ink shadow-xs hover:bg-gold hover:border-gold transition-colors"
          >
            🎨 Modifiers & Variants
          </Link>
          <Link
            href="/inventory/serial-tracking"
            className="whitespace-nowrap rounded-xl border border-ink/15 bg-white px-3.5 py-2 text-xs font-bold text-ink shadow-xs hover:bg-gold hover:border-gold transition-colors"
          >
            🏷️ Serial & Batch Expiry
          </Link>
          <Link
            href="/inventory/new"
            className="whitespace-nowrap rounded-xl bg-ink px-4 py-2 text-xs font-bold text-white hover:bg-gold hover:text-ink transition-colors shadow-xs"
          >
            + Add Product
          </Link>
        </div>
      </div>

      {/* Sub-Feature Module Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-ink/10 pb-3 text-xs font-semibold overflow-x-auto">
        <span className="px-3.5 py-1.5 rounded-xl bg-ink text-white shadow-sm font-bold whitespace-nowrap">
          Stock & Products Catalog
        </span>
        <Link
          href="/inventory/item-modifiers"
          className="px-3.5 py-1.5 rounded-xl text-ink/70 hover:bg-ink/5 hover:text-ink transition whitespace-nowrap"
        >
          Item Modifiers & Variants
        </Link>
        <Link
          href="/inventory/serial-tracking"
          className="px-3.5 py-1.5 rounded-xl text-ink/70 hover:bg-ink/5 hover:text-ink transition whitespace-nowrap"
        >
          Serial & Batch Expiry Tracking
        </Link>
      </div>

      {/* Executive Smart Analytics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="rounded-2xl border border-ink/10 bg-white p-4 shadow-sm">
          <p className="text-xs font-medium text-ink/50 uppercase tracking-wider">Total Active SKUs</p>
          <p className="mt-1 text-2xl font-bold text-ink">{allItems.length}</p>
        </div>

        {canViewCosts && (
          <div className="rounded-2xl border border-ink/10 bg-white p-4 shadow-sm">
            <p className="text-xs font-medium text-ink/50 uppercase tracking-wider">Cost Valuation</p>
            <p className="numeric-ltr mt-1 text-2xl font-bold text-ink">
              {formatKD(totalValuation)} <span className="text-xs font-normal text-ink/40">KD</span>
            </p>
          </div>
        )}

        <div className="rounded-2xl border border-ink/10 bg-white p-4 shadow-sm">
          <p className="text-xs font-medium text-emerald-700 uppercase tracking-wider">Retail Sales Potential</p>
          <p className="numeric-ltr mt-1 text-2xl font-bold text-emerald-900">
            {formatKD(totalRetailValuation)} <span className="text-xs font-normal text-emerald-700">KD</span>
          </p>
          <p className="text-[10px] text-emerald-600 font-semibold mt-0.5">
            Margin: +{formatKD(potentialMargin)} KD
          </p>
        </div>

        <button
          type="button"
          onClick={() => setStockFilter(stockFilter === "lowStock" ? "all" : "lowStock")}
          className={`rounded-2xl border p-4 text-start transition shadow-sm ${
            stockFilter === "lowStock"
              ? "border-amber-400 bg-amber-50/70 ring-2 ring-amber-400"
              : "border-ink/10 bg-white hover:border-amber-300"
          }`}
        >
          <p className="text-xs font-medium text-amber-700 uppercase tracking-wider">Low Stock (≤10)</p>
          <p className="mt-1 text-2xl font-bold text-amber-900">{lowStockCount}</p>
        </button>

        <button
          type="button"
          onClick={() => setStockFilter(stockFilter === "outOfStock" ? "all" : "outOfStock")}
          className={`rounded-2xl border p-4 text-start transition shadow-sm ${
            stockFilter === "outOfStock"
              ? "border-red-400 bg-red-50/70 ring-2 ring-red-400"
              : "border-ink/10 bg-white hover:border-red-300"
          }`}
        >
          <p className="text-xs font-medium text-red-600 uppercase tracking-wider">Out of Stock</p>
          <p className="mt-1 text-2xl font-bold text-red-800">{outOfStockCount}</p>
        </button>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center flex-wrap">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t.inventory.searchPlaceholder}
          className="w-full flex-1 rounded-2xl border border-ink/10 bg-white px-4 py-2.5 text-sm shadow-sm outline-none focus:border-gold"
        />

        {/* Main Category Filter Dropdown */}
        <select
          value={mainCategoryFilter}
          onChange={(e) => setMainCategoryFilter(e.target.value)}
          className="rounded-2xl border border-ink/10 bg-white px-3 py-2.5 text-xs font-bold text-ink shadow-sm outline-none focus:border-gold sm:w-44"
        >
          <option value="all">{locale === "ar" ? "كل الفئات الرئيسية" : "All Main Categories"}</option>
          {mainCategories.map((mc) => (
            <option key={mc} value={mc}>
              {mc}
            </option>
          ))}
        </select>

        {/* Brand / Company Filter Dropdown */}
        <select
          value={brandFilter}
          onChange={(e) => setBrandFilter(e.target.value)}
          className="rounded-2xl border border-ink/10 bg-white px-3 py-2.5 text-xs font-bold text-ink shadow-sm outline-none focus:border-gold sm:w-44"
        >
          <option value="all">{locale === "ar" ? "كل الماركات والشركات" : "All Brands & Companies"}</option>
          {brands.map((b) => (
            <option key={b} value={b}>
              {b}
            </option>
          ))}
        </select>

        {/* General Category Filter Dropdown */}
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="rounded-2xl border border-ink/10 bg-white px-3 py-2.5 text-xs font-bold text-ink shadow-sm outline-none focus:border-gold sm:w-40"
        >
          <option value="all">{t.inventory.allCategories}</option>
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <div className="flex items-center gap-1 bg-ink/5 p-1 rounded-2xl border border-ink/10">
          {(["all", "inStock", "lowStock", "outOfStock"] as const).map((filterKey) => {
            const labels = {
              all: "All",
              inStock: "In Stock",
              lowStock: "Low Stock",
              outOfStock: "Finished",
            };
            return (
              <button
                key={filterKey}
                type="button"
                onClick={() => setStockFilter(filterKey)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-xl transition ${
                  stockFilter === filterKey
                    ? "bg-white text-ink shadow-sm"
                    : "text-ink/60 hover:text-ink"
                }`}
              >
                {labels[filterKey]}
              </button>
            );
          })}
        </div>
      </div>

      {isLoading && (
        <div className="flex justify-center p-12">
          <p className="text-sm text-ink/50">Loading inventory data…</p>
        </div>
      )}

      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {!isLoading && !error && (
        <div className="overflow-x-auto rounded-2xl border border-ink/10 bg-white shadow-sm">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-ink/10 text-xs font-semibold uppercase tracking-wider text-ink/50">
                <th className="px-4 py-3 text-start font-medium">{t.inventory.itemName}</th>
                <th className="px-4 py-3 text-start font-medium">{locale === "ar" ? "الشركة / الماركة" : "Brand / Company"}</th>
                <th className="px-4 py-3 text-start font-medium">{t.inventory.category}</th>
                <th className="px-4 py-3 text-start font-medium">{t.inventory.sku}</th>
                <th className="px-4 py-3 text-start font-medium">{t.inventory.barcode}</th>
                <th className="px-4 py-3 text-start font-medium">Stock Qty & Unit</th>
                {canViewCosts && (
                  <th className="px-4 py-3 text-start font-medium">{t.inventory.costPrice}</th>
                )}
                <th className="px-4 py-3 text-start font-medium">{t.inventory.sellPrice}</th>
                <th className="px-4 py-3 text-start font-medium">Status</th>
                <th className="px-4 py-3 text-end font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink/5">
              {filteredItems.map((item) => {
                const stock = item.stockQuantity ?? 0;
                return (
                  <tr key={item.id} className="hover:bg-ink/5">
                    <td className="px-4 py-3 font-medium text-ink">
                      <div>{item.name}</div>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {item.trackExpiry && (
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 border border-amber-200">
                            📅 Expiry Tracked
                          </span>
                        )}
                        {item.blockFreeGift && (
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-red-100 text-red-700 border border-red-200">
                            🎁 No Free Gift
                          </span>
                        )}
                        {item.blockDiscount ? (
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-red-100 text-red-700 border border-red-200">
                            🏷️ No Discounts
                          </span>
                        ) : (
                          <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                            🏷️ Max {item.maxDiscountPercent ?? 10}% Disc
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 font-bold text-ink">
                      {item.brand ? (
                        <span className="inline-block px-2 py-0.5 rounded bg-ink/5 text-xs text-ink">
                          🏢 {item.brand}
                        </span>
                      ) : (
                        <span className="text-ink/40 text-xs">—</span>
                      )}
                      {item.mainCategory && (
                        <span className="block text-[10px] text-ink/50 mt-0.5">{item.mainCategory}</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-ink/70">{item.category}</td>
                    <td className="numeric-ltr px-4 py-3 text-ink/60 font-mono">{item.sku}</td>
                    <td className="numeric-ltr px-4 py-3 text-ink/60 font-mono">{item.barcode || "—"}</td>
                    <td className="px-4 py-3 font-semibold">
                      <div className="flex items-center gap-2">
                        <span
                          className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-bold ${
                            stock <= 0
                              ? "bg-red-100 text-red-700 border border-red-200"
                              : stock <= 10
                              ? "bg-amber-100 text-amber-800 border border-amber-200"
                              : "bg-emerald-100 text-emerald-800 border border-emerald-200"
                          }`}
                        >
                          {stock <= 0
                            ? `🔴 Out of Stock (0 ${item.unit || "pcs"})`
                            : stock <= 10
                            ? `🟡 Low Stock (${stock} ${item.unit || "pcs"})`
                            : `🟢 High Stock (${stock} ${item.unit || "pcs"})`}
                        </span>
                        {stock === 0 && (
                          <button
                            type="button"
                            onClick={() => openEditModal(item)}
                            className="rounded-md bg-gold/20 px-2 py-0.5 text-xs font-bold text-ink hover:bg-gold transition-colors"
                          >
                            + Restock
                          </button>
                        )}
                      </div>
                    </td>
                    {canViewCosts && (
                      <td className="numeric-ltr px-4 py-3 text-ink/70 font-medium">
                        {formatKD(Number(item.cost))} KD
                      </td>
                    )}
                    <td className="numeric-ltr px-4 py-3 text-xs font-semibold text-ink">
                      <div>
                        <span className="font-bold text-ink">{formatKD(Number(item.retailPrice ?? item.price))} KD</span>
                        <span className="text-[10px] text-ink/50 block font-mono">Retail</span>
                      </div>
                      <div className="flex gap-2 text-[10px] text-ink/60 font-mono mt-0.5">
                        <span>Semi: {formatKD(Number(item.semiWholesalePrice ?? item.price))}</span>
                        <span>WS: {formatKD(Number(item.wholesalePrice ?? item.price))}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium ${
                          item.isActive ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {item.isActive ? t.inventory.yes : t.inventory.no}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-end">
                      <div className="flex items-center justify-end gap-1.5">
                        <Link
                          href={`/inventory/${item.id}`}
                          className="inline-flex items-center gap-1 rounded-lg border border-ink/15 bg-white px-2.5 py-1 text-xs font-medium text-ink hover:bg-ink/5 shadow-xs transition-colors"
                          title="View Details"
                        >
                          <span>👁️</span> View
                        </Link>
                        <button
                          type="button"
                          onClick={() => openEditModal(item)}
                          className="inline-flex items-center gap-1 rounded-lg bg-ink px-2.5 py-1 text-xs font-medium text-white hover:bg-gold hover:text-ink shadow-xs transition-colors"
                          title="Edit Item & Stock"
                        >
                          <span>✏️</span> Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(item)}
                          className="inline-flex items-center gap-1 rounded-lg bg-red-50 border border-red-200 px-2.5 py-1 text-xs font-medium text-red-600 hover:bg-red-600 hover:text-white shadow-xs transition-colors"
                          title="Delete Item"
                        >
                          <span>🗑️</span> Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {filteredItems.length === 0 && (
            <p className="px-4 py-8 text-center text-sm text-ink/40">{t.inventory.noResults}</p>
          )}
        </div>
      )}

      {/* Edit Item & Adjust Stock Modal */}
      {editingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl border border-ink/10 space-y-4">
            <div className="flex items-center justify-between border-b border-ink/10 pb-3">
              <div>
                <h3 className="text-lg font-semibold text-ink">Edit Item & Adjust Stock</h3>
                <p className="text-xs text-ink/60">Update details or replenish stock after stock finishes</p>
              </div>
              <button
                onClick={() => setEditingItem(null)}
                className="text-ink/40 hover:text-ink text-xl font-bold"
              >
                ✕
              </button>
            </div>

            {editError && (
              <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-700">
                {editError}
              </div>
            )}

            <form onSubmit={handleSaveEdit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-ink/70 mb-1">Item Name</label>
                  <input
                    type="text"
                    required
                    value={editFormData.name}
                    onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                    className="w-full rounded-xl border border-ink/10 bg-white px-3 py-2 text-sm outline-none focus:border-gold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-ink/70 mb-1">Category</label>
                  <select
                    value={editFormData.category}
                    onChange={(e) =>
                      setEditFormData({ ...editFormData, category: e.target.value as ItemCategory })
                    }
                    className="w-full rounded-xl border border-ink/10 bg-white px-3 py-2 text-sm outline-none focus:border-gold"
                  >
                    <option value="TOBACCO">Tobacco</option>
                    <option value="ACCESSORIES">Accessories</option>
                    <option value="ELECTRONICS">Electronics</option>
                    <option value="ART_SUPPLIES">Art Supplies</option>
                    <option value="OTHER">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-ink/70 mb-1">SKU</label>
                  <input
                    type="text"
                    required
                    value={editFormData.sku}
                    onChange={(e) => setEditFormData({ ...editFormData, sku: e.target.value })}
                    className="w-full rounded-xl border border-ink/10 bg-white px-3 py-2 text-sm outline-none focus:border-gold font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-ink/70 mb-1">Barcode</label>
                  <input
                    type="text"
                    value={editFormData.barcode}
                    onChange={(e) => setEditFormData({ ...editFormData, barcode: e.target.value })}
                    className="w-full rounded-xl border border-ink/10 bg-white px-3 py-2 text-sm outline-none focus:border-gold font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-ink/70 mb-1">
                    Current Stock Quantity (Edit to Restock)
                  </label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={editFormData.stockQuantity}
                    onChange={(e) => setEditFormData({ ...editFormData, stockQuantity: e.target.value })}
                    className="w-full rounded-xl border-2 border-gold/60 bg-gold/5 px-3 py-2 text-sm font-bold text-ink outline-none focus:border-gold"
                  />
                  {(() => {
                    const q = parseInt(editFormData.stockQuantity, 10) || 0;
                    const u = editFormData.unit || "pcs";
                    if (q <= 0) {
                      return <span className="inline-block mt-1.5 text-[11px] font-bold px-2 py-0.5 rounded bg-red-100 text-red-700 border border-red-200">🔴 Out of Stock (0 {u})</span>;
                    }
                    if (q <= 10) {
                      return <span className="inline-block mt-1.5 text-[11px] font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-800 border border-amber-200">🟡 Low Stock ({q} {u})</span>;
                    }
                    return <span className="inline-block mt-1.5 text-[11px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-200">🟢 High Stock ({q} {u})</span>;
                  })()}
                </div>

                <div>
                  <label className="block text-xs font-medium text-ink/70 mb-1">Unit</label>
                  <input
                    type="text"
                    value={editFormData.unit}
                    onChange={(e) => setEditFormData({ ...editFormData, unit: e.target.value })}
                    className="w-full rounded-xl border border-ink/10 bg-white px-3 py-2 text-sm outline-none focus:border-gold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-ink/70 mb-1">Cost Price (KD)</label>
                  <input
                    type="number"
                    step="0.001"
                    min="0"
                    required
                    value={editFormData.cost}
                    onChange={(e) => setEditFormData({ ...editFormData, cost: e.target.value })}
                    className="w-full rounded-xl border border-ink/10 bg-white px-3 py-2 text-sm outline-none focus:border-gold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-ink/70 mb-1">Retail Selling Price (KD)</label>
                  <input
                    type="number"
                    step="0.001"
                    min="0"
                    required
                    value={editFormData.price}
                    onChange={(e) => setEditFormData({ ...editFormData, price: e.target.value, retailPrice: e.target.value })}
                    className="w-full rounded-xl border border-ink/10 bg-white px-3 py-2 text-sm outline-none focus:border-gold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-ink/70 mb-1">Semi-Wholesale Price (KD)</label>
                  <input
                    type="number"
                    step="0.001"
                    min="0"
                    value={editFormData.semiWholesalePrice}
                    onChange={(e) => setEditFormData({ ...editFormData, semiWholesalePrice: e.target.value })}
                    className="w-full rounded-xl border border-ink/10 bg-white px-3 py-2 text-sm outline-none focus:border-gold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-ink/70 mb-1">Wholesale Price (KD)</label>
                  <input
                    type="number"
                    step="0.001"
                    min="0"
                    value={editFormData.wholesalePrice}
                    onChange={(e) => setEditFormData({ ...editFormData, wholesalePrice: e.target.value })}
                    className="w-full rounded-xl border border-ink/10 bg-white px-3 py-2 text-sm outline-none focus:border-gold"
                  />
                </div>

                {/* Multiple Barcodes Manager */}
                <div className="sm:col-span-2 space-y-2 p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-800">Multiple Barcodes Registry</span>
                    <button
                      type="button"
                      onClick={() =>
                        setEditFormData({
                          ...editFormData,
                          additionalBarcodes: [...editFormData.additionalBarcodes, ""],
                        })
                      }
                      className="text-xs font-bold text-indigo-600 hover:underline"
                    >
                      + Add Barcode
                    </button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {editFormData.additionalBarcodes.map((b, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <input
                          type="text"
                          value={b}
                          placeholder="Alt EAN / Pack Barcode"
                          onChange={(e) => {
                            const updated = [...editFormData.additionalBarcodes];
                            updated[idx] = e.target.value;
                            setEditFormData({ ...editFormData, additionalBarcodes: updated });
                          }}
                          className="w-full rounded-xl border border-slate-300 px-3 py-1.5 text-xs font-mono outline-none focus:border-indigo-500"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const updated = editFormData.additionalBarcodes.filter((_, i) => i !== idx);
                            setEditFormData({ ...editFormData, additionalBarcodes: updated });
                          }}
                          className="text-red-500 text-xs font-bold px-2 py-1"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                    {editFormData.additionalBarcodes.length === 0 && (
                      <span className="text-[11px] text-slate-400 italic">No secondary barcodes added.</span>
                    )}
                  </div>
                </div>

                {/* Multi-UOM Conversion Ratio Matrix */}
                <div className="sm:col-span-2 space-y-2 p-3.5 rounded-2xl bg-indigo-50/50 border border-indigo-100">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-indigo-900">Units of Measure (UOM) & Conversion Ratios</span>
                    <span className="text-[11px] text-indigo-600 font-mono">1 Carton = 10 Box = 200 Pack = 1000 Pcs</span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {editFormData.uoms.map((uom, idx) => (
                      <div key={idx} className="p-2.5 rounded-xl bg-white border border-indigo-200 space-y-1">
                        <div className="text-[11px] font-bold text-indigo-900">{uom.unitName}</div>
                        <div className="text-[10px] text-slate-500">Ratio: 1 {uom.unitName} =</div>
                        <input
                          type="number"
                          step="1"
                          min="1"
                          value={uom.conversionRatio}
                          onChange={(e) => {
                            const updated = [...editFormData.uoms];
                            updated[idx] = { ...uom, conversionRatio: parseFloat(e.target.value) || 1 };
                            setEditFormData({ ...editFormData, uoms: updated });
                          }}
                          className="w-full rounded-lg border border-slate-300 px-2 py-1 text-xs font-mono"
                        />
                        <span className="text-[10px] text-slate-400 font-mono">Base Units</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* System Admin Operational Governance Controls */}
                <div className="sm:col-span-2 p-3.5 rounded-2xl bg-amber-50/50 border border-amber-200/80 space-y-2">
                  <span className="text-xs font-bold text-amber-900 block">System Administrator Operational Controls</span>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                    <label className="flex items-center gap-2 text-amber-900 cursor-pointer font-medium">
                      <input
                        type="checkbox"
                        checked={editFormData.trackExpiry}
                        onChange={(e) => setEditFormData({ ...editFormData, trackExpiry: e.target.checked })}
                        className="rounded border-amber-300 text-amber-600 focus:ring-amber-500"
                      />
                      Track Expiry Dates
                    </label>

                    <label className="flex items-center gap-2 text-amber-900 cursor-pointer font-medium">
                      <input
                        type="checkbox"
                        checked={editFormData.blockFreeGift}
                        onChange={(e) => setEditFormData({ ...editFormData, blockFreeGift: e.target.checked })}
                        className="rounded border-amber-300 text-amber-600 focus:ring-amber-500"
                      />
                      Block Free Gift Issue
                    </label>

                    <label className="flex items-center gap-2 text-amber-900 cursor-pointer font-medium">
                      <input
                        type="checkbox"
                        checked={editFormData.blockDiscount}
                        onChange={(e) => setEditFormData({ ...editFormData, blockDiscount: e.target.checked })}
                        className="rounded border-amber-300 text-amber-600 focus:ring-amber-500"
                      />
                      Block All Discounts
                    </label>
                  </div>

                  <div className="pt-2 flex items-center gap-2 text-xs">
                    <span className="text-amber-900 font-medium">Max Allowed Discount %:</span>
                    <input
                      type="number"
                      step="1"
                      min="0"
                      max="100"
                      value={editFormData.maxDiscountPercent}
                      onChange={(e) => setEditFormData({ ...editFormData, maxDiscountPercent: e.target.value })}
                      className="w-20 rounded-lg border border-amber-300 px-2 py-1 text-xs font-mono font-bold text-amber-950"
                    />
                    <span className="text-amber-700 text-[11px]">% max cap for cashiers</span>
                  </div>
                </div>

                <div className="sm:col-span-2 rounded-xl bg-ink/5 p-3 border border-ink/10 flex items-center justify-between text-xs">
                  <span className="font-semibold text-ink/70">Estimated Profit & Gross Margin:</span>
                  {(() => {
                    const price = parseFloat(editFormData.price) || 0;
                    const cost = parseFloat(editFormData.cost) || 0;
                    const profit = price - cost;
                    const margin = price > 0 ? (profit / price) * 100 : 0;
                    return (
                      <span className={`font-bold ${profit >= 0 ? "text-emerald-700" : "text-red-600"}`}>
                        {formatKD(profit)} KD ({margin.toFixed(1)}% margin)
                      </span>
                    );
                  })()}
                </div>

                <div className="flex items-center sm:col-span-2 pt-1">
                  <label className="flex items-center gap-2 text-xs font-medium text-ink cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editFormData.isActive}
                      onChange={(e) => setEditFormData({ ...editFormData, isActive: e.target.checked })}
                      className="rounded border-ink/20 text-gold focus:ring-gold"
                    />
                    Active Item
                  </label>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-ink/10">
                <button
                  type="button"
                  onClick={() => setEditingItem(null)}
                  className="rounded-xl border border-ink/10 px-4 py-2 text-xs font-medium text-ink hover:bg-ink/5"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="rounded-xl bg-ink px-4 py-2 text-xs font-medium text-white hover:bg-gold hover:text-ink disabled:opacity-50 transition-colors"
                >
                  {isSaving ? "Saving..." : "Save & Update Stock"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}