import type * as runtime from "@prisma/client/runtime/client";
import type * as $Enums from "../enums.js";
import type * as Prisma from "../internal/prismaNamespace.js";
export type SalesInvoiceModel = runtime.Types.Result.DefaultSelection<Prisma.$SalesInvoicePayload>;
export type AggregateSalesInvoice = {
    _count: SalesInvoiceCountAggregateOutputType | null;
    _avg: SalesInvoiceAvgAggregateOutputType | null;
    _sum: SalesInvoiceSumAggregateOutputType | null;
    _min: SalesInvoiceMinAggregateOutputType | null;
    _max: SalesInvoiceMaxAggregateOutputType | null;
};
export type SalesInvoiceAvgAggregateOutputType = {
    subtotal: runtime.Decimal | null;
    taxAmount: runtime.Decimal | null;
    totalAmount: runtime.Decimal | null;
};
export type SalesInvoiceSumAggregateOutputType = {
    subtotal: runtime.Decimal | null;
    taxAmount: runtime.Decimal | null;
    totalAmount: runtime.Decimal | null;
};
export type SalesInvoiceMinAggregateOutputType = {
    id: string | null;
    invoiceNumber: string | null;
    date: Date | null;
    customerId: string | null;
    branchId: string | null;
    userId: string | null;
    paymentMethod: $Enums.PaymentMethod | null;
    status: $Enums.InvoiceStatus | null;
    subtotal: runtime.Decimal | null;
    taxAmount: runtime.Decimal | null;
    totalAmount: runtime.Decimal | null;
    createdAt: Date | null;
};
export type SalesInvoiceMaxAggregateOutputType = {
    id: string | null;
    invoiceNumber: string | null;
    date: Date | null;
    customerId: string | null;
    branchId: string | null;
    userId: string | null;
    paymentMethod: $Enums.PaymentMethod | null;
    status: $Enums.InvoiceStatus | null;
    subtotal: runtime.Decimal | null;
    taxAmount: runtime.Decimal | null;
    totalAmount: runtime.Decimal | null;
    createdAt: Date | null;
};
export type SalesInvoiceCountAggregateOutputType = {
    id: number;
    invoiceNumber: number;
    date: number;
    customerId: number;
    branchId: number;
    userId: number;
    paymentMethod: number;
    status: number;
    subtotal: number;
    taxAmount: number;
    totalAmount: number;
    createdAt: number;
    _all: number;
};
export type SalesInvoiceAvgAggregateInputType = {
    subtotal?: true;
    taxAmount?: true;
    totalAmount?: true;
};
export type SalesInvoiceSumAggregateInputType = {
    subtotal?: true;
    taxAmount?: true;
    totalAmount?: true;
};
export type SalesInvoiceMinAggregateInputType = {
    id?: true;
    invoiceNumber?: true;
    date?: true;
    customerId?: true;
    branchId?: true;
    userId?: true;
    paymentMethod?: true;
    status?: true;
    subtotal?: true;
    taxAmount?: true;
    totalAmount?: true;
    createdAt?: true;
};
export type SalesInvoiceMaxAggregateInputType = {
    id?: true;
    invoiceNumber?: true;
    date?: true;
    customerId?: true;
    branchId?: true;
    userId?: true;
    paymentMethod?: true;
    status?: true;
    subtotal?: true;
    taxAmount?: true;
    totalAmount?: true;
    createdAt?: true;
};
export type SalesInvoiceCountAggregateInputType = {
    id?: true;
    invoiceNumber?: true;
    date?: true;
    customerId?: true;
    branchId?: true;
    userId?: true;
    paymentMethod?: true;
    status?: true;
    subtotal?: true;
    taxAmount?: true;
    totalAmount?: true;
    createdAt?: true;
    _all?: true;
};
export type SalesInvoiceAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.SalesInvoiceWhereInput;
    orderBy?: Prisma.SalesInvoiceOrderByWithRelationInput | Prisma.SalesInvoiceOrderByWithRelationInput[];
    cursor?: Prisma.SalesInvoiceWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | SalesInvoiceCountAggregateInputType;
    _avg?: SalesInvoiceAvgAggregateInputType;
    _sum?: SalesInvoiceSumAggregateInputType;
    _min?: SalesInvoiceMinAggregateInputType;
    _max?: SalesInvoiceMaxAggregateInputType;
};
export type GetSalesInvoiceAggregateType<T extends SalesInvoiceAggregateArgs> = {
    [P in keyof T & keyof AggregateSalesInvoice]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateSalesInvoice[P]> : Prisma.GetScalarType<T[P], AggregateSalesInvoice[P]>;
};
export type SalesInvoiceGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.SalesInvoiceWhereInput;
    orderBy?: Prisma.SalesInvoiceOrderByWithAggregationInput | Prisma.SalesInvoiceOrderByWithAggregationInput[];
    by: Prisma.SalesInvoiceScalarFieldEnum[] | Prisma.SalesInvoiceScalarFieldEnum;
    having?: Prisma.SalesInvoiceScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: SalesInvoiceCountAggregateInputType | true;
    _avg?: SalesInvoiceAvgAggregateInputType;
    _sum?: SalesInvoiceSumAggregateInputType;
    _min?: SalesInvoiceMinAggregateInputType;
    _max?: SalesInvoiceMaxAggregateInputType;
};
export type SalesInvoiceGroupByOutputType = {
    id: string;
    invoiceNumber: string;
    date: Date;
    customerId: string | null;
    branchId: string;
    userId: string;
    paymentMethod: $Enums.PaymentMethod;
    status: $Enums.InvoiceStatus;
    subtotal: runtime.Decimal;
    taxAmount: runtime.Decimal;
    totalAmount: runtime.Decimal;
    createdAt: Date;
    _count: SalesInvoiceCountAggregateOutputType | null;
    _avg: SalesInvoiceAvgAggregateOutputType | null;
    _sum: SalesInvoiceSumAggregateOutputType | null;
    _min: SalesInvoiceMinAggregateOutputType | null;
    _max: SalesInvoiceMaxAggregateOutputType | null;
};
export type GetSalesInvoiceGroupByPayload<T extends SalesInvoiceGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<SalesInvoiceGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof SalesInvoiceGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], SalesInvoiceGroupByOutputType[P]> : Prisma.GetScalarType<T[P], SalesInvoiceGroupByOutputType[P]>;
}>>;
export type SalesInvoiceWhereInput = {
    AND?: Prisma.SalesInvoiceWhereInput | Prisma.SalesInvoiceWhereInput[];
    OR?: Prisma.SalesInvoiceWhereInput[];
    NOT?: Prisma.SalesInvoiceWhereInput | Prisma.SalesInvoiceWhereInput[];
    id?: Prisma.StringFilter<"SalesInvoice"> | string;
    invoiceNumber?: Prisma.StringFilter<"SalesInvoice"> | string;
    date?: Prisma.DateTimeFilter<"SalesInvoice"> | Date | string;
    customerId?: Prisma.StringNullableFilter<"SalesInvoice"> | string | null;
    branchId?: Prisma.StringFilter<"SalesInvoice"> | string;
    userId?: Prisma.StringFilter<"SalesInvoice"> | string;
    paymentMethod?: Prisma.EnumPaymentMethodFilter<"SalesInvoice"> | $Enums.PaymentMethod;
    status?: Prisma.EnumInvoiceStatusFilter<"SalesInvoice"> | $Enums.InvoiceStatus;
    subtotal?: Prisma.DecimalFilter<"SalesInvoice"> | runtime.Decimal | runtime.DecimalJsLike | number | string;
    taxAmount?: Prisma.DecimalFilter<"SalesInvoice"> | runtime.Decimal | runtime.DecimalJsLike | number | string;
    totalAmount?: Prisma.DecimalFilter<"SalesInvoice"> | runtime.Decimal | runtime.DecimalJsLike | number | string;
    createdAt?: Prisma.DateTimeFilter<"SalesInvoice"> | Date | string;
    customer?: Prisma.XOR<Prisma.CustomerNullableScalarRelationFilter, Prisma.CustomerWhereInput> | null;
    branch?: Prisma.XOR<Prisma.BranchScalarRelationFilter, Prisma.BranchWhereInput>;
    user?: Prisma.XOR<Prisma.UserScalarRelationFilter, Prisma.UserWhereInput>;
    lines?: Prisma.SalesInvoiceLineListRelationFilter;
    journalEntry?: Prisma.XOR<Prisma.JournalEntryNullableScalarRelationFilter, Prisma.JournalEntryWhereInput> | null;
};
export type SalesInvoiceOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    invoiceNumber?: Prisma.SortOrder;
    date?: Prisma.SortOrder;
    customerId?: Prisma.SortOrderInput | Prisma.SortOrder;
    branchId?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    paymentMethod?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    subtotal?: Prisma.SortOrder;
    taxAmount?: Prisma.SortOrder;
    totalAmount?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    customer?: Prisma.CustomerOrderByWithRelationInput;
    branch?: Prisma.BranchOrderByWithRelationInput;
    user?: Prisma.UserOrderByWithRelationInput;
    lines?: Prisma.SalesInvoiceLineOrderByRelationAggregateInput;
    journalEntry?: Prisma.JournalEntryOrderByWithRelationInput;
};
export type SalesInvoiceWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    invoiceNumber?: string;
    AND?: Prisma.SalesInvoiceWhereInput | Prisma.SalesInvoiceWhereInput[];
    OR?: Prisma.SalesInvoiceWhereInput[];
    NOT?: Prisma.SalesInvoiceWhereInput | Prisma.SalesInvoiceWhereInput[];
    date?: Prisma.DateTimeFilter<"SalesInvoice"> | Date | string;
    customerId?: Prisma.StringNullableFilter<"SalesInvoice"> | string | null;
    branchId?: Prisma.StringFilter<"SalesInvoice"> | string;
    userId?: Prisma.StringFilter<"SalesInvoice"> | string;
    paymentMethod?: Prisma.EnumPaymentMethodFilter<"SalesInvoice"> | $Enums.PaymentMethod;
    status?: Prisma.EnumInvoiceStatusFilter<"SalesInvoice"> | $Enums.InvoiceStatus;
    subtotal?: Prisma.DecimalFilter<"SalesInvoice"> | runtime.Decimal | runtime.DecimalJsLike | number | string;
    taxAmount?: Prisma.DecimalFilter<"SalesInvoice"> | runtime.Decimal | runtime.DecimalJsLike | number | string;
    totalAmount?: Prisma.DecimalFilter<"SalesInvoice"> | runtime.Decimal | runtime.DecimalJsLike | number | string;
    createdAt?: Prisma.DateTimeFilter<"SalesInvoice"> | Date | string;
    customer?: Prisma.XOR<Prisma.CustomerNullableScalarRelationFilter, Prisma.CustomerWhereInput> | null;
    branch?: Prisma.XOR<Prisma.BranchScalarRelationFilter, Prisma.BranchWhereInput>;
    user?: Prisma.XOR<Prisma.UserScalarRelationFilter, Prisma.UserWhereInput>;
    lines?: Prisma.SalesInvoiceLineListRelationFilter;
    journalEntry?: Prisma.XOR<Prisma.JournalEntryNullableScalarRelationFilter, Prisma.JournalEntryWhereInput> | null;
}, "id" | "invoiceNumber">;
export type SalesInvoiceOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    invoiceNumber?: Prisma.SortOrder;
    date?: Prisma.SortOrder;
    customerId?: Prisma.SortOrderInput | Prisma.SortOrder;
    branchId?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    paymentMethod?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    subtotal?: Prisma.SortOrder;
    taxAmount?: Prisma.SortOrder;
    totalAmount?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    _count?: Prisma.SalesInvoiceCountOrderByAggregateInput;
    _avg?: Prisma.SalesInvoiceAvgOrderByAggregateInput;
    _max?: Prisma.SalesInvoiceMaxOrderByAggregateInput;
    _min?: Prisma.SalesInvoiceMinOrderByAggregateInput;
    _sum?: Prisma.SalesInvoiceSumOrderByAggregateInput;
};
export type SalesInvoiceScalarWhereWithAggregatesInput = {
    AND?: Prisma.SalesInvoiceScalarWhereWithAggregatesInput | Prisma.SalesInvoiceScalarWhereWithAggregatesInput[];
    OR?: Prisma.SalesInvoiceScalarWhereWithAggregatesInput[];
    NOT?: Prisma.SalesInvoiceScalarWhereWithAggregatesInput | Prisma.SalesInvoiceScalarWhereWithAggregatesInput[];
    id?: Prisma.StringWithAggregatesFilter<"SalesInvoice"> | string;
    invoiceNumber?: Prisma.StringWithAggregatesFilter<"SalesInvoice"> | string;
    date?: Prisma.DateTimeWithAggregatesFilter<"SalesInvoice"> | Date | string;
    customerId?: Prisma.StringNullableWithAggregatesFilter<"SalesInvoice"> | string | null;
    branchId?: Prisma.StringWithAggregatesFilter<"SalesInvoice"> | string;
    userId?: Prisma.StringWithAggregatesFilter<"SalesInvoice"> | string;
    paymentMethod?: Prisma.EnumPaymentMethodWithAggregatesFilter<"SalesInvoice"> | $Enums.PaymentMethod;
    status?: Prisma.EnumInvoiceStatusWithAggregatesFilter<"SalesInvoice"> | $Enums.InvoiceStatus;
    subtotal?: Prisma.DecimalWithAggregatesFilter<"SalesInvoice"> | runtime.Decimal | runtime.DecimalJsLike | number | string;
    taxAmount?: Prisma.DecimalWithAggregatesFilter<"SalesInvoice"> | runtime.Decimal | runtime.DecimalJsLike | number | string;
    totalAmount?: Prisma.DecimalWithAggregatesFilter<"SalesInvoice"> | runtime.Decimal | runtime.DecimalJsLike | number | string;
    createdAt?: Prisma.DateTimeWithAggregatesFilter<"SalesInvoice"> | Date | string;
};
export type SalesInvoiceCreateInput = {
    id?: string;
    invoiceNumber: string;
    date?: Date | string;
    paymentMethod: $Enums.PaymentMethod;
    status?: $Enums.InvoiceStatus;
    subtotal: runtime.Decimal | runtime.DecimalJsLike | number | string;
    taxAmount?: runtime.Decimal | runtime.DecimalJsLike | number | string;
    totalAmount: runtime.Decimal | runtime.DecimalJsLike | number | string;
    createdAt?: Date | string;
    customer?: Prisma.CustomerCreateNestedOneWithoutSalesInvoicesInput;
    branch: Prisma.BranchCreateNestedOneWithoutSalesInvoicesInput;
    user: Prisma.UserCreateNestedOneWithoutSalesInvoicesInput;
    lines?: Prisma.SalesInvoiceLineCreateNestedManyWithoutSalesInvoiceInput;
    journalEntry?: Prisma.JournalEntryCreateNestedOneWithoutSalesInvoiceInput;
};
export type SalesInvoiceUncheckedCreateInput = {
    id?: string;
    invoiceNumber: string;
    date?: Date | string;
    customerId?: string | null;
    branchId: string;
    userId: string;
    paymentMethod: $Enums.PaymentMethod;
    status?: $Enums.InvoiceStatus;
    subtotal: runtime.Decimal | runtime.DecimalJsLike | number | string;
    taxAmount?: runtime.Decimal | runtime.DecimalJsLike | number | string;
    totalAmount: runtime.Decimal | runtime.DecimalJsLike | number | string;
    createdAt?: Date | string;
    lines?: Prisma.SalesInvoiceLineUncheckedCreateNestedManyWithoutSalesInvoiceInput;
    journalEntry?: Prisma.JournalEntryUncheckedCreateNestedOneWithoutSalesInvoiceInput;
};
export type SalesInvoiceUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    invoiceNumber?: Prisma.StringFieldUpdateOperationsInput | string;
    date?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    paymentMethod?: Prisma.EnumPaymentMethodFieldUpdateOperationsInput | $Enums.PaymentMethod;
    status?: Prisma.EnumInvoiceStatusFieldUpdateOperationsInput | $Enums.InvoiceStatus;
    subtotal?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    taxAmount?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    totalAmount?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    customer?: Prisma.CustomerUpdateOneWithoutSalesInvoicesNestedInput;
    branch?: Prisma.BranchUpdateOneRequiredWithoutSalesInvoicesNestedInput;
    user?: Prisma.UserUpdateOneRequiredWithoutSalesInvoicesNestedInput;
    lines?: Prisma.SalesInvoiceLineUpdateManyWithoutSalesInvoiceNestedInput;
    journalEntry?: Prisma.JournalEntryUpdateOneWithoutSalesInvoiceNestedInput;
};
export type SalesInvoiceUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    invoiceNumber?: Prisma.StringFieldUpdateOperationsInput | string;
    date?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    customerId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    branchId?: Prisma.StringFieldUpdateOperationsInput | string;
    userId?: Prisma.StringFieldUpdateOperationsInput | string;
    paymentMethod?: Prisma.EnumPaymentMethodFieldUpdateOperationsInput | $Enums.PaymentMethod;
    status?: Prisma.EnumInvoiceStatusFieldUpdateOperationsInput | $Enums.InvoiceStatus;
    subtotal?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    taxAmount?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    totalAmount?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    lines?: Prisma.SalesInvoiceLineUncheckedUpdateManyWithoutSalesInvoiceNestedInput;
    journalEntry?: Prisma.JournalEntryUncheckedUpdateOneWithoutSalesInvoiceNestedInput;
};
export type SalesInvoiceCreateManyInput = {
    id?: string;
    invoiceNumber: string;
    date?: Date | string;
    customerId?: string | null;
    branchId: string;
    userId: string;
    paymentMethod: $Enums.PaymentMethod;
    status?: $Enums.InvoiceStatus;
    subtotal: runtime.Decimal | runtime.DecimalJsLike | number | string;
    taxAmount?: runtime.Decimal | runtime.DecimalJsLike | number | string;
    totalAmount: runtime.Decimal | runtime.DecimalJsLike | number | string;
    createdAt?: Date | string;
};
export type SalesInvoiceUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    invoiceNumber?: Prisma.StringFieldUpdateOperationsInput | string;
    date?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    paymentMethod?: Prisma.EnumPaymentMethodFieldUpdateOperationsInput | $Enums.PaymentMethod;
    status?: Prisma.EnumInvoiceStatusFieldUpdateOperationsInput | $Enums.InvoiceStatus;
    subtotal?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    taxAmount?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    totalAmount?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type SalesInvoiceUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    invoiceNumber?: Prisma.StringFieldUpdateOperationsInput | string;
    date?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    customerId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    branchId?: Prisma.StringFieldUpdateOperationsInput | string;
    userId?: Prisma.StringFieldUpdateOperationsInput | string;
    paymentMethod?: Prisma.EnumPaymentMethodFieldUpdateOperationsInput | $Enums.PaymentMethod;
    status?: Prisma.EnumInvoiceStatusFieldUpdateOperationsInput | $Enums.InvoiceStatus;
    subtotal?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    taxAmount?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    totalAmount?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type SalesInvoiceListRelationFilter = {
    every?: Prisma.SalesInvoiceWhereInput;
    some?: Prisma.SalesInvoiceWhereInput;
    none?: Prisma.SalesInvoiceWhereInput;
};
export type SalesInvoiceOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type SalesInvoiceNullableScalarRelationFilter = {
    is?: Prisma.SalesInvoiceWhereInput | null;
    isNot?: Prisma.SalesInvoiceWhereInput | null;
};
export type SalesInvoiceCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    invoiceNumber?: Prisma.SortOrder;
    date?: Prisma.SortOrder;
    customerId?: Prisma.SortOrder;
    branchId?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    paymentMethod?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    subtotal?: Prisma.SortOrder;
    taxAmount?: Prisma.SortOrder;
    totalAmount?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type SalesInvoiceAvgOrderByAggregateInput = {
    subtotal?: Prisma.SortOrder;
    taxAmount?: Prisma.SortOrder;
    totalAmount?: Prisma.SortOrder;
};
export type SalesInvoiceMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    invoiceNumber?: Prisma.SortOrder;
    date?: Prisma.SortOrder;
    customerId?: Prisma.SortOrder;
    branchId?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    paymentMethod?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    subtotal?: Prisma.SortOrder;
    taxAmount?: Prisma.SortOrder;
    totalAmount?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type SalesInvoiceMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    invoiceNumber?: Prisma.SortOrder;
    date?: Prisma.SortOrder;
    customerId?: Prisma.SortOrder;
    branchId?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    paymentMethod?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    subtotal?: Prisma.SortOrder;
    taxAmount?: Prisma.SortOrder;
    totalAmount?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type SalesInvoiceSumOrderByAggregateInput = {
    subtotal?: Prisma.SortOrder;
    taxAmount?: Prisma.SortOrder;
    totalAmount?: Prisma.SortOrder;
};
export type SalesInvoiceScalarRelationFilter = {
    is?: Prisma.SalesInvoiceWhereInput;
    isNot?: Prisma.SalesInvoiceWhereInput;
};
export type SalesInvoiceCreateNestedManyWithoutBranchInput = {
    create?: Prisma.XOR<Prisma.SalesInvoiceCreateWithoutBranchInput, Prisma.SalesInvoiceUncheckedCreateWithoutBranchInput> | Prisma.SalesInvoiceCreateWithoutBranchInput[] | Prisma.SalesInvoiceUncheckedCreateWithoutBranchInput[];
    connectOrCreate?: Prisma.SalesInvoiceCreateOrConnectWithoutBranchInput | Prisma.SalesInvoiceCreateOrConnectWithoutBranchInput[];
    createMany?: Prisma.SalesInvoiceCreateManyBranchInputEnvelope;
    connect?: Prisma.SalesInvoiceWhereUniqueInput | Prisma.SalesInvoiceWhereUniqueInput[];
};
export type SalesInvoiceUncheckedCreateNestedManyWithoutBranchInput = {
    create?: Prisma.XOR<Prisma.SalesInvoiceCreateWithoutBranchInput, Prisma.SalesInvoiceUncheckedCreateWithoutBranchInput> | Prisma.SalesInvoiceCreateWithoutBranchInput[] | Prisma.SalesInvoiceUncheckedCreateWithoutBranchInput[];
    connectOrCreate?: Prisma.SalesInvoiceCreateOrConnectWithoutBranchInput | Prisma.SalesInvoiceCreateOrConnectWithoutBranchInput[];
    createMany?: Prisma.SalesInvoiceCreateManyBranchInputEnvelope;
    connect?: Prisma.SalesInvoiceWhereUniqueInput | Prisma.SalesInvoiceWhereUniqueInput[];
};
export type SalesInvoiceUpdateManyWithoutBranchNestedInput = {
    create?: Prisma.XOR<Prisma.SalesInvoiceCreateWithoutBranchInput, Prisma.SalesInvoiceUncheckedCreateWithoutBranchInput> | Prisma.SalesInvoiceCreateWithoutBranchInput[] | Prisma.SalesInvoiceUncheckedCreateWithoutBranchInput[];
    connectOrCreate?: Prisma.SalesInvoiceCreateOrConnectWithoutBranchInput | Prisma.SalesInvoiceCreateOrConnectWithoutBranchInput[];
    upsert?: Prisma.SalesInvoiceUpsertWithWhereUniqueWithoutBranchInput | Prisma.SalesInvoiceUpsertWithWhereUniqueWithoutBranchInput[];
    createMany?: Prisma.SalesInvoiceCreateManyBranchInputEnvelope;
    set?: Prisma.SalesInvoiceWhereUniqueInput | Prisma.SalesInvoiceWhereUniqueInput[];
    disconnect?: Prisma.SalesInvoiceWhereUniqueInput | Prisma.SalesInvoiceWhereUniqueInput[];
    delete?: Prisma.SalesInvoiceWhereUniqueInput | Prisma.SalesInvoiceWhereUniqueInput[];
    connect?: Prisma.SalesInvoiceWhereUniqueInput | Prisma.SalesInvoiceWhereUniqueInput[];
    update?: Prisma.SalesInvoiceUpdateWithWhereUniqueWithoutBranchInput | Prisma.SalesInvoiceUpdateWithWhereUniqueWithoutBranchInput[];
    updateMany?: Prisma.SalesInvoiceUpdateManyWithWhereWithoutBranchInput | Prisma.SalesInvoiceUpdateManyWithWhereWithoutBranchInput[];
    deleteMany?: Prisma.SalesInvoiceScalarWhereInput | Prisma.SalesInvoiceScalarWhereInput[];
};
export type SalesInvoiceUncheckedUpdateManyWithoutBranchNestedInput = {
    create?: Prisma.XOR<Prisma.SalesInvoiceCreateWithoutBranchInput, Prisma.SalesInvoiceUncheckedCreateWithoutBranchInput> | Prisma.SalesInvoiceCreateWithoutBranchInput[] | Prisma.SalesInvoiceUncheckedCreateWithoutBranchInput[];
    connectOrCreate?: Prisma.SalesInvoiceCreateOrConnectWithoutBranchInput | Prisma.SalesInvoiceCreateOrConnectWithoutBranchInput[];
    upsert?: Prisma.SalesInvoiceUpsertWithWhereUniqueWithoutBranchInput | Prisma.SalesInvoiceUpsertWithWhereUniqueWithoutBranchInput[];
    createMany?: Prisma.SalesInvoiceCreateManyBranchInputEnvelope;
    set?: Prisma.SalesInvoiceWhereUniqueInput | Prisma.SalesInvoiceWhereUniqueInput[];
    disconnect?: Prisma.SalesInvoiceWhereUniqueInput | Prisma.SalesInvoiceWhereUniqueInput[];
    delete?: Prisma.SalesInvoiceWhereUniqueInput | Prisma.SalesInvoiceWhereUniqueInput[];
    connect?: Prisma.SalesInvoiceWhereUniqueInput | Prisma.SalesInvoiceWhereUniqueInput[];
    update?: Prisma.SalesInvoiceUpdateWithWhereUniqueWithoutBranchInput | Prisma.SalesInvoiceUpdateWithWhereUniqueWithoutBranchInput[];
    updateMany?: Prisma.SalesInvoiceUpdateManyWithWhereWithoutBranchInput | Prisma.SalesInvoiceUpdateManyWithWhereWithoutBranchInput[];
    deleteMany?: Prisma.SalesInvoiceScalarWhereInput | Prisma.SalesInvoiceScalarWhereInput[];
};
export type SalesInvoiceCreateNestedManyWithoutUserInput = {
    create?: Prisma.XOR<Prisma.SalesInvoiceCreateWithoutUserInput, Prisma.SalesInvoiceUncheckedCreateWithoutUserInput> | Prisma.SalesInvoiceCreateWithoutUserInput[] | Prisma.SalesInvoiceUncheckedCreateWithoutUserInput[];
    connectOrCreate?: Prisma.SalesInvoiceCreateOrConnectWithoutUserInput | Prisma.SalesInvoiceCreateOrConnectWithoutUserInput[];
    createMany?: Prisma.SalesInvoiceCreateManyUserInputEnvelope;
    connect?: Prisma.SalesInvoiceWhereUniqueInput | Prisma.SalesInvoiceWhereUniqueInput[];
};
export type SalesInvoiceUncheckedCreateNestedManyWithoutUserInput = {
    create?: Prisma.XOR<Prisma.SalesInvoiceCreateWithoutUserInput, Prisma.SalesInvoiceUncheckedCreateWithoutUserInput> | Prisma.SalesInvoiceCreateWithoutUserInput[] | Prisma.SalesInvoiceUncheckedCreateWithoutUserInput[];
    connectOrCreate?: Prisma.SalesInvoiceCreateOrConnectWithoutUserInput | Prisma.SalesInvoiceCreateOrConnectWithoutUserInput[];
    createMany?: Prisma.SalesInvoiceCreateManyUserInputEnvelope;
    connect?: Prisma.SalesInvoiceWhereUniqueInput | Prisma.SalesInvoiceWhereUniqueInput[];
};
export type SalesInvoiceUpdateManyWithoutUserNestedInput = {
    create?: Prisma.XOR<Prisma.SalesInvoiceCreateWithoutUserInput, Prisma.SalesInvoiceUncheckedCreateWithoutUserInput> | Prisma.SalesInvoiceCreateWithoutUserInput[] | Prisma.SalesInvoiceUncheckedCreateWithoutUserInput[];
    connectOrCreate?: Prisma.SalesInvoiceCreateOrConnectWithoutUserInput | Prisma.SalesInvoiceCreateOrConnectWithoutUserInput[];
    upsert?: Prisma.SalesInvoiceUpsertWithWhereUniqueWithoutUserInput | Prisma.SalesInvoiceUpsertWithWhereUniqueWithoutUserInput[];
    createMany?: Prisma.SalesInvoiceCreateManyUserInputEnvelope;
    set?: Prisma.SalesInvoiceWhereUniqueInput | Prisma.SalesInvoiceWhereUniqueInput[];
    disconnect?: Prisma.SalesInvoiceWhereUniqueInput | Prisma.SalesInvoiceWhereUniqueInput[];
    delete?: Prisma.SalesInvoiceWhereUniqueInput | Prisma.SalesInvoiceWhereUniqueInput[];
    connect?: Prisma.SalesInvoiceWhereUniqueInput | Prisma.SalesInvoiceWhereUniqueInput[];
    update?: Prisma.SalesInvoiceUpdateWithWhereUniqueWithoutUserInput | Prisma.SalesInvoiceUpdateWithWhereUniqueWithoutUserInput[];
    updateMany?: Prisma.SalesInvoiceUpdateManyWithWhereWithoutUserInput | Prisma.SalesInvoiceUpdateManyWithWhereWithoutUserInput[];
    deleteMany?: Prisma.SalesInvoiceScalarWhereInput | Prisma.SalesInvoiceScalarWhereInput[];
};
export type SalesInvoiceUncheckedUpdateManyWithoutUserNestedInput = {
    create?: Prisma.XOR<Prisma.SalesInvoiceCreateWithoutUserInput, Prisma.SalesInvoiceUncheckedCreateWithoutUserInput> | Prisma.SalesInvoiceCreateWithoutUserInput[] | Prisma.SalesInvoiceUncheckedCreateWithoutUserInput[];
    connectOrCreate?: Prisma.SalesInvoiceCreateOrConnectWithoutUserInput | Prisma.SalesInvoiceCreateOrConnectWithoutUserInput[];
    upsert?: Prisma.SalesInvoiceUpsertWithWhereUniqueWithoutUserInput | Prisma.SalesInvoiceUpsertWithWhereUniqueWithoutUserInput[];
    createMany?: Prisma.SalesInvoiceCreateManyUserInputEnvelope;
    set?: Prisma.SalesInvoiceWhereUniqueInput | Prisma.SalesInvoiceWhereUniqueInput[];
    disconnect?: Prisma.SalesInvoiceWhereUniqueInput | Prisma.SalesInvoiceWhereUniqueInput[];
    delete?: Prisma.SalesInvoiceWhereUniqueInput | Prisma.SalesInvoiceWhereUniqueInput[];
    connect?: Prisma.SalesInvoiceWhereUniqueInput | Prisma.SalesInvoiceWhereUniqueInput[];
    update?: Prisma.SalesInvoiceUpdateWithWhereUniqueWithoutUserInput | Prisma.SalesInvoiceUpdateWithWhereUniqueWithoutUserInput[];
    updateMany?: Prisma.SalesInvoiceUpdateManyWithWhereWithoutUserInput | Prisma.SalesInvoiceUpdateManyWithWhereWithoutUserInput[];
    deleteMany?: Prisma.SalesInvoiceScalarWhereInput | Prisma.SalesInvoiceScalarWhereInput[];
};
export type SalesInvoiceCreateNestedManyWithoutCustomerInput = {
    create?: Prisma.XOR<Prisma.SalesInvoiceCreateWithoutCustomerInput, Prisma.SalesInvoiceUncheckedCreateWithoutCustomerInput> | Prisma.SalesInvoiceCreateWithoutCustomerInput[] | Prisma.SalesInvoiceUncheckedCreateWithoutCustomerInput[];
    connectOrCreate?: Prisma.SalesInvoiceCreateOrConnectWithoutCustomerInput | Prisma.SalesInvoiceCreateOrConnectWithoutCustomerInput[];
    createMany?: Prisma.SalesInvoiceCreateManyCustomerInputEnvelope;
    connect?: Prisma.SalesInvoiceWhereUniqueInput | Prisma.SalesInvoiceWhereUniqueInput[];
};
export type SalesInvoiceUncheckedCreateNestedManyWithoutCustomerInput = {
    create?: Prisma.XOR<Prisma.SalesInvoiceCreateWithoutCustomerInput, Prisma.SalesInvoiceUncheckedCreateWithoutCustomerInput> | Prisma.SalesInvoiceCreateWithoutCustomerInput[] | Prisma.SalesInvoiceUncheckedCreateWithoutCustomerInput[];
    connectOrCreate?: Prisma.SalesInvoiceCreateOrConnectWithoutCustomerInput | Prisma.SalesInvoiceCreateOrConnectWithoutCustomerInput[];
    createMany?: Prisma.SalesInvoiceCreateManyCustomerInputEnvelope;
    connect?: Prisma.SalesInvoiceWhereUniqueInput | Prisma.SalesInvoiceWhereUniqueInput[];
};
export type SalesInvoiceUpdateManyWithoutCustomerNestedInput = {
    create?: Prisma.XOR<Prisma.SalesInvoiceCreateWithoutCustomerInput, Prisma.SalesInvoiceUncheckedCreateWithoutCustomerInput> | Prisma.SalesInvoiceCreateWithoutCustomerInput[] | Prisma.SalesInvoiceUncheckedCreateWithoutCustomerInput[];
    connectOrCreate?: Prisma.SalesInvoiceCreateOrConnectWithoutCustomerInput | Prisma.SalesInvoiceCreateOrConnectWithoutCustomerInput[];
    upsert?: Prisma.SalesInvoiceUpsertWithWhereUniqueWithoutCustomerInput | Prisma.SalesInvoiceUpsertWithWhereUniqueWithoutCustomerInput[];
    createMany?: Prisma.SalesInvoiceCreateManyCustomerInputEnvelope;
    set?: Prisma.SalesInvoiceWhereUniqueInput | Prisma.SalesInvoiceWhereUniqueInput[];
    disconnect?: Prisma.SalesInvoiceWhereUniqueInput | Prisma.SalesInvoiceWhereUniqueInput[];
    delete?: Prisma.SalesInvoiceWhereUniqueInput | Prisma.SalesInvoiceWhereUniqueInput[];
    connect?: Prisma.SalesInvoiceWhereUniqueInput | Prisma.SalesInvoiceWhereUniqueInput[];
    update?: Prisma.SalesInvoiceUpdateWithWhereUniqueWithoutCustomerInput | Prisma.SalesInvoiceUpdateWithWhereUniqueWithoutCustomerInput[];
    updateMany?: Prisma.SalesInvoiceUpdateManyWithWhereWithoutCustomerInput | Prisma.SalesInvoiceUpdateManyWithWhereWithoutCustomerInput[];
    deleteMany?: Prisma.SalesInvoiceScalarWhereInput | Prisma.SalesInvoiceScalarWhereInput[];
};
export type SalesInvoiceUncheckedUpdateManyWithoutCustomerNestedInput = {
    create?: Prisma.XOR<Prisma.SalesInvoiceCreateWithoutCustomerInput, Prisma.SalesInvoiceUncheckedCreateWithoutCustomerInput> | Prisma.SalesInvoiceCreateWithoutCustomerInput[] | Prisma.SalesInvoiceUncheckedCreateWithoutCustomerInput[];
    connectOrCreate?: Prisma.SalesInvoiceCreateOrConnectWithoutCustomerInput | Prisma.SalesInvoiceCreateOrConnectWithoutCustomerInput[];
    upsert?: Prisma.SalesInvoiceUpsertWithWhereUniqueWithoutCustomerInput | Prisma.SalesInvoiceUpsertWithWhereUniqueWithoutCustomerInput[];
    createMany?: Prisma.SalesInvoiceCreateManyCustomerInputEnvelope;
    set?: Prisma.SalesInvoiceWhereUniqueInput | Prisma.SalesInvoiceWhereUniqueInput[];
    disconnect?: Prisma.SalesInvoiceWhereUniqueInput | Prisma.SalesInvoiceWhereUniqueInput[];
    delete?: Prisma.SalesInvoiceWhereUniqueInput | Prisma.SalesInvoiceWhereUniqueInput[];
    connect?: Prisma.SalesInvoiceWhereUniqueInput | Prisma.SalesInvoiceWhereUniqueInput[];
    update?: Prisma.SalesInvoiceUpdateWithWhereUniqueWithoutCustomerInput | Prisma.SalesInvoiceUpdateWithWhereUniqueWithoutCustomerInput[];
    updateMany?: Prisma.SalesInvoiceUpdateManyWithWhereWithoutCustomerInput | Prisma.SalesInvoiceUpdateManyWithWhereWithoutCustomerInput[];
    deleteMany?: Prisma.SalesInvoiceScalarWhereInput | Prisma.SalesInvoiceScalarWhereInput[];
};
export type SalesInvoiceCreateNestedOneWithoutJournalEntryInput = {
    create?: Prisma.XOR<Prisma.SalesInvoiceCreateWithoutJournalEntryInput, Prisma.SalesInvoiceUncheckedCreateWithoutJournalEntryInput>;
    connectOrCreate?: Prisma.SalesInvoiceCreateOrConnectWithoutJournalEntryInput;
    connect?: Prisma.SalesInvoiceWhereUniqueInput;
};
export type SalesInvoiceUpdateOneWithoutJournalEntryNestedInput = {
    create?: Prisma.XOR<Prisma.SalesInvoiceCreateWithoutJournalEntryInput, Prisma.SalesInvoiceUncheckedCreateWithoutJournalEntryInput>;
    connectOrCreate?: Prisma.SalesInvoiceCreateOrConnectWithoutJournalEntryInput;
    upsert?: Prisma.SalesInvoiceUpsertWithoutJournalEntryInput;
    disconnect?: Prisma.SalesInvoiceWhereInput | boolean;
    delete?: Prisma.SalesInvoiceWhereInput | boolean;
    connect?: Prisma.SalesInvoiceWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.SalesInvoiceUpdateToOneWithWhereWithoutJournalEntryInput, Prisma.SalesInvoiceUpdateWithoutJournalEntryInput>, Prisma.SalesInvoiceUncheckedUpdateWithoutJournalEntryInput>;
};
export type EnumPaymentMethodFieldUpdateOperationsInput = {
    set?: $Enums.PaymentMethod;
};
export type EnumInvoiceStatusFieldUpdateOperationsInput = {
    set?: $Enums.InvoiceStatus;
};
export type SalesInvoiceCreateNestedOneWithoutLinesInput = {
    create?: Prisma.XOR<Prisma.SalesInvoiceCreateWithoutLinesInput, Prisma.SalesInvoiceUncheckedCreateWithoutLinesInput>;
    connectOrCreate?: Prisma.SalesInvoiceCreateOrConnectWithoutLinesInput;
    connect?: Prisma.SalesInvoiceWhereUniqueInput;
};
export type SalesInvoiceUpdateOneRequiredWithoutLinesNestedInput = {
    create?: Prisma.XOR<Prisma.SalesInvoiceCreateWithoutLinesInput, Prisma.SalesInvoiceUncheckedCreateWithoutLinesInput>;
    connectOrCreate?: Prisma.SalesInvoiceCreateOrConnectWithoutLinesInput;
    upsert?: Prisma.SalesInvoiceUpsertWithoutLinesInput;
    connect?: Prisma.SalesInvoiceWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.SalesInvoiceUpdateToOneWithWhereWithoutLinesInput, Prisma.SalesInvoiceUpdateWithoutLinesInput>, Prisma.SalesInvoiceUncheckedUpdateWithoutLinesInput>;
};
export type SalesInvoiceCreateWithoutBranchInput = {
    id?: string;
    invoiceNumber: string;
    date?: Date | string;
    paymentMethod: $Enums.PaymentMethod;
    status?: $Enums.InvoiceStatus;
    subtotal: runtime.Decimal | runtime.DecimalJsLike | number | string;
    taxAmount?: runtime.Decimal | runtime.DecimalJsLike | number | string;
    totalAmount: runtime.Decimal | runtime.DecimalJsLike | number | string;
    createdAt?: Date | string;
    customer?: Prisma.CustomerCreateNestedOneWithoutSalesInvoicesInput;
    user: Prisma.UserCreateNestedOneWithoutSalesInvoicesInput;
    lines?: Prisma.SalesInvoiceLineCreateNestedManyWithoutSalesInvoiceInput;
    journalEntry?: Prisma.JournalEntryCreateNestedOneWithoutSalesInvoiceInput;
};
export type SalesInvoiceUncheckedCreateWithoutBranchInput = {
    id?: string;
    invoiceNumber: string;
    date?: Date | string;
    customerId?: string | null;
    userId: string;
    paymentMethod: $Enums.PaymentMethod;
    status?: $Enums.InvoiceStatus;
    subtotal: runtime.Decimal | runtime.DecimalJsLike | number | string;
    taxAmount?: runtime.Decimal | runtime.DecimalJsLike | number | string;
    totalAmount: runtime.Decimal | runtime.DecimalJsLike | number | string;
    createdAt?: Date | string;
    lines?: Prisma.SalesInvoiceLineUncheckedCreateNestedManyWithoutSalesInvoiceInput;
    journalEntry?: Prisma.JournalEntryUncheckedCreateNestedOneWithoutSalesInvoiceInput;
};
export type SalesInvoiceCreateOrConnectWithoutBranchInput = {
    where: Prisma.SalesInvoiceWhereUniqueInput;
    create: Prisma.XOR<Prisma.SalesInvoiceCreateWithoutBranchInput, Prisma.SalesInvoiceUncheckedCreateWithoutBranchInput>;
};
export type SalesInvoiceCreateManyBranchInputEnvelope = {
    data: Prisma.SalesInvoiceCreateManyBranchInput | Prisma.SalesInvoiceCreateManyBranchInput[];
    skipDuplicates?: boolean;
};
export type SalesInvoiceUpsertWithWhereUniqueWithoutBranchInput = {
    where: Prisma.SalesInvoiceWhereUniqueInput;
    update: Prisma.XOR<Prisma.SalesInvoiceUpdateWithoutBranchInput, Prisma.SalesInvoiceUncheckedUpdateWithoutBranchInput>;
    create: Prisma.XOR<Prisma.SalesInvoiceCreateWithoutBranchInput, Prisma.SalesInvoiceUncheckedCreateWithoutBranchInput>;
};
export type SalesInvoiceUpdateWithWhereUniqueWithoutBranchInput = {
    where: Prisma.SalesInvoiceWhereUniqueInput;
    data: Prisma.XOR<Prisma.SalesInvoiceUpdateWithoutBranchInput, Prisma.SalesInvoiceUncheckedUpdateWithoutBranchInput>;
};
export type SalesInvoiceUpdateManyWithWhereWithoutBranchInput = {
    where: Prisma.SalesInvoiceScalarWhereInput;
    data: Prisma.XOR<Prisma.SalesInvoiceUpdateManyMutationInput, Prisma.SalesInvoiceUncheckedUpdateManyWithoutBranchInput>;
};
export type SalesInvoiceScalarWhereInput = {
    AND?: Prisma.SalesInvoiceScalarWhereInput | Prisma.SalesInvoiceScalarWhereInput[];
    OR?: Prisma.SalesInvoiceScalarWhereInput[];
    NOT?: Prisma.SalesInvoiceScalarWhereInput | Prisma.SalesInvoiceScalarWhereInput[];
    id?: Prisma.StringFilter<"SalesInvoice"> | string;
    invoiceNumber?: Prisma.StringFilter<"SalesInvoice"> | string;
    date?: Prisma.DateTimeFilter<"SalesInvoice"> | Date | string;
    customerId?: Prisma.StringNullableFilter<"SalesInvoice"> | string | null;
    branchId?: Prisma.StringFilter<"SalesInvoice"> | string;
    userId?: Prisma.StringFilter<"SalesInvoice"> | string;
    paymentMethod?: Prisma.EnumPaymentMethodFilter<"SalesInvoice"> | $Enums.PaymentMethod;
    status?: Prisma.EnumInvoiceStatusFilter<"SalesInvoice"> | $Enums.InvoiceStatus;
    subtotal?: Prisma.DecimalFilter<"SalesInvoice"> | runtime.Decimal | runtime.DecimalJsLike | number | string;
    taxAmount?: Prisma.DecimalFilter<"SalesInvoice"> | runtime.Decimal | runtime.DecimalJsLike | number | string;
    totalAmount?: Prisma.DecimalFilter<"SalesInvoice"> | runtime.Decimal | runtime.DecimalJsLike | number | string;
    createdAt?: Prisma.DateTimeFilter<"SalesInvoice"> | Date | string;
};
export type SalesInvoiceCreateWithoutUserInput = {
    id?: string;
    invoiceNumber: string;
    date?: Date | string;
    paymentMethod: $Enums.PaymentMethod;
    status?: $Enums.InvoiceStatus;
    subtotal: runtime.Decimal | runtime.DecimalJsLike | number | string;
    taxAmount?: runtime.Decimal | runtime.DecimalJsLike | number | string;
    totalAmount: runtime.Decimal | runtime.DecimalJsLike | number | string;
    createdAt?: Date | string;
    customer?: Prisma.CustomerCreateNestedOneWithoutSalesInvoicesInput;
    branch: Prisma.BranchCreateNestedOneWithoutSalesInvoicesInput;
    lines?: Prisma.SalesInvoiceLineCreateNestedManyWithoutSalesInvoiceInput;
    journalEntry?: Prisma.JournalEntryCreateNestedOneWithoutSalesInvoiceInput;
};
export type SalesInvoiceUncheckedCreateWithoutUserInput = {
    id?: string;
    invoiceNumber: string;
    date?: Date | string;
    customerId?: string | null;
    branchId: string;
    paymentMethod: $Enums.PaymentMethod;
    status?: $Enums.InvoiceStatus;
    subtotal: runtime.Decimal | runtime.DecimalJsLike | number | string;
    taxAmount?: runtime.Decimal | runtime.DecimalJsLike | number | string;
    totalAmount: runtime.Decimal | runtime.DecimalJsLike | number | string;
    createdAt?: Date | string;
    lines?: Prisma.SalesInvoiceLineUncheckedCreateNestedManyWithoutSalesInvoiceInput;
    journalEntry?: Prisma.JournalEntryUncheckedCreateNestedOneWithoutSalesInvoiceInput;
};
export type SalesInvoiceCreateOrConnectWithoutUserInput = {
    where: Prisma.SalesInvoiceWhereUniqueInput;
    create: Prisma.XOR<Prisma.SalesInvoiceCreateWithoutUserInput, Prisma.SalesInvoiceUncheckedCreateWithoutUserInput>;
};
export type SalesInvoiceCreateManyUserInputEnvelope = {
    data: Prisma.SalesInvoiceCreateManyUserInput | Prisma.SalesInvoiceCreateManyUserInput[];
    skipDuplicates?: boolean;
};
export type SalesInvoiceUpsertWithWhereUniqueWithoutUserInput = {
    where: Prisma.SalesInvoiceWhereUniqueInput;
    update: Prisma.XOR<Prisma.SalesInvoiceUpdateWithoutUserInput, Prisma.SalesInvoiceUncheckedUpdateWithoutUserInput>;
    create: Prisma.XOR<Prisma.SalesInvoiceCreateWithoutUserInput, Prisma.SalesInvoiceUncheckedCreateWithoutUserInput>;
};
export type SalesInvoiceUpdateWithWhereUniqueWithoutUserInput = {
    where: Prisma.SalesInvoiceWhereUniqueInput;
    data: Prisma.XOR<Prisma.SalesInvoiceUpdateWithoutUserInput, Prisma.SalesInvoiceUncheckedUpdateWithoutUserInput>;
};
export type SalesInvoiceUpdateManyWithWhereWithoutUserInput = {
    where: Prisma.SalesInvoiceScalarWhereInput;
    data: Prisma.XOR<Prisma.SalesInvoiceUpdateManyMutationInput, Prisma.SalesInvoiceUncheckedUpdateManyWithoutUserInput>;
};
export type SalesInvoiceCreateWithoutCustomerInput = {
    id?: string;
    invoiceNumber: string;
    date?: Date | string;
    paymentMethod: $Enums.PaymentMethod;
    status?: $Enums.InvoiceStatus;
    subtotal: runtime.Decimal | runtime.DecimalJsLike | number | string;
    taxAmount?: runtime.Decimal | runtime.DecimalJsLike | number | string;
    totalAmount: runtime.Decimal | runtime.DecimalJsLike | number | string;
    createdAt?: Date | string;
    branch: Prisma.BranchCreateNestedOneWithoutSalesInvoicesInput;
    user: Prisma.UserCreateNestedOneWithoutSalesInvoicesInput;
    lines?: Prisma.SalesInvoiceLineCreateNestedManyWithoutSalesInvoiceInput;
    journalEntry?: Prisma.JournalEntryCreateNestedOneWithoutSalesInvoiceInput;
};
export type SalesInvoiceUncheckedCreateWithoutCustomerInput = {
    id?: string;
    invoiceNumber: string;
    date?: Date | string;
    branchId: string;
    userId: string;
    paymentMethod: $Enums.PaymentMethod;
    status?: $Enums.InvoiceStatus;
    subtotal: runtime.Decimal | runtime.DecimalJsLike | number | string;
    taxAmount?: runtime.Decimal | runtime.DecimalJsLike | number | string;
    totalAmount: runtime.Decimal | runtime.DecimalJsLike | number | string;
    createdAt?: Date | string;
    lines?: Prisma.SalesInvoiceLineUncheckedCreateNestedManyWithoutSalesInvoiceInput;
    journalEntry?: Prisma.JournalEntryUncheckedCreateNestedOneWithoutSalesInvoiceInput;
};
export type SalesInvoiceCreateOrConnectWithoutCustomerInput = {
    where: Prisma.SalesInvoiceWhereUniqueInput;
    create: Prisma.XOR<Prisma.SalesInvoiceCreateWithoutCustomerInput, Prisma.SalesInvoiceUncheckedCreateWithoutCustomerInput>;
};
export type SalesInvoiceCreateManyCustomerInputEnvelope = {
    data: Prisma.SalesInvoiceCreateManyCustomerInput | Prisma.SalesInvoiceCreateManyCustomerInput[];
    skipDuplicates?: boolean;
};
export type SalesInvoiceUpsertWithWhereUniqueWithoutCustomerInput = {
    where: Prisma.SalesInvoiceWhereUniqueInput;
    update: Prisma.XOR<Prisma.SalesInvoiceUpdateWithoutCustomerInput, Prisma.SalesInvoiceUncheckedUpdateWithoutCustomerInput>;
    create: Prisma.XOR<Prisma.SalesInvoiceCreateWithoutCustomerInput, Prisma.SalesInvoiceUncheckedCreateWithoutCustomerInput>;
};
export type SalesInvoiceUpdateWithWhereUniqueWithoutCustomerInput = {
    where: Prisma.SalesInvoiceWhereUniqueInput;
    data: Prisma.XOR<Prisma.SalesInvoiceUpdateWithoutCustomerInput, Prisma.SalesInvoiceUncheckedUpdateWithoutCustomerInput>;
};
export type SalesInvoiceUpdateManyWithWhereWithoutCustomerInput = {
    where: Prisma.SalesInvoiceScalarWhereInput;
    data: Prisma.XOR<Prisma.SalesInvoiceUpdateManyMutationInput, Prisma.SalesInvoiceUncheckedUpdateManyWithoutCustomerInput>;
};
export type SalesInvoiceCreateWithoutJournalEntryInput = {
    id?: string;
    invoiceNumber: string;
    date?: Date | string;
    paymentMethod: $Enums.PaymentMethod;
    status?: $Enums.InvoiceStatus;
    subtotal: runtime.Decimal | runtime.DecimalJsLike | number | string;
    taxAmount?: runtime.Decimal | runtime.DecimalJsLike | number | string;
    totalAmount: runtime.Decimal | runtime.DecimalJsLike | number | string;
    createdAt?: Date | string;
    customer?: Prisma.CustomerCreateNestedOneWithoutSalesInvoicesInput;
    branch: Prisma.BranchCreateNestedOneWithoutSalesInvoicesInput;
    user: Prisma.UserCreateNestedOneWithoutSalesInvoicesInput;
    lines?: Prisma.SalesInvoiceLineCreateNestedManyWithoutSalesInvoiceInput;
};
export type SalesInvoiceUncheckedCreateWithoutJournalEntryInput = {
    id?: string;
    invoiceNumber: string;
    date?: Date | string;
    customerId?: string | null;
    branchId: string;
    userId: string;
    paymentMethod: $Enums.PaymentMethod;
    status?: $Enums.InvoiceStatus;
    subtotal: runtime.Decimal | runtime.DecimalJsLike | number | string;
    taxAmount?: runtime.Decimal | runtime.DecimalJsLike | number | string;
    totalAmount: runtime.Decimal | runtime.DecimalJsLike | number | string;
    createdAt?: Date | string;
    lines?: Prisma.SalesInvoiceLineUncheckedCreateNestedManyWithoutSalesInvoiceInput;
};
export type SalesInvoiceCreateOrConnectWithoutJournalEntryInput = {
    where: Prisma.SalesInvoiceWhereUniqueInput;
    create: Prisma.XOR<Prisma.SalesInvoiceCreateWithoutJournalEntryInput, Prisma.SalesInvoiceUncheckedCreateWithoutJournalEntryInput>;
};
export type SalesInvoiceUpsertWithoutJournalEntryInput = {
    update: Prisma.XOR<Prisma.SalesInvoiceUpdateWithoutJournalEntryInput, Prisma.SalesInvoiceUncheckedUpdateWithoutJournalEntryInput>;
    create: Prisma.XOR<Prisma.SalesInvoiceCreateWithoutJournalEntryInput, Prisma.SalesInvoiceUncheckedCreateWithoutJournalEntryInput>;
    where?: Prisma.SalesInvoiceWhereInput;
};
export type SalesInvoiceUpdateToOneWithWhereWithoutJournalEntryInput = {
    where?: Prisma.SalesInvoiceWhereInput;
    data: Prisma.XOR<Prisma.SalesInvoiceUpdateWithoutJournalEntryInput, Prisma.SalesInvoiceUncheckedUpdateWithoutJournalEntryInput>;
};
export type SalesInvoiceUpdateWithoutJournalEntryInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    invoiceNumber?: Prisma.StringFieldUpdateOperationsInput | string;
    date?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    paymentMethod?: Prisma.EnumPaymentMethodFieldUpdateOperationsInput | $Enums.PaymentMethod;
    status?: Prisma.EnumInvoiceStatusFieldUpdateOperationsInput | $Enums.InvoiceStatus;
    subtotal?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    taxAmount?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    totalAmount?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    customer?: Prisma.CustomerUpdateOneWithoutSalesInvoicesNestedInput;
    branch?: Prisma.BranchUpdateOneRequiredWithoutSalesInvoicesNestedInput;
    user?: Prisma.UserUpdateOneRequiredWithoutSalesInvoicesNestedInput;
    lines?: Prisma.SalesInvoiceLineUpdateManyWithoutSalesInvoiceNestedInput;
};
export type SalesInvoiceUncheckedUpdateWithoutJournalEntryInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    invoiceNumber?: Prisma.StringFieldUpdateOperationsInput | string;
    date?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    customerId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    branchId?: Prisma.StringFieldUpdateOperationsInput | string;
    userId?: Prisma.StringFieldUpdateOperationsInput | string;
    paymentMethod?: Prisma.EnumPaymentMethodFieldUpdateOperationsInput | $Enums.PaymentMethod;
    status?: Prisma.EnumInvoiceStatusFieldUpdateOperationsInput | $Enums.InvoiceStatus;
    subtotal?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    taxAmount?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    totalAmount?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    lines?: Prisma.SalesInvoiceLineUncheckedUpdateManyWithoutSalesInvoiceNestedInput;
};
export type SalesInvoiceCreateWithoutLinesInput = {
    id?: string;
    invoiceNumber: string;
    date?: Date | string;
    paymentMethod: $Enums.PaymentMethod;
    status?: $Enums.InvoiceStatus;
    subtotal: runtime.Decimal | runtime.DecimalJsLike | number | string;
    taxAmount?: runtime.Decimal | runtime.DecimalJsLike | number | string;
    totalAmount: runtime.Decimal | runtime.DecimalJsLike | number | string;
    createdAt?: Date | string;
    customer?: Prisma.CustomerCreateNestedOneWithoutSalesInvoicesInput;
    branch: Prisma.BranchCreateNestedOneWithoutSalesInvoicesInput;
    user: Prisma.UserCreateNestedOneWithoutSalesInvoicesInput;
    journalEntry?: Prisma.JournalEntryCreateNestedOneWithoutSalesInvoiceInput;
};
export type SalesInvoiceUncheckedCreateWithoutLinesInput = {
    id?: string;
    invoiceNumber: string;
    date?: Date | string;
    customerId?: string | null;
    branchId: string;
    userId: string;
    paymentMethod: $Enums.PaymentMethod;
    status?: $Enums.InvoiceStatus;
    subtotal: runtime.Decimal | runtime.DecimalJsLike | number | string;
    taxAmount?: runtime.Decimal | runtime.DecimalJsLike | number | string;
    totalAmount: runtime.Decimal | runtime.DecimalJsLike | number | string;
    createdAt?: Date | string;
    journalEntry?: Prisma.JournalEntryUncheckedCreateNestedOneWithoutSalesInvoiceInput;
};
export type SalesInvoiceCreateOrConnectWithoutLinesInput = {
    where: Prisma.SalesInvoiceWhereUniqueInput;
    create: Prisma.XOR<Prisma.SalesInvoiceCreateWithoutLinesInput, Prisma.SalesInvoiceUncheckedCreateWithoutLinesInput>;
};
export type SalesInvoiceUpsertWithoutLinesInput = {
    update: Prisma.XOR<Prisma.SalesInvoiceUpdateWithoutLinesInput, Prisma.SalesInvoiceUncheckedUpdateWithoutLinesInput>;
    create: Prisma.XOR<Prisma.SalesInvoiceCreateWithoutLinesInput, Prisma.SalesInvoiceUncheckedCreateWithoutLinesInput>;
    where?: Prisma.SalesInvoiceWhereInput;
};
export type SalesInvoiceUpdateToOneWithWhereWithoutLinesInput = {
    where?: Prisma.SalesInvoiceWhereInput;
    data: Prisma.XOR<Prisma.SalesInvoiceUpdateWithoutLinesInput, Prisma.SalesInvoiceUncheckedUpdateWithoutLinesInput>;
};
export type SalesInvoiceUpdateWithoutLinesInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    invoiceNumber?: Prisma.StringFieldUpdateOperationsInput | string;
    date?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    paymentMethod?: Prisma.EnumPaymentMethodFieldUpdateOperationsInput | $Enums.PaymentMethod;
    status?: Prisma.EnumInvoiceStatusFieldUpdateOperationsInput | $Enums.InvoiceStatus;
    subtotal?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    taxAmount?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    totalAmount?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    customer?: Prisma.CustomerUpdateOneWithoutSalesInvoicesNestedInput;
    branch?: Prisma.BranchUpdateOneRequiredWithoutSalesInvoicesNestedInput;
    user?: Prisma.UserUpdateOneRequiredWithoutSalesInvoicesNestedInput;
    journalEntry?: Prisma.JournalEntryUpdateOneWithoutSalesInvoiceNestedInput;
};
export type SalesInvoiceUncheckedUpdateWithoutLinesInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    invoiceNumber?: Prisma.StringFieldUpdateOperationsInput | string;
    date?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    customerId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    branchId?: Prisma.StringFieldUpdateOperationsInput | string;
    userId?: Prisma.StringFieldUpdateOperationsInput | string;
    paymentMethod?: Prisma.EnumPaymentMethodFieldUpdateOperationsInput | $Enums.PaymentMethod;
    status?: Prisma.EnumInvoiceStatusFieldUpdateOperationsInput | $Enums.InvoiceStatus;
    subtotal?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    taxAmount?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    totalAmount?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    journalEntry?: Prisma.JournalEntryUncheckedUpdateOneWithoutSalesInvoiceNestedInput;
};
export type SalesInvoiceCreateManyBranchInput = {
    id?: string;
    invoiceNumber: string;
    date?: Date | string;
    customerId?: string | null;
    userId: string;
    paymentMethod: $Enums.PaymentMethod;
    status?: $Enums.InvoiceStatus;
    subtotal: runtime.Decimal | runtime.DecimalJsLike | number | string;
    taxAmount?: runtime.Decimal | runtime.DecimalJsLike | number | string;
    totalAmount: runtime.Decimal | runtime.DecimalJsLike | number | string;
    createdAt?: Date | string;
};
export type SalesInvoiceUpdateWithoutBranchInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    invoiceNumber?: Prisma.StringFieldUpdateOperationsInput | string;
    date?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    paymentMethod?: Prisma.EnumPaymentMethodFieldUpdateOperationsInput | $Enums.PaymentMethod;
    status?: Prisma.EnumInvoiceStatusFieldUpdateOperationsInput | $Enums.InvoiceStatus;
    subtotal?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    taxAmount?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    totalAmount?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    customer?: Prisma.CustomerUpdateOneWithoutSalesInvoicesNestedInput;
    user?: Prisma.UserUpdateOneRequiredWithoutSalesInvoicesNestedInput;
    lines?: Prisma.SalesInvoiceLineUpdateManyWithoutSalesInvoiceNestedInput;
    journalEntry?: Prisma.JournalEntryUpdateOneWithoutSalesInvoiceNestedInput;
};
export type SalesInvoiceUncheckedUpdateWithoutBranchInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    invoiceNumber?: Prisma.StringFieldUpdateOperationsInput | string;
    date?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    customerId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    userId?: Prisma.StringFieldUpdateOperationsInput | string;
    paymentMethod?: Prisma.EnumPaymentMethodFieldUpdateOperationsInput | $Enums.PaymentMethod;
    status?: Prisma.EnumInvoiceStatusFieldUpdateOperationsInput | $Enums.InvoiceStatus;
    subtotal?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    taxAmount?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    totalAmount?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    lines?: Prisma.SalesInvoiceLineUncheckedUpdateManyWithoutSalesInvoiceNestedInput;
    journalEntry?: Prisma.JournalEntryUncheckedUpdateOneWithoutSalesInvoiceNestedInput;
};
export type SalesInvoiceUncheckedUpdateManyWithoutBranchInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    invoiceNumber?: Prisma.StringFieldUpdateOperationsInput | string;
    date?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    customerId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    userId?: Prisma.StringFieldUpdateOperationsInput | string;
    paymentMethod?: Prisma.EnumPaymentMethodFieldUpdateOperationsInput | $Enums.PaymentMethod;
    status?: Prisma.EnumInvoiceStatusFieldUpdateOperationsInput | $Enums.InvoiceStatus;
    subtotal?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    taxAmount?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    totalAmount?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type SalesInvoiceCreateManyUserInput = {
    id?: string;
    invoiceNumber: string;
    date?: Date | string;
    customerId?: string | null;
    branchId: string;
    paymentMethod: $Enums.PaymentMethod;
    status?: $Enums.InvoiceStatus;
    subtotal: runtime.Decimal | runtime.DecimalJsLike | number | string;
    taxAmount?: runtime.Decimal | runtime.DecimalJsLike | number | string;
    totalAmount: runtime.Decimal | runtime.DecimalJsLike | number | string;
    createdAt?: Date | string;
};
export type SalesInvoiceUpdateWithoutUserInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    invoiceNumber?: Prisma.StringFieldUpdateOperationsInput | string;
    date?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    paymentMethod?: Prisma.EnumPaymentMethodFieldUpdateOperationsInput | $Enums.PaymentMethod;
    status?: Prisma.EnumInvoiceStatusFieldUpdateOperationsInput | $Enums.InvoiceStatus;
    subtotal?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    taxAmount?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    totalAmount?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    customer?: Prisma.CustomerUpdateOneWithoutSalesInvoicesNestedInput;
    branch?: Prisma.BranchUpdateOneRequiredWithoutSalesInvoicesNestedInput;
    lines?: Prisma.SalesInvoiceLineUpdateManyWithoutSalesInvoiceNestedInput;
    journalEntry?: Prisma.JournalEntryUpdateOneWithoutSalesInvoiceNestedInput;
};
export type SalesInvoiceUncheckedUpdateWithoutUserInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    invoiceNumber?: Prisma.StringFieldUpdateOperationsInput | string;
    date?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    customerId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    branchId?: Prisma.StringFieldUpdateOperationsInput | string;
    paymentMethod?: Prisma.EnumPaymentMethodFieldUpdateOperationsInput | $Enums.PaymentMethod;
    status?: Prisma.EnumInvoiceStatusFieldUpdateOperationsInput | $Enums.InvoiceStatus;
    subtotal?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    taxAmount?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    totalAmount?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    lines?: Prisma.SalesInvoiceLineUncheckedUpdateManyWithoutSalesInvoiceNestedInput;
    journalEntry?: Prisma.JournalEntryUncheckedUpdateOneWithoutSalesInvoiceNestedInput;
};
export type SalesInvoiceUncheckedUpdateManyWithoutUserInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    invoiceNumber?: Prisma.StringFieldUpdateOperationsInput | string;
    date?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    customerId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    branchId?: Prisma.StringFieldUpdateOperationsInput | string;
    paymentMethod?: Prisma.EnumPaymentMethodFieldUpdateOperationsInput | $Enums.PaymentMethod;
    status?: Prisma.EnumInvoiceStatusFieldUpdateOperationsInput | $Enums.InvoiceStatus;
    subtotal?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    taxAmount?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    totalAmount?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type SalesInvoiceCreateManyCustomerInput = {
    id?: string;
    invoiceNumber: string;
    date?: Date | string;
    branchId: string;
    userId: string;
    paymentMethod: $Enums.PaymentMethod;
    status?: $Enums.InvoiceStatus;
    subtotal: runtime.Decimal | runtime.DecimalJsLike | number | string;
    taxAmount?: runtime.Decimal | runtime.DecimalJsLike | number | string;
    totalAmount: runtime.Decimal | runtime.DecimalJsLike | number | string;
    createdAt?: Date | string;
};
export type SalesInvoiceUpdateWithoutCustomerInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    invoiceNumber?: Prisma.StringFieldUpdateOperationsInput | string;
    date?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    paymentMethod?: Prisma.EnumPaymentMethodFieldUpdateOperationsInput | $Enums.PaymentMethod;
    status?: Prisma.EnumInvoiceStatusFieldUpdateOperationsInput | $Enums.InvoiceStatus;
    subtotal?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    taxAmount?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    totalAmount?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    branch?: Prisma.BranchUpdateOneRequiredWithoutSalesInvoicesNestedInput;
    user?: Prisma.UserUpdateOneRequiredWithoutSalesInvoicesNestedInput;
    lines?: Prisma.SalesInvoiceLineUpdateManyWithoutSalesInvoiceNestedInput;
    journalEntry?: Prisma.JournalEntryUpdateOneWithoutSalesInvoiceNestedInput;
};
export type SalesInvoiceUncheckedUpdateWithoutCustomerInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    invoiceNumber?: Prisma.StringFieldUpdateOperationsInput | string;
    date?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    branchId?: Prisma.StringFieldUpdateOperationsInput | string;
    userId?: Prisma.StringFieldUpdateOperationsInput | string;
    paymentMethod?: Prisma.EnumPaymentMethodFieldUpdateOperationsInput | $Enums.PaymentMethod;
    status?: Prisma.EnumInvoiceStatusFieldUpdateOperationsInput | $Enums.InvoiceStatus;
    subtotal?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    taxAmount?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    totalAmount?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    lines?: Prisma.SalesInvoiceLineUncheckedUpdateManyWithoutSalesInvoiceNestedInput;
    journalEntry?: Prisma.JournalEntryUncheckedUpdateOneWithoutSalesInvoiceNestedInput;
};
export type SalesInvoiceUncheckedUpdateManyWithoutCustomerInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    invoiceNumber?: Prisma.StringFieldUpdateOperationsInput | string;
    date?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    branchId?: Prisma.StringFieldUpdateOperationsInput | string;
    userId?: Prisma.StringFieldUpdateOperationsInput | string;
    paymentMethod?: Prisma.EnumPaymentMethodFieldUpdateOperationsInput | $Enums.PaymentMethod;
    status?: Prisma.EnumInvoiceStatusFieldUpdateOperationsInput | $Enums.InvoiceStatus;
    subtotal?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    taxAmount?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    totalAmount?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type SalesInvoiceCountOutputType = {
    lines: number;
};
export type SalesInvoiceCountOutputTypeSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    lines?: boolean | SalesInvoiceCountOutputTypeCountLinesArgs;
};
export type SalesInvoiceCountOutputTypeDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.SalesInvoiceCountOutputTypeSelect<ExtArgs> | null;
};
export type SalesInvoiceCountOutputTypeCountLinesArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.SalesInvoiceLineWhereInput;
};
export type SalesInvoiceSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    invoiceNumber?: boolean;
    date?: boolean;
    customerId?: boolean;
    branchId?: boolean;
    userId?: boolean;
    paymentMethod?: boolean;
    status?: boolean;
    subtotal?: boolean;
    taxAmount?: boolean;
    totalAmount?: boolean;
    createdAt?: boolean;
    customer?: boolean | Prisma.SalesInvoice$customerArgs<ExtArgs>;
    branch?: boolean | Prisma.BranchDefaultArgs<ExtArgs>;
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
    lines?: boolean | Prisma.SalesInvoice$linesArgs<ExtArgs>;
    journalEntry?: boolean | Prisma.SalesInvoice$journalEntryArgs<ExtArgs>;
    _count?: boolean | Prisma.SalesInvoiceCountOutputTypeDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["salesInvoice"]>;
