# Bin Essa ERP - Project Engineering & Communication Standards

## 1. Zero AI Boilerplate & Client Communication Policy
- **No AI Trait or Generic Phrasing**: Never use artificial AI boilerplate (e.g., "As an AI model...", "Here is your requested...", "In summary...").
- **Senior Engineering Voice**: All client messages, project plans, and technical documentation must be direct, human-authored, professional, and business-driven.
- **Client Scenario Focus**: Client requirements sent from business owners (such as Mr. Ali) must be evaluated against real retail/wholesale ERP operational workflows.

## 2. Real Production-Grade Code Standards
- **No Random or Fake Interfaces**: Every component and screen added must represent functional business logic tied to the core database and API layer.
- **Financial Precision**: All Kuwaiti Dinar (KWD) transactions must strictly enforce 3-decimal numeric precision (`Decimal(10, 3)`).
- **Double-Entry Accounting Engine**: Every monetary transaction (Sales Invoices, Vendor Bills, Customer Payments, Returns) must automatically trigger balanced Debit and Credit journal entries (`sum(debit) === sum(credit)`).
- **Strict Server Security**: All protected internal routes (`/pos`, `/inventory`, `/accounting`, `/purchasing`, `/promotions`, etc.) must be strictly guarded via server-side middleware (`middleware.ts`) and verified JWT tokens.

## 3. Kuwait Legal, Tax & Retail Operational Compliance
- **Kuwait Currency Standard**: All customer receipts, invoices, vendor bills, and financial statements must format monetary values strictly in Kuwaiti Dinar with 3 decimals (e.g., `12.500 KD`).
- **Ministry of Commerce Bilingual Standard**: All commercial documents and user interfaces must enforce dual English/Arabic (`en`/`ar`) translation and dynamic RTL/LTR support.
- **Tax Policy Configuration**: Default sales tax remains 0.000 KWD in accordance with Kuwait commercial regulations, while supporting customizable tax rates if introduced.
- **Discount & Override Auditability**: Under Kuwait commercial governance, every manual price adjustment, cashier discount, or promotion must generate an immutable audit log (`DiscountAuditLog`) capturing user, timestamp, invoice #, original price, discount granted, net total, reason, and approving manager PIN to prevent internal unauthorized discounts.

## 4. Enterprise Branch Boundary & Role Governance
- **Branch Boundaries**: Cashiers and Storekeepers are strictly scoped to their assigned branch (`branchId`). Cross-branch inventory transfers must follow formal `StockTransfer` request, dispatch, and receipt confirmation stages.
- **Manager Passcode Overrides**: Any manual discount exceeding cashier authorization limits (default 10%) or price modification requires verified Manager PIN passcode authorization.

## 5. Modern Market-Standard Tech Stack
- **Frontend**: Next.js 16 (App Router), React 19, Tailwind CSS v4, Lucide React.
- **Backend**: NestJS 11 modular microservice architecture, Passport JWT strategy, Bcrypt password hashing.
- **Data & ORM**: PostgreSQL, Prisma ORM 7.x (`@prisma/adapter-pg` native driver).
- **Localization**: Full bilingual English/Arabic (`en`/`ar`) translation layer with dynamic RTL/LTR support.

## 6. Bin Essa Group Corporate Memory & Commercial Portfolio
- **Corporate Entity**: Bin Essa Smoking Center (Est. 2010) — Kuwait's leading retail & wholesale smoking accessories, marine/outdoor, and art supply group.
- **Retail Network**:
  - 12 Bin Essa Smoking Center retail branches across Kuwait.
  - Bin Essa Khiran (marine supplies, fishing gear, gym boards, outdoor equipment).
  - 2 JM Art Zone branches (customized gifts, acrylic products, mugs, signage, decorative items).
- **Wholesale Key Client Accounts**: Trolley, Bodega, Lulu Hypermarket, Hi & Buy, Al Naser, Oncost, Dukan, City Centre, 50%+ of Kuwait vape shops, and A-Class grocery/mini-market network.
- **Product Categories**: Disposable Vape Devices, Pod Systems & Vape Products, Nicotine Pouches, Dokha & Medwakh, Cigarette Lighters, Rolling Papers, Rolling Paper Tobacco (HBT), Pipe Accessories, Smoking Accessories, General Accessories.
## 7. 14-Branch Enterprise ERP Specifications & Discovery Memory
- **14 Physical Stores + Head Office Architecture**: Single centralized PostgreSQL database carrying `branchId` on every record. Real-time head office consolidation across 14 retail counters and 1 central warehouse (Shuwaikh Main Branch).
- **Catalog Scale**: 20,000+ active SKUs today; unlimited/scalable, no cap going forward.
- **Phenix ERP Data Migration**: Full data migration protocol (products, customers, suppliers, stock opening balances, chart of accounts, AP/AR open ledgers, 12+ months historical sales/purchases).
- **USD Landed-Cost Purchasing Engine**: Multi-currency purchase entry in USD capturing exchange rate at order time. Freight, customs duties, and handling fees are automatically allocated across received item unit costs via moving-average or FIFO costing.
- **Offline-First Sales Rep Mobile App (Android/Flutter)**: Reps take wholesale orders and record payment collections offline. Auto-syncs with backend when internet reconnects. Head-office price and credit limit rules take precedence on sync.
- **B2B Wholesale Customer Portal**: Wholesale customer self-service ordering, tier-based pricing/discounts, live credit limit visibility, and order approval workflows.
- **Per-Item Commercial Controls**: Per-item toggles for `blockDiscount`, `blockFreeGift`, and `blockSale`.
- **Receipt & Label Printers**: ESC/POS thermal receipt printing and ZPL barcode/shelf label printer integration.



