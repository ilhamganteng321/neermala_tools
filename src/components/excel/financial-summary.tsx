import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTransactionStore } from "@/store/transaction-store";
import { TrendingUp, TrendingDown, Wallet } from "lucide-react";

export function FinancialSummary() {
  const { summary, transactions } = useTransactionStore();
  const hasData = transactions.length > 0;

  if (!hasData) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-secondary border-primary">
          <CardContent className="pt-6">
            <p className="text-center text-primary">Belum ada data</p>
            <p className="text-center text-xs text-primary">
              Upload file Excel terlebih dahulu
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const formatRupiah = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 ">
      <Card className="bg-green-100 border-green-200">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-green-700">
            Total Pemasukan
          </CardTitle>
          <TrendingUp className="h-4 w-4 text-green-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-700">
            {formatRupiah(summary.totalPemasukan)}
          </div>
          <p className="text-xs text-green-600 mt-1">Seluruh pendapatan</p>
        </CardContent>
      </Card>

      <Card className="bg-red-100 border-red-200">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-red-700">
            Total Pengeluaran
          </CardTitle>
          <TrendingDown className="h-4 w-4 text-red-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-red-700">
            {formatRupiah(summary.totalPengeluaran)}
          </div>
          <p className="text-xs text-red-600 mt-1">Seluruh biaya</p>
        </CardContent>
      </Card>

      <Card
        className={`${summary.saldo >= 0 ? "bg-blue-100 border-blue-200" : "bg-orange-100 border-orange-200"}`}
      >
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm text-black font-medium">
            Saldo Akhir
          </CardTitle>
          <Wallet className="h-4 w-4" />
        </CardHeader>
        <CardContent>
          <div
            className={`text-2xl font-bold ${summary.saldo >= 0 ? "text-blue-700" : "text-orange-700"}`}
          >
            {formatRupiah(summary.saldo)}
          </div>
          <p className="text-xs text-gray-500 mt-1">
            {summary.saldo >= 0 ? "Laba bersih" : "Rugi bersih"}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
