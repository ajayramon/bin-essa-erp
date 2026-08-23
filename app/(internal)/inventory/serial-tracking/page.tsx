"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Package, ArrowLeftRight, Truck, ClipboardCheck, Barcode, Plus } from "lucide-react";
import { useLocale } from "@/lib/i18n/LocaleContext";
import { listItemsRequest, type ItemRecord } from "@/lib/api";

export interface ItemSerialRecord {
  id: string;
  itemId: string;
  itemName: string;
  itemSku: string;
  serialNumber: string;
  status: "IN_STOCK" | "SOLD" | "RETURNED";
  createdAt: string;
}

export interface ItemBatchRecord {
  id: string;
  itemId: string;
  itemName: string;
  itemSku: string;
  batchNumber: string;
  expiryDate: string;
  quantity: number;
  daysRemaining: number;
}

// Initial Datasets for High-Value Hardware & Perishable Batches
const MOCK_SERIALS: ItemSerialRecord[] = [
  {
    id: "ser-001",
    itemId: "item-001",
    itemName: "IQOS ILUMA PRIME Bronze Taupe",
    itemSku: "IQOS-ILU-01",
    serialNumber: "SN-IQOS-2026-9901",
    status: "IN_STOCK",
    createdAt: new Date().toISOString(),
  },
  {
    id: "ser-002",
    itemId: "item-001",
    itemName: "IQOS ILUMA PRIME Bronze Taupe",
    itemSku: "IQOS-ILU-01",
    serialNumber: "SN-IQOS-2026-9902",
    status: "SOLD",
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
  },
  {
    id: "ser-003",
    itemId: "item-002",
    itemName: "Caliburn A2 Pod Kit Black",
    itemSku: "VAPE-DEV-02",
    serialNumber: "SN-CAL-998822",
    status: "IN_STOCK",
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
  },
];

const MOCK_BATCHES: ItemBatchRecord[] = [
  {
    id: "bat-001",
    itemId: "item-003",
    itemName: "TEREA Regular Sticks Box (10 Packs)",
    itemSku: "TEREA-REG-01",
    batchNumber: "BATCH-2026-08A",
    expiryDate: new Date(Date.now() + 86400000 * 180).toISOString(),
    quantity: 450,
    daysRemaining: 180,
  },
  {
    id: "bat-002",
    itemId: "item-004",
    itemName: "VNSN Quik 9000 Puffs Disposable Mango",
    itemSku: "DISP-9000-MNG",
    batchNumber: "BATCH-2026-04C",
    expiryDate: new Date(Date.now() + 86400000 * 25).toISOString(),
    quantity: 120,
    daysRemaining: 25,
  },
  {
    id: "bat-003",
    itemId: "item-005",
    itemName: "Nasty Juice Slow Blow Salt 30ml 50mg",
    itemSku: "EJUICE-30-SLW",
    batchNumber: "BATCH-2025-11B",
    expiryDate: new Date(Date.now() + 86400000 * 65).toISOString(),
    quantity: 85,
    daysRemaining: 65,
  },
];

