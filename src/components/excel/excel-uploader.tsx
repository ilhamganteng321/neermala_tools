import { useRef } from "react";
import * as XLSX from "xlsx";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import { useTransactionStore } from "@/store/transaction-store";
import type { Transaction } from "@/data/types";

export function ExcelUploader() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { setTransactions, calculateSummaryAndChart } = useTransactionStore();
  // 1. Tambah cellDates: true

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = (e) => {
      const data = new Uint8Array(e.target?.result as ArrayBuffer);
      const workbook = XLSX.read(data, { type: "array", cellDates: true }); // ✅ fix
      const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(firstSheet);

      console.log("Data dari Excel:", jsonData);
      processExcelData(jsonData);
    };

    reader.readAsArrayBuffer(file);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const processExcelData = (data: any[]) => {
    const transactions: Transaction[] = data.map((row) => {
      let pemasukan = 0;
      let pengeluaran = 0;

      const rawPemasukan =
        row["Pemasukan"] || row["pemasukan"] || row["Income"] || 0;
      const rawPengeluaran =
        row["Pengeluaran"] || row["pengeluaran"] || row["Expense"] || 0;

      pemasukan =
        typeof rawPemasukan === "number"
          ? rawPemasukan
          : parseFloat(rawPemasukan) || 0;
      pengeluaran =
        typeof rawPengeluaran === "number"
          ? rawPengeluaran
          : parseFloat(rawPengeluaran) || 0;

      // ✅ Fix tanggal
      const rawTanggal = row["Tanggal"] || row["tanggal"] || row["Date"] || "";
      let tanggal = "";

      if (rawTanggal instanceof Date) {
        tanggal = rawTanggal.toISOString().substring(0, 10);
      } else if (typeof rawTanggal === "number") {
        const jsDate = XLSX.SSF.parse_date_code(rawTanggal);
        tanggal = `${jsDate.y}-${String(jsDate.m).padStart(2, "0")}-${String(jsDate.d).padStart(2, "0")}`;
      } else {
        tanggal = String(rawTanggal);
      }

      return {
        id: crypto.randomUUID(),
        tanggal,
        deskripsi:
          row["Deskripsi"] || row["deskripsi"] || row["Description"] || "",
        kategori:
          row["Kategori"] || row["kategori"] || row["Category"] || "Lainnya",
        pemasukan,
        pengeluaran,
      };
    });

    const validTransactions = transactions.filter((tx) => tx.tanggal);
    setTransactions(validTransactions);
    calculateSummaryAndChart(validTransactions);
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="flex flex-col items-center gap-4 p-6 border border-dashed border-primary rounded-lg bg-secondary ">
      <input
        ref={fileInputRef}
        type="file"
        accept=".xlsx, .xls, .csv"
        onChange={handleFileUpload}
        className="hidden"
      />
      <Upload className="w-12 h-12 text-primary" />
      <p className="text-sm text-primary">
        Upload file Excel (.xlsx, .xls) atau CSV
      </p>
      <Button onClick={handleButtonClick} variant="default">
        Pilih File Excel
      </Button>
      <p className="text-xs text-primary">
        Format yang diharapkan: Tanggal, Deskripsi, Kategori, Pemasukan,
        Pengeluaran
      </p>
    </div>
  );
}
