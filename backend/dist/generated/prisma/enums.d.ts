export declare const BrandId: {
    readonly BIN_ESSA_SMOKING_CENTER: "BIN_ESSA_SMOKING_CENTER";
    readonly BIN_ESSA_KHIRAN: "BIN_ESSA_KHIRAN";
    readonly JM_ART_ZONE: "JM_ART_ZONE";
};
export type BrandId = (typeof BrandId)[keyof typeof BrandId];
export declare const Role: {
    readonly ADMIN: "ADMIN";
    readonly MANAGER: "MANAGER";
    readonly CASHIER: "CASHIER";
    readonly ACCOUNTANT: "ACCOUNTANT";
};
export type Role = (typeof Role)[keyof typeof Role];
export declare const ItemCategory: {
    readonly TOBACCO: "TOBACCO";
    readonly ACCESSORIES: "ACCESSORIES";
    readonly ELECTRONICS: "ELECTRONICS";
    readonly ART_SUPPLIES: "ART_SUPPLIES";
    readonly OTHER: "OTHER";
};
export type ItemCategory = (typeof ItemCategory)[keyof typeof ItemCategory];
export declare const ItemVisibility: {
    readonly ALL_BRANCHES: "ALL_BRANCHES";
    readonly SPECIFIC_BRANCHES: "SPECIFIC_BRANCHES";
};
export type ItemVisibility = (typeof ItemVisibility)[keyof typeof ItemVisibility];
export declare const PaymentMethod: {
    readonly CASH: "CASH";
    readonly CARD: "CARD";
    readonly CREDIT: "CREDIT";
    readonly BANK_TRANSFER: "BANK_TRANSFER";
};
export type PaymentMethod = (typeof PaymentMethod)[keyof typeof PaymentMethod];
export declare const AccountType: {
    readonly ASSET: "ASSET";
    readonly LIABILITY: "LIABILITY";
    readonly EQUITY: "EQUITY";
    readonly REVENUE: "REVENUE";
    readonly EXPENSE: "EXPENSE";
};
export type AccountType = (typeof AccountType)[keyof typeof AccountType];
export declare const InvoiceStatus: {
    readonly DRAFT: "DRAFT";
    readonly POSTED: "POSTED";
    readonly PAID: "PAID";
    readonly VOID: "VOID";
};
export type InvoiceStatus = (typeof InvoiceStatus)[keyof typeof InvoiceStatus];
export declare const JournalEntryStatus: {
    readonly DRAFT: "DRAFT";
    readonly POSTED: "POSTED";
};
export type JournalEntryStatus = (typeof JournalEntryStatus)[keyof typeof JournalEntryStatus];
export declare const StockMovementType: {
    readonly SALE: "SALE";
    readonly PURCHASE: "PURCHASE";
    readonly ADJUSTMENT: "ADJUSTMENT";
};
export type StockMovementType = (typeof StockMovementType)[keyof typeof StockMovementType];
