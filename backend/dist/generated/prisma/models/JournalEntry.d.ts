import type * as runtime from "@prisma/client/runtime/client";
import type * as $Enums from "../enums.js";
import type * as Prisma from "../internal/prismaNamespace.js";
export type JournalEntryModel = runtime.Types.Result.DefaultSelection<Prisma.$JournalEntryPayload>;
export type AggregateJournalEntry = {
    _count: JournalEntryCountAggregateOutputType | null;
    _min: JournalEntryMinAggregateOutputType | null;
    _max: JournalEntryMaxAggregateOutputType | null;
};
export type JournalEntryMinAggregateOutputType = {
    id: string | null;
    reference: string | null;
    date: Date | null;
    description: string | null;
    status: $Enums.JournalEntryStatus | null;
    branchId: string | null;
    salesInvoiceId: string | null;
    createdAt: Date | null;
};
export type JournalEntryMaxAggregateOutputType = {
    id: string | null;
    reference: string | null;
    date: Date | null;
    description: string | null;
    status: $Enums.JournalEntryStatus | null;
    branchId: string | null;
    salesInvoiceId: string | null;
    createdAt: Date | null;
};
export type JournalEntryCountAggregateOutputType = {
    id: number;
    reference: number;
    date: number;
    description: number;
    status: number;
    branchId: number;
    salesInvoiceId: number;
    createdAt: number;
    _all: number;
};
export type JournalEntryMinAggregateInputType = {
    id?: true;
    reference?: true;
    date?: true;
    description?: true;
    status?: true;
    branchId?: true;
    salesInvoiceId?: true;
    createdAt?: true;
};
export type JournalEntryMaxAggregateInputType = {
    id?: true;
    reference?: true;
    date?: true;
    description?: true;
    status?: true;
    branchId?: true;
    salesInvoiceId?: true;
    createdAt?: true;
};
export type JournalEntryCountAggregateInputType = {
    id?: true;
    reference?: true;
    date?: true;
    description?: true;
    status?: true;
    branchId?: true;
    salesInvoiceId?: true;
    createdAt?: true;
    _all?: true;
};
export type JournalEntryAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.JournalEntryWhereInput;
    orderBy?: Prisma.JournalEntryOrderByWithRelationInput | Prisma.JournalEntryOrderByWithRelationInput[];
    cursor?: Prisma.JournalEntryWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | JournalEntryCountAggregateInputType;
    _min?: JournalEntryMinAggregateInputType;
    _max?: JournalEntryMaxAggregateInputType;
};
export type GetJournalEntryAggregateType<T extends JournalEntryAggregateArgs> = {
    [P in keyof T & keyof AggregateJournalEntry]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateJournalEntry[P]> : Prisma.GetScalarType<T[P], AggregateJournalEntry[P]>;
};
export type JournalEntryGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.JournalEntryWhereInput;
    orderBy?: Prisma.JournalEntryOrderByWithAggregationInput | Prisma.JournalEntryOrderByWithAggregationInput[];
    by: Prisma.JournalEntryScalarFieldEnum[] | Prisma.JournalEntryScalarFieldEnum;
    having?: Prisma.JournalEntryScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: JournalEntryCountAggregateInputType | true;
    _min?: JournalEntryMinAggregateInputType;
    _max?: JournalEntryMaxAggregateInputType;
};
export type JournalEntryGroupByOutputType = {
    id: string;
    reference: string;
    date: Date;
    description: string | null;
    status: $Enums.JournalEntryStatus;
    branchId: string | null;
    salesInvoiceId: string | null;
    createdAt: Date;
    _count: JournalEntryCountAggregateOutputType | null;
    _min: JournalEntryMinAggregateOutputType | null;
    _max: JournalEntryMaxAggregateOutputType | null;
};
export type GetJournalEntryGroupByPayload<T extends JournalEntryGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<JournalEntryGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof JournalEntryGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], JournalEntryGroupByOutputType[P]> : Prisma.GetScalarType<T[P], JournalEntryGroupByOutputType[P]>;
}>>;
export type JournalEntryWhereInput = {
    AND?: Prisma.JournalEntryWhereInput | Prisma.JournalEntryWhereInput[];
    OR?: Prisma.JournalEntryWhereInput[];
    NOT?: Prisma.JournalEntryWhereInput | Prisma.JournalEntryWhereInput[];
    id?: Prisma.StringFilter<"JournalEntry"> | string;
    reference?: Prisma.StringFilter<"JournalEntry"> | string;
    date?: Prisma.DateTimeFilter<"JournalEntry"> | Date | string;
    description?: Prisma.StringNullableFilter<"JournalEntry"> | string | null;
    status?: Prisma.EnumJournalEntryStatusFilter<"JournalEntry"> | $Enums.JournalEntryStatus;
    branchId?: Prisma.StringNullableFilter<"JournalEntry"> | string | null;
    salesInvoiceId?: Prisma.StringNullableFilter<"JournalEntry"> | string | null;
    createdAt?: Prisma.DateTimeFilter<"JournalEntry"> | Date | string;
    branch?: Prisma.XOR<Prisma.BranchNullableScalarRelationFilter, Prisma.BranchWhereInput> | null;
    salesInvoice?: Prisma.XOR<Prisma.SalesInvoiceNullableScalarRelationFilter, Prisma.SalesInvoiceWhereInput> | null;
    lines?: Prisma.JournalEntryLineListRelationFilter;
};
export type JournalEntryOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    reference?: Prisma.SortOrder;
    date?: Prisma.SortOrder;
    description?: Prisma.SortOrderInput | Prisma.SortOrder;
    status?: Prisma.SortOrder;
    branchId?: Prisma.SortOrderInput | Prisma.SortOrder;
    salesInvoiceId?: Prisma.SortOrderInput | Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    branch?: Prisma.BranchOrderByWithRelationInput;
    salesInvoice?: Prisma.SalesInvoiceOrderByWithRelationInput;
    lines?: Prisma.JournalEntryLineOrderByRelationAggregateInput;
};
export type JournalEntryWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    reference?: string;
    salesInvoiceId?: string;
    AND?: Prisma.JournalEntryWhereInput | Prisma.JournalEntryWhereInput[];
    OR?: Prisma.JournalEntryWhereInput[];
    NOT?: Prisma.JournalEntryWhereInput | Prisma.JournalEntryWhereInput[];
    date?: Prisma.DateTimeFilter<"JournalEntry"> | Date | string;
    description?: Prisma.StringNullableFilter<"JournalEntry"> | string | null;
    status?: Prisma.EnumJournalEntryStatusFilter<"JournalEntry"> | $Enums.JournalEntryStatus;
    branchId?: Prisma.StringNullableFilter<"JournalEntry"> | string | null;
    createdAt?: Prisma.DateTimeFilter<"JournalEntry"> | Date | string;
    branch?: Prisma.XOR<Prisma.BranchNullableScalarRelationFilter, Prisma.BranchWhereInput> | null;
    salesInvoice?: Prisma.XOR<Prisma.SalesInvoiceNullableScalarRelationFilter, Prisma.SalesInvoiceWhereInput> | null;
    lines?: Prisma.JournalEntryLineListRelationFilter;
}, "id" | "reference" | "salesInvoiceId">;
export type JournalEntryOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    reference?: Prisma.SortOrder;
    date?: Prisma.SortOrder;
    description?: Prisma.SortOrderInput | Prisma.SortOrder;
    status?: Prisma.SortOrder;
    branchId?: Prisma.SortOrderInput | Prisma.SortOrder;
    salesInvoiceId?: Prisma.SortOrderInput | Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    _count?: Prisma.JournalEntryCountOrderByAggregateInput;
    _max?: Prisma.JournalEntryMaxOrderByAggregateInput;
    _min?: Prisma.JournalEntryMinOrderByAggregateInput;
};
export type JournalEntryScalarWhereWithAggregatesInput = {
    AND?: Prisma.JournalEntryScalarWhereWithAggregatesInput | Prisma.JournalEntryScalarWhereWithAggregatesInput[];
    OR?: Prisma.JournalEntryScalarWhereWithAggregatesInput[];
    NOT?: Prisma.JournalEntryScalarWhereWithAggregatesInput | Prisma.JournalEntryScalarWhereWithAggregatesInput[];
    id?: Prisma.StringWithAggregatesFilter<"JournalEntry"> | string;
    reference?: Prisma.StringWithAggregatesFilter<"JournalEntry"> | string;
    date?: Prisma.DateTimeWithAggregatesFilter<"JournalEntry"> | Date | string;
    description?: Prisma.StringNullableWithAggregatesFilter<"JournalEntry"> | string | null;
    status?: Prisma.EnumJournalEntryStatusWithAggregatesFilter<"JournalEntry"> | $Enums.JournalEntryStatus;
    branchId?: Prisma.StringNullableWithAggregatesFilter<"JournalEntry"> | string | null;
    salesInvoiceId?: Prisma.StringNullableWithAggregatesFilter<"JournalEntry"> | string | null;
    createdAt?: Prisma.DateTimeWithAggregatesFilter<"JournalEntry"> | Date | string;
};
export type JournalEntryCreateInput = {
    id?: string;
    reference: string;
    date?: Date | string;
    description?: string | null;
    status?: $Enums.JournalEntryStatus;
    createdAt?: Date | string;
    branch?: Prisma.BranchCreateNestedOneWithoutJournalEntriesInput;
    salesInvoice?: Prisma.SalesInvoiceCreateNestedOneWithoutJournalEntryInput;
    lines?: Prisma.JournalEntryLineCreateNestedManyWithoutJournalEntryInput;
};
export type JournalEntryUncheckedCreateInput = {
    id?: string;
    reference: string;
    date?: Date | string;
    description?: string | null;
    status?: $Enums.JournalEntryStatus;
    branchId?: string | null;
    salesInvoiceId?: string | null;
    createdAt?: Date | string;
    lines?: Prisma.JournalEntryLineUncheckedCreateNestedManyWithoutJournalEntryInput;
};
export type JournalEntryUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    reference?: Prisma.StringFieldUpdateOperationsInput | string;
    date?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    status?: Prisma.EnumJournalEntryStatusFieldUpdateOperationsInput | $Enums.JournalEntryStatus;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    branch?: Prisma.BranchUpdateOneWithoutJournalEntriesNestedInput;
    salesInvoice?: Prisma.SalesInvoiceUpdateOneWithoutJournalEntryNestedInput;
    lines?: Prisma.JournalEntryLineUpdateManyWithoutJournalEntryNestedInput;
};
export type JournalEntryUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    reference?: Prisma.StringFieldUpdateOperationsInput | string;
    date?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    status?: Prisma.EnumJournalEntryStatusFieldUpdateOperationsInput | $Enums.JournalEntryStatus;
    branchId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    salesInvoiceId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    lines?: Prisma.JournalEntryLineUncheckedUpdateManyWithoutJournalEntryNestedInput;
};
export type JournalEntryCreateManyInput = {
    id?: string;
    reference: string;
    date?: Date | string;
    description?: string | null;
    status?: $Enums.JournalEntryStatus;
    branchId?: string | null;
    salesInvoiceId?: string | null;
    createdAt?: Date | string;
};
export type JournalEntryUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    reference?: Prisma.StringFieldUpdateOperationsInput | string;
    date?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    status?: Prisma.EnumJournalEntryStatusFieldUpdateOperationsInput | $Enums.JournalEntryStatus;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type JournalEntryUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    reference?: Prisma.StringFieldUpdateOperationsInput | string;
    date?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    status?: Prisma.EnumJournalEntryStatusFieldUpdateOperationsInput | $Enums.JournalEntryStatus;
    branchId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    salesInvoiceId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type JournalEntryListRelationFilter = {
    every?: Prisma.JournalEntryWhereInput;
    some?: Prisma.JournalEntryWhereInput;
    none?: Prisma.JournalEntryWhereInput;
};
export type JournalEntryOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type JournalEntryCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    reference?: Prisma.SortOrder;
    date?: Prisma.SortOrder;
    description?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    branchId?: Prisma.SortOrder;
    salesInvoiceId?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type JournalEntryMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    reference?: Prisma.SortOrder;
    date?: Prisma.SortOrder;
    description?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    branchId?: Prisma.SortOrder;
    salesInvoiceId?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type JournalEntryMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    reference?: Prisma.SortOrder;
    date?: Prisma.SortOrder;
    description?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    branchId?: Prisma.SortOrder;
    salesInvoiceId?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type JournalEntryScalarRelationFilter = {
    is?: Prisma.JournalEntryWhereInput;
    isNot?: Prisma.JournalEntryWhereInput;
};
export type JournalEntryNullableScalarRelationFilter = {
    is?: Prisma.JournalEntryWhereInput | null;
    isNot?: Prisma.JournalEntryWhereInput | null;
};
export type JournalEntryCreateNestedManyWithoutBranchInput = {
    create?: Prisma.XOR<Prisma.JournalEntryCreateWithoutBranchInput, Prisma.JournalEntryUncheckedCreateWithoutBranchInput> | Prisma.JournalEntryCreateWithoutBranchInput[] | Prisma.JournalEntryUncheckedCreateWithoutBranchInput[];
    connectOrCreate?: Prisma.JournalEntryCreateOrConnectWithoutBranchInput | Prisma.JournalEntryCreateOrConnectWithoutBranchInput[];
    createMany?: Prisma.JournalEntryCreateManyBranchInputEnvelope;
    connect?: Prisma.JournalEntryWhereUniqueInput | Prisma.JournalEntryWhereUniqueInput[];
};
export type JournalEntryUncheckedCreateNestedManyWithoutBranchInput = {
    create?: Prisma.XOR<Prisma.JournalEntryCreateWithoutBranchInput, Prisma.JournalEntryUncheckedCreateWithoutBranchInput> | Prisma.JournalEntryCreateWithoutBranchInput[] | Prisma.JournalEntryUncheckedCreateWithoutBranchInput[];
    connectOrCreate?: Prisma.JournalEntryCreateOrConnectWithoutBranchInput | Prisma.JournalEntryCreateOrConnectWithoutBranchInput[];
    createMany?: Prisma.JournalEntryCreateManyBranchInputEnvelope;
    connect?: Prisma.JournalEntryWhereUniqueInput | Prisma.JournalEntryWhereUniqueInput[];
};
export type JournalEntryUpdateManyWithoutBranchNestedInput = {
    create?: Prisma.XOR<Prisma.JournalEntryCreateWithoutBranchInput, Prisma.JournalEntryUncheckedCreateWithoutBranchInput> | Prisma.JournalEntryCreateWithoutBranchInput[] | Prisma.JournalEntryUncheckedCreateWithoutBranchInput[];
    connectOrCreate?: Prisma.JournalEntryCreateOrConnectWithoutBranchInput | Prisma.JournalEntryCreateOrConnectWithoutBranchInput[];
    upsert?: Prisma.JournalEntryUpsertWithWhereUniqueWithoutBranchInput | Prisma.JournalEntryUpsertWithWhereUniqueWithoutBranchInput[];
    createMany?: Prisma.JournalEntryCreateManyBranchInputEnvelope;
    set?: Prisma.JournalEntryWhereUniqueInput | Prisma.JournalEntryWhereUniqueInput[];
    disconnect?: Prisma.JournalEntryWhereUniqueInput | Prisma.JournalEntryWhereUniqueInput[];
    delete?: Prisma.JournalEntryWhereUniqueInput | Prisma.JournalEntryWhereUniqueInput[];
    connect?: Prisma.JournalEntryWhereUniqueInput | Prisma.JournalEntryWhereUniqueInput[];
    update?: Prisma.JournalEntryUpdateWithWhereUniqueWithoutBranchInput | Prisma.JournalEntryUpdateWithWhereUniqueWithoutBranchInput[];
    updateMany?: Prisma.JournalEntryUpdateManyWithWhereWithoutBranchInput | Prisma.JournalEntryUpdateManyWithWhereWithoutBranchInput[];
    deleteMany?: Prisma.JournalEntryScalarWhereInput | Prisma.JournalEntryScalarWhereInput[];
};
export type JournalEntryUncheckedUpdateManyWithoutBranchNestedInput = {
    create?: Prisma.XOR<Prisma.JournalEntryCreateWithoutBranchInput, Prisma.JournalEntryUncheckedCreateWithoutBranchInput> | Prisma.JournalEntryCreateWithoutBranchInput[] | Prisma.JournalEntryUncheckedCreateWithoutBranchInput[];
    connectOrCreate?: Prisma.JournalEntryCreateOrConnectWithoutBranchInput | Prisma.JournalEntryCreateOrConnectWithoutBranchInput[];
    upsert?: Prisma.JournalEntryUpsertWithWhereUniqueWithoutBranchInput | Prisma.JournalEntryUpsertWithWhereUniqueWithoutBranchInput[];
    createMany?: Prisma.JournalEntryCreateManyBranchInputEnvelope;
    set?: Prisma.JournalEntryWhereUniqueInput | Prisma.JournalEntryWhereUniqueInput[];
    disconnect?: Prisma.JournalEntryWhereUniqueInput | Prisma.JournalEntryWhereUniqueInput[];
    delete?: Prisma.JournalEntryWhereUniqueInput | Prisma.JournalEntryWhereUniqueInput[];
    connect?: Prisma.JournalEntryWhereUniqueInput | Prisma.JournalEntryWhereUniqueInput[];
    update?: Prisma.JournalEntryUpdateWithWhereUniqueWithoutBranchInput | Prisma.JournalEntryUpdateWithWhereUniqueWithoutBranchInput[];
    updateMany?: Prisma.JournalEntryUpdateManyWithWhereWithoutBranchInput | Prisma.JournalEntryUpdateManyWithWhereWithoutBranchInput[];
    deleteMany?: Prisma.JournalEntryScalarWhereInput | Prisma.JournalEntryScalarWhereInput[];
};
export type EnumJournalEntryStatusFieldUpdateOperationsInput = {
    set?: $Enums.JournalEntryStatus;
};
export type JournalEntryCreateNestedOneWithoutLinesInput = {
    create?: Prisma.XOR<Prisma.JournalEntryCreateWithoutLinesInput, Prisma.JournalEntryUncheckedCreateWithoutLinesInput>;
    connectOrCreate?: Prisma.JournalEntryCreateOrConnectWithoutLinesInput;
    connect?: Prisma.JournalEntryWhereUniqueInput;
};
export type JournalEntryUpdateOneRequiredWithoutLinesNestedInput = {
    create?: Prisma.XOR<Prisma.JournalEntryCreateWithoutLinesInput, Prisma.JournalEntryUncheckedCreateWithoutLinesInput>;
    connectOrCreate?: Prisma.JournalEntryCreateOrConnectWithoutLinesInput;
    upsert?: Prisma.JournalEntryUpsertWithoutLinesInput;
    connect?: Prisma.JournalEntryWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.JournalEntryUpdateToOneWithWhereWithoutLinesInput, Prisma.JournalEntryUpdateWithoutLinesInput>, Prisma.JournalEntryUncheckedUpdateWithoutLinesInput>;
};
export type JournalEntryCreateNestedOneWithoutSalesInvoiceInput = {
    create?: Prisma.XOR<Prisma.JournalEntryCreateWithoutSalesInvoiceInput, Prisma.JournalEntryUncheckedCreateWithoutSalesInvoiceInput>;
    connectOrCreate?: Prisma.JournalEntryCreateOrConnectWithoutSalesInvoiceInput;
    connect?: Prisma.JournalEntryWhereUniqueInput;
};
export type JournalEntryUncheckedCreateNestedOneWithoutSalesInvoiceInput = {
    create?: Prisma.XOR<Prisma.JournalEntryCreateWithoutSalesInvoiceInput, Prisma.JournalEntryUncheckedCreateWithoutSalesInvoiceInput>;
    connectOrCreate?: Prisma.JournalEntryCreateOrConnectWithoutSalesInvoiceInput;
    connect?: Prisma.JournalEntryWhereUniqueInput;
};
export type JournalEntryUpdateOneWithoutSalesInvoiceNestedInput = {
    create?: Prisma.XOR<Prisma.JournalEntryCreateWithoutSalesInvoiceInput, Prisma.JournalEntryUncheckedCreateWithoutSalesInvoiceInput>;
    connectOrCreate?: Prisma.JournalEntryCreateOrConnectWithoutSalesInvoiceInput;
    upsert?: Prisma.JournalEntryUpsertWithoutSalesInvoiceInput;
    disconnect?: Prisma.JournalEntryWhereInput | boolean;
    delete?: Prisma.JournalEntryWhereInput | boolean;
    connect?: Prisma.JournalEntryWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.JournalEntryUpdateToOneWithWhereWithoutSalesInvoiceInput, Prisma.JournalEntryUpdateWithoutSalesInvoiceInput>, Prisma.JournalEntryUncheckedUpdateWithoutSalesInvoiceInput>;
};
export type JournalEntryUncheckedUpdateOneWithoutSalesInvoiceNestedInput = {
    create?: Prisma.XOR<Prisma.JournalEntryCreateWithoutSalesInvoiceInput, Prisma.JournalEntryUncheckedCreateWithoutSalesInvoiceInput>;
    connectOrCreate?: Prisma.JournalEntryCreateOrConnectWithoutSalesInvoiceInput;
    upsert?: Prisma.JournalEntryUpsertWithoutSalesInvoiceInput;
    disconnect?: Prisma.JournalEntryWhereInput | boolean;
    delete?: Prisma.JournalEntryWhereInput | boolean;
    connect?: Prisma.JournalEntryWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.JournalEntryUpdateToOneWithWhereWithoutSalesInvoiceInput, Prisma.JournalEntryUpdateWithoutSalesInvoiceInput>, Prisma.JournalEntryUncheckedUpdateWithoutSalesInvoiceInput>;
};
export type JournalEntryCreateWithoutBranchInput = {
    id?: string;
    reference: string;
    date?: Date | string;
    description?: string | null;
    status?: $Enums.JournalEntryStatus;
    createdAt?: Date | string;
    salesInvoice?: Prisma.SalesInvoiceCreateNestedOneWithoutJournalEntryInput;
    lines?: Prisma.JournalEntryLineCreateNestedManyWithoutJournalEntryInput;
};
export type JournalEntryUncheckedCreateWithoutBranchInput = {
    id?: string;
    reference: string;
    date?: Date | string;
    description?: string | null;
    status?: $Enums.JournalEntryStatus;
    salesInvoiceId?: string | null;
    createdAt?: Date | string;
    lines?: Prisma.JournalEntryLineUncheckedCreateNestedManyWithoutJournalEntryInput;
};
export type JournalEntryCreateOrConnectWithoutBranchInput = {
    where: Prisma.JournalEntryWhereUniqueInput;
    create: Prisma.XOR<Prisma.JournalEntryCreateWithoutBranchInput, Prisma.JournalEntryUncheckedCreateWithoutBranchInput>;
};
export type JournalEntryCreateManyBranchInputEnvelope = {
    data: Prisma.JournalEntryCreateManyBranchInput | Prisma.JournalEntryCreateManyBranchInput[];
    skipDuplicates?: boolean;
};
export type JournalEntryUpsertWithWhereUniqueWithoutBranchInput = {
    where: Prisma.JournalEntryWhereUniqueInput;
    update: Prisma.XOR<Prisma.JournalEntryUpdateWithoutBranchInput, Prisma.JournalEntryUncheckedUpdateWithoutBranchInput>;
    create: Prisma.XOR<Prisma.JournalEntryCreateWithoutBranchInput, Prisma.JournalEntryUncheckedCreateWithoutBranchInput>;
};
export type JournalEntryUpdateWithWhereUniqueWithoutBranchInput = {
    where: Prisma.JournalEntryWhereUniqueInput;
    data: Prisma.XOR<Prisma.JournalEntryUpdateWithoutBranchInput, Prisma.JournalEntryUncheckedUpdateWithoutBranchInput>;
};
export type JournalEntryUpdateManyWithWhereWithoutBranchInput = {
    where: Prisma.JournalEntryScalarWhereInput;
    data: Prisma.XOR<Prisma.JournalEntryUpdateManyMutationInput, Prisma.JournalEntryUncheckedUpdateManyWithoutBranchInput>;
};
export type JournalEntryScalarWhereInput = {
    AND?: Prisma.JournalEntryScalarWhereInput | Prisma.JournalEntryScalarWhereInput[];
    OR?: Prisma.JournalEntryScalarWhereInput[];
    NOT?: Prisma.JournalEntryScalarWhereInput | Prisma.JournalEntryScalarWhereInput[];
    id?: Prisma.StringFilter<"JournalEntry"> | string;
    reference?: Prisma.StringFilter<"JournalEntry"> | string;
    date?: Prisma.DateTimeFilter<"JournalEntry"> | Date | string;
    description?: Prisma.StringNullableFilter<"JournalEntry"> | string | null;
    status?: Prisma.EnumJournalEntryStatusFilter<"JournalEntry"> | $Enums.JournalEntryStatus;
    branchId?: Prisma.StringNullableFilter<"JournalEntry"> | string | null;
    salesInvoiceId?: Prisma.StringNullableFilter<"JournalEntry"> | string | null;
    createdAt?: Prisma.DateTimeFilter<"JournalEntry"> | Date | string;
};
export type JournalEntryCreateWithoutLinesInput = {
    id?: string;
    reference: string;
    date?: Date | string;
    description?: string | null;
    status?: $Enums.JournalEntryStatus;
    createdAt?: Date | string;
    branch?: Prisma.BranchCreateNestedOneWithoutJournalEntriesInput;
    salesInvoice?: Prisma.SalesInvoiceCreateNestedOneWithoutJournalEntryInput;
};
export type JournalEntryUncheckedCreateWithoutLinesInput = {
    id?: string;
    reference: string;
    date?: Date | string;
    description?: string | null;
    status?: $Enums.JournalEntryStatus;
    branchId?: string | null;
    salesInvoiceId?: string | null;
    createdAt?: Date | string;
};
export type JournalEntryCreateOrConnectWithoutLinesInput = {
    where: Prisma.JournalEntryWhereUniqueInput;
    create: Prisma.XOR<Prisma.JournalEntryCreateWithoutLinesInput, Prisma.JournalEntryUncheckedCreateWithoutLinesInput>;
};
export type JournalEntryUpsertWithoutLinesInput = {
    update: Prisma.XOR<Prisma.JournalEntryUpdateWithoutLinesInput, Prisma.JournalEntryUncheckedUpdateWithoutLinesInput>;
    create: Prisma.XOR<Prisma.JournalEntryCreateWithoutLinesInput, Prisma.JournalEntryUncheckedCreateWithoutLinesInput>;
    where?: Prisma.JournalEntryWhereInput;
};
export type JournalEntryUpdateToOneWithWhereWithoutLinesInput = {
    where?: Prisma.JournalEntryWhereInput;
    data: Prisma.XOR<Prisma.JournalEntryUpdateWithoutLinesInput, Prisma.JournalEntryUncheckedUpdateWithoutLinesInput>;
};
export type JournalEntryUpdateWithoutLinesInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    reference?: Prisma.StringFieldUpdateOperationsInput | string;
    date?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    status?: Prisma.EnumJournalEntryStatusFieldUpdateOperationsInput | $Enums.JournalEntryStatus;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    branch?: Prisma.BranchUpdateOneWithoutJournalEntriesNestedInput;
    salesInvoice?: Prisma.SalesInvoiceUpdateOneWithoutJournalEntryNestedInput;
};
export type JournalEntryUncheckedUpdateWithoutLinesInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    reference?: Prisma.StringFieldUpdateOperationsInput | string;
    date?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    status?: Prisma.EnumJournalEntryStatusFieldUpdateOperationsInput | $Enums.JournalEntryStatus;
    branchId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    salesInvoiceId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type JournalEntryCreateWithoutSalesInvoiceInput = {
    id?: string;
    reference: string;
    date?: Date | string;
    description?: string | null;
    status?: $Enums.JournalEntryStatus;
    createdAt?: Date | string;
    branch?: Prisma.BranchCreateNestedOneWithoutJournalEntriesInput;
    lines?: Prisma.JournalEntryLineCreateNestedManyWithoutJournalEntryInput;
};
export type JournalEntryUncheckedCreateWithoutSalesInvoiceInput = {
    id?: string;
    reference: string;
    date?: Date | string;
    description?: string | null;
    status?: $Enums.JournalEntryStatus;
    branchId?: string | null;
    createdAt?: Date | string;
    lines?: Prisma.JournalEntryLineUncheckedCreateNestedManyWithoutJournalEntryInput;
};
export type JournalEntryCreateOrConnectWithoutSalesInvoiceInput = {
    where: Prisma.JournalEntryWhereUniqueInput;
    create: Prisma.XOR<Prisma.JournalEntryCreateWithoutSalesInvoiceInput, Prisma.JournalEntryUncheckedCreateWithoutSalesInvoiceInput>;
};
export type JournalEntryUpsertWithoutSalesInvoiceInput = {
    update: Prisma.XOR<Prisma.JournalEntryUpdateWithoutSalesInvoiceInput, Prisma.JournalEntryUncheckedUpdateWithoutSalesInvoiceInput>;
    create: Prisma.XOR<Prisma.JournalEntryCreateWithoutSalesInvoiceInput, Prisma.JournalEntryUncheckedCreateWithoutSalesInvoiceInput>;
    where?: Prisma.JournalEntryWhereInput;
};
export type JournalEntryUpdateToOneWithWhereWithoutSalesInvoiceInput = {
    where?: Prisma.JournalEntryWhereInput;
    data: Prisma.XOR<Prisma.JournalEntryUpdateWithoutSalesInvoiceInput, Prisma.JournalEntryUncheckedUpdateWithoutSalesInvoiceInput>;
};
export type JournalEntryUpdateWithoutSalesInvoiceInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    reference?: Prisma.StringFieldUpdateOperationsInput | string;
    date?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    status?: Prisma.EnumJournalEntryStatusFieldUpdateOperationsInput | $Enums.JournalEntryStatus;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    branch?: Prisma.BranchUpdateOneWithoutJournalEntriesNestedInput;
    lines?: Prisma.JournalEntryLineUpdateManyWithoutJournalEntryNestedInput;
};
export type JournalEntryUncheckedUpdateWithoutSalesInvoiceInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    reference?: Prisma.StringFieldUpdateOperationsInput | string;
    date?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    status?: Prisma.EnumJournalEntryStatusFieldUpdateOperationsInput | $Enums.JournalEntryStatus;
    branchId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    lines?: Prisma.JournalEntryLineUncheckedUpdateManyWithoutJournalEntryNestedInput;
};
export type JournalEntryCreateManyBranchInput = {
    id?: string;
    reference: string;
    date?: Date | string;
    description?: string | null;
    status?: $Enums.JournalEntryStatus;
    salesInvoiceId?: string | null;
    createdAt?: Date | string;
};
export type JournalEntryUpdateWithoutBranchInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    reference?: Prisma.StringFieldUpdateOperationsInput | string;
    date?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    status?: Prisma.EnumJournalEntryStatusFieldUpdateOperationsInput | $Enums.JournalEntryStatus;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    salesInvoice?: Prisma.SalesInvoiceUpdateOneWithoutJournalEntryNestedInput;
    lines?: Prisma.JournalEntryLineUpdateManyWithoutJournalEntryNestedInput;
};
export type JournalEntryUncheckedUpdateWithoutBranchInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    reference?: Prisma.StringFieldUpdateOperationsInput | string;
    date?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    status?: Prisma.EnumJournalEntryStatusFieldUpdateOperationsInput | $Enums.JournalEntryStatus;
    salesInvoiceId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    lines?: Prisma.JournalEntryLineUncheckedUpdateManyWithoutJournalEntryNestedInput;
};
export type JournalEntryUncheckedUpdateManyWithoutBranchInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    reference?: Prisma.StringFieldUpdateOperationsInput | string;
    date?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    status?: Prisma.EnumJournalEntryStatusFieldUpdateOperationsInput | $Enums.JournalEntryStatus;
    salesInvoiceId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type JournalEntryCountOutputType = {
    lines: number;
};
export type JournalEntryCountOutputTypeSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    lines?: boolean | JournalEntryCountOutputTypeCountLinesArgs;
};
export type JournalEntryCountOutputTypeDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.JournalEntryCountOutputTypeSelect<ExtArgs> | null;
};
export type JournalEntryCountOutputTypeCountLinesArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.JournalEntryLineWhereInput;
};
export type JournalEntrySelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    reference?: boolean;
    date?: boolean;
    description?: boolean;
    status?: boolean;
    branchId?: boolean;
    salesInvoiceId?: boolean;
    createdAt?: boolean;
    branch?: boolean | Prisma.JournalEntry$branchArgs<ExtArgs>;
    salesInvoice?: boolean | Prisma.JournalEntry$salesInvoiceArgs<ExtArgs>;
    lines?: boolean | Prisma.JournalEntry$linesArgs<ExtArgs>;
    _count?: boolean | Prisma.JournalEntryCountOutputTypeDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["journalEntry"]>;
