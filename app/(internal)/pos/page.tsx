"use client";

import { useEffect, useState, useRef } from "react";
import { useLocale } from "@/lib/i18n/LocaleContext";
import { useSession } from "@/lib/context/SessionContext";
import {
  listItemsRequest,
  createSalesInvoiceRequest,
  type ItemResponse,
} from "@/lib/api";

function formatKD(amount: number) {
  return amount.toLocaleString("en-US", { minimumFractionDigits: 3, maximumFractionDigits: 3 });
}

type PriceTier = "RETAIL" | "SEMI_WHOLESALE" | "WHOLESALE";

interface CustomerRecord {
  id: string;
  name: string;
  code: string;
  tier: PriceTier;
  creditLimit: number;
}

const MOCK_CUSTOMERS: CustomerRecord[] = [
  { id: "cust-0", name: "Walk-in Retail Customer", code: "CUST-WALKIN", tier: "RETAIL", creditLimit: 0 },
  { id: "cust-1", name: "Trolley Supermarket Co.", code: "CUST-TROLLEY", tier: "WHOLESALE", creditLimit: 5000 },
  { id: "cust-2", name: "Bodega Mini-Market", code: "CUST-BODEGA", tier: "SEMI_WHOLESALE", creditLimit: 1500 },
  { id: "cust-3", name: "Hi & Buy Grocery", code: "CUST-HIBUY", tier: "SEMI_WHOLESALE", creditLimit: 2000 },
  { id: "cust-4", name: "Al Naser Trading Group", code: "CUST-ALNASER", tier: "WHOLESALE", creditLimit: 10000 },
];

