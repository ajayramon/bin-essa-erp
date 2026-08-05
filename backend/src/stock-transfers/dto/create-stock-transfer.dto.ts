export class StockTransferLineDto {
  itemId!: string;
  quantity!: number;
}

export class CreateStockTransferDto {
  transferNumber!: string;
  fromBranchId!: string;
  toBranchId!: string;
  notes?: string;
  lines!: StockTransferLineDto[];
}