export default function SerialTrackingPage() {
  const { locale, t } = useLocale();

  const [activeTab, setActiveTab] = useState<"SERIALS" | "BATCHES">("SERIALS");
  const [serials, setSerials] = useState<ItemSerialRecord[]>(MOCK_SERIALS);
  const [batches, setBatches] = useState<ItemBatchRecord[]>(MOCK_BATCHES);
  const [items, setItems] = useState<ItemRecord[]>([]);

  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // New Serial Modal State
  const [showSerialModal, setShowSerialModal] = useState(false);
  const [serialForm, setSerialForm] = useState({
    itemId: "",
    serialNumber: "",
  });

  // Edit Serial Modal State
  const [editingSerial, setEditingSerial] = useState<ItemSerialRecord | null>(null);
  const [editSerialForm, setEditSerialForm] = useState({
    serialNumber: "",
    status: "IN_STOCK" as "IN_STOCK" | "SOLD" | "RETURNED",
  });

  // New Batch Modal State
  const [showBatchModal, setShowBatchModal] = useState(false);
  const [batchForm, setBatchForm] = useState({
    itemId: "",
    batchNumber: "",
    expiryDate: new Date(Date.now() + 86400000 * 180).toISOString().split("T")[0],
    quantity: 100,
  });

  // Edit Batch Modal State
  const [editingBatch, setEditingBatch] = useState<ItemBatchRecord | null>(null);
  const [editBatchForm, setEditBatchForm] = useState({
    batchNumber: "",
    expiryDate: "",
    quantity: 100,
  });

  useEffect(() => {
    listItemsRequest()
      .then((data) => {
        setItems(data);
        if (data.length > 0) {
          setSerialForm((prev) => ({ ...prev, itemId: data[0].id }));
          setBatchForm((prev) => ({ ...prev, itemId: data[0].id }));
        }
      })
      .catch(() => {});
  }, []);

  function handleRegisterSerial(e: React.FormEvent) {
    e.preventDefault();
    const item = items.find((i) => i.id === serialForm.itemId);
    if (!item) return;

    const newRec: ItemSerialRecord = {
      id: `ser-${Date.now()}`,
      itemId: item.id,
      itemName: item.name,
      itemSku: item.sku,
      serialNumber: serialForm.serialNumber,
      status: "IN_STOCK",
      createdAt: new Date().toISOString(),
    };

    setSerials([newRec, ...serials]);
    setSuccessMsg(`Serial Number "${serialForm.serialNumber}" registered!`);
    setShowSerialModal(false);
    setSerialForm({ itemId: items[0]?.id || "", serialNumber: "" });
  }

  function openEditSerialModal(serial: ItemSerialRecord) {
    setEditingSerial(serial);
    setEditSerialForm({
      serialNumber: serial.serialNumber,
      status: serial.status,
    });
    setSuccessMsg(null);
  }

  function handleUpdateSerial(e: React.FormEvent) {
    e.preventDefault();
    if (!editingSerial) return;
    setSerials((prev) =>
      prev.map((s) =>
        s.id === editingSerial.id
          ? { ...s, serialNumber: editSerialForm.serialNumber, status: editSerialForm.status }
          : s
      )
    );
    setSuccessMsg(`Serial "${editSerialForm.serialNumber}" updated successfully!`);
    setEditingSerial(null);
  }

  function handleRegisterBatch(e: React.FormEvent) {
    e.preventDefault();
    const item = items.find((i) => i.id === batchForm.itemId);
    if (!item) return;

    const expiryTime = new Date(batchForm.expiryDate).getTime();
    const diffDays = Math.ceil((expiryTime - Date.now()) / (1000 * 3600 * 24));

    const newRec: ItemBatchRecord = {
      id: `bat-${Date.now()}`,
      itemId: item.id,
      itemName: item.name,
      itemSku: item.sku,
      batchNumber: batchForm.batchNumber,
      expiryDate: new Date(batchForm.expiryDate).toISOString(),
      quantity: batchForm.quantity,
      daysRemaining: diffDays,
    };

    setBatches([newRec, ...batches]);
    setSuccessMsg(`Batch "${batchForm.batchNumber}" registered successfully!`);
    setShowBatchModal(false);
    setBatchForm({
      itemId: items[0]?.id || "",
      batchNumber: "",
      expiryDate: new Date(Date.now() + 86400000 * 180).toISOString().split("T")[0],
      quantity: 100,
    });
  }

  function openEditBatchModal(batch: ItemBatchRecord) {
    setEditingBatch(batch);
    const dateStr = new Date(batch.expiryDate).toISOString().split("T")[0];
    setEditBatchForm({
      batchNumber: batch.batchNumber,
      expiryDate: dateStr,
      quantity: batch.quantity,
    });
    setSuccessMsg(null);
  }

  function handleUpdateBatch(e: React.FormEvent) {
    e.preventDefault();
    if (!editingBatch) return;
    const expiryTime = new Date(editBatchForm.expiryDate).getTime();
    const diffDays = Math.ceil((expiryTime - Date.now()) / (1000 * 3600 * 24));

    setBatches((prev) =>
      prev.map((b) =>
        b.id === editingBatch.id
          ? {
              ...b,
              batchNumber: editBatchForm.batchNumber,
              expiryDate: new Date(editBatchForm.expiryDate).toISOString(),
              quantity: editBatchForm.quantity,
              daysRemaining: diffDays,
            }
          : b
      )
    );
    setSuccessMsg(`Batch "${editBatchForm.batchNumber}" updated successfully!`);
    setEditingBatch(null);
  }

  const filteredSerials = serials.filter(
    (s) =>
      s.serialNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.itemName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.itemSku.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredBatches = batches.filter(
    (b) =>
      b.batchNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.itemName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.itemSku.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-ink/10 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-ink">
            {locale === "ar"
              ? "تتبع الأرقام التسلسلية والشحنات"
              : "Serial Number & Batch Expiry Tracking"}
          </h1>
          <p className="text-xs text-ink/50 mt-0.5">
            {locale === "ar"
              ? "تتبع أجهزة الفيب والأجهزة الإلكترونية بالرقم التسلسلي ومراقبة تواريخ صلاحية الشحنات"
              : "Hardware device serial registration (vape pods/kits) & perishable batch expiration monitoring."}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {activeTab === "SERIALS" ? (
            <button
              onClick={() => setShowSerialModal(true)}
              className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-xs font-bold text-[#FDCE0C] shadow-sm hover:bg-slate-800 transition-colors"
            >
              <Plus className="h-4 w-4" />
              <span>{locale === "ar" ? "+ تسجيل رقم تسلسلي" : "+ Register Serial #"}</span>
            </button>
          ) : (
            <button
              onClick={() => setShowBatchModal(true)}
              className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-xs font-bold text-[#FDCE0C] shadow-sm hover:bg-slate-800 transition-colors"
            >
              <Plus className="h-4 w-4" />
              <span>{locale === "ar" ? "+ تسجيل دفعة جديدة" : "+ Register New Batch"}</span>
            </button>
          )}
        </div>
      </div>

      {/* Sub-Navigation Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-ink/10 pb-3">
        <Link
          href="/inventory"
          className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-slate-950 transition"
        >
          <Package className="h-4 w-4 text-slate-600" />
          <span>{locale === "ar" ? "سجل بطاقات الأصناف (Item Master)" : "Item Master Catalog"}</span>
        </Link>

        <Link
          href="/inventory/adjustments"
          className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-slate-950 transition"
        >
          <ArrowLeftRight className="h-4 w-4 text-amber-600" />
          <span>{locale === "ar" ? "تسويات المخزون" : "Stock Adjustments"}</span>
        </Link>

        <Link
          href="/inventory/transfers"
          className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-slate-950 transition"
        >
          <Truck className="h-4 w-4 text-blue-600" />
          <span>{locale === "ar" ? "التحويلات بين الفروع" : "Stock Transfers"}</span>
        </Link>

        <Link
          href="/inventory/counts"
          className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-slate-950 transition"
        >
          <ClipboardCheck className="h-4 w-4 text-emerald-600" />
          <span>{locale === "ar" ? "الجرد الفعلي الدوري" : "Stock Counts & Audits"}</span>
        </Link>

        <Link
          href="/inventory/serial-tracking"
          className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2 text-xs font-bold text-[#FDCE0C] shadow-xs"
        >
          <Barcode className="h-4 w-4 text-[#FDCE0C]" />
          <span>{locale === "ar" ? "الأرقام التسلسلية والصلاحيات" : "Serial & Batch Tracking"}</span>
        </Link>
      </div>

      {/* Executive Smart Analytics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-2xl border border-ink/10 bg-white p-4 shadow-sm">
          <p className="text-xs font-medium text-ink/50 uppercase tracking-wider">Registered Hardware Serials</p>
          <p className="mt-1 text-2xl font-bold text-ink">{serials.length}</p>
        </div>
        <div className="rounded-2xl border border-ink/10 bg-white p-4 shadow-sm">
          <p className="text-xs font-medium text-ink/50 uppercase tracking-wider">Tracked Batches</p>
          <p className="mt-1 text-2xl font-bold text-indigo-700">{batches.length}</p>
        </div>
        <div className="rounded-2xl border border-ink/10 bg-white p-4 shadow-sm">
          <p className="text-xs font-medium text-ink/50 uppercase tracking-wider">Expiring Batches (≤30 Days)</p>
          <p className="mt-1 text-2xl font-bold text-red-600">
            {batches.filter((b) => b.daysRemaining <= 30).length}
          </p>
        </div>
      </div>

      {/* Success Notification */}
      {successMsg && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold">
          ✅ {successMsg}
        </div>
      )}

      {/* Navigation Tabs & Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-1.5 bg-ink/5 p-1 rounded-2xl border border-ink/10">
          <button
            onClick={() => setActiveTab("SERIALS")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
              activeTab === "SERIALS"
                ? "bg-white text-ink shadow-xs"
                : "text-ink/60 hover:text-ink"
            }`}
          >
            🏷️ Device Serial Registry ({serials.length})
          </button>
          <button
            onClick={() => setActiveTab("BATCHES")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
              activeTab === "BATCHES"
                ? "bg-white text-ink shadow-xs"
                : "text-ink/60 hover:text-ink"
            }`}
          >
            📅 Batch Expiration Health ({batches.length})
          </button>
        </div>

        <div className="relative w-72">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={`Search ${activeTab === "SERIALS" ? "serial # or SKU..." : "batch # or item..."}`}
            className="w-full bg-white border border-ink/10 rounded-2xl px-4 py-2.5 text-xs text-ink outline-none focus:border-gold font-mono shadow-xs"
          />
        </div>
      </div>

      {/* Main Content Tables */}
      {activeTab === "SERIALS" ? (
        <div className="rounded-2xl border border-ink/10 bg-white p-5 shadow-sm space-y-4">
          <h2 className="text-base font-bold text-ink">Hardware Device Serial Number Inventory</h2>

          <div className="rounded-xl border border-ink/10 bg-white overflow-hidden">
            <table className="w-full text-start text-xs">
              <thead className="bg-ink/5 text-ink/70 font-semibold border-b border-ink/10">
                <tr>
                  <th className="p-3.5 text-start">Serial Number</th>
                  <th className="p-3.5 text-start">Product Name</th>
                  <th className="p-3.5 text-start">SKU</th>
                  <th className="p-3.5 text-start">Registered Date</th>
                  <th className="p-3.5 text-start">Status</th>
                  <th className="p-3.5 text-start">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink/5 font-mono">
                {filteredSerials.map((s) => (
                  <tr key={s.id} className="hover:bg-ink/5 transition">
                    <td className="p-3.5 font-bold text-ink">{s.serialNumber}</td>
                    <td className="p-3.5 font-sans text-ink font-semibold">{s.itemName}</td>
                    <td className="p-3.5 text-ink/60">{s.itemSku}</td>
                    <td className="p-3.5 text-ink/60">{new Date(s.createdAt).toLocaleDateString()}</td>
                    <td className="p-3.5">
                      <span
                        className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wide ${
                          s.status === "IN_STOCK"
                            ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                            : s.status === "SOLD"
                            ? "bg-indigo-100 text-indigo-800 border border-indigo-200"
                            : "bg-red-100 text-red-700 border border-red-200"
                        }`}
                      >
                        {s.status}
                      </span>
                    </td>
                    <td className="p-3.5 font-sans">
                      <button
                        type="button"
                        onClick={() => openEditSerialModal(s)}
                        className="rounded bg-ink/10 px-2 py-1 text-xs font-bold text-ink hover:bg-gold transition-colors"
                      >
                        ✏️ Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Batches Expiration Dashboard */
        <div className="rounded-2xl border border-ink/10 bg-white p-5 shadow-sm space-y-4">
          <h2 className="text-base font-bold text-ink">Batch Expiry & Shelf-Life Health Panel</h2>

          <div className="rounded-xl border border-ink/10 bg-white overflow-hidden">
            <table className="w-full text-start text-xs">
              <thead className="bg-ink/5 text-ink/70 font-semibold border-b border-ink/10">
                <tr>
                  <th className="p-3.5 text-start">Batch #</th>
                  <th className="p-3.5 text-start">Product Name</th>
                  <th className="p-3.5 text-start">Expiry Date</th>
                  <th className="p-3.5 text-start">Shelf-Life Health Meter</th>
                  <th className="p-3.5 text-start">Stock Quantity</th>
                  <th className="p-3.5 text-start">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink/5 font-mono">
                {filteredBatches.map((b) => (
                  <tr key={b.id} className="hover:bg-ink/5 transition">
                    <td className="p-3.5 font-bold text-ink">{b.batchNumber}</td>
                    <td className="p-3.5 font-sans text-ink font-semibold">{b.itemName}</td>
                    <td className="p-3.5 text-ink/70">{new Date(b.expiryDate).toLocaleDateString()}</td>
                    <td className="p-3.5">
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-[11px]">
                          <span
                            className={`font-bold ${
                              b.daysRemaining < 30
                                ? "text-red-700"
                                : b.daysRemaining < 90
                                ? "text-amber-800"
                                : "text-emerald-800"
                            }`}
                          >
                            {b.daysRemaining} days remaining
                          </span>
                        </div>
                        <div className="w-48 h-2 rounded-full bg-slate-100 overflow-hidden border border-slate-200">
                          <div
                            className={`h-full rounded-full transition-all ${
                              b.daysRemaining < 30
                                ? "bg-red-500"
                                : b.daysRemaining < 90
                                ? "bg-amber-500"
                                : "bg-emerald-500"
                            }`}
                            style={{ width: `${Math.min(100, (b.daysRemaining / 180) * 100)}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="p-3.5 font-bold text-ink">{b.quantity} units</td>
                    <td className="p-3.5 font-sans">
                      <button
                        type="button"
                        onClick={() => openEditBatchModal(b)}
                        className="rounded bg-ink/10 px-2 py-1 text-xs font-bold text-ink hover:bg-gold transition-colors"
                      >
                        ✏️ Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Register Serial Modal */}
      {showSerialModal && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 max-w-md w-full space-y-5 shadow-2xl text-slate-800">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">Register Hardware Serial #</h3>
              <button onClick={() => setShowSerialModal(false)} className="text-slate-400 hover:text-slate-600 font-bold text-sm">
                ✕
              </button>
            </div>

            <form onSubmit={handleRegisterSerial} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Select Product</label>
                <select
                  value={serialForm.itemId}
                  onChange={(e) => setSerialForm({ ...serialForm, itemId: e.target.value })}
                  className="w-full rounded-xl border border-slate-300 px-3 py-2 text-slate-900 font-medium outline-none focus:border-indigo-600 bg-slate-50"
                >
                  {items.map((i) => (
                    <option key={i.id} value={i.id}>
                      {i.name} ({i.sku})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Serial Number</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. SN-IQOS-2026-0099"
                  value={serialForm.serialNumber}
                  onChange={(e) => setSerialForm({ ...serialForm, serialNumber: e.target.value })}
                  className="w-full rounded-xl border border-slate-300 px-3 py-2 font-mono outline-none focus:border-indigo-600 bg-slate-50 text-slate-900"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowSerialModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-500 font-bold hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-ink text-white font-bold hover:bg-gold hover:text-ink shadow-md transition"
                >
                  Register Serial
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Serial Modal */}
      {editingSerial && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 max-w-md w-full space-y-5 shadow-2xl text-slate-800">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">✏️ Edit Serial Record</h3>
              <button onClick={() => setEditingSerial(null)} className="text-slate-400 hover:text-slate-600 font-bold text-sm">
                ✕
              </button>
            </div>

            <form onSubmit={handleUpdateSerial} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Product Name</label>
                <input
                  type="text"
                  disabled
                  value={editingSerial.itemName}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 font-medium bg-slate-100 text-slate-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Serial Number</label>
                <input
                  type="text"
                  required
                  value={editSerialForm.serialNumber}
                  onChange={(e) => setEditSerialForm({ ...editSerialForm, serialNumber: e.target.value })}
                  className="w-full rounded-xl border border-slate-300 px-3 py-2 font-mono outline-none focus:border-indigo-600 bg-slate-50 text-slate-900"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Status</label>
                <select
                  value={editSerialForm.status}
                  onChange={(e) => setEditSerialForm({ ...editSerialForm, status: e.target.value as any })}
                  className="w-full rounded-xl border border-slate-300 px-3 py-2 text-slate-900 font-bold outline-none focus:border-indigo-600 bg-slate-50"
                >
                  <option value="IN_STOCK">IN_STOCK (Available in Store)</option>
                  <option value="SOLD">SOLD (Issued on Receipt)</option>
                  <option value="RETURNED">RETURNED (Customer Warranty Return)</option>
                </select>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setEditingSerial(null)}
                  className="px-4 py-2 rounded-xl text-slate-500 font-bold hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-ink text-white font-bold hover:bg-gold hover:text-ink shadow-md transition"
                >
                  Update Serial
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Register Batch Modal */}
      {showBatchModal && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 max-w-md w-full space-y-5 shadow-2xl text-slate-800">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">Register New Inventory Batch</h3>
              <button onClick={() => setShowBatchModal(false)} className="text-slate-400 hover:text-slate-600 font-bold text-sm">
                ✕
              </button>
            </div>

            <form onSubmit={handleRegisterBatch} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Select Product</label>
                <select
                  value={batchForm.itemId}
                  onChange={(e) => setBatchForm({ ...batchForm, itemId: e.target.value })}
                  className="w-full rounded-xl border border-slate-300 px-3 py-2 text-slate-900 font-medium outline-none focus:border-indigo-600 bg-slate-50"
                >
                  {items.map((i) => (
                    <option key={i.id} value={i.id}>
                      {i.name} ({i.sku})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Batch Number</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. BATCH-2026-10X"
                  value={batchForm.batchNumber}
                  onChange={(e) => setBatchForm({ ...batchForm, batchNumber: e.target.value })}
                  className="w-full rounded-xl border border-slate-300 px-3 py-2 font-mono outline-none focus:border-indigo-600 bg-slate-50 text-slate-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Expiry Date</label>
                  <input
                    type="date"
                    required
                    value={batchForm.expiryDate}
                    onChange={(e) => setBatchForm({ ...batchForm, expiryDate: e.target.value })}
                    className="w-full rounded-xl border border-slate-300 px-3 py-2 font-mono outline-none focus:border-indigo-600 bg-slate-50 text-slate-900"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Batch Quantity</label>
                  <input
                    type="number"
                    required
                    value={batchForm.quantity}
                    onChange={(e) => setBatchForm({ ...batchForm, quantity: parseInt(e.target.value) || 0 })}
                    className="w-full rounded-xl border border-slate-300 px-3 py-2 font-mono outline-none focus:border-indigo-600 bg-slate-50 text-slate-900"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowBatchModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-500 font-bold hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-ink text-white font-bold hover:bg-gold hover:text-ink shadow-md transition"
                >
                  Save Batch
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Batch Modal */}
      {editingBatch && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 max-w-md w-full space-y-5 shadow-2xl text-slate-800">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">✏️ Edit Batch Record</h3>
              <button onClick={() => setEditingBatch(null)} className="text-slate-400 hover:text-slate-600 font-bold text-sm">
                ✕
              </button>
            </div>

            <form onSubmit={handleUpdateBatch} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Product Name</label>
                <input
                  type="text"
                  disabled
                  value={editingBatch.itemName}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 font-medium bg-slate-100 text-slate-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Batch Number</label>
                <input
                  type="text"
                  required
                  value={editBatchForm.batchNumber}
                  onChange={(e) => setEditBatchForm({ ...editBatchForm, batchNumber: e.target.value })}
                  className="w-full rounded-xl border border-slate-300 px-3 py-2 font-mono outline-none focus:border-indigo-600 bg-slate-50 text-slate-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Expiry Date</label>
                  <input
                    type="date"
                    required
                    value={editBatchForm.expiryDate}
                    onChange={(e) => setEditBatchForm({ ...editBatchForm, expiryDate: e.target.value })}
                    className="w-full rounded-xl border border-slate-300 px-3 py-2 font-mono outline-none focus:border-indigo-600 bg-slate-50 text-slate-900"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Batch Quantity</label>
                  <input
                    type="number"
                    required
                    value={editBatchForm.quantity}
                    onChange={(e) => setEditBatchForm({ ...editBatchForm, quantity: parseInt(e.target.value) || 0 })}
                    className="w-full rounded-xl border border-slate-300 px-3 py-2 font-mono outline-none focus:border-indigo-600 bg-slate-50 text-slate-900"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setEditingBatch(null)}
                  className="px-4 py-2 rounded-xl text-slate-500 font-bold hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-ink text-white font-bold hover:bg-gold hover:text-ink shadow-md transition"
                >
                  Update Batch
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
