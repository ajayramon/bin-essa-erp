"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/context/SessionContext";
import Link from "next/link";

export default function B2BLoginPage() {
  const router = useRouter();
  const { login } = useSession();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await login(username, password);
      router.push("/b2b");
    } catch (err) {
      setError(err instanceof Error ? err.message : "B2B Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 px-4">
      <div className="w-full max-w-md bg-slate-900 p-8 rounded-xl border border-slate-800 shadow-2xl">
        <div className="text-center mb-8">
          <span className="inline-block px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 text-xs font-semibold uppercase tracking-wider mb-2">
            Wholesale Customer Portal
          </span>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Bin Essa B2B Portal
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Access custom pricing, place wholesale orders, & track balances
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="p-3 text-sm text-red-400 bg-red-950/50 border border-red-800/50 rounded-lg">
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs font-medium text-slate-300 uppercase tracking-wider mb-2">
              Wholesale Account ID / Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="e.g. b2b_client_01"
              className="w-full px-4 py-3 rounded-lg bg-slate-800 text-white border border-slate-700 focus:outline-none focus:border-blue-500 transition-colors text-sm"
              required
              autoFocus
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 uppercase tracking-wider mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-3 rounded-lg bg-slate-800 text-white border border-slate-700 focus:outline-none focus:border-blue-500 transition-colors text-sm"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-semibold rounded-lg shadow-lg shadow-blue-600/20 transition-all text-sm"
          >
            {loading ? "Authenticating B2B Account..." : "Sign In to B2B Portal"}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-slate-800 text-center">
          <p className="text-xs text-slate-400">
            Internal ERP Staff Member?{" "}
            <Link href="/login" className="text-blue-400 hover:underline font-medium">
              Go to Staff Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
