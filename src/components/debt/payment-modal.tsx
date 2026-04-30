import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Debt } from "@/data/types/debt";
import { formatRupiah } from "@/lib/utils";

interface PaymentModalProps {
  debt: Debt | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onPayment: (debtId: string, amount: number) => void;
}

export default function PaymentModal({
  debt,
  open,
  onOpenChange,
  onPayment,
}: PaymentModalProps) {
  const [amount, setAmount] = useState("");

  const handlePay = () => {
    if (!debt || !amount) return;
    onPayment(debt.id, parseInt(amount));
    setAmount("");
    onOpenChange(false);
  };

  if (!debt) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Bayar Hutang - {debt.name}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div>
            <p className="text-sm">Sisa Hutang</p>
            <p className="text-3xl font-bold text-red-600">
              {formatRupiah(debt.remainingDebt)}
            </p>
          </div>

          <div>
            <Label className="py-2" htmlFor="payAmount">
              Jumlah yang dibayar
            </Label>
            <Input
              id="payAmount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="50000"
              autoFocus
            />
          </div>

          <div className="flex gap-2">
            {[10000, 20000, 50000, debt.remainingDebt].map((amt) => (
              <Button
                key={amt}
                variant="outline"
                size="sm"
                onClick={() => setAmount(amt.toString())}
              >
                {amt === debt.remainingDebt ? "Lunas" : formatRupiah(amt)}
              </Button>
            ))}
          </div>

          <Button onClick={handlePay} className="w-full" disabled={!amount}>
            Konfirmasi Pembayaran
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
