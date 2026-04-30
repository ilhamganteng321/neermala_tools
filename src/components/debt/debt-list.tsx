import DebtCard from "./debt-card";
import type { Debt } from "@/data/types/debt";

interface DebtListProps {
  debts: Debt[];
  onPay: (debt: Debt) => void;
  onDelete: (id: string) => void;
}

export default function DebtList({ debts, onPay, onDelete }: DebtListProps) {
  if (debts.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        Belum ada catatan hutang
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {debts.map((debt) => (
        <DebtCard
          key={debt.id}
          debt={debt}
          onPay={onPay}
          onDelete={onDelete}
          onReminder={() => {}} // di-handle di DebtApp
        />
      ))}
    </div>
  );
}
