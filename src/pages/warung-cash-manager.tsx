import { useState } from "react";
import { useDebts } from "@/hooks/use-debt";
import DebtForm from "@/components/debt/debt-form";
import DebtList from "@/components/debt/debt-list";
import PaymentModal from "@/components/debt/payment-modal";
import { Input } from "@/components/ui/input";
import type { Debt } from "@/data/types/debt";

export default function DebtApp() {
  const { addDebt, recordPayment, deleteDebt, searchDebts } = useDebts();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDebt, setSelectedDebt] = useState<Debt | null>(null);
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);

  const filteredDebts = searchDebts(searchQuery);

  const handlePayClick = (debt: Debt) => {
    setSelectedDebt(debt);
    setIsPaymentOpen(true);
  };

  const handlePayment = (debtId: string, amount: number) => {
    recordPayment(debtId, amount);
  };

  return (
    <div className="min-h-screen bg-secondary pb-12 ">
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="mb-8 text-primary">
          <h1 className="text-3xl font-bold text-center mb-2">
            Catatan Hutang Warung
          </h1>
          <p className="text-center text-muted-foreground">
            Kelola hutang pelanggan dengan cepat
          </p>
        </div>

        <div className="mb-8">
          <DebtForm onSubmit={addDebt} />
        </div>

        <div className="mb-6">
          <Input
            placeholder="Cari nama pelanggan..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="max-w-full"
          />
        </div>

        <DebtList
          debts={filteredDebts}
          onPay={handlePayClick}
          onDelete={deleteDebt}
        />

        <PaymentModal
          debt={selectedDebt}
          open={isPaymentOpen}
          onOpenChange={setIsPaymentOpen}
          onPayment={handlePayment}
        />
      </div>
    </div>
  );
}
