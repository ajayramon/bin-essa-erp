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

## 8. Master Project Context & Workflow Development Philosophy

### Core Architectural Philosophy
- **Workflows Over Screens**: Never build isolated screens or incomplete modules. Always build complete, connected business workflows from start to finish.
- **Sequential Lockdown**: Each workflow must be fully functional, connected across all related modules, tested, and approved before beginning the next workflow. Once approved, a workflow is locked down.
- **Zero UI-Only Features**: Every action must update the database, inventory balances, GL journal entries, reports, audit logs, and dashboard metrics automatically.

### System Architecture & Application Boundaries
- **Central NestJS Backend + PostgreSQL Database + Single JWT Auth**: All applications communicate with one backend API and database. No duplicated business logic.
- **Application Separation**:
  1. **Admin ERP (`admin.domain.com` / `/`)**: Master Head Office control for Products, Inventory, Purchasing, Accounting, Pricing, Reports, Permissions, Companies, Branches, Settings.
  2. **Branch POS (`pos.domain.com` / `/pos`)**: Independent sales counter terminal strictly scoped to `branchId` (Sales, Cash Drawer, Local Stock, Cashier Login, Daily Closing).
  3. **B2B Customer Portal (`b2b.domain.com` / `/b2b`)**: Wholesale customer self-service ordering, contract price tiers, and credit limit visibility.
  4. **Sales Rep Mobile App**: Offline-first wholesale ordering and payment collection.

### Master Development Workflow Sequence
- **Workflow 1 (ACTIVE & CURRENT FOCUS)**: Product Purchasing & Sales Cycle
  - Create Product ➔ Create Supplier ➔ Create Purchase Order ➔ Approve Purchase Order ➔ Goods Receipt ➔ Inventory Automatically Increased ➔ Weighted Average Cost (WAC) Recalculated ➔ Landed Cost Allocated ➔ Auto Journal Entry Created (Debit Inventory Asset 1200 / Credit Accounts Payable 2000) ➔ Available in POS ➔ Cashier Sells Product ➔ Inventory Decreases Automatically ➔ Sales Invoice Generated ➔ Customer Balance Updated ➔ Cash/Bank Updated ➔ Auto Accounting Entries Created (Revenue & COGS) ➔ Dashboard Updates ➔ Inventory Reports Update ➔ Financial Reports Update ➔ Audit Log Created.
- **Workflow 2**: Inventory Operations (Transfers, Adjustments, Counts, Barcodes, Warehouse Operations).
- **Workflow 3**: Financial Accounting (AR, AP, Cash, Bank, Financial Statements).
- **Workflow 4**: B2B Portal.
- **Workflow 5**: Sales Representative Mobile App.
- **Workflow 6**: HR & Payroll.
- **Workflow 7**: Advanced Reporting & Commercial Intelligence.

### Workflow Lockdown Question
When suggesting or evaluating the next task, ALWAYS ask:
*"Does this complete the current workflow, or does it introduce a new feature?"*
If it introduces a new feature before the current workflow is complete, postpone it until the workflow is finished!

