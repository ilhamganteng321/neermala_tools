export interface Transaction {
  id: string;
  tanggal: string;
  deskripsi: string;
  kategori: string;
  pemasukan: number;
  pengeluaran: number;
}

export interface Summary {
  totalPemasukan: number;
  totalPengeluaran: number;
  saldo: number;
}

export interface MonthlyData {
  bulan: string;
  pemasukan: number;
  pengeluaran: number;
}
