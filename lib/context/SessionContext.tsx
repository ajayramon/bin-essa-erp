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

  // Restore a session from localStorage on mount. Works for both real
  // backend logins and mock loginAs() sessions, since both now store the
  // full user object under USER_KEY rather than just an id to re-look-up.
  useEffect(() => {
    try {
      const savedUserRaw = localStorage.getItem(USER_KEY);
      if (!savedUserRaw) {
        document.cookie = "bin_essa_session=; path=/; max-age=0";
        document.cookie = "bin_essa_token=; path=/; max-age=0";
        setIsRestoringSession(false);
        return;
      }

      const savedUser = JSON.parse(savedUserRaw) as User;
      setUser(savedUser);

      const savedBrandId = localStorage.getItem(BRAND_KEY) as BrandId | null;
      const savedBranchId = localStorage.getItem(BRANCH_KEY);

      setCurrentBrandId(savedBrandId ?? DEFAULT_BRAND_ID);
      setCurrentBranchId(savedBranchId ?? savedUser.branchId);

      // Keep cookies in sync for server-side middleware route guards
      document.cookie = "bin_essa_session=1; path=/; max-age=86400; SameSite=Lax";
      const token = localStorage.getItem(TOKEN_KEY);
      if (token) {
        document.cookie = `bin_essa_token=${token}; path=/; max-age=86400; SameSite=Lax`;
      }
    } catch {
      // Corrupted/unparseable saved session - clear it out rather than
      // getting stuck in a broken state.
      localStorage.removeItem(USER_KEY);
      localStorage.removeItem(BRAND_KEY);
      localStorage.removeItem(BRANCH_KEY);
      localStorage.removeItem(TOKEN_KEY);
      document.cookie = "bin_essa_session=; path=/; max-age=0";
      document.cookie = "bin_essa_token=; path=/; max-age=0";
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

    const mappedUser: User = {
      id: data.user.id,
      nameEn: data.user.fullName,
      nameAr: data.user.fullName,
      role: data.user.role as Role,
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