import * as runtime from "@prisma/client/runtime/index-browser";
export type * from '../models.js';
export type * from './prismaNamespace.js';
export declare const Decimal: typeof runtime.Decimal;
export declare const NullTypes: {
    DbNull: (new (secret: never) => typeof runtime.DbNull);
    JsonNull: (new (secret: never) => typeof runtime.JsonNull);
    AnyNull: (new (secret: never) => typeof runtime.AnyNull);
};
export declare const DbNull: import("@prisma/client-runtime-utils").DbNullClass;
export declare const JsonNull: import("@prisma/client-runtime-utils").JsonNullClass;
export declare const AnyNull: import("@prisma/client-runtime-utils").AnyNullClass;
export declare const ModelName: {
    readonly Branch: "Branch";
    readonly User: "User";
    readonly Item: "Item";
    readonly ItemStock: "ItemStock";
    readonly Customer: "Customer";
    readonly Supplier: "Supplier";
    readonly Account: "Account";
    readonly JournalEntry: "JournalEntry";
    readonly JournalEntryLine: "JournalEntryLine";
    readonly SalesInvoice: "SalesInvoice";
    readonly SalesInvoiceLine: "SalesInvoiceLine";
};
export type ModelName = (typeof ModelName)[keyof typeof ModelName];
export declare const TransactionIsolationLevel: {
    readonly ReadUncommitted: "ReadUncommitted";
    readonly ReadCommitted: "ReadCommitted";
    readonly RepeatableRead: "RepeatableRead";
    readonly Serializable: "Serializable";
};
export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel];
export declare const BranchScalarFieldEnum: {
    readonly id: "id";
    readonly code: "code";
    readonly name: "name";
    readonly brandId: "brandId";
    readonly address: "address";
    readonly isActive: "isActive";
    readonly createdAt: "createdAt";
    readonly updatedAt: "updatedAt";
};
export type BranchScalarFieldEnum = (typeof BranchScalarFieldEnum)[keyof typeof BranchScalarFieldEnum];
export declare const UserScalarFieldEnum: {
    readonly id: "id";
    readonly username: "username";
    readonly passwordHash: "passwordHash";
    readonly fullName: "fullName";
    readonly role: "role";
    readonly branchId: "branchId";
    readonly isActive: "isActive";
    readonly createdAt: "createdAt";
    readonly updatedAt: "updatedAt";
};
export type UserScalarFieldEnum = (typeof UserScalarFieldEnum)[keyof typeof UserScalarFieldEnum];
export declare const ItemScalarFieldEnum: {
    readonly id: "id";
    readonly sku: "sku";
    readonly barcode: "barcode";
    readonly name: "name";
    readonly category: "category";
    readonly visibility: "visibility";
    readonly price: "price";
    readonly cost: "cost";
    readonly unit: "unit";
    readonly isActive: "isActive";
    readonly createdAt: "createdAt";
    readonly updatedAt: "updatedAt";
};
export type ItemScalarFieldEnum = (typeof ItemScalarFieldEnum)[keyof typeof ItemScalarFieldEnum];
export declare const ItemStockScalarFieldEnum: {
    readonly id: "id";
    readonly itemId: "itemId";
    readonly branchId: "branchId";
    readonly quantity: "quantity";
    readonly updatedAt: "updatedAt";
};
export type ItemStockScalarFieldEnum = (typeof ItemStockScalarFieldEnum)[keyof typeof ItemStockScalarFieldEnum];
export declare const CustomerScalarFieldEnum: {
    readonly id: "id";
    readonly code: "code";
    readonly name: "name";
    readonly phone: "phone";
    readonly email: "email";
    readonly address: "address";
    readonly branchId: "branchId";
    readonly createdAt: "createdAt";
    readonly updatedAt: "updatedAt";
};
export type CustomerScalarFieldEnum = (typeof CustomerScalarFieldEnum)[keyof typeof CustomerScalarFieldEnum];
export declare const SupplierScalarFieldEnum: {
    readonly id: "id";
    readonly code: "code";
    readonly name: "name";
    readonly phone: "phone";
    readonly email: "email";
    readonly address: "address";
    readonly branchId: "branchId";
    readonly createdAt: "createdAt";
    readonly updatedAt: "updatedAt";
};
export type SupplierScalarFieldEnum = (typeof SupplierScalarFieldEnum)[keyof typeof SupplierScalarFieldEnum];
export declare const AccountScalarFieldEnum: {
    readonly id: "id";
    readonly code: "code";
    readonly name: "name";
    readonly type: "type";
    readonly createdAt: "createdAt";
    readonly updatedAt: "updatedAt";
};
export type AccountScalarFieldEnum = (typeof AccountScalarFieldEnum)[keyof typeof AccountScalarFieldEnum];
export declare const JournalEntryScalarFieldEnum: {
    readonly id: "id";
    readonly reference: "reference";
    readonly date: "date";
    readonly description: "description";
    readonly status: "status";
    readonly branchId: "branchId";
    readonly salesInvoiceId: "salesInvoiceId";
    readonly createdAt: "createdAt";
};
export type JournalEntryScalarFieldEnum = (typeof JournalEntryScalarFieldEnum)[keyof typeof JournalEntryScalarFieldEnum];
export declare const JournalEntryLineScalarFieldEnum: {
    readonly id: "id";
    readonly journalEntryId: "journalEntryId";
    readonly accountId: "accountId";
    readonly debit: "debit";
    readonly credit: "credit";
};
export type JournalEntryLineScalarFieldEnum = (typeof JournalEntryLineScalarFieldEnum)[keyof typeof JournalEntryLineScalarFieldEnum];
export declare const SalesInvoiceScalarFieldEnum: {
    readonly id: "id";
    readonly invoiceNumber: "invoiceNumber";
    readonly date: "date";
    readonly customerId: "customerId";
    readonly branchId: "branchId";
    readonly userId: "userId";
    readonly paymentMethod: "paymentMethod";
    readonly status: "status";
    readonly subtotal: "subtotal";
    readonly taxAmount: "taxAmount";
    readonly totalAmount: "totalAmount";
    readonly createdAt: "createdAt";
};
export type SalesInvoiceScalarFieldEnum = (typeof SalesInvoiceScalarFieldEnum)[keyof typeof SalesInvoiceScalarFieldEnum];
export declare const SalesInvoiceLineScalarFieldEnum: {
    readonly id: "id";
    readonly salesInvoiceId: "salesInvoiceId";
    readonly itemId: "itemId";
    readonly quantity: "quantity";
    readonly unitPrice: "unitPrice";
    readonly lineTotal: "lineTotal";
};
export type SalesInvoiceLineScalarFieldEnum = (typeof SalesInvoiceLineScalarFieldEnum)[keyof typeof SalesInvoiceLineScalarFieldEnum];
export declare const SortOrder: {
    readonly asc: "asc";
    readonly desc: "desc";
};
export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder];
export declare const QueryMode: {
    readonly default: "default";
    readonly insensitive: "insensitive";
};
export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode];
export declare const NullsOrder: {
    readonly first: "first";
    readonly last: "last";
};
export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder];
