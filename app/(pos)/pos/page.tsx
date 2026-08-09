"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { useLocale } from "@/lib/i18n/LocaleContext";
import { useSession } from "@/lib/context/SessionContext";
import { items as initialItems } from "@/lib/mock-data/items";
import { customers as initialCustomers } from "@/lib/mock-data/customers";
import { branches } from "@/lib/mock-data/branches";
import { salespersons, type Salesperson } from "@/lib/mock-data/salespersons";
import { INITIAL_STOCK_REQUESTS, type StockRequestRecord } from "@/lib/mock-data/stock-transfers";
import { isItemVisibleToBrand } from "@/lib/utils/visibility";
import type { Item, Customer, ItemCategory } from "@/lib/types";
import { createSalesInvoiceRequest } from "@/lib/api";
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
    currentBrand,
    currentBranch,
    branchesForCurrentBrand,
  } = useSession();

  // 1. Live Persistent Inventory State
  const [itemsCatalog, setItemsCatalog] = useState<Item[]>(() => getPersistentItemsCatalog());
  const [customersList] = useState<Customer[]>(initialCustomers);
  const [salespersonsList] = useState<Salesperson[]>(salespersons);

  // Sync inventory whenever page regains focus or visibility
  useEffect(() => {
    function syncStock() {
      setItemsCatalog(getPersistentItemsCatalog());
    }
    window.addEventListener("focus", syncStock);
    document.addEventListener("visibilitychange", syncStock);
    return () => {
      window.removeEventListener("focus", syncStock);
      document.removeEventListener("visibilitychange", syncStock);
    };
  }, []);

  // 2. Navigation, Search, Filter & View Mode
  const [mode, setMode] = useState<PosMode>("invoice");
  const [viewMode, setViewMode] = useState<PosViewMode>("grid");
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [selectedBrand, setSelectedBrand] = useState("all");

  // 3. Cart & Transaction State
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

  // 4. Modals State
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

  // 5. Shift & Register Metrics
  const [todaySalesKd, setTodaySalesKd] = useState(224.5);
  const [transactionsCount, setTransactionsCount] = useState(18);
  const [cashInHandKd, setCashInHandKd] = useState(145.0);
  const [salesByMethod, setSalesByMethod] = useState<Record<PosPaymentMethod, number>>({
    cash: 145.0,
    knet: 45.0,
    hesabi: 20.0,
    tabby: 10.0,
    credit: 4.5,
    card: 0,
  });

  const activeBranch = useMemo(() => {
    return (
      currentBranch ??
      branches.find((b) => b.id === "br-01") ??
      branches[0]
    );
  }, [currentBranch]);

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
        const matchesNameEn = item.nameEn.toLowerCase().includes(q);
        const matchesNameAr = item.nameAr.includes(q);
        const matchesSku = item.sku.toLowerCase().includes(q);
        const matchesBarcode = item.barcode?.toLowerCase().includes(q) ?? false;
        if (!matchesNameEn && !matchesNameAr && !matchesSku && !matchesBarcode) {
          return false;
        }
      }
      return true;
    });
  }, [itemsCatalog, selectedBrand, activeCategory, query]);

  // Categories with live product counts
  const categoriesList = useMemo(() => {
    const counts: Record<string, number> = { all: itemsCatalog.length };
    itemsCatalog.forEach((item) => {
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

  const invoiceDiscountAmount = useMemo(() => {
    return Number(((subtotal * discountPct) / 100).toFixed(3));
  }, [subtotal, discountPct]);

  const taxAmount = 0.0; // Kuwait 0% VAT

  const total = useMemo(() => {
    return Math.max(0, subtotal - invoiceDiscountAmount + deliveryFee + taxAmount);
  }, [subtotal, invoiceDiscountAmount, deliveryFee, taxAmount]);

  // Cart Actions
  const handleAddToCart = useCallback(
    (item: Item, isGift = false) => {
      const stock = getStock(item);
      const currentInCart = cartQuantities[item.id] ?? 0;
      if (currentInCart >= stock) return;

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
    [getStock, cartQuantities]
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
        handleAddToCart(item);
        return true;
      }
      return false;
    },
    [itemsCatalog, handleAddToCart]
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
    setIsProcessing(true);

    const invoiceNumber = `INV-${Date.now().toString().slice(-6)}`;
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
      note: orderNote || undefined,
    };

    // 1. Invoke backend sales invoice API
    try {
      const backendPaymentMethod =
        paymentMethod === "cash"
          ? "CASH"
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
        paymentMethod: backendPaymentMethod,
        taxAmount: 0,
        lines: cartLines.map((l) => {
          const basePrice = l.isGift ? 0 : l.item.sellPriceKd;
          const linePrice = discountPct > 0 ? basePrice * (1 - discountPct / 100) : basePrice;
          return {
            itemId: l.item.id,
            quantity: l.qty,
            unitPrice: Number(linePrice.toFixed(3)),
          };
        }),
      });
    } catch {
      // Graceful fallback to offline/in-memory update
    }

    // 2. Decrement persistent branch stock immediately
    const updatedCatalog = deductBranchStock(
      activeBranch.id,
      cartLines.map((l) => ({ itemId: l.item.id, quantity: l.qty }))
    );
    setItemsCatalog(updatedCatalog);

    // 3. Update Register Metrics
    setTodaySalesKd((prev) => prev + total);
    setTransactionsCount((prev) => prev + 1);
    if (paymentMethod === "cash") {
      setCashInHandKd((prev) => prev + total);
    }
    setSalesByMethod((prev) => ({
      ...prev,
      [paymentMethod]: (prev[paymentMethod] || 0) + total,
    }));

    // 4. Show Receipt & Reset
    setCompletedSale(saleRecord);
    setIsReceiptOpen(true);
    handleClearCart();
    setIsProcessing(false);
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
        shiftName={locale === "ar" ? "وردية المساء" : "Evening Shift"}
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
        cashierName={user?.nameEn ?? "Ahmed"}
        salespersonName={selectedSalesperson?.nameEn ?? "Mohamed Ali"}
        todaySalesKd={todaySalesKd}
        salesByMethod={salesByMethod}
        onCloseShift={() => {
          alert(locale === "ar" ? "تم إغلاق الوردية بنجاح" : "Shift closed successfully");
        }}
      />

      <PosDailyClosingModal
        isOpen={isDailyClosingModalOpen}
        onClose={() => setIsDailyClosingModalOpen(false)}
        totalSalesKd={todaySalesKd + 288.25}
        totalCashKd={cashInHandKd + 167.0}
        totalKnetKd={105.0}
        totalHesabiKd={60.0}
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
