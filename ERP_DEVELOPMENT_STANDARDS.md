# Bin Essa ERP — Official ERP Development Standards & Architectural Rules

**Document Version**: `1.0.0`  
**Target Enterprise**: Bin Essa Group (14 Retail Counters & Shuwaikh Main Warehouse)  
**Core Purpose**: Master architectural standard governing all frontend, backend, ORM, accounting, inventory, security, git, and deployment operations.

---

## 1. Core Architectural Pillars

### 1. Database Transactions (Atomic Rollback)
- Every multi-step financial or inventory operation (e.g. Sales Invoice Posting, Goods Receipt, Inventory Transfer) **must execute inside an atomic database transaction** (`prisma.$transaction`).
- If any individual step fails (e.g. stock validation, journal entry posting, audit logging), the entire transaction **must roll back automatically**.

### 2. Business Services (Backend Service Layer)
- All business logic, validations, price tier calculations, WAC formulas, and accounting entry generation must reside strictly inside **backend service layers**.
- The frontend UI layer (React/Next.js) must only dispatch API requests and render responses—never compute financial GL entries or inventory balances directly.

### 3. Inventory Engine (Movement Ledger Standard)
- Stock balances must **never be directly mutated or hard-overwritten** in production.
- Every inventory change must produce an immutable **`InventoryMovement`** record (`MOVEMENT_IN`, `MOVEMENT_OUT`, `TRANSFER_IN`, `TRANSFER_OUT`, `ADJUSTMENT`).
- Current on-hand stock is calculated as the sum of all historical movement records for that `itemId` and `branchId`.

### 4. Accounting Engine (Double-Entry & Immutability)
- Every monetary transaction must automatically generate balanced Double-Entry Accounting journal entries (`sum(debit) === sum(credit)`).
- **Posted Journal Entries are strictly immutable**. They can never be updated or deleted directly.
- Financial corrections must be executed via formal **Reversing Journal Entries** (`Credit` becomes `Debit`, `Debit` becomes `Credit`).

### 5. Branch Isolation & Role Governance
- Cashiers, Storekeepers, and Branch Managers are strictly scoped to their assigned branch (`branchId`).
- A branch user must **never** view, modify, or query another branch's operational data.
- Head Office Admins (`role: "ADMIN"`) access all 14 branches via a top-level Branch Switcher selector.

### 6. Server-Side Permission Enforcement
- Access control must be enforced on the backend via NestJS Guards and Next.js Server Middleware (`middleware.ts`).
- Users must **never** be able to access restricted endpoints or pages simply by typing a URL or altering client-side state.

### 7. Immutable Audit Logging
- Every critical system action (`PRODUCT_CREATED`, `PURCHASE_RECEIVED`, `POS_SALE`, `STOCK_ADJUSTMENT`, `DISCOUNT_OVERRIDE`) must append a record to `SystemAuditLogRecord` / `AuditLog`.
- Logs must record: `id`, `userId`, `userName`, `userRole`, `companyId`, `branchId`, `documentNumber`, `timestamp`, `action`, `referenceNumber`, and `details`.

### 8. Workflow Integration
- Every completed transaction must automatically update:
  1. **Inventory Movements & On-Hand Balances**
  2. **Double-Entry General Ledger & Trial Balance**
  3. **Executive Dashboard Metrics**
  4. **Financial & Stock Reports**
  5. **System Audit Logs**
- Zero manual intermediate steps allowed.

### 9. Soft Delete Standard
- Production business records (Products, Customers, Suppliers, Invoices, Accounts) must **never be permanently deleted** (`DELETE FROM`).
- Records must use soft-delete flags: `isActive: boolean` or `status: "ARCHIVED"`.

### 10. Modular Reusable API Design
- Backend REST endpoints must be modular, versioned (`/api/v1`), and application-agnostic.
- The **Admin ERP**, **Branch POS**, **B2B Portal**, and **Mobile Sales Rep App** must consume the exact same unified backend API services.

