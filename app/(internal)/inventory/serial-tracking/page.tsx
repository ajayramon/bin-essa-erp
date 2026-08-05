"use client";

import { useEffect, useState } from "react";
import { useLocale } from "@/lib/i18n/LocaleContext";
import { listItemsRequest, type ItemRecord } from "@/lib/api";
import {
  Clock,
  QrCode,
  ShieldCheck,
  AlertTriangle,
  Search,
  Plus,
  Package,
  Calendar,
  CheckCircle2,
  Layers,
  Filter,
  FileSpreadsheet,
} from "lucide-react";

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

// Initial Mock Datasets for High-Value Hardware & Perishable Batches
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
  const { locale } = useLocale();

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

  // New Batch Modal State
  const [showBatchModal, setShowBatchModal] = useState(false);
  const [batchForm, setBatchForm] = useState({
    itemId: "",
    batchNumber: "",
    expiryDate: new Date(Date.now() + 86400000 * 180).toISOString().split("T")[0],
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
    <div className="p-8 space-y-8 bg-slate-900/40 min-h-screen text-slate-100 font-sans">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 rounded-2xl">
            <QrCode className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-white tracking-wide">
              {locale === "ar"
                ? "تتبع الأرقام التسلسلية والشحنات"
                : "Serial Number & Batch Expiry Tracking"}
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              {locale === "ar"
                ? "تتبع أجهزة الفيب والأجهزة الإلكترونية بالرقم التسلسلي ومراقبة تواريخ صلاحية الشحنات"
                : "Hardware device serial registration (vape pods/kits) & perishable batch expiration monitoring."}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {activeTab === "SERIALS" ? (
            <button
              onClick={() => setShowSerialModal(true)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold shadow-lg shadow-indigo-600/20 transition"
            >
              <Plus className="w-4 h-4" />
              Register Serial #
            </button>
          ) : (
            <button
              onClick={() => setShowBatchModal(true)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold shadow-lg shadow-indigo-600/20 transition"
            >
              <Plus className="w-4 h-4" />
              Register New Batch
            </button>
          )}
        </div>
      </div>

      {/* Success Notification */}
      {successMsg && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center gap-3 text-sm">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Navigation Tabs & Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2 p-1 bg-slate-900 border border-slate-800 rounded-2xl">
          <button
            onClick={() => setActiveTab("SERIALS")}
            className={`px-5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
              activeTab === "SERIALS"
                ? "bg-indigo-600 text-white shadow-md"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <QrCode className="w-4 h-4" />
            Device Serial Registry ({serials.length})
          </button>
          <button
            onClick={() => setActiveTab("BATCHES")}
            className={`px-5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
              activeTab === "BATCHES"
                ? "bg-indigo-600 text-white shadow-md"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <Clock className="w-4 h-4" />
            Batch Expiration Health ({batches.length})
          </button>
        </div>

        <div className="relative w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={`Search ${activeTab === "SERIALS" ? "serial # or SKU..." : "batch # or item..."}`}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-white outline-none focus:border-indigo-500"
          />
        </div>
      </div>

      {/* Main Content Tables */}
      {activeTab === "SERIALS" ? (
        <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-4">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-indigo-400" />
            Hardware Device Serial Number Inventory
          </h2>

          <div className="rounded-2xl border border-slate-800 bg-slate-950/60 overflow-hidden">
            <table className="w-full text-start text-xs">
              <thead className="bg-slate-900 text-slate-400 font-semibold border-b border-slate-800">
                <tr>
                  <th className="p-4">Serial Number</th>
                  <th className="p-4">Product Name</th>
                  <th className="p-4">SKU</th>
                  <th className="p-4">Registered Date</th>
                  <th className="p-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300 font-mono">
                {filteredSerials.map((s) => (
                  <tr key={s.id} className="hover:bg-slate-800/30 transition">
                    <td className="p-4 font-bold text-indigo-400">{s.serialNumber}</td>
                    <td className="p-4 font-sans text-white font-semibold">{s.itemName}</td>
                    <td className="p-4 text-slate-400">{s.itemSku}</td>
                    <td className="p-4">{new Date(s.createdAt).toLocaleDateString()}</td>
                    <td className="p-4">
                      <span
                        className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide ${
                          s.status === "IN_STOCK"
                            ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                            : s.status === "SOLD"
                            ? "bg-indigo-500/10 text-indigo-400 border border-indigo-500/20"
                            : "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                        }`}
                      >
                        {s.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Batches Expiration Dashboard */
        <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-4">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Clock className="w-5 h-5 text-indigo-400" />
            Batch Expiry & Shelf-Life Health Panel
          </h2>

          <div className="rounded-2xl border border-slate-800 bg-slate-950/60 overflow-hidden">
            <table className="w-full text-start text-xs">
              <thead className="bg-slate-900 text-slate-400 font-semibold border-b border-slate-800">
                <tr>
                  <th className="p-4">Batch #</th>
                  <th className="p-4">Product Name</th>
                  <th className="p-4">Expiry Date</th>
                  <th className="p-4">Shelf-Life Health Meter</th>
                  <th className="p-4">Stock Quantity</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300 font-mono">
                {filteredBatches.map((b) => (
                  <tr key={b.id} className="hover:bg-slate-800/30 transition">
                    <td className="p-4 font-bold text-indigo-400">{b.batchNumber}</td>
                    <td className="p-4 font-sans text-white font-semibold">{b.itemName}</td>
                    <td className="p-4">{new Date(b.expiryDate).toLocaleDateString()}</td>
                    <td className="p-4">
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-[11px]">
                          <span
                            className={`font-bold ${
                              b.daysRemaining < 30
                                ? "text-rose-400 animate-pulse"
                                : b.daysRemaining < 90
                                ? "text-amber-400"
                                : "text-emerald-400"
                            }`}
                          >
                            {b.daysRemaining} days remaining
                          </span>
                        </div>
                        <div className="w-48 h-2 rounded-full bg-slate-800 overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all ${
                              b.daysRemaining < 30
                                ? "bg-rose-500"
                                : b.daysRemaining < 90
                                ? "bg-amber-500"
                                : "bg-emerald-500"
                            }`}
                            style={{ width: `${Math.min(100, (b.daysRemaining / 180) * 100)}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="p-4 font-bold text-white">{b.quantity} units</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Register Serial Modal */}
      {showSerialModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-md w-full space-y-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <QrCode className="w-5 h-5 text-indigo-400" />
                Register Hardware Serial #
              </h3>
              <button onClick={() => setShowSerialModal(false)} className="text-slate-400 hover:text-white font-bold">
                ✕
              </button>
            </div>

            <form onSubmit={handleRegisterSerial} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-300 mb-1">Select Product</label>
                <select
                  value={serialForm.itemId}
                  onChange={(e) => setSerialForm({ ...serialForm, itemId: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-white font-medium outline-none focus:border-indigo-500"
                >
                  {items.map((i) => (
                    <option key={i.id} value={i.id}>
                      {i.name} ({i.sku})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Serial Number</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. SN-IQOS-2026-0099"
                  value={serialForm.serialNumber}
                  onChange={(e) => setSerialForm({ ...serialForm, serialNumber: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono outline-none focus:border-indigo-500"
                />
              </div>

              <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowSerialModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-400 hover:text-white font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold shadow-lg"
                >
                  Register Serial
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Register Batch Modal */}
      {showBatchModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-md w-full space-y-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Clock className="w-5 h-5 text-indigo-400" />
                Register New Inventory Batch
              </h3>
              <button onClick={() => setShowBatchModal(false)} className="text-slate-400 hover:text-white font-bold">
                ✕
              </button>
            </div>

            <form onSubmit={handleRegisterBatch} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-300 mb-1">Select Product</label>
                <select
                  value={batchForm.itemId}
                  onChange={(e) => setBatchForm({ ...batchForm, itemId: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-white font-medium outline-none focus:border-indigo-500"
                >
                  {items.map((i) => (
                    <option key={i.id} value={i.id}>
                      {i.name} ({i.sku})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Batch Number</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. BATCH-2026-10X"
                  value={batchForm.batchNumber}
                  onChange={(e) => setBatchForm({ ...batchForm, batchNumber: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Expiry Date</label>
                  <input
                    type="date"
                    required
                    value={batchForm.expiryDate}
                    onChange={(e) => setBatchForm({ ...batchForm, expiryDate: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Batch Quantity</label>
                  <input
                    type="number"
                    required
                    value={batchForm.quantity}
                    onChange={(e) => setBatchForm({ ...batchForm, quantity: parseInt(e.target.value) || 0 })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowBatchModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-400 hover:text-white font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold shadow-lg"
                >
                  Save Batch
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