export type JournalEntrySelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    reference?: boolean;
    date?: boolean;
    description?: boolean;
    status?: boolean;
    branchId?: boolean;
    salesInvoiceId?: boolean;
    createdAt?: boolean;
    branch?: boolean | Prisma.JournalEntry$branchArgs<ExtArgs>;
    salesInvoice?: boolean | Prisma.JournalEntry$salesInvoiceArgs<ExtArgs>;
}, ExtArgs["result"]["journalEntry"]>;
export type JournalEntrySelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    reference?: boolean;
    date?: boolean;
    description?: boolean;
    status?: boolean;
    branchId?: boolean;
    salesInvoiceId?: boolean;
    createdAt?: boolean;
    branch?: boolean | Prisma.JournalEntry$branchArgs<ExtArgs>;
    salesInvoice?: boolean | Prisma.JournalEntry$salesInvoiceArgs<ExtArgs>;
}, ExtArgs["result"]["journalEntry"]>;
export type JournalEntrySelectScalar = {
    id?: boolean;
    reference?: boolean;
    date?: boolean;
    description?: boolean;
    status?: boolean;
    branchId?: boolean;
    salesInvoiceId?: boolean;
    createdAt?: boolean;
};
export type JournalEntryOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "reference" | "date" | "description" | "status" | "branchId" | "salesInvoiceId" | "createdAt", ExtArgs["result"]["journalEntry"]>;
export type JournalEntryInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    branch?: boolean | Prisma.JournalEntry$branchArgs<ExtArgs>;
    salesInvoice?: boolean | Prisma.JournalEntry$salesInvoiceArgs<ExtArgs>;
    lines?: boolean | Prisma.JournalEntry$linesArgs<ExtArgs>;
    _count?: boolean | Prisma.JournalEntryCountOutputTypeDefaultArgs<ExtArgs>;
};
export type JournalEntryIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    branch?: boolean | Prisma.JournalEntry$branchArgs<ExtArgs>;
    salesInvoice?: boolean | Prisma.JournalEntry$salesInvoiceArgs<ExtArgs>;
};
export type JournalEntryIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    branch?: boolean | Prisma.JournalEntry$branchArgs<ExtArgs>;
    salesInvoice?: boolean | Prisma.JournalEntry$salesInvoiceArgs<ExtArgs>;
};
export type $JournalEntryPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "JournalEntry";
    objects: {
        branch: Prisma.$BranchPayload<ExtArgs> | null;
        salesInvoice: Prisma.$SalesInvoicePayload<ExtArgs> | null;
        lines: Prisma.$JournalEntryLinePayload<ExtArgs>[];
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        reference: string;
        date: Date;
        description: string | null;
        status: $Enums.JournalEntryStatus;
        branchId: string | null;
        salesInvoiceId: string | null;
        createdAt: Date;
    }, ExtArgs["result"]["journalEntry"]>;
    composites: {};
};
export type JournalEntryGetPayload<S extends boolean | null | undefined | JournalEntryDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$JournalEntryPayload, S>;
export type JournalEntryCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<JournalEntryFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: JournalEntryCountAggregateInputType | true;
};
export interface JournalEntryDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['JournalEntry'];
        meta: {
            name: 'JournalEntry';
        };
    };
    findUnique<T extends JournalEntryFindUniqueArgs>(args: Prisma.SelectSubset<T, JournalEntryFindUniqueArgs<ExtArgs>>): Prisma.Prisma__JournalEntryClient<runtime.Types.Result.GetResult<Prisma.$JournalEntryPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends JournalEntryFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, JournalEntryFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__JournalEntryClient<runtime.Types.Result.GetResult<Prisma.$JournalEntryPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends JournalEntryFindFirstArgs>(args?: Prisma.SelectSubset<T, JournalEntryFindFirstArgs<ExtArgs>>): Prisma.Prisma__JournalEntryClient<runtime.Types.Result.GetResult<Prisma.$JournalEntryPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends JournalEntryFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, JournalEntryFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__JournalEntryClient<runtime.Types.Result.GetResult<Prisma.$JournalEntryPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends JournalEntryFindManyArgs>(args?: Prisma.SelectSubset<T, JournalEntryFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$JournalEntryPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends JournalEntryCreateArgs>(args: Prisma.SelectSubset<T, JournalEntryCreateArgs<ExtArgs>>): Prisma.Prisma__JournalEntryClient<runtime.Types.Result.GetResult<Prisma.$JournalEntryPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends JournalEntryCreateManyArgs>(args?: Prisma.SelectSubset<T, JournalEntryCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends JournalEntryCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, JournalEntryCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$JournalEntryPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends JournalEntryDeleteArgs>(args: Prisma.SelectSubset<T, JournalEntryDeleteArgs<ExtArgs>>): Prisma.Prisma__JournalEntryClient<runtime.Types.Result.GetResult<Prisma.$JournalEntryPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends JournalEntryUpdateArgs>(args: Prisma.SelectSubset<T, JournalEntryUpdateArgs<ExtArgs>>): Prisma.Prisma__JournalEntryClient<runtime.Types.Result.GetResult<Prisma.$JournalEntryPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends JournalEntryDeleteManyArgs>(args?: Prisma.SelectSubset<T, JournalEntryDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends JournalEntryUpdateManyArgs>(args: Prisma.SelectSubset<T, JournalEntryUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends JournalEntryUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, JournalEntryUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$JournalEntryPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends JournalEntryUpsertArgs>(args: Prisma.SelectSubset<T, JournalEntryUpsertArgs<ExtArgs>>): Prisma.Prisma__JournalEntryClient<runtime.Types.Result.GetResult<Prisma.$JournalEntryPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends JournalEntryCountArgs>(args?: Prisma.Subset<T, JournalEntryCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], JournalEntryCountAggregateOutputType> : number>;
    aggregate<T extends JournalEntryAggregateArgs>(args: Prisma.Subset<T, JournalEntryAggregateArgs>): Prisma.PrismaPromise<GetJournalEntryAggregateType<T>>;
    groupBy<T extends JournalEntryGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: JournalEntryGroupByArgs['orderBy'];
    } : {
        orderBy?: JournalEntryGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, JournalEntryGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetJournalEntryGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: JournalEntryFieldRefs;
}
export interface Prisma__JournalEntryClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    branch<T extends Prisma.JournalEntry$branchArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.JournalEntry$branchArgs<ExtArgs>>): Prisma.Prisma__BranchClient<runtime.Types.Result.GetResult<Prisma.$BranchPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    salesInvoice<T extends Prisma.JournalEntry$salesInvoiceArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.JournalEntry$salesInvoiceArgs<ExtArgs>>): Prisma.Prisma__SalesInvoiceClient<runtime.Types.Result.GetResult<Prisma.$SalesInvoicePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    lines<T extends Prisma.JournalEntry$linesArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.JournalEntry$linesArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$JournalEntryLinePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface JournalEntryFieldRefs {
    readonly id: Prisma.FieldRef<"JournalEntry", 'String'>;
    readonly reference: Prisma.FieldRef<"JournalEntry", 'String'>;
    readonly date: Prisma.FieldRef<"JournalEntry", 'DateTime'>;
    readonly description: Prisma.FieldRef<"JournalEntry", 'String'>;
    readonly status: Prisma.FieldRef<"JournalEntry", 'JournalEntryStatus'>;
    readonly branchId: Prisma.FieldRef<"JournalEntry", 'String'>;
    readonly salesInvoiceId: Prisma.FieldRef<"JournalEntry", 'String'>;
    readonly createdAt: Prisma.FieldRef<"JournalEntry", 'DateTime'>;
}
export type JournalEntryFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.JournalEntrySelect<ExtArgs> | null;
    omit?: Prisma.JournalEntryOmit<ExtArgs> | null;
    include?: Prisma.JournalEntryInclude<ExtArgs> | null;
    where: Prisma.JournalEntryWhereUniqueInput;
};
export type JournalEntryFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.JournalEntrySelect<ExtArgs> | null;
    omit?: Prisma.JournalEntryOmit<ExtArgs> | null;
    include?: Prisma.JournalEntryInclude<ExtArgs> | null;
    where: Prisma.JournalEntryWhereUniqueInput;
};
export type JournalEntryFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type JournalEntryFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type JournalEntryFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type JournalEntryCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.JournalEntrySelect<ExtArgs> | null;
    omit?: Prisma.JournalEntryOmit<ExtArgs> | null;
    include?: Prisma.JournalEntryInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.JournalEntryCreateInput, Prisma.JournalEntryUncheckedCreateInput>;
};
export type JournalEntryCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.JournalEntryCreateManyInput | Prisma.JournalEntryCreateManyInput[];
    skipDuplicates?: boolean;
};
export type JournalEntryCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.JournalEntrySelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.JournalEntryOmit<ExtArgs> | null;
    data: Prisma.JournalEntryCreateManyInput | Prisma.JournalEntryCreateManyInput[];
    skipDuplicates?: boolean;
    include?: Prisma.JournalEntryIncludeCreateManyAndReturn<ExtArgs> | null;
};
export type JournalEntryUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.JournalEntrySelect<ExtArgs> | null;
    omit?: Prisma.JournalEntryOmit<ExtArgs> | null;
    include?: Prisma.JournalEntryInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.JournalEntryUpdateInput, Prisma.JournalEntryUncheckedUpdateInput>;
    where: Prisma.JournalEntryWhereUniqueInput;
};
export type JournalEntryUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.JournalEntryUpdateManyMutationInput, Prisma.JournalEntryUncheckedUpdateManyInput>;
    where?: Prisma.JournalEntryWhereInput;
    limit?: number;
};
export type JournalEntryUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.JournalEntrySelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.JournalEntryOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.JournalEntryUpdateManyMutationInput, Prisma.JournalEntryUncheckedUpdateManyInput>;
    where?: Prisma.JournalEntryWhereInput;
    limit?: number;
    include?: Prisma.JournalEntryIncludeUpdateManyAndReturn<ExtArgs> | null;
};
export type JournalEntryUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.JournalEntrySelect<ExtArgs> | null;
    omit?: Prisma.JournalEntryOmit<ExtArgs> | null;
    include?: Prisma.JournalEntryInclude<ExtArgs> | null;
    where: Prisma.JournalEntryWhereUniqueInput;
    create: Prisma.XOR<Prisma.JournalEntryCreateInput, Prisma.JournalEntryUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.JournalEntryUpdateInput, Prisma.JournalEntryUncheckedUpdateInput>;
};
export type JournalEntryDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.JournalEntrySelect<ExtArgs> | null;
    omit?: Prisma.JournalEntryOmit<ExtArgs> | null;
    include?: Prisma.JournalEntryInclude<ExtArgs> | null;
    where: Prisma.JournalEntryWhereUniqueInput;
};
export type JournalEntryDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.JournalEntryWhereInput;
    limit?: number;
};
export type JournalEntry$branchArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.BranchSelect<ExtArgs> | null;
    omit?: Prisma.BranchOmit<ExtArgs> | null;
    include?: Prisma.BranchInclude<ExtArgs> | null;
    where?: Prisma.BranchWhereInput;
};
export type JournalEntry$salesInvoiceArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.SalesInvoiceSelect<ExtArgs> | null;
    omit?: Prisma.SalesInvoiceOmit<ExtArgs> | null;
    include?: Prisma.SalesInvoiceInclude<ExtArgs> | null;
    where?: Prisma.SalesInvoiceWhereInput;
};
export type JournalEntry$linesArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.JournalEntryLineSelect<ExtArgs> | null;
    omit?: Prisma.JournalEntryLineOmit<ExtArgs> | null;
    include?: Prisma.JournalEntryLineInclude<ExtArgs> | null;
    where?: Prisma.JournalEntryLineWhereInput;
    orderBy?: Prisma.JournalEntryLineOrderByWithRelationInput | Prisma.JournalEntryLineOrderByWithRelationInput[];
    cursor?: Prisma.JournalEntryLineWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.JournalEntryLineScalarFieldEnum | Prisma.JournalEntryLineScalarFieldEnum[];
};
export type JournalEntryDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.JournalEntrySelect<ExtArgs> | null;
    omit?: Prisma.JournalEntryOmit<ExtArgs> | null;
    include?: Prisma.JournalEntryInclude<ExtArgs> | null;
};
