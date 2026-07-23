import type * as runtime from "@prisma/client/runtime/client";
import type * as $Enums from "../enums.js";
import type * as Prisma from "../internal/prismaNamespace.js";
export type BranchModel = runtime.Types.Result.DefaultSelection<Prisma.$BranchPayload>;
export type AggregateBranch = {
    _count: BranchCountAggregateOutputType | null;
    _min: BranchMinAggregateOutputType | null;
    _max: BranchMaxAggregateOutputType | null;
};
export type BranchMinAggregateOutputType = {
    id: string | null;
    code: string | null;
    name: string | null;
    brandId: $Enums.BrandId | null;
    address: string | null;
    isActive: boolean | null;
    createdAt: Date | null;
    updatedAt: Date | null;
};
export type BranchMaxAggregateOutputType = {
    id: string | null;
    code: string | null;
    name: string | null;
    brandId: $Enums.BrandId | null;
    address: string | null;
    isActive: boolean | null;
    createdAt: Date | null;
    updatedAt: Date | null;
};
export type BranchCountAggregateOutputType = {
    id: number;
    code: number;
    name: number;
    brandId: number;
    address: number;
    isActive: number;
    createdAt: number;
    updatedAt: number;
    _all: number;
};
export type BranchMinAggregateInputType = {
    id?: true;
    code?: true;
    name?: true;
    brandId?: true;
    address?: true;
    isActive?: true;
    createdAt?: true;
    updatedAt?: true;
};
export type BranchMaxAggregateInputType = {
    id?: true;
    code?: true;
    name?: true;
    brandId?: true;
    address?: true;
    isActive?: true;
    createdAt?: true;
    updatedAt?: true;
};
export type BranchCountAggregateInputType = {
    id?: true;
    code?: true;
    name?: true;
    brandId?: true;
    address?: true;
    isActive?: true;
    createdAt?: true;
    updatedAt?: true;
    _all?: true;
};
export type BranchAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.BranchWhereInput;
    orderBy?: Prisma.BranchOrderByWithRelationInput | Prisma.BranchOrderByWithRelationInput[];
    cursor?: Prisma.BranchWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | BranchCountAggregateInputType;
    _min?: BranchMinAggregateInputType;
    _max?: BranchMaxAggregateInputType;
};
export type GetBranchAggregateType<T extends BranchAggregateArgs> = {
    [P in keyof T & keyof AggregateBranch]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateBranch[P]> : Prisma.GetScalarType<T[P], AggregateBranch[P]>;
};
export type BranchGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.BranchWhereInput;
    orderBy?: Prisma.BranchOrderByWithAggregationInput | Prisma.BranchOrderByWithAggregationInput[];
    by: Prisma.BranchScalarFieldEnum[] | Prisma.BranchScalarFieldEnum;
    having?: Prisma.BranchScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: BranchCountAggregateInputType | true;
    _min?: BranchMinAggregateInputType;
    _max?: BranchMaxAggregateInputType;
};
export type BranchGroupByOutputType = {
    id: string;
    code: string;
    name: string;
    brandId: $Enums.BrandId;
    address: string | null;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
    _count: BranchCountAggregateOutputType | null;
    _min: BranchMinAggregateOutputType | null;
    _max: BranchMaxAggregateOutputType | null;
};
export type GetBranchGroupByPayload<T extends BranchGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<BranchGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof BranchGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], BranchGroupByOutputType[P]> : Prisma.GetScalarType<T[P], BranchGroupByOutputType[P]>;
}>>;
export type BranchWhereInput = {
    AND?: Prisma.BranchWhereInput | Prisma.BranchWhereInput[];
    OR?: Prisma.BranchWhereInput[];
    NOT?: Prisma.BranchWhereInput | Prisma.BranchWhereInput[];
    id?: Prisma.StringFilter<"Branch"> | string;
    code?: Prisma.StringFilter<"Branch"> | string;
    name?: Prisma.StringFilter<"Branch"> | string;
    brandId?: Prisma.EnumBrandIdFilter<"Branch"> | $Enums.BrandId;
    address?: Prisma.StringNullableFilter<"Branch"> | string | null;
    isActive?: Prisma.BoolFilter<"Branch"> | boolean;
    createdAt?: Prisma.DateTimeFilter<"Branch"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"Branch"> | Date | string;
    users?: Prisma.UserListRelationFilter;
    itemStocks?: Prisma.ItemStockListRelationFilter;
    customers?: Prisma.CustomerListRelationFilter;
    suppliers?: Prisma.SupplierListRelationFilter;
    salesInvoices?: Prisma.SalesInvoiceListRelationFilter;
    journalEntries?: Prisma.JournalEntryListRelationFilter;
};
export type BranchOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    code?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    brandId?: Prisma.SortOrder;
    address?: Prisma.SortOrderInput | Prisma.SortOrder;
    isActive?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    users?: Prisma.UserOrderByRelationAggregateInput;
    itemStocks?: Prisma.ItemStockOrderByRelationAggregateInput;
    customers?: Prisma.CustomerOrderByRelationAggregateInput;
    suppliers?: Prisma.SupplierOrderByRelationAggregateInput;
    salesInvoices?: Prisma.SalesInvoiceOrderByRelationAggregateInput;
    journalEntries?: Prisma.JournalEntryOrderByRelationAggregateInput;
};
export type BranchWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    code?: string;
    AND?: Prisma.BranchWhereInput | Prisma.BranchWhereInput[];
    OR?: Prisma.BranchWhereInput[];
    NOT?: Prisma.BranchWhereInput | Prisma.BranchWhereInput[];
    name?: Prisma.StringFilter<"Branch"> | string;
    brandId?: Prisma.EnumBrandIdFilter<"Branch"> | $Enums.BrandId;
    address?: Prisma.StringNullableFilter<"Branch"> | string | null;
    isActive?: Prisma.BoolFilter<"Branch"> | boolean;
    createdAt?: Prisma.DateTimeFilter<"Branch"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"Branch"> | Date | string;
    users?: Prisma.UserListRelationFilter;
    itemStocks?: Prisma.ItemStockListRelationFilter;
    customers?: Prisma.CustomerListRelationFilter;
    suppliers?: Prisma.SupplierListRelationFilter;
    salesInvoices?: Prisma.SalesInvoiceListRelationFilter;
    journalEntries?: Prisma.JournalEntryListRelationFilter;
}, "id" | "code">;
export type BranchOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    code?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    brandId?: Prisma.SortOrder;
    address?: Prisma.SortOrderInput | Prisma.SortOrder;
    isActive?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    _count?: Prisma.BranchCountOrderByAggregateInput;
    _max?: Prisma.BranchMaxOrderByAggregateInput;
    _min?: Prisma.BranchMinOrderByAggregateInput;
};
export type BranchScalarWhereWithAggregatesInput = {
    AND?: Prisma.BranchScalarWhereWithAggregatesInput | Prisma.BranchScalarWhereWithAggregatesInput[];
    OR?: Prisma.BranchScalarWhereWithAggregatesInput[];
    NOT?: Prisma.BranchScalarWhereWithAggregatesInput | Prisma.BranchScalarWhereWithAggregatesInput[];
    id?: Prisma.StringWithAggregatesFilter<"Branch"> | string;
    code?: Prisma.StringWithAggregatesFilter<"Branch"> | string;
    name?: Prisma.StringWithAggregatesFilter<"Branch"> | string;
    brandId?: Prisma.EnumBrandIdWithAggregatesFilter<"Branch"> | $Enums.BrandId;
    address?: Prisma.StringNullableWithAggregatesFilter<"Branch"> | string | null;
    isActive?: Prisma.BoolWithAggregatesFilter<"Branch"> | boolean;
    createdAt?: Prisma.DateTimeWithAggregatesFilter<"Branch"> | Date | string;
    updatedAt?: Prisma.DateTimeWithAggregatesFilter<"Branch"> | Date | string;
};
export type BranchCreateInput = {
    id?: string;
    code: string;
    name: string;
    brandId: $Enums.BrandId;
    address?: string | null;
    isActive?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    users?: Prisma.UserCreateNestedManyWithoutBranchInput;
    itemStocks?: Prisma.ItemStockCreateNestedManyWithoutBranchInput;
    customers?: Prisma.CustomerCreateNestedManyWithoutBranchInput;
    suppliers?: Prisma.SupplierCreateNestedManyWithoutBranchInput;
    salesInvoices?: Prisma.SalesInvoiceCreateNestedManyWithoutBranchInput;
    journalEntries?: Prisma.JournalEntryCreateNestedManyWithoutBranchInput;
};
export type BranchUncheckedCreateInput = {
    id?: string;
    code: string;
    name: string;
    brandId: $Enums.BrandId;
    address?: string | null;
    isActive?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    users?: Prisma.UserUncheckedCreateNestedManyWithoutBranchInput;
    itemStocks?: Prisma.ItemStockUncheckedCreateNestedManyWithoutBranchInput;
    customers?: Prisma.CustomerUncheckedCreateNestedManyWithoutBranchInput;
    suppliers?: Prisma.SupplierUncheckedCreateNestedManyWithoutBranchInput;
    salesInvoices?: Prisma.SalesInvoiceUncheckedCreateNestedManyWithoutBranchInput;
    journalEntries?: Prisma.JournalEntryUncheckedCreateNestedManyWithoutBranchInput;
};
export type BranchUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    code?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    brandId?: Prisma.EnumBrandIdFieldUpdateOperationsInput | $Enums.BrandId;
    address?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    isActive?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    users?: Prisma.UserUpdateManyWithoutBranchNestedInput;
    itemStocks?: Prisma.ItemStockUpdateManyWithoutBranchNestedInput;
    customers?: Prisma.CustomerUpdateManyWithoutBranchNestedInput;
    suppliers?: Prisma.SupplierUpdateManyWithoutBranchNestedInput;
    salesInvoices?: Prisma.SalesInvoiceUpdateManyWithoutBranchNestedInput;
    journalEntries?: Prisma.JournalEntryUpdateManyWithoutBranchNestedInput;
};
export type BranchUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    code?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    brandId?: Prisma.EnumBrandIdFieldUpdateOperationsInput | $Enums.BrandId;
    address?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    isActive?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    users?: Prisma.UserUncheckedUpdateManyWithoutBranchNestedInput;
    itemStocks?: Prisma.ItemStockUncheckedUpdateManyWithoutBranchNestedInput;
    customers?: Prisma.CustomerUncheckedUpdateManyWithoutBranchNestedInput;
    suppliers?: Prisma.SupplierUncheckedUpdateManyWithoutBranchNestedInput;
    salesInvoices?: Prisma.SalesInvoiceUncheckedUpdateManyWithoutBranchNestedInput;
    journalEntries?: Prisma.JournalEntryUncheckedUpdateManyWithoutBranchNestedInput;
};
export type BranchCreateManyInput = {
    id?: string;
    code: string;
    name: string;
    brandId: $Enums.BrandId;
    address?: string | null;
    isActive?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type BranchUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    code?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    brandId?: Prisma.EnumBrandIdFieldUpdateOperationsInput | $Enums.BrandId;
    address?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    isActive?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type BranchUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    code?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    brandId?: Prisma.EnumBrandIdFieldUpdateOperationsInput | $Enums.BrandId;
    address?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    isActive?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type BranchCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    code?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    brandId?: Prisma.SortOrder;
    address?: Prisma.SortOrder;
    isActive?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type BranchMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    code?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    brandId?: Prisma.SortOrder;
    address?: Prisma.SortOrder;
    isActive?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type BranchMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    code?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    brandId?: Prisma.SortOrder;
    address?: Prisma.SortOrder;
    isActive?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type BranchNullableScalarRelationFilter = {
    is?: Prisma.BranchWhereInput | null;
    isNot?: Prisma.BranchWhereInput | null;
};
export type BranchScalarRelationFilter = {
    is?: Prisma.BranchWhereInput;
    isNot?: Prisma.BranchWhereInput;
};
export type StringFieldUpdateOperationsInput = {
    set?: string;
};
export type EnumBrandIdFieldUpdateOperationsInput = {
    set?: $Enums.BrandId;
};
export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null;
};
export type BoolFieldUpdateOperationsInput = {
    set?: boolean;
};
export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string;
};
export type BranchCreateNestedOneWithoutUsersInput = {
    create?: Prisma.XOR<Prisma.BranchCreateWithoutUsersInput, Prisma.BranchUncheckedCreateWithoutUsersInput>;
    connectOrCreate?: Prisma.BranchCreateOrConnectWithoutUsersInput;
    connect?: Prisma.BranchWhereUniqueInput;
};
export type BranchUpdateOneWithoutUsersNestedInput = {
    create?: Prisma.XOR<Prisma.BranchCreateWithoutUsersInput, Prisma.BranchUncheckedCreateWithoutUsersInput>;
    connectOrCreate?: Prisma.BranchCreateOrConnectWithoutUsersInput;
    upsert?: Prisma.BranchUpsertWithoutUsersInput;
    disconnect?: Prisma.BranchWhereInput | boolean;
    delete?: Prisma.BranchWhereInput | boolean;
    connect?: Prisma.BranchWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.BranchUpdateToOneWithWhereWithoutUsersInput, Prisma.BranchUpdateWithoutUsersInput>, Prisma.BranchUncheckedUpdateWithoutUsersInput>;
};
export type BranchCreateNestedOneWithoutItemStocksInput = {
    create?: Prisma.XOR<Prisma.BranchCreateWithoutItemStocksInput, Prisma.BranchUncheckedCreateWithoutItemStocksInput>;
    connectOrCreate?: Prisma.BranchCreateOrConnectWithoutItemStocksInput;
    connect?: Prisma.BranchWhereUniqueInput;
};
export type BranchUpdateOneRequiredWithoutItemStocksNestedInput = {
    create?: Prisma.XOR<Prisma.BranchCreateWithoutItemStocksInput, Prisma.BranchUncheckedCreateWithoutItemStocksInput>;
    connectOrCreate?: Prisma.BranchCreateOrConnectWithoutItemStocksInput;
    upsert?: Prisma.BranchUpsertWithoutItemStocksInput;
    connect?: Prisma.BranchWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.BranchUpdateToOneWithWhereWithoutItemStocksInput, Prisma.BranchUpdateWithoutItemStocksInput>, Prisma.BranchUncheckedUpdateWithoutItemStocksInput>;
};
export type BranchCreateNestedOneWithoutCustomersInput = {
    create?: Prisma.XOR<Prisma.BranchCreateWithoutCustomersInput, Prisma.BranchUncheckedCreateWithoutCustomersInput>;
    connectOrCreate?: Prisma.BranchCreateOrConnectWithoutCustomersInput;
    connect?: Prisma.BranchWhereUniqueInput;
};
export type BranchUpdateOneWithoutCustomersNestedInput = {
    create?: Prisma.XOR<Prisma.BranchCreateWithoutCustomersInput, Prisma.BranchUncheckedCreateWithoutCustomersInput>;
    connectOrCreate?: Prisma.BranchCreateOrConnectWithoutCustomersInput;
    upsert?: Prisma.BranchUpsertWithoutCustomersInput;
    disconnect?: Prisma.BranchWhereInput | boolean;
    delete?: Prisma.BranchWhereInput | boolean;
    connect?: Prisma.BranchWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.BranchUpdateToOneWithWhereWithoutCustomersInput, Prisma.BranchUpdateWithoutCustomersInput>, Prisma.BranchUncheckedUpdateWithoutCustomersInput>;
};
export type BranchCreateNestedOneWithoutSuppliersInput = {
    create?: Prisma.XOR<Prisma.BranchCreateWithoutSuppliersInput, Prisma.BranchUncheckedCreateWithoutSuppliersInput>;
    connectOrCreate?: Prisma.BranchCreateOrConnectWithoutSuppliersInput;
    connect?: Prisma.BranchWhereUniqueInput;
};
export type BranchUpdateOneWithoutSuppliersNestedInput = {
    create?: Prisma.XOR<Prisma.BranchCreateWithoutSuppliersInput, Prisma.BranchUncheckedCreateWithoutSuppliersInput>;
    connectOrCreate?: Prisma.BranchCreateOrConnectWithoutSuppliersInput;
    upsert?: Prisma.BranchUpsertWithoutSuppliersInput;
    disconnect?: Prisma.BranchWhereInput | boolean;
    delete?: Prisma.BranchWhereInput | boolean;
    connect?: Prisma.BranchWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.BranchUpdateToOneWithWhereWithoutSuppliersInput, Prisma.BranchUpdateWithoutSuppliersInput>, Prisma.BranchUncheckedUpdateWithoutSuppliersInput>;
};
export type BranchCreateNestedOneWithoutJournalEntriesInput = {
    create?: Prisma.XOR<Prisma.BranchCreateWithoutJournalEntriesInput, Prisma.BranchUncheckedCreateWithoutJournalEntriesInput>;
    connectOrCreate?: Prisma.BranchCreateOrConnectWithoutJournalEntriesInput;
    connect?: Prisma.BranchWhereUniqueInput;
};
export type BranchUpdateOneWithoutJournalEntriesNestedInput = {
    create?: Prisma.XOR<Prisma.BranchCreateWithoutJournalEntriesInput, Prisma.BranchUncheckedCreateWithoutJournalEntriesInput>;
    connectOrCreate?: Prisma.BranchCreateOrConnectWithoutJournalEntriesInput;
    upsert?: Prisma.BranchUpsertWithoutJournalEntriesInput;
    disconnect?: Prisma.BranchWhereInput | boolean;
    delete?: Prisma.BranchWhereInput | boolean;
    connect?: Prisma.BranchWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.BranchUpdateToOneWithWhereWithoutJournalEntriesInput, Prisma.BranchUpdateWithoutJournalEntriesInput>, Prisma.BranchUncheckedUpdateWithoutJournalEntriesInput>;
};
export type BranchCreateNestedOneWithoutSalesInvoicesInput = {
    create?: Prisma.XOR<Prisma.BranchCreateWithoutSalesInvoicesInput, Prisma.BranchUncheckedCreateWithoutSalesInvoicesInput>;
    connectOrCreate?: Prisma.BranchCreateOrConnectWithoutSalesInvoicesInput;
    connect?: Prisma.BranchWhereUniqueInput;
};
export type BranchUpdateOneRequiredWithoutSalesInvoicesNestedInput = {
    create?: Prisma.XOR<Prisma.BranchCreateWithoutSalesInvoicesInput, Prisma.BranchUncheckedCreateWithoutSalesInvoicesInput>;
    connectOrCreate?: Prisma.BranchCreateOrConnectWithoutSalesInvoicesInput;
    upsert?: Prisma.BranchUpsertWithoutSalesInvoicesInput;
    connect?: Prisma.BranchWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.BranchUpdateToOneWithWhereWithoutSalesInvoicesInput, Prisma.BranchUpdateWithoutSalesInvoicesInput>, Prisma.BranchUncheckedUpdateWithoutSalesInvoicesInput>;
};
export type BranchCreateWithoutUsersInput = {
    id?: string;
    code: string;
    name: string;
    brandId: $Enums.BrandId;
    address?: string | null;
    isActive?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    itemStocks?: Prisma.ItemStockCreateNestedManyWithoutBranchInput;
    customers?: Prisma.CustomerCreateNestedManyWithoutBranchInput;
    suppliers?: Prisma.SupplierCreateNestedManyWithoutBranchInput;
    salesInvoices?: Prisma.SalesInvoiceCreateNestedManyWithoutBranchInput;
    journalEntries?: Prisma.JournalEntryCreateNestedManyWithoutBranchInput;
};
export type BranchUncheckedCreateWithoutUsersInput = {
    id?: string;
    code: string;
    name: string;
    brandId: $Enums.BrandId;
    address?: string | null;
    isActive?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    itemStocks?: Prisma.ItemStockUncheckedCreateNestedManyWithoutBranchInput;
    customers?: Prisma.CustomerUncheckedCreateNestedManyWithoutBranchInput;
    suppliers?: Prisma.SupplierUncheckedCreateNestedManyWithoutBranchInput;
    salesInvoices?: Prisma.SalesInvoiceUncheckedCreateNestedManyWithoutBranchInput;
    journalEntries?: Prisma.JournalEntryUncheckedCreateNestedManyWithoutBranchInput;
};
export type BranchCreateOrConnectWithoutUsersInput = {
    where: Prisma.BranchWhereUniqueInput;
    create: Prisma.XOR<Prisma.BranchCreateWithoutUsersInput, Prisma.BranchUncheckedCreateWithoutUsersInput>;
};
export type BranchUpsertWithoutUsersInput = {
    update: Prisma.XOR<Prisma.BranchUpdateWithoutUsersInput, Prisma.BranchUncheckedUpdateWithoutUsersInput>;
    create: Prisma.XOR<Prisma.BranchCreateWithoutUsersInput, Prisma.BranchUncheckedCreateWithoutUsersInput>;
    where?: Prisma.BranchWhereInput;
};
export type BranchUpdateToOneWithWhereWithoutUsersInput = {
    where?: Prisma.BranchWhereInput;
    data: Prisma.XOR<Prisma.BranchUpdateWithoutUsersInput, Prisma.BranchUncheckedUpdateWithoutUsersInput>;
};
export type BranchUpdateWithoutUsersInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    code?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    brandId?: Prisma.EnumBrandIdFieldUpdateOperationsInput | $Enums.BrandId;
    address?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    isActive?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    itemStocks?: Prisma.ItemStockUpdateManyWithoutBranchNestedInput;
    customers?: Prisma.CustomerUpdateManyWithoutBranchNestedInput;
    suppliers?: Prisma.SupplierUpdateManyWithoutBranchNestedInput;
    salesInvoices?: Prisma.SalesInvoiceUpdateManyWithoutBranchNestedInput;
    journalEntries?: Prisma.JournalEntryUpdateManyWithoutBranchNestedInput;
};
export type BranchUncheckedUpdateWithoutUsersInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    code?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    brandId?: Prisma.EnumBrandIdFieldUpdateOperationsInput | $Enums.BrandId;
    address?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    isActive?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    itemStocks?: Prisma.ItemStockUncheckedUpdateManyWithoutBranchNestedInput;
    customers?: Prisma.CustomerUncheckedUpdateManyWithoutBranchNestedInput;
    suppliers?: Prisma.SupplierUncheckedUpdateManyWithoutBranchNestedInput;
    salesInvoices?: Prisma.SalesInvoiceUncheckedUpdateManyWithoutBranchNestedInput;
    journalEntries?: Prisma.JournalEntryUncheckedUpdateManyWithoutBranchNestedInput;
};
export type BranchCreateWithoutItemStocksInput = {
    id?: string;
    code: string;
    name: string;
    brandId: $Enums.BrandId;
    address?: string | null;
    isActive?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    users?: Prisma.UserCreateNestedManyWithoutBranchInput;
    customers?: Prisma.CustomerCreateNestedManyWithoutBranchInput;
    suppliers?: Prisma.SupplierCreateNestedManyWithoutBranchInput;
    salesInvoices?: Prisma.SalesInvoiceCreateNestedManyWithoutBranchInput;
    journalEntries?: Prisma.JournalEntryCreateNestedManyWithoutBranchInput;
};
export type BranchUncheckedCreateWithoutItemStocksInput = {
    id?: string;
    code: string;
    name: string;
    brandId: $Enums.BrandId;
    address?: string | null;
    isActive?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    users?: Prisma.UserUncheckedCreateNestedManyWithoutBranchInput;
    customers?: Prisma.CustomerUncheckedCreateNestedManyWithoutBranchInput;
    suppliers?: Prisma.SupplierUncheckedCreateNestedManyWithoutBranchInput;
    salesInvoices?: Prisma.SalesInvoiceUncheckedCreateNestedManyWithoutBranchInput;
    journalEntries?: Prisma.JournalEntryUncheckedCreateNestedManyWithoutBranchInput;
};
export type BranchCreateOrConnectWithoutItemStocksInput = {
    where: Prisma.BranchWhereUniqueInput;
    create: Prisma.XOR<Prisma.BranchCreateWithoutItemStocksInput, Prisma.BranchUncheckedCreateWithoutItemStocksInput>;
};
export type BranchUpsertWithoutItemStocksInput = {
    update: Prisma.XOR<Prisma.BranchUpdateWithoutItemStocksInput, Prisma.BranchUncheckedUpdateWithoutItemStocksInput>;
    create: Prisma.XOR<Prisma.BranchCreateWithoutItemStocksInput, Prisma.BranchUncheckedCreateWithoutItemStocksInput>;
    where?: Prisma.BranchWhereInput;
};
export type BranchUpdateToOneWithWhereWithoutItemStocksInput = {
    where?: Prisma.BranchWhereInput;
    data: Prisma.XOR<Prisma.BranchUpdateWithoutItemStocksInput, Prisma.BranchUncheckedUpdateWithoutItemStocksInput>;
};
export type BranchUpdateWithoutItemStocksInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    code?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    brandId?: Prisma.EnumBrandIdFieldUpdateOperationsInput | $Enums.BrandId;
    address?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    isActive?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    users?: Prisma.UserUpdateManyWithoutBranchNestedInput;
    customers?: Prisma.CustomerUpdateManyWithoutBranchNestedInput;
    suppliers?: Prisma.SupplierUpdateManyWithoutBranchNestedInput;
    salesInvoices?: Prisma.SalesInvoiceUpdateManyWithoutBranchNestedInput;
    journalEntries?: Prisma.JournalEntryUpdateManyWithoutBranchNestedInput;
};
export type BranchUncheckedUpdateWithoutItemStocksInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    code?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    brandId?: Prisma.EnumBrandIdFieldUpdateOperationsInput | $Enums.BrandId;
    address?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    isActive?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    users?: Prisma.UserUncheckedUpdateManyWithoutBranchNestedInput;
    customers?: Prisma.CustomerUncheckedUpdateManyWithoutBranchNestedInput;
    suppliers?: Prisma.SupplierUncheckedUpdateManyWithoutBranchNestedInput;
    salesInvoices?: Prisma.SalesInvoiceUncheckedUpdateManyWithoutBranchNestedInput;
    journalEntries?: Prisma.JournalEntryUncheckedUpdateManyWithoutBranchNestedInput;
};
export type BranchCreateWithoutCustomersInput = {
    id?: string;
    code: string;
    name: string;
    brandId: $Enums.BrandId;
    address?: string | null;
    isActive?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    users?: Prisma.UserCreateNestedManyWithoutBranchInput;
    itemStocks?: Prisma.ItemStockCreateNestedManyWithoutBranchInput;
    suppliers?: Prisma.SupplierCreateNestedManyWithoutBranchInput;
    salesInvoices?: Prisma.SalesInvoiceCreateNestedManyWithoutBranchInput;
    journalEntries?: Prisma.JournalEntryCreateNestedManyWithoutBranchInput;
};
export type BranchUncheckedCreateWithoutCustomersInput = {
    id?: string;
    code: string;
    name: string;
    brandId: $Enums.BrandId;
    address?: string | null;
    isActive?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    users?: Prisma.UserUncheckedCreateNestedManyWithoutBranchInput;
    itemStocks?: Prisma.ItemStockUncheckedCreateNestedManyWithoutBranchInput;
    suppliers?: Prisma.SupplierUncheckedCreateNestedManyWithoutBranchInput;
    salesInvoices?: Prisma.SalesInvoiceUncheckedCreateNestedManyWithoutBranchInput;
    journalEntries?: Prisma.JournalEntryUncheckedCreateNestedManyWithoutBranchInput;
};
export type BranchCreateOrConnectWithoutCustomersInput = {
    where: Prisma.BranchWhereUniqueInput;
    create: Prisma.XOR<Prisma.BranchCreateWithoutCustomersInput, Prisma.BranchUncheckedCreateWithoutCustomersInput>;
};
export type BranchUpsertWithoutCustomersInput = {
    update: Prisma.XOR<Prisma.BranchUpdateWithoutCustomersInput, Prisma.BranchUncheckedUpdateWithoutCustomersInput>;
    create: Prisma.XOR<Prisma.BranchCreateWithoutCustomersInput, Prisma.BranchUncheckedCreateWithoutCustomersInput>;
    where?: Prisma.BranchWhereInput;
};
export type BranchUpdateToOneWithWhereWithoutCustomersInput = {
    where?: Prisma.BranchWhereInput;
    data: Prisma.XOR<Prisma.BranchUpdateWithoutCustomersInput, Prisma.BranchUncheckedUpdateWithoutCustomersInput>;
};
export type BranchUpdateWithoutCustomersInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    code?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    brandId?: Prisma.EnumBrandIdFieldUpdateOperationsInput | $Enums.BrandId;
    address?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    isActive?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    users?: Prisma.UserUpdateManyWithoutBranchNestedInput;
    itemStocks?: Prisma.ItemStockUpdateManyWithoutBranchNestedInput;
    suppliers?: Prisma.SupplierUpdateManyWithoutBranchNestedInput;
    salesInvoices?: Prisma.SalesInvoiceUpdateManyWithoutBranchNestedInput;
    journalEntries?: Prisma.JournalEntryUpdateManyWithoutBranchNestedInput;
};
export type BranchUncheckedUpdateWithoutCustomersInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    code?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    brandId?: Prisma.EnumBrandIdFieldUpdateOperationsInput | $Enums.BrandId;
    address?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    isActive?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    users?: Prisma.UserUncheckedUpdateManyWithoutBranchNestedInput;
    itemStocks?: Prisma.ItemStockUncheckedUpdateManyWithoutBranchNestedInput;
    suppliers?: Prisma.SupplierUncheckedUpdateManyWithoutBranchNestedInput;
    salesInvoices?: Prisma.SalesInvoiceUncheckedUpdateManyWithoutBranchNestedInput;
    journalEntries?: Prisma.JournalEntryUncheckedUpdateManyWithoutBranchNestedInput;
};
export type BranchCreateWithoutSuppliersInput = {
    id?: string;
    code: string;
    name: string;
    brandId: $Enums.BrandId;
    address?: string | null;
    isActive?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    users?: Prisma.UserCreateNestedManyWithoutBranchInput;
    itemStocks?: Prisma.ItemStockCreateNestedManyWithoutBranchInput;
    customers?: Prisma.CustomerCreateNestedManyWithoutBranchInput;
    salesInvoices?: Prisma.SalesInvoiceCreateNestedManyWithoutBranchInput;
    journalEntries?: Prisma.JournalEntryCreateNestedManyWithoutBranchInput;
};
export type BranchUncheckedCreateWithoutSuppliersInput = {
    id?: string;
    code: string;
    name: string;
    brandId: $Enums.BrandId;
    address?: string | null;
    isActive?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    users?: Prisma.UserUncheckedCreateNestedManyWithoutBranchInput;
    itemStocks?: Prisma.ItemStockUncheckedCreateNestedManyWithoutBranchInput;
    customers?: Prisma.CustomerUncheckedCreateNestedManyWithoutBranchInput;
    salesInvoices?: Prisma.SalesInvoiceUncheckedCreateNestedManyWithoutBranchInput;
    journalEntries?: Prisma.JournalEntryUncheckedCreateNestedManyWithoutBranchInput;
};
export type BranchCreateOrConnectWithoutSuppliersInput = {
    where: Prisma.BranchWhereUniqueInput;
    create: Prisma.XOR<Prisma.BranchCreateWithoutSuppliersInput, Prisma.BranchUncheckedCreateWithoutSuppliersInput>;
};
export type BranchUpsertWithoutSuppliersInput = {
    update: Prisma.XOR<Prisma.BranchUpdateWithoutSuppliersInput, Prisma.BranchUncheckedUpdateWithoutSuppliersInput>;
    create: Prisma.XOR<Prisma.BranchCreateWithoutSuppliersInput, Prisma.BranchUncheckedCreateWithoutSuppliersInput>;
    where?: Prisma.BranchWhereInput;
};
export type BranchUpdateToOneWithWhereWithoutSuppliersInput = {
    where?: Prisma.BranchWhereInput;
    data: Prisma.XOR<Prisma.BranchUpdateWithoutSuppliersInput, Prisma.BranchUncheckedUpdateWithoutSuppliersInput>;
};
export type BranchUpdateWithoutSuppliersInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    code?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    brandId?: Prisma.EnumBrandIdFieldUpdateOperationsInput | $Enums.BrandId;
    address?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    isActive?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    users?: Prisma.UserUpdateManyWithoutBranchNestedInput;
    itemStocks?: Prisma.ItemStockUpdateManyWithoutBranchNestedInput;
    customers?: Prisma.CustomerUpdateManyWithoutBranchNestedInput;
    salesInvoices?: Prisma.SalesInvoiceUpdateManyWithoutBranchNestedInput;
    journalEntries?: Prisma.JournalEntryUpdateManyWithoutBranchNestedInput;
};
export type BranchUncheckedUpdateWithoutSuppliersInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    code?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    brandId?: Prisma.EnumBrandIdFieldUpdateOperationsInput | $Enums.BrandId;
    address?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    isActive?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    users?: Prisma.UserUncheckedUpdateManyWithoutBranchNestedInput;
    itemStocks?: Prisma.ItemStockUncheckedUpdateManyWithoutBranchNestedInput;
    customers?: Prisma.CustomerUncheckedUpdateManyWithoutBranchNestedInput;
    salesInvoices?: Prisma.SalesInvoiceUncheckedUpdateManyWithoutBranchNestedInput;
    journalEntries?: Prisma.JournalEntryUncheckedUpdateManyWithoutBranchNestedInput;
};
export type BranchCreateWithoutJournalEntriesInput = {
    id?: string;
    code: string;
    name: string;
    brandId: $Enums.BrandId;
    address?: string | null;
    isActive?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    users?: Prisma.UserCreateNestedManyWithoutBranchInput;
    itemStocks?: Prisma.ItemStockCreateNestedManyWithoutBranchInput;
    customers?: Prisma.CustomerCreateNestedManyWithoutBranchInput;
    suppliers?: Prisma.SupplierCreateNestedManyWithoutBranchInput;
    salesInvoices?: Prisma.SalesInvoiceCreateNestedManyWithoutBranchInput;
};
export type BranchUncheckedCreateWithoutJournalEntriesInput = {
    id?: string;
    code: string;
    name: string;
    brandId: $Enums.BrandId;
    address?: string | null;
    isActive?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    users?: Prisma.UserUncheckedCreateNestedManyWithoutBranchInput;
    itemStocks?: Prisma.ItemStockUncheckedCreateNestedManyWithoutBranchInput;
    customers?: Prisma.CustomerUncheckedCreateNestedManyWithoutBranchInput;
    suppliers?: Prisma.SupplierUncheckedCreateNestedManyWithoutBranchInput;
    salesInvoices?: Prisma.SalesInvoiceUncheckedCreateNestedManyWithoutBranchInput;
};
export type BranchCreateOrConnectWithoutJournalEntriesInput = {
    where: Prisma.BranchWhereUniqueInput;
    create: Prisma.XOR<Prisma.BranchCreateWithoutJournalEntriesInput, Prisma.BranchUncheckedCreateWithoutJournalEntriesInput>;
};
export type BranchUpsertWithoutJournalEntriesInput = {
    update: Prisma.XOR<Prisma.BranchUpdateWithoutJournalEntriesInput, Prisma.BranchUncheckedUpdateWithoutJournalEntriesInput>;
    create: Prisma.XOR<Prisma.BranchCreateWithoutJournalEntriesInput, Prisma.BranchUncheckedCreateWithoutJournalEntriesInput>;
    where?: Prisma.BranchWhereInput;
};
export type BranchUpdateToOneWithWhereWithoutJournalEntriesInput = {
    where?: Prisma.BranchWhereInput;
    data: Prisma.XOR<Prisma.BranchUpdateWithoutJournalEntriesInput, Prisma.BranchUncheckedUpdateWithoutJournalEntriesInput>;
};
export type BranchUpdateWithoutJournalEntriesInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    code?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    brandId?: Prisma.EnumBrandIdFieldUpdateOperationsInput | $Enums.BrandId;
    address?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    isActive?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    users?: Prisma.UserUpdateManyWithoutBranchNestedInput;
    itemStocks?: Prisma.ItemStockUpdateManyWithoutBranchNestedInput;
    customers?: Prisma.CustomerUpdateManyWithoutBranchNestedInput;
    suppliers?: Prisma.SupplierUpdateManyWithoutBranchNestedInput;
    salesInvoices?: Prisma.SalesInvoiceUpdateManyWithoutBranchNestedInput;
};
export type BranchUncheckedUpdateWithoutJournalEntriesInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    code?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    brandId?: Prisma.EnumBrandIdFieldUpdateOperationsInput | $Enums.BrandId;
    address?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    isActive?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    users?: Prisma.UserUncheckedUpdateManyWithoutBranchNestedInput;
    itemStocks?: Prisma.ItemStockUncheckedUpdateManyWithoutBranchNestedInput;
    customers?: Prisma.CustomerUncheckedUpdateManyWithoutBranchNestedInput;
    suppliers?: Prisma.SupplierUncheckedUpdateManyWithoutBranchNestedInput;
    salesInvoices?: Prisma.SalesInvoiceUncheckedUpdateManyWithoutBranchNestedInput;
};
export type BranchCreateWithoutSalesInvoicesInput = {
    id?: string;
    code: string;
    name: string;
    brandId: $Enums.BrandId;
    address?: string | null;
    isActive?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    users?: Prisma.UserCreateNestedManyWithoutBranchInput;
    itemStocks?: Prisma.ItemStockCreateNestedManyWithoutBranchInput;
    customers?: Prisma.CustomerCreateNestedManyWithoutBranchInput;
    suppliers?: Prisma.SupplierCreateNestedManyWithoutBranchInput;
    journalEntries?: Prisma.JournalEntryCreateNestedManyWithoutBranchInput;
};
export type BranchUncheckedCreateWithoutSalesInvoicesInput = {
    id?: string;
    code: string;
    name: string;
    brandId: $Enums.BrandId;
    address?: string | null;
    isActive?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    users?: Prisma.UserUncheckedCreateNestedManyWithoutBranchInput;
    itemStocks?: Prisma.ItemStockUncheckedCreateNestedManyWithoutBranchInput;
    customers?: Prisma.CustomerUncheckedCreateNestedManyWithoutBranchInput;
    suppliers?: Prisma.SupplierUncheckedCreateNestedManyWithoutBranchInput;
    journalEntries?: Prisma.JournalEntryUncheckedCreateNestedManyWithoutBranchInput;
};
export type BranchCreateOrConnectWithoutSalesInvoicesInput = {
    where: Prisma.BranchWhereUniqueInput;
    create: Prisma.XOR<Prisma.BranchCreateWithoutSalesInvoicesInput, Prisma.BranchUncheckedCreateWithoutSalesInvoicesInput>;
};
export type BranchUpsertWithoutSalesInvoicesInput = {
    update: Prisma.XOR<Prisma.BranchUpdateWithoutSalesInvoicesInput, Prisma.BranchUncheckedUpdateWithoutSalesInvoicesInput>;
    create: Prisma.XOR<Prisma.BranchCreateWithoutSalesInvoicesInput, Prisma.BranchUncheckedCreateWithoutSalesInvoicesInput>;
    where?: Prisma.BranchWhereInput;
};
export type BranchUpdateToOneWithWhereWithoutSalesInvoicesInput = {
    where?: Prisma.BranchWhereInput;
    data: Prisma.XOR<Prisma.BranchUpdateWithoutSalesInvoicesInput, Prisma.BranchUncheckedUpdateWithoutSalesInvoicesInput>;
};
export type BranchUpdateWithoutSalesInvoicesInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    code?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    brandId?: Prisma.EnumBrandIdFieldUpdateOperationsInput | $Enums.BrandId;
    address?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    isActive?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    users?: Prisma.UserUpdateManyWithoutBranchNestedInput;
    itemStocks?: Prisma.ItemStockUpdateManyWithoutBranchNestedInput;
    customers?: Prisma.CustomerUpdateManyWithoutBranchNestedInput;
    suppliers?: Prisma.SupplierUpdateManyWithoutBranchNestedInput;
    journalEntries?: Prisma.JournalEntryUpdateManyWithoutBranchNestedInput;
};
export type BranchUncheckedUpdateWithoutSalesInvoicesInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    code?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    brandId?: Prisma.EnumBrandIdFieldUpdateOperationsInput | $Enums.BrandId;
    address?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    isActive?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    users?: Prisma.UserUncheckedUpdateManyWithoutBranchNestedInput;
    itemStocks?: Prisma.ItemStockUncheckedUpdateManyWithoutBranchNestedInput;
    customers?: Prisma.CustomerUncheckedUpdateManyWithoutBranchNestedInput;
    suppliers?: Prisma.SupplierUncheckedUpdateManyWithoutBranchNestedInput;
    journalEntries?: Prisma.JournalEntryUncheckedUpdateManyWithoutBranchNestedInput;
};
export type BranchCountOutputType = {
    users: number;
    itemStocks: number;
    customers: number;
    suppliers: number;
    salesInvoices: number;
    journalEntries: number;
};
export type BranchCountOutputTypeSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    users?: boolean | BranchCountOutputTypeCountUsersArgs;
    itemStocks?: boolean | BranchCountOutputTypeCountItemStocksArgs;
    customers?: boolean | BranchCountOutputTypeCountCustomersArgs;
    suppliers?: boolean | BranchCountOutputTypeCountSuppliersArgs;
    salesInvoices?: boolean | BranchCountOutputTypeCountSalesInvoicesArgs;
    journalEntries?: boolean | BranchCountOutputTypeCountJournalEntriesArgs;
};
export type BranchCountOutputTypeDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.BranchCountOutputTypeSelect<ExtArgs> | null;
};
export type BranchCountOutputTypeCountUsersArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.UserWhereInput;
};
export type BranchCountOutputTypeCountItemStocksArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.ItemStockWhereInput;
};
export type BranchCountOutputTypeCountCustomersArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.CustomerWhereInput;
};
export type BranchCountOutputTypeCountSuppliersArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.SupplierWhereInput;
};
export type BranchCountOutputTypeCountSalesInvoicesArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.SalesInvoiceWhereInput;
};
export type BranchCountOutputTypeCountJournalEntriesArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.JournalEntryWhereInput;
};
export type BranchSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    code?: boolean;
    name?: boolean;
    brandId?: boolean;
    address?: boolean;
    isActive?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    users?: boolean | Prisma.Branch$usersArgs<ExtArgs>;
    itemStocks?: boolean | Prisma.Branch$itemStocksArgs<ExtArgs>;
    customers?: boolean | Prisma.Branch$customersArgs<ExtArgs>;
    suppliers?: boolean | Prisma.Branch$suppliersArgs<ExtArgs>;
    salesInvoices?: boolean | Prisma.Branch$salesInvoicesArgs<ExtArgs>;
    journalEntries?: boolean | Prisma.Branch$journalEntriesArgs<ExtArgs>;
    _count?: boolean | Prisma.BranchCountOutputTypeDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["branch"]>;
