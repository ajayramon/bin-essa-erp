import type * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "../internal/prismaNamespace.js";
export type ItemStockModel = runtime.Types.Result.DefaultSelection<Prisma.$ItemStockPayload>;
export type AggregateItemStock = {
    _count: ItemStockCountAggregateOutputType | null;
    _avg: ItemStockAvgAggregateOutputType | null;
    _sum: ItemStockSumAggregateOutputType | null;
    _min: ItemStockMinAggregateOutputType | null;
    _max: ItemStockMaxAggregateOutputType | null;
};
export type ItemStockAvgAggregateOutputType = {
    quantity: runtime.Decimal | null;
};
export type ItemStockSumAggregateOutputType = {
    quantity: runtime.Decimal | null;
};
export type ItemStockMinAggregateOutputType = {
    id: string | null;
    itemId: string | null;
    branchId: string | null;
    quantity: runtime.Decimal | null;
    updatedAt: Date | null;
};
export type ItemStockMaxAggregateOutputType = {
    id: string | null;
    itemId: string | null;
    branchId: string | null;
    quantity: runtime.Decimal | null;
    updatedAt: Date | null;
};
export type ItemStockCountAggregateOutputType = {
    id: number;
    itemId: number;
    branchId: number;
    quantity: number;
    updatedAt: number;
    _all: number;
};
export type ItemStockAvgAggregateInputType = {
    quantity?: true;
};
export type ItemStockSumAggregateInputType = {
    quantity?: true;
};
export type ItemStockMinAggregateInputType = {
    id?: true;
    itemId?: true;
    branchId?: true;
    quantity?: true;
    updatedAt?: true;
};
export type ItemStockMaxAggregateInputType = {
    id?: true;
    itemId?: true;
    branchId?: true;
    quantity?: true;
    updatedAt?: true;
};
export type ItemStockCountAggregateInputType = {
    id?: true;
    itemId?: true;
    branchId?: true;
    quantity?: true;
    updatedAt?: true;
    _all?: true;
};
export type ItemStockAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.ItemStockWhereInput;
    orderBy?: Prisma.ItemStockOrderByWithRelationInput | Prisma.ItemStockOrderByWithRelationInput[];
    cursor?: Prisma.ItemStockWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | ItemStockCountAggregateInputType;
    _avg?: ItemStockAvgAggregateInputType;
    _sum?: ItemStockSumAggregateInputType;
    _min?: ItemStockMinAggregateInputType;
    _max?: ItemStockMaxAggregateInputType;
};
export type GetItemStockAggregateType<T extends ItemStockAggregateArgs> = {
    [P in keyof T & keyof AggregateItemStock]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateItemStock[P]> : Prisma.GetScalarType<T[P], AggregateItemStock[P]>;
};
export type ItemStockGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.ItemStockWhereInput;
    orderBy?: Prisma.ItemStockOrderByWithAggregationInput | Prisma.ItemStockOrderByWithAggregationInput[];
    by: Prisma.ItemStockScalarFieldEnum[] | Prisma.ItemStockScalarFieldEnum;
    having?: Prisma.ItemStockScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: ItemStockCountAggregateInputType | true;
    _avg?: ItemStockAvgAggregateInputType;
    _sum?: ItemStockSumAggregateInputType;
    _min?: ItemStockMinAggregateInputType;
    _max?: ItemStockMaxAggregateInputType;
};
export type ItemStockGroupByOutputType = {
    id: string;
    itemId: string;
    branchId: string;
    quantity: runtime.Decimal;
    updatedAt: Date;
    _count: ItemStockCountAggregateOutputType | null;
    _avg: ItemStockAvgAggregateOutputType | null;
    _sum: ItemStockSumAggregateOutputType | null;
    _min: ItemStockMinAggregateOutputType | null;
    _max: ItemStockMaxAggregateOutputType | null;
};
export type GetItemStockGroupByPayload<T extends ItemStockGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<ItemStockGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof ItemStockGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], ItemStockGroupByOutputType[P]> : Prisma.GetScalarType<T[P], ItemStockGroupByOutputType[P]>;
}>>;
export type ItemStockWhereInput = {
    AND?: Prisma.ItemStockWhereInput | Prisma.ItemStockWhereInput[];
    OR?: Prisma.ItemStockWhereInput[];
    NOT?: Prisma.ItemStockWhereInput | Prisma.ItemStockWhereInput[];
    id?: Prisma.StringFilter<"ItemStock"> | string;
    itemId?: Prisma.StringFilter<"ItemStock"> | string;
    branchId?: Prisma.StringFilter<"ItemStock"> | string;
    quantity?: Prisma.DecimalFilter<"ItemStock"> | runtime.Decimal | runtime.DecimalJsLike | number | string;
    updatedAt?: Prisma.DateTimeFilter<"ItemStock"> | Date | string;
    item?: Prisma.XOR<Prisma.ItemScalarRelationFilter, Prisma.ItemWhereInput>;
    branch?: Prisma.XOR<Prisma.BranchScalarRelationFilter, Prisma.BranchWhereInput>;
};
export type ItemStockOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    itemId?: Prisma.SortOrder;
    branchId?: Prisma.SortOrder;
    quantity?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    item?: Prisma.ItemOrderByWithRelationInput;
    branch?: Prisma.BranchOrderByWithRelationInput;
};
export type ItemStockWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    itemId_branchId?: Prisma.ItemStockItemIdBranchIdCompoundUniqueInput;
    AND?: Prisma.ItemStockWhereInput | Prisma.ItemStockWhereInput[];
    OR?: Prisma.ItemStockWhereInput[];
    NOT?: Prisma.ItemStockWhereInput | Prisma.ItemStockWhereInput[];
    itemId?: Prisma.StringFilter<"ItemStock"> | string;
    branchId?: Prisma.StringFilter<"ItemStock"> | string;
    quantity?: Prisma.DecimalFilter<"ItemStock"> | runtime.Decimal | runtime.DecimalJsLike | number | string;
    updatedAt?: Prisma.DateTimeFilter<"ItemStock"> | Date | string;
    item?: Prisma.XOR<Prisma.ItemScalarRelationFilter, Prisma.ItemWhereInput>;
    branch?: Prisma.XOR<Prisma.BranchScalarRelationFilter, Prisma.BranchWhereInput>;
}, "id" | "itemId_branchId">;
export type ItemStockOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    itemId?: Prisma.SortOrder;
    branchId?: Prisma.SortOrder;
    quantity?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    _count?: Prisma.ItemStockCountOrderByAggregateInput;
    _avg?: Prisma.ItemStockAvgOrderByAggregateInput;
    _max?: Prisma.ItemStockMaxOrderByAggregateInput;
    _min?: Prisma.ItemStockMinOrderByAggregateInput;
    _sum?: Prisma.ItemStockSumOrderByAggregateInput;
};
export type ItemStockScalarWhereWithAggregatesInput = {
    AND?: Prisma.ItemStockScalarWhereWithAggregatesInput | Prisma.ItemStockScalarWhereWithAggregatesInput[];
    OR?: Prisma.ItemStockScalarWhereWithAggregatesInput[];
    NOT?: Prisma.ItemStockScalarWhereWithAggregatesInput | Prisma.ItemStockScalarWhereWithAggregatesInput[];
    id?: Prisma.StringWithAggregatesFilter<"ItemStock"> | string;
    itemId?: Prisma.StringWithAggregatesFilter<"ItemStock"> | string;
    branchId?: Prisma.StringWithAggregatesFilter<"ItemStock"> | string;
    quantity?: Prisma.DecimalWithAggregatesFilter<"ItemStock"> | runtime.Decimal | runtime.DecimalJsLike | number | string;
    updatedAt?: Prisma.DateTimeWithAggregatesFilter<"ItemStock"> | Date | string;
};
export type ItemStockCreateInput = {
    id?: string;
    quantity?: runtime.Decimal | runtime.DecimalJsLike | number | string;
    updatedAt?: Date | string;
    item: Prisma.ItemCreateNestedOneWithoutStocksInput;
    branch: Prisma.BranchCreateNestedOneWithoutItemStocksInput;
};
export type ItemStockUncheckedCreateInput = {
    id?: string;
    itemId: string;
    branchId: string;
    quantity?: runtime.Decimal | runtime.DecimalJsLike | number | string;
    updatedAt?: Date | string;
};
export type ItemStockUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    quantity?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    item?: Prisma.ItemUpdateOneRequiredWithoutStocksNestedInput;
    branch?: Prisma.BranchUpdateOneRequiredWithoutItemStocksNestedInput;
};
export type ItemStockUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    itemId?: Prisma.StringFieldUpdateOperationsInput | string;
    branchId?: Prisma.StringFieldUpdateOperationsInput | string;
    quantity?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type ItemStockCreateManyInput = {
    id?: string;
    itemId: string;
    branchId: string;
    quantity?: runtime.Decimal | runtime.DecimalJsLike | number | string;
    updatedAt?: Date | string;
};
export type ItemStockUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    quantity?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type ItemStockUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    itemId?: Prisma.StringFieldUpdateOperationsInput | string;
    branchId?: Prisma.StringFieldUpdateOperationsInput | string;
    quantity?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type ItemStockListRelationFilter = {
    every?: Prisma.ItemStockWhereInput;
    some?: Prisma.ItemStockWhereInput;
    none?: Prisma.ItemStockWhereInput;
};
export type ItemStockOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type ItemStockItemIdBranchIdCompoundUniqueInput = {
    itemId: string;
    branchId: string;
};
export type ItemStockCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    itemId?: Prisma.SortOrder;
    branchId?: Prisma.SortOrder;
    quantity?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type ItemStockAvgOrderByAggregateInput = {
    quantity?: Prisma.SortOrder;
};
export type ItemStockMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    itemId?: Prisma.SortOrder;
    branchId?: Prisma.SortOrder;
    quantity?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type ItemStockMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    itemId?: Prisma.SortOrder;
    branchId?: Prisma.SortOrder;
    quantity?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type ItemStockSumOrderByAggregateInput = {
    quantity?: Prisma.SortOrder;
};
export type ItemStockCreateNestedManyWithoutBranchInput = {
    create?: Prisma.XOR<Prisma.ItemStockCreateWithoutBranchInput, Prisma.ItemStockUncheckedCreateWithoutBranchInput> | Prisma.ItemStockCreateWithoutBranchInput[] | Prisma.ItemStockUncheckedCreateWithoutBranchInput[];
    connectOrCreate?: Prisma.ItemStockCreateOrConnectWithoutBranchInput | Prisma.ItemStockCreateOrConnectWithoutBranchInput[];
    createMany?: Prisma.ItemStockCreateManyBranchInputEnvelope;
    connect?: Prisma.ItemStockWhereUniqueInput | Prisma.ItemStockWhereUniqueInput[];
};
export type ItemStockUncheckedCreateNestedManyWithoutBranchInput = {
    create?: Prisma.XOR<Prisma.ItemStockCreateWithoutBranchInput, Prisma.ItemStockUncheckedCreateWithoutBranchInput> | Prisma.ItemStockCreateWithoutBranchInput[] | Prisma.ItemStockUncheckedCreateWithoutBranchInput[];
    connectOrCreate?: Prisma.ItemStockCreateOrConnectWithoutBranchInput | Prisma.ItemStockCreateOrConnectWithoutBranchInput[];
    createMany?: Prisma.ItemStockCreateManyBranchInputEnvelope;
    connect?: Prisma.ItemStockWhereUniqueInput | Prisma.ItemStockWhereUniqueInput[];
};
export type ItemStockUpdateManyWithoutBranchNestedInput = {
    create?: Prisma.XOR<Prisma.ItemStockCreateWithoutBranchInput, Prisma.ItemStockUncheckedCreateWithoutBranchInput> | Prisma.ItemStockCreateWithoutBranchInput[] | Prisma.ItemStockUncheckedCreateWithoutBranchInput[];
    connectOrCreate?: Prisma.ItemStockCreateOrConnectWithoutBranchInput | Prisma.ItemStockCreateOrConnectWithoutBranchInput[];
    upsert?: Prisma.ItemStockUpsertWithWhereUniqueWithoutBranchInput | Prisma.ItemStockUpsertWithWhereUniqueWithoutBranchInput[];
    createMany?: Prisma.ItemStockCreateManyBranchInputEnvelope;
    set?: Prisma.ItemStockWhereUniqueInput | Prisma.ItemStockWhereUniqueInput[];
    disconnect?: Prisma.ItemStockWhereUniqueInput | Prisma.ItemStockWhereUniqueInput[];
    delete?: Prisma.ItemStockWhereUniqueInput | Prisma.ItemStockWhereUniqueInput[];
    connect?: Prisma.ItemStockWhereUniqueInput | Prisma.ItemStockWhereUniqueInput[];
    update?: Prisma.ItemStockUpdateWithWhereUniqueWithoutBranchInput | Prisma.ItemStockUpdateWithWhereUniqueWithoutBranchInput[];
    updateMany?: Prisma.ItemStockUpdateManyWithWhereWithoutBranchInput | Prisma.ItemStockUpdateManyWithWhereWithoutBranchInput[];
    deleteMany?: Prisma.ItemStockScalarWhereInput | Prisma.ItemStockScalarWhereInput[];
};
export type ItemStockUncheckedUpdateManyWithoutBranchNestedInput = {
    create?: Prisma.XOR<Prisma.ItemStockCreateWithoutBranchInput, Prisma.ItemStockUncheckedCreateWithoutBranchInput> | Prisma.ItemStockCreateWithoutBranchInput[] | Prisma.ItemStockUncheckedCreateWithoutBranchInput[];
    connectOrCreate?: Prisma.ItemStockCreateOrConnectWithoutBranchInput | Prisma.ItemStockCreateOrConnectWithoutBranchInput[];
    upsert?: Prisma.ItemStockUpsertWithWhereUniqueWithoutBranchInput | Prisma.ItemStockUpsertWithWhereUniqueWithoutBranchInput[];
    createMany?: Prisma.ItemStockCreateManyBranchInputEnvelope;
    set?: Prisma.ItemStockWhereUniqueInput | Prisma.ItemStockWhereUniqueInput[];
    disconnect?: Prisma.ItemStockWhereUniqueInput | Prisma.ItemStockWhereUniqueInput[];
    delete?: Prisma.ItemStockWhereUniqueInput | Prisma.ItemStockWhereUniqueInput[];
    connect?: Prisma.ItemStockWhereUniqueInput | Prisma.ItemStockWhereUniqueInput[];
    update?: Prisma.ItemStockUpdateWithWhereUniqueWithoutBranchInput | Prisma.ItemStockUpdateWithWhereUniqueWithoutBranchInput[];
    updateMany?: Prisma.ItemStockUpdateManyWithWhereWithoutBranchInput | Prisma.ItemStockUpdateManyWithWhereWithoutBranchInput[];
    deleteMany?: Prisma.ItemStockScalarWhereInput | Prisma.ItemStockScalarWhereInput[];
};
export type ItemStockCreateNestedManyWithoutItemInput = {
    create?: Prisma.XOR<Prisma.ItemStockCreateWithoutItemInput, Prisma.ItemStockUncheckedCreateWithoutItemInput> | Prisma.ItemStockCreateWithoutItemInput[] | Prisma.ItemStockUncheckedCreateWithoutItemInput[];
    connectOrCreate?: Prisma.ItemStockCreateOrConnectWithoutItemInput | Prisma.ItemStockCreateOrConnectWithoutItemInput[];
    createMany?: Prisma.ItemStockCreateManyItemInputEnvelope;
    connect?: Prisma.ItemStockWhereUniqueInput | Prisma.ItemStockWhereUniqueInput[];
};
export type ItemStockUncheckedCreateNestedManyWithoutItemInput = {
    create?: Prisma.XOR<Prisma.ItemStockCreateWithoutItemInput, Prisma.ItemStockUncheckedCreateWithoutItemInput> | Prisma.ItemStockCreateWithoutItemInput[] | Prisma.ItemStockUncheckedCreateWithoutItemInput[];
    connectOrCreate?: Prisma.ItemStockCreateOrConnectWithoutItemInput | Prisma.ItemStockCreateOrConnectWithoutItemInput[];
    createMany?: Prisma.ItemStockCreateManyItemInputEnvelope;
    connect?: Prisma.ItemStockWhereUniqueInput | Prisma.ItemStockWhereUniqueInput[];
};
export type ItemStockUpdateManyWithoutItemNestedInput = {
    create?: Prisma.XOR<Prisma.ItemStockCreateWithoutItemInput, Prisma.ItemStockUncheckedCreateWithoutItemInput> | Prisma.ItemStockCreateWithoutItemInput[] | Prisma.ItemStockUncheckedCreateWithoutItemInput[];
    connectOrCreate?: Prisma.ItemStockCreateOrConnectWithoutItemInput | Prisma.ItemStockCreateOrConnectWithoutItemInput[];
    upsert?: Prisma.ItemStockUpsertWithWhereUniqueWithoutItemInput | Prisma.ItemStockUpsertWithWhereUniqueWithoutItemInput[];
    createMany?: Prisma.ItemStockCreateManyItemInputEnvelope;
    set?: Prisma.ItemStockWhereUniqueInput | Prisma.ItemStockWhereUniqueInput[];
    disconnect?: Prisma.ItemStockWhereUniqueInput | Prisma.ItemStockWhereUniqueInput[];
    delete?: Prisma.ItemStockWhereUniqueInput | Prisma.ItemStockWhereUniqueInput[];
    connect?: Prisma.ItemStockWhereUniqueInput | Prisma.ItemStockWhereUniqueInput[];
    update?: Prisma.ItemStockUpdateWithWhereUniqueWithoutItemInput | Prisma.ItemStockUpdateWithWhereUniqueWithoutItemInput[];
    updateMany?: Prisma.ItemStockUpdateManyWithWhereWithoutItemInput | Prisma.ItemStockUpdateManyWithWhereWithoutItemInput[];
    deleteMany?: Prisma.ItemStockScalarWhereInput | Prisma.ItemStockScalarWhereInput[];
};
export type ItemStockUncheckedUpdateManyWithoutItemNestedInput = {
    create?: Prisma.XOR<Prisma.ItemStockCreateWithoutItemInput, Prisma.ItemStockUncheckedCreateWithoutItemInput> | Prisma.ItemStockCreateWithoutItemInput[] | Prisma.ItemStockUncheckedCreateWithoutItemInput[];
    connectOrCreate?: Prisma.ItemStockCreateOrConnectWithoutItemInput | Prisma.ItemStockCreateOrConnectWithoutItemInput[];
    upsert?: Prisma.ItemStockUpsertWithWhereUniqueWithoutItemInput | Prisma.ItemStockUpsertWithWhereUniqueWithoutItemInput[];
    createMany?: Prisma.ItemStockCreateManyItemInputEnvelope;
    set?: Prisma.ItemStockWhereUniqueInput | Prisma.ItemStockWhereUniqueInput[];
    disconnect?: Prisma.ItemStockWhereUniqueInput | Prisma.ItemStockWhereUniqueInput[];
    delete?: Prisma.ItemStockWhereUniqueInput | Prisma.ItemStockWhereUniqueInput[];
    connect?: Prisma.ItemStockWhereUniqueInput | Prisma.ItemStockWhereUniqueInput[];
    update?: Prisma.ItemStockUpdateWithWhereUniqueWithoutItemInput | Prisma.ItemStockUpdateWithWhereUniqueWithoutItemInput[];
    updateMany?: Prisma.ItemStockUpdateManyWithWhereWithoutItemInput | Prisma.ItemStockUpdateManyWithWhereWithoutItemInput[];
    deleteMany?: Prisma.ItemStockScalarWhereInput | Prisma.ItemStockScalarWhereInput[];
};
export type ItemStockCreateWithoutBranchInput = {
    id?: string;
    quantity?: runtime.Decimal | runtime.DecimalJsLike | number | string;
    updatedAt?: Date | string;
    item: Prisma.ItemCreateNestedOneWithoutStocksInput;
};
export type ItemStockUncheckedCreateWithoutBranchInput = {
    id?: string;
    itemId: string;
    quantity?: runtime.Decimal | runtime.DecimalJsLike | number | string;
    updatedAt?: Date | string;
};
export type ItemStockCreateOrConnectWithoutBranchInput = {
    where: Prisma.ItemStockWhereUniqueInput;
    create: Prisma.XOR<Prisma.ItemStockCreateWithoutBranchInput, Prisma.ItemStockUncheckedCreateWithoutBranchInput>;
};
export type ItemStockCreateManyBranchInputEnvelope = {
    data: Prisma.ItemStockCreateManyBranchInput | Prisma.ItemStockCreateManyBranchInput[];
    skipDuplicates?: boolean;
};
export type ItemStockUpsertWithWhereUniqueWithoutBranchInput = {
    where: Prisma.ItemStockWhereUniqueInput;
    update: Prisma.XOR<Prisma.ItemStockUpdateWithoutBranchInput, Prisma.ItemStockUncheckedUpdateWithoutBranchInput>;
    create: Prisma.XOR<Prisma.ItemStockCreateWithoutBranchInput, Prisma.ItemStockUncheckedCreateWithoutBranchInput>;
};
export type ItemStockUpdateWithWhereUniqueWithoutBranchInput = {
    where: Prisma.ItemStockWhereUniqueInput;
    data: Prisma.XOR<Prisma.ItemStockUpdateWithoutBranchInput, Prisma.ItemStockUncheckedUpdateWithoutBranchInput>;
};
export type ItemStockUpdateManyWithWhereWithoutBranchInput = {
    where: Prisma.ItemStockScalarWhereInput;
    data: Prisma.XOR<Prisma.ItemStockUpdateManyMutationInput, Prisma.ItemStockUncheckedUpdateManyWithoutBranchInput>;
};
export type ItemStockScalarWhereInput = {
    AND?: Prisma.ItemStockScalarWhereInput | Prisma.ItemStockScalarWhereInput[];
    OR?: Prisma.ItemStockScalarWhereInput[];
    NOT?: Prisma.ItemStockScalarWhereInput | Prisma.ItemStockScalarWhereInput[];
    id?: Prisma.StringFilter<"ItemStock"> | string;
    itemId?: Prisma.StringFilter<"ItemStock"> | string;
    branchId?: Prisma.StringFilter<"ItemStock"> | string;
    quantity?: Prisma.DecimalFilter<"ItemStock"> | runtime.Decimal | runtime.DecimalJsLike | number | string;
    updatedAt?: Prisma.DateTimeFilter<"ItemStock"> | Date | string;
};
export type ItemStockCreateWithoutItemInput = {
    id?: string;
    quantity?: runtime.Decimal | runtime.DecimalJsLike | number | string;
    updatedAt?: Date | string;
    branch: Prisma.BranchCreateNestedOneWithoutItemStocksInput;
};
export type ItemStockUncheckedCreateWithoutItemInput = {
    id?: string;
    branchId: string;
    quantity?: runtime.Decimal | runtime.DecimalJsLike | number | string;
    updatedAt?: Date | string;
};
export type ItemStockCreateOrConnectWithoutItemInput = {
    where: Prisma.ItemStockWhereUniqueInput;
    create: Prisma.XOR<Prisma.ItemStockCreateWithoutItemInput, Prisma.ItemStockUncheckedCreateWithoutItemInput>;
};
export type ItemStockCreateManyItemInputEnvelope = {
    data: Prisma.ItemStockCreateManyItemInput | Prisma.ItemStockCreateManyItemInput[];
    skipDuplicates?: boolean;
};
export type ItemStockUpsertWithWhereUniqueWithoutItemInput = {
    where: Prisma.ItemStockWhereUniqueInput;
    update: Prisma.XOR<Prisma.ItemStockUpdateWithoutItemInput, Prisma.ItemStockUncheckedUpdateWithoutItemInput>;
    create: Prisma.XOR<Prisma.ItemStockCreateWithoutItemInput, Prisma.ItemStockUncheckedCreateWithoutItemInput>;
};
export type ItemStockUpdateWithWhereUniqueWithoutItemInput = {
    where: Prisma.ItemStockWhereUniqueInput;
    data: Prisma.XOR<Prisma.ItemStockUpdateWithoutItemInput, Prisma.ItemStockUncheckedUpdateWithoutItemInput>;
};
export type ItemStockUpdateManyWithWhereWithoutItemInput = {
    where: Prisma.ItemStockScalarWhereInput;
    data: Prisma.XOR<Prisma.ItemStockUpdateManyMutationInput, Prisma.ItemStockUncheckedUpdateManyWithoutItemInput>;
};
export type ItemStockCreateManyBranchInput = {
    id?: string;
    itemId: string;
    quantity?: runtime.Decimal | runtime.DecimalJsLike | number | string;
    updatedAt?: Date | string;
};
export type ItemStockUpdateWithoutBranchInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    quantity?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    item?: Prisma.ItemUpdateOneRequiredWithoutStocksNestedInput;
};
export type ItemStockUncheckedUpdateWithoutBranchInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    itemId?: Prisma.StringFieldUpdateOperationsInput | string;
    quantity?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type ItemStockUncheckedUpdateManyWithoutBranchInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    itemId?: Prisma.StringFieldUpdateOperationsInput | string;
    quantity?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type ItemStockCreateManyItemInput = {
    id?: string;
    branchId: string;
    quantity?: runtime.Decimal | runtime.DecimalJsLike | number | string;
    updatedAt?: Date | string;
};
export type ItemStockUpdateWithoutItemInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    quantity?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    branch?: Prisma.BranchUpdateOneRequiredWithoutItemStocksNestedInput;
};
export type ItemStockUncheckedUpdateWithoutItemInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    branchId?: Prisma.StringFieldUpdateOperationsInput | string;
    quantity?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type ItemStockUncheckedUpdateManyWithoutItemInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    branchId?: Prisma.StringFieldUpdateOperationsInput | string;
    quantity?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type ItemStockSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    itemId?: boolean;
    branchId?: boolean;
    quantity?: boolean;
    updatedAt?: boolean;
    item?: boolean | Prisma.ItemDefaultArgs<ExtArgs>;
    branch?: boolean | Prisma.BranchDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["itemStock"]>;
