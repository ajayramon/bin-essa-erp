"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/context/SessionContext";

export default function PosLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isRestoringSession } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (!isRestoringSession && !user) {
      router.replace("/login");
    }
  }, [user, isRestoringSession, router]);

  if (isRestoringSession || !user) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-neutral-950 text-white">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#FDCE0C] border-t-transparent" />
          <p className="text-xs font-semibold text-neutral-400">Loading Bin Essa POS…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen w-screen flex-col overflow-hidden bg-neutral-100 text-neutral-900">
      {children}
    </div>
  );
}
