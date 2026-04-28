import { Button } from "@/components/ui/button";
import { FileText, Loader2 } from "lucide-react";
import { useState } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { useTransactionStore } from "@/store/transaction-store";

export function ExportPDFButton() {
  const [isExporting, setIsExporting] = useState(false);
  const { summary, transactions, monthlyData } = useTransactionStore();
  const hasData = transactions.length > 0;

  const formatRupiah = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatBulan = (bulanStr: string) => {
    const [tahun, bulan] = bulanStr.split("-");
    const bulanNames = [
      "Januari",
      "Februari",
      "Maret",
      "April",
      "Mei",
      "Juni",
      "Juli",
      "Agustus",
      "September",
      "Oktober",
      "November",
      "Desember",
    ];
    return `${bulanNames[parseInt(bulan) - 1]} ${tahun}`;
  };

  const exportToPDF = async () => {
    if (!hasData) return;
    setIsExporting(true);

    try {
      // Buat container temporary — semua warna HARDCODED hex/rgb, TANPA CSS variables
      const pdfContainer = document.createElement("div");
      pdfContainer.style.cssText = `
        position: absolute;
        top: -9999px;
        left: -9999px;
        width: 794px;
        background-color: #ffffff;
        padding: 32px;
        font-family: Arial, sans-serif;
        color: #111111;
        box-sizing: border-box;
      `;
      document.body.appendChild(pdfContainer);

      // ── 1. Header ──────────────────────────────────────────────
      pdfContainer.innerHTML += `
        <div style="text-align:center; margin-bottom:24px; padding-bottom:16px; border-bottom:2px solid #e5e7eb;">
          <h1 style="font-size:26px; font-weight:700; margin:0; color:#111111;">📊 Laporan Keuangan</h1>
          <p style="font-size:12px; color:#6b7280; margin:6px 0 0 0;">
            Dicetak pada: ${new Date().toLocaleString("id-ID", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        </div>
      `;

      // ── 2. Ringkasan ───────────────────────────────────────────
      const saldoColor = summary.saldo >= 0 ? "#1d4ed8" : "#ea580c";
      const saldoBg = summary.saldo >= 0 ? "#eff6ff" : "#fff7ed";
      const saldoBorder = summary.saldo >= 0 ? "#bfdbfe" : "#fed7aa";

      pdfContainer.innerHTML += `
        <h2 style="font-size:15px; font-weight:700; margin:0 0 12px 0; color:#374151;">Ringkasan Keuangan</h2>
        <div style="display:grid; grid-template-columns:repeat(3,1fr); gap:12px; margin-bottom:28px;">
          <div style="background:#f0fdf4; border:1px solid #bbf7d0; border-radius:8px; padding:14px; text-align:center;">
            <p style="font-size:11px; color:#15803d; margin:0 0 6px 0; font-weight:600;">Total Pemasukan</p>
            <p style="font-size:17px; font-weight:700; color:#15803d; margin:0;">${formatRupiah(summary.totalPemasukan)}</p>
          </div>
          <div style="background:#fef2f2; border:1px solid #fecaca; border-radius:8px; padding:14px; text-align:center;">
            <p style="font-size:11px; color:#b91c1c; margin:0 0 6px 0; font-weight:600;">Total Pengeluaran</p>
            <p style="font-size:17px; font-weight:700; color:#b91c1c; margin:0;">${formatRupiah(summary.totalPengeluaran)}</p>
          </div>
          <div style="background:${saldoBg}; border:1px solid ${saldoBorder}; border-radius:8px; padding:14px; text-align:center;">
            <p style="font-size:11px; color:${saldoColor}; margin:0 0 6px 0; font-weight:600;">Saldo Akhir</p>
            <p style="font-size:17px; font-weight:700; color:${saldoColor}; margin:0;">${formatRupiah(summary.saldo)}</p>
            <p style="font-size:10px; color:#6b7280; margin:4px 0 0 0;">${summary.saldo >= 0 ? "Laba bersih" : "Rugi bersih"}</p>
          </div>
        </div>
      `;

      // ── 3. Ringkasan Per Bulan ─────────────────────────────────
      if (monthlyData.length > 0) {
        const monthlyRows = monthlyData
          .map((m, i) => {
            const selisih = m.pemasukan - m.pengeluaran;
            const rowBg = i % 2 === 0 ? "#ffffff" : "#f9fafb";
            return `
            <tr style="background:${rowBg}; border-bottom:1px solid #e5e7eb;">
              <td style="padding:7px 10px;">${formatBulan(m.bulan)}</td>
              <td style="padding:7px 10px; text-align:right; color:#15803d;">${formatRupiah(m.pemasukan)}</td>
              <td style="padding:7px 10px; text-align:right; color:#b91c1c;">${formatRupiah(m.pengeluaran)}</td>
              <td style="padding:7px 10px; text-align:right; color:${selisih >= 0 ? "#1d4ed8" : "#ea580c"}; font-weight:600;">
                ${selisih >= 0 ? "+" : ""}${formatRupiah(selisih)}
              </td>
            </tr>
          `;
          })
          .join("");

        pdfContainer.innerHTML += `
          <h2 style="font-size:15px; font-weight:700; margin:0 0 12px 0; color:#374151;">Ringkasan Per Bulan</h2>
          <table style="width:100%; border-collapse:collapse; font-size:11px; margin-bottom:28px;">
            <thead>
              <tr style="background:#f3f4f6; border-bottom:2px solid #d1d5db;">
                <th style="padding:8px 10px; text-align:left; color:#374151;">Bulan</th>
                <th style="padding:8px 10px; text-align:right; color:#374151;">Pemasukan</th>
                <th style="padding:8px 10px; text-align:right; color:#374151;">Pengeluaran</th>
                <th style="padding:8px 10px; text-align:right; color:#374151;">Selisih</th>
              </tr>
            </thead>
            <tbody>${monthlyRows}</tbody>
          </table>
        `;
      }

      // ── 4. Tabel Transaksi ─────────────────────────────────────
      const txRows = transactions
        .slice(0, 100)
        .map((tx, i) => {
          const rowBg = i % 2 === 0 ? "#ffffff" : "#f9fafb";
          return `
          <tr style="background:${rowBg}; border-bottom:1px solid #e5e7eb;">
            <td style="padding:6px 8px; white-space:nowrap;">${tx.tanggal}</td>
            <td style="padding:6px 8px;">${tx.deskripsi}</td>
            <td style="padding:6px 8px;">
              <span style="background:#e5e7eb; color:#374151; font-size:10px; padding:2px 7px; border-radius:999px;">${tx.kategori}</span>
            </td>
            <td style="padding:6px 8px; text-align:right; color:#15803d;">
              ${tx.pemasukan > 0 ? formatRupiah(tx.pemasukan) : "-"}
            </td>
            <td style="padding:6px 8px; text-align:right; color:#b91c1c;">
              ${tx.pengeluaran > 0 ? formatRupiah(tx.pengeluaran) : "-"}
            </td>
          </tr>
        `;
        })
        .join("");

      pdfContainer.innerHTML += `
        <h2 style="font-size:15px; font-weight:700; margin:0 0 12px 0; color:#374151;">
          Daftar Transaksi
          ${transactions.length > 100 ? `<span style="font-size:11px; font-weight:400; color:#6b7280;">(menampilkan 100 dari ${transactions.length})</span>` : ""}
        </h2>
        <table style="width:100%; border-collapse:collapse; font-size:11px; margin-bottom:24px;">
          <thead>
            <tr style="background:#f3f4f6; border-bottom:2px solid #d1d5db;">
              <th style="padding:8px; text-align:left; color:#374151; white-space:nowrap;">Tanggal</th>
              <th style="padding:8px; text-align:left; color:#374151;">Deskripsi</th>
              <th style="padding:8px; text-align:left; color:#374151;">Kategori</th>
              <th style="padding:8px; text-align:right; color:#374151;">Pemasukan</th>
              <th style="padding:8px; text-align:right; color:#374151;">Pengeluaran</th>
            </tr>
          </thead>
          <tbody>${txRows}</tbody>
        </table>
      `;

      // ── 5. Footer ──────────────────────────────────────────────
      pdfContainer.innerHTML += `
        <div style="margin-top:16px; padding-top:12px; border-top:1px solid #e5e7eb; text-align:center;">
          <p style="font-size:10px; color:#9ca3af; margin:0;">
            Laporan dibuat dengan Aplikasi Keuangan UMKM &nbsp;•&nbsp; ${new Date().toLocaleDateString("id-ID")}
          </p>
        </div>
      `;

      // ── Convert ke canvas & PDF ────────────────────────────────
      const canvas = await html2canvas(pdfContainer, {
        scale: 2,
        backgroundColor: "#ffffff",
        logging: false,
        useCORS: true,
      });

      document.body.removeChild(pdfContainer);

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgHeight = (canvas.height * pdfWidth) / canvas.width;

      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, "PNG", 0, position, pdfWidth, imgHeight);
      heightLeft -= pdfHeight;

      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, position, pdfWidth, imgHeight);
        heightLeft -= pdfHeight;
      }

      pdf.save(`laporan-keuangan-${new Date().toISOString().slice(0, 10)}.pdf`);
    } catch (error) {
      console.error("Error export PDF:", error);
      alert("Gagal export PDF. Silakan coba lagi.");
    } finally {
      setIsExporting(false);
    }
  };

  if (!hasData) return null;

  return (
    <Button
      variant="outline"
      onClick={exportToPDF}
      disabled={isExporting}
      className="gap-2"
    >
      {isExporting ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <FileText className="h-4 w-4" />
      )}
      {isExporting ? "Menyiapkan PDF..." : "Export PDF"}
    </Button>
  );
}
