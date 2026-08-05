"use client";

import Link from "next/link";
import { useLocale } from "@/lib/i18n/LocaleContext";
import {
  ShieldCheck,
  ShoppingCart,
  TrendingUp,
  Building2,
  FileCheck,
  Users,
  Package,
  Layers,
  ArrowRight,
  Sparkles,
  Lock,
  Globe,
  Store,
  Anchor,
  Palette,
} from "lucide-react";

export default function EnterprisePortalLandingPage() {
  const { locale, setLocale, t } = useLocale();

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-amber-400 selection:text-black">
      {/* Top Corporate Navigation Bar */}
      <header className="border-b border-slate-200 bg-white/90 backdrop-blur-md sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-400 border border-amber-500/30 flex items-center justify-center shadow-md text-slate-950 font-black text-xl">
              B
            </div>
            <div>
              <div className="font-black text-lg text-slate-950 tracking-wide flex items-center gap-2">
                Bin Essa ERP
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300 uppercase tracking-widest">
                  Enterprise Cloud v4.2
                </span>
              </div>
              <p className="text-xs text-slate-500">Bin Essa Group Operational Systems — Kuwait & GCC</p>
            </div>
          </div>

          <div className="flex items-center gap-3 text-xs font-semibold">
            {/* Language Switcher */}
            <button
              type="button"
              onClick={() => setLocale(locale === "en" ? "ar" : "en")}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 transition shadow-sm"
            >
              <Globe className="w-4 h-4 text-amber-600" />
              <span>{locale === "en" ? "العربية (Kuwait)" : "English (US)"}</span>
            </button>

            <Link
              href="/login"
              className="bg-slate-900 hover:bg-slate-800 text-white font-bold px-5 py-2.5 rounded-xl shadow-md transition flex items-center gap-2"
            >
              <Lock className="w-4 h-4" />
              ERP Login
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-12 flex flex-col justify-center space-y-12">
        <div className="text-center max-w-3xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-100 border border-amber-300 text-amber-900 text-xs font-bold uppercase tracking-widest shadow-sm">
            <Sparkles className="w-4 h-4 text-amber-600" />
            Bin Essa Group Corporate ERP & Commercial Engine
          </div>

          <h1 className="text-4xl sm:text-5xl font-black text-slate-950 tracking-tight leading-tight">
            Centralized Commercial Cloud for Retail Network & Wholesale Accounts
          </h1>

          <p className="text-sm sm:text-base text-slate-600 font-medium leading-relaxed">
            High-concurrency Point of Sale, multi-tier pricing (Retail, Semi-Wholesale, Wholesale), Units of Measure conversion ratios, 3-decimal KWD double-entry financial accounting, and 14-branch consolidation.
          </p>

          {/* Corporate Brand Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-start">
            <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold text-xs shrink-0">
                <Store className="w-5 h-5 text-amber-400" />
              </div>
              <div>
                <div className="text-xs font-bold text-slate-950">Bin Essa Smoking Center</div>
                <div className="text-[11px] text-slate-500">12 Retail Branches & Wholesale</div>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-teal-900 text-white flex items-center justify-center font-bold text-xs shrink-0">
                <Anchor className="w-5 h-5 text-teal-300" />
              </div>
              <div>
                <div className="text-xs font-bold text-slate-950">Bin Essa Khiran</div>
                <div className="text-[11px] text-slate-500">Marine & Outdoor Supplies</div>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-rose-900 text-white flex items-center justify-center font-bold text-xs shrink-0">
                <Palette className="w-5 h-5 text-rose-300" />
              </div>
              <div>
                <div className="text-xs font-bold text-slate-950">JM Art Zone</div>
                <div className="text-[11px] text-slate-500">2 Art & Gift Showrooms</div>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <Link
              href="/pos"
              className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-sm px-6 py-3.5 rounded-2xl shadow-lg shadow-amber-400/20 transition flex items-center gap-2 border border-amber-500/30"
            >
              <ShoppingCart className="w-5 h-5" />
              Launch POS Terminal
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="/b2b"
              className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm px-6 py-3.5 rounded-2xl transition flex items-center gap-2 shadow-md"
            >
              <Store className="w-5 h-5 text-amber-400" />
              B2B Wholesale Portal
            </Link>
          </div>
        </div>

        {/* Feature Grid Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link
            href="/pos"
            className="group bg-white border border-slate-200 hover:border-amber-400 p-6 rounded-3xl transition hover:shadow-xl flex flex-col justify-between space-y-4"
          >
            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center group-hover:scale-110 transition">
              <ShoppingCart className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-950 group-hover:text-amber-800 transition">
                Point of Sale (POS Counter)
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Zero-latency barcode scanning, multi-UOM ratio converter, customer price tiers, and shift cash closing reconciliation.
              </p>
            </div>
          </Link>

          <Link
            href="/inventory"
            className="group bg-white border border-slate-200 hover:border-emerald-400 p-6 rounded-3xl transition hover:shadow-xl flex flex-col justify-between space-y-4"
          >
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center group-hover:scale-110 transition">
              <Package className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-950 group-hover:text-emerald-800 transition">
                Multi-Branch Inventory & Stock
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                20,000+ SKU master catalog, multiple barcodes per item, hardware serials, and batch expiration shelf-life health meters.
              </p>
            </div>
          </Link>

          <Link
            href="/accounting/chart-of-accounts"
            className="group bg-white border border-slate-200 hover:border-cyan-400 p-6 rounded-3xl transition hover:shadow-xl flex flex-col justify-between space-y-4"
          >
            <div className="w-12 h-12 rounded-2xl bg-cyan-100 text-cyan-800 flex items-center justify-center group-hover:scale-110 transition">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-950 group-hover:text-cyan-800 transition">
                3-Decimal KWD Financial Accounting
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Kuwait legal compliance, auto-posted double-entry journal vouchers, General Ledger, Trial Balance, and PDC check tracking.
              </p>
            </div>
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-6 text-center text-xs text-slate-500">
        <p>© 2026 Bin Essa Group Enterprise ERP Systems. All Rights Reserved. Kuwait Commercial Governance Standard.</p>
      </footer>
    </div>
  );
}
