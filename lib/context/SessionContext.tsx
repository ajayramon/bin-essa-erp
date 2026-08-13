"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { users } from "@/lib/mock-data/users";
import { branches } from "@/lib/mock-data/branches";
import { brands } from "@/lib/mock-data/brands";
import { User, Branch, Brand, BrandId, Role } from "@/lib/types";
import { loginRequest } from "@/lib/api";

interface SessionContextValue {
  user: User | null;
  isHeadOffice: boolean;
  currentBrand: Brand | null;
  currentBranch: Branch | null;
  branchesForCurrentBrand: Branch[];
  isRestoringSession: boolean;
  loginAs: (userId: string) => void;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  switchBrand: (brandId: BrandId) => void;
  switchBranch: (branchId: string) => void;
}

const SessionContext = createContext<SessionContextValue | undefined>(
  undefined
);

// USER_KEY now stores the full serialized user object, not just an id.
// This is required because real logins (via /auth/login) return users from
// the real backend database - their ids do NOT exist in the mock `users`
// array below, so a previous version of this file that looked the user up
// via users.find(u => u.id === savedUserId) would always fail to find a
// real logged-in user on refresh, silently leaving `user` as null and
// bouncing the person back to the login screen even though their token
// was still valid and sitting in localStorage. Storing (and restoring)
// the full user object sidesteps that mismatch entirely.
const USER_KEY = "bin-essa-session-user";
const BRAND_KEY = "bin-essa-session-brand-id";
const BRANCH_KEY = "bin-essa-session-branch-id";
const TOKEN_KEY = "bin-essa-access-token";

const DEFAULT_BRAND_ID: BrandId = "smoking";

