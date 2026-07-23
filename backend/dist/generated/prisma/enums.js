"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StockMovementType = exports.JournalEntryStatus = exports.InvoiceStatus = exports.AccountType = exports.PaymentMethod = exports.ItemVisibility = exports.ItemCategory = exports.Role = exports.BrandId = void 0;
exports.BrandId = {
    BIN_ESSA_SMOKING_CENTER: 'BIN_ESSA_SMOKING_CENTER',
    BIN_ESSA_KHIRAN: 'BIN_ESSA_KHIRAN',
    JM_ART_ZONE: 'JM_ART_ZONE'
};
exports.Role = {
    ADMIN: 'ADMIN',
    MANAGER: 'MANAGER',
    CASHIER: 'CASHIER',
    ACCOUNTANT: 'ACCOUNTANT'
};
exports.ItemCategory = {
    TOBACCO: 'TOBACCO',
    ACCESSORIES: 'ACCESSORIES',
    ELECTRONICS: 'ELECTRONICS',
    ART_SUPPLIES: 'ART_SUPPLIES',
    OTHER: 'OTHER'
};
exports.ItemVisibility = {
    ALL_BRANCHES: 'ALL_BRANCHES',
    SPECIFIC_BRANCHES: 'SPECIFIC_BRANCHES'
};
exports.PaymentMethod = {
    CASH: 'CASH',
    CARD: 'CARD',
    CREDIT: 'CREDIT',
    BANK_TRANSFER: 'BANK_TRANSFER'
};
exports.AccountType = {
    ASSET: 'ASSET',
    LIABILITY: 'LIABILITY',
    EQUITY: 'EQUITY',
    REVENUE: 'REVENUE',
    EXPENSE: 'EXPENSE'
};
exports.InvoiceStatus = {
    DRAFT: 'DRAFT',
    POSTED: 'POSTED',
    PAID: 'PAID',
    VOID: 'VOID'
};
exports.JournalEntryStatus = {
    DRAFT: 'DRAFT',
    POSTED: 'POSTED'
};
exports.StockMovementType = {
    SALE: 'SALE',
    PURCHASE: 'PURCHASE',
    ADJUSTMENT: 'ADJUSTMENT'
};
//# sourceMappingURL=enums.js.map