export type ItemStockSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    itemId?: boolean;
    branchId?: boolean;
    quantity?: boolean;
    updatedAt?: boolean;
    item?: boolean | Prisma.ItemDefaultArgs<ExtArgs>;
    branch?: boolean | Prisma.BranchDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["itemStock"]>;
export type ItemStockSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    itemId?: boolean;
    branchId?: boolean;
    quantity?: boolean;
    updatedAt?: boolean;
    item?: boolean | Prisma.ItemDefaultArgs<ExtArgs>;
    branch?: boolean | Prisma.BranchDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["itemStock"]>;
export type ItemStockSelectScalar = {
    id?: boolean;
    itemId?: boolean;
    branchId?: boolean;
    quantity?: boolean;
    updatedAt?: boolean;
};
export type ItemStockOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "itemId" | "branchId" | "quantity" | "updatedAt", ExtArgs["result"]["itemStock"]>;
export type ItemStockInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    item?: boolean | Prisma.ItemDefaultArgs<ExtArgs>;
    branch?: boolean | Prisma.BranchDefaultArgs<ExtArgs>;
};
export type ItemStockIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    item?: boolean | Prisma.ItemDefaultArgs<ExtArgs>;
    branch?: boolean | Prisma.BranchDefaultArgs<ExtArgs>;
};
export type ItemStockIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    item?: boolean | Prisma.ItemDefaultArgs<ExtArgs>;
    branch?: boolean | Prisma.BranchDefaultArgs<ExtArgs>;
};
export type $ItemStockPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "ItemStock";
    objects: {
        item: Prisma.$ItemPayload<ExtArgs>;
        branch: Prisma.$BranchPayload<ExtArgs>;
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        itemId: string;
        branchId: string;
        quantity: runtime.Decimal;
        updatedAt: Date;
    }, ExtArgs["result"]["itemStock"]>;
    composites: {};
};
export type ItemStockGetPayload<S extends boolean | null | undefined | ItemStockDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$ItemStockPayload, S>;
export type ItemStockCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<ItemStockFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: ItemStockCountAggregateInputType | true;
};
export interface ItemStockDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['ItemStock'];
        meta: {
            name: 'ItemStock';
        };
    };
    findUnique<T extends ItemStockFindUniqueArgs>(args: Prisma.SelectSubset<T, ItemStockFindUniqueArgs<ExtArgs>>): Prisma.Prisma__ItemStockClient<runtime.Types.Result.GetResult<Prisma.$ItemStockPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends ItemStockFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, ItemStockFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__ItemStockClient<runtime.Types.Result.GetResult<Prisma.$ItemStockPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends ItemStockFindFirstArgs>(args?: Prisma.SelectSubset<T, ItemStockFindFirstArgs<ExtArgs>>): Prisma.Prisma__ItemStockClient<runtime.Types.Result.GetResult<Prisma.$ItemStockPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends ItemStockFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, ItemStockFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__ItemStockClient<runtime.Types.Result.GetResult<Prisma.$ItemStockPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends ItemStockFindManyArgs>(args?: Prisma.SelectSubset<T, ItemStockFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$ItemStockPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends ItemStockCreateArgs>(args: Prisma.SelectSubset<T, ItemStockCreateArgs<ExtArgs>>): Prisma.Prisma__ItemStockClient<runtime.Types.Result.GetResult<Prisma.$ItemStockPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends ItemStockCreateManyArgs>(args?: Prisma.SelectSubset<T, ItemStockCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends ItemStockCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, ItemStockCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$ItemStockPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends ItemStockDeleteArgs>(args: Prisma.SelectSubset<T, ItemStockDeleteArgs<ExtArgs>>): Prisma.Prisma__ItemStockClient<runtime.Types.Result.GetResult<Prisma.$ItemStockPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends ItemStockUpdateArgs>(args: Prisma.SelectSubset<T, ItemStockUpdateArgs<ExtArgs>>): Prisma.Prisma__ItemStockClient<runtime.Types.Result.GetResult<Prisma.$ItemStockPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends ItemStockDeleteManyArgs>(args?: Prisma.SelectSubset<T, ItemStockDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends ItemStockUpdateManyArgs>(args: Prisma.SelectSubset<T, ItemStockUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends ItemStockUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, ItemStockUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$ItemStockPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends ItemStockUpsertArgs>(args: Prisma.SelectSubset<T, ItemStockUpsertArgs<ExtArgs>>): Prisma.Prisma__ItemStockClient<runtime.Types.Result.GetResult<Prisma.$ItemStockPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends ItemStockCountArgs>(args?: Prisma.Subset<T, ItemStockCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], ItemStockCountAggregateOutputType> : number>;
    aggregate<T extends ItemStockAggregateArgs>(args: Prisma.Subset<T, ItemStockAggregateArgs>): Prisma.PrismaPromise<GetItemStockAggregateType<T>>;
    groupBy<T extends ItemStockGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: ItemStockGroupByArgs['orderBy'];
    } : {
        orderBy?: ItemStockGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, ItemStockGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetItemStockGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: ItemStockFieldRefs;
}
export interface Prisma__ItemStockClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    item<T extends Prisma.ItemDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.ItemDefaultArgs<ExtArgs>>): Prisma.Prisma__ItemClient<runtime.Types.Result.GetResult<Prisma.$ItemPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    branch<T extends Prisma.BranchDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.BranchDefaultArgs<ExtArgs>>): Prisma.Prisma__BranchClient<runtime.Types.Result.GetResult<Prisma.$BranchPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface ItemStockFieldRefs {
    readonly id: Prisma.FieldRef<"ItemStock", 'String'>;
    readonly itemId: Prisma.FieldRef<"ItemStock", 'String'>;
    readonly branchId: Prisma.FieldRef<"ItemStock", 'String'>;
    readonly quantity: Prisma.FieldRef<"ItemStock", 'Decimal'>;
    readonly updatedAt: Prisma.FieldRef<"ItemStock", 'DateTime'>;
}
export type ItemStockFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ItemStockSelect<ExtArgs> | null;
    omit?: Prisma.ItemStockOmit<ExtArgs> | null;
    include?: Prisma.ItemStockInclude<ExtArgs> | null;
    where: Prisma.ItemStockWhereUniqueInput;
};
export type ItemStockFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ItemStockSelect<ExtArgs> | null;
    omit?: Prisma.ItemStockOmit<ExtArgs> | null;
    include?: Prisma.ItemStockInclude<ExtArgs> | null;
    where: Prisma.ItemStockWhereUniqueInput;
};
export type ItemStockFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type ItemStockFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type ItemStockFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type ItemStockCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ItemStockSelect<ExtArgs> | null;
    omit?: Prisma.ItemStockOmit<ExtArgs> | null;
    include?: Prisma.ItemStockInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.ItemStockCreateInput, Prisma.ItemStockUncheckedCreateInput>;
};
export type ItemStockCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.ItemStockCreateManyInput | Prisma.ItemStockCreateManyInput[];
    skipDuplicates?: boolean;
};
export type ItemStockCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ItemStockSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.ItemStockOmit<ExtArgs> | null;
    data: Prisma.ItemStockCreateManyInput | Prisma.ItemStockCreateManyInput[];
    skipDuplicates?: boolean;
    include?: Prisma.ItemStockIncludeCreateManyAndReturn<ExtArgs> | null;
};
export type ItemStockUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ItemStockSelect<ExtArgs> | null;
    omit?: Prisma.ItemStockOmit<ExtArgs> | null;
    include?: Prisma.ItemStockInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.ItemStockUpdateInput, Prisma.ItemStockUncheckedUpdateInput>;
    where: Prisma.ItemStockWhereUniqueInput;
};
export type ItemStockUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.ItemStockUpdateManyMutationInput, Prisma.ItemStockUncheckedUpdateManyInput>;
    where?: Prisma.ItemStockWhereInput;
    limit?: number;
};
export type ItemStockUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ItemStockSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.ItemStockOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.ItemStockUpdateManyMutationInput, Prisma.ItemStockUncheckedUpdateManyInput>;
    where?: Prisma.ItemStockWhereInput;
    limit?: number;
    include?: Prisma.ItemStockIncludeUpdateManyAndReturn<ExtArgs> | null;
};
export type ItemStockUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ItemStockSelect<ExtArgs> | null;
    omit?: Prisma.ItemStockOmit<ExtArgs> | null;
    include?: Prisma.ItemStockInclude<ExtArgs> | null;
    where: Prisma.ItemStockWhereUniqueInput;
    create: Prisma.XOR<Prisma.ItemStockCreateInput, Prisma.ItemStockUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.ItemStockUpdateInput, Prisma.ItemStockUncheckedUpdateInput>;
};
export type ItemStockDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ItemStockSelect<ExtArgs> | null;
    omit?: Prisma.ItemStockOmit<ExtArgs> | null;
    include?: Prisma.ItemStockInclude<ExtArgs> | null;
    where: Prisma.ItemStockWhereUniqueInput;
};
export type ItemStockDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.ItemStockWhereInput;
    limit?: number;
};
export type ItemStockDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ItemStockSelect<ExtArgs> | null;
    omit?: Prisma.ItemStockOmit<ExtArgs> | null;
    include?: Prisma.ItemStockInclude<ExtArgs> | null;
};
