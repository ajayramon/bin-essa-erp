export class SalesOrderLineDto {
  itemId!: string;
  quantity!: number;
  unitPrice!: number;
}

export class CreateSalesOrderDto {
  orderNumber!: string;
  customerId!: string;
  branchId!: string;
  notes?: string;
  lines!: SalesOrderLineDto[];
  overrideCreditHold?: boolean;
}
