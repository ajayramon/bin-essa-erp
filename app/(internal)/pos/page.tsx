"use client";

import { useEffect, useState, useRef } from "react";
import { useLocale } from "@/lib/i18n/LocaleContext";
import { useSession } from "@/lib/context/SessionContext";
import {
  listItemsRequest,
  listCustomersRequest,
  createSalesInvoiceRequest,
  evaluatePromotionsRequest,
  verifyManagerPinRequest,
  getCurrentPosShiftRequest,
  openPosShiftRequest,
  closePosShiftRequest,
  type ItemResponse,
  type CustomerResponse,
  type PosShiftRecord,
} from "@/lib/api";
import {
  ShoppingCart,
  Grid,
  Table as TableIcon,
  Search,
  RotateCcw,
  PauseCircle,
  Info,
  Maximize2,
  Minimize2,
  Trash2,
  Plus,
  Minus,
  User,
  Truck,
  UserCheck,
  CheckCircle,
  AlertCircle,
  Tag,
  Lock,
  Sparkles,
  X,
  CreditCard,
  Banknote,
  Clock,
  ChevronRight,
} from "lucide-react";

function formatKD(amount: number) {
  return (amount || 0).toLocaleString("en-US", {
    minimumFractionDigits: 3,
    maximumFractionDigits: 3,
  });
}

interface CartItemLine {
  item: ItemResponse;
  quantity: number;
  unitPrice: number;
  originalUnitPrice: number;
  discountAmount: number;
  promotionId?: string;
  promotionName?: string;
}