export type BranchSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    code?: boolean;
    name?: boolean;
    brandId?: boolean;
    address?: boolean;
    isActive?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
}, ExtArgs["result"]["branch"]>;
export type BranchSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    code?: boolean;
    name?: boolean;
    brandId?: boolean;
    address?: boolean;
    isActive?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
}, ExtArgs["result"]["branch"]>;
export type BranchSelectScalar = {
    id?: boolean;
    code?: boolean;
    name?: boolean;
    brandId?: boolean;
    address?: boolean;
    isActive?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
};
export type BranchOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "code" | "name" | "brandId" | "address" | "isActive" | "createdAt" | "updatedAt", ExtArgs["result"]["branch"]>;
export type BranchInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    users?: boolean | Prisma.Branch$usersArgs<ExtArgs>;
    itemStocks?: boolean | Prisma.Branch$itemStocksArgs<ExtArgs>;
    customers?: boolean | Prisma.Branch$customersArgs<ExtArgs>;
    suppliers?: boolean | Prisma.Branch$suppliersArgs<ExtArgs>;
    salesInvoices?: boolean | Prisma.Branch$salesInvoicesArgs<ExtArgs>;
    journalEntries?: boolean | Prisma.Branch$journalEntriesArgs<ExtArgs>;
    _count?: boolean | Prisma.BranchCountOutputTypeDefaultArgs<ExtArgs>;
};
export type BranchIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {};
export type BranchIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {};
export type $BranchPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "Branch";
    objects: {
        users: Prisma.$UserPayload<ExtArgs>[];
        itemStocks: Prisma.$ItemStockPayload<ExtArgs>[];
        customers: Prisma.$CustomerPayload<ExtArgs>[];
        suppliers: Prisma.$SupplierPayload<ExtArgs>[];
        salesInvoices: Prisma.$SalesInvoicePayload<ExtArgs>[];
        journalEntries: Prisma.$JournalEntryPayload<ExtArgs>[];
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        code: string;
        name: string;
        brandId: $Enums.BrandId;
        address: string | null;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    }, ExtArgs["result"]["branch"]>;
    composites: {};
};
export type BranchGetPayload<S extends boolean | null | undefined | BranchDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$BranchPayload, S>;
export type BranchCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<BranchFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: BranchCountAggregateInputType | true;
};
export interface BranchDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['Branch'];
        meta: {
            name: 'Branch';
        };
    };
    findUnique<T extends BranchFindUniqueArgs>(args: Prisma.SelectSubset<T, BranchFindUniqueArgs<ExtArgs>>): Prisma.Prisma__BranchClient<runtime.Types.Result.GetResult<Prisma.$BranchPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends BranchFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, BranchFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__BranchClient<runtime.Types.Result.GetResult<Prisma.$BranchPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends BranchFindFirstArgs>(args?: Prisma.SelectSubset<T, BranchFindFirstArgs<ExtArgs>>): Prisma.Prisma__BranchClient<runtime.Types.Result.GetResult<Prisma.$BranchPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends BranchFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, BranchFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__BranchClient<runtime.Types.Result.GetResult<Prisma.$BranchPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends BranchFindManyArgs>(args?: Prisma.SelectSubset<T, BranchFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$BranchPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends BranchCreateArgs>(args: Prisma.SelectSubset<T, BranchCreateArgs<ExtArgs>>): Prisma.Prisma__BranchClient<runtime.Types.Result.GetResult<Prisma.$BranchPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends BranchCreateManyArgs>(args?: Prisma.SelectSubset<T, BranchCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends BranchCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, BranchCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$BranchPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends BranchDeleteArgs>(args: Prisma.SelectSubset<T, BranchDeleteArgs<ExtArgs>>): Prisma.Prisma__BranchClient<runtime.Types.Result.GetResult<Prisma.$BranchPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends BranchUpdateArgs>(args: Prisma.SelectSubset<T, BranchUpdateArgs<ExtArgs>>): Prisma.Prisma__BranchClient<runtime.Types.Result.GetResult<Prisma.$BranchPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends BranchDeleteManyArgs>(args?: Prisma.SelectSubset<T, BranchDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends BranchUpdateManyArgs>(args: Prisma.SelectSubset<T, BranchUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends BranchUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, BranchUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$BranchPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends BranchUpsertArgs>(args: Prisma.SelectSubset<T, BranchUpsertArgs<ExtArgs>>): Prisma.Prisma__BranchClient<runtime.Types.Result.GetResult<Prisma.$BranchPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends BranchCountArgs>(args?: Prisma.Subset<T, BranchCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], BranchCountAggregateOutputType> : number>;
    aggregate<T extends BranchAggregateArgs>(args: Prisma.Subset<T, BranchAggregateArgs>): Prisma.PrismaPromise<GetBranchAggregateType<T>>;
    groupBy<T extends BranchGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: BranchGroupByArgs['orderBy'];
    } : {
        orderBy?: BranchGroupByArgs['orderBy'];
    }, OrderFields extends Prisma.ExcludeUnderscoreKeys<Prisma.Keys<Prisma.MaybeTupleToUnion<T['orderBy']>>>, ByFields extends Prisma.MaybeTupleToUnion<T['by']>, ByValid extends Prisma.Has<ByFields, OrderFields>, HavingFields extends Prisma.GetHavingFields<T['having']>, HavingValid extends Prisma.Has<ByFields, HavingFields>, ByEmpty extends T['by'] extends never[] ? Prisma.True : Prisma.False, InputErrors extends ByEmpty extends Prisma.True ? `Error: "by" must not be empty.` : HavingValid extends Prisma.False ? {
        [P in HavingFields]: P extends ByFields ? never : P extends string ? `Error: Field "${P}" used in "having" needs to be provided in "by".` : [
            Error,
            'Field ',
            P,
            ` in "having" needs to be provided in "by"`
        ];
    }[HavingFields] : 'take' extends Prisma.Keys<T> ? 'orderBy' extends Prisma.Keys<T> ? ByValid extends Prisma.True ? {} : {
        [P in OrderFields]: P extends ByFields ? never : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
    }[OrderFields] : 'Error: If you provide "take", you also need to provide "orderBy"' : 'skip' extends Prisma.Keys<T> ? 'orderBy' extends Prisma.Keys<T> ? ByValid extends Prisma.True ? {} : {
        [P in OrderFields]: P extends ByFields ? never : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
    }[OrderFields] : 'Error: If you provide "skip", you also need to provide "orderBy"' : ByValid extends Prisma.True ? {} : {
        [P in OrderFields]: P extends ByFields ? never : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, BranchGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetBranchGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: BranchFieldRefs;
}
export interface Prisma__BranchClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    users<T extends Prisma.Branch$usersArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.Branch$usersArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    itemStocks<T extends Prisma.Branch$itemStocksArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.Branch$itemStocksArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$ItemStockPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    customers<T extends Prisma.Branch$customersArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.Branch$customersArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$CustomerPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    suppliers<T extends Prisma.Branch$suppliersArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.Branch$suppliersArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$SupplierPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    salesInvoices<T extends Prisma.Branch$salesInvoicesArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.Branch$salesInvoicesArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$SalesInvoicePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    journalEntries<T extends Prisma.Branch$journalEntriesArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.Branch$journalEntriesArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$JournalEntryPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface BranchFieldRefs {
    readonly id: Prisma.FieldRef<"Branch", 'String'>;
    readonly code: Prisma.FieldRef<"Branch", 'String'>;
    readonly name: Prisma.FieldRef<"Branch", 'String'>;
    readonly brandId: Prisma.FieldRef<"Branch", 'BrandId'>;
    readonly address: Prisma.FieldRef<"Branch", 'String'>;
    readonly isActive: Prisma.FieldRef<"Branch", 'Boolean'>;
    readonly createdAt: Prisma.FieldRef<"Branch", 'DateTime'>;
    readonly updatedAt: Prisma.FieldRef<"Branch", 'DateTime'>;
}
export type BranchFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.BranchSelect<ExtArgs> | null;
    omit?: Prisma.BranchOmit<ExtArgs> | null;
    include?: Prisma.BranchInclude<ExtArgs> | null;
    where: Prisma.BranchWhereUniqueInput;
};
export type BranchFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.BranchSelect<ExtArgs> | null;
    omit?: Prisma.BranchOmit<ExtArgs> | null;
    include?: Prisma.BranchInclude<ExtArgs> | null;
    where: Prisma.BranchWhereUniqueInput;
};
export type BranchFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.BranchSelect<ExtArgs> | null;
    omit?: Prisma.BranchOmit<ExtArgs> | null;
    include?: Prisma.BranchInclude<ExtArgs> | null;
    where?: Prisma.BranchWhereInput;
    orderBy?: Prisma.BranchOrderByWithRelationInput | Prisma.BranchOrderByWithRelationInput[];
    cursor?: Prisma.BranchWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.BranchScalarFieldEnum | Prisma.BranchScalarFieldEnum[];
};
export type BranchFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.BranchSelect<ExtArgs> | null;
    omit?: Prisma.BranchOmit<ExtArgs> | null;
    include?: Prisma.BranchInclude<ExtArgs> | null;
    where?: Prisma.BranchWhereInput;
    orderBy?: Prisma.BranchOrderByWithRelationInput | Prisma.BranchOrderByWithRelationInput[];
    cursor?: Prisma.BranchWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.BranchScalarFieldEnum | Prisma.BranchScalarFieldEnum[];
};
export type BranchFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.BranchSelect<ExtArgs> | null;
    omit?: Prisma.BranchOmit<ExtArgs> | null;
    include?: Prisma.BranchInclude<ExtArgs> | null;
    where?: Prisma.BranchWhereInput;
    orderBy?: Prisma.BranchOrderByWithRelationInput | Prisma.BranchOrderByWithRelationInput[];
    cursor?: Prisma.BranchWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.BranchScalarFieldEnum | Prisma.BranchScalarFieldEnum[];
};
export type BranchCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.BranchSelect<ExtArgs> | null;
    omit?: Prisma.BranchOmit<ExtArgs> | null;
    include?: Prisma.BranchInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.BranchCreateInput, Prisma.BranchUncheckedCreateInput>;
};
export type BranchCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.BranchCreateManyInput | Prisma.BranchCreateManyInput[];
    skipDuplicates?: boolean;
};
export type BranchCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.BranchSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.BranchOmit<ExtArgs> | null;
    data: Prisma.BranchCreateManyInput | Prisma.BranchCreateManyInput[];
    skipDuplicates?: boolean;
};
export type BranchUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.BranchSelect<ExtArgs> | null;
    omit?: Prisma.BranchOmit<ExtArgs> | null;
    include?: Prisma.BranchInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.BranchUpdateInput, Prisma.BranchUncheckedUpdateInput>;
    where: Prisma.BranchWhereUniqueInput;
};
export type BranchUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.BranchUpdateManyMutationInput, Prisma.BranchUncheckedUpdateManyInput>;
    where?: Prisma.BranchWhereInput;
    limit?: number;
};
export type BranchUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.BranchSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.BranchOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.BranchUpdateManyMutationInput, Prisma.BranchUncheckedUpdateManyInput>;
    where?: Prisma.BranchWhereInput;
    limit?: number;
};
export type BranchUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.BranchSelect<ExtArgs> | null;
    omit?: Prisma.BranchOmit<ExtArgs> | null;
    include?: Prisma.BranchInclude<ExtArgs> | null;
    where: Prisma.BranchWhereUniqueInput;
    create: Prisma.XOR<Prisma.BranchCreateInput, Prisma.BranchUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.BranchUpdateInput, Prisma.BranchUncheckedUpdateInput>;
};
export type BranchDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.BranchSelect<ExtArgs> | null;
    omit?: Prisma.BranchOmit<ExtArgs> | null;
    include?: Prisma.BranchInclude<ExtArgs> | null;
    where: Prisma.BranchWhereUniqueInput;
};
export type BranchDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.BranchWhereInput;
    limit?: number;
};
export type Branch$usersArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.UserSelect<ExtArgs> | null;
    omit?: Prisma.UserOmit<ExtArgs> | null;
    include?: Prisma.UserInclude<ExtArgs> | null;
    where?: Prisma.UserWhereInput;
    orderBy?: Prisma.UserOrderByWithRelationInput | Prisma.UserOrderByWithRelationInput[];
    cursor?: Prisma.UserWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.UserScalarFieldEnum | Prisma.UserScalarFieldEnum[];
};
export type Branch$itemStocksArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ItemStockSelect<ExtArgs> | null;
    omit?: Prisma.ItemStockOmit<ExtArgs> | null;
    include?: Prisma.ItemStockInclude<ExtArgs> | null;
    where?: Prisma.ItemStockWhereInput;
    orderBy?: Prisma.ItemStockOrderByWithRelationInput | Prisma.ItemStockOrderByWithRelationInput[];
    cursor?: Prisma.ItemStockWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.ItemStockScalarFieldEnum | Prisma.ItemStockScalarFieldEnum[];
};
export type Branch$customersArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CustomerSelect<ExtArgs> | null;
    omit?: Prisma.CustomerOmit<ExtArgs> | null;
    include?: Prisma.CustomerInclude<ExtArgs> | null;
    where?: Prisma.CustomerWhereInput;
    orderBy?: Prisma.CustomerOrderByWithRelationInput | Prisma.CustomerOrderByWithRelationInput[];
    cursor?: Prisma.CustomerWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.CustomerScalarFieldEnum | Prisma.CustomerScalarFieldEnum[];
};
export type Branch$suppliersArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.SupplierSelect<ExtArgs> | null;
    omit?: Prisma.SupplierOmit<ExtArgs> | null;
    include?: Prisma.SupplierInclude<ExtArgs> | null;
    where?: Prisma.SupplierWhereInput;
    orderBy?: Prisma.SupplierOrderByWithRelationInput | Prisma.SupplierOrderByWithRelationInput[];
    cursor?: Prisma.SupplierWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.SupplierScalarFieldEnum | Prisma.SupplierScalarFieldEnum[];
};
export type Branch$salesInvoicesArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.SalesInvoiceSelect<ExtArgs> | null;
    omit?: Prisma.SalesInvoiceOmit<ExtArgs> | null;
    include?: Prisma.SalesInvoiceInclude<ExtArgs> | null;
    where?: Prisma.SalesInvoiceWhereInput;
    orderBy?: Prisma.SalesInvoiceOrderByWithRelationInput | Prisma.SalesInvoiceOrderByWithRelationInput[];
    cursor?: Prisma.SalesInvoiceWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.SalesInvoiceScalarFieldEnum | Prisma.SalesInvoiceScalarFieldEnum[];
};
export type Branch$journalEntriesArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.JournalEntrySelect<ExtArgs> | null;
    omit?: Prisma.JournalEntryOmit<ExtArgs> | null;
    include?: Prisma.JournalEntryInclude<ExtArgs> | null;
    where?: Prisma.JournalEntryWhereInput;
    orderBy?: Prisma.JournalEntryOrderByWithRelationInput | Prisma.JournalEntryOrderByWithRelationInput[];
    cursor?: Prisma.JournalEntryWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.JournalEntryScalarFieldEnum | Prisma.JournalEntryScalarFieldEnum[];
};
export type BranchDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.BranchSelect<ExtArgs> | null;
    omit?: Prisma.BranchOmit<ExtArgs> | null;
    include?: Prisma.BranchInclude<ExtArgs> | null;
};