## 9. Official ERP Development Standards & Governance
- **15 Enterprise Pillars**: Every implementation must strictly follow [ERP_DEVELOPMENT_STANDARDS.md](file:///c:/Users/Abdul/bin-essa-erp/ERP_DEVELOPMENT_STANDARDS.md) covering Database Transactions (`$transaction`), Backend Service Logic, Movement-Based Inventory Ledger (`InventoryMovement`), Immutable Double-Entry GL Journal Entries (`sum(debit) === sum(credit)`), Reversing Entries for Corrections, Branch Isolation (`branchId`), Backend Permission Guards, Immutable Audit Logs, Soft Delete (`isActive`/`status`), Modular REST APIs, Indexing & Pagination, and Clean Error Validation payloads.

## 10. Project Memory — Git, Secrets & Documentation Rules

### 1. NEVER COMMIT SECRETS
NEVER commit, push, or expose:
- `.env`, `.env.local`, `.env.production`, `.env.development`, `.env.*` containing real values
- Database passwords, `DATABASE_URL` with real credentials, PostgreSQL usernames/passwords
- `JWT_SECRET`, session secrets, API keys, OAuth client secrets, private keys, SSH keys
- Cloud credentials (AWS / GCP / Azure), Vercel tokens, GitHub tokens, Firebase service accounts
- Stripe secret keys, payment provider secrets, Redis passwords, SMTP passwords
- Any customer/client credentials, or any production authentication credentials

Before every commit, inspect changed files and verify that no secret or credential is included.

**If a secret is accidentally committed:**
1. STOP immediately.
2. Do not push further changes.
3. Remove the secret from the working tree.
4. Check whether it exists in Git history.
5. If already pushed, treat the secret as COMPROMISED.
6. Alert the project owner immediately.
7. Rotate/revoke the exposed credential.
8. Remove it from Git history if required.
9. Verify the repository no longer contains the secret.
10. Only then continue development.
*NEVER simply hide a secret in a later commit and assume it is safe.*

### 2. REQUIRED .gitignore
Keep sensitive/local files excluded from Git:
```gitignore
.env
.env.*
!.env.example
!.env*.example

node_modules/
.next/
dist/
backups/
*.sql
*.sql.gz
*.dump
*.pem
*.key
```
Do not blindly add exclusions that hide important source code.

### 3. WHAT SHOULD BE COMMITTED
Normal source code and project configuration SHOULD be committed, including:
- Next.js source code, React components, NestJS source code
- Prisma schema, Prisma migrations, API services, DTOs, Controllers
- Database models/schema definitions, Dockerfile, docker-compose.yml, nginx.conf
- package.json, package-lock.json, tsconfig files, next.config files, Tailwind config
- Public assets, translation dictionaries, tests, test scripts, database seed code
- Backup/restore SCRIPTS (but NEVER actual backup files)
- Deployment configuration that contains NO secrets
- `.env.example` with placeholder values only
- Documentation needed to operate or understand the project

**Examples:**
- `GOOD`: `DATABASE_URL="postgresql://USERNAME:PASSWORD@HOST:5432/DATABASE"`
- `BAD`: `DATABASE_URL="postgresql://realuser:RealPassword@production-server:5432/bin_essa"`

### 4. AGENTS.md
`AGENTS.md` MAY and SHOULD be committed if it contains architecture, standards, workflows, git/security rules, and instructions.
However, `AGENTS.md` must NEVER contain real passwords, API keys, tokens, private credentials, production secrets, or customer confidential information. Use placeholders like `YOUR_DATABASE_URL`, `YOUR_API_KEY`, `YOUR_DOMAIN`.

### 5. MARKDOWN DOCUMENTATION
Normal `.md` documentation MAY be committed (`README.md`, `AGENTS.md`, `architecture.md`, `walkthrough.md`, etc.).
Every Markdown file must be checked for passwords, API keys, tokens, private URLs, connection strings, and confidential information. *Documentation is NOT automatically safe just because it is `.md`.*

### 6. WALKTHROUGH FILES
`walkthrough.md` and similar files can be committed if they document features completed, tests performed, architecture, business workflows, and verification results.
Before committing, remove or replace real credentials, secrets, private tokens, production connection strings, and sensitive customer information.
- `GOOD`: "Production database is PostgreSQL 16."
- `BAD`: "Production database is postgresql://admin:SuperSecretPassword@..."

### 7. GIT STATUS CHECK BEFORE EVERY COMMIT
Before every commit, run `git status`, inspect `git diff`, and when appropriate `git diff --cached`.
Do NOT automatically use `git add .` without first reviewing what will be committed.
Prefer explicitly staging project files:
`git add app/`, `git add backend/`, `git add components/`, `git add lib/`, `git add package.json`, etc.

### 8. SECRET SCAN BEFORE PUSH
Before pushing, search changed files for suspicious credentials (`API_KEY`, `SECRET`, `PASSWORD`, `TOKEN`, `DATABASE_URL`, `PRIVATE_KEY`, `JWT_SECRET`, `STRIPE_SECRET`, `AWS_SECRET`, `SERVICE_ACCOUNT`).
If a real credential is found, DO NOT COMMIT OR PUSH IT.

### 9. NEVER FORCE-PUSH OR REWRITE HISTORY
Do not use `git push --force` or rewrite Git history unless explicitly authorized by the project owner. If secrets were previously committed, STOP and report the issue before attempting history cleanup.

### 10. BEFORE DEPLOYMENT VERIFICATION
Before production deployment verify:
- No `.env` file is tracked.
- No secrets are present in source code or Markdown files.
- No database dumps or backup archives are committed.
- No credentials exist in Dockerfiles or docker-compose.yml.
- Production secrets are supplied through the server/environment configuration.
- `.env.example` contains placeholders only.

### 11. AGENT BEHAVIOR & PRIORITY HIERARCHY
Do not optimize for "successful commit" at the expense of security. The mandatory priority order is:
1. Protect secrets.
2. Protect customer/business data.
3. Preserve working source code.
4. Test changes.
5. Review Git diff.
6. Commit.
7. Push.
8. Deploy.

