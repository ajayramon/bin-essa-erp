import type * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "../internal/prismaNamespace.js";
export type SalesInvoiceLineModel = runtime.Types.Result.DefaultSelection<Prisma.$SalesInvoiceLinePayload>;
export type AggregateSalesInvoiceLine = {
    _count: SalesInvoiceLineCountAggregateOutputType | null;
    _avg: SalesInvoiceLineAvgAggregateOutputType | null;
    _sum: SalesInvoiceLineSumAggregateOutputType | null;
    _min: SalesInvoiceLineMinAggregateOutputType | null;
    _max: SalesInvoiceLineMaxAggregateOutputType | null;
};
export type SalesInvoiceLineAvgAggregateOutputType = {
    quantity: runtime.Decimal | null;
    unitPrice: runtime.Decimal | null;
    lineTotal: runtime.Decimal | null;
};
export type SalesInvoiceLineSumAggregateOutputType = {
    quantity: runtime.Decimal | null;
    unitPrice: runtime.Decimal | null;
    lineTotal: runtime.Decimal | null;
};
export type SalesInvoiceLineMinAggregateOutputType = {
    id: string | null;
    salesInvoiceId: string | null;
    itemId: string | null;
    quantity: runtime.Decimal | null;
    unitPrice: runtime.Decimal | null;
    lineTotal: runtime.Decimal | null;
};
export type SalesInvoiceLineMaxAggregateOutputType = {
    id: string | null;
    salesInvoiceId: string | null;
    itemId: string | null;
    quantity: runtime.Decimal | null;
    unitPrice: runtime.Decimal | null;
    lineTotal: runtime.Decimal | null;
};
export type SalesInvoiceLineCountAggregateOutputType = {
    id: number;
    salesInvoiceId: number;
    itemId: number;
    quantity: number;
    unitPrice: number;
    lineTotal: number;
    _all: number;
};
export type SalesInvoiceLineAvgAggregateInputType = {
    quantity?: true;
    unitPrice?: true;
    lineTotal?: true;
};
export type SalesInvoiceLineSumAggregateInputType = {
    quantity?: true;
    unitPrice?: true;
    lineTotal?: true;
};
export type SalesInvoiceLineMinAggregateInputType = {
    id?: true;
    salesInvoiceId?: true;
    itemId?: true;
    quantity?: true;
    unitPrice?: true;
    lineTotal?: true;
};
export type SalesInvoiceLineMaxAggregateInputType = {
    id?: true;
    salesInvoiceId?: true;
    itemId?: true;
    quantity?: true;
    unitPrice?: true;
    lineTotal?: true;
};
export type SalesInvoiceLineCountAggregateInputType = {
    id?: true;
    salesInvoiceId?: true;
    itemId?: true;
    quantity?: true;
    unitPrice?: true;
    lineTotal?: true;
    _all?: true;
};
export type SalesInvoiceLineAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.SalesInvoiceLineWhereInput;
    orderBy?: Prisma.SalesInvoiceLineOrderByWithRelationInput | Prisma.SalesInvoiceLineOrderByWithRelationInput[];
    cursor?: Prisma.SalesInvoiceLineWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | SalesInvoiceLineCountAggregateInputType;
    _avg?: SalesInvoiceLineAvgAggregateInputType;
    _sum?: SalesInvoiceLineSumAggregateInputType;
    _min?: SalesInvoiceLineMinAggregateInputType;
    _max?: SalesInvoiceLineMaxAggregateInputType;
};
export type GetSalesInvoiceLineAggregateType<T extends SalesInvoiceLineAggregateArgs> = {
    [P in keyof T & keyof AggregateSalesInvoiceLine]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateSalesInvoiceLine[P]> : Prisma.GetScalarType<T[P], AggregateSalesInvoiceLine[P]>;
};
export type SalesInvoiceLineGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.SalesInvoiceLineWhereInput;
    orderBy?: Prisma.SalesInvoiceLineOrderByWithAggregationInput | Prisma.SalesInvoiceLineOrderByWithAggregationInput[];
    by: Prisma.SalesInvoiceLineScalarFieldEnum[] | Prisma.SalesInvoiceLineScalarFieldEnum;
    having?: Prisma.SalesInvoiceLineScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: SalesInvoiceLineCountAggregateInputType | true;
    _avg?: SalesInvoiceLineAvgAggregateInputType;
    _sum?: SalesInvoiceLineSumAggregateInputType;
    _min?: SalesInvoiceLineMinAggregateInputType;
    _max?: SalesInvoiceLineMaxAggregateInputType;
};
export type SalesInvoiceLineGroupByOutputType = {
    id: string;
    salesInvoiceId: string;
    itemId: string;
    quantity: runtime.Decimal;
    unitPrice: runtime.Decimal;
    lineTotal: runtime.Decimal;
    _count: SalesInvoiceLineCountAggregateOutputType | null;
    _avg: SalesInvoiceLineAvgAggregateOutputType | null;
    _sum: SalesInvoiceLineSumAggregateOutputType | null;
    _min: SalesInvoiceLineMinAggregateOutputType | null;
    _max: SalesInvoiceLineMaxAggregateOutputType | null;
};
export type GetSalesInvoiceLineGroupByPayload<T extends SalesInvoiceLineGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<SalesInvoiceLineGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof SalesInvoiceLineGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], SalesInvoiceLineGroupByOutputType[P]> : Prisma.GetScalarType<T[P], SalesInvoiceLineGroupByOutputType[P]>;
}>>;
export type SalesInvoiceLineWhereInput = {
    AND?: Prisma.SalesInvoiceLineWhereInput | Prisma.SalesInvoiceLineWhereInput[];
    OR?: Prisma.SalesInvoiceLineWhereInput[];
    NOT?: Prisma.SalesInvoiceLineWhereInput | Prisma.SalesInvoiceLineWhereInput[];
    id?: Prisma.StringFilter<"SalesInvoiceLine"> | string;
    salesInvoiceId?: Prisma.StringFilter<"SalesInvoiceLine"> | string;
    itemId?: Prisma.StringFilter<"SalesInvoiceLine"> | string;
    quantity?: Prisma.DecimalFilter<"SalesInvoiceLine"> | runtime.Decimal | runtime.DecimalJsLike | number | string;
    unitPrice?: Prisma.DecimalFilter<"SalesInvoiceLine"> | runtime.Decimal | runtime.DecimalJsLike | number | string;
    lineTotal?: Prisma.DecimalFilter<"SalesInvoiceLine"> | runtime.Decimal | runtime.DecimalJsLike | number | string;
    salesInvoice?: Prisma.XOR<Prisma.SalesInvoiceScalarRelationFilter, Prisma.SalesInvoiceWhereInput>;
    item?: Prisma.XOR<Prisma.ItemScalarRelationFilter, Prisma.ItemWhereInput>;
};
export type SalesInvoiceLineOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    salesInvoiceId?: Prisma.SortOrder;
    itemId?: Prisma.SortOrder;
    quantity?: Prisma.SortOrder;
    unitPrice?: Prisma.SortOrder;
    lineTotal?: Prisma.SortOrder;
    salesInvoice?: Prisma.SalesInvoiceOrderByWithRelationInput;
    item?: Prisma.ItemOrderByWithRelationInput;
};
export type SalesInvoiceLineWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    AND?: Prisma.SalesInvoiceLineWhereInput | Prisma.SalesInvoiceLineWhereInput[];
    OR?: Prisma.SalesInvoiceLineWhereInput[];
    NOT?: Prisma.SalesInvoiceLineWhereInput | Prisma.SalesInvoiceLineWhereInput[];
    salesInvoiceId?: Prisma.StringFilter<"SalesInvoiceLine"> | string;
    itemId?: Prisma.StringFilter<"SalesInvoiceLine"> | string;
    quantity?: Prisma.DecimalFilter<"SalesInvoiceLine"> | runtime.Decimal | runtime.DecimalJsLike | number | string;
    unitPrice?: Prisma.DecimalFilter<"SalesInvoiceLine"> | runtime.Decimal | runtime.DecimalJsLike | number | string;
    lineTotal?: Prisma.DecimalFilter<"SalesInvoiceLine"> | runtime.Decimal | runtime.DecimalJsLike | number | string;
    salesInvoice?: Prisma.XOR<Prisma.SalesInvoiceScalarRelationFilter, Prisma.SalesInvoiceWhereInput>;
    item?: Prisma.XOR<Prisma.ItemScalarRelationFilter, Prisma.ItemWhereInput>;
}, "id">;
export type SalesInvoiceLineOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    salesInvoiceId?: Prisma.SortOrder;
    itemId?: Prisma.SortOrder;
    quantity?: Prisma.SortOrder;
    unitPrice?: Prisma.SortOrder;
    lineTotal?: Prisma.SortOrder;
    _count?: Prisma.SalesInvoiceLineCountOrderByAggregateInput;
    _avg?: Prisma.SalesInvoiceLineAvgOrderByAggregateInput;
    _max?: Prisma.SalesInvoiceLineMaxOrderByAggregateInput;
    _min?: Prisma.SalesInvoiceLineMinOrderByAggregateInput;
    _sum?: Prisma.SalesInvoiceLineSumOrderByAggregateInput;
};
export type SalesInvoiceLineScalarWhereWithAggregatesInput = {
    AND?: Prisma.SalesInvoiceLineScalarWhereWithAggregatesInput | Prisma.SalesInvoiceLineScalarWhereWithAggregatesInput[];
    OR?: Prisma.SalesInvoiceLineScalarWhereWithAggregatesInput[];
    NOT?: Prisma.SalesInvoiceLineScalarWhereWithAggregatesInput | Prisma.SalesInvoiceLineScalarWhereWithAggregatesInput[];
    id?: Prisma.StringWithAggregatesFilter<"SalesInvoiceLine"> | string;
    salesInvoiceId?: Prisma.StringWithAggregatesFilter<"SalesInvoiceLine"> | string;
    itemId?: Prisma.StringWithAggregatesFilter<"SalesInvoiceLine"> | string;
    quantity?: Prisma.DecimalWithAggregatesFilter<"SalesInvoiceLine"> | runtime.Decimal | runtime.DecimalJsLike | number | string;
    unitPrice?: Prisma.DecimalWithAggregatesFilter<"SalesInvoiceLine"> | runtime.Decimal | runtime.DecimalJsLike | number | string;
    lineTotal?: Prisma.DecimalWithAggregatesFilter<"SalesInvoiceLine"> | runtime.Decimal | runtime.DecimalJsLike | number | string;
};
export type SalesInvoiceLineCreateInput = {
    id?: string;
    quantity: runtime.Decimal | runtime.DecimalJsLike | number | string;
    unitPrice: runtime.Decimal | runtime.DecimalJsLike | number | string;
    lineTotal: runtime.Decimal | runtime.DecimalJsLike | number | string;
    salesInvoice: Prisma.SalesInvoiceCreateNestedOneWithoutLinesInput;
    item: Prisma.ItemCreateNestedOneWithoutSalesInvoiceLinesInput;
};
export type SalesInvoiceLineUncheckedCreateInput = {
    id?: string;
    salesInvoiceId: string;
    itemId: string;
    quantity: runtime.Decimal | runtime.DecimalJsLike | number | string;
    unitPrice: runtime.Decimal | runtime.DecimalJsLike | number | string;
    lineTotal: runtime.Decimal | runtime.DecimalJsLike | number | string;
};
export type SalesInvoiceLineUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    quantity?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    unitPrice?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    lineTotal?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    salesInvoice?: Prisma.SalesInvoiceUpdateOneRequiredWithoutLinesNestedInput;
    item?: Prisma.ItemUpdateOneRequiredWithoutSalesInvoiceLinesNestedInput;
};
export type SalesInvoiceLineUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    salesInvoiceId?: Prisma.StringFieldUpdateOperationsInput | string;
    itemId?: Prisma.StringFieldUpdateOperationsInput | string;
    quantity?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    unitPrice?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    lineTotal?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
};
export type SalesInvoiceLineCreateManyInput = {
    id?: string;
    salesInvoiceId: string;
    itemId: string;
    quantity: runtime.Decimal | runtime.DecimalJsLike | number | string;
    unitPrice: runtime.Decimal | runtime.DecimalJsLike | number | string;
    lineTotal: runtime.Decimal | runtime.DecimalJsLike | number | string;
};
export type SalesInvoiceLineUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    quantity?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    unitPrice?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    lineTotal?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
};
export type SalesInvoiceLineUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    salesInvoiceId?: Prisma.StringFieldUpdateOperationsInput | string;
    itemId?: Prisma.StringFieldUpdateOperationsInput | string;
    quantity?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    unitPrice?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    lineTotal?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
};
export type SalesInvoiceLineListRelationFilter = {
    every?: Prisma.SalesInvoiceLineWhereInput;
    some?: Prisma.SalesInvoiceLineWhereInput;
    none?: Prisma.SalesInvoiceLineWhereInput;
};
export type SalesInvoiceLineOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type SalesInvoiceLineCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    salesInvoiceId?: Prisma.SortOrder;
    itemId?: Prisma.SortOrder;
    quantity?: Prisma.SortOrder;
    unitPrice?: Prisma.SortOrder;
    lineTotal?: Prisma.SortOrder;
};
export type SalesInvoiceLineAvgOrderByAggregateInput = {
    quantity?: Prisma.SortOrder;
    unitPrice?: Prisma.SortOrder;
    lineTotal?: Prisma.SortOrder;
};
export type SalesInvoiceLineMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    salesInvoiceId?: Prisma.SortOrder;
    itemId?: Prisma.SortOrder;
    quantity?: Prisma.SortOrder;
    unitPrice?: Prisma.SortOrder;
    lineTotal?: Prisma.SortOrder;
};
export type SalesInvoiceLineMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    salesInvoiceId?: Prisma.SortOrder;
    itemId?: Prisma.SortOrder;
    quantity?: Prisma.SortOrder;
    unitPrice?: Prisma.SortOrder;
    lineTotal?: Prisma.SortOrder;
};
export type SalesInvoiceLineSumOrderByAggregateInput = {
    quantity?: Prisma.SortOrder;
    unitPrice?: Prisma.SortOrder;
    lineTotal?: Prisma.SortOrder;
};
export type SalesInvoiceLineCreateNestedManyWithoutItemInput = {
    create?: Prisma.XOR<Prisma.SalesInvoiceLineCreateWithoutItemInput, Prisma.SalesInvoiceLineUncheckedCreateWithoutItemInput> | Prisma.SalesInvoiceLineCreateWithoutItemInput[] | Prisma.SalesInvoiceLineUncheckedCreateWithoutItemInput[];
    connectOrCreate?: Prisma.SalesInvoiceLineCreateOrConnectWithoutItemInput | Prisma.SalesInvoiceLineCreateOrConnectWithoutItemInput[];
    createMany?: Prisma.SalesInvoiceLineCreateManyItemInputEnvelope;
    connect?: Prisma.SalesInvoiceLineWhereUniqueInput | Prisma.SalesInvoiceLineWhereUniqueInput[];
};
export type SalesInvoiceLineUncheckedCreateNestedManyWithoutItemInput = {
    create?: Prisma.XOR<Prisma.SalesInvoiceLineCreateWithoutItemInput, Prisma.SalesInvoiceLineUncheckedCreateWithoutItemInput> | Prisma.SalesInvoiceLineCreateWithoutItemInput[] | Prisma.SalesInvoiceLineUncheckedCreateWithoutItemInput[];
    connectOrCreate?: Prisma.SalesInvoiceLineCreateOrConnectWithoutItemInput | Prisma.SalesInvoiceLineCreateOrConnectWithoutItemInput[];
    createMany?: Prisma.SalesInvoiceLineCreateManyItemInputEnvelope;
    connect?: Prisma.SalesInvoiceLineWhereUniqueInput | Prisma.SalesInvoiceLineWhereUniqueInput[];
};
export type SalesInvoiceLineUpdateManyWithoutItemNestedInput = {
    create?: Prisma.XOR<Prisma.SalesInvoiceLineCreateWithoutItemInput, Prisma.SalesInvoiceLineUncheckedCreateWithoutItemInput> | Prisma.SalesInvoiceLineCreateWithoutItemInput[] | Prisma.SalesInvoiceLineUncheckedCreateWithoutItemInput[];
    connectOrCreate?: Prisma.SalesInvoiceLineCreateOrConnectWithoutItemInput | Prisma.SalesInvoiceLineCreateOrConnectWithoutItemInput[];
    upsert?: Prisma.SalesInvoiceLineUpsertWithWhereUniqueWithoutItemInput | Prisma.SalesInvoiceLineUpsertWithWhereUniqueWithoutItemInput[];
    createMany?: Prisma.SalesInvoiceLineCreateManyItemInputEnvelope;
    set?: Prisma.SalesInvoiceLineWhereUniqueInput | Prisma.SalesInvoiceLineWhereUniqueInput[];
    disconnect?: Prisma.SalesInvoiceLineWhereUniqueInput | Prisma.SalesInvoiceLineWhereUniqueInput[];
    delete?: Prisma.SalesInvoiceLineWhereUniqueInput | Prisma.SalesInvoiceLineWhereUniqueInput[];
    connect?: Prisma.SalesInvoiceLineWhereUniqueInput | Prisma.SalesInvoiceLineWhereUniqueInput[];
    update?: Prisma.SalesInvoiceLineUpdateWithWhereUniqueWithoutItemInput | Prisma.SalesInvoiceLineUpdateWithWhereUniqueWithoutItemInput[];
    updateMany?: Prisma.SalesInvoiceLineUpdateManyWithWhereWithoutItemInput | Prisma.SalesInvoiceLineUpdateManyWithWhereWithoutItemInput[];
    deleteMany?: Prisma.SalesInvoiceLineScalarWhereInput | Prisma.SalesInvoiceLineScalarWhereInput[];
};
export type SalesInvoiceLineUncheckedUpdateManyWithoutItemNestedInput = {
    create?: Prisma.XOR<Prisma.SalesInvoiceLineCreateWithoutItemInput, Prisma.SalesInvoiceLineUncheckedCreateWithoutItemInput> | Prisma.SalesInvoiceLineCreateWithoutItemInput[] | Prisma.SalesInvoiceLineUncheckedCreateWithoutItemInput[];
    connectOrCreate?: Prisma.SalesInvoiceLineCreateOrConnectWithoutItemInput | Prisma.SalesInvoiceLineCreateOrConnectWithoutItemInput[];
    upsert?: Prisma.SalesInvoiceLineUpsertWithWhereUniqueWithoutItemInput | Prisma.SalesInvoiceLineUpsertWithWhereUniqueWithoutItemInput[];
    createMany?: Prisma.SalesInvoiceLineCreateManyItemInputEnvelope;
    set?: Prisma.SalesInvoiceLineWhereUniqueInput | Prisma.SalesInvoiceLineWhereUniqueInput[];
    disconnect?: Prisma.SalesInvoiceLineWhereUniqueInput | Prisma.SalesInvoiceLineWhereUniqueInput[];
    delete?: Prisma.SalesInvoiceLineWhereUniqueInput | Prisma.SalesInvoiceLineWhereUniqueInput[];
    connect?: Prisma.SalesInvoiceLineWhereUniqueInput | Prisma.SalesInvoiceLineWhereUniqueInput[];
    update?: Prisma.SalesInvoiceLineUpdateWithWhereUniqueWithoutItemInput | Prisma.SalesInvoiceLineUpdateWithWhereUniqueWithoutItemInput[];
    updateMany?: Prisma.SalesInvoiceLineUpdateManyWithWhereWithoutItemInput | Prisma.SalesInvoiceLineUpdateManyWithWhereWithoutItemInput[];
    deleteMany?: Prisma.SalesInvoiceLineScalarWhereInput | Prisma.SalesInvoiceLineScalarWhereInput[];
};
export type SalesInvoiceLineCreateNestedManyWithoutSalesInvoiceInput = {
    create?: Prisma.XOR<Prisma.SalesInvoiceLineCreateWithoutSalesInvoiceInput, Prisma.SalesInvoiceLineUncheckedCreateWithoutSalesInvoiceInput> | Prisma.SalesInvoiceLineCreateWithoutSalesInvoiceInput[] | Prisma.SalesInvoiceLineUncheckedCreateWithoutSalesInvoiceInput[];
    connectOrCreate?: Prisma.SalesInvoiceLineCreateOrConnectWithoutSalesInvoiceInput | Prisma.SalesInvoiceLineCreateOrConnectWithoutSalesInvoiceInput[];
    createMany?: Prisma.SalesInvoiceLineCreateManySalesInvoiceInputEnvelope;
    connect?: Prisma.SalesInvoiceLineWhereUniqueInput | Prisma.SalesInvoiceLineWhereUniqueInput[];
};
export type SalesInvoiceLineUncheckedCreateNestedManyWithoutSalesInvoiceInput = {
    create?: Prisma.XOR<Prisma.SalesInvoiceLineCreateWithoutSalesInvoiceInput, Prisma.SalesInvoiceLineUncheckedCreateWithoutSalesInvoiceInput> | Prisma.SalesInvoiceLineCreateWithoutSalesInvoiceInput[] | Prisma.SalesInvoiceLineUncheckedCreateWithoutSalesInvoiceInput[];
    connectOrCreate?: Prisma.SalesInvoiceLineCreateOrConnectWithoutSalesInvoiceInput | Prisma.SalesInvoiceLineCreateOrConnectWithoutSalesInvoiceInput[];
    createMany?: Prisma.SalesInvoiceLineCreateManySalesInvoiceInputEnvelope;
    connect?: Prisma.SalesInvoiceLineWhereUniqueInput | Prisma.SalesInvoiceLineWhereUniqueInput[];
};
export type SalesInvoiceLineUpdateManyWithoutSalesInvoiceNestedInput = {
    create?: Prisma.XOR<Prisma.SalesInvoiceLineCreateWithoutSalesInvoiceInput, Prisma.SalesInvoiceLineUncheckedCreateWithoutSalesInvoiceInput> | Prisma.SalesInvoiceLineCreateWithoutSalesInvoiceInput[] | Prisma.SalesInvoiceLineUncheckedCreateWithoutSalesInvoiceInput[];
    connectOrCreate?: Prisma.SalesInvoiceLineCreateOrConnectWithoutSalesInvoiceInput | Prisma.SalesInvoiceLineCreateOrConnectWithoutSalesInvoiceInput[];
    upsert?: Prisma.SalesInvoiceLineUpsertWithWhereUniqueWithoutSalesInvoiceInput | Prisma.SalesInvoiceLineUpsertWithWhereUniqueWithoutSalesInvoiceInput[];
    createMany?: Prisma.SalesInvoiceLineCreateManySalesInvoiceInputEnvelope;
    set?: Prisma.SalesInvoiceLineWhereUniqueInput | Prisma.SalesInvoiceLineWhereUniqueInput[];
    disconnect?: Prisma.SalesInvoiceLineWhereUniqueInput | Prisma.SalesInvoiceLineWhereUniqueInput[];
    delete?: Prisma.SalesInvoiceLineWhereUniqueInput | Prisma.SalesInvoiceLineWhereUniqueInput[];
    connect?: Prisma.SalesInvoiceLineWhereUniqueInput | Prisma.SalesInvoiceLineWhereUniqueInput[];
    update?: Prisma.SalesInvoiceLineUpdateWithWhereUniqueWithoutSalesInvoiceInput | Prisma.SalesInvoiceLineUpdateWithWhereUniqueWithoutSalesInvoiceInput[];
    updateMany?: Prisma.SalesInvoiceLineUpdateManyWithWhereWithoutSalesInvoiceInput | Prisma.SalesInvoiceLineUpdateManyWithWhereWithoutSalesInvoiceInput[];
    deleteMany?: Prisma.SalesInvoiceLineScalarWhereInput | Prisma.SalesInvoiceLineScalarWhereInput[];
};
export type SalesInvoiceLineUncheckedUpdateManyWithoutSalesInvoiceNestedInput = {
    create?: Prisma.XOR<Prisma.SalesInvoiceLineCreateWithoutSalesInvoiceInput, Prisma.SalesInvoiceLineUncheckedCreateWithoutSalesInvoiceInput> | Prisma.SalesInvoiceLineCreateWithoutSalesInvoiceInput[] | Prisma.SalesInvoiceLineUncheckedCreateWithoutSalesInvoiceInput[];
    connectOrCreate?: Prisma.SalesInvoiceLineCreateOrConnectWithoutSalesInvoiceInput | Prisma.SalesInvoiceLineCreateOrConnectWithoutSalesInvoiceInput[];
    upsert?: Prisma.SalesInvoiceLineUpsertWithWhereUniqueWithoutSalesInvoiceInput | Prisma.SalesInvoiceLineUpsertWithWhereUniqueWithoutSalesInvoiceInput[];
    createMany?: Prisma.SalesInvoiceLineCreateManySalesInvoiceInputEnvelope;
    set?: Prisma.SalesInvoiceLineWhereUniqueInput | Prisma.SalesInvoiceLineWhereUniqueInput[];
    disconnect?: Prisma.SalesInvoiceLineWhereUniqueInput | Prisma.SalesInvoiceLineWhereUniqueInput[];
    delete?: Prisma.SalesInvoiceLineWhereUniqueInput | Prisma.SalesInvoiceLineWhereUniqueInput[];
    connect?: Prisma.SalesInvoiceLineWhereUniqueInput | Prisma.SalesInvoiceLineWhereUniqueInput[];
    update?: Prisma.SalesInvoiceLineUpdateWithWhereUniqueWithoutSalesInvoiceInput | Prisma.SalesInvoiceLineUpdateWithWhereUniqueWithoutSalesInvoiceInput[];
    updateMany?: Prisma.SalesInvoiceLineUpdateManyWithWhereWithoutSalesInvoiceInput | Prisma.SalesInvoiceLineUpdateManyWithWhereWithoutSalesInvoiceInput[];
    deleteMany?: Prisma.SalesInvoiceLineScalarWhereInput | Prisma.SalesInvoiceLineScalarWhereInput[];
};
export type SalesInvoiceLineCreateWithoutItemInput = {
    id?: string;
    quantity: runtime.Decimal | runtime.DecimalJsLike | number | string;
    unitPrice: runtime.Decimal | runtime.DecimalJsLike | number | string;
    lineTotal: runtime.Decimal | runtime.DecimalJsLike | number | string;
    salesInvoice: Prisma.SalesInvoiceCreateNestedOneWithoutLinesInput;
};
export type SalesInvoiceLineUncheckedCreateWithoutItemInput = {
    id?: string;
    salesInvoiceId: string;
    quantity: runtime.Decimal | runtime.DecimalJsLike | number | string;
    unitPrice: runtime.Decimal | runtime.DecimalJsLike | number | string;
    lineTotal: runtime.Decimal | runtime.DecimalJsLike | number | string;
};
export type SalesInvoiceLineCreateOrConnectWithoutItemInput = {
    where: Prisma.SalesInvoiceLineWhereUniqueInput;
    create: Prisma.XOR<Prisma.SalesInvoiceLineCreateWithoutItemInput, Prisma.SalesInvoiceLineUncheckedCreateWithoutItemInput>;
};
export type SalesInvoiceLineCreateManyItemInputEnvelope = {
    data: Prisma.SalesInvoiceLineCreateManyItemInput | Prisma.SalesInvoiceLineCreateManyItemInput[];
    skipDuplicates?: boolean;
};
export type SalesInvoiceLineUpsertWithWhereUniqueWithoutItemInput = {
    where: Prisma.SalesInvoiceLineWhereUniqueInput;
    update: Prisma.XOR<Prisma.SalesInvoiceLineUpdateWithoutItemInput, Prisma.SalesInvoiceLineUncheckedUpdateWithoutItemInput>;
    create: Prisma.XOR<Prisma.SalesInvoiceLineCreateWithoutItemInput, Prisma.SalesInvoiceLineUncheckedCreateWithoutItemInput>;
};
export type SalesInvoiceLineUpdateWithWhereUniqueWithoutItemInput = {
    where: Prisma.SalesInvoiceLineWhereUniqueInput;
    data: Prisma.XOR<Prisma.SalesInvoiceLineUpdateWithoutItemInput, Prisma.SalesInvoiceLineUncheckedUpdateWithoutItemInput>;
};
export type SalesInvoiceLineUpdateManyWithWhereWithoutItemInput = {
    where: Prisma.SalesInvoiceLineScalarWhereInput;
    data: Prisma.XOR<Prisma.SalesInvoiceLineUpdateManyMutationInput, Prisma.SalesInvoiceLineUncheckedUpdateManyWithoutItemInput>;
};
export type SalesInvoiceLineScalarWhereInput = {
    AND?: Prisma.SalesInvoiceLineScalarWhereInput | Prisma.SalesInvoiceLineScalarWhereInput[];
    OR?: Prisma.SalesInvoiceLineScalarWhereInput[];
    NOT?: Prisma.SalesInvoiceLineScalarWhereInput | Prisma.SalesInvoiceLineScalarWhereInput[];
    id?: Prisma.StringFilter<"SalesInvoiceLine"> | string;
    salesInvoiceId?: Prisma.StringFilter<"SalesInvoiceLine"> | string;
    itemId?: Prisma.StringFilter<"SalesInvoiceLine"> | string;
    quantity?: Prisma.DecimalFilter<"SalesInvoiceLine"> | runtime.Decimal | runtime.DecimalJsLike | number | string;
    unitPrice?: Prisma.DecimalFilter<"SalesInvoiceLine"> | runtime.Decimal | runtime.DecimalJsLike | number | string;
    lineTotal?: Prisma.DecimalFilter<"SalesInvoiceLine"> | runtime.Decimal | runtime.DecimalJsLike | number | string;
};
export type SalesInvoiceLineCreateWithoutSalesInvoiceInput = {
    id?: string;
    quantity: runtime.Decimal | runtime.DecimalJsLike | number | string;
    unitPrice: runtime.Decimal | runtime.DecimalJsLike | number | string;
    lineTotal: runtime.Decimal | runtime.DecimalJsLike | number | string;
    item: Prisma.ItemCreateNestedOneWithoutSalesInvoiceLinesInput;
};
export type SalesInvoiceLineUncheckedCreateWithoutSalesInvoiceInput = {
    id?: string;
    itemId: string;
    quantity: runtime.Decimal | runtime.DecimalJsLike | number | string;
    unitPrice: runtime.Decimal | runtime.DecimalJsLike | number | string;
    lineTotal: runtime.Decimal | runtime.DecimalJsLike | number | string;
};
export type SalesInvoiceLineCreateOrConnectWithoutSalesInvoiceInput = {
    where: Prisma.SalesInvoiceLineWhereUniqueInput;
    create: Prisma.XOR<Prisma.SalesInvoiceLineCreateWithoutSalesInvoiceInput, Prisma.SalesInvoiceLineUncheckedCreateWithoutSalesInvoiceInput>;
};
export type SalesInvoiceLineCreateManySalesInvoiceInputEnvelope = {
    data: Prisma.SalesInvoiceLineCreateManySalesInvoiceInput | Prisma.SalesInvoiceLineCreateManySalesInvoiceInput[];
    skipDuplicates?: boolean;
};
export type SalesInvoiceLineUpsertWithWhereUniqueWithoutSalesInvoiceInput = {
    where: Prisma.SalesInvoiceLineWhereUniqueInput;
    update: Prisma.XOR<Prisma.SalesInvoiceLineUpdateWithoutSalesInvoiceInput, Prisma.SalesInvoiceLineUncheckedUpdateWithoutSalesInvoiceInput>;
    create: Prisma.XOR<Prisma.SalesInvoiceLineCreateWithoutSalesInvoiceInput, Prisma.SalesInvoiceLineUncheckedCreateWithoutSalesInvoiceInput>;
};
export type SalesInvoiceLineUpdateWithWhereUniqueWithoutSalesInvoiceInput = {
    where: Prisma.SalesInvoiceLineWhereUniqueInput;
    data: Prisma.XOR<Prisma.SalesInvoiceLineUpdateWithoutSalesInvoiceInput, Prisma.SalesInvoiceLineUncheckedUpdateWithoutSalesInvoiceInput>;
};
export type SalesInvoiceLineUpdateManyWithWhereWithoutSalesInvoiceInput = {
    where: Prisma.SalesInvoiceLineScalarWhereInput;
    data: Prisma.XOR<Prisma.SalesInvoiceLineUpdateManyMutationInput, Prisma.SalesInvoiceLineUncheckedUpdateManyWithoutSalesInvoiceInput>;
};
export type SalesInvoiceLineCreateManyItemInput = {
    id?: string;
    salesInvoiceId: string;
    quantity: runtime.Decimal | runtime.DecimalJsLike | number | string;
    unitPrice: runtime.Decimal | runtime.DecimalJsLike | number | string;
    lineTotal: runtime.Decimal | runtime.DecimalJsLike | number | string;
};
export type SalesInvoiceLineUpdateWithoutItemInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    quantity?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    unitPrice?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    lineTotal?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    salesInvoice?: Prisma.SalesInvoiceUpdateOneRequiredWithoutLinesNestedInput;
};
export type SalesInvoiceLineUncheckedUpdateWithoutItemInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    salesInvoiceId?: Prisma.StringFieldUpdateOperationsInput | string;
    quantity?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    unitPrice?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    lineTotal?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
};
export type SalesInvoiceLineUncheckedUpdateManyWithoutItemInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    salesInvoiceId?: Prisma.StringFieldUpdateOperationsInput | string;
    quantity?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    unitPrice?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    lineTotal?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
};
export type SalesInvoiceLineCreateManySalesInvoiceInput = {
    id?: string;
    itemId: string;
    quantity: runtime.Decimal | runtime.DecimalJsLike | number | string;
    unitPrice: runtime.Decimal | runtime.DecimalJsLike | number | string;
    lineTotal: runtime.Decimal | runtime.DecimalJsLike | number | string;
};
export type SalesInvoiceLineUpdateWithoutSalesInvoiceInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    quantity?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    unitPrice?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    lineTotal?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    item?: Prisma.ItemUpdateOneRequiredWithoutSalesInvoiceLinesNestedInput;
};
export type SalesInvoiceLineUncheckedUpdateWithoutSalesInvoiceInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    itemId?: Prisma.StringFieldUpdateOperationsInput | string;
    quantity?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    unitPrice?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    lineTotal?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
};
export type SalesInvoiceLineUncheckedUpdateManyWithoutSalesInvoiceInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    itemId?: Prisma.StringFieldUpdateOperationsInput | string;
    quantity?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    unitPrice?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    lineTotal?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
};
export type SalesInvoiceLineSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    salesInvoiceId?: boolean;
    itemId?: boolean;
    quantity?: boolean;
    unitPrice?: boolean;
    lineTotal?: boolean;
    salesInvoice?: boolean | Prisma.SalesInvoiceDefaultArgs<ExtArgs>;
    item?: boolean | Prisma.ItemDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["salesInvoiceLine"]>;
