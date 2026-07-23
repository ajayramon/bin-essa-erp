import type { CategoryVisibilityMap } from "@/lib/types";

// Default visibility per category. An item with visibility.mode = "inherit"
// follows the list here for its category. Admin can change these defaults
// later (Settings/Admin stage) without touching every item.
export const categoryVisibility: CategoryVisibilityMap = {
  disposable_vapes: ["smoking"],
  pod_systems: ["smoking"],
  nicotine_pouches: ["smoking"],
  dokha_medwakh: ["smoking"],
  cigarette_lighters: ["smoking", "khiran", "jmart"],
  rolling_papers: ["smoking"],
  rolling_tobacco_hbt: ["smoking"],
  pipe_accessories: ["smoking"],
  general_smoking_accessories: ["smoking"],
  marine_outdoor: ["khiran"],
  custom_gifts_signage: ["jmart"],
  licensed_collectibles: ["jmart"],
};
