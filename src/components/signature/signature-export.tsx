import React, { useCallback, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import {
  Download,
  FileImage,
  FileText,
  ChevronDown,
  FileCode,
  Loader2,
} from "lucide-react";
import jsPDF from "jspdf";

interface SignatureExportProps {
  getCanvas: () => HTMLCanvasElement | null;
  fileName?: string;
  disabled?: boolean;
  onSuccess?: (format: string) => void;
  onError?: (error: Error) => void;
}

type ExportFormat = "PNG" | "PDF" | "JPEG" | "SVG";

export const SignatureExport: React.FC<SignatureExportProps> = ({
  getCanvas,
  fileName = "tanda-tangan",
  disabled,
  onSuccess,
  onError,
}) => {
  const [isExporting, setIsExporting] = useState<ExportFormat | null>(null);

  // Validasi canvas - DIPERBAIKI
  const validateCanvas = useCallback((): HTMLCanvasElement | null => {
    const canvas = getCanvas();
    if (!canvas) {
      onError?.(new Error("Canvas tidak ditemukan"));
      return null;
    }

    const context = canvas.getContext("2d");
    if (!context) {
      onError?.(new Error("Tidak dapat mengakses konteks canvas"));
      return null;
    }

    // Cek apakah canvas kosong dengan cara yang lebih sederhana dan reliable
    try {
      const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;

      let hasContent = false;
      // Cek pixel per pixel (lebih akurat)
      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        const a = data[i + 3];

        // Jika bukan putih (255,255,255) dan tidak transparan (a > 0)
        if (!(r === 255 && g === 255 && b === 255) && a > 0) {
          hasContent = true;
          break;
        }
      }

      if (!hasContent) {
        onError?.(
          new Error(
            "Tanda tangan kosong, silakan buat tanda tangan terlebih dahulu",
          ),
        );
        return null;
      }
    } catch (error) {
      console.error("Error validating canvas:", error);
    }

    return canvas;
  }, [getCanvas, onError]);

  // Download PNG / JPEG
  const downloadRaster = useCallback(
    (format: "PNG" | "JPEG") => {
      const canvas = validateCanvas();
      if (!canvas) return;

      setIsExporting(format);

      try {
        const mimeType = format === "PNG" ? "image/png" : "image/jpeg";
        const extension = format.toLowerCase();
        const dataURL = canvas.toDataURL(mimeType, 1.0);

        const link = document.createElement("a");
        link.href = dataURL;
        link.download = `${fileName}.${extension}`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        onSuccess?.(format);
      } catch (error) {
        onError?.(
          error instanceof Error
            ? error
            : new Error(`Gagal download ${format}`),
        );
      } finally {
        setIsExporting(null);
      }
    },
    [validateCanvas, fileName, onSuccess, onError],
  );

  // Download PDF
  const downloadPDF = useCallback(() => {
    const canvas = validateCanvas();
    if (!canvas) return;

    setIsExporting("PDF");

    try {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: canvas.width > canvas.height ? "landscape" : "portrait",
        unit: "mm",
        format: "a4",
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();

      const padding = 20;
      const maxWidth = pdfWidth - padding;
      const maxHeight = pdfHeight - padding;

      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = imgWidth / imgHeight;

      let finalWidth = maxWidth;
      let finalHeight = finalWidth / ratio;

      if (finalHeight > maxHeight) {
        finalHeight = maxHeight;
        finalWidth = finalHeight * ratio;
      }

      const x = (pdfWidth - finalWidth) / 2;
      const y = (pdfHeight - finalHeight) / 2;

      pdf.setFontSize(10);
      pdf.setTextColor(100, 100, 100);
      pdf.text("Tanda Tangan Digital", pdfWidth / 2, y - 5, {
        align: "center",
      });

      pdf.addImage(imgData, "PNG", x, y, finalWidth, finalHeight);

      const timestamp = new Date().toLocaleString("id-ID");
      pdf.setFontSize(8);
      pdf.setTextColor(150, 150, 150);
      pdf.text(`Dibuat pada: ${timestamp}`, pdfWidth / 2, pdfHeight - 10, {
        align: "center",
      });

      pdf.save(`${fileName}.pdf`);
      onSuccess?.("PDF");
    } catch (error) {
      onError?.(
        error instanceof Error ? error : new Error("Gagal membuat PDF"),
      );
    } finally {
      setIsExporting(null);
    }
  }, [validateCanvas, fileName, onSuccess, onError]);

  // Download SVG
  const downloadSVG = useCallback(() => {
    const canvas = validateCanvas();
    if (!canvas) return;

    setIsExporting("SVG");

    try {
      const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
      const imgData = canvas.toDataURL("image/png");

      svg.setAttribute("width", canvas.width.toString());
      svg.setAttribute("height", canvas.height.toString());
      svg.setAttribute("xmlns", "http://www.w3.org/2000/svg");
      svg.setAttribute("xmlns:xlink", "http://www.w3.org/1999/xlink");

      const image = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "image",
      );
      image.setAttribute("href", imgData);
      image.setAttribute("width", "100%");
      image.setAttribute("height", "100%");
      image.setAttribute("preserveAspectRatio", "none");

      svg.appendChild(image);

      const serializer = new XMLSerializer();
      const svgString = serializer.serializeToString(svg);
      const blob = new Blob([svgString], { type: "image/svg+xml" });
      const url = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = `${fileName}.svg`;
      link.click();

      URL.revokeObjectURL(url);
      onSuccess?.("SVG");
    } catch (error) {
      onError?.(
        error instanceof Error ? error : new Error("Gagal membuat SVG"),
      );
    } finally {
      setIsExporting(null);
    }
  }, [validateCanvas, fileName, onSuccess, onError]);

  // Cek apakah signature tersedia - DIPERBAIKI (lebih sederhana)
  const isSignatureAvailable = useCallback((): boolean => {
    const canvas = getCanvas();
    if (!canvas) return false;

    try {
      const context = canvas.getContext("2d");
      if (!context) return false;

      const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;

      // Cek apakah ada goresan (bukan background putih/transparan)
      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        const a = data[i + 3];

        // Deteksi warna yang bukan putih (255,255,255) dan tidak transparan
        if (!(r === 255 && g === 255 && b === 255) && a > 0) {
          return true;
        }
      }
      return false;
    } catch (error) {
      console.error("Error checking signature:", error);
      return false;
    }
  }, [getCanvas]);

  return (
    <div className="flex gap-2 w-full">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            className="w-full gap-2"
            disabled={disabled || isExporting !== null}
          >
            {isExporting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Download className="w-4 h-4" />
            )}
            {isExporting
              ? `Menyimpan ${isExporting}...`
              : "Simpan Tanda Tangan"}
            {!isExporting && <ChevronDown className="w-4 h-4 opacity-50" />}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>Format Gambar</DropdownMenuLabel>
          <DropdownMenuItem
            onClick={() => downloadRaster("PNG")}
            className="gap-2 cursor-pointer"
            disabled={!!isExporting}
          >
            <FileImage className="w-4 h-4 text-blue-500" />
            <div className="flex flex-col">
              <span>PNG (Transparan)</span>
              <span className="text-[10px] text-muted-foreground">
                Kualitas terbaik, ukuran besar
              </span>
            </div>
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={() => downloadRaster("JPEG")}
            className="gap-2 cursor-pointer"
            disabled={!!isExporting}
          >
            <FileImage className="w-4 h-4 text-green-500" />
            <div className="flex flex-col">
              <span>JPEG (Kompresi)</span>
              <span className="text-[10px] text-muted-foreground">
                Ukuran kecil, tanpa transparansi
              </span>
            </div>
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuLabel>Dokumen</DropdownMenuLabel>
          <DropdownMenuItem
            onClick={downloadPDF}
            className="gap-2 cursor-pointer"
            disabled={!!isExporting}
          >
            <FileText className="w-4 h-4 text-red-500" />
            <div className="flex flex-col">
              <span>PDF (A4)</span>
              <span className="text-[10px] text-muted-foreground">
                Siap cetak, dengan header & footer
              </span>
            </div>
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuLabel>Lainnya</DropdownMenuLabel>
          <DropdownMenuItem
            onClick={downloadSVG}
            className="gap-2 cursor-pointer"
            disabled={!!isExporting}
          >
            <FileCode className="w-4 h-4 text-purple-500" />
            <div className="flex flex-col">
              <span>SVG (Vector)</span>
              <span className="text-[10px] text-muted-foreground">
                Scalable, untuk web
              </span>
            </div>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
