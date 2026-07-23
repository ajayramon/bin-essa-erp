import type * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "../internal/prismaNamespace.js";
export type JournalEntryLineModel = runtime.Types.Result.DefaultSelection<Prisma.$JournalEntryLinePayload>;
export type AggregateJournalEntryLine = {
    _count: JournalEntryLineCountAggregateOutputType | null;
    _avg: JournalEntryLineAvgAggregateOutputType | null;
    _sum: JournalEntryLineSumAggregateOutputType | null;
    _min: JournalEntryLineMinAggregateOutputType | null;
    _max: JournalEntryLineMaxAggregateOutputType | null;
};
export type JournalEntryLineAvgAggregateOutputType = {
    debit: runtime.Decimal | null;
    credit: runtime.Decimal | null;
};
export type JournalEntryLineSumAggregateOutputType = {
    debit: runtime.Decimal | null;
    credit: runtime.Decimal | null;
};
export type JournalEntryLineMinAggregateOutputType = {
    id: string | null;
    journalEntryId: string | null;
    accountId: string | null;
    debit: runtime.Decimal | null;
    credit: runtime.Decimal | null;
};
export type JournalEntryLineMaxAggregateOutputType = {
    id: string | null;
    journalEntryId: string | null;
    accountId: string | null;
    debit: runtime.Decimal | null;
    credit: runtime.Decimal | null;
};
export type JournalEntryLineCountAggregateOutputType = {
    id: number;
    journalEntryId: number;
    accountId: number;
    debit: number;
    credit: number;
    _all: number;
};
export type JournalEntryLineAvgAggregateInputType = {
    debit?: true;
    credit?: true;
};
export type JournalEntryLineSumAggregateInputType = {
    debit?: true;
    credit?: true;
};
export type JournalEntryLineMinAggregateInputType = {
    id?: true;
    journalEntryId?: true;
    accountId?: true;
    debit?: true;
    credit?: true;
};
export type JournalEntryLineMaxAggregateInputType = {
    id?: true;
    journalEntryId?: true;
    accountId?: true;
    debit?: true;
    credit?: true;
};
export type JournalEntryLineCountAggregateInputType = {
    id?: true;
    journalEntryId?: true;
    accountId?: true;
    debit?: true;
    credit?: true;
    _all?: true;
};
export type JournalEntryLineAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.JournalEntryLineWhereInput;
    orderBy?: Prisma.JournalEntryLineOrderByWithRelationInput | Prisma.JournalEntryLineOrderByWithRelationInput[];
    cursor?: Prisma.JournalEntryLineWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | JournalEntryLineCountAggregateInputType;
    _avg?: JournalEntryLineAvgAggregateInputType;
    _sum?: JournalEntryLineSumAggregateInputType;
    _min?: JournalEntryLineMinAggregateInputType;
    _max?: JournalEntryLineMaxAggregateInputType;
};
export type GetJournalEntryLineAggregateType<T extends JournalEntryLineAggregateArgs> = {
    [P in keyof T & keyof AggregateJournalEntryLine]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateJournalEntryLine[P]> : Prisma.GetScalarType<T[P], AggregateJournalEntryLine[P]>;
};
export type JournalEntryLineGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.JournalEntryLineWhereInput;
    orderBy?: Prisma.JournalEntryLineOrderByWithAggregationInput | Prisma.JournalEntryLineOrderByWithAggregationInput[];
    by: Prisma.JournalEntryLineScalarFieldEnum[] | Prisma.JournalEntryLineScalarFieldEnum;
    having?: Prisma.JournalEntryLineScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: JournalEntryLineCountAggregateInputType | true;
    _avg?: JournalEntryLineAvgAggregateInputType;
    _sum?: JournalEntryLineSumAggregateInputType;
    _min?: JournalEntryLineMinAggregateInputType;
    _max?: JournalEntryLineMaxAggregateInputType;
};
export type JournalEntryLineGroupByOutputType = {
    id: string;
    journalEntryId: string;
    accountId: string;
    debit: runtime.Decimal;
    credit: runtime.Decimal;
    _count: JournalEntryLineCountAggregateOutputType | null;
    _avg: JournalEntryLineAvgAggregateOutputType | null;
    _sum: JournalEntryLineSumAggregateOutputType | null;
    _min: JournalEntryLineMinAggregateOutputType | null;
    _max: JournalEntryLineMaxAggregateOutputType | null;
};
export type GetJournalEntryLineGroupByPayload<T extends JournalEntryLineGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<JournalEntryLineGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof JournalEntryLineGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], JournalEntryLineGroupByOutputType[P]> : Prisma.GetScalarType<T[P], JournalEntryLineGroupByOutputType[P]>;
}>>;
export type JournalEntryLineWhereInput = {
    AND?: Prisma.JournalEntryLineWhereInput | Prisma.JournalEntryLineWhereInput[];
    OR?: Prisma.JournalEntryLineWhereInput[];
    NOT?: Prisma.JournalEntryLineWhereInput | Prisma.JournalEntryLineWhereInput[];
    id?: Prisma.StringFilter<"JournalEntryLine"> | string;
    journalEntryId?: Prisma.StringFilter<"JournalEntryLine"> | string;
    accountId?: Prisma.StringFilter<"JournalEntryLine"> | string;
    debit?: Prisma.DecimalFilter<"JournalEntryLine"> | runtime.Decimal | runtime.DecimalJsLike | number | string;
    credit?: Prisma.DecimalFilter<"JournalEntryLine"> | runtime.Decimal | runtime.DecimalJsLike | number | string;
    journalEntry?: Prisma.XOR<Prisma.JournalEntryScalarRelationFilter, Prisma.JournalEntryWhereInput>;
    account?: Prisma.XOR<Prisma.AccountScalarRelationFilter, Prisma.AccountWhereInput>;
};
export type JournalEntryLineOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    journalEntryId?: Prisma.SortOrder;
    accountId?: Prisma.SortOrder;
    debit?: Prisma.SortOrder;
    credit?: Prisma.SortOrder;
    journalEntry?: Prisma.JournalEntryOrderByWithRelationInput;
    account?: Prisma.AccountOrderByWithRelationInput;
};
export type JournalEntryLineWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    AND?: Prisma.JournalEntryLineWhereInput | Prisma.JournalEntryLineWhereInput[];
    OR?: Prisma.JournalEntryLineWhereInput[];
    NOT?: Prisma.JournalEntryLineWhereInput | Prisma.JournalEntryLineWhereInput[];
    journalEntryId?: Prisma.StringFilter<"JournalEntryLine"> | string;
    accountId?: Prisma.StringFilter<"JournalEntryLine"> | string;
    debit?: Prisma.DecimalFilter<"JournalEntryLine"> | runtime.Decimal | runtime.DecimalJsLike | number | string;
    credit?: Prisma.DecimalFilter<"JournalEntryLine"> | runtime.Decimal | runtime.DecimalJsLike | number | string;
    journalEntry?: Prisma.XOR<Prisma.JournalEntryScalarRelationFilter, Prisma.JournalEntryWhereInput>;
    account?: Prisma.XOR<Prisma.AccountScalarRelationFilter, Prisma.AccountWhereInput>;
}, "id">;
export type JournalEntryLineOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    journalEntryId?: Prisma.SortOrder;
    accountId?: Prisma.SortOrder;
    debit?: Prisma.SortOrder;
    credit?: Prisma.SortOrder;
    _count?: Prisma.JournalEntryLineCountOrderByAggregateInput;
    _avg?: Prisma.JournalEntryLineAvgOrderByAggregateInput;
    _max?: Prisma.JournalEntryLineMaxOrderByAggregateInput;
    _min?: Prisma.JournalEntryLineMinOrderByAggregateInput;
    _sum?: Prisma.JournalEntryLineSumOrderByAggregateInput;
};
export type JournalEntryLineScalarWhereWithAggregatesInput = {
    AND?: Prisma.JournalEntryLineScalarWhereWithAggregatesInput | Prisma.JournalEntryLineScalarWhereWithAggregatesInput[];
    OR?: Prisma.JournalEntryLineScalarWhereWithAggregatesInput[];
    NOT?: Prisma.JournalEntryLineScalarWhereWithAggregatesInput | Prisma.JournalEntryLineScalarWhereWithAggregatesInput[];
    id?: Prisma.StringWithAggregatesFilter<"JournalEntryLine"> | string;
    journalEntryId?: Prisma.StringWithAggregatesFilter<"JournalEntryLine"> | string;
    accountId?: Prisma.StringWithAggregatesFilter<"JournalEntryLine"> | string;
    debit?: Prisma.DecimalWithAggregatesFilter<"JournalEntryLine"> | runtime.Decimal | runtime.DecimalJsLike | number | string;
    credit?: Prisma.DecimalWithAggregatesFilter<"JournalEntryLine"> | runtime.Decimal | runtime.DecimalJsLike | number | string;
};
export type JournalEntryLineCreateInput = {
    id?: string;
    debit?: runtime.Decimal | runtime.DecimalJsLike | number | string;
    credit?: runtime.Decimal | runtime.DecimalJsLike | number | string;
    journalEntry: Prisma.JournalEntryCreateNestedOneWithoutLinesInput;
    account: Prisma.AccountCreateNestedOneWithoutJournalEntryLinesInput;
};
export type JournalEntryLineUncheckedCreateInput = {
    id?: string;
    journalEntryId: string;
    accountId: string;
    debit?: runtime.Decimal | runtime.DecimalJsLike | number | string;
    credit?: runtime.Decimal | runtime.DecimalJsLike | number | string;
};
export type JournalEntryLineUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    debit?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    credit?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    journalEntry?: Prisma.JournalEntryUpdateOneRequiredWithoutLinesNestedInput;
    account?: Prisma.AccountUpdateOneRequiredWithoutJournalEntryLinesNestedInput;
};
export type JournalEntryLineUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    journalEntryId?: Prisma.StringFieldUpdateOperationsInput | string;
    accountId?: Prisma.StringFieldUpdateOperationsInput | string;
    debit?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    credit?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
};
export type JournalEntryLineCreateManyInput = {
    id?: string;
    journalEntryId: string;
    accountId: string;
    debit?: runtime.Decimal | runtime.DecimalJsLike | number | string;
    credit?: runtime.Decimal | runtime.DecimalJsLike | number | string;
};
export type JournalEntryLineUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    debit?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    credit?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
};
export type JournalEntryLineUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    journalEntryId?: Prisma.StringFieldUpdateOperationsInput | string;
    accountId?: Prisma.StringFieldUpdateOperationsInput | string;
    debit?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    credit?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
};
export type JournalEntryLineListRelationFilter = {
    every?: Prisma.JournalEntryLineWhereInput;
    some?: Prisma.JournalEntryLineWhereInput;
    none?: Prisma.JournalEntryLineWhereInput;
};
export type JournalEntryLineOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type JournalEntryLineCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    journalEntryId?: Prisma.SortOrder;
    accountId?: Prisma.SortOrder;
    debit?: Prisma.SortOrder;
    credit?: Prisma.SortOrder;
};
export type JournalEntryLineAvgOrderByAggregateInput = {
    debit?: Prisma.SortOrder;
    credit?: Prisma.SortOrder;
};
export type JournalEntryLineMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    journalEntryId?: Prisma.SortOrder;
    accountId?: Prisma.SortOrder;
    debit?: Prisma.SortOrder;
    credit?: Prisma.SortOrder;
};
export type JournalEntryLineMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    journalEntryId?: Prisma.SortOrder;
    accountId?: Prisma.SortOrder;
    debit?: Prisma.SortOrder;
    credit?: Prisma.SortOrder;
};
export type JournalEntryLineSumOrderByAggregateInput = {
    debit?: Prisma.SortOrder;
    credit?: Prisma.SortOrder;
};
export type JournalEntryLineCreateNestedManyWithoutAccountInput = {
    create?: Prisma.XOR<Prisma.JournalEntryLineCreateWithoutAccountInput, Prisma.JournalEntryLineUncheckedCreateWithoutAccountInput> | Prisma.JournalEntryLineCreateWithoutAccountInput[] | Prisma.JournalEntryLineUncheckedCreateWithoutAccountInput[];
    connectOrCreate?: Prisma.JournalEntryLineCreateOrConnectWithoutAccountInput | Prisma.JournalEntryLineCreateOrConnectWithoutAccountInput[];
    createMany?: Prisma.JournalEntryLineCreateManyAccountInputEnvelope;
    connect?: Prisma.JournalEntryLineWhereUniqueInput | Prisma.JournalEntryLineWhereUniqueInput[];
};
export type JournalEntryLineUncheckedCreateNestedManyWithoutAccountInput = {
    create?: Prisma.XOR<Prisma.JournalEntryLineCreateWithoutAccountInput, Prisma.JournalEntryLineUncheckedCreateWithoutAccountInput> | Prisma.JournalEntryLineCreateWithoutAccountInput[] | Prisma.JournalEntryLineUncheckedCreateWithoutAccountInput[];
    connectOrCreate?: Prisma.JournalEntryLineCreateOrConnectWithoutAccountInput | Prisma.JournalEntryLineCreateOrConnectWithoutAccountInput[];
    createMany?: Prisma.JournalEntryLineCreateManyAccountInputEnvelope;
    connect?: Prisma.JournalEntryLineWhereUniqueInput | Prisma.JournalEntryLineWhereUniqueInput[];
};
export type JournalEntryLineUpdateManyWithoutAccountNestedInput = {
    create?: Prisma.XOR<Prisma.JournalEntryLineCreateWithoutAccountInput, Prisma.JournalEntryLineUncheckedCreateWithoutAccountInput> | Prisma.JournalEntryLineCreateWithoutAccountInput[] | Prisma.JournalEntryLineUncheckedCreateWithoutAccountInput[];
    connectOrCreate?: Prisma.JournalEntryLineCreateOrConnectWithoutAccountInput | Prisma.JournalEntryLineCreateOrConnectWithoutAccountInput[];
    upsert?: Prisma.JournalEntryLineUpsertWithWhereUniqueWithoutAccountInput | Prisma.JournalEntryLineUpsertWithWhereUniqueWithoutAccountInput[];
    createMany?: Prisma.JournalEntryLineCreateManyAccountInputEnvelope;
    set?: Prisma.JournalEntryLineWhereUniqueInput | Prisma.JournalEntryLineWhereUniqueInput[];
    disconnect?: Prisma.JournalEntryLineWhereUniqueInput | Prisma.JournalEntryLineWhereUniqueInput[];
    delete?: Prisma.JournalEntryLineWhereUniqueInput | Prisma.JournalEntryLineWhereUniqueInput[];
    connect?: Prisma.JournalEntryLineWhereUniqueInput | Prisma.JournalEntryLineWhereUniqueInput[];
    update?: Prisma.JournalEntryLineUpdateWithWhereUniqueWithoutAccountInput | Prisma.JournalEntryLineUpdateWithWhereUniqueWithoutAccountInput[];
    updateMany?: Prisma.JournalEntryLineUpdateManyWithWhereWithoutAccountInput | Prisma.JournalEntryLineUpdateManyWithWhereWithoutAccountInput[];
    deleteMany?: Prisma.JournalEntryLineScalarWhereInput | Prisma.JournalEntryLineScalarWhereInput[];
};
export type JournalEntryLineUncheckedUpdateManyWithoutAccountNestedInput = {
    create?: Prisma.XOR<Prisma.JournalEntryLineCreateWithoutAccountInput, Prisma.JournalEntryLineUncheckedCreateWithoutAccountInput> | Prisma.JournalEntryLineCreateWithoutAccountInput[] | Prisma.JournalEntryLineUncheckedCreateWithoutAccountInput[];
    connectOrCreate?: Prisma.JournalEntryLineCreateOrConnectWithoutAccountInput | Prisma.JournalEntryLineCreateOrConnectWithoutAccountInput[];
    upsert?: Prisma.JournalEntryLineUpsertWithWhereUniqueWithoutAccountInput | Prisma.JournalEntryLineUpsertWithWhereUniqueWithoutAccountInput[];
    createMany?: Prisma.JournalEntryLineCreateManyAccountInputEnvelope;
    set?: Prisma.JournalEntryLineWhereUniqueInput | Prisma.JournalEntryLineWhereUniqueInput[];
    disconnect?: Prisma.JournalEntryLineWhereUniqueInput | Prisma.JournalEntryLineWhereUniqueInput[];
    delete?: Prisma.JournalEntryLineWhereUniqueInput | Prisma.JournalEntryLineWhereUniqueInput[];
    connect?: Prisma.JournalEntryLineWhereUniqueInput | Prisma.JournalEntryLineWhereUniqueInput[];
    update?: Prisma.JournalEntryLineUpdateWithWhereUniqueWithoutAccountInput | Prisma.JournalEntryLineUpdateWithWhereUniqueWithoutAccountInput[];
    updateMany?: Prisma.JournalEntryLineUpdateManyWithWhereWithoutAccountInput | Prisma.JournalEntryLineUpdateManyWithWhereWithoutAccountInput[];
    deleteMany?: Prisma.JournalEntryLineScalarWhereInput | Prisma.JournalEntryLineScalarWhereInput[];
};
export type JournalEntryLineCreateNestedManyWithoutJournalEntryInput = {
    create?: Prisma.XOR<Prisma.JournalEntryLineCreateWithoutJournalEntryInput, Prisma.JournalEntryLineUncheckedCreateWithoutJournalEntryInput> | Prisma.JournalEntryLineCreateWithoutJournalEntryInput[] | Prisma.JournalEntryLineUncheckedCreateWithoutJournalEntryInput[];
    connectOrCreate?: Prisma.JournalEntryLineCreateOrConnectWithoutJournalEntryInput | Prisma.JournalEntryLineCreateOrConnectWithoutJournalEntryInput[];
    createMany?: Prisma.JournalEntryLineCreateManyJournalEntryInputEnvelope;
    connect?: Prisma.JournalEntryLineWhereUniqueInput | Prisma.JournalEntryLineWhereUniqueInput[];
};
export type JournalEntryLineUncheckedCreateNestedManyWithoutJournalEntryInput = {
    create?: Prisma.XOR<Prisma.JournalEntryLineCreateWithoutJournalEntryInput, Prisma.JournalEntryLineUncheckedCreateWithoutJournalEntryInput> | Prisma.JournalEntryLineCreateWithoutJournalEntryInput[] | Prisma.JournalEntryLineUncheckedCreateWithoutJournalEntryInput[];
    connectOrCreate?: Prisma.JournalEntryLineCreateOrConnectWithoutJournalEntryInput | Prisma.JournalEntryLineCreateOrConnectWithoutJournalEntryInput[];
    createMany?: Prisma.JournalEntryLineCreateManyJournalEntryInputEnvelope;
    connect?: Prisma.JournalEntryLineWhereUniqueInput | Prisma.JournalEntryLineWhereUniqueInput[];
};
export type JournalEntryLineUpdateManyWithoutJournalEntryNestedInput = {
    create?: Prisma.XOR<Prisma.JournalEntryLineCreateWithoutJournalEntryInput, Prisma.JournalEntryLineUncheckedCreateWithoutJournalEntryInput> | Prisma.JournalEntryLineCreateWithoutJournalEntryInput[] | Prisma.JournalEntryLineUncheckedCreateWithoutJournalEntryInput[];
    connectOrCreate?: Prisma.JournalEntryLineCreateOrConnectWithoutJournalEntryInput | Prisma.JournalEntryLineCreateOrConnectWithoutJournalEntryInput[];
    upsert?: Prisma.JournalEntryLineUpsertWithWhereUniqueWithoutJournalEntryInput | Prisma.JournalEntryLineUpsertWithWhereUniqueWithoutJournalEntryInput[];
    createMany?: Prisma.JournalEntryLineCreateManyJournalEntryInputEnvelope;
    set?: Prisma.JournalEntryLineWhereUniqueInput | Prisma.JournalEntryLineWhereUniqueInput[];
    disconnect?: Prisma.JournalEntryLineWhereUniqueInput | Prisma.JournalEntryLineWhereUniqueInput[];
    delete?: Prisma.JournalEntryLineWhereUniqueInput | Prisma.JournalEntryLineWhereUniqueInput[];
    connect?: Prisma.JournalEntryLineWhereUniqueInput | Prisma.JournalEntryLineWhereUniqueInput[];
    update?: Prisma.JournalEntryLineUpdateWithWhereUniqueWithoutJournalEntryInput | Prisma.JournalEntryLineUpdateWithWhereUniqueWithoutJournalEntryInput[];
    updateMany?: Prisma.JournalEntryLineUpdateManyWithWhereWithoutJournalEntryInput | Prisma.JournalEntryLineUpdateManyWithWhereWithoutJournalEntryInput[];
    deleteMany?: Prisma.JournalEntryLineScalarWhereInput | Prisma.JournalEntryLineScalarWhereInput[];
};
export type JournalEntryLineUncheckedUpdateManyWithoutJournalEntryNestedInput = {
    create?: Prisma.XOR<Prisma.JournalEntryLineCreateWithoutJournalEntryInput, Prisma.JournalEntryLineUncheckedCreateWithoutJournalEntryInput> | Prisma.JournalEntryLineCreateWithoutJournalEntryInput[] | Prisma.JournalEntryLineUncheckedCreateWithoutJournalEntryInput[];
    connectOrCreate?: Prisma.JournalEntryLineCreateOrConnectWithoutJournalEntryInput | Prisma.JournalEntryLineCreateOrConnectWithoutJournalEntryInput[];
    upsert?: Prisma.JournalEntryLineUpsertWithWhereUniqueWithoutJournalEntryInput | Prisma.JournalEntryLineUpsertWithWhereUniqueWithoutJournalEntryInput[];
    createMany?: Prisma.JournalEntryLineCreateManyJournalEntryInputEnvelope;
    set?: Prisma.JournalEntryLineWhereUniqueInput | Prisma.JournalEntryLineWhereUniqueInput[];
    disconnect?: Prisma.JournalEntryLineWhereUniqueInput | Prisma.JournalEntryLineWhereUniqueInput[];
    delete?: Prisma.JournalEntryLineWhereUniqueInput | Prisma.JournalEntryLineWhereUniqueInput[];
    connect?: Prisma.JournalEntryLineWhereUniqueInput | Prisma.JournalEntryLineWhereUniqueInput[];
    update?: Prisma.JournalEntryLineUpdateWithWhereUniqueWithoutJournalEntryInput | Prisma.JournalEntryLineUpdateWithWhereUniqueWithoutJournalEntryInput[];
    updateMany?: Prisma.JournalEntryLineUpdateManyWithWhereWithoutJournalEntryInput | Prisma.JournalEntryLineUpdateManyWithWhereWithoutJournalEntryInput[];
    deleteMany?: Prisma.JournalEntryLineScalarWhereInput | Prisma.JournalEntryLineScalarWhereInput[];
};
export type JournalEntryLineCreateWithoutAccountInput = {
    id?: string;
    debit?: runtime.Decimal | runtime.DecimalJsLike | number | string;
    credit?: runtime.Decimal | runtime.DecimalJsLike | number | string;
    journalEntry: Prisma.JournalEntryCreateNestedOneWithoutLinesInput;
};
export type JournalEntryLineUncheckedCreateWithoutAccountInput = {
    id?: string;
    journalEntryId: string;
    debit?: runtime.Decimal | runtime.DecimalJsLike | number | string;
    credit?: runtime.Decimal | runtime.DecimalJsLike | number | string;
};
export type JournalEntryLineCreateOrConnectWithoutAccountInput = {
    where: Prisma.JournalEntryLineWhereUniqueInput;
    create: Prisma.XOR<Prisma.JournalEntryLineCreateWithoutAccountInput, Prisma.JournalEntryLineUncheckedCreateWithoutAccountInput>;
};
export type JournalEntryLineCreateManyAccountInputEnvelope = {
    data: Prisma.JournalEntryLineCreateManyAccountInput | Prisma.JournalEntryLineCreateManyAccountInput[];
    skipDuplicates?: boolean;
};
export type JournalEntryLineUpsertWithWhereUniqueWithoutAccountInput = {
    where: Prisma.JournalEntryLineWhereUniqueInput;
    update: Prisma.XOR<Prisma.JournalEntryLineUpdateWithoutAccountInput, Prisma.JournalEntryLineUncheckedUpdateWithoutAccountInput>;
    create: Prisma.XOR<Prisma.JournalEntryLineCreateWithoutAccountInput, Prisma.JournalEntryLineUncheckedCreateWithoutAccountInput>;
};
export type JournalEntryLineUpdateWithWhereUniqueWithoutAccountInput = {
    where: Prisma.JournalEntryLineWhereUniqueInput;
    data: Prisma.XOR<Prisma.JournalEntryLineUpdateWithoutAccountInput, Prisma.JournalEntryLineUncheckedUpdateWithoutAccountInput>;
};
export type JournalEntryLineUpdateManyWithWhereWithoutAccountInput = {
    where: Prisma.JournalEntryLineScalarWhereInput;
    data: Prisma.XOR<Prisma.JournalEntryLineUpdateManyMutationInput, Prisma.JournalEntryLineUncheckedUpdateManyWithoutAccountInput>;
};
export type JournalEntryLineScalarWhereInput = {
    AND?: Prisma.JournalEntryLineScalarWhereInput | Prisma.JournalEntryLineScalarWhereInput[];
    OR?: Prisma.JournalEntryLineScalarWhereInput[];
    NOT?: Prisma.JournalEntryLineScalarWhereInput | Prisma.JournalEntryLineScalarWhereInput[];
    id?: Prisma.StringFilter<"JournalEntryLine"> | string;
    journalEntryId?: Prisma.StringFilter<"JournalEntryLine"> | string;
    accountId?: Prisma.StringFilter<"JournalEntryLine"> | string;
    debit?: Prisma.DecimalFilter<"JournalEntryLine"> | runtime.Decimal | runtime.DecimalJsLike | number | string;
    credit?: Prisma.DecimalFilter<"JournalEntryLine"> | runtime.Decimal | runtime.DecimalJsLike | number | string;
};
export type JournalEntryLineCreateWithoutJournalEntryInput = {
    id?: string;
    debit?: runtime.Decimal | runtime.DecimalJsLike | number | string;
    credit?: runtime.Decimal | runtime.DecimalJsLike | number | string;
    account: Prisma.AccountCreateNestedOneWithoutJournalEntryLinesInput;
};
export type JournalEntryLineUncheckedCreateWithoutJournalEntryInput = {
    id?: string;
    accountId: string;
    debit?: runtime.Decimal | runtime.DecimalJsLike | number | string;
    credit?: runtime.Decimal | runtime.DecimalJsLike | number | string;
};
export type JournalEntryLineCreateOrConnectWithoutJournalEntryInput = {
    where: Prisma.JournalEntryLineWhereUniqueInput;
    create: Prisma.XOR<Prisma.JournalEntryLineCreateWithoutJournalEntryInput, Prisma.JournalEntryLineUncheckedCreateWithoutJournalEntryInput>;
};
export type JournalEntryLineCreateManyJournalEntryInputEnvelope = {
    data: Prisma.JournalEntryLineCreateManyJournalEntryInput | Prisma.JournalEntryLineCreateManyJournalEntryInput[];
    skipDuplicates?: boolean;
};
export type JournalEntryLineUpsertWithWhereUniqueWithoutJournalEntryInput = {
    where: Prisma.JournalEntryLineWhereUniqueInput;
    update: Prisma.XOR<Prisma.JournalEntryLineUpdateWithoutJournalEntryInput, Prisma.JournalEntryLineUncheckedUpdateWithoutJournalEntryInput>;
    create: Prisma.XOR<Prisma.JournalEntryLineCreateWithoutJournalEntryInput, Prisma.JournalEntryLineUncheckedCreateWithoutJournalEntryInput>;
};
export type JournalEntryLineUpdateWithWhereUniqueWithoutJournalEntryInput = {
    where: Prisma.JournalEntryLineWhereUniqueInput;
    data: Prisma.XOR<Prisma.JournalEntryLineUpdateWithoutJournalEntryInput, Prisma.JournalEntryLineUncheckedUpdateWithoutJournalEntryInput>;
};
export type JournalEntryLineUpdateManyWithWhereWithoutJournalEntryInput = {
    where: Prisma.JournalEntryLineScalarWhereInput;
    data: Prisma.XOR<Prisma.JournalEntryLineUpdateManyMutationInput, Prisma.JournalEntryLineUncheckedUpdateManyWithoutJournalEntryInput>;
};
export type JournalEntryLineCreateManyAccountInput = {
    id?: string;
    journalEntryId: string;
    debit?: runtime.Decimal | runtime.DecimalJsLike | number | string;
    credit?: runtime.Decimal | runtime.DecimalJsLike | number | string;
};
export type JournalEntryLineUpdateWithoutAccountInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    debit?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    credit?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    journalEntry?: Prisma.JournalEntryUpdateOneRequiredWithoutLinesNestedInput;
};
export type JournalEntryLineUncheckedUpdateWithoutAccountInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    journalEntryId?: Prisma.StringFieldUpdateOperationsInput | string;
    debit?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    credit?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
};
export type JournalEntryLineUncheckedUpdateManyWithoutAccountInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    journalEntryId?: Prisma.StringFieldUpdateOperationsInput | string;
    debit?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    credit?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
};
export type JournalEntryLineCreateManyJournalEntryInput = {
    id?: string;
    accountId: string;
    debit?: runtime.Decimal | runtime.DecimalJsLike | number | string;
    credit?: runtime.Decimal | runtime.DecimalJsLike | number | string;
};
export type JournalEntryLineUpdateWithoutJournalEntryInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    debit?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    credit?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    account?: Prisma.AccountUpdateOneRequiredWithoutJournalEntryLinesNestedInput;
};
export type JournalEntryLineUncheckedUpdateWithoutJournalEntryInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    accountId?: Prisma.StringFieldUpdateOperationsInput | string;
    debit?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    credit?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
};
export type JournalEntryLineUncheckedUpdateManyWithoutJournalEntryInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    accountId?: Prisma.StringFieldUpdateOperationsInput | string;
    debit?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    credit?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
};
export type JournalEntryLineSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    journalEntryId?: boolean;
    accountId?: boolean;
    debit?: boolean;
    credit?: boolean;
    journalEntry?: boolean | Prisma.JournalEntryDefaultArgs<ExtArgs>;
    account?: boolean | Prisma.AccountDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["journalEntryLine"]>;
