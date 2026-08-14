"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/context/SessionContext";
import Link from "next/link";
import { Store, Lock, Eye, EyeOff, ArrowRight, ShieldCheck, Sparkles } from "lucide-react";

export default function B2BLoginPage() {
  const router = useRouter();
  const { login } = useSession();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const b2bClients = [
    { label: "Trolley", u: "trolley", p: "Password123!", desc: "Retail Chain" },
    { label: "Bodega", u: "bodega", p: "Password123!", desc: "Convenience" },
    { label: "Lulu Hypermarket", u: "lulu", p: "Password123!", desc: "Key Account" },
  ];

  async function performLogin(u: string, p: string) {
    setError(null);
    setLoading(true);

    try {
      await login(u.trim(), p);
      const redirectUrl =
        typeof window !== "undefined"
          ? new URLSearchParams(window.location.search).get("redirect") || "/b2b"
          : "/b2b";
      window.location.href = redirectUrl;
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Authentication failed. Please verify your wholesale credentials."
      );
      setLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    await performLogin(username, password);
  }

  function handleQuickSelect(u: string, p: string) {
    setUsername(u);
    setPassword(p);
    performLogin(u, p);
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 px-4 py-8 relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-600/5 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md bg-slate-900/90 backdrop-blur-xl p-8 rounded-2xl border border-slate-800 shadow-2xl relative z-10">
        <div className="text-center mb-6">
          <span className="inline-block px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 text-xs font-semibold uppercase tracking-wider mb-2.5">
            Wholesale Customer Portal
          </span>
          <h1 className="text-2xl font-black text-white tracking-tight">
            Bin Essa B2B Portal
          </h1>
          <p className="text-xs text-blue-400/80 font-medium mt-0.5" dir="rtl">
            بوابة عملاء الجملة والشركات — بن عيسى
          </p>
          <p className="text-slate-400 text-xs mt-1">
            Access contract pricing, submit wholesale orders, and track credit ledger
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3.5 text-xs leading-relaxed text-red-300 bg-red-950/70 border border-red-800/80 rounded-xl flex items-start gap-2.5">
              <div className="w-1.5 h-1.5 rounded-full bg-red-400 shrink-0 mt-1.5" />
              <div>
                <div className="font-semibold text-red-200">B2B Authentication Failed</div>
                <div className="text-red-300/90 mt-0.5">{error}</div>
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Wholesale Account ID / Username
            </label>
            <div className="relative">
              <Store className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter client username or account ID"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-800/90 text-white border border-slate-700/80 focus:outline-none focus:border-blue-500 transition-colors text-sm placeholder:text-slate-500"
                required
                autoComplete="username"
                autoFocus
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-slate-800/90 text-white border border-slate-700/80 focus:outline-none focus:border-blue-500 transition-colors text-sm placeholder:text-slate-500"
                required
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 transition"
                tabIndex={-1}
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold rounded-xl shadow-lg shadow-blue-600/20 transition-all text-sm flex items-center justify-center gap-2 cursor-pointer mt-3"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Verifying Wholesale Account...</span>
              </span>
            ) : (
              <>
                <span>Sign In to B2B Portal</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Quick B2B Client Selector */}
        <div className="mt-5 pt-4 border-t border-slate-800/80">
          <div className="flex items-center justify-between text-[11px] font-semibold text-slate-400 mb-2.5">
            <span className="flex items-center gap-1 text-blue-400">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Select Key Wholesale Account</span>
            </span>
            <span className="text-slate-500">Quick Sign In</span>
          </div>
          <div className="grid grid-cols-3 gap-1.5">
            {b2bClients.map((c) => (
              <button
                key={c.u}
                type="button"
                onClick={() => handleQuickSelect(c.u, c.p)}
                disabled={loading}
                className="p-1.5 text-center bg-slate-800/60 hover:bg-slate-800 hover:border-blue-500/50 border border-slate-700/60 rounded-lg text-slate-300 hover:text-white transition-all cursor-pointer disabled:opacity-50"
              >
                <div className="text-[11px] font-bold leading-tight">{c.label}</div>
                <div className="text-[9px] text-slate-400 mt-0.5">{c.desc}</div>
              </button>
            ))}
          </div>
        </div>

        <div className="mt-5 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-1.5 text-slate-500">
            <ShieldCheck className="w-3.5 h-3.5 text-blue-400/70" />
            <span>Commercial B2B Access</span>
          </div>
          <Link href="/login" className="text-amber-400/90 hover:text-amber-300 transition font-medium">
            ERP Staff Login →
          </Link>
        </div>
      </div>
    </div>
  );
}