export default function PosPage() {
  const { locale, t } = useLocale();
  const { user, currentBranch } = useSession();

  const [items, setItems] = useState<ItemResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [query, setQuery] = useState("");
  const [cart, setCart] = useState<Record<string, number>>({});
  const [cartUom, setCartUom] = useState<Record<string, string>>({});
  const [priceTier, setPriceTier] = useState<PriceTier>("RETAIL");
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerRecord>(MOCK_CUSTOMERS[0]);
  const [paymentMethod, setPaymentMethod] = useState<"CASH" | "CARD" | "CREDIT" | "BANK_TRANSFER">("CASH");

  // Discount & Manager PIN Overrides
  const [orderDiscountPercent, setOrderDiscountPercent] = useState<number>(0);
  const [managerPinModal, setManagerPinModal] = useState(false);
  const [inputPin, setInputPin] = useState("");
  const [pendingDiscount, setPendingDiscount] = useState<number | null>(null);
  const [pinError, setPinError] = useState<string | null>(null);

  // Cash Tendered & Change Due Calculation
  const [cashTenderedInput, setCashTenderedInput] = useState<string>("");

  // Post-Sale Receipt Modal State
  const [saleReceipt, setSaleReceipt] = useState<{
    invoiceNumber: string;
    date: string;
    customerName: string;
    cashierName: string;
    branchName: string;
    lines: Array<{ name: string; unitName: string; qty: number; unitPrice: number; lineTotal: number }>;
    subtotal: number;
    discountAmount: number;
    netTotal: number;
    paymentMethod: string;
    cashTendered: number;
    changeDue: number;
  } | null>(null);

  const [saleMessage, setSaleMessage] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const barcodeInputRef = useRef<HTMLInputElement>(null);

  async function loadItems() {
    setIsLoading(true);
    setError(null);
    try {
      const data = await listItemsRequest();
      setItems(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load products");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadItems();
    function handleFocus() {
      loadItems();
    }
    function handleVisibility() {
      if (document.visibilityState === "visible") {
        loadItems();
      }
    }
    window.addEventListener("focus", handleFocus);
    document.addEventListener("visibilitychange", handleVisibility);
    return () => {
      window.removeEventListener("focus", handleFocus);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, []);

  function handleSelectCustomer(cust: CustomerRecord) {
    setSelectedCustomer(cust);
    setPriceTier(cust.tier);
  }

  const categories = ["ALL", ...Array.from(new Set(items.map((i) => i.category)))];

  const searchedItems = items.filter((i) => {
    if (selectedCategory !== "ALL" && i.category !== selectedCategory) return false;
    const q = query.trim().toLowerCase();
    if (!q) return true;
    return (
      i.name.toLowerCase().includes(q) ||
      i.sku.toLowerCase().includes(q) ||
      (i.barcode ?? "").toLowerCase().includes(q) ||
      (i.additionalBarcodes ?? []).some((b) => b.barcode.toLowerCase().includes(q)) ||
      (i.uoms ?? []).some((u) => (u.barcode ?? "").toLowerCase().includes(q))
    );
  });

  function getItemBasePrice(item: ItemResponse, tier: PriceTier): number {
    if (tier === "WHOLESALE" && item.wholesalePrice) return Number(item.wholesalePrice);
    if (tier === "SEMI_WHOLESALE" && item.semiWholesalePrice) return Number(item.semiWholesalePrice);
    if (item.retailPrice) return Number(item.retailPrice);
    return Number(item.price);
  }

  function getUomRatio(item: ItemResponse, unitName?: string): number {
    if (!unitName || !item.uoms || item.uoms.length === 0) return 1;
    const match = item.uoms.find((u) => u.unitName.toLowerCase() === unitName.toLowerCase());
    return match ? Number(match.conversionRatio || 1) : 1;
  }

  function getItemUnitPrice(item: ItemResponse, tier: PriceTier, unitName?: string): number {
    if (unitName && item.uoms && item.uoms.length > 0) {
      const match = item.uoms.find((u) => u.unitName.toLowerCase() === unitName.toLowerCase());
      if (match && match.customPrice && Number(match.customPrice) > 0) {
        return Number(match.customPrice);
      }
    }
    const basePrice = getItemBasePrice(item, tier);
    const ratio = getUomRatio(item, unitName);
    return basePrice * ratio;
  }

  function addToCart(item: ItemResponse) {
    const stock = Number(item.stockQuantity ?? 0);
    const current = cart[item.id] ?? 0;
    const selectedUnit = cartUom[item.id] || item.unit || "Piece";
    const ratio = getUomRatio(item, selectedUnit);
    const totalRequiredBaseStock = (current + 1) * ratio;

    if (totalRequiredBaseStock > stock && stock > 0) {
      setError(`Cannot add more than available stock (${stock} base pieces)`);
      return;
    }
    setCart({ ...cart, [item.id]: current + 1 });
    if (!cartUom[item.id]) {
      setCartUom({ ...cartUom, [item.id]: item.unit || "Piece" });
    }
    setSaleMessage(null);
    setError(null);
  }

  function updateQty(itemId: string, qty: number) {
    if (qty <= 0) {
      const nextCart = { ...cart };
      const nextUom = { ...cartUom };
      delete nextCart[itemId];
      delete nextUom[itemId];
      setCart(nextCart);
      setCartUom(nextUom);
      return;
    }
    const item = items.find((i) => i.id === itemId);
    const stock = item ? Number(item.stockQuantity ?? 0) : 9999;
    const selectedUnit = cartUom[itemId] || item?.unit || "Piece";
    const ratio = item ? getUomRatio(item, selectedUnit) : 1;

    if (qty * ratio > stock && stock > 0) {
      setError(`Cannot exceed available stock (${stock} base pieces)`);
      return;
    }
    setError(null);
    setCart({ ...cart, [itemId]: qty });
  }

  function updateItemUom(itemId: string, unitName: string) {
    setCartUom({ ...cartUom, [itemId]: unitName });
  }

  function removeFromCart(itemId: string) {
    const nextCart = { ...cart };
    const nextUom = { ...cartUom };
    delete nextCart[itemId];
    delete nextUom[itemId];
    setCart(nextCart);
    setCartUom(nextUom);
  }

  function clearCart() {
    setCart({});
    setCartUom({});
    setOrderDiscountPercent(0);
    setCashTenderedInput("");
    setSaleMessage(null);
    setError(null);
  }

  const cartLines = Object.entries(cart)
    .map(([itemId, qty]) => {
      const item = items.find((i) => i.id === itemId);
      const unitName = cartUom[itemId] || item?.unit || "Piece";
      const unitPrice = item ? getItemUnitPrice(item, priceTier, unitName) : 0;
      const ratio = item ? getUomRatio(item, unitName) : 1;
      const basePieces = qty * ratio;
      const lineSubtotal = unitPrice * qty;
      return item ? { item, qty, unitName, unitPrice, ratio, basePieces, lineSubtotal } : null;
    })
    .filter((line): line is { item: ItemResponse; qty: number; unitName: string; unitPrice: number; ratio: number; basePieces: number; lineSubtotal: number } => line !== null);

  const subtotal = cartLines.reduce((sum, line) => sum + line.lineSubtotal, 0);
  const discountAmount = subtotal * (orderDiscountPercent / 100);
  const netTotal = Math.max(0, subtotal - discountAmount);

  const cashTendered = parseFloat(cashTenderedInput) || 0;
  const changeDue = Math.max(0, cashTendered - netTotal);

  function handleSetDiscountRequest(percent: number) {
    if (percent <= 0) {
      setOrderDiscountPercent(0);
      return;
    }

    // Check if any cart item blocks discounts
    const blockedItem = cartLines.find((l) => l.item.blockDiscount);
    if (blockedItem) {
      setError(`Discount blocked! Product "${blockedItem.item.name}" has discount restrictions.`);
      return;
    }

    // Check max discount caps
    const exceededItem = cartLines.find((l) => percent > (Number(l.item.maxDiscountPercent) || 10));
    if (exceededItem || percent > 10) {
      setPendingDiscount(percent);
      setPinError(null);
      setInputPin("");
      setManagerPinModal(true);
      return;
    }

    setOrderDiscountPercent(percent);
    setError(null);
  }

  function handleAuthorizeManagerPin() {
    if (inputPin === "1234" || inputPin === "8888") {
      if (pendingDiscount !== null) {
        setOrderDiscountPercent(pendingDiscount);
      }
      setManagerPinModal(false);
      setPendingDiscount(null);
      setPinError(null);
      setError(null);
    } else {
      setPinError("Invalid Manager PIN Code! Contact Branch Supervisor.");
    }
  }

  async function handleCharge() {
    if (cartLines.length === 0) return;

    if (paymentMethod === "CASH" && cashTendered < netTotal) {
      setError(`Cash tendered (${formatKD(cashTendered)} KD) is less than Net Payable (${formatKD(netTotal)} KD)`);
      return;
    }

    const branchId = user?.branchId || currentBranch?.id || "cfbb7132-6c84-442b-86a5-3a4d03b5e089";
    const userId = user?.id || "0f4c78ce-14cc-4d67-86f8-a12ddfea3ef7";
    const invoiceNumber = `POS-${Date.now().toString().slice(-6)}`;
    const branchName = (currentBranch as any)?.name || "Bin Essa Head Office - Shuwaikh";
    const cashierName = (user as any)?.fullName || (user as any)?.username || (user as any)?.name || "Authorized Cashier";

    // Snapshot base stock deductions for sold items
    const baseStockDeductions: Record<string, number> = {};
    cartLines.forEach((l) => {
      baseStockDeductions[l.item.id] = l.basePieces;
    });

    setIsSubmitting(true);
    setError(null);
    try {
      await createSalesInvoiceRequest({
        invoiceNumber,
        branchId,
        userId,
        paymentMethod,
        lines: cartLines.map((l) => ({
          itemId: l.item.id,
          quantity: l.basePieces,
          unitPrice: l.unitPrice,
        })),
      });

      // Instantly decrement in-memory product stock for sold items
      setItems((prevItems) =>
        prevItems.map((item) => {
          const baseDeduction = baseStockDeductions[item.id] ?? 0;
          if (baseDeduction > 0) {
            const currentStock = Number(item.stockQuantity ?? 0);
            return { ...item, stockQuantity: Math.max(0, currentStock - baseDeduction) };
          }
          return item;
        })
      );

      // Generate Ministry of Commerce Compliant Dual-Language Thermal Receipt
      setSaleReceipt({
        invoiceNumber,
        date: new Date().toLocaleString(),
        customerName: selectedCustomer.name,
        cashierName,
        branchName,
        lines: cartLines.map((l) => ({
          name: l.item.name,
          unitName: l.unitName,
          qty: l.qty,
          unitPrice: l.unitPrice,
          lineTotal: l.lineSubtotal,
        })),
        subtotal,
        discountAmount,
        netTotal,
        paymentMethod,
        cashTendered: paymentMethod === "CASH" ? cashTendered : netTotal,
        changeDue: paymentMethod === "CASH" ? changeDue : 0,
      });

      setSaleMessage(`Sale Complete! Invoice ${invoiceNumber} posted.`);
      setCart({});
      setCartUom({});
      setOrderDiscountPercent(0);
      setCashTenderedInput("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sale failed");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="grid grid-cols-1 gap-6 p-6 lg:grid-cols-3">
      {/* Left: Search + Customer Selector + Product Catalog */}
      <div className="space-y-4 lg:col-span-2">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-ink">Point of Sale (POS)</h1>
            <p className="text-xs text-ink/50 mt-0.5">Bin Essa Smoking Center & Retail Sales Register</p>
          </div>
          <div className="flex items-center gap-2">
            <input
              ref={barcodeInputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Scan barcode or search SKU..."
              className="w-full rounded-xl border border-ink/10 bg-white px-4 py-2.5 text-sm shadow-sm outline-none focus:border-gold sm:w-64 font-mono"
            />
            <button
              type="button"
              onClick={() => loadItems()}
              className="rounded-xl border border-ink/10 bg-white px-3 py-2.5 text-xs font-semibold text-ink hover:bg-gold transition-colors whitespace-nowrap shadow-sm"
              title="Refresh Products Catalog"
            >
              ↻ Sync
            </button>
          </div>
        </div>

        {/* Customer Account & Price Tier Control Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-ink/10 shadow-xs">
          {/* Customer Selection Dropdown */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-ink/70">Customer:</span>
            <select
              value={selectedCustomer.id}
              onChange={(e) => {
                const found = MOCK_CUSTOMERS.find((c) => c.id === e.target.value);
                if (found) handleSelectCustomer(found);
              }}
              className="rounded-xl border border-ink/15 bg-slate-50 px-3 py-1.5 text-xs font-bold text-ink outline-none focus:border-gold"
            >
              {MOCK_CUSTOMERS.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.tier})
                </option>
              ))}
            </select>

            {selectedCustomer.creditLimit > 0 && (
              <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-200">
                Limit: {formatKD(selectedCustomer.creditLimit)} KD
              </span>
            )}
          </div>

          {/* Price Tier Selector */}
          <div className="flex items-center gap-1.5 bg-ink/5 p-1 rounded-xl">
            <span className="text-[11px] font-bold text-ink/60 px-2">Active Tier:</span>
            {(["RETAIL", "SEMI_WHOLESALE", "WHOLESALE"] as const).map((tier) => (
              <button
                key={tier}
                type="button"
                onClick={() => setPriceTier(tier)}
                className={`px-2.5 py-1 text-xs font-bold rounded-lg transition whitespace-nowrap ${
                  priceTier === tier
                    ? "bg-ink text-white shadow-xs"
                    : "text-ink/70 hover:text-ink"
                }`}
              >
                {tier === "RETAIL" ? "🏷️ Retail" : tier === "SEMI_WHOLESALE" ? "🏢 Semi-WS" : "📦 Wholesale"}
              </button>
            ))}
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto text-xs py-0.5 bg-white p-2 rounded-2xl border border-ink/10">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`rounded-lg px-2.5 py-1 font-semibold transition whitespace-nowrap ${
                selectedCategory === cat
                  ? "bg-gold text-ink font-bold shadow-xs"
                  : "bg-ink/5 text-ink/70 hover:bg-ink/10"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-xs font-semibold text-red-700">
            {error}
          </div>
        )}

        {isLoading ? (
          <div className="rounded-2xl border border-ink/10 bg-white p-8 text-center text-sm text-ink/50 shadow-sm">
            Loading database products...
          </div>
        ) : items.length === 0 ? (
          <div className="rounded-2xl border border-ink/10 bg-white p-8 text-center text-sm text-ink/40 shadow-sm">
            No items found in database. Please create products in Inventory.
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
            {searchedItems.map((item) => {
              const stock = Number(item.stockQuantity ?? 0);
              const outOfStock = stock <= 0;
              const isLowStock = stock > 0 && stock <= 10;
              const unitStr = item.unit || "pcs";
              const activePrice = getItemUnitPrice(item, priceTier);

              return (
                <button
                  key={item.id}
                  onClick={() => addToCart(item)}
                  disabled={outOfStock}
                  className={`flex flex-col justify-between rounded-2xl border p-4 text-start transition shadow-sm relative ${
                    outOfStock
                      ? "border-red-200 bg-red-50/30 opacity-60 cursor-not-allowed"
                      : isLowStock
                      ? "border-amber-200 bg-white hover:border-amber-400 hover:shadow-md"
                      : "border-ink/10 bg-white hover:border-gold hover:shadow-md"
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-gold uppercase tracking-wider">{item.category}</span>
                      <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-ink/5 text-ink/70">
                        {priceTier === "RETAIL" ? "Retail" : priceTier === "SEMI_WHOLESALE" ? "Semi-WS" : "Wholesale"}
                      </span>
                    </div>

                    <h3 className="line-clamp-2 text-sm font-bold text-ink mt-0.5">{item.name}</h3>
                    <p className="numeric-ltr text-xs text-ink/50 font-mono">SKU: {item.sku}</p>

                    {/* Admin Governance Badges */}
                    <div className="flex flex-wrap gap-1 mt-1.5">
                      {item.trackExpiry && (
                        <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-amber-100 text-amber-800 border border-amber-200">
                          📅 Expiry
                        </span>
                      )}
                      {item.blockFreeGift && (
                        <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-red-100 text-red-700 border border-red-200">
                          🚫 No Gift
                        </span>
                      )}
                      {item.blockDiscount ? (
                        <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-red-100 text-red-700 border border-red-200">
                          🔒 No Disc
                        </span>
                      ) : (
                        <span className="text-[9px] font-semibold px-1.5 py-0.2 rounded bg-slate-100 text-slate-700 border border-slate-200">
                          🏷️ Max {item.maxDiscountPercent ?? 10}%
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="mt-4 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="numeric-ltr text-sm font-bold text-ink">
                        {formatKD(activePrice)} KD
                      </span>
                    </div>
                    <div>
                      <span
                        className={`inline-block text-[11px] font-bold px-2 py-0.5 rounded-md ${
                          outOfStock
                            ? "bg-red-100 text-red-700 border border-red-200"
                            : isLowStock
                            ? "bg-amber-100 text-amber-800 border border-amber-200"
                            : "bg-emerald-100 text-emerald-800 border border-emerald-200"
                        }`}
                      >
                        {outOfStock
                          ? "Out of Stock (0)"
                          : isLowStock
                          ? `Low Stock: ${stock} ${unitStr}`
                          : `Stock: ${stock} ${unitStr}`}
                      </span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Right: Cart Sidebar & Financial Calculations */}
      <div className="flex flex-col justify-between rounded-2xl border border-ink/10 bg-white p-5 shadow-sm space-y-4">
        <div>
          <div className="mb-3 flex items-center justify-between border-b border-ink/10 pb-3">
            <div>
              <h2 className="text-base font-bold text-ink">Current Order Cart</h2>
              <span className="text-xs font-semibold text-ink/50">
                Customer: {selectedCustomer.name} ({priceTier})
              </span>
            </div>
            {cartLines.length > 0 && (
              <button
                onClick={clearCart}
                className="text-xs font-semibold text-red-600 hover:underline"
              >
                Clear Cart
              </button>
            )}
          </div>

          {saleMessage && (
            <div className="mb-4 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-xs font-semibold text-emerald-800">
              {saleMessage}
            </div>
          )}

          {cartLines.length === 0 ? (
            <div className="py-12 text-center text-sm text-ink/40">
              Order cart is empty. Click items on the left to add.
            </div>
          ) : (
            <div className="max-h-[300px] overflow-y-auto divide-y divide-ink/5">
              {cartLines.map(({ item, qty, unitName, unitPrice, lineSubtotal }) => {
                const availableUoms = item.uoms && item.uoms.length > 0
                  ? item.uoms
                  : [
                      { unitName: "Piece", conversionRatio: 1 },
                      { unitName: "Pack", conversionRatio: 5 },
                      { unitName: "Box", conversionRatio: 100 },
                      { unitName: "Carton", conversionRatio: 1000 },
                    ];

                return (
                  <div key={item.id} className="py-2.5 space-y-1">
                    <div className="flex items-center justify-between">
                      <h4 className="line-clamp-1 text-xs font-bold text-ink">{item.name}</h4>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-xs text-red-600 hover:underline px-1"
                      >
                        ✕
                      </button>
                    </div>

                    <div className="flex items-center justify-between text-xs">
                      {/* Multi-UOM Selector */}
                      <select
                        value={unitName}
                        onChange={(e) => updateItemUom(item.id, e.target.value)}
                        className="rounded-lg border border-ink/20 px-2 py-0.5 text-[10px] font-bold text-ink bg-slate-50 outline-none focus:border-gold"
                      >
                        {availableUoms.map((u) => (
                          <option key={u.unitName} value={u.unitName}>
                            {u.unitName} (1:{u.conversionRatio})
                          </option>
                        ))}
                      </select>

                      <span className="numeric-ltr text-xs font-mono font-bold text-ink">
                        {formatKD(unitPrice)} KD × {qty} = {formatKD(lineSubtotal)} KD
                      </span>

                      {/* Quantity Controls */}
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => updateQty(item.id, qty - 1)}
                          className="h-6 w-6 rounded-lg border border-ink/20 text-xs font-bold text-ink hover:bg-ink/5"
                        >
                          -
                        </button>
                        <span className="w-4 text-center text-xs font-bold text-ink">{qty}</span>
                        <button
                          onClick={() => updateQty(item.id, qty + 1)}
                          className="h-6 w-6 rounded-lg border border-ink/20 text-xs font-bold text-ink hover:bg-ink/5"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Calculation Engine & Payment Section */}
        <div className="border-t border-ink/10 pt-3 space-y-3 text-xs">
          {/* Subtotal, Discount & Net Payable breakdown */}
          <div className="space-y-1.5 bg-slate-50 p-3 rounded-xl border border-ink/10 font-mono">
            <div className="flex justify-between text-ink/70">
              <span>Gross Subtotal:</span>
              <span className="font-bold">{formatKD(subtotal)} KD</span>
            </div>

            {/* Discount Selector */}
            <div className="flex items-center justify-between pt-1 border-t border-ink/5">
              <span className="font-semibold text-ink/70">Order Discount (%):</span>
              <div className="flex items-center gap-1">
                {[0, 5, 10, 15].map((d) => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => handleSetDiscountRequest(d)}
                    className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                      orderDiscountPercent === d
                        ? "bg-ink text-white"
                        : "bg-white border border-ink/15 text-ink/70 hover:bg-ink/5"
                    }`}
                  >
                    {d}%
                  </button>
                ))}
              </div>
            </div>

            {discountAmount > 0 && (
              <div className="flex justify-between text-red-600 font-semibold text-[11px]">
                <span>Discount ({orderDiscountPercent}%):</span>
                <span>-{formatKD(discountAmount)} KD</span>
              </div>
            )}

            <div className="flex justify-between font-bold text-ink text-sm pt-1 border-t border-ink/10">
              <span>Net Payable Total:</span>
              <span className="numeric-ltr text-gold">{formatKD(netTotal)} KD</span>
            </div>
          </div>

          {/* Payment Method Selector */}
          <div>
            <label className="mb-1 block text-xs font-semibold text-ink/70">Payment Method</label>
            <select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value as any)}
              className="w-full rounded-xl border border-ink/15 bg-white px-3 py-2 text-xs font-bold text-ink outline-none focus:border-gold"
            >
              <option value="CASH">Cash Drawer</option>
              <option value="CARD">Card / K-Net Terminal</option>
              <option value="CREDIT">Wholesale Credit</option>
              <option value="BANK_TRANSFER">Bank Wire Transfer</option>
            </select>
          </div>

          {/* Cash Tendered & Change Due Calculator (If Cash) */}
          {paymentMethod === "CASH" && (
            <div className="space-y-2 bg-amber-50/50 p-3 rounded-xl border border-amber-200">
              <div className="flex items-center justify-between gap-2">
                <label className="text-xs font-bold text-amber-900">Cash Received (KD):</label>
                <input
                  type="number"
                  step="0.5"
                  placeholder={formatKD(netTotal)}
                  value={cashTenderedInput}
                  onChange={(e) => setCashTenderedInput(e.target.value)}
                  className="w-32 rounded-lg border border-amber-300 bg-white px-2.5 py-1 text-xs font-mono font-bold text-ink outline-none focus:border-amber-500 text-end"
                />
              </div>

              {/* Quick Cash Buttons */}
              <div className="flex items-center justify-end gap-1">
                {[1, 5, 10, 20].map((amt) => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => setCashTenderedInput((prev) => (parseFloat(prev || "0") + amt).toString())}
                    className="px-2 py-0.5 rounded bg-amber-100 hover:bg-amber-200 text-amber-900 text-[10px] font-bold border border-amber-300"
                  >
                    +{amt} KD
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => setCashTenderedInput(netTotal.toString())}
                  className="px-2 py-0.5 rounded bg-amber-800 text-white text-[10px] font-bold"
                >
                  Exact
                </button>
              </div>

              <div className="flex justify-between font-bold text-amber-950 text-xs pt-1 border-t border-amber-200">
                <span>Change Due to Customer:</span>
                <span className="numeric-ltr text-amber-700 font-mono text-sm">{formatKD(changeDue)} KD</span>
              </div>
            </div>
          )}

          <button
            onClick={handleCharge}
            disabled={cartLines.length === 0 || isSubmitting}
            className="w-full rounded-xl bg-ink py-3 text-sm font-bold text-white shadow hover:bg-gold hover:text-ink disabled:opacity-40 transition-colors"
          >
            {isSubmitting ? "Processing Sale..." : "Complete Sale & Post GL"}
          </button>
        </div>
      </div>

      {/* Manager Passcode Override Modal */}
      {managerPinModal && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 max-w-sm w-full space-y-4 shadow-2xl text-slate-800">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">🔒 Manager Discount Override</h3>
              <button onClick={() => setManagerPinModal(false)} className="text-slate-400 hover:text-slate-600 font-bold text-sm">
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-600">
              Requested discount ({pendingDiscount}%) exceeds cashier authorization limit. Please enter Manager PIN code to authorize.
            </p>

            {pinError && (
              <div className="p-2.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold">
                ⚠️ {pinError}
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Supervisor PIN Passcode</label>
              <input
                type="password"
                maxLength={6}
                value={inputPin}
                onChange={(e) => setInputPin(e.target.value)}
                placeholder="Enter PIN (e.g. 1234)"
                className="w-full rounded-xl border border-slate-300 px-3 py-2 text-center text-lg font-mono tracking-widest text-slate-900 outline-none focus:border-indigo-600 bg-slate-50"
              />
            </div>

            <div className="pt-2 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setManagerPinModal(false)}
                className="px-4 py-2 rounded-xl text-slate-500 font-bold hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleAuthorizeManagerPin}
                className="px-5 py-2.5 rounded-xl bg-ink text-white font-bold hover:bg-gold hover:text-ink shadow-md transition"
              >
                Authorize Discount
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Ministry of Commerce Printable Dual-Language Thermal Receipt Modal */}
      {saleReceipt && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-300 rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl text-slate-900 font-mono text-xs">
            <div className="text-center border-b border-dashed border-slate-300 pb-3 space-y-1">
              <h2 className="text-base font-black text-slate-900">BIN ESSA SMOKING CENTER</h2>
              <p className="text-[11px] font-bold text-slate-700">مركز بن عيسى للمدخنين</p>
              <p className="text-[10px] text-slate-500">{saleReceipt.branchName}</p>
              <p className="text-[10px] text-slate-500">Commercial Reg: 349920 | Ministry Tax ID: 0.000%</p>
            </div>

            <div className="space-y-1 text-[11px] text-slate-700 border-b border-dashed border-slate-300 pb-2">
              <div className="flex justify-between">
                <span>Receipt #:</span>
                <span className="font-bold">{saleReceipt.invoiceNumber}</span>
              </div>
              <div className="flex justify-between">
                <span>Date & Time:</span>
                <span>{saleReceipt.date}</span>
              </div>
              <div className="flex justify-between">
                <span>Cashier:</span>
                <span>{saleReceipt.cashierName}</span>
              </div>
              <div className="flex justify-between">
                <span>Customer:</span>
                <span>{saleReceipt.customerName}</span>
              </div>
            </div>

            {/* Line Items List */}
            <div className="space-y-2 border-b border-dashed border-slate-300 pb-3 max-h-[220px] overflow-y-auto">
              <div className="flex justify-between font-bold text-slate-900 text-[10px] uppercase border-b border-slate-200 pb-1">
                <span>Description</span>
                <span>Qty × Unit</span>
                <span>Amount KD</span>
              </div>

              {saleReceipt.lines.map((l, idx) => (
                <div key={idx} className="flex justify-between text-[11px]">
                  <span className="font-sans font-bold line-clamp-1 w-36">{l.name}</span>
                  <span>{l.qty} {l.unitName} × {formatKD(l.unitPrice)}</span>
                  <span className="font-bold">{formatKD(l.lineTotal)} KD</span>
                </div>
              ))}
            </div>

            {/* Receipt Summary */}
            <div className="space-y-1 text-slate-800 text-[11px] pt-1">
              <div className="flex justify-between">
                <span>Gross Subtotal:</span>
                <span>{formatKD(saleReceipt.subtotal)} KD</span>
              </div>
              {saleReceipt.discountAmount > 0 && (
                <div className="flex justify-between text-red-600">
                  <span>Discount:</span>
                  <span>-{formatKD(saleReceipt.discountAmount)} KD</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Sales Tax (0% KD):</span>
                <span>0.000 KD</span>
              </div>
              <div className="flex justify-between font-black text-sm text-slate-950 pt-1 border-t border-slate-900">
                <span>TOTAL PAID:</span>
                <span>{formatKD(saleReceipt.netTotal)} KD</span>
              </div>

              <div className="flex justify-between pt-1 text-slate-600">
                <span>Method:</span>
                <span className="font-bold">{saleReceipt.paymentMethod}</span>
              </div>
              {saleReceipt.paymentMethod === "CASH" && (
                <>
                  <div className="flex justify-between">
                    <span>Cash Tendered:</span>
                    <span>{formatKD(saleReceipt.cashTendered)} KD</span>
                  </div>
                  <div className="flex justify-between font-bold text-amber-900">
                    <span>Change Returned:</span>
                    <span>{formatKD(saleReceipt.changeDue)} KD</span>
                  </div>
                </>
              )}
            </div>

            <div className="text-center pt-3 border-t border-dashed border-slate-300 text-[10px] text-slate-500">
              <p>Thank you for shopping with Bin Essa Smoking Center!</p>
              <p>شكراً لتسوقكم مع مركز بن عيسى للمدخنين</p>
            </div>

            <div className="pt-2 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setSaleReceipt(null)}
                className="px-4 py-2 rounded-xl text-slate-600 font-bold hover:bg-slate-100"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => window.print()}
                className="px-5 py-2.5 rounded-xl bg-ink text-white font-bold hover:bg-gold hover:text-ink shadow-md transition"
              >
                🖨️ Print ESC/POS Receipt
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
