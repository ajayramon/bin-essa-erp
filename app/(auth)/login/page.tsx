"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/context/SessionContext";
import Link from "next/link";
import { Lock, User, Eye, EyeOff, ArrowRight, ShieldCheck, Sparkles } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useSession();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const demoRoles = [
    { label: "Admin (HQ)", u: "admin", p: "Password123!", role: "Admin" },
    { label: "Branch Manager", u: "manager", p: "Password123!", role: "Salmiya" },
    { label: "POS Cashier", u: "cashier", p: "Password123!", role: "Avenues" },
    { label: "Accountant", u: "accountant", p: "Password123!", role: "HQ Finance" },
    { label: "Storekeeper", u: "storekeeper", p: "Password123!", role: "Warehouse" },
    { label: "Sales Rep", u: "sales_rep", p: "Password123!", role: "Wholesale" },
  ];

  async function performLogin(u: string, p: string) {
    setError(null);
    setLoading(true);

    try {
      await login(u.trim(), p);
      const redirectUrl =
        typeof window !== "undefined"
          ? new URLSearchParams(window.location.search).get("redirect") || "/dashboard"
          : "/dashboard";
      window.location.href = redirectUrl;
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Authentication failed. Please verify your credentials or contact system administrator."
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
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md bg-slate-900/90 backdrop-blur-xl p-8 rounded-2xl border border-slate-800 shadow-2xl relative z-10">
        {/* Header Branding */}
        <div className="text-center mb-6">
          <div className="w-14 h-14 rounded-2xl bg-amber-400 border border-amber-300/40 flex items-center justify-center shadow-lg shadow-amber-400/10 mx-auto mb-3.5 text-slate-950 font-black text-2xl">
            B
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">
            Bin Essa ERP
          </h1>
          <p className="text-xs text-amber-400/80 font-medium mt-0.5" dir="rtl">
            مجموعة بن عيسى التجارية — الكويت
          </p>
          <p className="text-xs text-slate-400 mt-1">
            Enterprise Cloud Management System & POS
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3.5 text-xs leading-relaxed text-red-300 bg-red-950/70 border border-red-800/80 rounded-xl flex items-start gap-2.5">
              <div className="w-1.5 h-1.5 rounded-full bg-red-400 shrink-0 mt-1.5" />
              <div>
                <div className="font-semibold text-red-200">Authentication Failed</div>
                <div className="text-red-300/90 mt-0.5">{error}</div>
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Username
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter authorized username"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-800/90 text-white border border-slate-700/80 focus:outline-none focus:border-amber-400 transition-colors text-sm placeholder:text-slate-500"
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
                className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-slate-800/90 text-white border border-slate-700/80 focus:outline-none focus:border-amber-400 transition-colors text-sm placeholder:text-slate-500"
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
            className="w-full py-3 px-4 bg-amber-400 hover:bg-amber-300 disabled:opacity-50 text-slate-950 font-black rounded-xl shadow-lg shadow-amber-400/20 transition-all text-sm flex items-center justify-center gap-2 cursor-pointer mt-3"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                <span>Verifying Credentials...</span>
              </span>
            ) : (
              <>
                <span>Sign In to ERP</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Quick Demo Role Selector */}
        <div className="mt-5 pt-4 border-t border-slate-800/80">
          <div className="flex items-center justify-between text-[11px] font-semibold text-slate-400 mb-2.5">
            <span className="flex items-center gap-1 text-amber-400">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Quick Role Test Login</span>
            </span>
            <span className="text-slate-500">Click to Sign In</span>
          </div>
          <div className="grid grid-cols-3 gap-1.5">
            {demoRoles.map((r) => (
              <button
                key={r.u}
                type="button"
                onClick={() => handleQuickSelect(r.u, r.p)}
                disabled={loading}
                className="p-1.5 text-center bg-slate-800/60 hover:bg-slate-800 hover:border-amber-400/50 border border-slate-700/60 rounded-lg text-slate-300 hover:text-white transition-all cursor-pointer disabled:opacity-50"
              >
                <div className="text-[11px] font-bold leading-tight">{r.label}</div>
                <div className="text-[9px] text-slate-400 mt-0.5">{r.role}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Security & Access Notice */}
        <div className="mt-5 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-1.5 text-slate-500">
            <ShieldCheck className="w-3.5 h-3.5 text-amber-400/70" />
            <span>Authorized Personnel Only</span>
          </div>
          <Link
            href="/b2b-login"
            className="text-amber-400/90 hover:text-amber-300 transition font-medium"
          >
            Wholesale B2B Portal →
          </Link>
        </div>
      </div>
    </div>
  );
}
