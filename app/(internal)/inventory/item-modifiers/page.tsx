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
import {
  Tag,
  Plus,
  Search,
  Package,
  Layers,
  Barcode,
  DollarSign,
  AlertCircle,
  CheckCircle2,
  RefreshCw,
  Filter,
} from "lucide-react";

export default function ItemModifiersPage() {
  const { locale } = useLocale();

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
    <div className="p-8 space-y-8 bg-slate-900/40 min-h-screen text-slate-100 font-sans">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 rounded-2xl">
            <Tag className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-white tracking-wide">
              {locale === "ar" ? "متغيرات الصنف والمواصفات" : "Item Modifiers & Product Variants"}
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              {locale === "ar"
                ? "إدارة خصائص الصنف الفرعية (النكهة، اللون، النيكوتين، الحجم) وأرقام الباركود والأسعار KWD"
                : "Manage SKU sub-attributes (flavors, colors, nic levels), barcodes, and variant prices."}
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowModal(true)}
          disabled={!selectedItemId}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold shadow-lg shadow-indigo-600/20 transition disabled:opacity-50"
        >
          <Plus className="w-4 h-4" />
          Add New Variant
        </button>
      </div>

      {/* Alerts */}
      {error && (
        <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center gap-3 text-sm">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {successMsg && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center gap-3 text-sm">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Item Selector List */}
        <div className="lg:col-span-4 space-y-4">
          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <Package className="w-4 h-4 text-indigo-400" />
              Select Base Master Product
            </h2>

            <div className="divide-y divide-slate-800/60 max-h-[600px] overflow-y-auto pr-1">
              {items.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setSelectedItemId(item.id)}
                  className={`w-full text-start p-3 rounded-xl transition flex items-center justify-between my-1 ${
                    selectedItemId === item.id
                      ? "bg-indigo-500/15 border border-indigo-500/30 text-white"
                      : "hover:bg-slate-800/40 text-slate-300"
                  }`}
                >
                  <div className="space-y-0.5">
                    <div className="font-bold text-sm">{item.name}</div>
                    <div className="text-[11px] text-slate-400 font-mono">SKU: {item.sku}</div>
                  </div>
                  <span className="text-xs font-mono font-semibold text-emerald-400">
                    {Number(item.price).toFixed(3)} KD
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Selected Item Variants Grid */}
        <div className="lg:col-span-8 space-y-6">
          {selectedItem ? (
            <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-6">
              {/* Product Info Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
                <div>
                  <h2 className="text-lg font-bold text-white flex items-center gap-2">
                    <Layers className="w-5 h-5 text-indigo-400" />
                    {selectedItem.name}
                  </h2>
                  <p className="text-xs text-slate-400 font-mono mt-1">
                    Master SKU: {selectedItem.sku} | Base Price: {Number(selectedItem.price).toFixed(3)} KD
                  </p>
                </div>

                <div className="relative w-64">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search variants..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-white outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              {/* Variants Table */}
              <div className="rounded-2xl border border-slate-800 bg-slate-950/60 overflow-hidden">
                <table className="w-full text-start text-xs">
                  <thead className="bg-slate-900 text-slate-400 font-semibold border-b border-slate-800">
                    <tr>
                      <th className="p-3.5">Variant Name</th>
                      <th className="p-3.5">Variant SKU</th>
                      <th className="p-3.5">Barcode</th>
                      <th className="p-3.5">Selling Price</th>
                      <th className="p-3.5">Cost</th>
                      <th className="p-3.5">Stock</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 text-slate-300 font-mono">
                    {filteredVariants.map((v) => (
                      <tr key={v.id} className="hover:bg-slate-800/30 transition">
                        <td className="p-3.5 font-bold font-sans text-white">{v.variantName}</td>
                        <td className="p-3.5 text-indigo-400">{v.sku}</td>
                        <td className="p-3.5 text-slate-400">{v.barcode || "—"}</td>
                        <td className="p-3.5 font-bold text-emerald-400">
                          {Number(v.price).toFixed(3)} KD
                        </td>
                        <td className="p-3.5 text-slate-400">{Number(v.cost).toFixed(3)} KD</td>
                        <td className="p-3.5">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              v.stock > 10
                                ? "bg-emerald-500/10 text-emerald-400"
                                : v.stock > 0
                                ? "bg-amber-500/10 text-amber-400"
                                : "bg-rose-500/10 text-rose-400"
                            }`}
                          >
                            {v.stock} pcs
                          </span>
                        </td>
                      </tr>
                    ))}
                    {filteredVariants.length === 0 && (
                      <tr>
                        <td colSpan={6} className="p-8 text-center text-slate-500 font-sans">
                          No variants created for this item yet. Click "Add New Variant" to define attributes.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="p-12 rounded-3xl bg-slate-900/40 border border-slate-800 text-center text-slate-400">
              Select an item from the left catalog list to manage its variants.
            </div>
          )}
        </div>
      </div>

      {/* Create Variant Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-md w-full space-y-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Plus className="w-5 h-5 text-indigo-400" />
                Add New Item Variant
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-slate-400 hover:text-white font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateVariant} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-300 mb-1">Variant Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Nic 50mg - Blue Razz"
                  value={form.variantName}
                  onChange={(e) => setForm({ ...form, variantName: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Variant SKU</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. VAPE-01-BLUERAZZ"
                    value={form.sku}
                    onChange={(e) => setForm({ ...form, sku: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Barcode</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 62911002233"
                    value={form.barcode}
                    onChange={(e) => setForm({ ...form, barcode: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Selling Price (KD)</label>
                  <input
                    type="number"
                    step="0.005"
                    required
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: parseFloat(e.target.value) || 0 })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Unit Cost (KD)</label>
                  <input
                    type="number"
                    step="0.005"
                    value={form.cost}
                    onChange={(e) => setForm({ ...form, cost: parseFloat(e.target.value) || 0 })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Opening Stock</label>
                  <input
                    type="number"
                    value={form.stock}
                    onChange={(e) => setForm({ ...form, stock: parseInt(e.target.value) || 0 })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-400 hover:text-white font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold shadow-lg"
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
