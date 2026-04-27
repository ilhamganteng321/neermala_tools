import type { MonthlyData, Summary, Transaction } from "@/data/types";
import { create } from "zustand";

interface TransactionStore {
  transactions: Transaction[];
  summary: Summary;
  monthlyData: MonthlyData[];
  setTransactions: (transactions: Transaction[]) => void;
  calculateSummaryAndChart: (transactions: Transaction[]) => void;
  clearData: () => void;
}

// Helper: group by bulan untuk grafik
const groupByMonth = (transactions: Transaction[]): MonthlyData[] => {
  const monthlyMap = new Map<string, MonthlyData>();

  transactions.forEach((tx) => {
    console.log("Processing transaction:", tx); // Debug log
    const bulan = tx.tanggal.substring(0, 7); // "2026-04"
    console.log(bulan);
    if (!monthlyMap.has(bulan)) {
      monthlyMap.set(bulan, {
        bulan,
        pemasukan: 0,
        pengeluaran: 0,
      });
    }

    const data = monthlyMap.get(bulan)!;
    data.pemasukan += tx.pemasukan;
    data.pengeluaran += tx.pengeluaran;
  });

  return Array.from(monthlyMap.values()).sort((a, b) =>
    a.bulan.localeCompare(b.bulan),
  );
};

export const useTransactionStore = create<TransactionStore>((set) => ({
  transactions: [],
  summary: {
    totalPemasukan: 0,
    totalPengeluaran: 0,
    saldo: 0,
  },
  monthlyData: [],

  setTransactions: (transactions) => {
    set({ transactions });
  },

  calculateSummaryAndChart: (transactions) => {
    const totalPemasukan = transactions.reduce(
      (sum, tx) => sum + tx.pemasukan,
      0,
    );
    const totalPengeluaran = transactions.reduce(
      (sum, tx) => sum + tx.pengeluaran,
      0,
    );
    const saldo = totalPemasukan - totalPengeluaran;
    const monthlyData = groupByMonth(transactions);

    set({
      summary: { totalPemasukan, totalPengeluaran, saldo },
      monthlyData,
    });
  },

  clearData: () => {
    set({
      transactions: [],
      summary: { totalPemasukan: 0, totalPengeluaran: 0, saldo: 0 },
      monthlyData: [],
    });
  },
}));
