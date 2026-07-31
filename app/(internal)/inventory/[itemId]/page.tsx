"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
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

export default function ItemDetailPage() {
  const { t } = useLocale();
  const params = useParams();
  const router = useRouter();
  const itemId = params.itemId as string;

  const [item, setItem] = useState<ItemResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notFound, setNotFound] = useState(false);

  // Edit Modal State
  const [isEditing, setIsEditing] = useState(false);
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

  const fetchItem = async () => {
    setIsLoading(true);
    setError(null);
    setNotFound(false);
    try {
      const allItems = await listItemsRequest();
      const found = allItems.find((i) => i.id === itemId) ?? null;
      if (!found) {
        setNotFound(true);
      } else {
        setItem(found);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load item");
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
      sku: item.sku,
      barcode: item.barcode ?? "",
      category: item.category,
      price: String(item.price),
      cost: String(item.cost),
      stockQuantity: String((item as any).stockQuantity ?? 0),
      unit: item.unit || "pcs",
      isActive: item.isActive,
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
      setItem(updated);
      setIsEditing(false);
    } catch (err) {
      setEditError(err instanceof Error ? err.message : "Failed to update item");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!item || !confirm(`Are you sure you want to delete "${item.name}"?`)) return;
    try {
      await deleteItemRequest(item.id);
      router.push("/inventory");
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to delete item");
    }
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <p className="text-sm text-ink/50">Loading…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <p className="text-sm text-red-600">{error}</p>
        <Link href="/inventory" className="mt-3 inline-block text-sm text-gold underline">
          {t.inventory.backToList}
        </Link>
      </div>
    );
  }

  if (notFound || !item) {
    return (
      <div className="p-6">
        <p className="text-sm text-ink/50">{t.inventory.noResults}</p>
        <Link href="/inventory" className="mt-3 inline-block text-sm text-gold underline">
          {t.inventory.backToList}
        </Link>
      </div>
    );
  }

  const stock = (item as any).stockQuantity ?? 0;

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <Link href="/inventory" className="text-sm text-ink/50 hover:text-gold">
            {t.inventory.backToList}
          </Link>
          <h1 className="mt-2 text-2xl font-semibold text-ink">{item.name}</h1>
          <p className="numeric-ltr mt-1 text-sm text-ink/50">{item.sku}</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={openEditModal}
            className="rounded-xl bg-ink px-4 py-2 text-sm font-medium text-white hover:bg-gold hover:text-ink transition-colors"
          >
            Edit / Restock Item
          </button>
          <button
            type="button"
            onClick={handleDelete}
            className="rounded-xl bg-red-50 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-100 transition-colors"
          >
            Delete Item
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-ink/10 bg-white p-5 shadow-sm">
          <p className="text-sm text-ink/50">Current Stock Quantity</p>
          <p className="mt-1 text-2xl font-bold text-ink">
            <span className={stock > 0 ? "text-emerald-700" : "text-red-600"}>
              {stock}
            </span>{" "}
            <span className="text-sm font-normal text-ink/40">{item.unit || "pcs"}</span>
          </p>
        </div>
        <div className="rounded-2xl border border-ink/10 bg-white p-5 shadow-sm">
          <p className="text-sm text-ink/50">{t.inventory.sellPrice}</p>
          <p className="numeric-ltr mt-1 text-xl font-semibold text-ink">
            {formatKD(Number(item.price))} <span className="text-sm font-normal text-ink/40">KD</span>
          </p>
        </div>
        <div className="rounded-2xl border border-ink/10 bg-white p-5 shadow-sm">
          <p className="text-sm text-ink/50">{t.inventory.costPrice}</p>
          <p className="numeric-ltr mt-1 text-xl font-semibold text-ink">
            {formatKD(Number(item.cost))} <span className="text-sm font-normal text-ink/40">KD</span>
          </p>
        </div>
      </div>

      <div className="rounded-2xl border border-ink/10 bg-white p-5 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold text-ink">{t.inventory.category}</h2>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="flex items-center justify-between rounded-lg px-3 py-2">
            <span className="text-sm text-ink/60">{t.inventory.category}</span>
            <span className="text-sm font-medium text-ink">{item.category}</span>
          </div>
          <div className="flex items-center justify-between rounded-lg px-3 py-2">
            <span className="text-sm text-ink/60">{t.inventory.barcode}</span>
            <span className="numeric-ltr text-sm font-medium text-ink">
              {item.barcode ?? "—"}
            </span>
          </div>
          <div className="flex items-center justify-between rounded-lg px-3 py-2">
            <span className="text-sm text-ink/60">Unit</span>
            <span className="text-sm font-medium text-ink">{item.unit}</span>
          </div>
          <div className="flex items-center justify-between rounded-lg px-3 py-2">
            <span className="text-sm text-ink/60">Active</span>
            <span className="text-sm font-medium text-ink">
              {item.isActive ? t.inventory.yes : t.inventory.no}
            </span>
          </div>
        </div>
      </div>

      {/* Edit Item & Restock Modal */}
      {isEditing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl border border-ink/10 space-y-4">
            <div className="flex items-center justify-between border-b border-ink/10 pb-3">
              <div>
                <h3 className="text-lg font-semibold text-ink">Edit Item & Restock</h3>
                <p className="text-xs text-ink/60">Adjust stock quantity or edit item details</p>
              </div>
              <button
                onClick={() => setIsEditing(false)}
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
                    Stock Quantity (Edit to Restock)
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
                  onClick={() => setIsEditing(false)}
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