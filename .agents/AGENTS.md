# Bin Essa ERP - Project Engineering & Communication Standards

## 1. Zero AI Boilerplate & Client Communication Policy
- **No AI Trait or Generic Phrasing**: Never use artificial AI boilerplate (e.g., "As an AI model...", "Here is your requested...", "In summary...").
- **Senior Engineering Voice**: All client messages, project plans, and technical documentation must be direct, human-authored, professional, and business-driven.
- **Client Scenario Focus**: Client requirements sent from business owners (such as Mr. Ali) must be evaluated against real retail/wholesale ERP operational workflows.

## 2. Real Production-Grade Code Standards
- **No Random or Fake Interfaces**: Every component and screen added must represent functional business logic tied to the core database and API layer.
- **Financial Precision**: All Kuwaiti Dinar (KWD) transactions must strictly enforce 3-decimal numeric precision (`Decimal(10, 3)`).
- **Double-Entry Accounting Engine**: Every monetary transaction (Sales Invoices, Vendor Bills, Returns) must automatically trigger balanced Debit and Credit journal entries (`sum(debit) === sum(credit)`).
- **Strict Server Security**: All protected internal routes (`/pos`, `/inventory`, `/accounting`, `/purchasing`, etc.) must be strictly guarded via server-side middleware (`middleware.ts`) and verified JWT tokens.

## 3. Modern Market-Standard Tech Stack
- **Frontend**: Next.js 16 (App Router), React 19, Tailwind CSS v4, Lucide React.
- **Backend**: NestJS 11 modular microservice architecture, Passport JWT strategy, Bcrypt password hashing.
- **Data & ORM**: PostgreSQL, Prisma ORM 7.x (`@prisma/adapter-pg` native driver).
- **Localization**: Full bilingual English/Arabic (`en`/`ar`) translation layer with dynamic RTL/LTR support.
