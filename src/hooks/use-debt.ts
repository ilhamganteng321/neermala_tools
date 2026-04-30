import { useState, useEffect } from "react";
import type { Debt, DebtFormData } from "@/data/types/debt";
import { generateId } from "@/lib/utils";
import { debtStorage } from "@/lib/store";
import { toast } from "sonner";

export const useDebts = () => {
  const [debts, setDebts] = useState<Debt[]>([]);

  useEffect(() => {
    setDebts(debtStorage.getAll());
  }, []);

  const addDebt = (data: DebtFormData) => {
    const newDebt: Debt = {
      id: generateId(),
      name: data.name.trim(),
      totalDebt: data.amount,
      remainingDebt: data.amount,
      createdAt: new Date().toISOString(),
      status: "unpaid",
      note: data.note?.trim(),
      payments: [],
    };

    const updated = debtStorage.add(newDebt);
    setDebts(updated);
    toast.success(`${newDebt.name} berhasil ditambahkan ke daftar hutang`);
    return newDebt;
  };

  const recordPayment = (debtId: string, amount: number, note?: string) => {
    const debt = debts.find((d) => d.id === debtId);
    if (!debt) return;

    const paymentAmount = Math.min(amount, debt.remainingDebt);

    const newPayment = {
      id: generateId(),
      amount: paymentAmount,
      date: new Date().toISOString(),
      note,
    };

    const updatedDebt: Debt = {
      ...debt,
      remainingDebt: debt.remainingDebt - paymentAmount,
      payments: [newPayment, ...debt.payments],
      status: debt.remainingDebt - paymentAmount <= 0 ? "paid" : "unpaid",
    };

    const updatedDebts = debtStorage.update(updatedDebt);
    setDebts(updatedDebts);
    toast.success(`${updatedDebt.name} berhasil update hutang`);
  };

  const deleteDebt = (id: string) => {
    const updated = debts.filter((d) => d.id !== id);
    debtStorage.saveAll(updated);
    toast.success(`berhasil dihapus dari daftar`);
    setDebts(updated);
  };

  const searchDebts = (query: string): Debt[] => {
    if (!query.trim()) return debts;
    const q = query.toLowerCase();
    return debts.filter((debt) => debt.name.toLowerCase().includes(q));
  };

  return {
    debts,
    addDebt,
    recordPayment,
    deleteDebt,
    searchDebts,
  };
};
