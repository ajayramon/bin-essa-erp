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
} from "lucide-react";

export default function EnterprisePortalLandingPage() {
  const { locale, setLocale, t } = useLocale();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      {/* Top Header */}
      <header className="border-b border-slate-800/80 bg-slate-900/60 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-indigo-500 via-indigo-600 to-indigo-800 flex items-center justify-center shadow-lg shadow-indigo-500/20 text-white font-black text-xl">
              B
            </div>
            <div>
              <div className="font-black text-lg text-white tracking-wide flex items-center gap-2">
                Bin Essa ERP
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 uppercase tracking-widest">
                  Enterprise Cloud v4.2
                </span>
              </div>
              <p className="text-xs text-slate-400">Commercial Operations Engine — Kuwait & GCC</p>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs font-semibold">
            {/* Language Switcher */}
            <button
              onClick={() => setLocale(locale === "en" ? "ar" : "en")}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-700 bg-slate-800/80 hover:bg-slate-700 text-slate-200 transition"
            >
              <Globe className="w-4 h-4 text-indigo-400" />
              <span>{locale === "en" ? "العربية (Kuwait)" : "English (US)"}</span>
            </button>

            <Link
              href="/login"
              className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-5 py-2.5 rounded-xl shadow-lg shadow-indigo-600/30 transition flex items-center gap-2"
            >
              <Lock className="w-4 h-4" />
              ERP Portal Sign In
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-12 flex flex-col justify-center space-y-12">
        <div className="text-center max-w-3xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-bold uppercase tracking-widest">
            <Sparkles className="w-4 h-4 text-indigo-400" />
            Zero-Latency Enterprise Retail & Wholesale Cloud
          </div>

          <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight leading-tight">
            Kuwait Commercial ERP Platform for Multi-Brand Retail & Wholesale Operations
          </h1>

          <p className="text-sm sm:text-base text-slate-300 font-medium leading-relaxed">
            High-speed Point of Sale, targeted promotion engine, permission-based cashier limits, 3-decimal KWD double-entry financial ledgers, and multi-branch inventory tracking.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <Link
              href="/pos"
              className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm px-6 py-3.5 rounded-2xl shadow-xl shadow-indigo-600/30 transition flex items-center gap-2"
            >
              <ShoppingCart className="w-5 h-5" />
              Launch Point of Sale (POS)
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="/promotions"
              className="bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-bold text-sm px-6 py-3.5 rounded-2xl transition flex items-center gap-2"
            >
              <ShieldCheck className="w-5 h-5 text-indigo-400" />
              Promotions Governance
            </Link>
          </div>
        </div>

        {/* Feature Grid Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 pt-6">
          <Link
            href="/pos"
            className="group bg-slate-900/60 border border-slate-800 hover:border-indigo-500/50 p-6 rounded-3xl transition hover:shadow-2xl hover:shadow-indigo-500/10 flex flex-col justify-between space-y-4"
          >
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center group-hover:scale-110 transition">
              <ShoppingCart className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white group-hover:text-indigo-300 transition">
                Point of Sale (POS)
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Category Grid & Line-Item Table views with instant barcode popovers & Manager PIN overrides.
              </p>
            </div>
          </Link>

          <Link
            href="/promotions"
            className="group bg-slate-900/60 border border-slate-800 hover:border-indigo-500/50 p-6 rounded-3xl transition hover:shadow-2xl hover:shadow-indigo-500/10 flex flex-col justify-between space-y-4"
          >
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center group-hover:scale-110 transition">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white group-hover:text-amber-300 transition">
                Promotions & Discounts
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Targeted promo builder, cashier discount limit controls, and immutable audit log history.
              </p>
            </div>
          </Link>

          <Link
            href="/settings/roles-permissions"
            className="group bg-slate-900/60 border border-slate-800 hover:border-indigo-500/50 p-6 rounded-3xl transition hover:shadow-2xl hover:shadow-indigo-500/10 flex flex-col justify-between space-y-4"
          >
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center group-hover:scale-110 transition">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white group-hover:text-emerald-300 transition">
                Main Admin Governance
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Production user directory, branch boundary assignments, and role module access matrix.
              </p>
            </div>
          </Link>

          <Link
            href="/accounting/chart-of-accounts"
            className="group bg-slate-900/60 border border-slate-800 hover:border-indigo-500/50 p-6 rounded-3xl transition hover:shadow-2xl hover:shadow-indigo-500/10 flex flex-col justify-between space-y-4"
          >
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center group-hover:scale-110 transition">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white group-hover:text-cyan-300 transition">
                Double-Entry Accounting
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                3-decimal KWD Chart of Accounts, balanced journal entries, General Ledger, and Trial Balance.
              </p>
            </div>
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/60 bg-slate-950 py-6 text-center text-xs text-slate-500">
        <p>© 2026 Bin Essa Group Enterprise ERP Systems. All Rights Reserved. Kuwait Commercial Compliance Standard.</p>
      </footer>
    </div>
  );
}