export default function PosPage() {
  const { t } = useLocale();
  const { user, currentBranch } = useSession();

  // Mode & Tabs State
  const [activeTopTab, setActiveTopTab] = useState<"INVOICE" | "ORDER">("INVOICE");
  const [viewMode, setViewMode] = useState<"GRID" | "TABLE">("GRID");
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Data State
  const [items, setItems] = useState<ItemResponse[]>([]);
  const [customers, setCustomers] = useState<CustomerResponse[]>([]);
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>("");
  const [selectedSalesperson, setSelectedSalesperson] = useState<string>((user as any)?.fullName || user?.nameEn || "Default Staff");
  const [deliveryOption, setDeliveryOption] = useState<string>("STORE_PICKUP");

  // Loading & Messages
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Cart State
  const [cart, setCart] = useState<Record<string, CartItemLine>>({});
  const [paymentMethod, setPaymentMethod] = useState<"CASH" | "CARD" | "CREDIT" | "BANK_TRANSFER">("CASH");
  const [manualHeaderDiscount, setManualHeaderDiscount] = useState<number>(0);
  const [manualDiscountReason, setManualDiscountReason] = useState<string>("");

  // Last bill tracking
  const [lastBill, setLastBill] = useState<{
    invoiceNumber: string;
    total: number;
    paymentMethod: string;
    itemCount: number;
    totalQty: number;
  } | null>(null);

  // Search & Categories (Grid view)
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  // Live Popover Quick Search (Table view)
  const [tableSearchQuery, setTableSearchQuery] = useState("");
  const [isSearchPopoverOpen, setIsSearchPopoverOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Manager Override Modal State
  const [showManagerModal, setShowManagerModal] = useState(false);
  const [pendingDiscountAction, setPendingDiscountAction] = useState<(() => void) | null>(null);
  const [managerPasscode, setManagerPasscode] = useState("");
  const [managerError, setManagerError] = useState<string | null>(null);
  const [approvedManager, setApprovedManager] = useState<{ id: string; name: string } | null>(null);

  // POS Shift State (Shift Opening Float & Z-Report Closing)
  const [activeShift, setActiveShift] = useState<PosShiftRecord | null>(null);
  const [showOpenShiftModal, setShowOpenShiftModal] = useState(false);
  const [showCloseShiftModal, setShowCloseShiftModal] = useState(false);
  const [openingFloatInput, setOpeningFloatInput] = useState<number>(50.0);
  const [closingCashActualInput, setClosingCashActualInput] = useState<number>(0.0);
  const [closingNotes, setClosingNotes] = useState<string>("");

  async function checkActiveShift() {
    if (!user) return;
    try {
      const branchId = currentBranch?.id || "br-01";
      const shift = await getCurrentPosShiftRequest(user.id, branchId);
      setActiveShift(shift);
      if (!shift) {
        setShowOpenShiftModal(true);
      }
    } catch (e) {
      console.warn("Failed to check active shift", e);
    }
  }

  // Load Catalog & Customers
  async function loadData() {
    setIsLoading(true);
    setError(null);
    try {
      const [itemsData, custsData] = await Promise.all([
        listItemsRequest(),
        listCustomersRequest().catch(() => []),
      ]);
      setItems(itemsData);
      setCustomers(custsData);
      await checkActiveShift();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load products");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleOpenShift(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;
    try {
      const branchId = currentBranch?.id || "br-01";
      const shift = await openPosShiftRequest({
        userId: user.id,
        branchId,
        openingFloat: Number(openingFloatInput),
      });
      setActiveShift(shift);
      setShowOpenShiftModal(false);
      setSuccessMessage(`POS Shift ${shift.shiftNumber} Opened with Float KD ${Number(openingFloatInput).toFixed(3)}`);
      setTimeout(() => setSuccessMessage(null), 4000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to open POS Shift");
    }
  }

  async function handleCloseShift(e: React.FormEvent) {
    e.preventDefault();
    if (!activeShift) return;
    try {
      const closed = await closePosShiftRequest(activeShift.id, {
        closingCashActual: Number(closingCashActualInput),
        notes: closingNotes,
      });
      setActiveShift(null);
      setShowCloseShiftModal(false);
      setSuccessMessage(
        `Shift ${closed.shiftNumber} Closed! Z-Report: Cash Variance KD ${Number(closed.cashVariance).toFixed(3)}`
      );
      setTimeout(() => setSuccessMessage(null), 5000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to close POS Shift");
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  // Keyboard Shortcuts Listener
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "F1") {
        e.preventDefault();
        handleCharge();
      } else if (e.key === "F2") {
        e.preventDefault();
        setPaymentMethod("CREDIT");
      } else if (e.key === "F3") {
        e.preventDefault();
        setPaymentMethod("CARD");
      } else if (e.key === "F7") {
        e.preventDefault();
        handleHoldCart();
      } else if (e.key === "Escape") {
        setIsSearchPopoverOpen(false);
        setShowManagerModal(false);
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [cart, paymentMethod]);

  // Categories list
  const categories = ["ALL", ...Array.from(new Set(items.map((i) => i.category)))];

  // Grid filtered items
  const filteredGridItems = items.filter((i) => {
    if (selectedCategory !== "ALL" && i.category !== selectedCategory) return false;
    const q = searchQuery.trim().toLowerCase();
    if (!q) return true;
    return (
      i.name.toLowerCase().includes(q) ||
      i.sku.toLowerCase().includes(q) ||
      (i.barcode ?? "").toLowerCase().includes(q)
    );
  });

  // Table popover filtered items
  const popoverItems = items.filter((i) => {
    const q = tableSearchQuery.trim().toLowerCase();
    if (!q) return false;
    return (
      i.name.toLowerCase().includes(q) ||
      i.sku.toLowerCase().includes(q) ||
      (i.barcode ?? "").toLowerCase().includes(q)
    );
  });

  // Cart operations
  function addToCart(item: ItemResponse, customQty = 1) {
    const stock = Number(item.stockQuantity ?? 0);
    const existing = cart[item.id];
    const currentQty = existing ? existing.quantity : 0;
    const nextQty = currentQty + customQty;

    if (nextQty > stock && stock > 0) {
      setError(`Cannot add more than available stock (${stock} units)`);
      return;
    }

    const unitPrice = Number(item.price);
    const newCart = {
      ...cart,
      [item.id]: {
        item,
        quantity: nextQty,
        unitPrice,
        originalUnitPrice: unitPrice,
        discountAmount: 0,
      },
    };

    setCart(newCart);
    setError(null);
    setSuccessMessage(null);
    runPromotionEvaluation(newCart);
  }

  function updateCartQty(itemId: string, qty: number) {
    if (qty <= 0) {
      const next = { ...cart };
      delete next[itemId];
      setCart(next);
      runPromotionEvaluation(next);
      return;
    }
    const target = cart[itemId];
    if (!target) return;
    const stock = Number(target.item.stockQuantity ?? 0);
    if (qty > stock && stock > 0) {
      setError(`Cannot exceed available stock (${stock} units)`);
      return;
    }
    const updated = {
      ...cart,
      [itemId]: { ...target, quantity: qty },
    };
    setCart(updated);
    setError(null);
    runPromotionEvaluation(updated);
  }

  function handleLineDiscount(itemId: string, discountVal: number) {
    const line = cart[itemId];
    if (!line) return;

    const gross = line.quantity * line.originalUnitPrice;
    const percent = (discountVal / gross) * 100;

    // Check cashier default limit (10%)
    if (percent > 10 && !approvedManager) {
      setPendingDiscountAction(() => () => applyLineDiscountUnchecked(itemId, discountVal));
      setShowManagerModal(true);
      return;
    }

    applyLineDiscountUnchecked(itemId, discountVal);
  }

  function applyLineDiscountUnchecked(itemId: string, discountVal: number) {
    const line = cart[itemId];
    if (!line) return;
    const updated = {
      ...cart,
      [itemId]: {
        ...line,
        discountAmount: Number(discountVal.toFixed(3)),
      },
    };
    setCart(updated);
  }

  function handleHeaderDiscountChange(val: number) {
    const grossTotal = Object.values(cart).reduce(
      (sum, l) => sum + l.quantity * l.unitPrice - l.discountAmount,
      0
    );
    const percent = grossTotal > 0 ? (val / grossTotal) * 100 : 0;

    if (percent > 10 && !approvedManager) {
      setPendingDiscountAction(() => () => setManualHeaderDiscount(val));
      setShowManagerModal(true);
      return;
    }
    setManualHeaderDiscount(val);
  }

  async function verifyManagerPasscode() {
    setManagerError(null);
    try {
      const res = await verifyManagerPinRequest(managerPasscode);
      if (res.authorized) {
        setApprovedManager({ id: res.approvedByUserId, name: res.approvedByName });
        setShowManagerModal(false);
        setManagerPasscode("");
        if (pendingDiscountAction) {
          pendingDiscountAction();
          setPendingDiscountAction(null);
        }
      }
    } catch (err) {
      setManagerError("Invalid Manager PIN. Override denied.");
    }
  }

  async function runPromotionEvaluation(currentCart: Record<string, CartItemLine>) {
    const lines = Object.values(currentCart).map((l) => ({
      itemId: l.item.id,
      quantity: l.quantity,
      unitPrice: l.originalUnitPrice,
    }));

    if (lines.length === 0) return;

    const branchId = currentBranch?.id || "cfbb7132-6c84-442b-86a5-3a4d03b5e089";
    const evalRes = await evaluatePromotionsRequest({
      branchId,
      customerId: selectedCustomerId || undefined,
      lines,
    });

    if (evalRes.appliedPromotionsCount > 0) {
      const nextCart = { ...currentCart };
      Object.keys(nextCart).forEach((itemId) => {
        const lineDisc = evalRes.lineDiscounts[itemId];
        if (lineDisc) {
          nextCart[itemId] = {
            ...nextCart[itemId],
            discountAmount: lineDisc.discountAmount,
            promotionId: lineDisc.promotionId,
            promotionName: lineDisc.promotionName,
          };
        }
      });
      setCart(nextCart);
    }
  }

  function clearCart() {
    setCart({});
    setManualHeaderDiscount(0);
    setManualDiscountReason("");
    setApprovedManager(null);
    setError(null);
    setSuccessMessage(null);
  }

  function handleHoldCart() {
    if (Object.keys(cart).length === 0) return;
    localStorage.setItem("bin-essa-pos-held-cart", JSON.stringify(cart));
    setCart({});
    setSuccessMessage("Cart held safely. You can load it anytime.");
    setTimeout(() => setSuccessMessage(null), 3000);
  }

  function handleLoadHeldCart() {
    const saved = localStorage.getItem("bin-essa-pos-held-cart");
    if (saved) {
      try {
        setCart(JSON.parse(saved));
        localStorage.removeItem("bin-essa-pos-held-cart");
        setSuccessMessage("Held cart loaded into register.");
        setTimeout(() => setSuccessMessage(null), 3000);
      } catch (e) {
        setError("Failed to parse held cart");
      }
    } else {
      setError("No held cart found");
    }
  }

  // Financial Calculations
  const cartLinesList = Object.values(cart);
  const totalItemCount = cartLinesList.length;
  const totalQuantity = cartLinesList.reduce((sum, l) => sum + l.quantity, 0);
  const grossSubtotal = cartLinesList.reduce((sum, l) => sum + l.quantity * l.originalUnitPrice, 0);
  const lineDiscountsTotal = cartLinesList.reduce((sum, l) => sum + l.discountAmount, 0);
  const totalDiscount = lineDiscountsTotal + manualHeaderDiscount;
  const netSubtotal = grossSubtotal - lineDiscountsTotal;
  const taxAmount = 0.0;
  const totalPayable = Math.max(0, netSubtotal + taxAmount - manualHeaderDiscount);

  // Charge / Create Invoice
  async function handleCharge() {
    if (cartLinesList.length === 0) return;

    const branchId = user?.branchId || currentBranch?.id || "cfbb7132-6c84-442b-86a5-3a4d03b5e089";
    const userId = user?.id || "0f4c78ce-14cc-4d67-86f8-a12ddfea3ef7";
    const invoiceNumber = `INV${Date.now().toString().slice(-6)}`;

    setIsSubmitting(true);
    setError(null);
    try {
      await createSalesInvoiceRequest({
        invoiceNumber,
        branchId,
        userId,
        customerId: selectedCustomerId || undefined,
        paymentMethod,
        discountAmount: manualHeaderDiscount,
        manualDiscountReason: manualDiscountReason || undefined,
        approvedByUserId: approvedManager?.id,
        approvedByName: approvedManager?.name,
        lines: cartLinesList.map((l) => ({
          itemId: l.item.id,
          quantity: l.quantity,
          unitPrice: l.originalUnitPrice,
          originalUnitPrice: l.originalUnitPrice,
          discountAmount: l.discountAmount,
          promotionId: l.promotionId,
        })),
      });

      setLastBill({
        invoiceNumber,
        total: totalPayable,
        paymentMethod,
        itemCount: totalItemCount,
        totalQty: totalQuantity,
      });

      setSuccessMessage(`Sale Completed! Invoice #${invoiceNumber} posted.`);
      clearCart();
      await loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to process transaction");
    } finally {
      setIsSubmitting(false);
    }
  }

  function toggleFullscreen() {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
        setIsFullscreen(false);
      }
    }
  }

  return (
    <div className="flex flex-col h-screen bg-slate-100 overflow-hidden font-sans select-none">
      {/* ================= TOP NAVIGATION BAR (Matching Reference Designs) ================= */}
      <header className="bg-indigo-900 text-white px-4 py-2.5 flex items-center justify-between shadow-md z-30 shrink-0">
        {/* Left Branding & Tabs */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 font-black text-base tracking-wide">
            <div className="bg-indigo-500 p-1.5 rounded-lg text-white">
              <ShoppingCart className="w-5 h-5" />
            </div>
            <span>Bin Essa POS</span>
          </div>

          {/* Top Mode Tabs */}
          <div className="flex items-center bg-indigo-950/80 p-1 rounded-xl border border-indigo-700/50 text-xs">
            <button
              onClick={() => setActiveTopTab("INVOICE")}
              className={`px-3 py-1.5 rounded-lg font-bold transition flex items-center gap-1.5 ${
                activeTopTab === "INVOICE" ? "bg-indigo-600 text-white shadow-sm" : "text-indigo-200 hover:text-white"
              }`}
            >
              Sales Invoice
            </button>
            <button
              onClick={() => setActiveTopTab("ORDER")}
              className={`px-3 py-1.5 rounded-lg font-bold transition flex items-center gap-1.5 ${
                activeTopTab === "ORDER" ? "bg-indigo-600 text-white shadow-sm" : "text-indigo-200 hover:text-white"
              }`}
            >
              Sales Order
            </button>
          </div>
        </div>

        {/* Center Search Input (Global Barcode / Name) */}
        <div className="flex-1 max-w-md mx-6">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, SKU, or scan barcode..."
              className="w-full bg-indigo-950/60 border border-indigo-700/60 text-white placeholder-indigo-300/60 rounded-xl pl-9 pr-4 py-1.5 text-xs outline-none focus:border-indigo-400 focus:bg-indigo-950"
            />
          </div>
        </div>

        {/* Right Actions & View Switcher */}
        <div className="flex items-center gap-2 text-xs">
          {/* View Toggle */}
          <div className="flex items-center bg-indigo-950 p-1 rounded-xl border border-indigo-800">
            <button
              onClick={() => setViewMode("GRID")}
              title="Grid View (Image 1)"
              className={`p-1.5 rounded-lg transition ${
                viewMode === "GRID" ? "bg-indigo-600 text-white" : "text-indigo-300 hover:text-white"
              }`}
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode("TABLE")}
              title="Line-Item Table View (Image 2)"
              className={`p-1.5 rounded-lg transition ${
                viewMode === "TABLE" ? "bg-indigo-600 text-white" : "text-indigo-300 hover:text-white"
              }`}
            >
              <TableIcon className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={clearCart}
            className="px-2.5 py-1.5 bg-indigo-800/80 hover:bg-rose-600 text-indigo-100 hover:text-white rounded-xl transition font-semibold flex items-center gap-1"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Clear
          </button>

          <button
            onClick={handleHoldCart}
            className="px-2.5 py-1.5 bg-indigo-800/80 hover:bg-amber-600 text-indigo-100 hover:text-white rounded-xl transition font-semibold flex items-center gap-1"
          >
            <PauseCircle className="w-3.5 h-3.5" />
            Hold
          </button>

          <button
            onClick={handleLoadHeldCart}
            className="px-2.5 py-1.5 bg-indigo-800/80 hover:bg-indigo-700 text-indigo-100 rounded-xl transition font-semibold"
          >
            Load SO
          </button>

          <button
            onClick={toggleFullscreen}
            className="p-1.5 bg-indigo-800/80 hover:bg-indigo-700 text-indigo-100 rounded-xl transition"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </header>

      {/* Global Toast Alerts */}
      {error && (
        <div className="bg-rose-600 text-white text-xs px-4 py-2 flex items-center justify-between shrink-0 shadow-inner">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4" />
            <span className="font-semibold">{error}</span>
          </div>
          <button onClick={() => setError(null)} className="font-bold">✕</button>
        </div>
      )}

      {successMessage && (
        <div className="bg-emerald-600 text-white text-xs px-4 py-2 flex items-center justify-between shrink-0 shadow-inner">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4" />
            <span className="font-semibold">{successMessage}</span>
          </div>
          <button onClick={() => setSuccessMessage(null)} className="font-bold">✕</button>
        </div>
      )}

      {/* ================= MAIN CONTENT BODY ================= */}
      <div className="flex-1 flex overflow-hidden">
        {/* ================= VIEW 1: CATEGORY GRID VIEW (IMAGE 1) ================= */}
        {viewMode === "GRID" ? (
          <div className="flex-1 flex overflow-hidden">
            {/* Left Category Sidebar */}
            <div className="w-52 bg-white border-r border-slate-200 flex flex-col shrink-0">
              <div className="p-3 border-b border-slate-100 font-bold text-xs text-slate-500 uppercase tracking-wider">
                Categories
              </div>
              <div className="flex-1 overflow-y-auto p-2 space-y-1">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-semibold transition flex items-center justify-between ${
                      selectedCategory === cat
                        ? "bg-indigo-600 text-white shadow-sm"
                        : "text-slate-700 hover:bg-slate-100"
                    }`}
                  >
                    <span className="truncate">{cat === "ALL" ? "All Items" : cat}</span>
                    {selectedCategory === cat && <ChevronRight className="w-3.5 h-3.5 shrink-0" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Center Product Cards Grid */}
            <div className="flex-1 overflow-y-auto p-4 bg-slate-50">
              {isLoading ? (
                <div className="h-full flex items-center justify-center text-xs text-slate-400">
                  Loading product catalog...
                </div>
              ) : filteredGridItems.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-slate-400 space-y-2">
                  <Search className="w-8 h-8 text-slate-300" />
                  <p className="text-xs font-semibold">No products found</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3.5">
                  {filteredGridItems.map((item) => {
                    const stock = Number(item.stockQuantity ?? 0);
                    const isOutOfStock = stock <= 0;

                    return (
                      <button
                        key={item.id}
                        onClick={() => addToCart(item)}
                        disabled={isOutOfStock}
                        className={`bg-white rounded-2xl border p-3 text-left flex flex-col justify-between transition-all group relative ${
                          isOutOfStock
                            ? "opacity-60 border-slate-200 cursor-not-allowed"
                            : "border-slate-200 hover:border-indigo-500 hover:shadow-md active:scale-95"
                        }`}
                      >
                        {/* Status Badge */}
                        {isOutOfStock ? (
                          <span className="absolute top-2 right-2 bg-rose-100 text-rose-700 text-[9px] font-bold px-1.5 py-0.5 rounded-md">
                            Out of stock
                          </span>
                        ) : (
                          <span className="absolute top-2 right-2 bg-slate-100 text-slate-600 text-[9px] font-bold px-1.5 py-0.5 rounded-md">
                            Stock: {stock}
                          </span>
                        )}

                        {/* Card Image Placeholder / Icon */}
                        <div className="w-full h-24 bg-slate-100 rounded-xl mb-2 flex items-center justify-center overflow-hidden group-hover:bg-indigo-50 transition">
                          <Tag className="w-8 h-8 text-slate-300 group-hover:text-indigo-400 transition" />
                        </div>

                        {/* Title & Price */}
                        <div>
                          <div className="text-xs font-bold text-slate-800 line-clamp-2 leading-snug">
                            {item.name}
                          </div>
                          <div className="text-[10px] text-slate-400 mt-0.5">{item.sku}</div>
                          <div className="text-sm font-black text-indigo-700 mt-1">
                            KD {formatKD(Number(item.price))}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Right Cart Sidebar (Image 1 Right Panel) */}
            <div className="w-80 bg-white border-l border-slate-200 flex flex-col shrink-0">
              {/* Cart Header */}
              <div className="p-3.5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
                <span className="font-bold text-sm text-slate-900 flex items-center gap-2">
                  <ShoppingCart className="w-4 h-4 text-indigo-600" />
                  Cart
                </span>
                <span className="text-xs bg-indigo-100 text-indigo-800 font-bold px-2 py-0.5 rounded-full">
                  {totalItemCount} items
                </span>
              </div>

              {/* Cart Lines or Empty State */}
              <div className="flex-1 overflow-y-auto p-3 space-y-2">
                {cartLinesList.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center p-6 text-center space-y-3">
                    <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center text-slate-400">
                      <ShoppingCart className="w-8 h-8" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-700">Yet to add items to the cart!</p>
                      <p className="text-xs text-slate-400 mt-1">
                        Tap or scan items to add them to your cart.
                      </p>
                    </div>
                  </div>
                ) : (
                  cartLinesList.map((line) => (
                    <div
                      key={line.item.id}
                      className="bg-slate-50 rounded-xl p-2.5 border border-slate-200 space-y-2"
                    >
                      <div className="flex items-start justify-between">
                        <div className="pr-2">
                          <div className="text-xs font-bold text-slate-900 leading-tight">
                            {line.item.name}
                          </div>
                          <div className="text-[10px] text-slate-400">{line.item.sku}</div>
                        </div>
                        <button
                          onClick={() => updateCartQty(line.item.id, 0)}
                          className="text-slate-300 hover:text-rose-600 p-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Promo Badge */}
                      {line.promotionName && (
                        <div className="bg-purple-100 text-purple-800 text-[10px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1">
                          <Sparkles className="w-3 h-3" />
                          {line.promotionName} (-KD {formatKD(line.discountAmount)})
                        </div>
                      )}

                      {/* Price & Quantity Controls */}
                      <div className="flex items-center justify-between pt-1">
                        <div className="text-xs font-black text-slate-900">
                          KD {formatKD(line.quantity * line.originalUnitPrice - line.discountAmount)}
                        </div>

                        <div className="flex items-center border border-slate-300 rounded-lg bg-white overflow-hidden">
                          <button
                            onClick={() => updateCartQty(line.item.id, line.quantity - 1)}
                            className="px-2 py-1 text-slate-600 hover:bg-slate-100"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="px-2.5 py-1 text-xs font-bold text-slate-900">
                            {line.quantity}
                          </span>
                          <button
                            onClick={() => updateCartQty(line.item.id, line.quantity + 1)}
                            className="px-2 py-1 text-slate-600 hover:bg-slate-100"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Last Bill Bar */}
              {lastBill && (
                <div className="bg-indigo-50 border-t border-indigo-100 px-3 py-2 text-[11px] text-indigo-900 flex items-center justify-between">
                  <span>
                    Last Bill: <strong>#{lastBill.invoiceNumber}</strong>
                  </span>
                  <span className="font-bold">KD {formatKD(lastBill.total)}</span>
                </div>
              )}

              {/* Summary & Footer Action Buttons (Matching Image 1) */}
              <div className="p-3.5 border-t border-slate-200 bg-slate-50 space-y-3">
                <div className="flex items-center justify-between text-xs text-slate-600">
                  <span>Total (Items: {totalItemCount}, Quantity: {totalQuantity})</span>
                  <span className="text-base font-black text-slate-900">
                    KD {formatKD(totalPayable)}
                  </span>
                </div>

                {/* Primary Charge Button */}
                <button
                  onClick={handleCharge}
                  disabled={isSubmitting || cartLinesList.length === 0}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white font-bold text-sm py-3 rounded-xl shadow-md transition flex items-center justify-center gap-2"
                >
                  {isSubmitting ? "Processing Sale..." : `Cart [F1] • KD ${formatKD(totalPayable)}`}
                </button>

                {/* Payment Shortcuts */}
                <div className="grid grid-cols-3 gap-1.5 text-xs">
                  <button
                    onClick={() => {
                      setPaymentMethod("CREDIT");
                      handleCharge();
                    }}
                    className="bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 py-2 rounded-lg font-bold"
                  >
                    Credit [F2]
                  </button>
                  <button
                    onClick={() => {
                      setPaymentMethod("CARD");
                      handleCharge();
                    }}
                    className="bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 py-2 rounded-lg font-bold"
                  >
                    UPI/Card [F3]
                  </button>
                  <button
                    onClick={() => setPaymentMethod("CASH")}
                    className="bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 py-2 rounded-lg font-bold"
                  >
                    More... [F12]
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* ================= VIEW 2: LINE-ITEM TABLE VIEW (IMAGE 2 & 3) ================= */
          <div className="flex-1 flex overflow-hidden">
            {/* Left 2/3: Line-Items Data Table */}
            <div className="flex-1 flex flex-col bg-white border-r border-slate-200 overflow-hidden">
              <div className="flex-1 overflow-y-auto relative">
                <table className="w-full text-left text-xs border-collapse">
                  <thead className="bg-slate-100 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider sticky top-0 z-10">
                    <tr>
                      <th className="px-4 py-3 w-12 text-center">S.NO</th>
                      <th className="px-4 py-3">NAME</th>
                      <th className="px-4 py-3 text-right w-28">RATE (KD)</th>
                      <th className="px-4 py-3 text-center w-24">QTY</th>
                      <th className="px-4 py-3 text-right w-28">DISCOUNT (KD)</th>
                      <th className="px-4 py-3 text-right w-32">AMOUNT (KD)</th>
                      <th className="px-4 py-3 w-10"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium">
                    {cartLinesList.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="px-4 py-12 text-center text-slate-400">
                          Scan barcode or type item name below to start sale.
                        </td>
                      </tr>
                    ) : (
                      cartLinesList.map((line, idx) => (
                        <tr key={line.item.id} className="hover:bg-slate-50">
                          <td className="px-4 py-3 text-center font-bold text-slate-400">{idx + 1}</td>
                          <td className="px-4 py-3">
                            <div className="font-bold text-slate-900">{line.item.name}</div>
                            <div className="text-[10px] text-slate-400">
                              SKU: {line.item.sku} {line.promotionName && `• Promo: ${line.promotionName}`}
                            </div>
                          </td>
                          <td className="px-4 py-3 text-right font-semibold text-slate-800">
                            {formatKD(line.originalUnitPrice)}
                          </td>
                          <td className="px-4 py-3 text-center">
                            <input
                              type="number"
                              min="1"
                              value={line.quantity}
                              onChange={(e) =>
                                updateCartQty(line.item.id, parseInt(e.target.value, 10) || 1)
                              }
                              className="w-16 text-center border border-slate-300 rounded-lg py-1 font-bold outline-none focus:border-indigo-600"
                            />
                          </td>
                          <td className="px-4 py-3 text-right">
                            <input
                              type="number"
                              step="0.001"
                              min="0"
                              value={line.discountAmount}
                              onChange={(e) =>
                                handleLineDiscount(line.item.id, parseFloat(e.target.value) || 0)
                              }
                              className="w-20 text-right border border-slate-300 rounded-lg py-1 px-1.5 font-bold outline-none focus:border-indigo-600"
                            />
                          </td>
                          <td className="px-4 py-3 text-right font-black text-indigo-700">
                            {formatKD(line.quantity * line.originalUnitPrice - line.discountAmount)}
                          </td>
                          <td className="px-4 py-3 text-center">
                            <button
                              onClick={() => updateCartQty(line.item.id, 0)}
                              className="text-slate-300 hover:text-rose-600"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>

                {/* FAST ITEM ENTRY ROW & POPOVER (IMAGE 3 MATCH) */}
                <div className="p-3 border-t border-slate-200 bg-slate-50 relative">
                  <div className="relative">
                    <input
                      ref={searchInputRef}
                      type="text"
                      value={tableSearchQuery}
                      onChange={(e) => {
                        setTableSearchQuery(e.target.value);
                        setIsSearchPopoverOpen(e.target.value.trim().length > 0);
                      }}
                      onFocus={() => {
                        if (tableSearchQuery.trim().length > 0) setIsSearchPopoverOpen(true);
                      }}
                      placeholder="Type here or scan an item to add..."
                      className="w-full bg-white border border-indigo-300 rounded-xl px-4 py-2.5 text-xs text-slate-900 font-semibold outline-none focus:border-indigo-600 shadow-sm"
                    />

                    {/* IMAGE 3 QUICK SEARCH POPOVER MODAL */}
                    {isSearchPopoverOpen && popoverItems.length > 0 && (
                      <div className="absolute left-0 bottom-12 w-full bg-white rounded-2xl border border-slate-200 shadow-2xl z-40 overflow-hidden max-h-80 overflow-y-auto">
                        <table className="w-full text-left text-xs">
                          <thead className="bg-slate-100 text-slate-500 font-bold uppercase tracking-wider sticky top-0 border-b border-slate-200">
                            <tr>
                              <th className="px-4 py-2">NAME</th>
                              <th className="px-4 py-2">SKU</th>
                              <th className="px-4 py-2">BARCODE</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100">
                            {popoverItems.map((item) => (
                              <tr
                                key={item.id}
                                onClick={() => {
                                  addToCart(item);
                                  setTableSearchQuery("");
                                  setIsSearchPopoverOpen(false);
                                }}
                                className="hover:bg-indigo-50 cursor-pointer transition"
                              >
                                <td className="px-4 py-2.5">
                                  <div className="font-bold text-indigo-900">{item.name}</div>
                                  <div className="text-[10px] text-slate-500">
                                    Stock: {item.stockQuantity} | Selling Price: KD {formatKD(Number(item.price))}
                                  </div>
                                </td>
                                <td className="px-4 py-2.5 text-slate-600 font-medium">{item.sku}</td>
                                <td className="px-4 py-2.5 text-slate-400 font-mono">{item.barcode || "N/A"}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Table Bottom Action Toolbar */}
              <div className="p-3 border-t border-slate-200 bg-slate-100 flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                  <button
                    onClick={clearCart}
                    className="text-slate-600 hover:text-rose-600 font-semibold flex items-center gap-1"
                  >
                    Clear Cart
                  </button>
                  <button
                    onClick={handleHoldCart}
                    className="text-slate-600 hover:text-amber-600 font-semibold flex items-center gap-1"
                  >
                    Hold Cart (F7)
                  </button>
                  <button
                    onClick={handleLoadHeldCart}
                    className="text-slate-600 hover:text-indigo-600 font-semibold flex items-center gap-1"
                  >
                    Load SO
                  </button>
                </div>

                <div className="text-slate-500 text-[11px]">
                  Press <strong>F1</strong> to Charge • <strong>ESC</strong> to Cancel
                </div>
              </div>
            </div>

            {/* Right 1/3: Summary & Customer Sidebar (Image 2 Right Side) */}
            <div className="w-96 bg-slate-50 border-l border-slate-200 flex flex-col shrink-0 p-4 space-y-4 overflow-y-auto">
              {/* Customer Selector */}
              <div className="bg-white rounded-2xl p-3.5 border border-slate-200 space-y-2 shadow-sm">
                <label className="block text-xs font-bold text-slate-700 flex items-center gap-2">
                  <User className="w-4 h-4 text-indigo-600" />
                  Customer
                </label>
                <select
                  value={selectedCustomerId}
                  onChange={(e) => setSelectedCustomerId(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 outline-none focus:border-indigo-600"
                >
                  <option value="">Walk-in Customer (Retail Cash)</option>
                  {customers.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.code})
                    </option>
                  ))}
                </select>
              </div>

              {/* Delivery Options */}
              <div className="bg-white rounded-2xl p-3.5 border border-slate-200 space-y-2 shadow-sm">
                <label className="block text-xs font-bold text-slate-700 flex items-center gap-2">
                  <Truck className="w-4 h-4 text-indigo-600" />
                  Delivery Options
                </label>
                <select
                  value={deliveryOption}
                  onChange={(e) => setDeliveryOption(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 outline-none focus:border-indigo-600"
                >
                  <option value="STORE_PICKUP">Store Counter Pickup</option>
                  <option value="EXPRESS_DELIVERY">Express Home Delivery</option>
                </select>
              </div>

              {/* Salesperson Selector */}
              <div className="bg-white rounded-2xl p-3.5 border border-slate-200 space-y-2 shadow-sm">
                <label className="block text-xs font-bold text-slate-700 flex items-center gap-2">
                  <UserCheck className="w-4 h-4 text-indigo-600" />
                  Salesperson
                </label>
                <input
                  type="text"
                  value={selectedSalesperson}
                  onChange={(e) => setSelectedSalesperson(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 outline-none focus:border-indigo-600"
                />
              </div>

              {/* Sales Summary Card */}
              <div className="bg-white rounded-2xl p-4 border border-slate-200 space-y-3 shadow-sm flex-1 flex flex-col justify-between">
                <div className="space-y-2.5 text-xs text-slate-600 border-b border-slate-100 pb-3">
                  <h3 className="font-bold text-slate-900 text-sm">Sales Summary</h3>

                  <div className="flex justify-between">
                    <span>Sub Total:</span>
                    <span className="font-semibold text-slate-800">KD {formatKD(grossSubtotal)}</span>
                  </div>

                  <div className="flex justify-between">
                    <span>Tax:</span>
                    <span className="font-semibold text-slate-800">KD {formatKD(taxAmount)}</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span>Header Discount:</span>
                    <input
                      type="number"
                      step="0.001"
                      min="0"
                      value={manualHeaderDiscount}
                      onChange={(e) => handleHeaderDiscountChange(parseFloat(e.target.value) || 0)}
                      className="w-24 text-right border border-slate-300 rounded-lg px-2 py-0.5 text-xs font-bold text-rose-600 outline-none focus:border-indigo-600"
                    />
                  </div>

                  {manualHeaderDiscount > 0 && (
                    <input
                      type="text"
                      placeholder="Discount Reason..."
                      value={manualDiscountReason}
                      onChange={(e) => setManualDiscountReason(e.target.value)}
                      className="w-full border border-slate-200 rounded-lg px-2 py-1 text-[11px] outline-none"
                    />
                  )}

                  {approvedManager && (
                    <div className="bg-emerald-50 text-emerald-800 text-[10px] font-bold px-2 py-1 rounded-md flex items-center gap-1">
                      <Lock className="w-3 h-3 text-emerald-600" />
                      Override Approved by {approvedManager.name}
                    </div>
                  )}
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-baseline">
                    <span className="text-xs font-bold text-slate-700">
                      Total ({totalItemCount} Items, Qty: {totalQuantity})
                    </span>
                    <span className="text-xl font-black text-indigo-700">
                      KD {formatKD(totalPayable)}
                    </span>
                  </div>

                  {/* Payment Methods Breakdown */}
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => {
                        setPaymentMethod("CREDIT");
                        handleCharge();
                      }}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 rounded-xl font-bold text-xs transition shadow-sm"
                    >
                      Credit Sale
                    </button>
                    <button
                      onClick={() => {
                        setPaymentMethod("CASH");
                        handleCharge();
                      }}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white py-2.5 rounded-xl font-bold text-xs transition shadow-sm"
                    >
                      Cash
                    </button>
                    <button
                      onClick={() => {
                        setPaymentMethod("CARD");
                        handleCharge();
                      }}
                      className="bg-slate-800 hover:bg-slate-900 text-white py-2.5 rounded-xl font-bold text-xs transition shadow-sm"
                    >
                      Credit Card
                    </button>
                    <button
                      onClick={() => {
                        setPaymentMethod("BANK_TRANSFER");
                        handleCharge();
                      }}
                      className="bg-slate-200 hover:bg-slate-300 text-slate-800 py-2.5 rounded-xl font-bold text-xs transition"
                    >
                      More...
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ================= MANAGER OVERRIDE PIN MODAL ================= */}
      {showManagerModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 space-y-4 shadow-2xl border border-slate-100">
            <div className="text-center space-y-2">
              <div className="w-12 h-12 bg-amber-100 text-amber-700 rounded-full flex items-center justify-center mx-auto">
                <Lock className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Manager Authorization Required</h3>
              <p className="text-xs text-slate-500">
                Discount exceeds allowed cashier limit (10%). Please enter Manager Passcode to authorize.
              </p>
            </div>

            {managerError && (
              <div className="bg-rose-50 text-rose-700 text-xs px-3 py-2 rounded-xl text-center font-semibold">
                {managerError}
              </div>
            )}

            <div>
              <input
                type="password"
                placeholder="Enter Manager PIN / Passcode..."
                value={managerPasscode}
                onChange={(e) => setManagerPasscode(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") verifyManagerPasscode();
                }}
                autoFocus
                className="w-full text-center tracking-widest text-lg font-bold border border-slate-300 rounded-xl px-4 py-2.5 outline-none focus:border-indigo-600"
              />
              <div className="text-[10px] text-slate-400 text-center mt-1">Default PIN: 9999 or admin123</div>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={() => {
                  setShowManagerModal(false);
                  setPendingDiscountAction(null);
                }}
                className="w-1/2 py-2.5 rounded-xl border border-slate-300 text-slate-600 text-xs font-bold hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={verifyManagerPasscode}
                className="w-1/2 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md"
              >
                Authorize
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= SHIFT OPENING FLOAT MODAL ================= */}
      {showOpenShiftModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-5 shadow-2xl border border-slate-100 text-slate-800">
            <div className="text-center space-y-1.5 border-b border-slate-100 pb-4">
              <div className="w-12 h-12 rounded-2xl bg-indigo-100 text-indigo-600 flex items-center justify-center mx-auto mb-2">
                <ShoppingCart className="w-6 h-6" />
              </div>
              <h2 className="text-lg font-black text-slate-900">Open POS Cashier Shift</h2>
              <p className="text-xs text-slate-500">Enter the starting cash drawer float to begin sales session</p>
            </div>

            <form onSubmit={handleOpenShift} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Opening Cash Float (KWD)</label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.001"
                    required
                    value={openingFloatInput}
                    onChange={(e) => setOpeningFloatInput(parseFloat(e.target.value))}
                    className="w-full text-center font-mono font-bold text-xl rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-indigo-600 bg-slate-50"
                  />
                  <span className="absolute right-4 top-3.5 font-bold text-xs text-slate-400">KD</span>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-md text-xs transition"
              >
                Start POS Register Shift
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ================= SHIFT CLOSING Z-REPORT MODAL ================= */}
      {showCloseShiftModal && activeShift && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-5 shadow-2xl border border-slate-100 text-slate-800">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h2 className="text-lg font-black text-slate-900">Close Shift — Z-Report Summary</h2>
                <p className="text-xs text-slate-500">{activeShift.shiftNumber} | Opened at {new Date(activeShift.openedAt).toLocaleTimeString()}</p>
              </div>
              <button onClick={() => setShowCloseShiftModal(false)} className="text-slate-400 hover:text-slate-600 font-bold">
                ✕
              </button>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-xs space-y-2">
              <div className="flex justify-between text-slate-600">
                <span>Opening Cash Float:</span>
                <span className="font-bold font-mono text-slate-900">{Number(activeShift.openingFloat).toFixed(3)} KD</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Cash Sales Total:</span>
                <span className="font-bold font-mono text-slate-900">{Number(activeShift.cashSalesTotal).toFixed(3)} KD</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Card / K-Net Sales Total:</span>
                <span className="font-bold font-mono text-slate-900">{Number(activeShift.cardSalesTotal).toFixed(3)} KD</span>
              </div>
              <div className="border-t border-slate-200 pt-2 flex justify-between font-bold text-slate-900">
                <span>Expected Cash Drawer Balance:</span>
                <span className="font-mono text-indigo-700 text-sm">
                  {(Number(activeShift.openingFloat) + Number(activeShift.cashSalesTotal)).toFixed(3)} KD
                </span>
              </div>
            </div>

            <form onSubmit={handleCloseShift} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Actual Physical Cash Count (KWD)</label>
                <input
                  type="number"
                  step="0.001"
                  required
                  placeholder="Counted cash in drawer..."
                  value={closingCashActualInput}
                  onChange={(e) => setClosingCashActualInput(parseFloat(e.target.value))}
                  className="w-full text-center font-mono font-bold text-lg rounded-xl border border-slate-300 px-4 py-2.5 outline-none focus:border-indigo-600"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Shift Notes & Observations</label>
                <input
                  type="text"
                  placeholder="e.g. Cash drawer balanced cleanly..."
                  value={closingNotes}
                  onChange={(e) => setClosingNotes(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 px-3 py-2 outline-none focus:border-indigo-600"
                />
              </div>

              <div className="pt-2 flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setShowCloseShiftModal(false)}
                  className="w-1/2 py-2.5 rounded-xl border border-slate-300 text-slate-600 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow-md"
                >
                  Finalize & Close Shift
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