export type SalesInvoiceLineSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    salesInvoiceId?: boolean;
    itemId?: boolean;
    quantity?: boolean;
    unitPrice?: boolean;
    lineTotal?: boolean;
    salesInvoice?: boolean | Prisma.SalesInvoiceDefaultArgs<ExtArgs>;
    item?: boolean | Prisma.ItemDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["salesInvoiceLine"]>;
export type SalesInvoiceLineSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    salesInvoiceId?: boolean;
    itemId?: boolean;
    quantity?: boolean;
    unitPrice?: boolean;
    lineTotal?: boolean;
    salesInvoice?: boolean | Prisma.SalesInvoiceDefaultArgs<ExtArgs>;
    item?: boolean | Prisma.ItemDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["salesInvoiceLine"]>;
export type SalesInvoiceLineSelectScalar = {
    id?: boolean;
    salesInvoiceId?: boolean;
    itemId?: boolean;
    quantity?: boolean;
    unitPrice?: boolean;
    lineTotal?: boolean;
};
export type SalesInvoiceLineOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "salesInvoiceId" | "itemId" | "quantity" | "unitPrice" | "lineTotal", ExtArgs["result"]["salesInvoiceLine"]>;
export type SalesInvoiceLineInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    salesInvoice?: boolean | Prisma.SalesInvoiceDefaultArgs<ExtArgs>;
    item?: boolean | Prisma.ItemDefaultArgs<ExtArgs>;
};
export type SalesInvoiceLineIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    salesInvoice?: boolean | Prisma.SalesInvoiceDefaultArgs<ExtArgs>;
    item?: boolean | Prisma.ItemDefaultArgs<ExtArgs>;
};
export type SalesInvoiceLineIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    salesInvoice?: boolean | Prisma.SalesInvoiceDefaultArgs<ExtArgs>;
    item?: boolean | Prisma.ItemDefaultArgs<ExtArgs>;
};
export type $SalesInvoiceLinePayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "SalesInvoiceLine";
    objects: {
        salesInvoice: Prisma.$SalesInvoicePayload<ExtArgs>;
        item: Prisma.$ItemPayload<ExtArgs>;
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        salesInvoiceId: string;
        itemId: string;
        quantity: runtime.Decimal;
        unitPrice: runtime.Decimal;
        lineTotal: runtime.Decimal;
    }, ExtArgs["result"]["salesInvoiceLine"]>;
    composites: {};
};
export type SalesInvoiceLineGetPayload<S extends boolean | null | undefined | SalesInvoiceLineDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$SalesInvoiceLinePayload, S>;
export type SalesInvoiceLineCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<SalesInvoiceLineFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: SalesInvoiceLineCountAggregateInputType | true;
};
export interface SalesInvoiceLineDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['SalesInvoiceLine'];
        meta: {
            name: 'SalesInvoiceLine';
        };
    };
    findUnique<T extends SalesInvoiceLineFindUniqueArgs>(args: Prisma.SelectSubset<T, SalesInvoiceLineFindUniqueArgs<ExtArgs>>): Prisma.Prisma__SalesInvoiceLineClient<runtime.Types.Result.GetResult<Prisma.$SalesInvoiceLinePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends SalesInvoiceLineFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, SalesInvoiceLineFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__SalesInvoiceLineClient<runtime.Types.Result.GetResult<Prisma.$SalesInvoiceLinePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends SalesInvoiceLineFindFirstArgs>(args?: Prisma.SelectSubset<T, SalesInvoiceLineFindFirstArgs<ExtArgs>>): Prisma.Prisma__SalesInvoiceLineClient<runtime.Types.Result.GetResult<Prisma.$SalesInvoiceLinePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends SalesInvoiceLineFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, SalesInvoiceLineFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__SalesInvoiceLineClient<runtime.Types.Result.GetResult<Prisma.$SalesInvoiceLinePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends SalesInvoiceLineFindManyArgs>(args?: Prisma.SelectSubset<T, SalesInvoiceLineFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$SalesInvoiceLinePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends SalesInvoiceLineCreateArgs>(args: Prisma.SelectSubset<T, SalesInvoiceLineCreateArgs<ExtArgs>>): Prisma.Prisma__SalesInvoiceLineClient<runtime.Types.Result.GetResult<Prisma.$SalesInvoiceLinePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends SalesInvoiceLineCreateManyArgs>(args?: Prisma.SelectSubset<T, SalesInvoiceLineCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends SalesInvoiceLineCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, SalesInvoiceLineCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$SalesInvoiceLinePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends SalesInvoiceLineDeleteArgs>(args: Prisma.SelectSubset<T, SalesInvoiceLineDeleteArgs<ExtArgs>>): Prisma.Prisma__SalesInvoiceLineClient<runtime.Types.Result.GetResult<Prisma.$SalesInvoiceLinePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends SalesInvoiceLineUpdateArgs>(args: Prisma.SelectSubset<T, SalesInvoiceLineUpdateArgs<ExtArgs>>): Prisma.Prisma__SalesInvoiceLineClient<runtime.Types.Result.GetResult<Prisma.$SalesInvoiceLinePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends SalesInvoiceLineDeleteManyArgs>(args?: Prisma.SelectSubset<T, SalesInvoiceLineDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends SalesInvoiceLineUpdateManyArgs>(args: Prisma.SelectSubset<T, SalesInvoiceLineUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends SalesInvoiceLineUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, SalesInvoiceLineUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$SalesInvoiceLinePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends SalesInvoiceLineUpsertArgs>(args: Prisma.SelectSubset<T, SalesInvoiceLineUpsertArgs<ExtArgs>>): Prisma.Prisma__SalesInvoiceLineClient<runtime.Types.Result.GetResult<Prisma.$SalesInvoiceLinePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends SalesInvoiceLineCountArgs>(args?: Prisma.Subset<T, SalesInvoiceLineCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], SalesInvoiceLineCountAggregateOutputType> : number>;
    aggregate<T extends SalesInvoiceLineAggregateArgs>(args: Prisma.Subset<T, SalesInvoiceLineAggregateArgs>): Prisma.PrismaPromise<GetSalesInvoiceLineAggregateType<T>>;
    groupBy<T extends SalesInvoiceLineGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: SalesInvoiceLineGroupByArgs['orderBy'];
    } : {
        orderBy?: SalesInvoiceLineGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, SalesInvoiceLineGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetSalesInvoiceLineGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: SalesInvoiceLineFieldRefs;
}
export interface Prisma__SalesInvoiceLineClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    salesInvoice<T extends Prisma.SalesInvoiceDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.SalesInvoiceDefaultArgs<ExtArgs>>): Prisma.Prisma__SalesInvoiceClient<runtime.Types.Result.GetResult<Prisma.$SalesInvoicePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    item<T extends Prisma.ItemDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.ItemDefaultArgs<ExtArgs>>): Prisma.Prisma__ItemClient<runtime.Types.Result.GetResult<Prisma.$ItemPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface SalesInvoiceLineFieldRefs {
    readonly id: Prisma.FieldRef<"SalesInvoiceLine", 'String'>;
    readonly salesInvoiceId: Prisma.FieldRef<"SalesInvoiceLine", 'String'>;
    readonly itemId: Prisma.FieldRef<"SalesInvoiceLine", 'String'>;
    readonly quantity: Prisma.FieldRef<"SalesInvoiceLine", 'Decimal'>;
    readonly unitPrice: Prisma.FieldRef<"SalesInvoiceLine", 'Decimal'>;
    readonly lineTotal: Prisma.FieldRef<"SalesInvoiceLine", 'Decimal'>;
}
export type SalesInvoiceLineFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.SalesInvoiceLineSelect<ExtArgs> | null;
    omit?: Prisma.SalesInvoiceLineOmit<ExtArgs> | null;
    include?: Prisma.SalesInvoiceLineInclude<ExtArgs> | null;
    where: Prisma.SalesInvoiceLineWhereUniqueInput;
};
export type SalesInvoiceLineFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.SalesInvoiceLineSelect<ExtArgs> | null;
    omit?: Prisma.SalesInvoiceLineOmit<ExtArgs> | null;
    include?: Prisma.SalesInvoiceLineInclude<ExtArgs> | null;
    where: Prisma.SalesInvoiceLineWhereUniqueInput;
};
export type SalesInvoiceLineFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type SalesInvoiceLineFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type SalesInvoiceLineFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type SalesInvoiceLineCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.SalesInvoiceLineSelect<ExtArgs> | null;
    omit?: Prisma.SalesInvoiceLineOmit<ExtArgs> | null;
    include?: Prisma.SalesInvoiceLineInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.SalesInvoiceLineCreateInput, Prisma.SalesInvoiceLineUncheckedCreateInput>;
};
export type SalesInvoiceLineCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.SalesInvoiceLineCreateManyInput | Prisma.SalesInvoiceLineCreateManyInput[];
    skipDuplicates?: boolean;
};
export type SalesInvoiceLineCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.SalesInvoiceLineSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.SalesInvoiceLineOmit<ExtArgs> | null;
    data: Prisma.SalesInvoiceLineCreateManyInput | Prisma.SalesInvoiceLineCreateManyInput[];
    skipDuplicates?: boolean;
    include?: Prisma.SalesInvoiceLineIncludeCreateManyAndReturn<ExtArgs> | null;
};
export type SalesInvoiceLineUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.SalesInvoiceLineSelect<ExtArgs> | null;
    omit?: Prisma.SalesInvoiceLineOmit<ExtArgs> | null;
    include?: Prisma.SalesInvoiceLineInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.SalesInvoiceLineUpdateInput, Prisma.SalesInvoiceLineUncheckedUpdateInput>;
    where: Prisma.SalesInvoiceLineWhereUniqueInput;
};
export type SalesInvoiceLineUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.SalesInvoiceLineUpdateManyMutationInput, Prisma.SalesInvoiceLineUncheckedUpdateManyInput>;
    where?: Prisma.SalesInvoiceLineWhereInput;
    limit?: number;
};
export type SalesInvoiceLineUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.SalesInvoiceLineSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.SalesInvoiceLineOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.SalesInvoiceLineUpdateManyMutationInput, Prisma.SalesInvoiceLineUncheckedUpdateManyInput>;
    where?: Prisma.SalesInvoiceLineWhereInput;
    limit?: number;
    include?: Prisma.SalesInvoiceLineIncludeUpdateManyAndReturn<ExtArgs> | null;
};
export type SalesInvoiceLineUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.SalesInvoiceLineSelect<ExtArgs> | null;
    omit?: Prisma.SalesInvoiceLineOmit<ExtArgs> | null;
    include?: Prisma.SalesInvoiceLineInclude<ExtArgs> | null;
    where: Prisma.SalesInvoiceLineWhereUniqueInput;
    create: Prisma.XOR<Prisma.SalesInvoiceLineCreateInput, Prisma.SalesInvoiceLineUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.SalesInvoiceLineUpdateInput, Prisma.SalesInvoiceLineUncheckedUpdateInput>;
};
export type SalesInvoiceLineDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.SalesInvoiceLineSelect<ExtArgs> | null;
    omit?: Prisma.SalesInvoiceLineOmit<ExtArgs> | null;
    include?: Prisma.SalesInvoiceLineInclude<ExtArgs> | null;
    where: Prisma.SalesInvoiceLineWhereUniqueInput;
};
export type SalesInvoiceLineDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.SalesInvoiceLineWhereInput;
    limit?: number;
};
export type SalesInvoiceLineDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.SalesInvoiceLineSelect<ExtArgs> | null;
    omit?: Prisma.SalesInvoiceLineOmit<ExtArgs> | null;
    include?: Prisma.SalesInvoiceLineInclude<ExtArgs> | null;
};
