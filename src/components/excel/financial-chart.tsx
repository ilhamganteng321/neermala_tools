import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTransactionStore } from "@/store/transaction-store";

export function FinancialChart() {
  const { monthlyData, transactions } = useTransactionStore();
  const hasData = transactions.length > 0;

  if (!hasData) {
    return (
      <Card className="border-primary " id="financial-chart">
        <CardHeader>
          <CardTitle>Grafik Keuangan</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80 flex items-center justify-center bg-secondary rounded">
            <p className="text-primary">Upload data untuk melihat grafik</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Format label bulan untuk tampilan yang lebih baik
  const formattedData = monthlyData.map((item) => ({
    ...item,
    bulanLabel: formatBulan(item.bulan),
    pemasukan: item.pemasukan,
    pengeluaran: item.pengeluaran,
  }));

  function formatBulan(bulanStr: string) {
    const [tahun, bulan] = bulanStr.split("-");
    const bulanNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "Mei",
      "Jun",
      "Jul",
      "Agu",
      "Sep",
      "Okt",
      "Nov",
      "Des",
    ];
    return `${bulanNames[parseInt(bulan) - 1]} ${tahun}`;
  }

  const formatRupiah = (value: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Grafik Pemasukan vs Pengeluaran per Bulan</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-96">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={formattedData}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="bulanLabel" />
              <YAxis tickFormatter={(value) => formatRupiah(value)} />
              <Tooltip
                formatter={(value) => {
                  if (typeof value === "number") return formatRupiah(value);
                  return value;
                }}
              />
              <Legend />
              <Bar
                dataKey="pemasukan"
                fill="#4ade80"
                name="Pemasukan"
                radius={[4, 4, 0, 0]}
              />
              <Bar
                dataKey="pengeluaran"
                fill="#f87171"
                name="Pengeluaran"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
