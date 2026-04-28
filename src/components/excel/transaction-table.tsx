import { useState, useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Filter } from "lucide-react";
import { useTransactionStore } from "@/store/transaction-store";

export function TransactionTable() {
  const { transactions } = useTransactionStore();
  const hasData = transactions.length > 0;

  // State untuk filter
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const formatRupiah = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Dapatkan daftar kategori unik dari data
  const categories = useMemo(() => {
    const uniqueCategories = [
      ...new Set(transactions.map((tx) => tx.kategori)),
    ];
    return ["all", ...uniqueCategories.sort()];
  }, [transactions]);

  // Filter transaksi berdasarkan search dan kategori
  const filteredTransactions = useMemo(() => {
    let filtered = transactions;

    // Filter berdasarkan kategori
    if (selectedCategory !== "all") {
      filtered = filtered.filter((tx) => tx.kategori === selectedCategory);
    }

    // Filter berdasarkan search (deskripsi)
    if (searchTerm.trim() !== "") {
      filtered = filtered.filter((tx) =>
        tx.deskripsi.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }

    return filtered;
  }, [transactions, selectedCategory, searchTerm]);

  // Reset filter
  const resetFilters = () => {
    setSearchTerm("");
    setSelectedCategory("all");
  };

  if (!hasData) {
    return (
      <Card id="transaction-table">
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
    <Card id="transaction-table">
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <CardTitle>
            Daftar Transaksi ({filteredTransactions.length} dari{" "}
            {transactions.length} transaksi)
          </CardTitle>

          {/* Tombol reset filter (muncul jika ada filter aktif) */}
          {(searchTerm || selectedCategory !== "all") && (
            <button
              onClick={resetFilters}
              className="text-sm text-blue-600 hover:text-blue-800 underline"
            >
              Reset Filter
            </button>
          )}
        </div>

        {/* Filter Area */}
        <div className="flex flex-col sm:flex-row gap-3 mt-4">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Cari berdasarkan deskripsi..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>

          {/* Category Filter */}
          <div className="w-full sm:w-64">
            <Select
              value={selectedCategory}
              onValueChange={setSelectedCategory}
            >
              <SelectTrigger>
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Semua Kategori" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat === "all" ? "📋 Semua Kategori" : `📁 ${cat}`}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {/* Tabel dengan scroll vertikal & horizontal */}
        <div className="border rounded-md">
          <div className="overflow-x-auto">
            <div className="max-h-125 overflow-y-auto">
              <Table>
                <TableHeader className="sticky top-0 bg-secondary z-10 shadow-sm">
                  <TableRow>
                    <TableHead className="min-w-25">Tanggal</TableHead>
                    <TableHead className="min-w-50">Deskripsi</TableHead>
                    <TableHead className="min-w-30">Kategori</TableHead>
                    <TableHead className="text-right min-w-40">
                      Pemasukan
                    </TableHead>
                    <TableHead className="text-right min-w-40">
                      Pengeluaran
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTransactions.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={5}
                        className="text-center py-8 text-secondary"
                      >
                        Tidak ada transaksi yang sesuai dengan filter
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredTransactions.slice(0, 100).map((transaction) => (
                      <TableRow key={transaction.id}>
                        <TableCell className="font-medium whitespace-nowrap">
                          {transaction.tanggal}
                        </TableCell>
                        <TableCell className="wrap-break-word">
                          {transaction.deskripsi}
                        </TableCell>
                        <TableCell>
                          <span className="px-2 py-1 bg-primary text-primary-foreground rounded-full text-xs">
                            {transaction.kategori}
                          </span>
                        </TableCell>
                        <TableCell className="text-right text-green-600 whitespace-nowrap">
                          {transaction.pemasukan > 0
                            ? formatRupiah(transaction.pemasukan)
                            : "-"}
                        </TableCell>
                        <TableCell className="text-right text-red-600 whitespace-nowrap ">
                          {transaction.pengeluaran > 0
                            ? formatRupiah(transaction.pengeluaran)
                            : "-"}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>

        {/* Informasi tambahan */}
        <div className="flex justify-between items-center mt-4 text-xs text-gray-400">
          <div>
            {filteredTransactions.length > 0 && (
              <>
                Menampilkan {Math.min(100, filteredTransactions.length)} dari{" "}
                {filteredTransactions.length} transaksi
                {filteredTransactions.length !== transactions.length && (
                  <span className="ml-2 text-blue-600">
                    (difilter dari {transactions.length} total)
                  </span>
                )}
              </>
            )}
          </div>
          {filteredTransactions.length > 100 && (
            <p className="text-xs text-gray-400">
              *Menampilkan 100 transaksi pertama. Gunakan filter untuk lebih
              spesifik.
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