export type SalesInvoiceSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    invoiceNumber?: boolean;
    date?: boolean;
    customerId?: boolean;
    branchId?: boolean;
    userId?: boolean;
    paymentMethod?: boolean;
    status?: boolean;
    subtotal?: boolean;
    taxAmount?: boolean;
    totalAmount?: boolean;
    createdAt?: boolean;
    customer?: boolean | Prisma.SalesInvoice$customerArgs<ExtArgs>;
    branch?: boolean | Prisma.BranchDefaultArgs<ExtArgs>;
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["salesInvoice"]>;
export type SalesInvoiceSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    invoiceNumber?: boolean;
    date?: boolean;
    customerId?: boolean;
    branchId?: boolean;
    userId?: boolean;
    paymentMethod?: boolean;
    status?: boolean;
    subtotal?: boolean;
    taxAmount?: boolean;
    totalAmount?: boolean;
    createdAt?: boolean;
    customer?: boolean | Prisma.SalesInvoice$customerArgs<ExtArgs>;
    branch?: boolean | Prisma.BranchDefaultArgs<ExtArgs>;
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["salesInvoice"]>;
export type SalesInvoiceSelectScalar = {
    id?: boolean;
    invoiceNumber?: boolean;
    date?: boolean;
    customerId?: boolean;
    branchId?: boolean;
    userId?: boolean;
    paymentMethod?: boolean;
    status?: boolean;
    subtotal?: boolean;
    taxAmount?: boolean;
    totalAmount?: boolean;
    createdAt?: boolean;
};
export type SalesInvoiceOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "invoiceNumber" | "date" | "customerId" | "branchId" | "userId" | "paymentMethod" | "status" | "subtotal" | "taxAmount" | "totalAmount" | "createdAt", ExtArgs["result"]["salesInvoice"]>;
export type SalesInvoiceInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    customer?: boolean | Prisma.SalesInvoice$customerArgs<ExtArgs>;
    branch?: boolean | Prisma.BranchDefaultArgs<ExtArgs>;
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
    lines?: boolean | Prisma.SalesInvoice$linesArgs<ExtArgs>;
    journalEntry?: boolean | Prisma.SalesInvoice$journalEntryArgs<ExtArgs>;
    _count?: boolean | Prisma.SalesInvoiceCountOutputTypeDefaultArgs<ExtArgs>;
};
export type SalesInvoiceIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    customer?: boolean | Prisma.SalesInvoice$customerArgs<ExtArgs>;
    branch?: boolean | Prisma.BranchDefaultArgs<ExtArgs>;
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
};
export type SalesInvoiceIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    customer?: boolean | Prisma.SalesInvoice$customerArgs<ExtArgs>;
    branch?: boolean | Prisma.BranchDefaultArgs<ExtArgs>;
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
};
export type $SalesInvoicePayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "SalesInvoice";
    objects: {
        customer: Prisma.$CustomerPayload<ExtArgs> | null;
        branch: Prisma.$BranchPayload<ExtArgs>;
        user: Prisma.$UserPayload<ExtArgs>;
        lines: Prisma.$SalesInvoiceLinePayload<ExtArgs>[];
        journalEntry: Prisma.$JournalEntryPayload<ExtArgs> | null;
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        invoiceNumber: string;
        date: Date;
        customerId: string | null;
        branchId: string;
        userId: string;
        paymentMethod: $Enums.PaymentMethod;
        status: $Enums.InvoiceStatus;
        subtotal: runtime.Decimal;
        taxAmount: runtime.Decimal;
        totalAmount: runtime.Decimal;
        createdAt: Date;
    }, ExtArgs["result"]["salesInvoice"]>;
    composites: {};
};
export type SalesInvoiceGetPayload<S extends boolean | null | undefined | SalesInvoiceDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$SalesInvoicePayload, S>;
export type SalesInvoiceCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<SalesInvoiceFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: SalesInvoiceCountAggregateInputType | true;
};
export interface SalesInvoiceDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['SalesInvoice'];
        meta: {
            name: 'SalesInvoice';
        };
    };
    findUnique<T extends SalesInvoiceFindUniqueArgs>(args: Prisma.SelectSubset<T, SalesInvoiceFindUniqueArgs<ExtArgs>>): Prisma.Prisma__SalesInvoiceClient<runtime.Types.Result.GetResult<Prisma.$SalesInvoicePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends SalesInvoiceFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, SalesInvoiceFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__SalesInvoiceClient<runtime.Types.Result.GetResult<Prisma.$SalesInvoicePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends SalesInvoiceFindFirstArgs>(args?: Prisma.SelectSubset<T, SalesInvoiceFindFirstArgs<ExtArgs>>): Prisma.Prisma__SalesInvoiceClient<runtime.Types.Result.GetResult<Prisma.$SalesInvoicePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends SalesInvoiceFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, SalesInvoiceFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__SalesInvoiceClient<runtime.Types.Result.GetResult<Prisma.$SalesInvoicePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends SalesInvoiceFindManyArgs>(args?: Prisma.SelectSubset<T, SalesInvoiceFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$SalesInvoicePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends SalesInvoiceCreateArgs>(args: Prisma.SelectSubset<T, SalesInvoiceCreateArgs<ExtArgs>>): Prisma.Prisma__SalesInvoiceClient<runtime.Types.Result.GetResult<Prisma.$SalesInvoicePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends SalesInvoiceCreateManyArgs>(args?: Prisma.SelectSubset<T, SalesInvoiceCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends SalesInvoiceCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, SalesInvoiceCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$SalesInvoicePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends SalesInvoiceDeleteArgs>(args: Prisma.SelectSubset<T, SalesInvoiceDeleteArgs<ExtArgs>>): Prisma.Prisma__SalesInvoiceClient<runtime.Types.Result.GetResult<Prisma.$SalesInvoicePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends SalesInvoiceUpdateArgs>(args: Prisma.SelectSubset<T, SalesInvoiceUpdateArgs<ExtArgs>>): Prisma.Prisma__SalesInvoiceClient<runtime.Types.Result.GetResult<Prisma.$SalesInvoicePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends SalesInvoiceDeleteManyArgs>(args?: Prisma.SelectSubset<T, SalesInvoiceDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends SalesInvoiceUpdateManyArgs>(args: Prisma.SelectSubset<T, SalesInvoiceUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends SalesInvoiceUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, SalesInvoiceUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$SalesInvoicePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends SalesInvoiceUpsertArgs>(args: Prisma.SelectSubset<T, SalesInvoiceUpsertArgs<ExtArgs>>): Prisma.Prisma__SalesInvoiceClient<runtime.Types.Result.GetResult<Prisma.$SalesInvoicePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends SalesInvoiceCountArgs>(args?: Prisma.Subset<T, SalesInvoiceCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], SalesInvoiceCountAggregateOutputType> : number>;
    aggregate<T extends SalesInvoiceAggregateArgs>(args: Prisma.Subset<T, SalesInvoiceAggregateArgs>): Prisma.PrismaPromise<GetSalesInvoiceAggregateType<T>>;
    groupBy<T extends SalesInvoiceGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: SalesInvoiceGroupByArgs['orderBy'];
    } : {
        orderBy?: SalesInvoiceGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, SalesInvoiceGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetSalesInvoiceGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: SalesInvoiceFieldRefs;
}
export interface Prisma__SalesInvoiceClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    customer<T extends Prisma.SalesInvoice$customerArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.SalesInvoice$customerArgs<ExtArgs>>): Prisma.Prisma__CustomerClient<runtime.Types.Result.GetResult<Prisma.$CustomerPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    branch<T extends Prisma.BranchDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.BranchDefaultArgs<ExtArgs>>): Prisma.Prisma__BranchClient<runtime.Types.Result.GetResult<Prisma.$BranchPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    user<T extends Prisma.UserDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.UserDefaultArgs<ExtArgs>>): Prisma.Prisma__UserClient<runtime.Types.Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    lines<T extends Prisma.SalesInvoice$linesArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.SalesInvoice$linesArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$SalesInvoiceLinePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    journalEntry<T extends Prisma.SalesInvoice$journalEntryArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.SalesInvoice$journalEntryArgs<ExtArgs>>): Prisma.Prisma__JournalEntryClient<runtime.Types.Result.GetResult<Prisma.$JournalEntryPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface SalesInvoiceFieldRefs {
    readonly id: Prisma.FieldRef<"SalesInvoice", 'String'>;
    readonly invoiceNumber: Prisma.FieldRef<"SalesInvoice", 'String'>;
    readonly date: Prisma.FieldRef<"SalesInvoice", 'DateTime'>;
    readonly customerId: Prisma.FieldRef<"SalesInvoice", 'String'>;
    readonly branchId: Prisma.FieldRef<"SalesInvoice", 'String'>;
    readonly userId: Prisma.FieldRef<"SalesInvoice", 'String'>;
    readonly paymentMethod: Prisma.FieldRef<"SalesInvoice", 'PaymentMethod'>;
    readonly status: Prisma.FieldRef<"SalesInvoice", 'InvoiceStatus'>;
    readonly subtotal: Prisma.FieldRef<"SalesInvoice", 'Decimal'>;
    readonly taxAmount: Prisma.FieldRef<"SalesInvoice", 'Decimal'>;
    readonly totalAmount: Prisma.FieldRef<"SalesInvoice", 'Decimal'>;
    readonly createdAt: Prisma.FieldRef<"SalesInvoice", 'DateTime'>;
}
export type SalesInvoiceFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.SalesInvoiceSelect<ExtArgs> | null;
    omit?: Prisma.SalesInvoiceOmit<ExtArgs> | null;
    include?: Prisma.SalesInvoiceInclude<ExtArgs> | null;
    where: Prisma.SalesInvoiceWhereUniqueInput;
};
export type SalesInvoiceFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.SalesInvoiceSelect<ExtArgs> | null;
    omit?: Prisma.SalesInvoiceOmit<ExtArgs> | null;
    include?: Prisma.SalesInvoiceInclude<ExtArgs> | null;
    where: Prisma.SalesInvoiceWhereUniqueInput;
};
export type SalesInvoiceFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type SalesInvoiceFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type SalesInvoiceFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type SalesInvoiceCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.SalesInvoiceSelect<ExtArgs> | null;
    omit?: Prisma.SalesInvoiceOmit<ExtArgs> | null;
    include?: Prisma.SalesInvoiceInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.SalesInvoiceCreateInput, Prisma.SalesInvoiceUncheckedCreateInput>;
};
export type SalesInvoiceCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.SalesInvoiceCreateManyInput | Prisma.SalesInvoiceCreateManyInput[];
    skipDuplicates?: boolean;
};
export type SalesInvoiceCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.SalesInvoiceSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.SalesInvoiceOmit<ExtArgs> | null;
    data: Prisma.SalesInvoiceCreateManyInput | Prisma.SalesInvoiceCreateManyInput[];
    skipDuplicates?: boolean;
    include?: Prisma.SalesInvoiceIncludeCreateManyAndReturn<ExtArgs> | null;
};
export type SalesInvoiceUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.SalesInvoiceSelect<ExtArgs> | null;
    omit?: Prisma.SalesInvoiceOmit<ExtArgs> | null;
    include?: Prisma.SalesInvoiceInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.SalesInvoiceUpdateInput, Prisma.SalesInvoiceUncheckedUpdateInput>;
    where: Prisma.SalesInvoiceWhereUniqueInput;
};
export type SalesInvoiceUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.SalesInvoiceUpdateManyMutationInput, Prisma.SalesInvoiceUncheckedUpdateManyInput>;
    where?: Prisma.SalesInvoiceWhereInput;
    limit?: number;
};
export type SalesInvoiceUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.SalesInvoiceSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.SalesInvoiceOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.SalesInvoiceUpdateManyMutationInput, Prisma.SalesInvoiceUncheckedUpdateManyInput>;
    where?: Prisma.SalesInvoiceWhereInput;
    limit?: number;
    include?: Prisma.SalesInvoiceIncludeUpdateManyAndReturn<ExtArgs> | null;
};
export type SalesInvoiceUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.SalesInvoiceSelect<ExtArgs> | null;
    omit?: Prisma.SalesInvoiceOmit<ExtArgs> | null;
    include?: Prisma.SalesInvoiceInclude<ExtArgs> | null;
    where: Prisma.SalesInvoiceWhereUniqueInput;
    create: Prisma.XOR<Prisma.SalesInvoiceCreateInput, Prisma.SalesInvoiceUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.SalesInvoiceUpdateInput, Prisma.SalesInvoiceUncheckedUpdateInput>;
};
export type SalesInvoiceDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.SalesInvoiceSelect<ExtArgs> | null;
    omit?: Prisma.SalesInvoiceOmit<ExtArgs> | null;
    include?: Prisma.SalesInvoiceInclude<ExtArgs> | null;
    where: Prisma.SalesInvoiceWhereUniqueInput;
};
export type SalesInvoiceDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.SalesInvoiceWhereInput;
    limit?: number;
};
export type SalesInvoice$customerArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CustomerSelect<ExtArgs> | null;
    omit?: Prisma.CustomerOmit<ExtArgs> | null;
    include?: Prisma.CustomerInclude<ExtArgs> | null;
    where?: Prisma.CustomerWhereInput;
};
export type SalesInvoice$linesArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.SalesInvoiceLineSelect<ExtArgs> | null;
    omit?: Prisma.SalesInvoiceLineOmit<ExtArgs> | null;
    include?: Prisma.SalesInvoiceLineInclude<ExtArgs> | null;
    where?: Prisma.SalesInvoiceLineWhereInput;
    orderBy?: Prisma.SalesInvoiceLineOrderByWithRelationInput | Prisma.SalesInvoiceLineOrderByWithRelationInput[];
    cursor?: Prisma.SalesInvoiceLineWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.SalesInvoiceLineScalarFieldEnum | Prisma.SalesInvoiceLineScalarFieldEnum[];
};
export type SalesInvoice$journalEntryArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.JournalEntrySelect<ExtArgs> | null;
    omit?: Prisma.JournalEntryOmit<ExtArgs> | null;
    include?: Prisma.JournalEntryInclude<ExtArgs> | null;
    where?: Prisma.JournalEntryWhereInput;
};
export type SalesInvoiceDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.SalesInvoiceSelect<ExtArgs> | null;
    omit?: Prisma.SalesInvoiceOmit<ExtArgs> | null;
    include?: Prisma.SalesInvoiceInclude<ExtArgs> | null;
};
