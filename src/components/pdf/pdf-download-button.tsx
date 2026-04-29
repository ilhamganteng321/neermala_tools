// components/pdf/pdf-download-button.tsx
import { useReactToPrint } from "react-to-print";
import { usePrint } from "./pdf-print-context";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import type { InvitationData, ThemeType } from "@/data/types/invitations";

interface PDFDownloadButtonProps {
  data: InvitationData;
  theme: ThemeType;
}

export function PDFDownloadButton({ data }: PDFDownloadButtonProps) {
  const { componentRef } = usePrint();

  const handlePrint = useReactToPrint({
    contentRef: componentRef,
    documentTitle: `Undangan_${data.couple.groomNickname}_${data.couple.brideNickname}`,
    pageStyle: `
      @page {
        size: 350px 500px;
        margin: 0;
      }
      @media print {
        html, body {
          margin: 0;
          padding: 0;
          -webkit-print-color-adjust: exact;
          print-color-adjust: exact;
        }
        /* Tiap halaman pas 350×500 */
        div[style*="page-break-after"] {
          width: 350px !important;
          height: 500px !important;
          overflow: hidden;
        }
      }
    `,
  });

  return (
    <Button
      onClick={() => handlePrint()}
      className="bg-linear-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white shadow-lg gap-2"
    >
      <Download className="h-4 w-4" />
      Unduh Undangan
    </Button>
  );
}
