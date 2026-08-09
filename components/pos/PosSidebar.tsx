"use client";

import {
  ShoppingBag,
  Clock,
  Users,
  RotateCcw,
  BarChart3,
  Boxes,
  SlidersHorizontal,
  LogOut,
} from "lucide-react";
import { useSession } from "@/lib/context/SessionContext";
import { useLocale } from "@/lib/i18n/LocaleContext";

export type PosTab =
  | "sales"
  | "orders"
  | "customers"
  | "returns"
  | "reports"
  | "stock"
  | "settings";

interface PosSidebarProps {
  activeTab: PosTab;
  onSelectTab: (tab: PosTab) => void;
  heldOrdersCount: number;
}

export function PosSidebar({
  activeTab,
  onSelectTab,
  heldOrdersCount,
}: PosSidebarProps) {
  const { logout } = useSession();
  const { t } = useLocale();

  const navItems: {
    id: PosTab;
    label: string;
    icon: typeof ShoppingBag;
    badge?: number;
  }[] = [
    {
      id: "sales",
      label: t.posScreen.sales,
      icon: ShoppingBag,
    },
    {
      id: "orders",
      label: t.posScreen.orders,
      icon: Clock,
      badge: heldOrdersCount > 0 ? heldOrdersCount : undefined,
    },
    {
      id: "customers",
      label: t.posScreen.customers,
      icon: Users,
    },
    {
      id: "returns",
      label: t.posScreen.returns,
      icon: RotateCcw,
    },
    {
      id: "reports",
      label: t.posScreen.reports,
      icon: BarChart3,
    },
    {
      id: "stock",
      label: t.posScreen.stock,
      icon: Boxes,
    },
    {
      id: "settings",
      label: t.posScreen.settings,
      icon: SlidersHorizontal,
    },
  ];

  return (
    <aside className="flex h-full w-20 flex-col items-center justify-between border-e border-neutral-800 bg-neutral-950 py-3 text-neutral-400 select-none">
      <nav className="flex w-full flex-col items-center gap-1.5 px-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onSelectTab(item.id)}
              className={`group relative flex w-full flex-col items-center justify-center rounded-xl py-2.5 px-1 transition-all ${
                isActive
                  ? "bg-[#FDCE0C] text-black font-bold shadow-md"
                  : "text-neutral-400 hover:bg-neutral-900 hover:text-white"
              }`}
              title={item.label}
            >
              <div className="relative">
                <Icon className={`h-5 w-5 ${isActive ? "text-black" : "text-neutral-400 group-hover:text-white"}`} />
                {item.badge !== undefined && (
                  <span
                    className={`absolute -top-1.5 -end-2 flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[10px] font-bold ${
                      isActive
                        ? "bg-black text-white"
                        : "bg-[#FDCE0C] text-black"
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </div>
              <span className="mt-1 text-[11px] font-medium leading-tight truncate max-w-full">
                {item.label}
              </span>
            </button>
          );
        })}
      </nav>

      {/* Logout button at bottom */}
      <div className="w-full px-2">
        <button
          type="button"
          onClick={logout}
          className="flex w-full flex-col items-center justify-center rounded-xl py-2.5 px-1 text-neutral-400 transition-colors hover:bg-red-950/40 hover:text-red-400"
          title={t.posScreen.logout}
        >
          <LogOut className="h-5 w-5" />
          <span className="mt-1 text-[11px] font-medium leading-tight">
            {t.posScreen.logout}
          </span>
        </button>
      </div>
    </aside>
  );
}
