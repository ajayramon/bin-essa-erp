"use client";

import React, { useState, useEffect } from "react";
import {
  Eye,
  EyeOff,
  Search,
  Filter,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Building2,
  RefreshCw,
  Sliders,
  Layers,
  Save,
} from "lucide-react";
import {
  listItemsRequest,
  updateItemRequest,
  listBranchesRequest,
  ItemRecord,
  BranchRecord,
} from "@/lib/api";

export default function VisibilityAdminPage() {
  const [items, setItems] = useState<ItemRecord[]>([]);
  const [branches, setBranches] = useState<BranchRecord[]>([]);
  const [selectedBranch, setSelectedBranch] = useState<string>("ALL");
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    try {
      const [itemsData, branchesData] = await Promise.all([
        listItemsRequest(),
        listBranchesRequest(),
      ]);
      setItems(itemsData);
      setBranches(branchesData);
    } catch (e) {
      console.error("Failed to load visibility master data", e);
    } finally {
      setLoading(false);
    }
  }

  async function handleToggleProperty(
    item: ItemRecord,
    property: "posVisible" | "allowSale" | "allowDiscount" | "allowGift" | "isActive"
  ) {
    setSavingId(item.id);
    const updatedValue = !item[property];
    const payload = { [property]: updatedValue };

    try {
      const updated = await updateItemRequest(item.id, payload);
      setItems((prev) =>
        prev.map((it) => (it.id === item.id ? { ...it, ...payload } : it))
      );
      setSuccessMessage(`Updated ${item.nameEn || item.name} visibility settings`);
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      console.error("Failed to update visibility", err);
    } finally {
      setSavingId(null);
    }
  }

  async function handleBatchPosVisibility(enable: boolean) {
    setLoading(true);
    try {
      const filtered = items.filter((it) => {
        const matchesCat =
          selectedCategory === "ALL" || it.category === selectedCategory;
        const matchesSearch =
          !searchQuery ||
          it.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          it.sku.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCat && matchesSearch;
      });

      for (const it of filtered) {
        await updateItemRequest(it.id, { posVisible: enable });
      }

      setItems((prev) =>
        prev.map((it) => {
          const inFiltered = filtered.some((f) => f.id === it.id);
          return inFiltered ? { ...it, posVisible: enable } : it;
        })
      );
      setSuccessMessage(
        `Batch ${enable ? "enabled" : "disabled"} POS visibility for ${
          filtered.length
        } items`
      );
      setTimeout(() => setSuccessMessage(null), 4000);
    } catch (e) {
      console.error("Failed batch update", e);
    } finally {
      setLoading(false);
    }
  }

  const filteredItems = items.filter((item) => {
    const matchesSearch =
      !searchQuery ||
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.nameAr && item.nameAr.toLowerCase().includes(searchQuery.toLowerCase())) ||
      item.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.barcode && item.barcode.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory =
      selectedCategory === "ALL" || item.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const categories = Array.from(new Set(items.map((it) => it.category || "GENERAL")));

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-amber-500/10 border border-amber-500/20 rounded-xl text-amber-400">
              <Eye className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white tracking-tight">
                Product Visibility & Commercial Controls
              </h1>
              <p className="text-sm text-slate-400">
                إدارة ظهور المنتجات وقواعد البيع والخصم عبر الفروع ونقاط البيع
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => handleBatchPosVisibility(true)}
            className="px-4 py-2.5 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 rounded-xl text-xs font-semibold flex items-center gap-2 transition"
          >
            <Eye className="w-4 h-4" />
            Enable Filtered in POS
          </button>
          <button
            onClick={() => handleBatchPosVisibility(false)}
            className="px-4 py-2.5 bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 border border-rose-500/30 rounded-xl text-xs font-semibold flex items-center gap-2 transition"
          >
            <EyeOff className="w-4 h-4" />
            Hide Filtered in POS
          </button>
          <button
            onClick={loadData}
            className="p-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl border border-slate-700 transition"
            title="Refresh"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </button>
        </div>
      </div>

      {/* Success Notification */}
      {successMessage && (
        <div className="bg-emerald-950/60 border border-emerald-600/40 text-emerald-300 px-4 py-3 rounded-xl flex items-center gap-2 text-sm">
          <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Filters Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-slate-900/60 border border-slate-800/80 p-4 rounded-xl">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
          <input
            type="text"
            placeholder="Search SKU, Barcode, Product Name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-800/80 border border-slate-700/80 rounded-xl text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-500/50"
          />
        </div>

        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-slate-400" />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full py-2.5 px-3 bg-slate-800/80 border border-slate-700/80 rounded-xl text-sm text-slate-200 focus:outline-none focus:border-amber-500/50"
          >
            <option value="ALL">All Categories (جميع الفئات)</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2">
          <Building2 className="w-4 h-4 text-slate-400" />
          <select
            value={selectedBranch}
            onChange={(e) => setSelectedBranch(e.target.value)}
            className="w-full py-2.5 px-3 bg-slate-800/80 border border-slate-700/80 rounded-xl text-sm text-slate-200 focus:outline-none focus:border-amber-500/50"
          >
            <option value="ALL">All 14 Branches (جميع الفروع الـ 14)</option>
            {branches.map((b) => (
              <option key={b.id} value={b.id}>
                {b.code} - {b.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Summary Chips */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-xl">
          <div className="text-xs text-slate-400 font-medium">Total Products</div>
          <div className="text-2xl font-bold text-white mt-1">{items.length}</div>
        </div>
        <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-xl">
          <div className="text-xs text-slate-400 font-medium">Visible in POS</div>
          <div className="text-2xl font-bold text-emerald-400 mt-1">
            {items.filter((it) => it.posVisible !== false).length}
          </div>
        </div>
        <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-xl">
          <div className="text-xs text-slate-400 font-medium">Discount Blocked</div>
          <div className="text-2xl font-bold text-amber-400 mt-1">
            {items.filter((it) => it.allowDiscount === false).length}
          </div>
        </div>
        <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-xl">
          <div className="text-xs text-slate-400 font-medium">Sales Blocked</div>
          <div className="text-2xl font-bold text-rose-400 mt-1">
            {items.filter((it) => it.allowSale === false).length}
          </div>
        </div>
      </div>

      {/* Visibility Table */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-slate-800/80 text-xs uppercase font-semibold text-slate-400 border-b border-slate-700/80">
              <tr>
                <th className="px-5 py-4">Product / SKU</th>
                <th className="px-4 py-4">Category / Brand</th>
                <th className="px-4 py-4 text-center">POS Terminal Visibility</th>
                <th className="px-4 py-4 text-center">Allow Sale</th>
                <th className="px-4 py-4 text-center">Allow Discount</th>
                <th className="px-4 py-4 text-center">Allow Free Gift</th>
                <th className="px-4 py-4 text-center">Master Active</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-slate-500">
                    <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-amber-500" />
                    Loading catalog items and visibility rules...
                  </td>
                </tr>
              ) : filteredItems.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-slate-500">
                    No items match the selected filters.
                  </td>
                </tr>
              ) : (
                filteredItems.map((item) => {
                  const isSaving = savingId === item.id;
                  const isPosVisible = item.posVisible !== false;
                  const isSaleAllowed = item.allowSale !== false;
                  const isDiscountAllowed = item.allowDiscount !== false;
                  const isGiftAllowed = item.allowGift !== false;
                  const isItemActive = item.isActive !== false;

                  return (
                    <tr
                      key={item.id}
                      className="hover:bg-slate-800/40 transition-colors"
                    >
                      <td className="px-5 py-4">
                        <div className="font-semibold text-white">
                          {item.nameEn || item.name}
                        </div>
                        {item.nameAr && (
                          <div className="text-xs text-slate-400 font-arabic">
                            {item.nameAr}
                          </div>
                        )}
                        <div className="text-xs font-mono text-slate-500 mt-0.5">
                          SKU: {item.sku} {item.barcode && `| Barcode: ${item.barcode}`}
                        </div>
                      </td>

                      <td className="px-4 py-4">
                        <span className="inline-block px-2 py-0.5 rounded-md bg-slate-800 text-xs text-slate-300 font-medium">
                          {item.category || "GENERAL"}
                        </span>
                        {item.brand && (
                          <div className="text-xs text-slate-500 mt-1">
                            {item.brand}
                          </div>
                        )}
                      </td>

                      {/* POS Visibility Toggle */}
                      <td className="px-4 py-4 text-center">
                        <button
                          disabled={isSaving}
                          onClick={() => handleToggleProperty(item, "posVisible")}
                          className={`px-3 py-1.5 rounded-xl text-xs font-semibold inline-flex items-center gap-1.5 transition ${
                            isPosVisible
                              ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/30"
                              : "bg-slate-800 text-slate-500 border border-slate-700 hover:bg-slate-750"
                          }`}
                        >
                          {isPosVisible ? (
                            <>
                              <Eye className="w-3.5 h-3.5" /> Visible
                            </>
                          ) : (
                            <>
                              <EyeOff className="w-3.5 h-3.5" /> Hidden
                            </>
                          )}
                        </button>
                      </td>

                      {/* Allow Sale Toggle */}
                      <td className="px-4 py-4 text-center">
                        <button
                          disabled={isSaving}
                          onClick={() => handleToggleProperty(item, "allowSale")}
                          className={`px-3 py-1.5 rounded-xl text-xs font-semibold inline-flex items-center gap-1.5 transition ${
                            isSaleAllowed
                              ? "bg-blue-500/20 text-blue-400 border border-blue-500/30 hover:bg-blue-500/30"
                              : "bg-rose-500/20 text-rose-400 border border-rose-500/30 hover:bg-rose-500/30"
                          }`}
                        >
                          {isSaleAllowed ? "Allowed" : "Blocked"}
                        </button>
                      </td>

                      {/* Allow Discount Toggle */}
                      <td className="px-4 py-4 text-center">
                        <button
                          disabled={isSaving}
                          onClick={() => handleToggleProperty(item, "allowDiscount")}
                          className={`px-3 py-1.5 rounded-xl text-xs font-semibold inline-flex items-center gap-1.5 transition ${
                            isDiscountAllowed
                              ? "bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 hover:bg-indigo-500/30"
                              : "bg-amber-500/20 text-amber-400 border border-amber-500/30 hover:bg-amber-500/30"
                          }`}
                        >
                          {isDiscountAllowed ? "Discount OK" : "No Discount"}
                        </button>
                      </td>

                      {/* Allow Gift Toggle */}
                      <td className="px-4 py-4 text-center">
                        <button
                          disabled={isSaving}
                          onClick={() => handleToggleProperty(item, "allowGift")}
                          className={`px-3 py-1.5 rounded-xl text-xs font-semibold inline-flex items-center gap-1.5 transition ${
                            isGiftAllowed
                              ? "bg-purple-500/20 text-purple-400 border border-purple-500/30 hover:bg-purple-500/30"
                              : "bg-slate-800 text-slate-500 border border-slate-700"
                          }`}
                        >
                          {isGiftAllowed ? "Gift OK" : "No Gift"}
                        </button>
                      </td>

                      {/* Master Active Status */}
                      <td className="px-4 py-4 text-center">
                        <button
                          disabled={isSaving}
                          onClick={() => handleToggleProperty(item, "isActive")}
                          className={`px-3 py-1.5 rounded-xl text-xs font-semibold inline-flex items-center gap-1.5 transition ${
                            isItemActive
                              ? "bg-emerald-950/60 text-emerald-400 border border-emerald-600/30"
                              : "bg-rose-950/60 text-rose-400 border border-rose-600/30"
                          }`}
                        >
                          {isItemActive ? "Active" : "Archived"}
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
