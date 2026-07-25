"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/context/SessionContext";

export default function LoginPage() {
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
      router.push("/inventory");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm bg-neutral-900 p-8 rounded-lg border border-neutral-800"
      >
        <h1 className="text-2xl font-bold text-[#FDCE0C] mb-6 text-center">
          Bin Essa ERP
        </h1>

        <div className="mb-4">
          <label className="block text-sm text-neutral-300 mb-1">
            Username
          </label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-3 py-2 rounded bg-neutral-800 text-white border border-neutral-700 focus:outline-none focus:border-[#FDCE0C]"
            required
            autoFocus
          />
        </div>

        <div className="mb-6">
          <label className="block text-sm text-neutral-300 mb-1">
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 rounded bg-neutral-800 text-white border border-neutral-700 focus:outline-none focus:border-[#FDCE0C]"
            required
          />
        </div>

        {error && (
          <p className="text-red-500 text-sm mb-4 text-center">{error}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 rounded bg-[#FDCE0C] text-black font-semibold hover:opacity-90 disabled:opacity-50"
        >
          {loading ? "Signing in..." : "Sign In"}
        </button>
      </form>
    </div>
  );
}
