import { useState, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Download } from "lucide-react";

// Definisi pilihan font
const SIGNATURE_FONTS = [
  { name: "Dancing Script", family: "'Dancing Script', cursive" },
  { name: "Pacifico", family: "'Pacifico', cursive" },
  { name: "Great Vibes", family: "'Great Vibes', cursive" },
  { name: "Mrs Saint Delafield", family: "'Mrs Saint Delafield', cursive" },
  { name: "Alex Brush", family: "'Alex Brush', cursive" },
];

// Ganti color picker default & tambah opsi "Auto (ikut tema)"
const PRESET_COLORS = [
  { label: "Auto", value: "foreground" }, // pakai CSS var
  { label: "Hitam", value: "#000000" },
  { label: "Biru", value: "#1d4ed8" },
  { label: "Merah", value: "#b91c1c" },
  { label: "Hijau", value: "#047857" },
  { label: "Ungu", value: "#6b21a5" },
  { label: "Putih", value: "#ffffff" },
];

export const TextToSignature = () => {
  const [name, setName] = useState("");
  const [selectedFont, setSelectedFont] = useState(SIGNATURE_FONTS[0]);
  const [color, setColor] = useState("#000000");

  // Fungsi untuk download teks sebagai PNG
  const handleDownload = () => {
    if (!name) return;

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set ukuran canvas
    canvas.width = 600;
    canvas.height = 200;

    // Bersihkan background (transparan)
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Setup Font
    ctx.fillStyle = color;
    ctx.font = `60px ${selectedFont.family}`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    // Gambar teks ke tengah canvas
    ctx.fillText(name, canvas.width / 2, canvas.height / 2);

    // Proses Download
    const dataUrl = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.download = `signature-${name.toLowerCase().replace(/\s+/g, "-")}.png`;
    link.href = dataUrl;
    link.click();
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <label className="text-sm font-medium">Ketik Nama Anda</label>
        <Input
          placeholder="Contoh: Ilham Arip"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="text-lg"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Kontrol Warna */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Warna Tanda Tangan</label>
          <div className="flex gap-2">
            {PRESET_COLORS.map((c) => (
              <button
                key={c.value}
                onClick={() => setColor(c.value)}
                className={`w-8 h-8 rounded-full border-2 ${color === c.value ? "border-gray-400" : "border-transparent"}`}
                style={{ backgroundColor: c.value }}
              />
            ))}
            <input
              type="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="w-8 h-8 border-none bg-transparent"
            />
          </div>
        </div>
      </div>

      {/* Grid Pilihan Font */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {SIGNATURE_FONTS.map((font) => (
          <Card
            key={font.name}
            className={`p-4 cursor-pointer transition-all border-2 ${
              selectedFont.name === font.name
                ? "border-primary bg-primary/5"
                : "hover:border-gray-300"
            }`}
            onClick={() => setSelectedFont(font)}
          >
            <div className="flex justify-between items-center mb-2">
              <span className="text-[10px] text-muted-foreground uppercase tracking-widest">
                {font.name}
              </span>
              {selectedFont.name === font.name && (
                <div className="w-2 h-2 rounded-full bg-primary" />
              )}
            </div>
            <p
              className="text-3xl truncate py-2"
              style={{ fontFamily: font.family, color: color }}
            >
              {name || "Signature"}
            </p>
          </Card>
        ))}
      </div>

      <Button
        onClick={handleDownload}
        disabled={!name}
        className="w-full h-12 gap-2"
      >
        <Download className="w-4 h-4" />
        Unduh PNG Transparan
      </Button>

      <p className="text-[11px] text-center text-muted-foreground">
        * Hasil unduhan berupa file PNG dengan latar belakang transparan.
      </p>
    </div>
  );
};
