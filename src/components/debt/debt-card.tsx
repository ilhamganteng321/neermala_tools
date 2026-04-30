// src/components/debt/DebtCard.tsx
import type { Debt } from "@/data/types/debt";
import { formatRupiah, getStatusColor } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface DebtCardProps {
  debt: Debt;
  onPay: (debt: Debt) => void;
  onDelete: (id: string) => void;
  onReminder: (debt: Debt) => void;
}

export default function DebtCard({ debt, onPay, onDelete }: DebtCardProps) {
  const isPaid = debt.status === "paid";
  return (
    <Card className={`transition-all ${isPaid ? "opacity-75" : ""}`}>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-semibold text-lg">{debt.name}</h3>
            <p className="text-sm text-muted-foreground">
              {new Date(debt.createdAt).toLocaleDateString("id-ID", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </p>
          </div>
          <Badge className={getStatusColor(debt.status)}>
            {isPaid ? "LUNAS" : "BELUM LUNAS"}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div>
          <p className="text-sm text-muted-foreground">Total Hutang</p>
          <p className="text-2xl font-bold">{formatRupiah(debt.totalDebt)}</p>
        </div>

        {!isPaid && (
          <div>
            <p className="text-sm text-muted-foreground">Sisa Hutang</p>
            <p className="text-xl font-semibold text-red-600">
              {formatRupiah(debt.remainingDebt)}
            </p>
          </div>
        )}

        {debt.note && (
          <p className="text-sm italic text-muted-foreground border-l-4 border-gray-200 pl-3">
            "{debt.note}"
          </p>
        )}

        <div className="flex gap-2 pt-2">
          {!isPaid && (
            <>
              <Button onClick={() => onPay(debt)} className="flex-1">
                Bayar
              </Button>
            </>
          )}

          {/* Tombol Hapus dengan Konfirmasi */}
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="text-red-500 hover:text-red-600 hover:bg-red-50"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Konfirmasi Hapus</AlertDialogTitle>
                <AlertDialogDescription>
                  Apakah kamu yakin ingin menghapus hutang atas nama{" "}
                  <span className="font-semibold">{debt.name}</span>?
                  <br />
                  {debt.status === "unpaid" && (
                    <span className="text-red-600 font-medium">
                      Hutang ini belum lunas (Rp{" "}
                      {formatRupiah(debt.remainingDebt)}).
                    </span>
                  )}
                  <br />
                  Tindakan ini tidak dapat dibatalkan.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Batal</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => onDelete(debt.id)}
                  className="bg-red-600 hover:bg-red-700"
                >
                  Ya, Hapus
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </CardContent>
    </Card>
  );
}