### 11. Performance & Database Indexing
- Database schema must enforce composite indexes on high-frequency query paths (`[branchId, itemId]`, `[branchId, createdAt]`, `[customerId, status]`).
- All list APIs must enforce pagination (`page`, `limit`) with a maximum default limit of 100 items per response.

### 12. Scalability Standard
- Code architecture must accommodate seamless scaling to add new retail branches, new companies, new warehouses, and B2B portals without refactoring core business services.

### 13. Standardized Error Handling & Exceptions
- Every API endpoint must perform strict DTO validation (via `class-validator`) and return standardized error payloads (`{ statusCode, message, errors, timestamp }`).
- All unhandled exceptions must be caught by global exception filters and logged for troubleshooting.

### 14. Testing & Verification Checklist
- Before declaring any workflow complete, run end-to-end verification using completely new data records.
- Verify that stock quantities, accounting ledgers, financial statements, and audit logs update in real time.

### 15. Continuous Documentation Maintenance
- This document, along with `.agents/AGENTS.md`, `implementation_plan.md`, and `walkthrough.md`, must be updated whenever architecture, schemas, or business workflows evolve.

---

## 2. Technical Folder Structure

```
bin-essa-erp/
├── app/                        # Next.js 16 App Router (Frontend Applications)
│   ├── (auth)/                 # Authentication Routes (/login, /b2b-login)
│   ├── (internal)/             # Central Admin ERP Routes
│   │   ├── inventory/          # Item Master & Stock Control
│   │   ├── purchasing/         # Suppliers, POs, Vendor Bills
│   │   ├── accounting/         # GL, Trial Balance, Chart of Accounts, AR/AP
│   │   ├── sales-invoices/     # Sales Invoices Register
│   │   └── settings/           # Branch & Permission Controls
│   ├── pos/                    # Independent Branch POS Counter App (/pos)
│   └── b2b/                    # Wholesale Customer Portal (/b2b)
├── components/                 # Reusable React UI Components
│   ├── domain/                 # Domain-Specific Modals & Modifiers
│   └── ui/                     # Pure UI Tokens & Primitives
├── lib/                        # Client API Drivers & Locale Context
│   ├── api.ts                  # Central API Service Layer & Drivers
│   ├── context/                # Session & Locale Contexts
│   └── i18n/                   # Bilingual English/Arabic Translations
├── backend/                    # NestJS Modular Backend Microservice
│   ├── src/
│   │   ├── modules/            # Domain Modules (auth, items, sales, purchasing, accounting, audit)
│   │   ├── common/             # Interceptors, Filters, Guards, Decorators
│   │   └── database/           # Prisma Service & Repositories
└── prisma/                     # Database Schema & Migration Engine
    └── schema.prisma           # Central PostgreSQL Prisma Schema
```

---

## 3. Naming Conventions

- **Database Tables**: PascalCase singular in Prisma schema (`Item`, `SalesInvoice`, `PurchaseInvoice`, `InventoryMovement`, `JournalEntry`). Snake_case plural in PostgreSQL (`items`, `sales_invoices`, `inventory_movements`).
- **Database Columns**: camelCase in Prisma schema (`branchId`, `stockQuantity`), map to snake_case in SQL (`branch_id`, `stock_quantity`).
- **API Endpoints**: Kebab-case plural REST URIs (`/api/v1/sales-invoices`, `/api/v1/purchase-orders`, `/api/v1/journal-entries`).
- **Typescript Interfaces**: PascalCase with `Payload` or `Response` suffix (`CreateSalesInvoicePayload`, `SalesInvoiceResponse`).

---

## 4. Git & Release Workflow

1. **Branch Model**: `master` branch is protected production.
2. **Commit Standard**: Conventional commits (`feat:`, `fix:`, `docs:`, `refactor:`, `test:`).
3. **Pre-Commit Check**: Must run `npx tsc --noEmit` cleanly with 0 TypeScript errors before pushing.
4. **Vercel Production Release**: Deploy via `npx vercel --prod --force --yes`.

---
*Bin Essa ERP Architecture & Development Governance Board.*
