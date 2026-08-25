"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { useLocale } from "@/lib/i18n/LocaleContext";
import { useSession } from "@/lib/context/SessionContext";
import { customers as initialCustomers } from "@/lib/mock-data/customers";
import { branches } from "@/lib/mock-data/branches";
import { salespersons, type Salesperson } from "@/lib/mock-data/salespersons";
import { INITIAL_STOCK_REQUESTS, type StockRequestRecord } from "@/lib/mock-data/stock-transfers";
import { isItemVisibleToBrand } from "@/lib/utils/visibility";
import type { Item, Customer, ItemCategory } from "@/lib/types";
import {
  createSalesInvoiceRequest,
  getCurrentPosShiftRequest,
  openPosShiftRequest,
  closePosShiftRequest,
  reopenPosShiftRequest,
  adjustPosShiftRequest,
  listItemsRequest,
  listCustomersRequest,
  type PosShiftRecord,
} from "@/lib/api";
import {
  getPersistentItemsCatalog,
  deductBranchStock,
} from "@/lib/utils/pos-stock";
import {
  formatKuwaitDateTime,
  formatKuwaitTime,
} from "@/lib/utils/kuwait-time";

import { PosTopbar, type PosMode, type PosViewMode } from "@/components/pos/PosTopbar";
import { PosSidebar } from "@/components/pos/PosSidebar";
import { PosProductGrid } from "@/components/pos/PosProductGrid";
import {
  PosCartPanel,
  type CartItemLine,
  type PosInvoiceType,
  type PosPaymentMethod,
  type PosFulfillmentMode,
} from "@/components/pos/PosCartPanel";
import { PosStatusBar } from "@/components/pos/PosStatusBar";
import {
  PosReceiptModal,
  PosHeldSalesModal,
  PosBarcodeModal,
  PosCustomerModal,
  PosSalespersonModal,
  PosAddGiftModal,
  PosStockRequestsModal,
  PosCurrentShiftModal,
  PosDailyClosingModal,
  PosStockLookupModal,
  type CompletedSaleRecord,
  type HeldSaleRecord,
} from "@/components/pos/PosModals";

