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
    cost: "",
    unit: "pcs",
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
    if (Number.isNaN(price) || price < 0) {
      setError("Price must be a valid non-negative number.");
      return;
    }
    if (Number.isNaN(cost) || cost < 0) {
      setError("Cost must be a valid non-negative number.");
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
    };

    setSubmitting(true);
    try {
      await createItemRequest(payload);
      setSuccess(true);
      setForm({
        sku: "",
        barcode: "",
        name: "",
        category: "TOBACCO",
        price: "",
        cost: "",
        unit: "pcs",
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create item.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="max-w-lg mx-auto p-6">
      <h1 className="text-xl font-bold mb-4" style={{ color: "#000" }}>
        Add Item
      </h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">SKU *</label>
          <input
            type="text"
            value={form.sku}
            onChange={(e) => update("sku", e.target.value)}
            className="w-full border rounded px-3 py-2"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Name *</label>
          <input
            type="text"
            value={form.name}
            onChange={(e) => update("name", e.target.value)}
            className="w-full border rounded px-3 py-2"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Barcode</label>
          <input
            type="text"
            value={form.barcode}
            onChange={(e) => update("barcode", e.target.value)}
            className="w-full border rounded px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Category *</label>
          <select
            value={form.category}
            onChange={(e) => update("category", e.target.value as ItemCategory)}
            className="w-full border rounded px-3 py-2"
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Price (KWD) *
            </label>
            <input
              type="number"
              step="0.001"
              min="0"
              value={form.price}
              onChange={(e) => update("price", e.target.value)}
              className="w-full border rounded px-3 py-2"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Cost (KWD) *
            </label>
            <input
              type="number"
              step="0.001"
              min="0"
              value={form.cost}
              onChange={(e) => update("cost", e.target.value)}
              className="w-full border rounded px-3 py-2"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Unit</label>
          <input
            type="text"
            value={form.unit}
            onChange={(e) => update("unit", e.target.value)}
            className="w-full border rounded px-3 py-2"
          />
        </div>

        {error && (
          <p className="text-sm" style={{ color: "#b91c1c" }}>
            {error}
          </p>
        )}
        {success && (
          <p className="text-sm" style={{ color: "#15803d" }}>
            Item created successfully.
          </p>
        )}

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={submitting}
            className="px-4 py-2 rounded font-semibold"
            style={{ backgroundColor: "#FDCE0C", color: "#000" }}
          >
            {submitting ? "Saving..." : "Save Item"}
          </button>
          <button
            type="button"
            onClick={() => router.push("/inventory")}
            className="px-4 py-2 rounded border"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
