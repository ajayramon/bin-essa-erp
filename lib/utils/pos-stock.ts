"use client";

import type { Item, ItemCategory } from "@/lib/types";
import { getStoredItems, saveStoredItems, type ItemResponse } from "@/lib/api";

const BRANCH_STOCK_STORAGE_KEY = "bin-essa-branch-stock-v2";

export type BranchStockMap = Record<string, Record<string, number>>; // itemId -> { branchId -> quantity }

/**
 * Loads persistent branch stock from localStorage.
 */
export function getPersistentBranchStock(): BranchStockMap {
  if (typeof window === "undefined") {
    return {};
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
    // Fallback to empty
  }

  return {};
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
 * Increases stock for a list of items at a specific branch.
 */
export function increaseBranchStock(
  branchId: string,
  lines: { itemId: string; quantity: number }[]
): Item[] {
  const currentStockMap = getPersistentBranchStock();

  lines.forEach(({ itemId, quantity }) => {
    if (!currentStockMap[itemId]) {
      currentStockMap[itemId] = {};
    }
    const currentQty = currentStockMap[itemId][branchId] ?? 0;
    currentStockMap[itemId][branchId] = currentQty + quantity;
  });

  savePersistentBranchStock(currentStockMap);

  // Sync with global getStoredItems
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
 * Deducts stock for a list of items at a specific branch.
 */
export function deductBranchStock(
  branchId: string,
  lines: { itemId: string; quantity: number }[]
): Item[] {
  const currentStockMap = getPersistentBranchStock();

  // Deduct from branch stock map
  lines.forEach(({ itemId, quantity }) => {
    if (!currentStockMap[itemId]) {
      currentStockMap[itemId] = {};
    }
    const currentQty = currentStockMap[itemId][branchId] ?? 0;
    currentStockMap[itemId][branchId] = Math.max(0, currentQty - quantity);
  });

  savePersistentBranchStock(currentStockMap);

  // Sync with global getStoredItems
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
 * Returns the unified items catalog exclusively from database/stored API items.
 */
export function getPersistentItemsCatalog(): Item[] {
  const currentStockMap = getPersistentBranchStock();
  const storedApiItems = getStoredItems();

  const catalogMap = new Map<string, Item>();

  storedApiItems.forEach((apiItem) => {
    const nameEn = apiItem.nameEn || apiItem.name;
    const nameAr = apiItem.nameAr || apiItem.name;
    const allowSale = apiItem.allowSale !== undefined ? apiItem.allowSale : true;
    const allowDiscount = apiItem.allowDiscount !== undefined ? apiItem.allowDiscount : !apiItem.blockDiscount;
    const allowGift = apiItem.allowGift !== undefined ? apiItem.allowGift : !apiItem.blockFreeGift;
    const maxDiscountPercent = apiItem.maxDiscountPercent !== undefined ? Number(apiItem.maxDiscountPercent) : 100;
    const posVisibility = apiItem.posVisibility !== undefined ? apiItem.posVisibility : true;
    const isActive = apiItem.isActive !== undefined ? apiItem.isActive : true;

    const branchStock = currentStockMap[apiItem.id] ?? {
      "br-01": Math.round(Number(apiItem.stockQuantity || 0)),
    };

    const newItem: Item = {
      id: apiItem.id,
      sku: apiItem.sku,
      nameEn,
      nameAr,
      category: (apiItem.category?.toLowerCase() as ItemCategory) || "general_smoking_accessories",
      subCategory: apiItem.subCategory,
      brand: apiItem.brand,
      brandId: "smoking",
      countryOfOrigin: apiItem.countryOfOrigin,
      imageUrl: apiItem.imageUrl,
      sellPriceKd: Number(apiItem.price || 0),
      costPriceKd: Number(apiItem.cost || 0),
      wholesalePriceKd: Number(apiItem.wholesalePrice || apiItem.price || 0),
      retailPriceKd: Number(apiItem.retailPrice || apiItem.price || 0),
      semiWholesalePriceKd: Number(apiItem.semiWholesalePrice || apiItem.price || 0),
      barcode: apiItem.barcode || apiItem.sku,
      additionalBarcodes: apiItem.additionalBarcodes?.map((b) => b.barcode) || [],
      stockByBranch: branchStock,
      hasVariants: false,
      hasSerials: false,
      visibility: { mode: "inherit", companies: ["smoking"] },
      isActive,
      allowSale,
      allowPurchase: apiItem.allowPurchase !== undefined ? apiItem.allowPurchase : true,
      allowDiscount,
      maxDiscountPercent,
      allowGift,
      expiryRequired: apiItem.expiryRequired ?? apiItem.trackExpiry ?? false,
      posVisibility,
      blockDiscount: !allowDiscount,
      blockFreeGift: !allowGift,
      blockSale: !allowSale,
      unit: apiItem.unit || "pcs",
      stockQuantity: Number(apiItem.stockQuantity || 0),
    };

    catalogMap.set(apiItem.id, newItem);
  });

  return Array.from(catalogMap.values());
}
