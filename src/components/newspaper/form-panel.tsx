import type { NewspaperData } from "@/data/types/newspaper";
import type { RefObject } from "react";
import { Card } from "../ui/card";
import { Input } from "../ui/input";
import { Switch } from "../ui/switch";
import { Separator } from "../ui/separator";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { Field, FieldLabel } from "../ui/field";

interface FormPanelProps {
  form: NewspaperData;
  dark: boolean;
  onDarkChange: (checked: boolean) => void;
  onFormChange: <K extends keyof NewspaperData>(
    key: K,
    value: NewspaperData[K],
  ) => void;
  onImageUpload: (file: File) => void;
  onImageRemove: () => void;
  onDownload: () => void;
  onReset: () => void;
  fileInputRef: RefObject<HTMLInputElement | null>;
}

export const FormPanel: React.FC<FormPanelProps> = ({
  form,
  dark,
  onDarkChange,
  onFormChange,
  onImageUpload,
  onImageRemove,
  onDownload,
  onReset,
  fileInputRef,
}) => {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) onImageUpload(file);
  };

  return (
    <div className="w-full lg:w-95 shrink-0">
      <Card
        className="p-5 flex flex-col gap-5 border-0 shadow-xl"
        style={{
          background: dark ? "#1e1810" : "#fdf6e8",
          color: dark ? "#e8d9b8" : "#1a1008",
        }}
      >
        <div className="flex items-center justify-between">
          <span
            className="text-xs font-bold uppercase tracking-widest"
            style={{ color: dark ? "#a89060" : "#7a5c30" }}
          >
            ☀ Light Mode
          </span>
          <Switch checked={dark} onCheckedChange={onDarkChange} />
          <span
            className="text-xs font-bold uppercase tracking-widest"
            style={{ color: dark ? "#a89060" : "#7a5c30" }}
          >
            ☾ Dark Mode
          </span>
        </div>

        <Separator style={{ background: dark ? "#3a2c14" : "#d4b07a" }} />

        <Field>
          <FieldLabel>Header / Nama Koran</FieldLabel>
          <Input
            value={form.headerTitle}
            onChange={(e) => onFormChange("headerTitle", e.target.value)}
            placeholder="SELAMAT HARI KARTINI"
            className="border-stone-300 focus-visible:ring-amber-700"
            style={{ background: dark ? "#2a200e" : "#fff8ee" }}
          />
        </Field>

        <Field>
          <FieldLabel>Tanggal / Edisi</FieldLabel>
          <Input
            value={form.date}
            onChange={(e) => onFormChange("date", e.target.value)}
            placeholder="21 April 2025"
            className="border-stone-300 focus-visible:ring-amber-700"
            style={{ background: dark ? "#2a200e" : "#fff8ee" }}
          />
        </Field>

        <Field>
          <FieldLabel>Judul Utama</FieldLabel>
          <Input
            value={form.mainTitle}
            onChange={(e) => onFormChange("mainTitle", e.target.value)}
            placeholder="R.A. Kartini"
            className="border-stone-300 focus-visible:ring-amber-700"
            style={{ background: dark ? "#2a200e" : "#fff8ee" }}
          />
        </Field>

        <Field>
          <FieldLabel>Isi Artikel</FieldLabel>
          <Textarea
            value={form.description}
            onChange={(e) => onFormChange("description", e.target.value)}
            rows={6}
            placeholder="Tuliskan isi berita atau artikel di sini..."
            className="border-stone-300 focus-visible:ring-amber-700 resize-none"
            style={{ background: dark ? "#2a200e" : "#fff8ee" }}
          />
        </Field>

        <Field>
          <FieldLabel>Kutipan / Highlight</FieldLabel>
          <Input
            value={form.quote}
            onChange={(e) => onFormChange("quote", e.target.value)}
            placeholder="Habis gelap terbitlah terang."
            className="border-stone-300 focus-visible:ring-amber-700"
            style={{ background: dark ? "#2a200e" : "#fff8ee" }}
          />
        </Field>

        <Field>
          <FieldLabel>Foto Utama</FieldLabel>
          <div
            className="border-2 border-dashed rounded p-3 text-center cursor-pointer transition-colors"
            style={{
              borderColor: dark ? "#5c4020" : "#c4a060",
              background: dark ? "#2a200e" : "#fff8ee",
            }}
            onClick={() => fileInputRef.current?.click()}
          >
            {form.image ? (
              <img
                src={form.image}
                alt="preview"
                className="w-full max-h-32 object-cover rounded"
                style={{ filter: "sepia(20%)" }}
              />
            ) : (
              <p
                className="text-xs"
                style={{ color: dark ? "#a89060" : "#8b6030" }}
              >
                Klik untuk unggah foto
              </p>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />
          </div>
          {form.image && (
            <Button
              variant={"destructive"}
              size="sm"
              className="text-xs self-end"
              onClick={onImageRemove}
            >
              Hapus Foto
            </Button>
          )}
        </Field>

        <Separator style={{ background: dark ? "#3a2c14" : "#d4b07a" }} />

        <div className="flex gap-2">
          <Button
            className="flex-1 font-bold tracking-wide"
            style={{
              background: dark ? "#5c3a0a" : "#2c1a06",
              color: dark ? "#f0d090" : "#f5edd8",
            }}
            onClick={onDownload}
          >
            ↓ Unduh PNG
          </Button>
          <Button
            variant="outline"
            className="flex-1"
            style={{
              borderColor: dark ? "#5c4020" : "#c4a060",
              color: dark ? "#a89060" : "#7a5c30",
              background: "transparent",
            }}
            onClick={onReset}
          >
            ↺ Reset
          </Button>
        </div>
      </Card>
    </div>
  );
};
