"use client";

import { items as defaultItems } from "@/lib/mock-data/items";
import type { Item } from "@/lib/types";
import { getStoredItems, saveStoredItems } from "@/lib/api";

const BRANCH_STOCK_STORAGE_KEY = "bin-essa-branch-stock-v2";

export type BranchStockMap = Record<string, Record<string, number>>; // itemId -> { branchId -> quantity }

/**
 * Loads persistent branch stock from localStorage.
 * Initializes with mock items stockByBranch if not yet stored.
 */
export function getPersistentBranchStock(): BranchStockMap {
  if (typeof window === "undefined") {
    const initial: BranchStockMap = {};
    defaultItems.forEach((item) => {
      initial[item.id] = { ...item.stockByBranch };
    });
    return initial;
  }

  try {
    const raw = localStorage.getItem(BRANCH_STOCK_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === "object") {
        return parsed;
      }
    }
  } catch {
    // Fallback to default
  }

  // First time initialization
  const initial: BranchStockMap = {};
  defaultItems.forEach((item) => {
    initial[item.id] = { ...item.stockByBranch };
  });
  try {
    localStorage.setItem(BRANCH_STOCK_STORAGE_KEY, JSON.stringify(initial));
  } catch {
    // Ignore storage error
  }
  return initial;
}

/**
 * Saves persistent branch stock to localStorage.
 */
export function savePersistentBranchStock(stockMap: BranchStockMap) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(BRANCH_STOCK_STORAGE_KEY, JSON.stringify(stockMap));
  } catch {
    // Ignore storage error
  }
}

/**
 * Deducts stock for a list of items at a specific branch.
 * Persists both to branch-level stock and global inventory item store.
 */
export function deductBranchStock(
  branchId: string,
  lines: { itemId: string; quantity: number }[]
): Item[] {
  const currentStockMap = getPersistentBranchStock();

  // Deduct from branch stock map
  lines.forEach(({ itemId, quantity }) => {
    if (!currentStockMap[itemId]) {
      const found = defaultItems.find((i) => i.id === itemId);
      currentStockMap[itemId] = found ? { ...found.stockByBranch } : {};
    }
    const currentQty = currentStockMap[itemId][branchId] ?? 0;
    currentStockMap[itemId][branchId] = Math.max(0, currentQty - quantity);
  });

  savePersistentBranchStock(currentStockMap);

  // Also sync with global getStoredItems for /inventory page
  if (typeof window !== "undefined") {
    try {
      const storedItems = getStoredItems();
      lines.forEach(({ itemId, quantity }) => {
        const item = storedItems.find((i) => i.id === itemId);
        if (item) {
          item.stockQuantity = Math.max(0, Number(item.stockQuantity || 0) - quantity);
        }
      });
      saveStoredItems(storedItems);
    } catch {
      // Ignore
    }
  }

  // Return refreshed Item list with updated stockByBranch
  return defaultItems.map((item) => {
    const branchStock = currentStockMap[item.id] ?? item.stockByBranch;
    return {
      ...item,
      stockByBranch: { ...branchStock },
    };
  });
}

/**
 * Returns the refreshed items catalog with stockByBranch merged from persistent storage.
 */
export function getPersistentItemsCatalog(): Item[] {
  const currentStockMap = getPersistentBranchStock();
  return defaultItems.map((item) => {
    const branchStock = currentStockMap[item.id] ?? item.stockByBranch;
    return {
      ...item,
      stockByBranch: { ...branchStock },
    };
  });
}
