import type * as runtime from "@prisma/client/runtime/client";
import type * as $Enums from "../enums.js";
import type * as Prisma from "../internal/prismaNamespace.js";
export type ItemModel = runtime.Types.Result.DefaultSelection<Prisma.$ItemPayload>;
export type AggregateItem = {
    _count: ItemCountAggregateOutputType | null;
    _avg: ItemAvgAggregateOutputType | null;
    _sum: ItemSumAggregateOutputType | null;
    _min: ItemMinAggregateOutputType | null;
    _max: ItemMaxAggregateOutputType | null;
};
export type ItemAvgAggregateOutputType = {
    price: runtime.Decimal | null;
    cost: runtime.Decimal | null;
};
export type ItemSumAggregateOutputType = {
    price: runtime.Decimal | null;
    cost: runtime.Decimal | null;
};
export type ItemMinAggregateOutputType = {
    id: string | null;
    sku: string | null;
    barcode: string | null;
    name: string | null;
    category: $Enums.ItemCategory | null;
    visibility: $Enums.ItemVisibility | null;
    price: runtime.Decimal | null;
    cost: runtime.Decimal | null;
    unit: string | null;
    isActive: boolean | null;
    createdAt: Date | null;
    updatedAt: Date | null;
};
export type ItemMaxAggregateOutputType = {
    id: string | null;
    sku: string | null;
    barcode: string | null;
    name: string | null;
    category: $Enums.ItemCategory | null;
    visibility: $Enums.ItemVisibility | null;
    price: runtime.Decimal | null;
    cost: runtime.Decimal | null;
    unit: string | null;
    isActive: boolean | null;
    createdAt: Date | null;
    updatedAt: Date | null;
};
export type ItemCountAggregateOutputType = {
    id: number;
    sku: number;
    barcode: number;
    name: number;
    category: number;
    visibility: number;
    price: number;
    cost: number;
    unit: number;
    isActive: number;
    createdAt: number;
    updatedAt: number;
    _all: number;
};
export type ItemAvgAggregateInputType = {
    price?: true;
    cost?: true;
};
export type ItemSumAggregateInputType = {
    price?: true;
    cost?: true;
};
export type ItemMinAggregateInputType = {
    id?: true;
    sku?: true;
    barcode?: true;
    name?: true;
    category?: true;
    visibility?: true;
    price?: true;
    cost?: true;
    unit?: true;
    isActive?: true;
    createdAt?: true;
    updatedAt?: true;
};
export type ItemMaxAggregateInputType = {
    id?: true;
    sku?: true;
    barcode?: true;
    name?: true;
    category?: true;
    visibility?: true;
    price?: true;
    cost?: true;
    unit?: true;
    isActive?: true;
    createdAt?: true;
    updatedAt?: true;
};
export type ItemCountAggregateInputType = {
    id?: true;
    sku?: true;
    barcode?: true;
    name?: true;
    category?: true;
    visibility?: true;
    price?: true;
    cost?: true;
    unit?: true;
    isActive?: true;
    createdAt?: true;
    updatedAt?: true;
    _all?: true;
};
export type ItemAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.ItemWhereInput;
    orderBy?: Prisma.ItemOrderByWithRelationInput | Prisma.ItemOrderByWithRelationInput[];
    cursor?: Prisma.ItemWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | ItemCountAggregateInputType;
    _avg?: ItemAvgAggregateInputType;
    _sum?: ItemSumAggregateInputType;
    _min?: ItemMinAggregateInputType;
    _max?: ItemMaxAggregateInputType;
};
export type GetItemAggregateType<T extends ItemAggregateArgs> = {
    [P in keyof T & keyof AggregateItem]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateItem[P]> : Prisma.GetScalarType<T[P], AggregateItem[P]>;
};
export type ItemGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.ItemWhereInput;
    orderBy?: Prisma.ItemOrderByWithAggregationInput | Prisma.ItemOrderByWithAggregationInput[];
    by: Prisma.ItemScalarFieldEnum[] | Prisma.ItemScalarFieldEnum;
    having?: Prisma.ItemScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: ItemCountAggregateInputType | true;
    _avg?: ItemAvgAggregateInputType;
    _sum?: ItemSumAggregateInputType;
    _min?: ItemMinAggregateInputType;
    _max?: ItemMaxAggregateInputType;
};
export type ItemGroupByOutputType = {
    id: string;
    sku: string;
    barcode: string | null;
    name: string;
    category: $Enums.ItemCategory;
    visibility: $Enums.ItemVisibility;
    price: runtime.Decimal;
    cost: runtime.Decimal;
    unit: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
    _count: ItemCountAggregateOutputType | null;
    _avg: ItemAvgAggregateOutputType | null;
    _sum: ItemSumAggregateOutputType | null;
    _min: ItemMinAggregateOutputType | null;
    _max: ItemMaxAggregateOutputType | null;
};
export type GetItemGroupByPayload<T extends ItemGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<ItemGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof ItemGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], ItemGroupByOutputType[P]> : Prisma.GetScalarType<T[P], ItemGroupByOutputType[P]>;
}>>;
export type ItemWhereInput = {
    AND?: Prisma.ItemWhereInput | Prisma.ItemWhereInput[];
    OR?: Prisma.ItemWhereInput[];
    NOT?: Prisma.ItemWhereInput | Prisma.ItemWhereInput[];
    id?: Prisma.StringFilter<"Item"> | string;
    sku?: Prisma.StringFilter<"Item"> | string;
    barcode?: Prisma.StringNullableFilter<"Item"> | string | null;
    name?: Prisma.StringFilter<"Item"> | string;
    category?: Prisma.EnumItemCategoryFilter<"Item"> | $Enums.ItemCategory;
    visibility?: Prisma.EnumItemVisibilityFilter<"Item"> | $Enums.ItemVisibility;
    price?: Prisma.DecimalFilter<"Item"> | runtime.Decimal | runtime.DecimalJsLike | number | string;
    cost?: Prisma.DecimalFilter<"Item"> | runtime.Decimal | runtime.DecimalJsLike | number | string;
    unit?: Prisma.StringFilter<"Item"> | string;
    isActive?: Prisma.BoolFilter<"Item"> | boolean;
    createdAt?: Prisma.DateTimeFilter<"Item"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"Item"> | Date | string;
    stocks?: Prisma.ItemStockListRelationFilter;
    salesInvoiceLines?: Prisma.SalesInvoiceLineListRelationFilter;
};
export type ItemOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    sku?: Prisma.SortOrder;
    barcode?: Prisma.SortOrderInput | Prisma.SortOrder;
    name?: Prisma.SortOrder;
    category?: Prisma.SortOrder;
    visibility?: Prisma.SortOrder;
    price?: Prisma.SortOrder;
    cost?: Prisma.SortOrder;
    unit?: Prisma.SortOrder;
    isActive?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    stocks?: Prisma.ItemStockOrderByRelationAggregateInput;
    salesInvoiceLines?: Prisma.SalesInvoiceLineOrderByRelationAggregateInput;
};
export type ItemWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    sku?: string;
    barcode?: string;
    AND?: Prisma.ItemWhereInput | Prisma.ItemWhereInput[];
    OR?: Prisma.ItemWhereInput[];
    NOT?: Prisma.ItemWhereInput | Prisma.ItemWhereInput[];
    name?: Prisma.StringFilter<"Item"> | string;
    category?: Prisma.EnumItemCategoryFilter<"Item"> | $Enums.ItemCategory;
    visibility?: Prisma.EnumItemVisibilityFilter<"Item"> | $Enums.ItemVisibility;
    price?: Prisma.DecimalFilter<"Item"> | runtime.Decimal | runtime.DecimalJsLike | number | string;
    cost?: Prisma.DecimalFilter<"Item"> | runtime.Decimal | runtime.DecimalJsLike | number | string;
    unit?: Prisma.StringFilter<"Item"> | string;
    isActive?: Prisma.BoolFilter<"Item"> | boolean;
    createdAt?: Prisma.DateTimeFilter<"Item"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"Item"> | Date | string;
    stocks?: Prisma.ItemStockListRelationFilter;
    salesInvoiceLines?: Prisma.SalesInvoiceLineListRelationFilter;
}, "id" | "sku" | "barcode">;
export type ItemOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    sku?: Prisma.SortOrder;
    barcode?: Prisma.SortOrderInput | Prisma.SortOrder;
    name?: Prisma.SortOrder;
    category?: Prisma.SortOrder;
    visibility?: Prisma.SortOrder;
    price?: Prisma.SortOrder;
    cost?: Prisma.SortOrder;
    unit?: Prisma.SortOrder;
    isActive?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    _count?: Prisma.ItemCountOrderByAggregateInput;
    _avg?: Prisma.ItemAvgOrderByAggregateInput;
    _max?: Prisma.ItemMaxOrderByAggregateInput;
    _min?: Prisma.ItemMinOrderByAggregateInput;
    _sum?: Prisma.ItemSumOrderByAggregateInput;
};
export type ItemScalarWhereWithAggregatesInput = {
    AND?: Prisma.ItemScalarWhereWithAggregatesInput | Prisma.ItemScalarWhereWithAggregatesInput[];
    OR?: Prisma.ItemScalarWhereWithAggregatesInput[];
    NOT?: Prisma.ItemScalarWhereWithAggregatesInput | Prisma.ItemScalarWhereWithAggregatesInput[];
    id?: Prisma.StringWithAggregatesFilter<"Item"> | string;
    sku?: Prisma.StringWithAggregatesFilter<"Item"> | string;
    barcode?: Prisma.StringNullableWithAggregatesFilter<"Item"> | string | null;
    name?: Prisma.StringWithAggregatesFilter<"Item"> | string;
    category?: Prisma.EnumItemCategoryWithAggregatesFilter<"Item"> | $Enums.ItemCategory;
    visibility?: Prisma.EnumItemVisibilityWithAggregatesFilter<"Item"> | $Enums.ItemVisibility;
    price?: Prisma.DecimalWithAggregatesFilter<"Item"> | runtime.Decimal | runtime.DecimalJsLike | number | string;
    cost?: Prisma.DecimalWithAggregatesFilter<"Item"> | runtime.Decimal | runtime.DecimalJsLike | number | string;
    unit?: Prisma.StringWithAggregatesFilter<"Item"> | string;
    isActive?: Prisma.BoolWithAggregatesFilter<"Item"> | boolean;
    createdAt?: Prisma.DateTimeWithAggregatesFilter<"Item"> | Date | string;
    updatedAt?: Prisma.DateTimeWithAggregatesFilter<"Item"> | Date | string;
};
export type ItemCreateInput = {
    id?: string;
    sku: string;
    barcode?: string | null;
    name: string;
    category: $Enums.ItemCategory;
    visibility?: $Enums.ItemVisibility;
    price: runtime.Decimal | runtime.DecimalJsLike | number | string;
    cost: runtime.Decimal | runtime.DecimalJsLike | number | string;
    unit?: string;
    isActive?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    stocks?: Prisma.ItemStockCreateNestedManyWithoutItemInput;
    salesInvoiceLines?: Prisma.SalesInvoiceLineCreateNestedManyWithoutItemInput;
};
export type ItemUncheckedCreateInput = {
    id?: string;
    sku: string;
    barcode?: string | null;
    name: string;
    category: $Enums.ItemCategory;
    visibility?: $Enums.ItemVisibility;
    price: runtime.Decimal | runtime.DecimalJsLike | number | string;
    cost: runtime.Decimal | runtime.DecimalJsLike | number | string;
    unit?: string;
    isActive?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    stocks?: Prisma.ItemStockUncheckedCreateNestedManyWithoutItemInput;
    salesInvoiceLines?: Prisma.SalesInvoiceLineUncheckedCreateNestedManyWithoutItemInput;
};
export type ItemUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    sku?: Prisma.StringFieldUpdateOperationsInput | string;
    barcode?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    category?: Prisma.EnumItemCategoryFieldUpdateOperationsInput | $Enums.ItemCategory;
    visibility?: Prisma.EnumItemVisibilityFieldUpdateOperationsInput | $Enums.ItemVisibility;
    price?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    cost?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    unit?: Prisma.StringFieldUpdateOperationsInput | string;
    isActive?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    stocks?: Prisma.ItemStockUpdateManyWithoutItemNestedInput;
    salesInvoiceLines?: Prisma.SalesInvoiceLineUpdateManyWithoutItemNestedInput;
};
export type ItemUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    sku?: Prisma.StringFieldUpdateOperationsInput | string;
    barcode?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    category?: Prisma.EnumItemCategoryFieldUpdateOperationsInput | $Enums.ItemCategory;
    visibility?: Prisma.EnumItemVisibilityFieldUpdateOperationsInput | $Enums.ItemVisibility;
    price?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    cost?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    unit?: Prisma.StringFieldUpdateOperationsInput | string;
    isActive?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    stocks?: Prisma.ItemStockUncheckedUpdateManyWithoutItemNestedInput;
    salesInvoiceLines?: Prisma.SalesInvoiceLineUncheckedUpdateManyWithoutItemNestedInput;
};
export type ItemCreateManyInput = {
    id?: string;
    sku: string;
    barcode?: string | null;
    name: string;
    category: $Enums.ItemCategory;
    visibility?: $Enums.ItemVisibility;
    price: runtime.Decimal | runtime.DecimalJsLike | number | string;
    cost: runtime.Decimal | runtime.DecimalJsLike | number | string;
    unit?: string;
    isActive?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type ItemUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    sku?: Prisma.StringFieldUpdateOperationsInput | string;
    barcode?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    category?: Prisma.EnumItemCategoryFieldUpdateOperationsInput | $Enums.ItemCategory;
    visibility?: Prisma.EnumItemVisibilityFieldUpdateOperationsInput | $Enums.ItemVisibility;
    price?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    cost?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    unit?: Prisma.StringFieldUpdateOperationsInput | string;
    isActive?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type ItemUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    sku?: Prisma.StringFieldUpdateOperationsInput | string;
    barcode?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    category?: Prisma.EnumItemCategoryFieldUpdateOperationsInput | $Enums.ItemCategory;
    visibility?: Prisma.EnumItemVisibilityFieldUpdateOperationsInput | $Enums.ItemVisibility;
    price?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    cost?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    unit?: Prisma.StringFieldUpdateOperationsInput | string;
    isActive?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type ItemCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    sku?: Prisma.SortOrder;
    barcode?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    category?: Prisma.SortOrder;
    visibility?: Prisma.SortOrder;
    price?: Prisma.SortOrder;
    cost?: Prisma.SortOrder;
    unit?: Prisma.SortOrder;
    isActive?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type ItemAvgOrderByAggregateInput = {
    price?: Prisma.SortOrder;
    cost?: Prisma.SortOrder;
};
export type ItemMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    sku?: Prisma.SortOrder;
    barcode?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    category?: Prisma.SortOrder;
    visibility?: Prisma.SortOrder;
    price?: Prisma.SortOrder;
    cost?: Prisma.SortOrder;
    unit?: Prisma.SortOrder;
    isActive?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type ItemMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    sku?: Prisma.SortOrder;
    barcode?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    category?: Prisma.SortOrder;
    visibility?: Prisma.SortOrder;
    price?: Prisma.SortOrder;
    cost?: Prisma.SortOrder;
    unit?: Prisma.SortOrder;
    isActive?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type ItemSumOrderByAggregateInput = {
    price?: Prisma.SortOrder;
    cost?: Prisma.SortOrder;
};
export type ItemScalarRelationFilter = {
    is?: Prisma.ItemWhereInput;
    isNot?: Prisma.ItemWhereInput;
};
export type EnumItemCategoryFieldUpdateOperationsInput = {
    set?: $Enums.ItemCategory;
};
export type EnumItemVisibilityFieldUpdateOperationsInput = {
    set?: $Enums.ItemVisibility;
};
export type DecimalFieldUpdateOperationsInput = {
    set?: runtime.Decimal | runtime.DecimalJsLike | number | string;
    increment?: runtime.Decimal | runtime.DecimalJsLike | number | string;
    decrement?: runtime.Decimal | runtime.DecimalJsLike | number | string;
    multiply?: runtime.Decimal | runtime.DecimalJsLike | number | string;
    divide?: runtime.Decimal | runtime.DecimalJsLike | number | string;
};
export type ItemCreateNestedOneWithoutStocksInput = {
    create?: Prisma.XOR<Prisma.ItemCreateWithoutStocksInput, Prisma.ItemUncheckedCreateWithoutStocksInput>;
    connectOrCreate?: Prisma.ItemCreateOrConnectWithoutStocksInput;
    connect?: Prisma.ItemWhereUniqueInput;
};
export type ItemUpdateOneRequiredWithoutStocksNestedInput = {
    create?: Prisma.XOR<Prisma.ItemCreateWithoutStocksInput, Prisma.ItemUncheckedCreateWithoutStocksInput>;
    connectOrCreate?: Prisma.ItemCreateOrConnectWithoutStocksInput;
    upsert?: Prisma.ItemUpsertWithoutStocksInput;
    connect?: Prisma.ItemWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.ItemUpdateToOneWithWhereWithoutStocksInput, Prisma.ItemUpdateWithoutStocksInput>, Prisma.ItemUncheckedUpdateWithoutStocksInput>;
};
export type ItemCreateNestedOneWithoutSalesInvoiceLinesInput = {
    create?: Prisma.XOR<Prisma.ItemCreateWithoutSalesInvoiceLinesInput, Prisma.ItemUncheckedCreateWithoutSalesInvoiceLinesInput>;
    connectOrCreate?: Prisma.ItemCreateOrConnectWithoutSalesInvoiceLinesInput;
    connect?: Prisma.ItemWhereUniqueInput;
};
export type ItemUpdateOneRequiredWithoutSalesInvoiceLinesNestedInput = {
    create?: Prisma.XOR<Prisma.ItemCreateWithoutSalesInvoiceLinesInput, Prisma.ItemUncheckedCreateWithoutSalesInvoiceLinesInput>;
    connectOrCreate?: Prisma.ItemCreateOrConnectWithoutSalesInvoiceLinesInput;
    upsert?: Prisma.ItemUpsertWithoutSalesInvoiceLinesInput;
    connect?: Prisma.ItemWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.ItemUpdateToOneWithWhereWithoutSalesInvoiceLinesInput, Prisma.ItemUpdateWithoutSalesInvoiceLinesInput>, Prisma.ItemUncheckedUpdateWithoutSalesInvoiceLinesInput>;
};
export type ItemCreateWithoutStocksInput = {
    id?: string;
    sku: string;
    barcode?: string | null;
    name: string;
    category: $Enums.ItemCategory;
    visibility?: $Enums.ItemVisibility;
    price: runtime.Decimal | runtime.DecimalJsLike | number | string;
    cost: runtime.Decimal | runtime.DecimalJsLike | number | string;
    unit?: string;
    isActive?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    salesInvoiceLines?: Prisma.SalesInvoiceLineCreateNestedManyWithoutItemInput;
};
export type ItemUncheckedCreateWithoutStocksInput = {
    id?: string;
    sku: string;
    barcode?: string | null;
    name: string;
    category: $Enums.ItemCategory;
    visibility?: $Enums.ItemVisibility;
    price: runtime.Decimal | runtime.DecimalJsLike | number | string;
    cost: runtime.Decimal | runtime.DecimalJsLike | number | string;
    unit?: string;
    isActive?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    salesInvoiceLines?: Prisma.SalesInvoiceLineUncheckedCreateNestedManyWithoutItemInput;
};
export type ItemCreateOrConnectWithoutStocksInput = {
    where: Prisma.ItemWhereUniqueInput;
    create: Prisma.XOR<Prisma.ItemCreateWithoutStocksInput, Prisma.ItemUncheckedCreateWithoutStocksInput>;
};
export type ItemUpsertWithoutStocksInput = {
    update: Prisma.XOR<Prisma.ItemUpdateWithoutStocksInput, Prisma.ItemUncheckedUpdateWithoutStocksInput>;
    create: Prisma.XOR<Prisma.ItemCreateWithoutStocksInput, Prisma.ItemUncheckedCreateWithoutStocksInput>;
    where?: Prisma.ItemWhereInput;
};
export type ItemUpdateToOneWithWhereWithoutStocksInput = {
    where?: Prisma.ItemWhereInput;
    data: Prisma.XOR<Prisma.ItemUpdateWithoutStocksInput, Prisma.ItemUncheckedUpdateWithoutStocksInput>;
};
export type ItemUpdateWithoutStocksInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    sku?: Prisma.StringFieldUpdateOperationsInput | string;
    barcode?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    category?: Prisma.EnumItemCategoryFieldUpdateOperationsInput | $Enums.ItemCategory;
    visibility?: Prisma.EnumItemVisibilityFieldUpdateOperationsInput | $Enums.ItemVisibility;
    price?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    cost?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    unit?: Prisma.StringFieldUpdateOperationsInput | string;
    isActive?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    salesInvoiceLines?: Prisma.SalesInvoiceLineUpdateManyWithoutItemNestedInput;
};
export type ItemUncheckedUpdateWithoutStocksInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    sku?: Prisma.StringFieldUpdateOperationsInput | string;
    barcode?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    category?: Prisma.EnumItemCategoryFieldUpdateOperationsInput | $Enums.ItemCategory;
    visibility?: Prisma.EnumItemVisibilityFieldUpdateOperationsInput | $Enums.ItemVisibility;
    price?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    cost?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    unit?: Prisma.StringFieldUpdateOperationsInput | string;
    isActive?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    salesInvoiceLines?: Prisma.SalesInvoiceLineUncheckedUpdateManyWithoutItemNestedInput;
};
export type ItemCreateWithoutSalesInvoiceLinesInput = {
    id?: string;
    sku: string;
    barcode?: string | null;
    name: string;
    category: $Enums.ItemCategory;
    visibility?: $Enums.ItemVisibility;
    price: runtime.Decimal | runtime.DecimalJsLike | number | string;
    cost: runtime.Decimal | runtime.DecimalJsLike | number | string;
    unit?: string;
    isActive?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    stocks?: Prisma.ItemStockCreateNestedManyWithoutItemInput;
};
export type ItemUncheckedCreateWithoutSalesInvoiceLinesInput = {
    id?: string;
    sku: string;
    barcode?: string | null;
    name: string;
    category: $Enums.ItemCategory;
    visibility?: $Enums.ItemVisibility;
    price: runtime.Decimal | runtime.DecimalJsLike | number | string;
    cost: runtime.Decimal | runtime.DecimalJsLike | number | string;
    unit?: string;
    isActive?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    stocks?: Prisma.ItemStockUncheckedCreateNestedManyWithoutItemInput;
};
export type ItemCreateOrConnectWithoutSalesInvoiceLinesInput = {
    where: Prisma.ItemWhereUniqueInput;
    create: Prisma.XOR<Prisma.ItemCreateWithoutSalesInvoiceLinesInput, Prisma.ItemUncheckedCreateWithoutSalesInvoiceLinesInput>;
};
export type ItemUpsertWithoutSalesInvoiceLinesInput = {
    update: Prisma.XOR<Prisma.ItemUpdateWithoutSalesInvoiceLinesInput, Prisma.ItemUncheckedUpdateWithoutSalesInvoiceLinesInput>;
    create: Prisma.XOR<Prisma.ItemCreateWithoutSalesInvoiceLinesInput, Prisma.ItemUncheckedCreateWithoutSalesInvoiceLinesInput>;
    where?: Prisma.ItemWhereInput;
};
export type ItemUpdateToOneWithWhereWithoutSalesInvoiceLinesInput = {
    where?: Prisma.ItemWhereInput;
    data: Prisma.XOR<Prisma.ItemUpdateWithoutSalesInvoiceLinesInput, Prisma.ItemUncheckedUpdateWithoutSalesInvoiceLinesInput>;
};
export type ItemUpdateWithoutSalesInvoiceLinesInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    sku?: Prisma.StringFieldUpdateOperationsInput | string;
    barcode?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    category?: Prisma.EnumItemCategoryFieldUpdateOperationsInput | $Enums.ItemCategory;
    visibility?: Prisma.EnumItemVisibilityFieldUpdateOperationsInput | $Enums.ItemVisibility;
    price?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    cost?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    unit?: Prisma.StringFieldUpdateOperationsInput | string;
    isActive?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    stocks?: Prisma.ItemStockUpdateManyWithoutItemNestedInput;
};
export type ItemUncheckedUpdateWithoutSalesInvoiceLinesInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    sku?: Prisma.StringFieldUpdateOperationsInput | string;
    barcode?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    category?: Prisma.EnumItemCategoryFieldUpdateOperationsInput | $Enums.ItemCategory;
    visibility?: Prisma.EnumItemVisibilityFieldUpdateOperationsInput | $Enums.ItemVisibility;
    price?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    cost?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    unit?: Prisma.StringFieldUpdateOperationsInput | string;
    isActive?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    stocks?: Prisma.ItemStockUncheckedUpdateManyWithoutItemNestedInput;
};
export type ItemCountOutputType = {
    stocks: number;
    salesInvoiceLines: number;
};
export type ItemCountOutputTypeSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    stocks?: boolean | ItemCountOutputTypeCountStocksArgs;
    salesInvoiceLines?: boolean | ItemCountOutputTypeCountSalesInvoiceLinesArgs;
};
export type ItemCountOutputTypeDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ItemCountOutputTypeSelect<ExtArgs> | null;
};
export type ItemCountOutputTypeCountStocksArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.ItemStockWhereInput;
};
export type ItemCountOutputTypeCountSalesInvoiceLinesArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.SalesInvoiceLineWhereInput;
};
export type ItemSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    sku?: boolean;
    barcode?: boolean;
    name?: boolean;
    category?: boolean;
    visibility?: boolean;
    price?: boolean;
    cost?: boolean;
    unit?: boolean;
    isActive?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    stocks?: boolean | Prisma.Item$stocksArgs<ExtArgs>;
    salesInvoiceLines?: boolean | Prisma.Item$salesInvoiceLinesArgs<ExtArgs>;
    _count?: boolean | Prisma.ItemCountOutputTypeDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["item"]>;
