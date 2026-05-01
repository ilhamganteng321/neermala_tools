import type { NewspaperData, ThemePalette } from "@/data/types/newspaper";
import React from "react";

interface NewspaperPreviewProps {
  data: NewspaperData;
  palette: ThemePalette;
  previewRef: React.RefObject<HTMLDivElement | null>;
}

const Ornament: React.FC<{ palette: ThemePalette }> = ({ palette }) => (
  <div
    className="np-ornament text-center my-1 select-none"
    style={{ color: palette.rule }}
  >
    ✦ ✦ ✦
  </div>
);

const HRule: React.FC<{ palette: ThemePalette; thick?: boolean }> = ({
  palette,
  thick = false,
}) => (
  <div
    style={{
      borderTop: thick
        ? `3px double ${palette.border}`
        : `1px solid ${palette.border}`,
      margin: "4px 0",
    }}
  />
);

export const NewspaperPreview: React.FC<NewspaperPreviewProps> = ({
  data,
  palette,
  previewRef,
}) => {
  const today = data.date || "Vol. CXXXIX — No. 1";

  return (
    <div
      ref={previewRef}
      className="np-preview np-animate"
      style={{
        background: palette.paper,
        color: palette.ink,
        padding: "28px 24px 24px",
        minHeight: 640,
        position: "relative",
        boxShadow: `4px 4px 24px ${palette.shadow}, inset 0 0 80px rgba(180,130,60,0.08)`,
        borderRadius: 2,
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E")`,
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      <div style={{ position: "relative", zIndex: 1 }}>
        <div
          style={{
            background: palette.accent,
            color: palette.paper,
            textAlign: "center",
            fontSize: 9,
            letterSpacing: "0.25em",
            padding: "3px 0",
            fontFamily: "'Libre Baskerville', serif",
            textTransform: "uppercase",
            marginBottom: 6,
          }}
        >
          {today} &nbsp;|&nbsp; EDISI KHUSUS &nbsp;|&nbsp; TERBATAS
        </div>

        <div
          className="np-masthead"
          style={{
            textAlign: "center",
            fontSize: "clamp(26px, 6vw, 44px)",
            fontWeight: 400,
            color: palette.ink,
            lineHeight: 1,
            letterSpacing: "0.05em",
          }}
        >
          {data.headerTitle || "NAMA KORAN ANDA"}
        </div>

        <HRule palette={palette} thick />
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: 8.5,
            color: palette.muted,
            fontFamily: "'Libre Baskerville', serif",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
          }}
        >
          <span>ESTABLISHED MDCCCXCIX</span>
          <span>{today}</span>
          <span>HARGA: GRATIS</span>
        </div>
        <HRule palette={palette} thick />

        <Ornament palette={palette} />

        <h1
          style={{
            textAlign: "center",
            fontSize: "clamp(22px, 5vw, 38px)",
            fontWeight: 900,
            lineHeight: 1.1,
            margin: "8px 0 4px",
            letterSpacing: "0.01em",
            color: palette.ink,
          }}
        >
          {data.mainTitle || "Judul Utama Berita"}
        </h1>

        <HRule palette={palette} />
        <Ornament palette={palette} />
        <HRule palette={palette} />

        <div
          style={{
            display: "grid",
            gridTemplateColumns: data.image ? "1fr 1.6fr" : "1fr",
            gap: 14,
            marginTop: 10,
          }}
        >
          {data.image && (
            <div>
              <div
                style={{
                  border: `2px solid ${palette.border}`,
                  padding: 3,
                  background: palette.bg,
                }}
              >
                <img
                  src={data.image}
                  alt="main"
                  style={{
                    width: "100%",
                    display: "block",
                    objectFit: "cover",
                    maxHeight: 220,
                    filter: "sepia(30%) contrast(1.05)",
                  }}
                />
              </div>
              <p
                style={{
                  fontSize: 8.5,
                  color: palette.muted,
                  textAlign: "center",
                  fontStyle: "italic",
                  marginTop: 3,
                  fontFamily: "'Libre Baskerville', serif",
                }}
              >
                [Dok. Redaksi]
              </p>
            </div>
          )}

          <div
            className={`np-body-text np-dropcap ${
              !data.image ? "np-columns" : ""
            }`}
            style={{ color: palette.ink }}
          >
            {data.description ||
              "Tuliskan isi artikel Anda di sini. Teks akan tampil mengikuti gaya koran vintage dengan tipografi serif klasik dan tata letak kolom yang elegan."}
          </div>
        </div>

        {data.quote && (
          <>
            <div style={{ marginTop: 14 }}>
              <HRule palette={palette} thick />
              <Ornament palette={palette} />
            </div>
            <blockquote
              style={{
                textAlign: "center",
                fontStyle: "italic",
                fontSize: "clamp(13px, 2.5vw, 17px)",
                fontWeight: 700,
                color: palette.accent,
                lineHeight: 1.4,
                padding: "8px 12px",
                borderLeft: `4px solid ${palette.border}`,
                borderRight: `4px solid ${palette.border}`,
                margin: "6px 16px 0",
              }}
            >
              &ldquo;{data.quote}&rdquo;
            </blockquote>
            <HRule palette={palette} />
          </>
        )}

        <div
          style={{
            marginTop: 10,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: 8,
            color: palette.muted,
            fontFamily: "'Libre Baskerville', serif",
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            borderTop: `1px solid ${palette.border}`,
            paddingTop: 5,
          }}
        >
          <span>© Redaksi Koran</span>
          <span className="np-ornament" style={{ fontSize: "0.9em" }}>
            ❧
          </span>
          <span>Cetak di Indonesia</span>
        </div>
      </div>
    </div>
  );
};
