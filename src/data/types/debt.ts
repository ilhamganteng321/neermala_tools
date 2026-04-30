export interface Payment {
  id: string;
  amount: number;
  date: string;
  note?: string;
}

export interface Debt {
  id: string;
  name: string;
  totalDebt: number;
  remainingDebt: number;
  createdAt: string;
  status: "unpaid" | "paid";
  note?: string;
  payments: Payment[];
}

export type DebtFormData = {
  name: string;
  amount: number;
  note?: string;
};
