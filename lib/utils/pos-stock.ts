"use client";

import { items as defaultItems } from "@/lib/mock-data/items";
import type { Item, ItemCategory } from "@/lib/types";
import { getStoredItems, saveStoredItems, type ItemResponse } from "@/lib/api";

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
 * Increases stock for a list of items at a specific branch (e.g. from Goods Receipt or Purchase Invoice).
 * Persists both to branch-level stock and global inventory item store.
 */
export function increaseBranchStock(
  branchId: string,
  lines: { itemId: string; quantity: number }[]
): Item[] {
  const currentStockMap = getPersistentBranchStock();

  lines.forEach(({ itemId, quantity }) => {
    if (!currentStockMap[itemId]) {
      const found = defaultItems.find((i) => i.id === itemId);
      currentStockMap[itemId] = found ? { ...found.stockByBranch } : {};
    }
    const currentQty = currentStockMap[itemId][branchId] ?? 0;
    currentStockMap[itemId][branchId] = currentQty + quantity;
  });

  savePersistentBranchStock(currentStockMap);

  // Also sync with global getStoredItems for /inventory page
  if (typeof window !== "undefined") {
    try {
      const storedItems = getStoredItems();
      lines.forEach(({ itemId, quantity }) => {
        const item = storedItems.find((i) => i.id === itemId);
        if (item) {
          item.stockQuantity = Number(item.stockQuantity || 0) + quantity;
        }
      });
      saveStoredItems(storedItems);
    } catch {
      // Ignore
    }
  }

  return getPersistentItemsCatalog();
}

/**
 * Deducts stock for a list of items at a specific branch (e.g. from POS Sale or Customer Invoice).
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

  return getPersistentItemsCatalog();
}

/**
 * Returns the unified items catalog merging default mock items, user-created items from /inventory/new,
 * and persistent branch-level stock maps.
 */
export function getPersistentItemsCatalog(): Item[] {
  const currentStockMap = getPersistentBranchStock();
  const storedApiItems = getStoredItems();

  // Map of existing items by ID
  const catalogMap = new Map<string, Item>();

  // 1. Load default mock items
  defaultItems.forEach((item) => {
    const branchStock = currentStockMap[item.id] ?? item.stockByBranch;
    catalogMap.set(item.id, {
      ...item,
      stockByBranch: { ...branchStock },
    });
  });

  // 2. Merge user-created items from getStoredItems()
  storedApiItems.forEach((apiItem) => {
    if (catalogMap.has(apiItem.id)) {
      // Update price / cost if edited
      const existing = catalogMap.get(apiItem.id)!;
      existing.sellPriceKd = Number(apiItem.price || existing.sellPriceKd);
      existing.costPriceKd = Number(apiItem.cost || existing.costPriceKd);
    } else {
      // Add new item to catalog
      const branchStock = currentStockMap[apiItem.id] ?? {
        "br-01": Math.round(Number(apiItem.stockQuantity || 10)),
        "br-02": 5,
        "br-08": 50,
      };

      const newItem: Item = {
        id: apiItem.id,
        sku: apiItem.sku,
        nameEn: apiItem.name,
        nameAr: apiItem.name,
        category: (apiItem.category.toLowerCase() as ItemCategory) || "general_smoking_accessories",
        brandId: "smoking",
        sellPriceKd: Number(apiItem.price || 0),
        costPriceKd: Number(apiItem.cost || 0),
        wholesalePriceKd: Number(apiItem.wholesalePrice || apiItem.price || 0),
        barcode: apiItem.barcode || apiItem.sku,
        stockByBranch: branchStock,
        hasVariants: false,
        hasSerials: false,
        visibility: { mode: "inherit", companies: ["smoking"] },
        blockDiscount: Boolean(apiItem.blockDiscount),
        blockFreeGift: Boolean(apiItem.blockFreeGift),
        blockSale: false,
      };

      catalogMap.set(apiItem.id, newItem);
    }
  });

  return Array.from(catalogMap.values());
}