export default function BranchPosPage() {
  const { locale, t } = useLocale();
  const {
    user,
    isHeadOffice,
    currentBrand,
    currentBranch,
    branchesForCurrentBrand,
  } = useSession();

  // 1. Live Persistent Inventory State
  const [itemsCatalog, setItemsCatalog] = useState<Item[]>(() => getPersistentItemsCatalog());
  const [customersList, setCustomersList] = useState<Customer[]>(initialCustomers);
  const [salespersonsList] = useState<Salesperson[]>(salespersons);

  // Sync inventory and customers whenever page regains focus or visibility, or branch changes
  useEffect(() => {
    async function syncCatalog() {
      try {
        const branchId = currentBranch ? currentBranch.id : undefined;
        const [_, custs] = await Promise.all([
          listItemsRequest(branchId),
          listCustomersRequest(branchId).catch(() => []),
        ]);
        setItemsCatalog(getPersistentItemsCatalog());
        if (custs && custs.length > 0) {
          setCustomersList((prev) => {
            const map = new Map<string, Customer>();
            prev.forEach((c) => map.set(c.id, c));
            custs.forEach((c) =>
              map.set(c.id, {
                id: c.id,
                nameEn: c.name,
                nameAr: c.name,
                phone: c.phone || "",
                email: c.email,
                customerType: (c.customerGroup as any) || "individual",
                balance: Number(c.currentBalance || 0),
                creditLimit: Number(c.creditLimit || 0),
                loyaltyPoints: c.loyaltyPoints || 0,
              })
            );
            return Array.from(map.values());
          });
        }
      } catch (err) {
        setItemsCatalog(getPersistentItemsCatalog());
      }
    }
    syncCatalog();
    window.addEventListener("focus", syncCatalog);
    document.addEventListener("visibilitychange", syncCatalog);
    return () => {
      window.removeEventListener("focus", syncCatalog);
      document.removeEventListener("visibilitychange", syncCatalog);
    };
  }, [currentBranch]);

  const activeBranch = useMemo(() => {
    return (
      currentBranch ??
      branches.find((b) => b.id === "br-01") ??
      branches[0]
    );
  }, [currentBranch]);

  // 2. Live POS Shift State
  const [currentShift, setCurrentShift] = useState<PosShiftRecord | null>(null);
  const [shiftLoading, setShiftLoading] = useState(true);

  // Live Register Metrics
  const [todaySalesKd, setTodaySalesKd] = useState<number>(0);
  const [returnsKd, setReturnsKd] = useState<number>(0);
  const [discountsKd, setDiscountsKd] = useState<number>(0);
  const [giftItemsCount, setGiftItemsCount] = useState<number>(0);
  const [giftItemsKd, setGiftItemsKd] = useState<number>(0);
  const [transactionsCount, setTransactionsCount] = useState<number>(0);
  const [cashInHandKd, setCashInHandKd] = useState<number>(0);
  const [salesByMethod, setSalesByMethod] = useState<Record<PosPaymentMethod, number>>({
    cash: 0,
    knet: 0,
    hesabi: 0,
    tabby: 0,
    credit: 0,
    card: 0,
  });

  // Load Active Shift on Mount or Branch/User Change
  const loadShift = useCallback(async () => {
    if (!user || !activeBranch) return;
    setShiftLoading(true);
    try {
      const shift = await getCurrentPosShiftRequest(user.id, activeBranch.id);
      if (shift && shift.status === "OPEN") {
        setCurrentShift(shift);
        const openFloat = Number(shift.openingFloat) || 0;
        const cashSales = Number(shift.cashSalesTotal) || 0;
        const knetSales = Number(shift.knetSalesTotal) || 0;
        const hesabiSales = Number(shift.hesabiSalesTotal) || 0;
        const tabbySales = Number(shift.tabbySalesTotal) || 0;
        const cardSales = Number(shift.cardSalesTotal) || 0;
        const creditSales = Number(shift.creditSalesTotal) || 0;
        const retTotal = Number(shift.returnsTotal) || 0;
        const discTotal = Number(shift.discountsTotal) || 0;
        const giftsCnt = Number(shift.giftsCount) || 0;
        const giftsTot = Number(shift.giftsTotal) || 0;
        const totalSales = Number(shift.totalSales) || (cashSales + knetSales + hesabiSales + tabbySales + cardSales + creditSales);

        setTodaySalesKd(totalSales);
        setReturnsKd(retTotal);
        setDiscountsKd(discTotal);
        setGiftItemsCount(giftsCnt);
        setGiftItemsKd(giftsTot);
        setCashInHandKd(openFloat + cashSales - retTotal);
        setSalesByMethod({
          cash: cashSales,
          knet: knetSales,
          hesabi: hesabiSales,
          tabby: tabbySales,
          credit: creditSales,
          card: cardSales,
        });
      } else {
        setCurrentShift(null);
      }
    } catch {
      setCurrentShift(null);
    } finally {
      setShiftLoading(false);
    }
  }, [user, activeBranch]);

  useEffect(() => {
    loadShift();
  }, [loadShift]);

  // 3. Navigation, Search, Filter & View Mode
  const [mode, setMode] = useState<PosMode>("invoice");
  const [viewMode, setViewMode] = useState<PosViewMode>("grid");
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [selectedBrand, setSelectedBrand] = useState("all");

  // 4. Cart & Transaction State
  const [cartLines, setCartLines] = useState<CartItemLine[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [selectedSalesperson, setSelectedSalesperson] = useState<Salesperson | null>(salespersons[0]);
  const [fulfillmentMode, setFulfillmentMode] = useState<PosFulfillmentMode>("pickup");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [invoiceType, setInvoiceType] = useState<PosInvoiceType>("cash");
  const [paymentMethod, setPaymentMethod] = useState<PosPaymentMethod>("cash");
  const [discountPct, setDiscountPct] = useState(0);
  const [cashReceived, setCashReceived] = useState(0);
  const [orderNote, setOrderNote] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  // 5. Modals State
  const [isReceiptOpen, setIsReceiptOpen] = useState(false);
  const [completedSale, setCompletedSale] = useState<CompletedSaleRecord | null>(null);
  const [isHeldModalOpen, setIsHeldModalOpen] = useState(false);
  const [heldSales, setHeldSales] = useState<HeldSaleRecord[]>([]);
  const [isBarcodeModalOpen, setIsBarcodeModalOpen] = useState(false);
  const [isCustomerModalOpen, setIsCustomerModalOpen] = useState(false);
  const [isSalespersonModalOpen, setIsSalespersonModalOpen] = useState(false);
  const [isGiftModalOpen, setIsGiftModalOpen] = useState(false);
  const [isStockRequestsModalOpen, setIsStockRequestsModalOpen] = useState(false);
  const [isShiftModalOpen, setIsShiftModalOpen] = useState(false);
  const [isDailyClosingModalOpen, setIsDailyClosingModalOpen] = useState(false);
  const [isStockLookupModalOpen, setIsStockLookupModalOpen] = useState(false);

  // Stock Requests Data
  const [stockRequests, setStockRequests] = useState<StockRequestRecord[]>(INITIAL_STOCK_REQUESTS);

  // Branch Stock helper
  const getStock = useCallback(
    (item: Item): number => {
      if (!activeBranch) return 0;
      return item.stockByBranch[activeBranch.id] ?? 0;
    },
    [activeBranch]
  );

  // Filtered Items
  const filteredItems = useMemo(() => {
    return itemsCatalog.filter((item) => {
      // 0. POS Visibility & Active status check
      if (item.posVisibility === false || item.isActive === false) {
        return false;
      }
      // 1. Brand visibility
      if (selectedBrand !== "all" && !isItemVisibleToBrand(item, selectedBrand as any)) {
        return false;
      }
      // 2. Category filter
      if (activeCategory !== "all" && item.category !== activeCategory) {
        return false;
      }
      // 3. Search query
      if (query.trim()) {
        const q = query.toLowerCase().trim();
        const matchesNameEn = item.nameEn?.toLowerCase().includes(q) ?? false;
        const matchesNameAr = item.nameAr?.includes(q) ?? false;
        const matchesSku = item.sku?.toLowerCase().includes(q) ?? false;
        const matchesBarcode = item.barcode?.toLowerCase().includes(q) ?? false;
        if (!matchesNameEn && !matchesNameAr && !matchesSku && !matchesBarcode) {
          return false;
        }
      }
      return true;
    });
  }, [itemsCatalog, selectedBrand, activeCategory, query]);

  // Categories with live product counts (active POS items only)
  const categoriesList = useMemo(() => {
    const posActiveCatalog = itemsCatalog.filter((i) => i.posVisibility !== false && i.isActive !== false);
    const counts: Record<string, number> = { all: posActiveCatalog.length };
    posActiveCatalog.forEach((item) => {
      counts[item.category] = (counts[item.category] || 0) + 1;
    });

    return [
      { id: "all", label: locale === "ar" ? "جميع الأصناف" : "All Items", count: counts.all ?? 0 },
      { id: "disposable_vapes", label: locale === "ar" ? "سحبات جاهزة (فيب)" : "Disposable Vapes", count: counts.disposable_vapes ?? 0 },
      { id: "pod_systems", label: locale === "ar" ? "أجهزة بود ونكهات" : "Pod Systems & Liquids", count: counts.pod_systems ?? 0 },
      { id: "nicotine_pouches", label: locale === "ar" ? "أكياس النيكوتين (سيبيريا/فوكس)" : "Nicotine Pouches", count: counts.nicotine_pouches ?? 0 },
      { id: "dokha_medwakh", label: locale === "ar" ? "دوخة ومدواخ" : "Dokha & Medwakh", count: counts.dokha_medwakh ?? 0 },
      { id: "cigarette_lighters", label: locale === "ar" ? "ولاعات (كريكيت/فويغو)" : "Cigarette Lighters", count: counts.cigarette_lighters ?? 0 },
      { id: "rolling_papers", label: locale === "ar" ? "ورق لف ومخاريط (RAW)" : "Rolling Papers & Cones", count: counts.rolling_papers ?? 0 },
      { id: "rolling_tobacco_hbt", label: locale === "ar" ? "تبغ لف السجائر (HBT)" : "Rolling Tobacco (HBT)", count: counts.rolling_tobacco_hbt ?? 0 },
      { id: "pipe_accessories", label: locale === "ar" ? "مستلزمات الغليون (بايب)" : "Pipe Accessories", count: counts.pipe_accessories ?? 0 },
      { id: "general_smoking_accessories", label: locale === "ar" ? "مستلزمات تدخين وفحم كراون" : "Charcoal & Accessories", count: counts.general_smoking_accessories ?? 0 },
      { id: "marine_outdoor", label: locale === "ar" ? "بن عيسى الخيران (بحري)" : "Khiran Marine & Outdoor", count: counts.marine_outdoor ?? 0 },
      { id: "custom_gifts_signage", label: locale === "ar" ? "جي إم آرت زون (هدايا/أكريليك)" : "JM Art Zone Gifts", count: counts.custom_gifts_signage ?? 0 },
    ];
  }, [itemsCatalog, locale]);

  // Cart Quantities map
  const cartQuantities = useMemo(() => {
    const map: Record<string, number> = {};
    cartLines.forEach((l) => {
      map[l.item.id] = (map[l.item.id] || 0) + l.qty;
    });
    return map;
  }, [cartLines]);

  // Financial Calculations
  const deliveryFee = fulfillmentMode === "delivery" ? 1.0 : 0.0;

  const subtotal = useMemo(() => {
    return cartLines.reduce((sum, line) => {
      const price = line.isGift ? 0 : line.item.sellPriceKd;
      return sum + price * line.qty;
    }, 0);
  }, [cartLines]);

  // Enforces allowDiscount and maxDiscountPercent per item in POS!
  const invoiceDiscountAmount = useMemo(() => {
    if (discountPct <= 0) return 0;
    const totalDiscount = cartLines.reduce((sum, line) => {
      if (line.isGift) return sum;
      if (line.item.allowDiscount === false || line.item.blockDiscount === true) return sum;
      const lineBase = line.item.sellPriceKd * line.qty;
      const maxAllowedPct = line.item.maxDiscountPercent !== undefined ? line.item.maxDiscountPercent : 100;
      const effectivePct = Math.min(discountPct, maxAllowedPct);
      return sum + (lineBase * effectivePct) / 100;
    }, 0);
    return Number(totalDiscount.toFixed(3));
  }, [cartLines, discountPct]);

  const taxAmount = 0.0; // Kuwait 0% VAT

  const total = useMemo(() => {
    return Math.max(0, subtotal - invoiceDiscountAmount + deliveryFee + taxAmount);
  }, [subtotal, invoiceDiscountAmount, deliveryFee, taxAmount]);

  // Cart Actions
  const handleAddToCart = useCallback(
    (item: Item, isGift = false) => {
      // 1. Check Allow Sale control
      if (!isGift && (item.allowSale === false || item.blockSale === true)) {
        alert(
          locale === "ar"
            ? `عذراً، هذا الصنف (${item.nameAr || item.nameEn}) غير مسموح ببيعه في نقطة البيع.`
            : `Item "${item.nameEn || item.nameAr}" cannot be sold at POS (Allow Sale is disabled).`
        );
        return;
      }

      // 2. Check Allow Gift control
      if (isGift && (item.allowGift === false || item.blockFreeGift === true)) {
        alert(
          locale === "ar"
            ? `عذراً، هذا الصنف (${item.nameAr || item.nameEn}) غير مسموح بإضافته كهدية مجانية.`
            : `Item "${item.nameEn || item.nameAr}" cannot be added as a gift (Allow Gift is disabled).`
        );
        return;
      }

      const stock = getStock(item);
      const currentInCart = cartQuantities[item.id] ?? 0;
      if (mode !== "return" && currentInCart >= stock) return;

      setCartLines((prev) => {
        const existingIdx = prev.findIndex((l) => l.item.id === item.id && Boolean(l.isGift) === isGift);
        if (existingIdx >= 0) {
          const updated = [...prev];
          updated[existingIdx].qty += 1;
          return updated;
        }
        return [...prev, { item, qty: 1, isGift }];
      });
    },
    [getStock, cartQuantities, mode, locale]
  );

  const handleUpdateQty = useCallback((itemId: string, newQty: number) => {
    if (newQty <= 0) {
      setCartLines((prev) => prev.filter((l) => l.item.id !== itemId));
    } else {
      setCartLines((prev) =>
        prev.map((l) => (l.item.id === itemId ? { ...l, qty: newQty } : l))
      );
    }
  }, []);

  const handleRemoveItem = useCallback((itemId: string) => {
    setCartLines((prev) => prev.filter((l) => l.item.id !== itemId));
  }, []);

  const handleClearCart = useCallback(() => {
    setCartLines([]);
    setDiscountPct(0);
    setCashReceived(0);
    setOrderNote("");
  }, []);

  // Barcode Submit
  const handleBarcodeSubmit = useCallback(
    (code: string): boolean => {
      const item = itemsCatalog.find(
        (i) =>
          i.barcode?.toLowerCase() === code.toLowerCase() ||
          i.sku.toLowerCase() === code.toLowerCase()
      );
      if (item) {
        if (item.posVisibility === false || item.isActive === false) {
          alert(
            locale === "ar"
              ? `هذا الصنف (${item.nameAr || item.nameEn}) معطل أو غير مفعل في نقطة البيع.`
              : `Item "${item.nameEn || item.nameAr}" is inactive or hidden from POS.`
          );
          return false;
        }
        if (item.allowSale === false || item.blockSale === true) {
          alert(
            locale === "ar"
              ? `عذراً، هذا الصنف (${item.nameAr || item.nameEn}) غير مسموح ببيعه في نقطة البيع.`
              : `Item "${item.nameEn || item.nameAr}" cannot be sold at POS (Allow Sale is disabled).`
          );
          return false;
        }
        handleAddToCart(item);
        return true;
      }
      return false;
    },
    [itemsCatalog, handleAddToCart, locale]
  );

  // Keyboard Shortcuts (F2, F4, F6, F9, F10, F11)
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "F2") {
        e.preventDefault();
        const searchInput = document.querySelector<HTMLInputElement>('input[placeholder*="Search"]');
        searchInput?.focus();
      } else if (e.key === "F4") {
        e.preventDefault();
        setIsBarcodeModalOpen(true);
      } else if (e.key === "F6") {
        e.preventDefault();
        handleHoldSale();
      } else if (e.key === "F9") {
        e.preventDefault();
        handleCheckout();
      } else if (e.key === "F10") {
        e.preventDefault();
        setIsShiftModalOpen(true);
      } else if (e.key === "F11") {
        e.preventDefault();
        setIsDailyClosingModalOpen(true);
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  });

  // Hold Sale
  function handleHoldSale() {
    if (cartLines.length === 0) return;
    const newHeld: HeldSaleRecord = {
      id: `hold-${Date.now()}`,
      heldAt: formatKuwaitTime(new Date(), locale),
      customerName: selectedCustomer
        ? locale === "ar"
          ? selectedCustomer.nameAr
          : selectedCustomer.nameEn
        : locale === "ar"
        ? "عميل نقدي"
        : "Walk-in Customer",
      salespersonName: selectedSalesperson
        ? locale === "ar"
          ? selectedSalesperson.nameAr
          : selectedSalesperson.nameEn
        : undefined,
      cartLines: [...cartLines],
      total,
    };
    setHeldSales((prev) => [newHeld, ...prev]);
    handleClearCart();
  }

  // Recall Sale
  function handleRecallSale(record: HeldSaleRecord) {
    setCartLines([...record.cartLines]);
    setHeldSales((prev) => prev.filter((h) => h.id !== record.id));
    setIsHeldModalOpen(false);
  }

  function handleDeleteHeldSale(id: string) {
    setHeldSales((prev) => prev.filter((h) => h.id !== id));
  }

  // Complete Sale & Checkout
  async function handleCheckout() {
    if (cartLines.length === 0 || !activeBranch || !user) return;

    // Verify Active Shift
    if (!currentShift || currentShift.status !== "OPEN") {
      setIsShiftModalOpen(true);
      alert(
        locale === "ar"
          ? "يجب فتح الوردية أولاً قبل تسجيل عمليات البيع أو الإرجاع"
          : "Please open a cashier shift before processing transactions."
      );
      return;
    }

    setIsProcessing(true);

    const isReturnMode = mode === "return";
    const invoicePrefix = isReturnMode ? "RET" : "INV";
    const invoiceNumber = `${invoicePrefix}-${Date.now().toString().slice(-6)}`;
    const branchName = locale === "ar" ? activeBranch.nameAr : activeBranch.nameEn;
    const cashierName = locale === "ar" ? user.nameAr : user.nameEn;
    const salespersonName = selectedSalesperson
      ? locale === "ar"
        ? selectedSalesperson.nameAr
        : selectedSalesperson.nameEn
      : "Mohamed Ali";
    const custName = selectedCustomer
      ? locale === "ar"
        ? selectedCustomer.nameAr
        : selectedCustomer.nameEn
      : locale === "ar"
      ? "عميل نقدي مباشر"
      : "Walk-in Customer";

    const changeDue = Math.max(0, cashReceived - total);

    const saleRecord: CompletedSaleRecord = {
      invoiceNumber,
      date: formatKuwaitDateTime(new Date(), locale),
      branchName,
      cashierName,
      salespersonName,
      customerName: custName,
      fulfillmentMode,
      deliveryAddress: fulfillmentMode === "delivery" ? deliveryAddress : undefined,
      deliveryFee: fulfillmentMode === "delivery" ? deliveryFee : undefined,
      lines: [...cartLines],
      subtotal,
      discount: invoiceDiscountAmount,
      tax: taxAmount,
      total,
      paymentMethod,
      cashReceived: paymentMethod === "cash" ? (cashReceived || total) : undefined,
      changeDue: paymentMethod === "cash" ? changeDue : undefined,
      note: orderNote || (isReturnMode ? "Sales Return / Refund" : undefined),
    };

    // 1. Invoke backend sales invoice API
    try {
      const backendPaymentMethod =
        paymentMethod === "cash"
          ? "CASH"
          : paymentMethod === "knet"
          ? "KNET"
          : paymentMethod === "hesabi"
          ? "HESABI"
          : paymentMethod === "tabby"
          ? "TABBY"
          : paymentMethod === "card"
          ? "CARD"
          : paymentMethod === "credit"
          ? "CREDIT"
          : "BANK_TRANSFER";

      await createSalesInvoiceRequest({
        invoiceNumber,
        customerId: selectedCustomer?.id,
        branchId: activeBranch.id,
        userId: user.id,
        paymentMethod: backendPaymentMethod as any,
        taxAmount: 0,
        lines: cartLines.map((l) => {
          const basePrice = l.isGift ? 0 : l.item.sellPriceKd;
          const linePrice = discountPct > 0 ? basePrice * (1 - discountPct / 100) : basePrice;
          return {
            itemId: l.item.id,
            quantity: isReturnMode ? -l.qty : l.qty,
            unitPrice: Number(linePrice.toFixed(3)),
          };
        }),
      });
    } catch {
      // Graceful fallback to offline/in-memory update
    }

    // 2. Adjust persistent branch stock
    const updatedCatalog = deductBranchStock(
      activeBranch.id,
      cartLines.map((l) => ({ itemId: l.item.id, quantity: isReturnMode ? -l.qty : l.qty }))
    );
    setItemsCatalog(updatedCatalog);

    // 3. Update Register Shift Metrics
    if (isReturnMode) {
      setReturnsKd((prev) => prev + total);
      if (paymentMethod === "cash") {
        setCashInHandKd((prev) => Math.max(0, prev - total));
      }
    } else {
      setTodaySalesKd((prev) => prev + total);
      setDiscountsKd((prev) => prev + invoiceDiscountAmount);

      const giftsInCart = cartLines.filter((l) => l.isGift);
      if (giftsInCart.length > 0) {
        const giftQty = giftsInCart.reduce((s, l) => s + l.qty, 0);
        const giftVal = giftsInCart.reduce((s, l) => s + l.qty * l.item.sellPriceKd, 0);
        setGiftItemsCount((prev) => prev + giftQty);
        setGiftItemsKd((prev) => prev + giftVal);
      }

      if (paymentMethod === "cash") {
        setCashInHandKd((prev) => prev + total);
      }
      setSalesByMethod((prev) => ({
        ...prev,
        [paymentMethod]: (prev[paymentMethod] || 0) + total,
      }));
    }
    setTransactionsCount((prev) => prev + 1);

    // 4. Show Receipt & Reset
    setCompletedSale(saleRecord);
    setIsReceiptOpen(true);
    handleClearCart();
    setIsProcessing(false);
  }

  // Shift Management Handlers
  async function handleOpenShift(openingFloat: number) {
    if (!user || !activeBranch) return;
    const newShift = await openPosShiftRequest({
      userId: user.id,
      branchId: activeBranch.id,
      openingFloat,
    });
    setCurrentShift(newShift);
    setTodaySalesKd(0);
    setReturnsKd(0);
    setDiscountsKd(0);
    setGiftItemsCount(0);
    setGiftItemsKd(0);
    setTransactionsCount(0);
    setCashInHandKd(openingFloat);
    setSalesByMethod({
      cash: 0,
      knet: 0,
      hesabi: 0,
      tabby: 0,
      credit: 0,
      card: 0,
    });
  }

  async function handleCloseShift(closingCashActual: number, notes?: string) {
    if (!currentShift) throw new Error("No active shift");
    const closed = await closePosShiftRequest(currentShift.id, {
      closingCashActual,
      notes,
      metrics: {
        cashSalesTotal: salesByMethod.cash,
        knetSalesTotal: salesByMethod.knet,
        hesabiSalesTotal: salesByMethod.hesabi,
        tabbySalesTotal: salesByMethod.tabby,
        cardSalesTotal: salesByMethod.card,
        creditSalesTotal: salesByMethod.credit,
        otherSalesTotal: 0,
        totalSales: todaySalesKd,
        returnsTotal: returnsKd,
        discountsTotal: discountsKd,
        giftsTotal: giftItemsKd,
        giftsCount: giftItemsCount,
      },
    });
    setCurrentShift(closed);
    return closed;
  }

  async function handleReopenShift(shiftId: string, reason: string) {
    if (!user) return;
    const reopened = await reopenPosShiftRequest(shiftId, {
      userId: user.id,
      userRole: user.role,
      reason,
    });
    setCurrentShift(reopened);
  }

  async function handleAdjustShift(shiftId: string, closingCashActual: number, reason: string) {
    if (!user) return;
    const adjusted = await adjustPosShiftRequest(shiftId, {
      userId: user.id,
      userRole: user.role,
      closingCashActual,
      reason,
    });
    setCurrentShift(adjusted);
  }

  // Create Stock Request
  function handleCreateNewStockRequest({ itemsSummary, count }: { itemsSummary: string; count: number }) {
    const newReq: StockRequestRecord = {
      id: `req-${Date.now()}`,
      requestNo: `REQ-${(stockRequests.length + 33).toString().padStart(5, "0")}`,
      date: formatKuwaitDateTime(new Date(), locale),
      fromBranch: "Shuwaikh Main Warehouse",
      toBranch: activeBranch ? (locale === "ar" ? activeBranch.nameAr : activeBranch.nameEn) : "Salmiya 5th",
      itemsCount: count,
      itemsSummary,
      status: "Pending",
    };
    setStockRequests((prev) => [newReq, ...prev]);
  }

  return (
    <div className="flex h-screen w-full flex-col overflow-hidden bg-slate-100 antialiased font-sans text-slate-900">
      {/* 1. TOP BAR */}
      <PosTopbar
        mode={mode}
        onModeChange={setMode}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        query={query}
        onQueryChange={setQuery}
        onOpenBarcodeModal={() => setIsBarcodeModalOpen(true)}
        onOpenStockModal={() => setIsStockLookupModalOpen(true)}
        onOpenShiftModal={() => setIsShiftModalOpen(true)}
        onOpenSettingsModal={() => setIsDailyClosingModalOpen(true)}
        isOnline={true}
      />

      {/* Mode Alert for Sales Returns */}
      {mode === "return" && (
        <div className="bg-rose-600 text-white px-4 py-1.5 flex items-center justify-between text-xs font-bold shadow-sm">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
            <span>
              {locale === "ar"
                ? "وضع مرتجع المبيعات نشط - يتم إرجاع الأصناف للمخزون واسترداد النقدية للعميل"
                : "Sales Return Mode Active - Items will be returned to inventory and refunded to customer"}
            </span>
          </div>
          <button
            type="button"
            onClick={() => setMode("invoice")}
            className="underline hover:text-rose-100 text-[11px]"
          >
            {locale === "ar" ? "العودة للبيع العادي" : "Switch to Normal Sale"}
          </button>
        </div>
      )}

      {/* 2. MAIN WORKING AREA */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Categories & Branch Actions Navigation */}
        <PosSidebar
          categories={categoriesList}
          activeCategory={activeCategory}
          onSelectCategory={setActiveCategory}
          onOpenNewStockRequest={() => setIsStockRequestsModalOpen(true)}
          onOpenStockHistory={() => setIsStockRequestsModalOpen(true)}
          onOpenTodaySalesSummary={() => setIsShiftModalOpen(true)}
          onOpenTodayShiftSummary={() => setIsShiftModalOpen(true)}
          onOpenStockSummary={() => setIsStockLookupModalOpen(true)}
        />

        {/* Center Product Area */}
        <main className="flex-1 overflow-hidden p-3 bg-[#F8FAFC]">
          <PosProductGrid
            items={filteredItems}
            stockByItem={getStock}
            onAddToCart={(item) => handleAddToCart(item, false)}
            cartQuantities={cartQuantities}
            selectedBrand={selectedBrand}
            onSelectBrand={setSelectedBrand}
            viewMode={viewMode}
          />
        </main>

        {/* Right Cart & Checkout Panel */}
        <div className="w-80 lg:w-96 shrink-0 h-full">
          <PosCartPanel
            cartLines={cartLines}
            onUpdateQty={handleUpdateQty}
            onRemoveItem={handleRemoveItem}
            onClearCart={handleClearCart}
            onAddGiftItem={() => setIsGiftModalOpen(true)}
            selectedCustomer={selectedCustomer}
            onOpenCustomerModal={() => setIsCustomerModalOpen(true)}
            selectedSalesperson={selectedSalesperson}
            onOpenSalespersonModal={() => setIsSalespersonModalOpen(true)}
            fulfillmentMode={fulfillmentMode}
            onFulfillmentModeChange={setFulfillmentMode}
            deliveryAddress={deliveryAddress}
            onDeliveryAddressChange={setDeliveryAddress}
            deliveryFee={deliveryFee}
            invoiceType={invoiceType}
            onInvoiceTypeChange={setInvoiceType}
            paymentMethod={paymentMethod}
            onPaymentMethodChange={setPaymentMethod}
            discountPct={discountPct}
            onDiscountPctChange={setDiscountPct}
            subtotal={subtotal}
            itemDiscountsTotal={0}
            invoiceDiscountAmount={invoiceDiscountAmount}
            taxAmount={taxAmount}
            total={total}
            cashReceived={cashReceived}
            onCashReceivedChange={setCashReceived}
            orderNote={orderNote}
            onOrderNoteChange={setOrderNote}
            onCheckout={handleCheckout}
            onHoldSale={handleHoldSale}
            isProcessing={isProcessing}
          />
        </div>
      </div>

      {/* 3. BOTTOM STATUS STRIP */}
      <PosStatusBar
        todaySalesKd={todaySalesKd}
        transactionsCount={transactionsCount}
        cashInHandKd={cashInHandKd}
        shiftName={
          currentShift && currentShift.status === "OPEN"
            ? `${currentShift.shiftNumber} (Open)`
            : locale === "ar"
            ? "الوردية مغلقة"
            : "Shift Closed"
        }
        drawerStatus="ready"
        onOpenShiftModal={() => setIsShiftModalOpen(true)}
      />

      {/* 4. MODALS */}
      <PosReceiptModal
        sale={completedSale}
        isOpen={isReceiptOpen}
        onClose={() => setIsReceiptOpen(false)}
        onNewSale={() => {
          setIsReceiptOpen(false);
          setCompletedSale(null);
        }}
      />

      <PosHeldSalesModal
        isOpen={isHeldModalOpen}
        onClose={() => setIsHeldModalOpen(false)}
        heldSales={heldSales}
        onRecallSale={handleRecallSale}
        onDeleteHeldSale={handleDeleteHeldSale}
      />

      <PosBarcodeModal
        isOpen={isBarcodeModalOpen}
        onClose={() => setIsBarcodeModalOpen(false)}
        onBarcodeSubmit={handleBarcodeSubmit}
      />

      <PosCustomerModal
        isOpen={isCustomerModalOpen}
        onClose={() => setIsCustomerModalOpen(false)}
        customers={customersList}
        selectedCustomerId={selectedCustomer?.id ?? null}
        onSelectCustomer={setSelectedCustomer}
      />

      <PosSalespersonModal
        isOpen={isSalespersonModalOpen}
        onClose={() => setIsSalespersonModalOpen(false)}
        salespersons={salespersonsList}
        selectedSalespersonId={selectedSalesperson?.id ?? null}
        onSelectSalesperson={setSelectedSalesperson}
      />

      <PosAddGiftModal
        isOpen={isGiftModalOpen}
        onClose={() => setIsGiftModalOpen(false)}
        items={itemsCatalog}
        onSelectGiftItem={(item) => {
          handleAddToCart(item, true);
          setIsGiftModalOpen(false);
        }}
      />

      <PosStockRequestsModal
        isOpen={isStockRequestsModalOpen}
        onClose={() => setIsStockRequestsModalOpen(false)}
        requests={stockRequests}
        onCreateNewRequest={handleCreateNewStockRequest}
      />

      <PosCurrentShiftModal
        isOpen={isShiftModalOpen}
        onClose={() => setIsShiftModalOpen(false)}
        shift={currentShift}
        cashierName={user ? (locale === "ar" ? user.nameAr : user.nameEn) : "Ahmed"}
        salespersonName={selectedSalesperson ? (locale === "ar" ? selectedSalesperson.nameAr : selectedSalesperson.nameEn) : "Mohamed Ali"}
        branchName={activeBranch ? (locale === "ar" ? activeBranch.nameAr : activeBranch.nameEn) : "Salmiya 5th"}
        todaySalesKd={todaySalesKd}
        salesByMethod={salesByMethod}
        returnsKd={returnsKd}
        discountsKd={discountsKd}
        giftItemsCount={giftItemsCount}
        giftItemsKd={giftItemsKd}
        transactionsCount={transactionsCount}
        onOpenShift={handleOpenShift}
        onCloseShift={handleCloseShift}
        onReopenShift={handleReopenShift}
        onAdjustShift={handleAdjustShift}
        userRole={user?.role}
        isHeadOfficeOrManager={isHeadOffice || user?.role === "admin" || user?.role === "branch_manager"}
      />

      <PosDailyClosingModal
        isOpen={isDailyClosingModalOpen}
        onClose={() => setIsDailyClosingModalOpen(false)}
        totalSalesKd={todaySalesKd}
        totalCashKd={cashInHandKd}
        totalKnetKd={salesByMethod.knet}
        totalHesabiKd={salesByMethod.hesabi}
        onCloseDay={() => {
          alert(locale === "ar" ? "تم إقفال اليومية للفرع بنجاح" : "Daily closing completed successfully");
        }}
      />

      <PosStockLookupModal
        isOpen={isStockLookupModalOpen}
        onClose={() => setIsStockLookupModalOpen(false)}
        items={itemsCatalog}
        branches={branches}
      />
    </div>
  );
}
