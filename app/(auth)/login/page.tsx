"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/context/SessionContext";
import Link from "next/link";
import { Lock, User, ShieldCheck, Store, KeyRound, ArrowRight } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useSession();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const demoAccounts = [
    { label: "Admin", user: "admin", role: "Head Office Admin" },
    { label: "Manager", user: "manager", role: "Branch Manager" },
    { label: "Cashier", user: "cashier", role: "Retail Cashier" },
    { label: "Accountant", user: "accountant", role: "Head Accountant" },
  ];

  function selectDemoAccount(accUsername: string) {
    setUsername(accUsername);
    setPassword("demo1234");
    setError(null);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await login(username, password);
      const redirectUrl =
        typeof window !== "undefined"
          ? new URLSearchParams(window.location.search).get("redirect") || "/dashboard"
          : "/dashboard";
      window.location.href = redirectUrl;
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Login failed. Please check your credentials."
      );
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 px-4 py-8">
      <div className="w-full max-w-md bg-slate-900 p-8 rounded-2xl border border-slate-800 shadow-2xl">
        {/* Header Branding */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-amber-400 border border-amber-500/30 flex items-center justify-center shadow-lg mx-auto mb-3 text-slate-950 font-black text-2xl">
            B
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">
            Bin Essa ERP
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Enterprise Cloud Management System & POS
          </p>
        </div>

        {/* Quick Demo Credentials Preset Bar */}
        <div className="mb-6 bg-slate-950/60 p-3.5 rounded-xl border border-slate-800">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
              <KeyRound className="w-3.5 h-3.5" />
              Quick Demo Accounts
            </span>
            <span className="text-[10px] text-slate-400 font-mono">pwd: demo1234</span>
          </div>
          <div className="grid grid-cols-2 gap-1.5">
            {demoAccounts.map((acc) => (
              <button
                key={acc.user}
                type="button"
                onClick={() => selectDemoAccount(acc.user)}
                className={`px-2.5 py-1.5 rounded-lg text-left text-xs font-semibold transition border ${
                  username === acc.user
                    ? "bg-amber-400 text-slate-950 border-amber-300 font-bold"
                    : "bg-slate-800/80 hover:bg-slate-700/80 text-slate-200 border-slate-700/60"
                }`}
              >
                <div className="text-[11px] font-bold leading-tight">{acc.label}</div>
                <div className={`text-[9px] truncate ${username === acc.user ? "text-slate-800" : "text-slate-400"}`}>
                  @{acc.user}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 text-xs leading-relaxed text-red-300 bg-red-950/60 border border-red-800/80 rounded-xl">
              <div className="font-bold mb-0.5">Authentication Issue:</div>
              {error}
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
                placeholder="e.g. admin, cashier, manager"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-800 text-white border border-slate-700 focus:outline-none focus:border-amber-400 transition-colors text-sm"
                required
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
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-800 text-white border border-slate-700 focus:outline-none focus:border-amber-400 transition-colors text-sm"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 bg-amber-400 hover:bg-amber-300 disabled:opacity-50 text-slate-950 font-black rounded-xl shadow-lg shadow-amber-400/20 transition-all text-sm flex items-center justify-center gap-2 cursor-pointer mt-2"
          >
            {loading ? (
              "Authenticating..."
            ) : (
              <>
                <span>Sign In to ERP</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Footer Navigation */}
        <div className="mt-6 pt-5 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <Link href="/" className="hover:text-amber-400 transition">
            ← Home
          </Link>
          <Link href="/b2b-login" className="text-blue-400 hover:underline font-medium">
            Wholesale B2B Portal →
          </Link>
        </div>
      </div>
    </div>
  );
}