export type ItemSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    sku?: boolean;
    barcode?: boolean;
    name?: boolean;
    category?: boolean;
    visibility?: boolean;
    price?: boolean;
    cost?: boolean;
    unit?: boolean;
    isActive?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
}, ExtArgs["result"]["item"]>;
export type ItemSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    sku?: boolean;
    barcode?: boolean;
    name?: boolean;
    category?: boolean;
    visibility?: boolean;
    price?: boolean;
    cost?: boolean;
    unit?: boolean;
    isActive?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
}, ExtArgs["result"]["item"]>;
export type ItemSelectScalar = {
    id?: boolean;
    sku?: boolean;
    barcode?: boolean;
    name?: boolean;
    category?: boolean;
    visibility?: boolean;
    price?: boolean;
    cost?: boolean;
    unit?: boolean;
    isActive?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
};
export type ItemOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "sku" | "barcode" | "name" | "category" | "visibility" | "price" | "cost" | "unit" | "isActive" | "createdAt" | "updatedAt", ExtArgs["result"]["item"]>;
export type ItemInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    stocks?: boolean | Prisma.Item$stocksArgs<ExtArgs>;
    salesInvoiceLines?: boolean | Prisma.Item$salesInvoiceLinesArgs<ExtArgs>;
    _count?: boolean | Prisma.ItemCountOutputTypeDefaultArgs<ExtArgs>;
};
export type ItemIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {};
export type ItemIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {};
export type $ItemPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "Item";
    objects: {
        stocks: Prisma.$ItemStockPayload<ExtArgs>[];
        salesInvoiceLines: Prisma.$SalesInvoiceLinePayload<ExtArgs>[];
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        sku: string;
        barcode: string | null;
        name: string;
        category: $Enums.ItemCategory;
        visibility: $Enums.ItemVisibility;
        price: runtime.Decimal;
        cost: runtime.Decimal;
        unit: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    }, ExtArgs["result"]["item"]>;
    composites: {};
};
export type ItemGetPayload<S extends boolean | null | undefined | ItemDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$ItemPayload, S>;
export type ItemCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<ItemFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: ItemCountAggregateInputType | true;
};
export interface ItemDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['Item'];
        meta: {
            name: 'Item';
        };
    };
    findUnique<T extends ItemFindUniqueArgs>(args: Prisma.SelectSubset<T, ItemFindUniqueArgs<ExtArgs>>): Prisma.Prisma__ItemClient<runtime.Types.Result.GetResult<Prisma.$ItemPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends ItemFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, ItemFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__ItemClient<runtime.Types.Result.GetResult<Prisma.$ItemPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends ItemFindFirstArgs>(args?: Prisma.SelectSubset<T, ItemFindFirstArgs<ExtArgs>>): Prisma.Prisma__ItemClient<runtime.Types.Result.GetResult<Prisma.$ItemPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends ItemFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, ItemFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__ItemClient<runtime.Types.Result.GetResult<Prisma.$ItemPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends ItemFindManyArgs>(args?: Prisma.SelectSubset<T, ItemFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$ItemPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends ItemCreateArgs>(args: Prisma.SelectSubset<T, ItemCreateArgs<ExtArgs>>): Prisma.Prisma__ItemClient<runtime.Types.Result.GetResult<Prisma.$ItemPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends ItemCreateManyArgs>(args?: Prisma.SelectSubset<T, ItemCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends ItemCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, ItemCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$ItemPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends ItemDeleteArgs>(args: Prisma.SelectSubset<T, ItemDeleteArgs<ExtArgs>>): Prisma.Prisma__ItemClient<runtime.Types.Result.GetResult<Prisma.$ItemPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends ItemUpdateArgs>(args: Prisma.SelectSubset<T, ItemUpdateArgs<ExtArgs>>): Prisma.Prisma__ItemClient<runtime.Types.Result.GetResult<Prisma.$ItemPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends ItemDeleteManyArgs>(args?: Prisma.SelectSubset<T, ItemDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends ItemUpdateManyArgs>(args: Prisma.SelectSubset<T, ItemUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends ItemUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, ItemUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$ItemPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends ItemUpsertArgs>(args: Prisma.SelectSubset<T, ItemUpsertArgs<ExtArgs>>): Prisma.Prisma__ItemClient<runtime.Types.Result.GetResult<Prisma.$ItemPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends ItemCountArgs>(args?: Prisma.Subset<T, ItemCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], ItemCountAggregateOutputType> : number>;
    aggregate<T extends ItemAggregateArgs>(args: Prisma.Subset<T, ItemAggregateArgs>): Prisma.PrismaPromise<GetItemAggregateType<T>>;
    groupBy<T extends ItemGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: ItemGroupByArgs['orderBy'];
    } : {
        orderBy?: ItemGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, ItemGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetItemGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: ItemFieldRefs;
}
export interface Prisma__ItemClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    stocks<T extends Prisma.Item$stocksArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.Item$stocksArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$ItemStockPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    salesInvoiceLines<T extends Prisma.Item$salesInvoiceLinesArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.Item$salesInvoiceLinesArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$SalesInvoiceLinePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface ItemFieldRefs {
    readonly id: Prisma.FieldRef<"Item", 'String'>;
    readonly sku: Prisma.FieldRef<"Item", 'String'>;
    readonly barcode: Prisma.FieldRef<"Item", 'String'>;
    readonly name: Prisma.FieldRef<"Item", 'String'>;
    readonly category: Prisma.FieldRef<"Item", 'ItemCategory'>;
    readonly visibility: Prisma.FieldRef<"Item", 'ItemVisibility'>;
    readonly price: Prisma.FieldRef<"Item", 'Decimal'>;
    readonly cost: Prisma.FieldRef<"Item", 'Decimal'>;
    readonly unit: Prisma.FieldRef<"Item", 'String'>;
    readonly isActive: Prisma.FieldRef<"Item", 'Boolean'>;
    readonly createdAt: Prisma.FieldRef<"Item", 'DateTime'>;
    readonly updatedAt: Prisma.FieldRef<"Item", 'DateTime'>;
}
export type ItemFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ItemSelect<ExtArgs> | null;
    omit?: Prisma.ItemOmit<ExtArgs> | null;
    include?: Prisma.ItemInclude<ExtArgs> | null;
    where: Prisma.ItemWhereUniqueInput;
};
export type ItemFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ItemSelect<ExtArgs> | null;
    omit?: Prisma.ItemOmit<ExtArgs> | null;
    include?: Prisma.ItemInclude<ExtArgs> | null;
    where: Prisma.ItemWhereUniqueInput;
};
export type ItemFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ItemSelect<ExtArgs> | null;
    omit?: Prisma.ItemOmit<ExtArgs> | null;
    include?: Prisma.ItemInclude<ExtArgs> | null;
    where?: Prisma.ItemWhereInput;
    orderBy?: Prisma.ItemOrderByWithRelationInput | Prisma.ItemOrderByWithRelationInput[];
    cursor?: Prisma.ItemWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.ItemScalarFieldEnum | Prisma.ItemScalarFieldEnum[];
};
export type ItemFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ItemSelect<ExtArgs> | null;
    omit?: Prisma.ItemOmit<ExtArgs> | null;
    include?: Prisma.ItemInclude<ExtArgs> | null;
    where?: Prisma.ItemWhereInput;
    orderBy?: Prisma.ItemOrderByWithRelationInput | Prisma.ItemOrderByWithRelationInput[];
    cursor?: Prisma.ItemWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.ItemScalarFieldEnum | Prisma.ItemScalarFieldEnum[];
};
export type ItemFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ItemSelect<ExtArgs> | null;
    omit?: Prisma.ItemOmit<ExtArgs> | null;
    include?: Prisma.ItemInclude<ExtArgs> | null;
    where?: Prisma.ItemWhereInput;
    orderBy?: Prisma.ItemOrderByWithRelationInput | Prisma.ItemOrderByWithRelationInput[];
    cursor?: Prisma.ItemWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.ItemScalarFieldEnum | Prisma.ItemScalarFieldEnum[];
};
export type ItemCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ItemSelect<ExtArgs> | null;
    omit?: Prisma.ItemOmit<ExtArgs> | null;
    include?: Prisma.ItemInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.ItemCreateInput, Prisma.ItemUncheckedCreateInput>;
};
export type ItemCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.ItemCreateManyInput | Prisma.ItemCreateManyInput[];
    skipDuplicates?: boolean;
};
export type ItemCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ItemSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.ItemOmit<ExtArgs> | null;
    data: Prisma.ItemCreateManyInput | Prisma.ItemCreateManyInput[];
    skipDuplicates?: boolean;
};
export type ItemUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ItemSelect<ExtArgs> | null;
    omit?: Prisma.ItemOmit<ExtArgs> | null;
    include?: Prisma.ItemInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.ItemUpdateInput, Prisma.ItemUncheckedUpdateInput>;
    where: Prisma.ItemWhereUniqueInput;
};
export type ItemUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.ItemUpdateManyMutationInput, Prisma.ItemUncheckedUpdateManyInput>;
    where?: Prisma.ItemWhereInput;
    limit?: number;
};
export type ItemUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ItemSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.ItemOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.ItemUpdateManyMutationInput, Prisma.ItemUncheckedUpdateManyInput>;
    where?: Prisma.ItemWhereInput;
    limit?: number;
};
export type ItemUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ItemSelect<ExtArgs> | null;
    omit?: Prisma.ItemOmit<ExtArgs> | null;
    include?: Prisma.ItemInclude<ExtArgs> | null;
    where: Prisma.ItemWhereUniqueInput;
    create: Prisma.XOR<Prisma.ItemCreateInput, Prisma.ItemUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.ItemUpdateInput, Prisma.ItemUncheckedUpdateInput>;
};
export type ItemDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ItemSelect<ExtArgs> | null;
    omit?: Prisma.ItemOmit<ExtArgs> | null;
    include?: Prisma.ItemInclude<ExtArgs> | null;
    where: Prisma.ItemWhereUniqueInput;
};
export type ItemDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.ItemWhereInput;
    limit?: number;
};
export type Item$stocksArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type Item$salesInvoiceLinesArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type ItemDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ItemSelect<ExtArgs> | null;
    omit?: Prisma.ItemOmit<ExtArgs> | null;
    include?: Prisma.ItemInclude<ExtArgs> | null;
};
