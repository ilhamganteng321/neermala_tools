import { FormPanel } from "@/components/newspaper/form-panel";
import { NewspaperPreview } from "@/components/newspaper/preview";
import { THEMES } from "@/data/theme";
import type { NewspaperData } from "@/data/types/newspaper";
import { useFonts } from "@/hooks/use-font";
import { fileToDataUrl } from "@/lib/utils";
import React, { useState, useRef, useCallback } from "react";
import { toPng } from "html-to-image";

const INITIAL_FORM: NewspaperData = {
  headerTitle: "SELAMAT HARI KARTINI",
  date: "21 April 2025",
  mainTitle: "R.A. Kartini — Pahlawan Emansipasi Wanita",
  description:
    "Raden Adjeng Kartini lahir pada 21 April 1879 di Jepara, Jawa Tengah. Ia dikenal sebagai pelopor kebangkitan perempuan pribumi. Perjuangannya merintis pendidikan bagi kaum wanita menjadi inspirasi bagi jutaan perempuan Indonesia hingga hari ini.\n\nMelalui surat-suratnya kepada sahabat penanya di Belanda, Kartini mengungkapkan kegelisahan serta harapannya akan kesetaraan hak antara laki-laki dan perempuan, terutama dalam hal pendidikan dan kebebasan berpendapat.",
  quote: "Habis gelap terbitlah terang.",
  image: null,
};

export const NewspaperPosterGenerator: React.FC = () => {
  const [dark, setDark] = useState(false);
  const [form, setForm] = useState<NewspaperData>(INITIAL_FORM);
  const previewRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useFonts();

  const palette = dark ? THEMES.dark : THEMES.light;

  const handleFormChange = useCallback(
    <K extends keyof NewspaperData>(key: K, value: NewspaperData[K]) => {
      setForm((prev) => ({ ...prev, [key]: value }));
    },
    [],
  );

  const handleImageUpload = useCallback(async (file: File) => {
    try {
      const dataUrl = await fileToDataUrl(file);
      setForm((prev) => ({ ...prev, image: dataUrl }));
    } catch (error) {
      console.error("Failed to upload image:", error);
    }
  }, []);

  const handleImageRemove = useCallback(() => {
    setForm((prev) => ({ ...prev, image: null }));
    if (fileInputRef.current) fileInputRef.current.value = "";
  }, []);

  const downloadImage = async (
    node: HTMLElement,
    filename: string = "newspaper-poster.png",
  ): Promise<void> => {
    try {
      const dataUrl = await toPng(node, { cacheBust: true, pixelRatio: 2 });
      const a = document.createElement("a");
      a.download = filename;
      a.href = dataUrl;
      a.click();
    } catch (error) {
      console.log(error);
    }
  };

  const handleDownload = useCallback(async () => {
    if (!previewRef.current) return;
    try {
      await downloadImage(previewRef.current);
    } catch (error) {
      console.log(error);

      alert(
        "Download gagal. Pastikan browser mendukung html-to-image atau coba klik kanan → Save Image pada preview.",
      );
    }
  }, []);

  const handleReset = useCallback(() => {
    setForm(INITIAL_FORM);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }, []);

  return (
    <div
      className="min-h-screen p-4 md:p-8"
      style={{ background: dark ? "#12100a" : "#e8dcc8" }}
    >
      <div className="text-center mb-6">
        <h1
          className="text-3xl md:text-4xl font-black tracking-tight"
          style={{
            fontFamily: "'Playfair Display', serif",
            color: dark ? "#d4b07a" : "#2c1a06",
          }}
        >
          Newspaper Poster Generator
        </h1>
        <p
          className="text-sm mt-1"
          style={{
            fontFamily: "'Libre Baskerville', serif",
            color: dark ? "#a89060" : "#7a5c30",
            fontStyle: "italic",
          }}
        >
          Buat poster bergaya koran vintage dalam hitungan detik
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 max-w-6xl mx-auto">
        <FormPanel
          form={form}
          dark={dark}
          onDarkChange={setDark}
          onFormChange={handleFormChange}
          onImageUpload={handleImageUpload}
          onImageRemove={handleImageRemove}
          onDownload={handleDownload}
          onReset={handleReset}
          fileInputRef={fileInputRef}
        />

        <div className="flex-1 min-w-0">
          <div className="sticky top-4">
            <p
              className="text-xs font-bold uppercase tracking-widest mb-2"
              style={{ color: dark ? "#a89060" : "#7a5c30" }}
            >
              ◎ Pratinjau Langsung
            </p>
            <NewspaperPreview
              data={form}
              palette={palette}
              previewRef={previewRef}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewspaperPosterGenerator;
