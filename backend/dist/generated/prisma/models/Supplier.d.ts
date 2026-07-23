import type * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "../internal/prismaNamespace.js";
export type SupplierModel = runtime.Types.Result.DefaultSelection<Prisma.$SupplierPayload>;
export type AggregateSupplier = {
    _count: SupplierCountAggregateOutputType | null;
    _min: SupplierMinAggregateOutputType | null;
    _max: SupplierMaxAggregateOutputType | null;
};
export type SupplierMinAggregateOutputType = {
    id: string | null;
    code: string | null;
    name: string | null;
    phone: string | null;
    email: string | null;
    address: string | null;
    branchId: string | null;
    createdAt: Date | null;
    updatedAt: Date | null;
};
export type SupplierMaxAggregateOutputType = {
    id: string | null;
    code: string | null;
    name: string | null;
    phone: string | null;
    email: string | null;
    address: string | null;
    branchId: string | null;
    createdAt: Date | null;
    updatedAt: Date | null;
};
export type SupplierCountAggregateOutputType = {
    id: number;
    code: number;
    name: number;
    phone: number;
    email: number;
    address: number;
    branchId: number;
    createdAt: number;
    updatedAt: number;
    _all: number;
};
export type SupplierMinAggregateInputType = {
    id?: true;
    code?: true;
    name?: true;
    phone?: true;
    email?: true;
    address?: true;
    branchId?: true;
    createdAt?: true;
    updatedAt?: true;
};
export type SupplierMaxAggregateInputType = {
    id?: true;
    code?: true;
    name?: true;
    phone?: true;
    email?: true;
    address?: true;
    branchId?: true;
    createdAt?: true;
    updatedAt?: true;
};
export type SupplierCountAggregateInputType = {
    id?: true;
    code?: true;
    name?: true;
    phone?: true;
    email?: true;
    address?: true;
    branchId?: true;
    createdAt?: true;
    updatedAt?: true;
    _all?: true;
};
export type SupplierAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.SupplierWhereInput;
    orderBy?: Prisma.SupplierOrderByWithRelationInput | Prisma.SupplierOrderByWithRelationInput[];
    cursor?: Prisma.SupplierWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | SupplierCountAggregateInputType;
    _min?: SupplierMinAggregateInputType;
    _max?: SupplierMaxAggregateInputType;
};
export type GetSupplierAggregateType<T extends SupplierAggregateArgs> = {
    [P in keyof T & keyof AggregateSupplier]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateSupplier[P]> : Prisma.GetScalarType<T[P], AggregateSupplier[P]>;
};
export type SupplierGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.SupplierWhereInput;
    orderBy?: Prisma.SupplierOrderByWithAggregationInput | Prisma.SupplierOrderByWithAggregationInput[];
    by: Prisma.SupplierScalarFieldEnum[] | Prisma.SupplierScalarFieldEnum;
    having?: Prisma.SupplierScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: SupplierCountAggregateInputType | true;
    _min?: SupplierMinAggregateInputType;
    _max?: SupplierMaxAggregateInputType;
};
export type SupplierGroupByOutputType = {
    id: string;
    code: string;
    name: string;
    phone: string | null;
    email: string | null;
    address: string | null;
    branchId: string | null;
    createdAt: Date;
    updatedAt: Date;
    _count: SupplierCountAggregateOutputType | null;
    _min: SupplierMinAggregateOutputType | null;
    _max: SupplierMaxAggregateOutputType | null;
};
export type GetSupplierGroupByPayload<T extends SupplierGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<SupplierGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof SupplierGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], SupplierGroupByOutputType[P]> : Prisma.GetScalarType<T[P], SupplierGroupByOutputType[P]>;
}>>;
export type SupplierWhereInput = {
    AND?: Prisma.SupplierWhereInput | Prisma.SupplierWhereInput[];
    OR?: Prisma.SupplierWhereInput[];
    NOT?: Prisma.SupplierWhereInput | Prisma.SupplierWhereInput[];
    id?: Prisma.StringFilter<"Supplier"> | string;
    code?: Prisma.StringFilter<"Supplier"> | string;
    name?: Prisma.StringFilter<"Supplier"> | string;
    phone?: Prisma.StringNullableFilter<"Supplier"> | string | null;
    email?: Prisma.StringNullableFilter<"Supplier"> | string | null;
    address?: Prisma.StringNullableFilter<"Supplier"> | string | null;
    branchId?: Prisma.StringNullableFilter<"Supplier"> | string | null;
    createdAt?: Prisma.DateTimeFilter<"Supplier"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"Supplier"> | Date | string;
    branch?: Prisma.XOR<Prisma.BranchNullableScalarRelationFilter, Prisma.BranchWhereInput> | null;
};
export type SupplierOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    code?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    phone?: Prisma.SortOrderInput | Prisma.SortOrder;
    email?: Prisma.SortOrderInput | Prisma.SortOrder;
    address?: Prisma.SortOrderInput | Prisma.SortOrder;
    branchId?: Prisma.SortOrderInput | Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    branch?: Prisma.BranchOrderByWithRelationInput;
};
export type SupplierWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    code?: string;
    AND?: Prisma.SupplierWhereInput | Prisma.SupplierWhereInput[];
    OR?: Prisma.SupplierWhereInput[];
    NOT?: Prisma.SupplierWhereInput | Prisma.SupplierWhereInput[];
    name?: Prisma.StringFilter<"Supplier"> | string;
    phone?: Prisma.StringNullableFilter<"Supplier"> | string | null;
    email?: Prisma.StringNullableFilter<"Supplier"> | string | null;
    address?: Prisma.StringNullableFilter<"Supplier"> | string | null;
    branchId?: Prisma.StringNullableFilter<"Supplier"> | string | null;
    createdAt?: Prisma.DateTimeFilter<"Supplier"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"Supplier"> | Date | string;
    branch?: Prisma.XOR<Prisma.BranchNullableScalarRelationFilter, Prisma.BranchWhereInput> | null;
}, "id" | "code">;
export type SupplierOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    code?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    phone?: Prisma.SortOrderInput | Prisma.SortOrder;
    email?: Prisma.SortOrderInput | Prisma.SortOrder;
    address?: Prisma.SortOrderInput | Prisma.SortOrder;
    branchId?: Prisma.SortOrderInput | Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    _count?: Prisma.SupplierCountOrderByAggregateInput;
    _max?: Prisma.SupplierMaxOrderByAggregateInput;
    _min?: Prisma.SupplierMinOrderByAggregateInput;
};
export type SupplierScalarWhereWithAggregatesInput = {
    AND?: Prisma.SupplierScalarWhereWithAggregatesInput | Prisma.SupplierScalarWhereWithAggregatesInput[];
    OR?: Prisma.SupplierScalarWhereWithAggregatesInput[];
    NOT?: Prisma.SupplierScalarWhereWithAggregatesInput | Prisma.SupplierScalarWhereWithAggregatesInput[];
    id?: Prisma.StringWithAggregatesFilter<"Supplier"> | string;
    code?: Prisma.StringWithAggregatesFilter<"Supplier"> | string;
    name?: Prisma.StringWithAggregatesFilter<"Supplier"> | string;
    phone?: Prisma.StringNullableWithAggregatesFilter<"Supplier"> | string | null;
    email?: Prisma.StringNullableWithAggregatesFilter<"Supplier"> | string | null;
    address?: Prisma.StringNullableWithAggregatesFilter<"Supplier"> | string | null;
    branchId?: Prisma.StringNullableWithAggregatesFilter<"Supplier"> | string | null;
    createdAt?: Prisma.DateTimeWithAggregatesFilter<"Supplier"> | Date | string;
    updatedAt?: Prisma.DateTimeWithAggregatesFilter<"Supplier"> | Date | string;
};
export type SupplierCreateInput = {
    id?: string;
    code: string;
    name: string;
    phone?: string | null;
    email?: string | null;
    address?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    branch?: Prisma.BranchCreateNestedOneWithoutSuppliersInput;
};
export type SupplierUncheckedCreateInput = {
    id?: string;
    code: string;
    name: string;
    phone?: string | null;
    email?: string | null;
    address?: string | null;
    branchId?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type SupplierUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    code?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    phone?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    email?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    address?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    branch?: Prisma.BranchUpdateOneWithoutSuppliersNestedInput;
};
export type SupplierUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    code?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    phone?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    email?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    address?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    branchId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type SupplierCreateManyInput = {
    id?: string;
    code: string;
    name: string;
    phone?: string | null;
    email?: string | null;
    address?: string | null;
    branchId?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type SupplierUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    code?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    phone?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    email?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    address?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type SupplierUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    code?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    phone?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    email?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    address?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    branchId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type SupplierListRelationFilter = {
    every?: Prisma.SupplierWhereInput;
    some?: Prisma.SupplierWhereInput;
    none?: Prisma.SupplierWhereInput;
};
export type SupplierOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type SupplierCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    code?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    phone?: Prisma.SortOrder;
    email?: Prisma.SortOrder;
    address?: Prisma.SortOrder;
    branchId?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type SupplierMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    code?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    phone?: Prisma.SortOrder;
    email?: Prisma.SortOrder;
    address?: Prisma.SortOrder;
    branchId?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type SupplierMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    code?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    phone?: Prisma.SortOrder;
    email?: Prisma.SortOrder;
    address?: Prisma.SortOrder;
    branchId?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type SupplierCreateNestedManyWithoutBranchInput = {
    create?: Prisma.XOR<Prisma.SupplierCreateWithoutBranchInput, Prisma.SupplierUncheckedCreateWithoutBranchInput> | Prisma.SupplierCreateWithoutBranchInput[] | Prisma.SupplierUncheckedCreateWithoutBranchInput[];
    connectOrCreate?: Prisma.SupplierCreateOrConnectWithoutBranchInput | Prisma.SupplierCreateOrConnectWithoutBranchInput[];
    createMany?: Prisma.SupplierCreateManyBranchInputEnvelope;
    connect?: Prisma.SupplierWhereUniqueInput | Prisma.SupplierWhereUniqueInput[];
};
export type SupplierUncheckedCreateNestedManyWithoutBranchInput = {
    create?: Prisma.XOR<Prisma.SupplierCreateWithoutBranchInput, Prisma.SupplierUncheckedCreateWithoutBranchInput> | Prisma.SupplierCreateWithoutBranchInput[] | Prisma.SupplierUncheckedCreateWithoutBranchInput[];
    connectOrCreate?: Prisma.SupplierCreateOrConnectWithoutBranchInput | Prisma.SupplierCreateOrConnectWithoutBranchInput[];
    createMany?: Prisma.SupplierCreateManyBranchInputEnvelope;
    connect?: Prisma.SupplierWhereUniqueInput | Prisma.SupplierWhereUniqueInput[];
};
export type SupplierUpdateManyWithoutBranchNestedInput = {
    create?: Prisma.XOR<Prisma.SupplierCreateWithoutBranchInput, Prisma.SupplierUncheckedCreateWithoutBranchInput> | Prisma.SupplierCreateWithoutBranchInput[] | Prisma.SupplierUncheckedCreateWithoutBranchInput[];
    connectOrCreate?: Prisma.SupplierCreateOrConnectWithoutBranchInput | Prisma.SupplierCreateOrConnectWithoutBranchInput[];
    upsert?: Prisma.SupplierUpsertWithWhereUniqueWithoutBranchInput | Prisma.SupplierUpsertWithWhereUniqueWithoutBranchInput[];
    createMany?: Prisma.SupplierCreateManyBranchInputEnvelope;
    set?: Prisma.SupplierWhereUniqueInput | Prisma.SupplierWhereUniqueInput[];
    disconnect?: Prisma.SupplierWhereUniqueInput | Prisma.SupplierWhereUniqueInput[];
    delete?: Prisma.SupplierWhereUniqueInput | Prisma.SupplierWhereUniqueInput[];
    connect?: Prisma.SupplierWhereUniqueInput | Prisma.SupplierWhereUniqueInput[];
    update?: Prisma.SupplierUpdateWithWhereUniqueWithoutBranchInput | Prisma.SupplierUpdateWithWhereUniqueWithoutBranchInput[];
    updateMany?: Prisma.SupplierUpdateManyWithWhereWithoutBranchInput | Prisma.SupplierUpdateManyWithWhereWithoutBranchInput[];
    deleteMany?: Prisma.SupplierScalarWhereInput | Prisma.SupplierScalarWhereInput[];
};
export type SupplierUncheckedUpdateManyWithoutBranchNestedInput = {
    create?: Prisma.XOR<Prisma.SupplierCreateWithoutBranchInput, Prisma.SupplierUncheckedCreateWithoutBranchInput> | Prisma.SupplierCreateWithoutBranchInput[] | Prisma.SupplierUncheckedCreateWithoutBranchInput[];
    connectOrCreate?: Prisma.SupplierCreateOrConnectWithoutBranchInput | Prisma.SupplierCreateOrConnectWithoutBranchInput[];
    upsert?: Prisma.SupplierUpsertWithWhereUniqueWithoutBranchInput | Prisma.SupplierUpsertWithWhereUniqueWithoutBranchInput[];
    createMany?: Prisma.SupplierCreateManyBranchInputEnvelope;
    set?: Prisma.SupplierWhereUniqueInput | Prisma.SupplierWhereUniqueInput[];
    disconnect?: Prisma.SupplierWhereUniqueInput | Prisma.SupplierWhereUniqueInput[];
    delete?: Prisma.SupplierWhereUniqueInput | Prisma.SupplierWhereUniqueInput[];
    connect?: Prisma.SupplierWhereUniqueInput | Prisma.SupplierWhereUniqueInput[];
    update?: Prisma.SupplierUpdateWithWhereUniqueWithoutBranchInput | Prisma.SupplierUpdateWithWhereUniqueWithoutBranchInput[];
    updateMany?: Prisma.SupplierUpdateManyWithWhereWithoutBranchInput | Prisma.SupplierUpdateManyWithWhereWithoutBranchInput[];
    deleteMany?: Prisma.SupplierScalarWhereInput | Prisma.SupplierScalarWhereInput[];
};
export type SupplierCreateWithoutBranchInput = {
    id?: string;
    code: string;
    name: string;
    phone?: string | null;
    email?: string | null;
    address?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type SupplierUncheckedCreateWithoutBranchInput = {
    id?: string;
    code: string;
    name: string;
    phone?: string | null;
    email?: string | null;
    address?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type SupplierCreateOrConnectWithoutBranchInput = {
    where: Prisma.SupplierWhereUniqueInput;
    create: Prisma.XOR<Prisma.SupplierCreateWithoutBranchInput, Prisma.SupplierUncheckedCreateWithoutBranchInput>;
};
export type SupplierCreateManyBranchInputEnvelope = {
    data: Prisma.SupplierCreateManyBranchInput | Prisma.SupplierCreateManyBranchInput[];
    skipDuplicates?: boolean;
};
export type SupplierUpsertWithWhereUniqueWithoutBranchInput = {
    where: Prisma.SupplierWhereUniqueInput;
    update: Prisma.XOR<Prisma.SupplierUpdateWithoutBranchInput, Prisma.SupplierUncheckedUpdateWithoutBranchInput>;
    create: Prisma.XOR<Prisma.SupplierCreateWithoutBranchInput, Prisma.SupplierUncheckedCreateWithoutBranchInput>;
};
export type SupplierUpdateWithWhereUniqueWithoutBranchInput = {
    where: Prisma.SupplierWhereUniqueInput;
    data: Prisma.XOR<Prisma.SupplierUpdateWithoutBranchInput, Prisma.SupplierUncheckedUpdateWithoutBranchInput>;
};
export type SupplierUpdateManyWithWhereWithoutBranchInput = {
    where: Prisma.SupplierScalarWhereInput;
    data: Prisma.XOR<Prisma.SupplierUpdateManyMutationInput, Prisma.SupplierUncheckedUpdateManyWithoutBranchInput>;
};
export type SupplierScalarWhereInput = {
    AND?: Prisma.SupplierScalarWhereInput | Prisma.SupplierScalarWhereInput[];
    OR?: Prisma.SupplierScalarWhereInput[];
    NOT?: Prisma.SupplierScalarWhereInput | Prisma.SupplierScalarWhereInput[];
    id?: Prisma.StringFilter<"Supplier"> | string;
    code?: Prisma.StringFilter<"Supplier"> | string;
    name?: Prisma.StringFilter<"Supplier"> | string;
    phone?: Prisma.StringNullableFilter<"Supplier"> | string | null;
    email?: Prisma.StringNullableFilter<"Supplier"> | string | null;
    address?: Prisma.StringNullableFilter<"Supplier"> | string | null;
    branchId?: Prisma.StringNullableFilter<"Supplier"> | string | null;
    createdAt?: Prisma.DateTimeFilter<"Supplier"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"Supplier"> | Date | string;
};
export type SupplierCreateManyBranchInput = {
    id?: string;
    code: string;
    name: string;
    phone?: string | null;
    email?: string | null;
    address?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type SupplierUpdateWithoutBranchInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    code?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    phone?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    email?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    address?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type SupplierUncheckedUpdateWithoutBranchInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    code?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    phone?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    email?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    address?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type SupplierUncheckedUpdateManyWithoutBranchInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    code?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    phone?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    email?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    address?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type SupplierSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    code?: boolean;
    name?: boolean;
    phone?: boolean;
    email?: boolean;
    address?: boolean;
    branchId?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    branch?: boolean | Prisma.Supplier$branchArgs<ExtArgs>;
}, ExtArgs["result"]["supplier"]>;
export type SupplierSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    code?: boolean;
    name?: boolean;
    phone?: boolean;
    email?: boolean;
    address?: boolean;
    branchId?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    branch?: boolean | Prisma.Supplier$branchArgs<ExtArgs>;
}, ExtArgs["result"]["supplier"]>;
export type SupplierSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    code?: boolean;
    name?: boolean;
    phone?: boolean;
    email?: boolean;
    address?: boolean;
    branchId?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    branch?: boolean | Prisma.Supplier$branchArgs<ExtArgs>;
}, ExtArgs["result"]["supplier"]>;
export type SupplierSelectScalar = {
    id?: boolean;
    code?: boolean;
    name?: boolean;
    phone?: boolean;
    email?: boolean;
    address?: boolean;
    branchId?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
};
export type SupplierOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "code" | "name" | "phone" | "email" | "address" | "branchId" | "createdAt" | "updatedAt", ExtArgs["result"]["supplier"]>;
export type SupplierInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    branch?: boolean | Prisma.Supplier$branchArgs<ExtArgs>;
};
export type SupplierIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    branch?: boolean | Prisma.Supplier$branchArgs<ExtArgs>;
};
export type SupplierIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    branch?: boolean | Prisma.Supplier$branchArgs<ExtArgs>;
};
export type $SupplierPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "Supplier";
    objects: {
        branch: Prisma.$BranchPayload<ExtArgs> | null;
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        code: string;
        name: string;
        phone: string | null;
        email: string | null;
        address: string | null;
        branchId: string | null;
        createdAt: Date;
        updatedAt: Date;
    }, ExtArgs["result"]["supplier"]>;
    composites: {};
};
export type SupplierGetPayload<S extends boolean | null | undefined | SupplierDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$SupplierPayload, S>;
export type SupplierCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<SupplierFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: SupplierCountAggregateInputType | true;
};
export interface SupplierDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['Supplier'];
        meta: {
            name: 'Supplier';
        };
    };
    findUnique<T extends SupplierFindUniqueArgs>(args: Prisma.SelectSubset<T, SupplierFindUniqueArgs<ExtArgs>>): Prisma.Prisma__SupplierClient<runtime.Types.Result.GetResult<Prisma.$SupplierPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends SupplierFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, SupplierFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__SupplierClient<runtime.Types.Result.GetResult<Prisma.$SupplierPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends SupplierFindFirstArgs>(args?: Prisma.SelectSubset<T, SupplierFindFirstArgs<ExtArgs>>): Prisma.Prisma__SupplierClient<runtime.Types.Result.GetResult<Prisma.$SupplierPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends SupplierFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, SupplierFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__SupplierClient<runtime.Types.Result.GetResult<Prisma.$SupplierPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends SupplierFindManyArgs>(args?: Prisma.SelectSubset<T, SupplierFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$SupplierPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends SupplierCreateArgs>(args: Prisma.SelectSubset<T, SupplierCreateArgs<ExtArgs>>): Prisma.Prisma__SupplierClient<runtime.Types.Result.GetResult<Prisma.$SupplierPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends SupplierCreateManyArgs>(args?: Prisma.SelectSubset<T, SupplierCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends SupplierCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, SupplierCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$SupplierPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends SupplierDeleteArgs>(args: Prisma.SelectSubset<T, SupplierDeleteArgs<ExtArgs>>): Prisma.Prisma__SupplierClient<runtime.Types.Result.GetResult<Prisma.$SupplierPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends SupplierUpdateArgs>(args: Prisma.SelectSubset<T, SupplierUpdateArgs<ExtArgs>>): Prisma.Prisma__SupplierClient<runtime.Types.Result.GetResult<Prisma.$SupplierPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends SupplierDeleteManyArgs>(args?: Prisma.SelectSubset<T, SupplierDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends SupplierUpdateManyArgs>(args: Prisma.SelectSubset<T, SupplierUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends SupplierUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, SupplierUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$SupplierPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends SupplierUpsertArgs>(args: Prisma.SelectSubset<T, SupplierUpsertArgs<ExtArgs>>): Prisma.Prisma__SupplierClient<runtime.Types.Result.GetResult<Prisma.$SupplierPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends SupplierCountArgs>(args?: Prisma.Subset<T, SupplierCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], SupplierCountAggregateOutputType> : number>;
    aggregate<T extends SupplierAggregateArgs>(args: Prisma.Subset<T, SupplierAggregateArgs>): Prisma.PrismaPromise<GetSupplierAggregateType<T>>;
    groupBy<T extends SupplierGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: SupplierGroupByArgs['orderBy'];
    } : {
        orderBy?: SupplierGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, SupplierGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetSupplierGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: SupplierFieldRefs;
}
export interface Prisma__SupplierClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    branch<T extends Prisma.Supplier$branchArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.Supplier$branchArgs<ExtArgs>>): Prisma.Prisma__BranchClient<runtime.Types.Result.GetResult<Prisma.$BranchPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface SupplierFieldRefs {
    readonly id: Prisma.FieldRef<"Supplier", 'String'>;
    readonly code: Prisma.FieldRef<"Supplier", 'String'>;
    readonly name: Prisma.FieldRef<"Supplier", 'String'>;
    readonly phone: Prisma.FieldRef<"Supplier", 'String'>;
    readonly email: Prisma.FieldRef<"Supplier", 'String'>;
    readonly address: Prisma.FieldRef<"Supplier", 'String'>;
    readonly branchId: Prisma.FieldRef<"Supplier", 'String'>;
    readonly createdAt: Prisma.FieldRef<"Supplier", 'DateTime'>;
    readonly updatedAt: Prisma.FieldRef<"Supplier", 'DateTime'>;
}
export type SupplierFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.SupplierSelect<ExtArgs> | null;
    omit?: Prisma.SupplierOmit<ExtArgs> | null;
    include?: Prisma.SupplierInclude<ExtArgs> | null;
    where: Prisma.SupplierWhereUniqueInput;
};
export type SupplierFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.SupplierSelect<ExtArgs> | null;
    omit?: Prisma.SupplierOmit<ExtArgs> | null;
    include?: Prisma.SupplierInclude<ExtArgs> | null;
    where: Prisma.SupplierWhereUniqueInput;
};
export type SupplierFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type SupplierFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type SupplierFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type SupplierCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.SupplierSelect<ExtArgs> | null;
    omit?: Prisma.SupplierOmit<ExtArgs> | null;
    include?: Prisma.SupplierInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.SupplierCreateInput, Prisma.SupplierUncheckedCreateInput>;
};
export type SupplierCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.SupplierCreateManyInput | Prisma.SupplierCreateManyInput[];
    skipDuplicates?: boolean;
};
export type SupplierCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.SupplierSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.SupplierOmit<ExtArgs> | null;
    data: Prisma.SupplierCreateManyInput | Prisma.SupplierCreateManyInput[];
    skipDuplicates?: boolean;
    include?: Prisma.SupplierIncludeCreateManyAndReturn<ExtArgs> | null;
};
export type SupplierUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.SupplierSelect<ExtArgs> | null;
    omit?: Prisma.SupplierOmit<ExtArgs> | null;
    include?: Prisma.SupplierInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.SupplierUpdateInput, Prisma.SupplierUncheckedUpdateInput>;
    where: Prisma.SupplierWhereUniqueInput;
};
export type SupplierUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.SupplierUpdateManyMutationInput, Prisma.SupplierUncheckedUpdateManyInput>;
    where?: Prisma.SupplierWhereInput;
    limit?: number;
};
export type SupplierUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.SupplierSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.SupplierOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.SupplierUpdateManyMutationInput, Prisma.SupplierUncheckedUpdateManyInput>;
    where?: Prisma.SupplierWhereInput;
    limit?: number;
    include?: Prisma.SupplierIncludeUpdateManyAndReturn<ExtArgs> | null;
};
export type SupplierUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.SupplierSelect<ExtArgs> | null;
    omit?: Prisma.SupplierOmit<ExtArgs> | null;
    include?: Prisma.SupplierInclude<ExtArgs> | null;
    where: Prisma.SupplierWhereUniqueInput;
    create: Prisma.XOR<Prisma.SupplierCreateInput, Prisma.SupplierUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.SupplierUpdateInput, Prisma.SupplierUncheckedUpdateInput>;
};
export type SupplierDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.SupplierSelect<ExtArgs> | null;
    omit?: Prisma.SupplierOmit<ExtArgs> | null;
    include?: Prisma.SupplierInclude<ExtArgs> | null;
    where: Prisma.SupplierWhereUniqueInput;
};
export type SupplierDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.SupplierWhereInput;
    limit?: number;
};
export type Supplier$branchArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.BranchSelect<ExtArgs> | null;
    omit?: Prisma.BranchOmit<ExtArgs> | null;
    include?: Prisma.BranchInclude<ExtArgs> | null;
    where?: Prisma.BranchWhereInput;
};
export type SupplierDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.SupplierSelect<ExtArgs> | null;
    omit?: Prisma.SupplierOmit<ExtArgs> | null;
    include?: Prisma.SupplierInclude<ExtArgs> | null;
};
