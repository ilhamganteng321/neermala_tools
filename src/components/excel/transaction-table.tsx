import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTransactionStore } from "@/store/transaction-store";

export function TransactionTable() {
  const { transactions } = useTransactionStore();
  const hasData = transactions.length > 0;

  const formatRupiah = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  if (!hasData) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Daftar Transaksi</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-primary">
            Belum ada data transaksi
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          Daftar Transaksi ({transactions.length} transaksi)
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tanggal</TableHead>
                <TableHead>Deskripsi</TableHead>
                <TableHead>Kategori</TableHead>
                <TableHead className="text-right">Pemasukan</TableHead>
                <TableHead className="text-right">Pengeluaran</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.slice(0, 100).map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell className="font-medium">
                    {transaction.tanggal}
                  </TableCell>
                  <TableCell>{transaction.deskripsi}</TableCell>
                  <TableCell>{transaction.kategori}</TableCell>
                  <TableCell className="text-right text-green-600">
                    {transaction.pemasukan > 0
                      ? formatRupiah(transaction.pemasukan)
                      : "-"}
                  </TableCell>
                  <TableCell className="text-right text-red-600">
                    {transaction.pengeluaran > 0
                      ? formatRupiah(transaction.pengeluaran)
                      : "-"}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        {transactions.length > 100 && (
          <p className="text-xs text-gray-400 mt-4 text-center">
            Menampilkan 100 dari {transactions.length} transaksi
          </p>
        )}
      </CardContent>
    </Card>
  );
}
