import { ExcelUploader } from "@/components/excel/excel-uploader";
import { FinancialSummary } from "@/components/excel/financial-summary";
import { Button } from "@/components/ui/button";
import { useTransactionStore } from "@/store/transaction-store";
import { Download, RefreshCw } from "lucide-react";
import { FinancialChart } from "../components/excel/financial-chart";
import { TransactionTable } from "@/components/excel/transaction-table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function ReportExcelPage() {
  const { clearData, transactions } = useTransactionStore();
  const hasData = transactions.length > 0;

  const downloadSampleExcel = () => {
    // Import XLSX
    import("xlsx").then((XLSX) => {
      // Data contoh
      const sampleData = [
        {
          Tanggal: "2026-01-05",
          Deskripsi: "Penjualan Kopi Reguler",
          Kategori: "Minuman",
          Pemasukan: 3500000,
          Pengeluaran: 0,
        },
        {
          Tanggal: "2026-01-10",
          Deskripsi: "Beli Biji Kopi",
          Kategori: "Bahan Baku",
          Pemasukan: 0,
          Pengeluaran: 1200000,
        },
        {
          Tanggal: "2026-01-15",
          Deskripsi: "Penjualan Kopi Latte",
          Kategori: "Minuman",
          Pemasukan: 4250000,
          Pengeluaran: 0,
        },
        {
          Tanggal: "2026-01-20",
          Deskripsi: "Beli Susu & Gula",
          Kategori: "Bahan Baku",
          Pemasukan: 0,
          Pengeluaran: 750000,
        },
        {
          Tanggal: "2026-02-02",
          Deskripsi: "Penjualan Kue Kering",
          Kategori: "Makanan",
          Pemasukan: 2800000,
          Pengeluaran: 0,
        },
        {
          Tanggal: "2026-02-18",
          Deskripsi: "Sewa Tempat",
          Kategori: "Operasional",
          Pemasukan: 0,
          Pengeluaran: 2500000,
        },
        {
          Tanggal: "2026-03-10",
          Deskripsi: "Gaji Karyawan",
          Kategori: "Operasional",
          Pemasukan: 0,
          Pengeluaran: 3000000,
        },
        {
          Tanggal: "2026-03-25",
          Deskripsi: "Penjualan Paket Hemat",
          Kategori: "Minuman",
          Pemasukan: 5600000,
          Pengeluaran: 0,
        },
      ];

      // Buat worksheet
      const ws = XLSX.utils.json_to_sheet(sampleData);

      // Set lebar kolom
      ws["!cols"] = [
        { wch: 12 }, // Tanggal
        { wch: 25 }, // Deskripsi
        { wch: 12 }, // Kategori
        { wch: 15 }, // Pemasukan
        { wch: 15 }, // Pengeluaran
      ];

      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Contoh Transaksi");

      // Download file
      XLSX.writeFile(wb, "contoh-laporan-keuangan.xlsx");
    });
  };
  return (
    <TooltipProvider>
      <div className="min-h-screen bg-secondary">
        <div className="container mx-auto py-8 px-4">
          {/* Header dengan tombol di kanan */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-primary flex items-center gap-2">
                📊 Laporan Keuangan
              </h1>
              <p className="text-primary mt-1">
                Upload file Excel untuk melihat ringkasan, grafik, dan tabel
                transaksi
              </p>
            </div>

            {/* Tombol-tombol di kanan */}
            <div className="flex gap-2">
              {/* Tombol Download Contoh Excel */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    onClick={downloadSampleExcel}
                    className="gap-2"
                  >
                    <Download className="h-4 w-4" />
                    Contoh Excel
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Download file Excel contoh untuk testing</p>
                </TooltipContent>
              </Tooltip>
              {/* Tombol Reset (hanya muncul jika ada data) */}
              {hasData && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      onClick={clearData}
                      className="gap-2"
                    >
                      <RefreshCw className="h-4 w-4" />
                      Reset Data
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Hapus semua data yang sudah diupload</p>
                  </TooltipContent>
                </Tooltip>
              )}
            </div>
          </div>

          {/* Upload Area */}
          {!hasData && (
            <div className="mb-8">
              <ExcelUploader />
            </div>
          )}

          {/* Ringkasan Total */}
          <div className="mb-8">
            <FinancialSummary />
          </div>

          {/* Grafik */}
          <div className="mb-8">
            <FinancialChart />
          </div>

          {/* Tabel Transaksi */}
          <div>
            <TransactionTable />
          </div>

          {/* Footer */}
          {hasData && (
            <div className="mt-8 text-center text-xs text-gray-400">
              Data diambil dari file Excel yang diupload. Refresh halaman untuk
              menghapus data.
            </div>
          )}
        </div>
      </div>
    </TooltipProvider>
  );
}
