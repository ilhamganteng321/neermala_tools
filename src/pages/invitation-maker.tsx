// invitation-maker.tsx
import { InvitationForm } from "@/components/form/invitation-form";
import { InvitationCard } from "@/components/invitation/invitation-card";
import { PDFDownloadButton } from "@/components/pdf/pdf-download-button";
import { PrintProvider, usePrint } from "@/components/pdf/pdf-print-context";
import { ThemeSelector } from "@/components/theme/theme-selector";
import { FrontCover } from "@/components/invitation/invitation-front";
import { BackCover } from "@/components/invitation/invitation-back";
import type { InvitationData, ThemeType } from "@/data/types/invitations";
import { defaultInvitationData } from "@/lib/default-data";
import { useState } from "react";

function InvitationMakerInner() {
  const [invitationData, setInvitationData] = useState<InvitationData>(
    defaultInvitationData,
  );
  const [currentTheme, setCurrentTheme] = useState<ThemeType>("elegant");
  const { componentRef } = usePrint();

  return (
    <div className="min-h-screen bg-linear-to-br from-primary to-secondary p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-light tracking-wide text-secondary">
            Wedding Invitation Generator
          </h1>
          <p className="text-secondary mt-2">
            Create your elegant wedding invitation
          </p>
        </div>

        {/* Theme Selector + Download */}
        <div className="flex gap-3 mb-8 flex-wrap items-center justify-center">
          <ThemeSelector
            currentTheme={currentTheme}
            onThemeChange={setCurrentTheme}
          />
          <PDFDownloadButton data={invitationData} theme={currentTheme} />
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Form */}
          <div className="bg-secondary/30 rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4 text-primary">
              Invitation Details
            </h2>
            <InvitationForm
              data={invitationData}
              onChange={setInvitationData}
            />
          </div>

          {/* Preview */}
          <div className="bg-secondary/30 rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4 text-primary">Preview</h2>
            <InvitationCard data={invitationData} theme={currentTheme} />
          </div>
        </div>

        {/*
          Konten print — hidden di layar, tapi ada di DOM supaya ref tidak null.
          Berisi FRONT + BACK dalam satu wrapper yang di-ref.
          print-color-adjust: exact supaya background & warna tema tercetak.
        */}
        <div className="hidden print:block">
          <div ref={componentRef}>
            {/* Halaman 1 — Front Cover */}
            <div
              style={{
                width: 350,
                height: 500,
                pageBreakAfter: "always",
                breakAfter: "page",
              }}
              className="w-[210mm] h-[148mm] flex flex-col"
            >
              <FrontCover data={invitationData} theme={currentTheme} />
            </div>

            {/* Halaman 2 — Back Cover */}
            <div
              style={{
                width: 350,
                height: 500,
                pageBreakAfter: "auto",
                breakAfter: "auto",
              }}
              className="print-container h-125 overflow-y-auto print:h-auto print:overflow-visible"
            >
              <BackCover data={invitationData} theme={currentTheme} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function InvitationMaker() {
  return (
    <PrintProvider>
      <InvitationMakerInner />
    </PrintProvider>
  );
}
