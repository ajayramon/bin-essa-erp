"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import { useSession } from "@/lib/context/SessionContext";
import { useLocale } from "@/lib/i18n/LocaleContext";
import { items as initialItems } from "@/lib/mock-data/items";
import { customers as initialCustomers } from "@/lib/mock-data/customers";
import { branches } from "@/lib/mock-data/branches";
import { isItemVisibleToBrand } from "@/lib/utils/visibility";
import type { Item, Customer, ItemCategory } from "@/lib/types";
import { createSalesInvoiceRequest } from "@/lib/api";

import { PosTopbar } from "@/components/pos/PosTopbar";
import { PosSidebar, type PosTab } from "@/components/pos/PosSidebar";
import { PosCategoryBar } from "@/components/pos/PosCategoryBar";
import { PosProductGrid } from "@/components/pos/PosProductGrid";
import {
  PosCartPanel,
  type CartItemLine,
  type PosPaymentMethod,
} from "@/components/pos/PosCartPanel";
import { PosQuickActions } from "@/components/pos/PosQuickActions";
import { PosStatusBar } from "@/components/pos/PosStatusBar";
import {
  PosReceiptModal,
  PosHeldSalesModal,
  PosBarcodeModal,
  PosCustomerModal,
  PosDiscountModal,
  PosNoteModal,
  PosStockLookupModal,
  PosShiftReportModal,
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

  // 1. Live Inventory & Catalog State (allows local decrement after sale)
  const [itemsCatalog, setItemsCatalog] = useState<Item[]>(initialItems);
  const [customersList] = useState<Customer[]>(initialCustomers);

  // 2. Active POS Tab & Search & Filter
  const [activeTab, setActiveTab] = useState<PosTab>("sales");
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");

  // 3. Cart & Transaction State
  const [cart, setCart] = useState<Record<string, number>>({});
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(
    null
  );
  const [discountPct, setDiscountPct] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState<PosPaymentMethod>("cash");
  const [cashReceived, setCashReceived] = useState(0);
  const [orderNote, setOrderNote] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  // 4. Modals State
  const [isReceiptOpen, setIsReceiptOpen] = useState(false);
  const [completedSale, setCompletedSale] = useState<CompletedSaleRecord | null>(
    null
  );
  const [isHeldModalOpen, setIsHeldModalOpen] = useState(false);
  const [heldSales, setHeldSales] = useState<HeldSaleRecord[]>([]);
  const [isBarcodeModalOpen, setIsBarcodeModalOpen] = useState(false);
  const [isCustomerModalOpen, setIsCustomerModalOpen] = useState(false);
  const [isDiscountModalOpen, setIsDiscountModalOpen] = useState(false);
  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);
  const [isStockModalOpen, setIsStockModalOpen] = useState(false);
  const [isShiftModalOpen, setIsShiftModalOpen] = useState(false);

  // 5. Shift & Register Totals State
  const [todaySalesKd, setTodaySalesKd] = useState(48.5);
  const [transactionsCount, setTransactionsCount] = useState(14);
  const [cashInHandKd, setCashInHandKd] = useState(120.0);
  const [salesByMethod, setSalesByMethod] = useState<
    Record<PosPaymentMethod, number>
  >({
    cash: 25.5,
    knet: 15.0,
    card: 8.0,
    credit: 0,
    tabby: 0,
  });

  // Effective branch helper (strict isolation)
  const activeBranch = currentBranch ?? branchesForCurrentBrand[0] ?? branches[0];

  function stockForItem(item: Item): number {
    if (!activeBranch) return 0;
    return item.stockByBranch[activeBranch.id] ?? 0;
  }

  // Filter items visible to current brand
  const visibleItems = useMemo(() => {
    if (!currentBrand) return [];
    return itemsCatalog.filter((i) => isItemVisibleToBrand(i, currentBrand.id));
  }, [currentBrand, itemsCatalog]);

  // Extract categories dynamically
  const categoriesList = useMemo(() => {
    const counts: Record<string, number> = {};
    visibleItems.forEach((i) => {
      counts[i.category] = (counts[i.category] ?? 0) + 1;
    });

    const list: { id: string; label: string; count: number }[] = [
      {
        id: "all",
        label: t.posScreen.allCategories,
        count: visibleItems.length,
      },
    ];

    Object.entries(counts).forEach(([catKey, count]) => {
      const catTranslation =
        t.categories[catKey as keyof typeof t.categories] || catKey;
      list.push({
        id: catKey,
        label: catTranslation,
        count,
      });
    });

    return list;
  }, [visibleItems, t]);

  // Filter items by category & search query
  const filteredItems = useMemo(() => {
    const q = query.trim().toLowerCase();
    return visibleItems.filter((i) => {
      // Category match
      if (activeCategory !== "all" && i.category !== activeCategory) {
        return false;
      }
      // Search match
      if (!q) return true;
      return (
        i.nameEn.toLowerCase().includes(q) ||
        i.nameAr.includes(q) ||
        i.sku.toLowerCase().includes(q) ||
        i.barcode.includes(q)
      );
    });
  }, [visibleItems, activeCategory, query]);

  // Cart Lines with item references
  const cartLines: CartItemLine[] = useMemo(() => {
    return Object.entries(cart)
      .map(([itemId, qty]) => {
        const item = itemsCatalog.find((i) => i.id === itemId);
        return item ? { item, qty } : null;
      })
      .filter((line): line is CartItemLine => line !== null);
  }, [cart, itemsCatalog]);

  // Calculations
  const subtotal = useMemo(() => {
    return cartLines.reduce(
      (sum, l) => sum + l.item.sellPriceKd * l.qty,
      0
    );
  }, [cartLines]);

  const discountAmount = subtotal * (discountPct / 100);
  const taxAmount = 0; // KWD retail standard
  const total = Math.max(0, subtotal - discountAmount + taxAmount);

  // Cart operations
  const addToCart = useCallback(
    (item: Item) => {
      const stock = stockForItem(item);
      const current = cart[item.id] ?? 0;
      if (current >= stock) return;
      setCart((prev) => ({ ...prev, [item.id]: current + 1 }));
    },
    [cart, activeBranch]
  );

  const updateQty = useCallback((itemId: string, qty: number) => {
    if (qty <= 0) {
      setCart((prev) => {
        const next = { ...prev };
        delete next[itemId];
        return next;
      });
      return;
    }
    setCart((prev) => ({ ...prev, [itemId]: qty }));
  }, []);

  const removeFromCart = useCallback((itemId: string) => {
    setCart((prev) => {
      const next = { ...prev };
      delete next[itemId];
      return next;
    });
  }, []);

  const clearCart = useCallback(() => {
    setCart({});
    setDiscountPct(0);
    setCashReceived(0);
    setSelectedCustomer(null);
    setOrderNote("");
  }, []);

  // Barcode quick add
  function handleBarcodeSubmit(code: string): boolean {
    const found = visibleItems.find(
      (i) =>
        i.barcode.toLowerCase() === code.toLowerCase() ||
        i.sku.toLowerCase() === code.toLowerCase()
    );
    if (!found) return false;
    addToCart(found);
    return true;
  }

  // Keyboard shortcut listener (e.g. F2 for search, F4 for barcode)
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "F2") {
        e.preventDefault();
        const searchInput = document.querySelector<HTMLInputElement>(
          'input[placeholder*="Search"]'
        );
        searchInput?.focus();
      } else if (e.key === "F4") {
        e.preventDefault();
        setIsBarcodeModalOpen(true);
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Hold Sale
  function handleHoldSale() {
    if (cartLines.length === 0) return;
    const newHeld: HeldSaleRecord = {
      id: `hold-${Date.now()}`,
      heldAt: new Date().toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      }),
      customerName: selectedCustomer
        ? locale === "ar"
          ? selectedCustomer.nameAr
          : selectedCustomer.nameEn
        : t.posScreen.walkInCustomer,
      cartLines: [...cartLines],
      total,
    };
    setHeldSales((prev) => [newHeld, ...prev]);
    clearCart();
  }

  // Recall Sale
  function handleRecallSale(record: HeldSaleRecord) {
    const newCart: Record<string, number> = {};
    record.cartLines.forEach((l) => {
      newCart[l.item.id] = l.qty;
    });
    setCart(newCart);
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
    const branchName =
      locale === "ar" ? activeBranch.nameAr : activeBranch.nameEn;
    const cashierName = locale === "ar" ? user.nameAr : user.nameEn;
    const custName = selectedCustomer
      ? locale === "ar"
        ? selectedCustomer.nameAr
        : selectedCustomer.nameEn
      : t.posScreen.walkInCustomer;

    const changeDue = Math.max(0, cashReceived - total);

    const saleRecord: CompletedSaleRecord = {
      invoiceNumber,
      date: new Date().toLocaleString("en-US", {
        dateStyle: "medium",
        timeStyle: "short",
      }),
      branchName,
      cashierName,
      customerName: custName,
      lines: [...cartLines],
      subtotal,
      discount: discountAmount,
      tax: taxAmount,
      total,
      paymentMethod,
      cashReceived: paymentMethod === "cash" ? cashReceived : undefined,
      changeDue: paymentMethod === "cash" ? changeDue : undefined,
      note: orderNote || undefined,
    };

    // 1. Try invoking backend sales invoice API if online token is available
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
        lines: cartLines.map((l) => ({
          itemId: l.item.id,
          quantity: l.qty,
          unitPrice: l.item.sellPriceKd,
        })),
      });
    } catch {
      // Graceful fallback to offline/in-memory update if backend is unreachable
    }

    // 2. Decrement local branch stock immediately
    setItemsCatalog((prevItems) => {
      return prevItems.map((item) => {
        const line = cartLines.find((l) => l.item.id === item.id);
        if (!line) return item;
        const currentStock = item.stockByBranch[activeBranch.id] ?? 0;
        return {
          ...item,
          stockByBranch: {
            ...item.stockByBranch,
            [activeBranch.id]: Math.max(0, currentStock - line.qty),
          },
        };
      });
    });

    // 3. Update Register Metrics
    setTodaySalesKd((prev) => prev + total);
    setTransactionsCount((prev) => prev + 1);
    if (paymentMethod === "cash") {
      setCashInHandKd((prev) => prev + total);
    }
    setSalesByMethod((prev) => ({
      ...prev,
      [paymentMethod]: (prev[paymentMethod] ?? 0) + total,
    }));

    // 4. Record and Show Receipt
    setCompletedSale(saleRecord);
    setIsReceiptOpen(true);
    clearCart();
    setIsProcessing(false);
  }

  // Handle Tab navigation
  function handleSelectTab(tab: PosTab) {
    setActiveTab(tab);
    if (tab === "orders") {
      setIsHeldModalOpen(true);
    } else if (tab === "customers") {
      setIsCustomerModalOpen(true);
    } else if (tab === "reports") {
      setIsShiftModalOpen(true);
    } else if (tab === "stock") {
      setIsStockModalOpen(true);
    } else if (tab === "returns") {
      alert(t.posScreen.returnsPlaceholder);
    } else if (tab === "settings") {
      alert("Drawer connected and ready on COM3.");
    }
  }

  return (
    <div className="flex h-screen w-screen flex-col overflow-hidden bg-neutral-100 select-none">
      {/* 1. Top Bar */}
      <PosTopbar
        query={query}
        onQueryChange={setQuery}
        onOpenBarcodeModal={() => setIsBarcodeModalOpen(true)}
        onOpenStockModal={() => setIsStockModalOpen(true)}
        onOpenShiftModal={() => setIsShiftModalOpen(true)}
        isOnline={true}
      />

      {/* 2. Main Body: Left Sidebar + Center Product Workspace + Right Cart */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Vertical Icon Bar */}
        <PosSidebar
          activeTab={activeTab}
          onSelectTab={handleSelectTab}
          heldOrdersCount={heldSales.length}
        />

        {/* Center Workspace: Categories, Quick Actions & Product Grid */}
        <main className="flex flex-1 flex-col overflow-hidden p-3.5 space-y-3">
          {/* Top Row: Categories + Quick Actions */}
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex-1 overflow-hidden">
              <PosCategoryBar
                categories={categoriesList}
                activeCategory={activeCategory}
                onSelectCategory={setActiveCategory}
              />
            </div>

            <div className="shrink-0">
              <PosQuickActions
                onHoldSale={handleHoldSale}
                onOpenRecentSales={() => setIsHeldModalOpen(true)}
                onOpenDiscountModal={() => setIsDiscountModalOpen(true)}
                onOpenNoteModal={() => setIsNoteModalOpen(true)}
                onClearCart={clearCart}
                isCartEmpty={cartLines.length === 0}
                heldOrdersCount={heldSales.length}
              />
            </div>
          </div>

          {/* Scrollable Product Grid */}
          <div className="flex-1 overflow-y-auto pe-1">
            <PosProductGrid
              items={filteredItems}
              stockByItem={stockForItem}
              onAddToCart={addToCart}
              cartQuantities={cart}
            />
          </div>
        </main>

        {/* Right Fixed Checkout Panel */}
        <aside className="w-80 sm:w-96 shrink-0 h-full">
          <PosCartPanel
            cartLines={cartLines}
            onUpdateQty={updateQty}
            onRemoveItem={removeFromCart}
            onClearCart={clearCart}
            selectedCustomer={selectedCustomer}
            onOpenCustomerModal={() => setIsCustomerModalOpen(true)}
            discountPct={discountPct}
            onDiscountPctChange={setDiscountPct}
            subtotal={subtotal}
            discountAmount={discountAmount}
            taxAmount={taxAmount}
            total={total}
            paymentMethod={paymentMethod}
            onPaymentMethodChange={setPaymentMethod}
            cashReceived={cashReceived}
            onCashReceivedChange={setCashReceived}
            onCheckout={handleCheckout}
            isProcessing={isProcessing}
            orderNote={orderNote}
            onOpenNoteModal={() => setIsNoteModalOpen(true)}
          />
        </aside>
      </div>

      {/* 3. Bottom Status Bar */}
      <PosStatusBar
        todaySalesKd={todaySalesKd}
        transactionsCount={transactionsCount}
        cashInHandKd={cashInHandKd}
        shiftName={t.posScreen.shift1}
        drawerStatus="ready"
        onOpenShiftModal={() => setIsShiftModalOpen(true)}
      />

      {/* 4. Modals */}
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

      <PosDiscountModal
        isOpen={isDiscountModalOpen}
        onClose={() => setIsDiscountModalOpen(false)}
        discountPct={discountPct}
        onApplyDiscount={setDiscountPct}
      />

      <PosNoteModal
        isOpen={isNoteModalOpen}
        onClose={() => setIsNoteModalOpen(false)}
        note={orderNote}
        onSaveNote={setOrderNote}
      />

      <PosStockLookupModal
        isOpen={isStockModalOpen}
        onClose={() => setIsStockModalOpen(false)}
        items={itemsCatalog}
        branches={branches}
      />

      <PosShiftReportModal
        isOpen={isShiftModalOpen}
        onClose={() => setIsShiftModalOpen(false)}
        branchName={
          activeBranch
            ? locale === "ar"
              ? activeBranch.nameAr
              : activeBranch.nameEn
            : ""
        }
        cashierName={
          user ? (locale === "ar" ? user.nameAr : user.nameEn) : ""
        }
        todaySalesKd={todaySalesKd}
        transactionsCount={transactionsCount}
        cashInHandKd={cashInHandKd}
        salesByMethod={salesByMethod}
      />
    </div>
  );
}
