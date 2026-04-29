import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TextToSignature } from "@/components/signature/text-to-signature";
import { DrawCanvas } from "@/components/signature/draw-canvas";

export default function SignaturePage() {
  return (
    <div className="max-w-2xl mx-auto p-6">
      <Tabs defaultValue="draw">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="draw">Gambar Manual</TabsTrigger>
          <TabsTrigger value="text">Ketik Teks</TabsTrigger>
        </TabsList>
        <TabsContent value="draw">
          {/* Komponen DrawCanvas kamu di sini */}
          <DrawCanvas />
        </TabsContent>
        <TabsContent value="text">
          <TextToSignature />
        </TabsContent>
      </Tabs>
    </div>
  );
}
