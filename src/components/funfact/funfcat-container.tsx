// src/components/funfact/funfact-container.tsx
import { FunFactForm } from "./funfact-form";
import { FunFactPreview } from "./funfact-preview";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { useFunFact } from "@/hooks/use-funfact";
import { useCallback, useRef, useState } from "react";
import { toPng } from "html-to-image";

export function FunFactContainer() {
  const funfactHook = useFunFact();
  const previewRef = useRef<HTMLDivElement>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = useCallback(() => {
    if (previewRef.current === null) {
      return;
    }
    setIsDownloading(true);
    try {
      toPng(previewRef.current, {
        cacheBust: true,
        pixelRatio: 3,
        skipFonts: true, // 🔥 fix error
        backgroundColor: "#ffffff",
      })
        .then((dataUrl) => {
          const link = document.createElement("a");
          link.download = "my-image-name.png";
          link.href = dataUrl;
          link.click();
        })
        .catch((err) => {
          console.log(err);
        });
    } catch (error) {
      console.log(error);
    } finally {
      setIsDownloading(false);
    }
  }, [previewRef]);

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-500 via-orange-300 to-secondary-foreground py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-5xl font-bold text-card-foreground mb-2">
            Fun Fact Generator
          </h1>
          <p className="text-primary">Buat poster fakta menarik dengan mudah</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-10 p-10">
          <div>
            <FunFactForm funfactHook={funfactHook} />
            <div className="mt-6 flex justify-center">
              <Button
                onClick={handleDownload}
                disabled={isDownloading}
                size="lg"
                className="bg-linear-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white px-10"
              >
                <Download className="mr-2 h-5 w-5" />
                {isDownloading ? "Downloading..." : "Download as PNG"}
              </Button>
            </div>
          </div>

          <div className="flex justify-center lg:justify-start">
            <FunFactPreview funfactHook={funfactHook} ref={previewRef} />
          </div>
        </div>
      </div>
    </div>
  );
}
