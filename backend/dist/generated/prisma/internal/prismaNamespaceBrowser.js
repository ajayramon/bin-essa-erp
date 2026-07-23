"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.NullsOrder = exports.QueryMode = exports.SortOrder = exports.SalesInvoiceLineScalarFieldEnum = exports.SalesInvoiceScalarFieldEnum = exports.JournalEntryLineScalarFieldEnum = exports.JournalEntryScalarFieldEnum = exports.AccountScalarFieldEnum = exports.SupplierScalarFieldEnum = exports.CustomerScalarFieldEnum = exports.ItemStockScalarFieldEnum = exports.ItemScalarFieldEnum = exports.UserScalarFieldEnum = exports.BranchScalarFieldEnum = exports.TransactionIsolationLevel = exports.ModelName = exports.AnyNull = exports.JsonNull = exports.DbNull = exports.NullTypes = exports.Decimal = void 0;
const runtime = __importStar(require("@prisma/client/runtime/index-browser"));
exports.Decimal = runtime.Decimal;
exports.NullTypes = {
    DbNull: runtime.NullTypes.DbNull,
    JsonNull: runtime.NullTypes.JsonNull,
    AnyNull: runtime.NullTypes.AnyNull,
};
exports.DbNull = runtime.DbNull;
exports.JsonNull = runtime.JsonNull;
exports.AnyNull = runtime.AnyNull;
exports.ModelName = {
    Branch: 'Branch',
    User: 'User',
    Item: 'Item',
    ItemStock: 'ItemStock',
    Customer: 'Customer',
    Supplier: 'Supplier',
    Account: 'Account',
    JournalEntry: 'JournalEntry',
    JournalEntryLine: 'JournalEntryLine',
    SalesInvoice: 'SalesInvoice',
    SalesInvoiceLine: 'SalesInvoiceLine'
};
exports.TransactionIsolationLevel = runtime.makeStrictEnum({
    ReadUncommitted: 'ReadUncommitted',
    ReadCommitted: 'ReadCommitted',
    RepeatableRead: 'RepeatableRead',
    Serializable: 'Serializable'
});
exports.BranchScalarFieldEnum = {
    id: 'id',
    code: 'code',
    name: 'name',
    brandId: 'brandId',
    address: 'address',
    isActive: 'isActive',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
};
exports.UserScalarFieldEnum = {
    id: 'id',
    username: 'username',
    passwordHash: 'passwordHash',
    fullName: 'fullName',
    role: 'role',
    branchId: 'branchId',
    isActive: 'isActive',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
};
exports.ItemScalarFieldEnum = {
    id: 'id',
    sku: 'sku',
    barcode: 'barcode',
    name: 'name',
    category: 'category',
    visibility: 'visibility',
    price: 'price',
    cost: 'cost',
    unit: 'unit',
    isActive: 'isActive',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
};
exports.ItemStockScalarFieldEnum = {
    id: 'id',
    itemId: 'itemId',
    branchId: 'branchId',
    quantity: 'quantity',
    updatedAt: 'updatedAt'
};
exports.CustomerScalarFieldEnum = {
    id: 'id',
    code: 'code',
    name: 'name',
    phone: 'phone',
    email: 'email',
    address: 'address',
    branchId: 'branchId',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
};
exports.SupplierScalarFieldEnum = {
    id: 'id',
    code: 'code',
    name: 'name',
    phone: 'phone',
    email: 'email',
    address: 'address',
    branchId: 'branchId',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
};
exports.AccountScalarFieldEnum = {
    id: 'id',
    code: 'code',
    name: 'name',
    type: 'type',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
};
exports.JournalEntryScalarFieldEnum = {
    id: 'id',
    reference: 'reference',
    date: 'date',
    description: 'description',
    status: 'status',
    branchId: 'branchId',
    salesInvoiceId: 'salesInvoiceId',
    createdAt: 'createdAt'
};
exports.JournalEntryLineScalarFieldEnum = {
    id: 'id',
    journalEntryId: 'journalEntryId',
    accountId: 'accountId',
    debit: 'debit',
    credit: 'credit'
};
exports.SalesInvoiceScalarFieldEnum = {
    id: 'id',
    invoiceNumber: 'invoiceNumber',
    date: 'date',
    customerId: 'customerId',
    branchId: 'branchId',
    userId: 'userId',
    paymentMethod: 'paymentMethod',
    status: 'status',
    subtotal: 'subtotal',
    taxAmount: 'taxAmount',
    totalAmount: 'totalAmount',
    createdAt: 'createdAt'
};
exports.SalesInvoiceLineScalarFieldEnum = {
    id: 'id',
    salesInvoiceId: 'salesInvoiceId',
    itemId: 'itemId',
    quantity: 'quantity',
    unitPrice: 'unitPrice',
    lineTotal: 'lineTotal'
};
exports.SortOrder = {
    asc: 'asc',
    desc: 'desc'
};
exports.QueryMode = {
    default: 'default',
    insensitive: 'insensitive'
};
exports.NullsOrder = {
    first: 'first',
    last: 'last'
};
//# sourceMappingURL=prismaNamespaceBrowser.js.map