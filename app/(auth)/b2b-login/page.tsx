"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/context/SessionContext";
import Link from "next/link";
import { Store, Lock, KeyRound, ArrowRight } from "lucide-react";

export default function B2BLoginPage() {
  const router = useRouter();
  const { login } = useSession();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const demoB2BAccounts = [
    { label: "Trolley Supermarkets", user: "trolley" },
    { label: "Bodega Kuwait", user: "bodega" },
    { label: "Wholesale Client 01", user: "b2b_client_01" },
  ];

  function selectB2BAccount(accUsername: string) {
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
          ? new URLSearchParams(window.location.search).get("redirect") || "/b2b"
          : "/b2b";
      window.location.href = redirectUrl;
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "B2B Login failed. Please check your credentials."
      );
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 px-4 py-8">
      <div className="w-full max-w-md bg-slate-900 p-8 rounded-2xl border border-slate-800 shadow-2xl">
        <div className="text-center mb-6">
          <span className="inline-block px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 text-xs font-semibold uppercase tracking-wider mb-2">
            Wholesale Customer Portal
          </span>
          <h1 className="text-2xl font-black text-white tracking-tight">
            Bin Essa B2B Portal
          </h1>
          <p className="text-slate-400 text-xs mt-1">
            Access custom pricing, place wholesale orders, & track credit limits
          </p>
        </div>

        {/* Quick Demo Credentials Preset Bar */}
        <div className="mb-6 bg-slate-950/60 p-3.5 rounded-xl border border-slate-800">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-blue-400 uppercase tracking-wider flex items-center gap-1.5">
              <KeyRound className="w-3.5 h-3.5" />
              Demo Wholesale Accounts
            </span>
            <span className="text-[10px] text-slate-400 font-mono">pwd: demo1234</span>
          </div>
          <div className="grid grid-cols-1 gap-1.5">
            {demoB2BAccounts.map((acc) => (
              <button
                key={acc.user}
                type="button"
                onClick={() => selectB2BAccount(acc.user)}
                className={`px-3 py-2 rounded-lg text-left text-xs font-semibold transition border flex items-center justify-between ${
                  username === acc.user
                    ? "bg-blue-600 text-white border-blue-400 font-bold"
                    : "bg-slate-800/80 hover:bg-slate-700/80 text-slate-200 border-slate-700/60"
                }`}
              >
                <span>{acc.label}</span>
                <span className={`text-[10px] font-mono ${username === acc.user ? "text-blue-100" : "text-slate-400"}`}>
                  @{acc.user}
                </span>
              </button>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 text-xs leading-relaxed text-red-300 bg-red-950/60 border border-red-800/80 rounded-xl">
              <div className="font-bold mb-0.5">Authentication Issue:</div>
              {error}
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
                placeholder="e.g. trolley, bodega, b2b_client_01"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-800 text-white border border-slate-700 focus:outline-none focus:border-blue-500 transition-colors text-sm"
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
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-800 text-white border border-slate-700 focus:outline-none focus:border-blue-500 transition-colors text-sm"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold rounded-xl shadow-lg shadow-blue-600/20 transition-all text-sm flex items-center justify-center gap-2 cursor-pointer mt-2"
          >
            {loading ? (
              "Authenticating B2B Account..."
            ) : (
              <>
                <span>Sign In to B2B Portal</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="mt-6 pt-5 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <Link href="/" className="hover:text-amber-400 transition">
            ← Home
          </Link>
          <Link href="/login" className="text-amber-400 hover:underline font-medium">
            ERP Staff Login →
          </Link>
        </div>
      </div>
    </div>
  );
}