export function SessionProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [currentBrandId, setCurrentBrandId] = useState<BrandId>(
    DEFAULT_BRAND_ID
  );
  const [currentBranchId, setCurrentBranchId] = useState<string | null>(null);
  const [isRestoringSession, setIsRestoringSession] = useState(true);

  useEffect(() => {
    try {
      let restoredUser: User | null = null;
      const savedUserRaw = localStorage.getItem(USER_KEY);

      if (savedUserRaw) {
        try {
          const parsed = JSON.parse(savedUserRaw) as User;
          if (parsed && parsed.id) {
            const rawRole = (parsed.role || "admin").toString().toLowerCase();
            parsed.role = (rawRole === "manager" ? "branch_manager" : rawRole === "b2b_client" ? "b2b_customer" : rawRole) as Role;
            restoredUser = parsed;
          }
        } catch {
          // ignore corrupted user json
        }
      }

      // Fallback: Restore user from JWT token if user was not in localStorage
      if (!restoredUser) {
        const tokenCookie = document.cookie
          .split("; ")
          .find((row) => row.startsWith("bin_essa_token="))
          ?.split("=")[1];
        const token = localStorage.getItem(TOKEN_KEY) || tokenCookie;

        if (token && token.includes(".")) {
          try {
            const payloadBase64 = token.split(".")[1];
            const decodedStr = atob(payloadBase64.replace(/-/g, "+").replace(/_/g, "/"));
            const payload = JSON.parse(decodedStr);
            if (payload && payload.username) {
              const rawRole = (payload.role || "ADMIN").toString().toLowerCase();
              const normalizedRole = (rawRole === "manager" ? "branch_manager" : rawRole === "b2b_client" ? "b2b_customer" : rawRole) as Role;
              restoredUser = {
                id: payload.sub || "u-restored",
                nameEn: payload.fullName || payload.username,
                nameAr: payload.fullName || payload.username,
                role: normalizedRole,
                branchId: payload.branchId || null,
              };
              localStorage.setItem(USER_KEY, JSON.stringify(restoredUser));
            }
          } catch {
            // ignore token parse error
          }
        }
      }

      if (restoredUser) {
        setUser(restoredUser);
        const savedBrandId = localStorage.getItem(BRAND_KEY) as BrandId | null;
        const savedBranchId = localStorage.getItem(BRANCH_KEY);

        setCurrentBrandId(savedBrandId ?? DEFAULT_BRAND_ID);
        setCurrentBranchId(savedBranchId ?? restoredUser.branchId);

        // Keep cookies in sync for server-side middleware route guards
        document.cookie = "bin_essa_session=1; path=/; max-age=604800; SameSite=Lax";
        const token = localStorage.getItem(TOKEN_KEY);
        if (token) {
          document.cookie = `bin_essa_token=${token}; path=/; max-age=604800; SameSite=Lax`;
        }
      }
    } catch {
      // Safe fallback
    } finally {
      setIsRestoringSession(false);
    }
  }, []);

  function applySessionForUser(u: User) {
    setUser(u);
    localStorage.setItem(USER_KEY, JSON.stringify(u));
    document.cookie = "bin_essa_session=1; path=/; max-age=86400; SameSite=Lax";

    let brandId: BrandId = DEFAULT_BRAND_ID;
    if (u.branchId) {
      const homeBranch = branches.find((b) => b.id === u.branchId);
      if (homeBranch) brandId = homeBranch.brandId;
    }

    setCurrentBrandId(brandId);
    setCurrentBranchId(u.branchId);
    localStorage.setItem(BRAND_KEY, brandId);
    if (u.branchId) {
      localStorage.setItem(BRANCH_KEY, u.branchId);
    } else {
      localStorage.removeItem(BRANCH_KEY);
    }
  }

  function loginAs(userId: string) {
    const foundUser = users.find((u) => u.id === userId) ?? null;
    if (!foundUser) return;
    applySessionForUser(foundUser);
  }

  async function login(username: string, password: string) {
    const data = await loginRequest(username, password);

    const rawRole = (data.user.role || "ADMIN").toLowerCase();
    const normalizedRole: Role =
      rawRole === "manager"
        ? "branch_manager"
        : rawRole === "b2b_client"
        ? "b2b_customer"
        : (rawRole as Role);

    const mappedUser: User = {
      id: data.user.id,
      nameEn: data.user.fullName,
      nameAr: data.user.fullName,
      role: normalizedRole,
      branchId: data.user.branchId,
    };

    localStorage.setItem(TOKEN_KEY, data.access_token);
    document.cookie = `bin_essa_token=${data.access_token}; path=/; max-age=86400; SameSite=Lax`;
    applySessionForUser(mappedUser);
  }

  function logout() {
    setUser(null);
    setCurrentBrandId(DEFAULT_BRAND_ID);
    setCurrentBranchId(null);
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem(BRAND_KEY);
    localStorage.removeItem(BRANCH_KEY);
    localStorage.removeItem(TOKEN_KEY);
    document.cookie = "bin_essa_session=; path=/; max-age=0";
    document.cookie = "bin_essa_token=; path=/; max-age=0";
  }

  function switchBrand(brandId: BrandId) {
    setCurrentBrandId(brandId);
    localStorage.setItem(BRAND_KEY, brandId);

    // Dropping to "all branches" view when switching brands as head office;
    // branch-tied users only ever see their own brand so this rarely fires for them.
    setCurrentBranchId(null);
    localStorage.removeItem(BRANCH_KEY);
  }

  function switchBranch(branchId: string) {
    const foundBranch = branches.find((b) => b.id === branchId);
    if (!foundBranch) return;

    setCurrentBranchId(foundBranch.id);
    setCurrentBrandId(foundBranch.brandId);
    localStorage.setItem(BRANCH_KEY, foundBranch.id);
    localStorage.setItem(BRAND_KEY, foundBranch.brandId);
  }

  const currentBrand = brands.find((b) => b.id === currentBrandId) ?? null;
  const currentBranch = currentBranchId
    ? branches.find((b) => b.id === currentBranchId) ?? null
    : null;
  const branchesForCurrentBrand = branches.filter(
    (b) => b.brandId === currentBrandId
  );
  const isHeadOffice = user ? user.branchId === null : false;

  return (
    <SessionContext.Provider
      value={{
        user,
        isHeadOffice,
        currentBrand,
        currentBranch,
        branchesForCurrentBrand,
        isRestoringSession,
        loginAs,
        login,
        logout,
        switchBrand,
        switchBranch,
      }}
    >
      {children}
    </SessionContext.Provider>
  );
}

export function useSession() {
  const ctx = useContext(SessionContext);
  if (!ctx) {
    throw new Error("useSession must be used within a SessionProvider");
  }
  return ctx;
}