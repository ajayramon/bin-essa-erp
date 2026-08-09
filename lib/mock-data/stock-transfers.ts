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
    itemsCount: 12,
    itemsSummary: "Tropical Mix, Elf Bar, Clipper Lighters",
    status: "Pending",
  },
  {
    id: "req-002",
    requestNo: "REQ-00031",
    date: "06/08/2026 04:20 PM",
    fromBranch: "Shuwaikh Main Warehouse",
    toBranch: "Salmiya 5th",
    itemsCount: 8,
    itemsSummary: "Velo Mint, IQOS Terea Yellow",
    status: "Approved",
  },
  {
    id: "req-003",
    requestNo: "REQ-00030",
    date: "05/08/2026 11:15 AM",
    fromBranch: "Shuwaikh Main Warehouse",
    toBranch: "Salmiya 5th",
    itemsCount: 15,
    itemsSummary: "Dokha Medwakh, Rolling Tobacco",
    status: "Prepared",
  },
  {
    id: "req-004",
    requestNo: "REQ-00029",
    date: "03/08/2026 09:45 AM",
    fromBranch: "Shuwaikh Main Warehouse",
    toBranch: "Salmiya 5th",
    itemsCount: 9,
    itemsSummary: "Stainless Steel Ashtrays, Pod Kits",
    status: "Received",
  },
];
