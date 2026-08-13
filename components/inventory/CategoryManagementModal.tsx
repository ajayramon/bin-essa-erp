"use client";

import { useState, useEffect } from "react";
import { X, Plus, Edit2, Check, AlertCircle, FolderTree, Power, Layers } from "lucide-react";
import { useLocale } from "@/lib/i18n/LocaleContext";
import {
  type Category,
  type SubCategory,
  listCategoriesRequest,
  saveCategoryRequest,
  toggleCategoryStatus,
} from "@/lib/api";

interface CategoryManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCategoriesUpdated?: () => void;
}

export function CategoryManagementModal({
  isOpen,
  onClose,
  onCategoriesUpdated,
}: CategoryManagementModalProps) {
  const { locale, t } = useLocale();
  const isAr = locale === "ar";

  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCatId, setSelectedCatId] = useState<string | null>(null);

  // New Category State
  const [isAddingCat, setIsAddingCat] = useState(false);
  const [catNameEn, setCatNameEn] = useState("");
  const [catNameAr, setCatNameAr] = useState("");
  const [catCode, setCatCode] = useState("");

  // Edit Category State
  const [editingCatId, setEditingCatId] = useState<string | null>(null);
  const [editCatNameEn, setEditCatNameEn] = useState("");
  const [editCatNameAr, setEditCatNameAr] = useState("");

  // New Subcategory State
  const [isAddingSub, setIsAddingSub] = useState(false);
  const [subNameEn, setSubNameEn] = useState("");
  const [subNameAr, setSubNameAr] = useState("");
  const [subCode, setSubCode] = useState("");

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const loadCategories = async () => {
    const list = await listCategoriesRequest();
    setCategories(list);
    if (list.length > 0 && !selectedCatId) {
      setSelectedCatId(list[0].id);
    }
  };

  useEffect(() => {
    if (isOpen) {
      loadCategories();
      setIsAddingCat(false);
      setIsAddingSub(false);
      setEditingCatId(null);
      setError(null);
      setSuccess(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const selectedCategory = categories.find((c) => c.id === selectedCatId) || categories[0];

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!catNameEn.trim() || !catNameAr.trim()) {
      setError(isAr ? "يرجى كتابة اسم الفئة بالإنجليزية والعربية" : "Please provide category name in both English and Arabic.");
      return;
    }

    const code = catCode.trim() || catNameEn.toLowerCase().replace(/[^a-z0-9]/g, "_");
    try {
      await saveCategoryRequest({
        code,
        nameEn: catNameEn.trim(),
        nameAr: catNameAr.trim(),
        isActive: true,
        subcategories: [],
      });
      setCatNameEn("");
      setCatNameAr("");
      setCatCode("");
      setIsAddingCat(false);
      setSuccess(isAr ? "تمت إضافة الفئة بنجاح" : "Category created successfully.");
      await loadCategories();
      onCategoriesUpdated?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create category");
    }
  };

  const handleSaveEditCat = async (cat: Category) => {
    if (!editCatNameEn.trim() || !editCatNameAr.trim()) return;
    try {
      await saveCategoryRequest({
        id: cat.id,
        code: cat.code,
        nameEn: editCatNameEn.trim(),
        nameAr: editCatNameAr.trim(),
        isActive: cat.isActive,
        subcategories: cat.subcategories,
      });
      setEditingCatId(null);
      setSuccess(isAr ? "تم تحديث الفئة بنجاح" : "Category updated successfully.");
      await loadCategories();
      onCategoriesUpdated?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update category");
    }
  };

  const handleToggleCatActive = async (catId: string) => {
    try {
      await toggleCategoryStatus(catId);
      await loadCategories();
      onCategoriesUpdated?.();
    } catch (err) {
      setError("Failed to update status");
    }
  };

  const handleAddSubcategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCategory) return;
    setError(null);
    setSuccess(null);

    if (!subNameEn.trim() || !subNameAr.trim()) {
      setError(isAr ? "يرجى كتابة اسم الفئة الفرعية بالإنجليزية والعربية" : "Please provide subcategory name in both English and Arabic.");
      return;
    }

    const code = subCode.trim() || subNameEn.toLowerCase().replace(/[^a-z0-9]/g, "_");
    const newSub: SubCategory = {
      id: `sub-${Date.now()}`,
      code,
      nameEn: subNameEn.trim(),
      nameAr: subNameAr.trim(),
      isActive: true,
    };

    const updatedSubcategories = [...(selectedCategory.subcategories || []), newSub];

    try {
      await saveCategoryRequest({
        id: selectedCategory.id,
        code: selectedCategory.code,
        nameEn: selectedCategory.nameEn,
        nameAr: selectedCategory.nameAr,
        isActive: selectedCategory.isActive,
        subcategories: updatedSubcategories,
      });
      setSubNameEn("");
      setSubNameAr("");
      setSubCode("");
      setIsAddingSub(false);
      setSuccess(isAr ? "تمت إضافة الفئة الفرعية بنجاح" : "Subcategory added successfully.");
      await loadCategories();
      onCategoriesUpdated?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add subcategory");
    }
  };

  const handleToggleSubActive = async (subId: string) => {
    if (!selectedCategory) return;
    const updatedSubcategories = (selectedCategory.subcategories || []).map((s) =>
      s.id === subId ? { ...s, isActive: !s.isActive } : s
    );

    try {
      await saveCategoryRequest({
        id: selectedCategory.id,
        code: selectedCategory.code,
        nameEn: selectedCategory.nameEn,
        nameAr: selectedCategory.nameAr,
        isActive: selectedCategory.isActive,
        subcategories: updatedSubcategories,
      });
      await loadCategories();
      onCategoriesUpdated?.();
    } catch (err) {
      setError("Failed to update subcategory status");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="flex max-h-[90vh] w-full max-w-4xl flex-col rounded-3xl bg-white shadow-2xl overflow-hidden border border-slate-200">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-black/10 bg-[#0B0F17] p-4 px-6 text-white">
          <div className="flex items-center gap-2.5">
            <FolderTree className="h-6 w-6 text-[#FDCE0C]" />
            <div>
              <h2 className="text-lg font-bold text-white">
                {isAr ? "إدارة الفئات والفئات الفرعية (Category & Subcategory Master)" : "Category & Subcategory Master"}
              </h2>
              <p className="text-xs text-slate-300">
                {isAr
                  ? "إضافة وتعديل وتعطيل الفئات الرئيسية والفرعية مع دعم كامل للغتين العربية والإنجليزية"
                  : "Add, edit, and deactivate categories and subcategories with dual English/Arabic governance."}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-xl p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Notifications */}
        {error && (
          <div className="mx-6 mt-4 p-3 rounded-xl bg-red-50 border border-red-200 text-xs font-bold text-red-700 flex items-center gap-2">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}
        {success && (
          <div className="mx-6 mt-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-700 flex items-center gap-2">
            <Check className="h-4 w-4 shrink-0" />
            <span>{success}</span>
          </div>
        )}

        {/* Main Content Layout: 2 Columns */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-0 flex-1 overflow-hidden p-6">
          {/* Left Column: Categories List (5 cols) */}
          <div className="md:col-span-5 border-e border-slate-200 pe-4 flex flex-col h-[520px]">
            <div className="flex items-center justify-between pb-3 mb-2 border-b border-slate-100">
              <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                {isAr ? "الفئات الرئيسية" : "Main Categories"} ({categories.length})
              </span>
              <button
                type="button"
                onClick={() => {
                  setIsAddingCat((prev) => !prev);
                  setEditingCatId(null);
                }}
                className="inline-flex items-center gap-1 rounded-lg bg-amber-500 hover:bg-amber-600 text-black px-2.5 py-1 text-xs font-bold shadow-xs transition-colors"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>{isAr ? "إضافة فئة" : "Add Category"}</span>
              </button>
            </div>

            {/* Add Category Form */}
            {isAddingCat && (
              <form onSubmit={handleAddCategory} className="p-3 mb-3 rounded-xl border border-amber-300 bg-amber-50/50 space-y-2 text-xs">
                <p className="font-bold text-slate-900">{isAr ? "إضافة فئة رئيسية جديدة" : "New Main Category"}</p>
                <div>
                  <label className="block text-[10px] font-bold text-slate-600 mb-0.5">Name (English)</label>
                  <input
                    type="text"
                    required
                    value={catNameEn}
                    onChange={(e) => setCatNameEn(e.target.value)}
                    placeholder="e.g. Disposable Vapes"
                    className="w-full rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-xs outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-600 mb-0.5">الاسم (بالعربية)</label>
                  <input
                    type="text"
                    required
                    value={catNameAr}
                    onChange={(e) => setCatNameAr(e.target.value)}
                    placeholder="مثال: سحبات جاهزة"
                    className="w-full rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-xs outline-none focus:border-amber-500 text-end"
                  />
                </div>
                <div className="flex justify-end gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setIsAddingCat(false)}
                    className="px-2.5 py-1 text-[11px] font-bold text-slate-600 hover:bg-slate-200 rounded-lg"
                  >
                    {isAr ? "إلغاء" : "Cancel"}
                  </button>
                  <button
                    type="submit"
                    className="px-3 py-1 bg-black text-[#FDCE0C] text-[11px] font-bold rounded-lg hover:bg-slate-900"
                  >
                    {isAr ? "حفظ الفئة" : "Save Category"}
                  </button>
                </div>
              </form>
            )}

            {/* Categories Scrollable List */}
            <div className="flex-1 overflow-y-auto space-y-1.5 pe-1">
              {categories.map((cat) => {
                const isSelected = selectedCategory?.id === cat.id;
                const isEditing = editingCatId === cat.id;

                if (isEditing) {
                  return (
                    <div key={cat.id} className="p-2.5 rounded-xl border border-amber-400 bg-amber-50/70 space-y-2 text-xs">
                      <input
                        type="text"
                        value={editCatNameEn}
                        onChange={(e) => setEditCatNameEn(e.target.value)}
                        className="w-full rounded-lg border border-slate-300 bg-white px-2 py-1 text-xs"
                      />
                      <input
                        type="text"
                        value={editCatNameAr}
                        onChange={(e) => setEditCatNameAr(e.target.value)}
                        className="w-full rounded-lg border border-slate-300 bg-white px-2 py-1 text-xs text-end"
                      />
                      <div className="flex justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => setEditingCatId(null)}
                          className="px-2 py-0.5 text-[10px] font-bold text-slate-600"
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          onClick={() => handleSaveEditCat(cat)}
                          className="px-2.5 py-0.5 bg-black text-[#FDCE0C] text-[10px] font-bold rounded-lg"
                        >
                          Update
                        </button>
                      </div>
                    </div>
                  );
                }

                return (
                  <div
                    key={cat.id}
                    onClick={() => setSelectedCatId(cat.id)}
                    className={`flex items-center justify-between p-2.5 rounded-xl border cursor-pointer transition-all ${
                      isSelected
                        ? "bg-slate-900 text-white border-slate-900 shadow-xs"
                        : "bg-white text-slate-800 border-slate-200 hover:bg-slate-50"
                    }`}
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <p className="font-bold text-xs truncate">
                          {isAr ? cat.nameAr : cat.nameEn}
                        </p>
                        {!cat.isActive && (
                          <span className="px-1.5 py-0.2 rounded-full bg-red-100 text-red-700 text-[9px] font-bold">
                            {isAr ? "معطل" : "Inactive"}
                          </span>
                        )}
                      </div>
                      <p className={`text-[10px] truncate ${isSelected ? "text-slate-400" : "text-slate-500"}`}>
                        {isAr ? cat.nameEn : cat.nameAr} • {cat.subcategories?.length || 0} {isAr ? "فئات فرعية" : "subcategories"}
                      </p>
                    </div>

                    <div className="flex items-center gap-1 ms-2" onClick={(e) => e.stopPropagation()}>
                      <button
                        type="button"
                        onClick={() => {
                          setEditingCatId(cat.id);
                          setEditCatNameEn(cat.nameEn);
                          setEditCatNameAr(cat.nameAr);
                        }}
                        className={`p-1 rounded-lg hover:bg-slate-100 ${isSelected ? "text-slate-300 hover:text-black hover:bg-white" : "text-slate-400 hover:text-black"}`}
                        title="Edit"
                      >
                        <Edit2 className="h-3 w-3" />
                      </button>

                      <button
                        type="button"
                        onClick={() => handleToggleCatActive(cat.id)}
                        className={`p-1 rounded-lg ${cat.isActive ? (isSelected ? "text-emerald-400 hover:text-red-300" : "text-emerald-600 hover:text-red-600") : "text-red-400 hover:text-emerald-600"}`}
                        title={cat.isActive ? "Deactivate" : "Activate"}
                      >
                        <Power className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Subcategories for Selected Category (7 cols) */}
          <div className="md:col-span-7 ps-4 flex flex-col h-[520px]">
            {selectedCategory ? (
              <>
                <div className="flex items-center justify-between pb-3 mb-2 border-b border-slate-100">
                  <div>
                    <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                      {isAr ? "الفئات الفرعية التابعة لـ: " : "Subcategories for: "}
                      <span className="text-amber-600">
                        {isAr ? selectedCategory.nameAr : selectedCategory.nameEn}
                      </span>
                    </span>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      {selectedCategory.subcategories?.length || 0} {isAr ? "فئات فرعية مسجلة" : "registered subcategories"}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => setIsAddingSub((prev) => !prev)}
                    className="inline-flex items-center gap-1 rounded-lg bg-black text-[#FDCE0C] px-3 py-1.5 text-xs font-bold shadow-xs hover:bg-slate-900 transition-colors"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    <span>{isAr ? "إضافة فئة فرعية" : "Add Subcategory"}</span>
                  </button>
                </div>

                {/* Add Subcategory Inline Form */}
                {isAddingSub && (
                  <form onSubmit={handleAddSubcategory} className="p-3 mb-3 rounded-2xl border border-slate-300 bg-slate-50 space-y-2 text-xs">
                    <p className="font-bold text-slate-900">{isAr ? "إضافة فئة فرعية جديدة" : "New Subcategory Form"}</p>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-600 mb-0.5">Subcategory Name (EN)</label>
                        <input
                          type="text"
                          required
                          value={subNameEn}
                          onChange={(e) => setSubNameEn(e.target.value)}
                          placeholder="e.g. 5,000 - 7,000 Puffs"
                          className="w-full rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-xs outline-none focus:border-amber-500"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-600 mb-0.5">اسم الفئة الفرعية (AR)</label>
                        <input
                          type="text"
                          required
                          value={subNameAr}
                          onChange={(e) => setSubNameAr(e.target.value)}
                          placeholder="مثال: 5000 - 7000 سحبة"
                          className="w-full rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-xs outline-none focus:border-amber-500 text-end"
                        />
                      </div>
                    </div>
                    <div className="flex justify-end gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => setIsAddingSub(false)}
                        className="px-2.5 py-1 text-[11px] font-bold text-slate-600 hover:bg-slate-200 rounded-lg"
                      >
                        {isAr ? "إلغاء" : "Cancel"}
                      </button>
                      <button
                        type="submit"
                        className="px-3 py-1 bg-amber-500 text-black text-[11px] font-bold rounded-lg hover:bg-amber-600"
                      >
                        {isAr ? "حفظ الفئة الفرعية" : "Save Subcategory"}
                      </button>
                    </div>
                  </form>
                )}

                {/* Subcategories Table */}
                <div className="flex-1 overflow-y-auto pe-1">
                  {(!selectedCategory.subcategories || selectedCategory.subcategories.length === 0) ? (
                    <div className="flex flex-col items-center justify-center h-48 rounded-2xl border border-dashed border-slate-200 text-center p-6">
                      <Layers className="h-8 w-8 text-slate-300 mb-2" />
                      <p className="text-xs font-bold text-slate-600">
                        {isAr ? "لا توجد فئات فرعية مسجلة لهذه الفئة" : "No subcategories found for this category."}
                      </p>
                      <p className="text-[11px] text-slate-400 mt-1">
                        {isAr ? "انقر على زر '+ إضافة فئة فرعية' لإضافة أول فئة فرعية" : "Click '+ Add Subcategory' above to create one."}
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {selectedCategory.subcategories.map((sub) => (
                        <div
                          key={sub.id}
                          className="flex items-center justify-between p-3 rounded-2xl border border-slate-200 bg-white shadow-2xs hover:border-slate-300 transition-all"
                        >
                          <div>
                            <div className="flex items-center gap-2">
                              <p className="text-xs font-bold text-slate-900">
                                {isAr ? sub.nameAr : sub.nameEn}
                              </p>
                              <span
                                className={`px-2 py-0.2 rounded-full text-[9px] font-black uppercase ${
                                  sub.isActive
                                    ? "bg-emerald-100 text-emerald-800"
                                    : "bg-red-100 text-red-800"
                                }`}
                              >
                                {sub.isActive ? (isAr ? "نشط" : "Active") : (isAr ? "معطل" : "Inactive")}
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-400 mt-0.5">
                              {isAr ? sub.nameEn : sub.nameAr} • Code: <span className="font-mono text-slate-600">{sub.code}</span>
                            </p>
                          </div>

                          <button
                            type="button"
                            onClick={() => handleToggleSubActive(sub.id)}
                            className={`px-3 py-1 text-[10px] font-bold rounded-xl border transition-colors ${
                              sub.isActive
                                ? "border-red-200 bg-red-50 text-red-700 hover:bg-red-100"
                                : "border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                            }`}
                          >
                            {sub.isActive ? (isAr ? "تعطيل الفئة الفرعية" : "Deactivate") : (isAr ? "تفعيل الفئة الفرعية" : "Activate")}
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center justify-center h-full text-slate-400 text-xs font-bold">
                {isAr ? "اختر فئة من القائمة لعرض الفئات الفرعية" : "Select a category to view subcategories"}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-slate-200 bg-slate-50 p-4 px-6 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl bg-slate-900 hover:bg-black text-white px-5 py-2 text-xs font-bold shadow-xs transition-colors"
          >
            {isAr ? "إغلاق وإتمام" : "Done"}
          </button>
        </div>
      </div>
    </div>
  );
}
