"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/context/SessionContext";
import { Sidebar } from "@/components/layout/Sidebar";
import { Topbar } from "@/components/layout/Topbar";

export default function InternalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isRestoringSession } = useSession();
  const router = useRouter();

  // Only redirect once session restoration has actually finished - never
  // redirect while it's still in flight, or a valid saved session gets
  // bounced to login before it's had a chance to load.
  useEffect(() => {
    if (!isRestoringSession && !user) {
      router.replace("/login");
    }
  }, [user, isRestoringSession, router]);

  if (isRestoringSession || !user) {
    // Brief flash while SessionContext restores a saved session from
    // localStorage on first load, or while the redirect above fires.
    return (
      <div className="flex h-screen items-center justify-center bg-paper">
        <p className="text-sm text-ink/50">Loading…</p>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-paper text-ink">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Topbar />
        <main className="flex-1 overflow-y-auto p-6 text-ink">{children}</main>
      </div>
    </div>
  );
}