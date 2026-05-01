// src/components/funfact/funfact-form.tsx
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Upload, RefreshCw, Sparkles } from "lucide-react";
import { convertToBase64 } from "@/lib/utils";
import type{ FunFact } from "@/data/types/funfact";

interface FunFactFormProps {
  funfactHook: {
    funfact: FunFact;
    updateField: <K extends keyof FunFact>(key: K, value: FunFact[K]) => void;
    setImage: (image: string | null) => void;
    reset: () => void;
  };
}

export function FunFactForm({ funfactHook }: FunFactFormProps) {
  const { funfact, updateField, setImage, reset } = funfactHook;

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const base64 = await convertToBase64(file);
    setImage(base64);
  };

  const handleDragOver = (e: React.DragEvent) => e.preventDefault();
  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      const base64 = await convertToBase64(file);
      setImage(base64);
    }
  };

  return (
    <div className="space-y-6 p-6 bg-primary-foreground rounded-2xl shadow-sm border">
      <div>
        <Label htmlFor="label">Label / Tag</Label>
        <Input
          id="label"
          value={funfact.label}
          onChange={(e) => updateField("label", e.target.value)}
          placeholder="FUN FACT"
        />
      </div>

      <div>
        <Label htmlFor="title">Judul Besar</Label>
        <Input
          id="title"
          value={funfact.title}
          onChange={(e) => updateField("title", e.target.value)}
          placeholder="TAHUKAH KAMU?"
          className="text-lg font-bold"
        />
      </div>

      <div>
        <Label htmlFor="description">Deskripsi</Label>
        <Textarea
          id="description"
          value={funfact.description}
          onChange={(e) => updateField("description", e.target.value)}
          rows={6}
          placeholder="Masukkan fakta menarik di sini..."
        />
      </div>

      <div>
        <Label>Upload Gambar Otak / Ilustrasi</Label>
        <div
          className="border-2 border-dashed border-orange-300 rounded-xl p-8 text-center hover:border-orange-400 transition-colors cursor-pointer"
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onClick={() => document.getElementById("image-upload")?.click()}
        >
          <Upload className="mx-auto h-12 w-12 text-orange-400 mb-3" />
          <p className="text-sm text-gray-600">
            Drag & drop atau klik untuk upload gambar
          </p>
          <input
            id="image-upload"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImageUpload}
          />
        </div>
      </div>

      <div className="flex gap-3 pt-4">
        <Button onClick={reset} variant="outline" className="flex-1">
          <RefreshCw className="w-4 h-4 mr-2" />
          Reset
        </Button>
        <Button
          onClick={() => {}}
          className="flex-1 bg-orange-500 hover:bg-orange-600"
        >
          <Sparkles className="w-4 h-4 mr-2" />
          Random Fact
        </Button>
      </div>
    </div>
  );
}
