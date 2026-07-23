import type { Item, BrandId } from "@/lib/types";
import { categoryVisibility } from "@/lib/mock-data/category-visibility";

// Returns true if the given item should appear for the given company (brand),
// based on its own visibility override, or its category's default if it inherits.
export function isItemVisibleToBrand(item: Item, brandId: BrandId): boolean {
  if (item.visibility.mode === "override") {
    return item.visibility.companies.includes(brandId);
  }
  const categoryDefault = categoryVisibility[item.category] ?? [];
  return categoryDefault.includes(brandId);
}
