import SignatureCanvas from "react-signature-canvas";
import { useRef, useState, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Eraser, AlertCircle } from "lucide-react";
import { SignatureExport } from "./signature-export";
import { Alert, AlertDescription } from "@/components/ui/alert";

export const DrawCanvas = () => {
  const sigCanvas = useRef<SignatureCanvas>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [penColor, setPenColor] = useState("#000000");
  const [penWidth, setPenWidth] = useState(2);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [hasSignature, setHasSignature] = useState(false);
  const [canvasSize, setCanvasSize] = useState({ width: 800, height: 300 });

  // ✅ Sync canvas size dengan container
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width } = entry.contentRect;
        const newWidth = Math.floor(width);
        const newHeight = Math.floor(width * 0.4); // rasio 5:2
        setCanvasSize({ width: newWidth, height: newHeight });
      }
    });

    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  const clear = () => {
    sigCanvas.current?.clear();
    setHasSignature(false);
    setError(null);
    setSuccess(null);
  };

  const getCanvasForExport = useCallback((): HTMLCanvasElement | null => {
    if (!sigCanvas.current) return null;

    const canvas = sigCanvas.current.getCanvas();
    if (!canvas) return null;

    const context = canvas.getContext("2d");
    if (!context) return null;

    const pixelBuffer = new Uint32Array(
      context.getImageData(0, 0, canvas.width, canvas.height).data.buffer,
    );

    const hasDrawing = pixelBuffer.some((color) => color !== 0xffffffff);
    if (!hasDrawing) return null;

    let minX = canvas.width,
      minY = canvas.height,
      maxX = 0,
      maxY = 0;

    for (let y = 0; y < canvas.height; y++) {
      for (let x = 0; x < canvas.width; x++) {
        const index = y * canvas.width + x;
        if (pixelBuffer[index] !== 0xffffffff) {
          minX = Math.min(minX, x);
          minY = Math.min(minY, y);
          maxX = Math.max(maxX, x);
          maxY = Math.max(maxY, y);
        }
      }
    }

    if (minX > maxX || minY > maxY) return null;

    const padding = 10;
    const cropX = Math.max(0, minX - padding);
    const cropY = Math.max(0, minY - padding);
    const cropWidth = Math.min(canvas.width - cropX, maxX - minX + padding * 2);
    const cropHeight = Math.min(
      canvas.height - cropY,
      maxY - minY + padding * 2,
    );

    const trimmedCanvas = document.createElement("canvas");
    trimmedCanvas.width = cropWidth;
    trimmedCanvas.height = cropHeight;
    const trimmedCtx = trimmedCanvas.getContext("2d");

    if (trimmedCtx) {
      trimmedCtx.fillStyle = "#ffffff";
      trimmedCtx.fillRect(0, 0, cropWidth, cropHeight);
      trimmedCtx.drawImage(
        canvas,
        cropX,
        cropY,
        cropWidth,
        cropHeight,
        0,
        0,
        cropWidth,
        cropHeight,
      );
    }

    return trimmedCanvas;
  }, []);

  const handleExportSuccess = (format: string) => {
    setSuccess(`Berhasil menyimpan sebagai ${format}`);
    setError(null);
    setTimeout(() => setSuccess(null), 3000);
  };

  const handleExportError = (error: Error) => {
    setError(error.message);
    setSuccess(null);
    setTimeout(() => setError(null), 3000);
  };

  const colors = [
    { name: "Hitam", value: "#000000" },
    { name: "Biru", value: "#1d4ed8" },
    { name: "Merah", value: "#b91c1c" },
    { name: "Hijau", value: "#15803d" },
    { name: "Ungu", value: "#6b21a5" },
    { name: "Oranye", value: "#ea580c" },
  ];

  return (
    <div className="flex flex-col gap-6">
      {success && (
        <Alert className="bg-green-50 border-green-200 text-green-800">
          <AlertCircle className="h-4 w-4 text-green-600" />
          <AlertDescription>{success}</AlertDescription>
        </Alert>
      )}

      {error && (
        <Alert className="bg-red-50 border-red-200 text-red-800">
          <AlertCircle className="h-4 w-4 text-red-600" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* ✅ Tambah ref ke container */}
      <div
        ref={containerRef}
        className="relative border-2 border-dashed rounded-xl bg-white overflow-hidden group shadow-sm"
      >
        <SignatureCanvas
          ref={sigCanvas}
          penColor={penColor}
          canvasProps={{
            // ✅ width & height sekarang dinamis dari state
            width: canvasSize.width,
            height: canvasSize.height,
            style: { width: "100%", height: "100%", cursor: "crosshair" },
          }}
          minWidth={penWidth}
          maxWidth={penWidth + 1.5}
          onEnd={() => {
            setHasSignature(true);
            setError(null);
          }}
        />
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <p className="text-[10px] bg-secondary px-2 py-1 rounded shadow-sm">
            Area Tanda Tangan
          </p>
        </div>
      </div>

      {/* ... sisa kode sama persis ... */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-3">
          <div className="flex justify-between">
            <label className="text-sm font-medium">Ketebalan Pena</label>
            <span className="text-xs text-muted-foreground">{penWidth}px</span>
          </div>
          <Slider
            value={[penWidth]}
            onValueChange={(value) => setPenWidth(value[0])}
            min={1}
            max={10}
            step={1}
          />
          <div className="flex items-center gap-2 mt-2">
            <div className="text-xs text-muted-foreground">Preview:</div>
            <div
              className="rounded-full bg-current"
              style={{
                width: `${penWidth * 2}px`,
                height: `${penWidth * 2}px`,
                color: penColor,
              }}
            />
          </div>
        </div>

        <div className="space-y-3">
          <label className="text-sm font-medium">Pilih Warna</label>
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex gap-2 flex-wrap">
              {colors.map((c) => (
                <button
                  key={c.value}
                  onClick={() => setPenColor(c.value)}
                  className={`w-8 h-8 rounded-full border-2 transition-transform active:scale-90 ${
                    penColor === c.value
                      ? "border-primary scale-110 shadow-md ring-2 ring-primary/20"
                      : "border-transparent hover:scale-105"
                  }`}
                  style={{ backgroundColor: c.value }}
                  title={c.name}
                />
              ))}
            </div>
            <div className="h-8 w-[1px] bg-border mx-1" />
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={penColor}
                onChange={(e) => setPenColor(e.target.value)}
                className="w-8 h-8 cursor-pointer bg-transparent rounded border"
              />
              <span className="text-xs text-muted-foreground">Custom</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-muted/30 rounded-lg p-3 text-xs text-muted-foreground">
        <div className="flex justify-between items-center">
          {/* ✅ Tampilkan ukuran aktual */}
          <span>
            Ukuran Canvas: {canvasSize.width} x {canvasSize.height} px
          </span>
          <span>Background: Transparan</span>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 pt-2">
        <Button
          variant="outline"
          onClick={clear}
          className="flex-1 gap-2 border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 transition-all"
        >
          <Eraser className="w-4 h-4" />
          Bersihkan Canvas
        </Button>
        <div className="flex-1">
          <SignatureExport
            getCanvas={getCanvasForExport}
            fileName={`tanda-tangan-${new Date().toISOString().split("T")[0]}`}
            disabled={!hasSignature}
            onSuccess={handleExportSuccess}
            onError={handleExportError}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-[10px] text-center text-muted-foreground border-t pt-4 mt-2">
        <div className="flex flex-col items-center gap-1">
          <span className="font-semibold">PNG</span>
          <span>Transparan, kualitas terbaik</span>
        </div>
        <div className="flex flex-col items-center gap-1">
          <span className="font-semibold">JPEG</span>
          <span>Kompresi, ukuran kecil</span>
        </div>
        <div className="flex flex-col items-center gap-1">
          <span className="font-semibold">PDF</span>
          <span>Format A4, siap cetak</span>
        </div>
        <div className="flex flex-col items-center gap-1">
          <span className="font-semibold">SVG</span>
          <span>Vector, scalable</span>
        </div>
      </div>
    </div>
  );
};
