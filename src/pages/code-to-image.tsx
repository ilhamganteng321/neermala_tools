import { useState, useRef, useCallback } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { domToPng, domToJpeg, domToBlob } from "modern-screenshot";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Download, Copy, Check } from "lucide-react";
import {
  DEFAULT_CODE,
  GRADIENTS,
  LANGUAGES,
  THEMES,
  type Language,
  type ThemeName,
} from "@/data/const";

const WindowDots = () => (
  <div style={{ display: "flex", gap: "6px", marginBottom: "12px" }}>
    {["#ff5f57", "#febc2e", "#28c840"].map((color, i) => (
      <div
        key={i}
        style={{
          width: 12,
          height: 12,
          borderRadius: "50%",
          backgroundColor: color,
        }}
      />
    ))}
  </div>
);

export const CodeToImage = () => {
  const [code, setCode] = useState(DEFAULT_CODE);
  const [language, setLanguage] = useState<Language>("typescript");
  const [theme, setTheme] = useState<ThemeName>("oneDark");
  const [gradient, setGradient] = useState(GRADIENTS[0].value);
  const [padding, setPadding] = useState(40);
  const [fontSize, setFontSize] = useState(14);
  const [showWindowBar, setShowWindowBar] = useState(true);
  const [showLineNumbers, setShowLineNumbers] = useState(true);
  const [fileName, setFileName] = useState("snippet.ts");
  const [shadow, setShadow] = useState(true);
  const [copied, setCopied] = useState(false);
  const [exporting, setExporting] = useState(false);

  const previewRef = useRef<HTMLDivElement>(null);

  const currentTheme = THEMES[theme];

  // ── Export ──────────────────────────────────────────────────────────────────

  const handleExport = useCallback(
    async (format: "png" | "jpg") => {
      if (!previewRef.current) return;
      setExporting(true);
      try {
        await document.fonts.ready;

        const dataUrl =
          format === "png"
            ? await domToPng(previewRef.current, { scale: 3 })
            : await domToJpeg(previewRef.current, { scale: 3, quality: 0.95 });

        const link = document.createElement("a");
        const baseFileName =
          fileName.replace(/\.[^/.]+$/, "") || "code-snippet";
        link.download = `${baseFileName}.${format}`;
        link.href = dataUrl;
        link.click();
      } catch (err) {
        console.error("Export failed:", err);
        alert(
          `Gagal export: ${err instanceof Error ? err.message : "Unknown error"}`,
        );
      } finally {
        setExporting(false);
      }
    },
    [fileName],
  );

  const handleCopyImage = useCallback(async () => {
    if (!previewRef.current) return;
    try {
      await document.fonts.ready;

      const blob = await domToBlob(previewRef.current, { scale: 2 });
      if (!blob) throw new Error("Blob kosong");

      await navigator.clipboard.write([
        new ClipboardItem({ "image/png": blob }),
      ]);

      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Copy failed:", err);
    }
  }, []);

  // ── Render ──────────────────────────────────────────────────────────────────

  return (
    <div className="flex flex-col gap-6 min-h-screen bg-background p-4 md:p-6">
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-6 items-start">
        {/* ── Preview ── */}
        <div className="flex flex-col gap-3 mt-5">
          <Label className="text-xs font-medium text-muted-foreground uppercase tracking-widest">
            Preview
          </Label>

          {/* Gradient canvas */}
          <div
            ref={previewRef}
            style={{
              background: gradient,
              padding: `${padding}px`,
              borderRadius: "16px",
            }}
          >
            {/* Code window */}
            <div
              style={{
                borderRadius: "10px",
                overflow: "hidden",
                background: currentTheme.bg,
                boxShadow: shadow
                  ? "0 25px 60px rgba(0,0,0,0.5), 0 8px 24px rgba(0,0,0,0.35)"
                  : "none",
              }}
            >
              {/* Window bar */}
              {showWindowBar && (
                <div
                  style={{
                    background: `${currentTheme.bg}dd`,
                    borderBottom: "1px solid rgba(255,255,255,0.06)",
                    padding: "12px 16px 8px",
                  }}
                >
                  <WindowDots />
                  {fileName && (
                    <p
                      style={{
                        fontSize: 12,
                        color: "rgba(255,255,255,0.35)",
                        margin: 0,
                        fontFamily: "monospace",
                        textAlign: "center",
                        marginTop: -4,
                      }}
                    >
                      {fileName}
                    </p>
                  )}
                </div>
              )}

              {/* Syntax highlighter */}
              <SyntaxHighlighter
                language={language}
                style={currentTheme.style as any}
                showLineNumbers={showLineNumbers}
                customStyle={{
                  margin: 0,
                  padding: "20px",
                  fontSize: `${fontSize}px`,
                  background: "transparent",
                  lineHeight: 1.6,
                }}
                lineNumberStyle={{
                  color: "rgba(255,255,255,0.2)",
                  minWidth: "2.5em",
                  paddingRight: "1em",
                  userSelect: "none",
                }}
              >
                {code}
              </SyntaxHighlighter>
            </div>
          </div>

          {/* Export buttons */}
          <div className="flex gap-2 justify-end flex-wrap">
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopyImage}
              className="gap-2"
            >
              {copied ? (
                <Check className="w-4 h-4 text-green-500" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
              {copied ? "Tersalin!" : "Copy Image"}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleExport("png")}
              disabled={exporting}
              className="gap-2"
            >
              <Download className="w-4 h-4" />
              Unduh PNG
            </Button>
            <Button
              size="sm"
              onClick={() => handleExport("jpg")}
              disabled={exporting}
              className="gap-2"
            >
              <Download className="w-4 h-4" />
              Unduh JPG
            </Button>
          </div>
        </div>

        {/* ── Controls ── */}
        <div className="flex flex-col gap-5 bg-card border rounded-xl p-4">
          <Label className="text-xs font-medium text-muted-foreground uppercase tracking-widest">
            Pengaturan
          </Label>

          {/* Code input */}
          <div className="space-y-1.5">
            <Label className="text-sm">Kode</Label>
            <Textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="font-mono text-xs resize-none h-36"
              placeholder="Paste kode di sini..."
              spellCheck={false}
            />
          </div>

          {/* File name */}
          <div className="space-y-1.5">
            <Label className="text-sm">Nama File</Label>
            <input
              type="text"
              value={fileName}
              onChange={(e) => setFileName(e.target.value)}
              className="w-full h-9 rounded-md border border-input bg-background px-3 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder="snippet.ts"
            />
          </div>

          {/* Language + Theme */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-sm">Bahasa</Label>
              <Select
                value={language}
                onValueChange={(v) => setLanguage(v as Language)}
              >
                <SelectTrigger className="h-9 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {LANGUAGES.map((l) => (
                    <SelectItem
                      key={l.value}
                      value={l.value}
                      className="text-xs"
                    >
                      {l.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label className="text-sm">Tema</Label>
              <Select
                value={theme}
                onValueChange={(v) => setTheme(v as ThemeName)}
              >
                <SelectTrigger className="h-9 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {(Object.keys(THEMES) as ThemeName[]).map((key) => (
                    <SelectItem key={key} value={key} className="text-xs">
                      {THEMES[key].label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Gradient picker */}
          <div className="space-y-2">
            <Label className="text-sm">Background Gradient</Label>
            <div className="grid grid-cols-4 gap-2">
              {GRADIENTS.map((g) => (
                <button
                  key={g.value}
                  title={g.label}
                  onClick={() => setGradient(g.value)}
                  className={`h-8 rounded-md border-2 transition-transform active:scale-95 ${
                    gradient === g.value
                      ? "border-primary scale-105"
                      : "border-transparent hover:scale-105"
                  }`}
                  style={{ background: g.value }}
                />
              ))}
            </div>
          </div>

          {/* Padding */}
          <div className="space-y-2">
            <div className="flex justify-between">
              <Label className="text-sm">Padding</Label>
              <span className="text-xs text-muted-foreground">{padding}px</span>
            </div>
            <Slider
              value={[padding]}
              onValueChange={(v) => setPadding(v[0])}
              min={16}
              max={96}
              step={8}
            />
          </div>

          {/* Font size */}
          <div className="space-y-2">
            <div className="flex justify-between">
              <Label className="text-sm">Ukuran Font</Label>
              <span className="text-xs text-muted-foreground">
                {fontSize}px
              </span>
            </div>
            <Slider
              value={[fontSize]}
              onValueChange={(v) => setFontSize(v[0])}
              min={11}
              max={20}
              step={1}
            />
          </div>

          {/* Toggles */}
          <div className="space-y-3 pt-1 border-t">
            {[
              {
                id: "window-bar",
                label: "Window Bar",
                checked: showWindowBar,
                onChange: setShowWindowBar,
              },
              {
                id: "line-numbers",
                label: "Nomor Baris",
                checked: showLineNumbers,
                onChange: setShowLineNumbers,
              },
              {
                id: "shadow",
                label: "Drop Shadow",
                checked: shadow,
                onChange: setShadow,
              },
            ].map((toggle) => (
              <div
                key={toggle.id}
                className="flex items-center justify-between"
              >
                <Label htmlFor={toggle.id} className="text-sm cursor-pointer">
                  {toggle.label}
                </Label>
                <Switch
                  id={toggle.id}
                  checked={toggle.checked}
                  onCheckedChange={toggle.onChange}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CodeToImage;
