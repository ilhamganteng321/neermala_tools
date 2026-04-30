import type { Debt } from "@/data/types/debt";

const STORAGE_KEY = "warung-debts";

export const debtStorage = {
  getAll: (): Debt[] => {
    if (typeof window === "undefined") return [];
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  },

  saveAll: (debts: Debt[]) => {
    if (typeof window === "undefined") return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(debts));
  },

  add: (debt: Debt) => {
    const debts = debtStorage.getAll();
    debts.unshift(debt); // terbaru di atas
    debtStorage.saveAll(debts);
    return debts;
  },

  update: (updatedDebt: Debt) => {
    const debts = debtStorage.getAll();
    const index = debts.findIndex((d) => d.id === updatedDebt.id);
    if (index !== -1) {
      debts[index] = updatedDebt;
      debtStorage.saveAll(debts);
    }
    return debts;
  },
};