export type JournalEntryLineSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    journalEntryId?: boolean;
    accountId?: boolean;
    debit?: boolean;
    credit?: boolean;
    journalEntry?: boolean | Prisma.JournalEntryDefaultArgs<ExtArgs>;
    account?: boolean | Prisma.AccountDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["journalEntryLine"]>;
export type JournalEntryLineSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    journalEntryId?: boolean;
    accountId?: boolean;
    debit?: boolean;
    credit?: boolean;
    journalEntry?: boolean | Prisma.JournalEntryDefaultArgs<ExtArgs>;
    account?: boolean | Prisma.AccountDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["journalEntryLine"]>;
export type JournalEntryLineSelectScalar = {
    id?: boolean;
    journalEntryId?: boolean;
    accountId?: boolean;
    debit?: boolean;
    credit?: boolean;
};
export type JournalEntryLineOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "journalEntryId" | "accountId" | "debit" | "credit", ExtArgs["result"]["journalEntryLine"]>;
export type JournalEntryLineInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    journalEntry?: boolean | Prisma.JournalEntryDefaultArgs<ExtArgs>;
    account?: boolean | Prisma.AccountDefaultArgs<ExtArgs>;
};
export type JournalEntryLineIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    journalEntry?: boolean | Prisma.JournalEntryDefaultArgs<ExtArgs>;
    account?: boolean | Prisma.AccountDefaultArgs<ExtArgs>;
};
export type JournalEntryLineIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    journalEntry?: boolean | Prisma.JournalEntryDefaultArgs<ExtArgs>;
    account?: boolean | Prisma.AccountDefaultArgs<ExtArgs>;
};
export type $JournalEntryLinePayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "JournalEntryLine";
    objects: {
        journalEntry: Prisma.$JournalEntryPayload<ExtArgs>;
        account: Prisma.$AccountPayload<ExtArgs>;
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        journalEntryId: string;
        accountId: string;
        debit: runtime.Decimal;
        credit: runtime.Decimal;
    }, ExtArgs["result"]["journalEntryLine"]>;
    composites: {};
};
export type JournalEntryLineGetPayload<S extends boolean | null | undefined | JournalEntryLineDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$JournalEntryLinePayload, S>;
export type JournalEntryLineCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<JournalEntryLineFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: JournalEntryLineCountAggregateInputType | true;
};
export interface JournalEntryLineDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['JournalEntryLine'];
        meta: {
            name: 'JournalEntryLine';
        };
    };
    findUnique<T extends JournalEntryLineFindUniqueArgs>(args: Prisma.SelectSubset<T, JournalEntryLineFindUniqueArgs<ExtArgs>>): Prisma.Prisma__JournalEntryLineClient<runtime.Types.Result.GetResult<Prisma.$JournalEntryLinePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends JournalEntryLineFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, JournalEntryLineFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__JournalEntryLineClient<runtime.Types.Result.GetResult<Prisma.$JournalEntryLinePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends JournalEntryLineFindFirstArgs>(args?: Prisma.SelectSubset<T, JournalEntryLineFindFirstArgs<ExtArgs>>): Prisma.Prisma__JournalEntryLineClient<runtime.Types.Result.GetResult<Prisma.$JournalEntryLinePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends JournalEntryLineFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, JournalEntryLineFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__JournalEntryLineClient<runtime.Types.Result.GetResult<Prisma.$JournalEntryLinePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends JournalEntryLineFindManyArgs>(args?: Prisma.SelectSubset<T, JournalEntryLineFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$JournalEntryLinePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends JournalEntryLineCreateArgs>(args: Prisma.SelectSubset<T, JournalEntryLineCreateArgs<ExtArgs>>): Prisma.Prisma__JournalEntryLineClient<runtime.Types.Result.GetResult<Prisma.$JournalEntryLinePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends JournalEntryLineCreateManyArgs>(args?: Prisma.SelectSubset<T, JournalEntryLineCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends JournalEntryLineCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, JournalEntryLineCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$JournalEntryLinePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends JournalEntryLineDeleteArgs>(args: Prisma.SelectSubset<T, JournalEntryLineDeleteArgs<ExtArgs>>): Prisma.Prisma__JournalEntryLineClient<runtime.Types.Result.GetResult<Prisma.$JournalEntryLinePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends JournalEntryLineUpdateArgs>(args: Prisma.SelectSubset<T, JournalEntryLineUpdateArgs<ExtArgs>>): Prisma.Prisma__JournalEntryLineClient<runtime.Types.Result.GetResult<Prisma.$JournalEntryLinePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends JournalEntryLineDeleteManyArgs>(args?: Prisma.SelectSubset<T, JournalEntryLineDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends JournalEntryLineUpdateManyArgs>(args: Prisma.SelectSubset<T, JournalEntryLineUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends JournalEntryLineUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, JournalEntryLineUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$JournalEntryLinePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends JournalEntryLineUpsertArgs>(args: Prisma.SelectSubset<T, JournalEntryLineUpsertArgs<ExtArgs>>): Prisma.Prisma__JournalEntryLineClient<runtime.Types.Result.GetResult<Prisma.$JournalEntryLinePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends JournalEntryLineCountArgs>(args?: Prisma.Subset<T, JournalEntryLineCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], JournalEntryLineCountAggregateOutputType> : number>;
    aggregate<T extends JournalEntryLineAggregateArgs>(args: Prisma.Subset<T, JournalEntryLineAggregateArgs>): Prisma.PrismaPromise<GetJournalEntryLineAggregateType<T>>;
    groupBy<T extends JournalEntryLineGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: JournalEntryLineGroupByArgs['orderBy'];
    } : {
        orderBy?: JournalEntryLineGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, JournalEntryLineGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetJournalEntryLineGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: JournalEntryLineFieldRefs;
}
export interface Prisma__JournalEntryLineClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    journalEntry<T extends Prisma.JournalEntryDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.JournalEntryDefaultArgs<ExtArgs>>): Prisma.Prisma__JournalEntryClient<runtime.Types.Result.GetResult<Prisma.$JournalEntryPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    account<T extends Prisma.AccountDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.AccountDefaultArgs<ExtArgs>>): Prisma.Prisma__AccountClient<runtime.Types.Result.GetResult<Prisma.$AccountPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface JournalEntryLineFieldRefs {
    readonly id: Prisma.FieldRef<"JournalEntryLine", 'String'>;
    readonly journalEntryId: Prisma.FieldRef<"JournalEntryLine", 'String'>;
    readonly accountId: Prisma.FieldRef<"JournalEntryLine", 'String'>;
    readonly debit: Prisma.FieldRef<"JournalEntryLine", 'Decimal'>;
    readonly credit: Prisma.FieldRef<"JournalEntryLine", 'Decimal'>;
}
export type JournalEntryLineFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.JournalEntryLineSelect<ExtArgs> | null;
    omit?: Prisma.JournalEntryLineOmit<ExtArgs> | null;
    include?: Prisma.JournalEntryLineInclude<ExtArgs> | null;
    where: Prisma.JournalEntryLineWhereUniqueInput;
};
export type JournalEntryLineFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.JournalEntryLineSelect<ExtArgs> | null;
    omit?: Prisma.JournalEntryLineOmit<ExtArgs> | null;
    include?: Prisma.JournalEntryLineInclude<ExtArgs> | null;
    where: Prisma.JournalEntryLineWhereUniqueInput;
};
export type JournalEntryLineFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type JournalEntryLineFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type JournalEntryLineFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type JournalEntryLineCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.JournalEntryLineSelect<ExtArgs> | null;
    omit?: Prisma.JournalEntryLineOmit<ExtArgs> | null;
    include?: Prisma.JournalEntryLineInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.JournalEntryLineCreateInput, Prisma.JournalEntryLineUncheckedCreateInput>;
};
export type JournalEntryLineCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.JournalEntryLineCreateManyInput | Prisma.JournalEntryLineCreateManyInput[];
    skipDuplicates?: boolean;
};
export type JournalEntryLineCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.JournalEntryLineSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.JournalEntryLineOmit<ExtArgs> | null;
    data: Prisma.JournalEntryLineCreateManyInput | Prisma.JournalEntryLineCreateManyInput[];
    skipDuplicates?: boolean;
    include?: Prisma.JournalEntryLineIncludeCreateManyAndReturn<ExtArgs> | null;
};
export type JournalEntryLineUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.JournalEntryLineSelect<ExtArgs> | null;
    omit?: Prisma.JournalEntryLineOmit<ExtArgs> | null;
    include?: Prisma.JournalEntryLineInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.JournalEntryLineUpdateInput, Prisma.JournalEntryLineUncheckedUpdateInput>;
    where: Prisma.JournalEntryLineWhereUniqueInput;
};
export type JournalEntryLineUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.JournalEntryLineUpdateManyMutationInput, Prisma.JournalEntryLineUncheckedUpdateManyInput>;
    where?: Prisma.JournalEntryLineWhereInput;
    limit?: number;
};
export type JournalEntryLineUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.JournalEntryLineSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.JournalEntryLineOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.JournalEntryLineUpdateManyMutationInput, Prisma.JournalEntryLineUncheckedUpdateManyInput>;
    where?: Prisma.JournalEntryLineWhereInput;
    limit?: number;
    include?: Prisma.JournalEntryLineIncludeUpdateManyAndReturn<ExtArgs> | null;
};
export type JournalEntryLineUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.JournalEntryLineSelect<ExtArgs> | null;
    omit?: Prisma.JournalEntryLineOmit<ExtArgs> | null;
    include?: Prisma.JournalEntryLineInclude<ExtArgs> | null;
    where: Prisma.JournalEntryLineWhereUniqueInput;
    create: Prisma.XOR<Prisma.JournalEntryLineCreateInput, Prisma.JournalEntryLineUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.JournalEntryLineUpdateInput, Prisma.JournalEntryLineUncheckedUpdateInput>;
};
export type JournalEntryLineDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.JournalEntryLineSelect<ExtArgs> | null;
    omit?: Prisma.JournalEntryLineOmit<ExtArgs> | null;
    include?: Prisma.JournalEntryLineInclude<ExtArgs> | null;
    where: Prisma.JournalEntryLineWhereUniqueInput;
};
export type JournalEntryLineDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.JournalEntryLineWhereInput;
    limit?: number;
};
export type JournalEntryLineDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.JournalEntryLineSelect<ExtArgs> | null;
    omit?: Prisma.JournalEntryLineOmit<ExtArgs> | null;
    include?: Prisma.JournalEntryLineInclude<ExtArgs> | null;
};
