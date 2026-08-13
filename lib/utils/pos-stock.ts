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
      isActive: item.isActive ?? true,
      allowSale: item.allowSale ?? !item.blockSale,
      allowPurchase: item.allowPurchase ?? true,
      allowDiscount: item.allowDiscount ?? !item.blockDiscount,
      maxDiscountPercent: item.maxDiscountPercent ?? 100,
      allowGift: item.allowGift ?? !item.blockFreeGift,
      expiryRequired: item.expiryRequired ?? item.hasSerials ?? false,
      posVisibility: item.posVisibility ?? true,
    });
  });

  // 2. Merge items from getStoredItems() (both updated mock items and newly added records)
  storedApiItems.forEach((apiItem) => {
    const nameEn = apiItem.nameEn || apiItem.name;
    const nameAr = apiItem.nameAr || apiItem.name;
    const allowSale = apiItem.allowSale !== undefined ? apiItem.allowSale : true;
    const allowDiscount = apiItem.allowDiscount !== undefined ? apiItem.allowDiscount : !apiItem.blockDiscount;
    const allowGift = apiItem.allowGift !== undefined ? apiItem.allowGift : !apiItem.blockFreeGift;
    const maxDiscountPercent = apiItem.maxDiscountPercent !== undefined ? Number(apiItem.maxDiscountPercent) : 100;
    const posVisibility = apiItem.posVisibility !== undefined ? apiItem.posVisibility : true;
    const isActive = apiItem.isActive !== undefined ? apiItem.isActive : true;

    if (catalogMap.has(apiItem.id)) {
      const existing = catalogMap.get(apiItem.id)!;
      existing.nameEn = nameEn;
      existing.nameAr = nameAr;
      existing.sellPriceKd = Number(apiItem.price || existing.sellPriceKd);
      existing.costPriceKd = Number(apiItem.cost || existing.costPriceKd);
      existing.wholesalePriceKd = Number(apiItem.wholesalePrice || existing.wholesalePriceKd);
      existing.retailPriceKd = Number(apiItem.retailPrice || existing.sellPriceKd);
      existing.semiWholesalePriceKd = Number(apiItem.semiWholesalePrice || existing.sellPriceKd);
      existing.subCategory = apiItem.subCategory ?? existing.subCategory;
      existing.brand = apiItem.brand ?? existing.brand;
      existing.countryOfOrigin = apiItem.countryOfOrigin ?? existing.countryOfOrigin;
      existing.imageUrl = apiItem.imageUrl ?? existing.imageUrl;
      existing.isActive = isActive;
      existing.allowSale = allowSale;
      existing.allowPurchase = apiItem.allowPurchase !== undefined ? apiItem.allowPurchase : true;
      existing.allowDiscount = allowDiscount;
      existing.maxDiscountPercent = maxDiscountPercent;
      existing.allowGift = allowGift;
      existing.expiryRequired = apiItem.expiryRequired ?? apiItem.trackExpiry ?? false;
      existing.posVisibility = posVisibility;
      existing.blockDiscount = !allowDiscount;
      existing.blockFreeGift = !allowGift;
      existing.blockSale = !allowSale;
    } else {
      const branchStock = currentStockMap[apiItem.id] ?? {
        "br-01": Math.round(Number(apiItem.stockQuantity || 10)),
        "br-02": 5,
        "br-08": 50,
      };

      const newItem: Item = {
        id: apiItem.id,
        sku: apiItem.sku,
        nameEn,
        nameAr,
        category: (apiItem.category.toLowerCase() as ItemCategory) || "general_smoking_accessories",
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
    }
  });

  return Array.from(catalogMap.values());
}
