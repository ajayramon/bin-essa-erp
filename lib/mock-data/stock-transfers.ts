export interface StockRequestRecord {
  id: string;
  requestNo: string;
  date: string;
  fromBranch: string;
  toBranch: string;
  itemsCount: number;
  itemsSummary: string;
  status: "Pending" | "Approved" | "Prepared" | "Received";
}

export const INITIAL_STOCK_REQUESTS: StockRequestRecord[] = [
  {
    id: "req-001",
    requestNo: "REQ-00032",
    date: "07/08/2026 10:30 AM",
    fromBranch: "Shuwaikh Main Warehouse",
    toBranch: "Salmiya 5th",
    itemsCount: 50,
    itemsSummary: "Beco Pro 6000 Puffs, RAW Classic King Size, Cricket Lighters Box 50s",
    status: "Pending",
  },
  {
    id: "req-002",
    requestNo: "REQ-00031",
    date: "06/08/2026 04:20 PM",
    fromBranch: "Shuwaikh Main Warehouse",
    toBranch: "Salmiya 5th",
    itemsCount: 30,
    itemsSummary: "SIBERIA -80°C Red, White Fox All White, CHARCOAL CROWN 40 MM",
    status: "Approved",
  },
  {
    id: "req-003",
    requestNo: "REQ-00030",
    date: "05/08/2026 11:15 AM",
    fromBranch: "Shuwaikh Main Warehouse",
    toBranch: "Salmiya 5th",
    itemsCount: 25,
    itemsSummary: "Al Basha Dokha Warm 50ml, Handcrafted Ebony Medwakh Gold, Cones 32s",
    status: "Prepared",
  },
  {
    id: "req-004",
    requestNo: "REQ-00029",
    date: "03/08/2026 09:45 AM",
    fromBranch: "Shuwaikh Main Warehouse",
    toBranch: "Salmiya 5th",
    itemsCount: 40,
    itemsSummary: "BLVK Unicorn Cuban Cigar 30ML, Wafer 5000 Puffs Blueberry, Fuego Lighters",
    status: "Received",
  },
];
