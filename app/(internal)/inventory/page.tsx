"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { useLocale } from "@/lib/i18n/LocaleContext";
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
  const { t } = useLocale();

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
    cost: "",
    stockQuantity: "0",
    unit: "pcs",
    isActive: true,
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

  const categories = Array.from(new Set(allItems.map((i) => i.category)));

  const filteredItems = allItems.filter((item) => {
    if (categoryFilter !== "all" && item.category !== categoryFilter) return false;
    const q = query.trim().toLowerCase();
    if (!q) return true;
    return (
      item.name.toLowerCase().includes(q) ||
      item.sku.toLowerCase().includes(q) ||
      (item.barcode ?? "").toLowerCase().includes(q)
    );
  });

  const openEditModal = (item: ItemResponse) => {
    setEditingItem(item);
    setEditError(null);
    setEditFormData({
      name: item.name,
      sku: item.sku,
      barcode: item.barcode ?? "",
      category: item.category,
      price: String(item.price),
      cost: String(item.cost),
      stockQuantity: String((item as any).stockQuantity ?? 0),
      unit: item.unit || "pcs",
      isActive: item.isActive,
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
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-ink">{t.inventory.title}</h1>
          <p className="mt-1 text-ink/60">{t.inventory.subtitle}</p>
        </div>
        <Link
          href="/inventory/new"
          className="whitespace-nowrap rounded-xl bg-ink px-4 py-2.5 text-sm font-medium text-white hover:bg-gold hover:text-ink transition-colors"
        >
          + Add Item
        </Link>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t.inventory.searchPlaceholder}
          className="w-full flex-1 rounded-2xl border border-ink/10 bg-white px-4 py-3 text-sm shadow-sm outline-none focus:border-gold"
        />
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="rounded-2xl border border-ink/10 bg-white px-4 py-3 text-sm shadow-sm outline-none focus:border-gold sm:w-64"
        >
          <option value="all">{t.inventory.allCategories}</option>
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      {isLoading && (
        <div className="rounded-2xl border border-ink/10 bg-white p-8 text-center text-sm text-ink/50 shadow-sm">
          Loading items…
        </div>
      )}

      {!isLoading && error && (
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
                <th className="px-4 py-3 text-start font-medium">{t.inventory.category}</th>
                <th className="px-4 py-3 text-start font-medium">{t.inventory.sku}</th>
                <th className="px-4 py-3 text-start font-medium">Current Stock</th>
                <th className="px-4 py-3 text-start font-medium">Cost Price</th>
                <th className="px-4 py-3 text-start font-medium">{t.inventory.sellPrice}</th>
                <th className="px-4 py-3 text-end font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink/5">
              {filteredItems.map((item) => {
                const stock = (item as any).stockQuantity ?? 0;
                return (
                  <tr key={item.id} className="hover:bg-ink/5">
                    <td className="px-4 py-3 font-medium text-ink">{item.name}</td>
                    <td className="px-4 py-3 text-ink/70">{item.category}</td>
                    <td className="numeric-ltr px-4 py-3 text-ink/60 font-mono">{item.sku}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                            stock > 0 ? "bg-emerald-100 text-emerald-800" : "bg-red-100 text-red-700 font-bold"
                          }`}
                        >
                          {stock > 0 ? `${stock} ${item.unit || "pcs"}` : "Stock Finished (0 pcs)"}
                        </span>
                        {stock === 0 && (
                          <button
                            type="button"
                            onClick={() => openEditModal(item)}
                            className="rounded bg-gold/20 px-2 py-0.5 text-xs font-bold text-ink hover:bg-gold transition-colors"
                          >
                            + Restock
                          </button>
                        )}
                      </div>
                    </td>
                    <td className="numeric-ltr px-4 py-3 text-ink/70">
                      {formatKD(Number(item.cost))} KD
                    </td>
                    <td className="numeric-ltr px-4 py-3 font-semibold text-ink">
                      {formatKD(Number(item.price))} KD
                    </td>
                    <td className="px-4 py-3 text-end">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/inventory/${item.id}`}
                          className="rounded-lg border border-ink/10 bg-white px-2.5 py-1 text-xs font-medium text-ink hover:bg-ink/5"
                        >
                          View
                        </Link>
                        <button
                          type="button"
                          onClick={() => openEditModal(item)}
                          className="rounded-lg bg-ink px-2.5 py-1 text-xs font-medium text-white hover:bg-gold hover:text-ink transition-colors"
                        >
                          Edit / Adjust Stock
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(item)}
                          className="rounded-lg bg-red-50 px-2.5 py-1 text-xs font-medium text-red-600 hover:bg-red-100 transition-colors"
                        >
                          Delete
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
                  <label className="block text-xs font-medium text-ink/70 mb-1">Selling Price (KD)</label>
                  <input
                    type="number"
                    step="0.001"
                    min="0"
                    required
                    value={editFormData.price}
                    onChange={(e) => setEditFormData({ ...editFormData, price: e.target.value })}
                    className="w-full rounded-xl border border-ink/10 bg-white px-3 py-2 text-sm outline-none focus:border-gold"
                  />
                </div>

                <div className="flex items-center sm:col-span-2 pt-2">
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