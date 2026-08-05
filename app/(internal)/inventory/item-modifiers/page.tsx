"use client";

import { useEffect, useState } from "react";
import { useLocale } from "@/lib/i18n/LocaleContext";
import {
  listItemsRequest,
  listItemVariantsRequest,
  createItemVariantRequest,
  type ItemRecord,
  type ItemVariantRecord,
} from "@/lib/api";

function formatKD(amount: number) {
  return amount.toLocaleString("en-US", { minimumFractionDigits: 3, maximumFractionDigits: 3 });
}

export default function ItemModifiersPage() {
  const { locale, t } = useLocale();

  const [items, setItems] = useState<ItemRecord[]>([]);
  const [selectedItemId, setSelectedItemId] = useState<string>("");
  const [variants, setVariants] = useState<ItemVariantRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Create Modal State
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    sku: "",
    barcode: "",
    variantName: "",
    price: 0.0,
    cost: 0.0,
    stock: 0,
  });

  async function loadItems() {
    setLoading(true);
    setError(null);
    try {
      const data = await listItemsRequest();
      setItems(data);
      if (data.length > 0 && !selectedItemId) {
        setSelectedItemId(data[0].id);
      }
    } catch (e: any) {
      setError(e.message || "Failed to load catalog items");
    } finally {
      setLoading(false);
    }
  }

  async function loadVariants(itemId: string) {
    if (!itemId) return;
    try {
      const data = await listItemVariantsRequest(itemId);
      setVariants(data);
    } catch (e: any) {
      console.warn("Could not fetch variants for item", itemId, e);
    }
  }

  useEffect(() => {
    loadItems();
  }, []);

  useEffect(() => {
    if (selectedItemId) {
      loadVariants(selectedItemId);
    }
  }, [selectedItemId]);

  async function handleCreateVariant(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedItemId) return;
    setError(null);
    try {
      const created = await createItemVariantRequest({
        itemId: selectedItemId,
        sku: form.sku,
        barcode: form.barcode,
        variantName: form.variantName,
        price: form.price,
        cost: form.cost,
        stock: form.stock,
      });
      setSuccessMsg(`Variant "${created.variantName}" created successfully!`);
      setShowModal(false);
      setForm({ sku: "", barcode: "", variantName: "", price: 0.0, cost: 0.0, stock: 0 });
      loadVariants(selectedItemId);
    } catch (e: any) {
      setError(e.message || "Failed to create variant");
    }
  }

  const selectedItem = items.find((i) => i.id === selectedItemId);

  const filteredVariants = variants.filter(
    (v) =>
      v.variantName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.barcode?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-ink/10 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-ink">
            {locale === "ar" ? "متغيرات الصنف والمواصفات" : "Item Modifiers & Product Variants"}
          </h1>
          <p className="text-xs text-ink/50 mt-0.5">
            {locale === "ar"
              ? "إدارة خصائص الصنف الفرعية (النكهة، اللون، النيكوتين، الحجم) وأرقام الباركود والأسعار KWD"
              : "Configure sub-SKU variants, nic levels, flavors, barcodes, and custom unit prices."}
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          disabled={!selectedItemId}
          className="inline-flex items-center gap-2 rounded-xl bg-ink px-4 py-2.5 text-xs font-bold text-white shadow hover:bg-gold hover:text-ink transition-colors disabled:opacity-40"
        >
          <span>➕</span> Add New Variant
        </button>
      </div>

      {/* Executive Smart Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-2xl border border-ink/10 bg-white p-4 shadow-sm">
          <p className="text-xs font-medium text-ink/50 uppercase tracking-wider">Total Catalog Items</p>
          <p className="mt-1 text-2xl font-bold text-ink">{items.length}</p>
        </div>
        <div className="rounded-2xl border border-ink/10 bg-white p-4 shadow-sm">
          <p className="text-xs font-medium text-ink/50 uppercase tracking-wider">Active Variants (Selected SKU)</p>
          <p className="mt-1 text-2xl font-bold text-indigo-700">{variants.length}</p>
        </div>
        <div className="rounded-2xl border border-ink/10 bg-white p-4 shadow-sm">
          <p className="text-xs font-medium text-ink/50 uppercase tracking-wider">Selected Master Item</p>
          <p className="mt-1 text-base font-bold text-ink line-clamp-1">{selectedItem ? selectedItem.name : "None"}</p>
        </div>
      </div>

      {/* Alerts */}
      {error && (
        <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold">
          ⚠️ {error}
        </div>
      )}
      {successMsg && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold">
          ✅ {successMsg}
        </div>
      )}

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Item Selector List */}
        <div className="lg:col-span-4 space-y-3">
          <div className="rounded-2xl border border-ink/10 bg-white p-4 shadow-sm space-y-3">
            <h2 className="text-sm font-bold text-ink">Select Base Master Product</h2>

            <div className="divide-y divide-ink/5 max-h-[550px] overflow-y-auto pr-1">
              {items.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setSelectedItemId(item.id)}
                  className={`w-full text-start p-3 rounded-xl transition flex items-center justify-between my-1 ${
                    selectedItemId === item.id
                      ? "bg-gold/20 border border-gold text-ink font-bold"
                      : "hover:bg-ink/5 text-ink/80"
                  }`}
                >
                  <div className="space-y-0.5">
                    <div className="font-bold text-xs text-ink">{item.name}</div>
                    <div className="text-[11px] text-ink/50 font-mono">SKU: {item.sku}</div>
                  </div>
                  <span className="numeric-ltr text-xs font-mono font-bold text-ink">
                    {formatKD(Number(item.price))} KD
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Selected Item Variants Grid */}
        <div className="lg:col-span-8 space-y-4">
          {selectedItem ? (
            <div className="rounded-2xl border border-ink/10 bg-white p-5 shadow-sm space-y-4">
              {/* Product Info Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-ink/10 pb-4">
                <div>
                  <h2 className="text-base font-bold text-ink">{selectedItem.name}</h2>
                  <p className="numeric-ltr text-xs text-ink/50 font-mono mt-0.5">
                    Master SKU: {selectedItem.sku} | Base Price: {formatKD(Number(selectedItem.price))} KD
                  </p>
                </div>

                <div className="relative w-64">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search variants by name, SKU..."
                    className="w-full bg-white border border-ink/10 rounded-xl px-3 py-2 text-xs text-ink outline-none focus:border-gold font-mono"
                  />
                </div>
              </div>

              {/* Variants Table */}
              <div className="rounded-xl border border-ink/10 bg-white overflow-hidden">
                <table className="w-full text-start text-xs">
                  <thead className="bg-ink/5 text-ink/70 font-semibold border-b border-ink/10">
                    <tr>
                      <th className="p-3 text-start">Variant Name</th>
                      <th className="p-3 text-start">Variant SKU</th>
                      <th className="p-3 text-start">Barcode</th>
                      <th className="p-3 text-start">Selling Price</th>
                      <th className="p-3 text-start">Cost</th>
                      <th className="p-3 text-start">Stock</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-ink/5 font-mono">
                    {filteredVariants.map((v) => (
                      <tr key={v.id} className="hover:bg-ink/5 transition">
                        <td className="p-3 font-bold font-sans text-ink">{v.variantName}</td>
                        <td className="p-3 text-ink/70">{v.sku}</td>
                        <td className="p-3 text-ink/50">{v.barcode || "—"}</td>
                        <td className="p-3 font-bold text-ink">
                          {formatKD(Number(v.price))} KD
                        </td>
                        <td className="p-3 text-ink/50">{formatKD(Number(v.cost))} KD</td>
                        <td className="p-3">
                          <span
                            className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                              v.stock > 10
                                ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                                : v.stock > 0
                                ? "bg-amber-100 text-amber-800 border border-amber-200"
                                : "bg-red-100 text-red-700 border border-red-200"
                            }`}
                          >
                            {v.stock} pcs
                          </span>
                        </td>
                      </tr>
                    ))}
                    {filteredVariants.length === 0 && (
                      <tr>
                        <td colSpan={6} className="p-8 text-center text-ink/40 font-sans">
                          No variants created for this item yet. Click "Add New Variant" to define attributes.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="p-12 rounded-2xl border border-ink/10 bg-white text-center text-ink/40 shadow-sm">
              Select an item from the left catalog list to manage its variants.
            </div>
          )}
        </div>
      </div>

      {/* Create Variant Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 max-w-md w-full space-y-5 shadow-2xl text-slate-800">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">Add New Item Variant</h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-slate-400 hover:text-slate-600 font-bold text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateVariant} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Variant Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Nic 50mg - Blue Razz"
                  value={form.variantName}
                  onChange={(e) => setForm({ ...form, variantName: e.target.value })}
                  className="w-full rounded-xl border border-slate-300 px-3 py-2 text-slate-900 outline-none focus:border-indigo-600 bg-slate-50"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Variant SKU</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. VAPE-01-BLUERAZZ"
                    value={form.sku}
                    onChange={(e) => setForm({ ...form, sku: e.target.value })}
                    className="w-full rounded-xl border border-slate-300 px-3 py-2 font-mono outline-none focus:border-indigo-600 bg-slate-50"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Barcode</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 62911002233"
                    value={form.barcode}
                    onChange={(e) => setForm({ ...form, barcode: e.target.value })}
                    className="w-full rounded-xl border border-slate-300 px-3 py-2 font-mono outline-none focus:border-indigo-600 bg-slate-50"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Price (KD)</label>
                  <input
                    type="number"
                    step="0.001"
                    required
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: parseFloat(e.target.value) || 0 })}
                    className="w-full rounded-xl border border-slate-300 px-3 py-2 font-mono outline-none focus:border-indigo-600 bg-slate-50"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Cost (KD)</label>
                  <input
                    type="number"
                    step="0.001"
                    value={form.cost}
                    onChange={(e) => setForm({ ...form, cost: parseFloat(e.target.value) || 0 })}
                    className="w-full rounded-xl border border-slate-300 px-3 py-2 font-mono outline-none focus:border-indigo-600 bg-slate-50"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Opening Stock</label>
                  <input
                    type="number"
                    value={form.stock}
                    onChange={(e) => setForm({ ...form, stock: parseInt(e.target.value) || 0 })}
                    className="w-full rounded-xl border border-slate-300 px-3 py-2 font-mono outline-none focus:border-indigo-600 bg-slate-50"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-500 font-bold hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-ink text-white font-bold hover:bg-gold hover:text-ink shadow-md transition"
                >
                  Save Variant
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
