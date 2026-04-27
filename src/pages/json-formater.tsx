// src/components/JsonFormatter.tsx
import { useState, useCallback } from "react";
import {
  Copy,
  Check,
  Minimize2,
  Maximize2,
  Download,
  Upload,
  Trash2,
  Code,
  Settings,
  AlertCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Alert, AlertDescription } from "@/components/ui/alert";
import JsonTreeView from "@/components/json-formater/tree-view";
import JsonEditor from "@/components/json-formater/json-editor";

export interface JsonFormatterProps {
  initialValue?: string;
  onSave?: (value: string) => void;
}

export default function JsonFormatter({
  initialValue = "",
}: JsonFormatterProps) {
  const [input, setInput] = useState(initialValue);
  const [output, setOutput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [viewMode, setViewMode] = useState<"formatted" | "tree" | "editor">(
    "formatted",
  );
  const [settings, setSettings] = useState({
    indentSize: 2,
    sortKeys: false,
    showLineNumbers: true,
    autoFormat: true,
    minifyOnCopy: false,
  });

  // Format JSON
  const formatJSON = useCallback(
    (jsonString: string, minify = false) => {
      try {
        if (!jsonString.trim()) {
          setOutput("");
          setError(null);
          return;
        }

        const parsed = JSON.parse(jsonString);
        const spaces = minify ? 0 : settings.indentSize;
        const formatted = JSON.stringify(parsed, null, spaces);

        if (settings.sortKeys) {
          const sorted = sortObjectKeys(parsed);
          setOutput(JSON.stringify(sorted, null, spaces));
        } else {
          setOutput(formatted);
        }

        setError(null);
        return parsed;
      } catch (err) {
        setError((err as Error).message);
        setOutput("");
        return null;
      }
    },
    [settings.indentSize, settings.sortKeys],
  );

  // Sort object keys
  const sortObjectKeys = (obj: any): any => {
    if (obj === null || typeof obj !== "object") return obj;
    if (Array.isArray(obj)) return obj.map(sortObjectKeys);

    const sorted: any = {};
    Object.keys(obj)
      .sort()
      .forEach((key) => {
        sorted[key] = sortObjectKeys(obj[key]);
      });
    return sorted;
  };

  // Handle input change
  const handleInputChange = (value: string) => {
    setInput(value);
    if (settings.autoFormat) {
      formatJSON(value);
    } else {
      setError(null);
    }
  };

  // Handle format button click
  const handleFormat = () => {
    formatJSON(input);
  };

  // Handle minify button click
  const handleMinify = () => {
    try {
      const parsed = JSON.parse(input);
      const minified = JSON.stringify(parsed);
      setOutput(minified);
      setError(null);
    } catch (err) {
      setError((err as Error).message);
    }
  };

  // Handle copy output
  const handleCopy = async () => {
    const textToCopy = settings.minifyOnCopy
      ? JSON.stringify(JSON.parse(output))
      : output;

    await navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Handle download
  const handleDownload = () => {
    const blob = new Blob([output], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "formatted.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  // Handle upload
  const handleUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      setInput(content);
      if (settings.autoFormat) {
        formatJSON(content);
      }
    };
    reader.readAsText(file);
  };

  // Handle clear
  const handleClear = () => {
    setInput("");
    setOutput("");
    setError(null);
  };

  // Validate JSON
  const isValidJSON = () => {
    try {
      JSON.parse(input);
      return true;
    } catch {
      return false;
    }
  };

  // Get JSON info
  const getJsonInfo = () => {
    try {
      const parsed = JSON.parse(input);
      const size = new Blob([input]).size;
      const lines = output.split("\n").length;
      const type = Array.isArray(parsed) ? "Array" : "Object";
      const keys = Object.keys(parsed).length;

      return {
        size: formatBytes(size),
        lines,
        type,
        keys,
        valid: true,
      };
    } catch {
      return {
        size: "0 B",
        lines: 0,
        type: "Invalid",
        keys: 0,
        valid: false,
      };
    }
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const jsonInfo = getJsonInfo();

  return (
    <div
      className={cn(
        "min-h-screen bg-linear-to-br from-slate-50 mt-5 to-slate-100 dark:from-slate-950 dark:to-slate-900",
        isFullscreen && "fixed inset-0 z-50 overflow-auto",
      )}
    >
      <div className="container mx-auto p-4">
        {/* Header */}
        <header className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-600 shadow-md">
              <Code className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">
                JSON Formatter
              </h1>
              <p className="text-sm text-muted-foreground">
                Format, validasi, dan beautify JSON dengan mudah
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setIsFullscreen(!isFullscreen)}
            >
              {isFullscreen ? (
                <Minimize2 className="h-4 w-4" />
              ) : (
                <Maximize2 className="h-4 w-4" />
              )}
            </Button>
          </div>
        </header>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Input Section */}
          <Card className="shadow-lg">
            <CardContent className="p-6">
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">Input</Badge>
                  {!isValidJSON() && input && (
                    <Badge variant="destructive" className="gap-1">
                      <AlertCircle className="h-3 w-3" />
                      Invalid
                    </Badge>
                  )}
                  {isValidJSON() && input && (
                    <Badge variant="default" className="bg-emerald-600 gap-1">
                      <Check className="h-3 w-3" />
                      Valid
                    </Badge>
                  )}
                </div>
                <div className="flex gap-2">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            document.getElementById("file-upload")?.click()
                          }
                        >
                          <Upload className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Upload file</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="ghost" size="sm" onClick={handleClear}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Clear</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <input
                  id="file-upload"
                  type="file"
                  accept=".json"
                  className="hidden"
                  onChange={handleUpload}
                />
              </div>
              <Textarea
                placeholder='Masukkan JSON disini... Contoh: {"name": "John", "age": 30}'
                value={input}
                onChange={(e) => handleInputChange(e.target.value)}
                className={cn(
                  "min-h-75 font-mono text-sm",
                  error && "border-red-500 focus-visible:ring-red-500",
                )}
              />
              {error && (
                <Alert variant="destructive" className="mt-3">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription className="font-mono text-xs">
                    {error}
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>

          {/* Output Section */}
          <Card className="shadow-lg">
            <CardContent className="p-6">
              <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">Output</Badge>
                  {output && (
                    <Badge variant="outline" className="gap-1">
                      {jsonInfo.lines} lines
                    </Badge>
                  )}
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button size="sm" onClick={handleFormat}>
                    Format
                  </Button>
                  <Button size="sm" variant="outline" onClick={handleMinify}>
                    Minify
                  </Button>
                  <Button size="sm" variant="outline" onClick={handleCopy}>
                    {copied ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                  <Button size="sm" variant="outline" onClick={handleDownload}>
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <Tabs
                value={viewMode}
                onValueChange={(v) => setViewMode(v as any)}
                className="w-full"
              >
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="formatted">Formatted</TabsTrigger>
                  <TabsTrigger value="tree">Tree View</TabsTrigger>
                  <TabsTrigger value="editor">Editor</TabsTrigger>
                </TabsList>

                <TabsContent value="formatted" className="mt-4">
                  <ScrollArea className="h-75 rounded-md border bg-muted/30 p-4">
                    <pre className="font-mono text-sm">
                      <code>
                        {output ||
                          "// JSON yang sudah diformat akan muncul disini"}
                      </code>
                    </pre>
                  </ScrollArea>
                </TabsContent>

                <TabsContent value="tree" className="mt-4">
                  <ScrollArea className="h-75 rounded-md border bg-muted/30 p-4">
                    {output ? (
                      <JsonTreeView data={JSON.parse(output)} />
                    ) : (
                      <p className="text-center text-muted-foreground">
                        Format JSON terlebih dahulu untuk melihat tree view
                      </p>
                    )}
                  </ScrollArea>
                </TabsContent>

                <TabsContent value="editor" className="mt-4">
                  <JsonEditor
                    value={output}
                    onChange={(value) => {
                      setOutput(value);
                      setInput(value);
                    }}
                  />
                </TabsContent>
              </Tabs>

              {/* JSON Info */}
              {output && (
                <div className="mt-4 flex flex-wrap gap-3 text-xs text-muted-foreground">
                  <span>Size: {jsonInfo.size}</span>
                  <span>Type: {jsonInfo.type}</span>
                  {jsonInfo.type === "Object" && (
                    <span>Keys: {jsonInfo.keys}</span>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Settings Panel */}
        <Card className="mt-6 shadow-lg">
          <CardContent className="p-6">
            <div className="mb-4 flex items-center gap-2">
              <Settings className="h-4 w-4" />
              <h3 className="font-semibold">Settings</h3>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="indent-size">Indent Size</Label>
                <select
                  id="indent-size"
                  value={settings.indentSize}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      indentSize: Number(e.target.value),
                    })
                  }
                  className="rounded-md border bg-background px-2 py-1 text-sm"
                >
                  <option value={2}>2 spaces</option>
                  <option value={4}>4 spaces</option>
                  <option value={6}>6 spaces</option>
                  <option value={8}>8 spaces</option>
                </select>
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="sort-keys">Sort Keys</Label>
                <Switch
                  id="sort-keys"
                  checked={settings.sortKeys}
                  onCheckedChange={(checked) =>
                    setSettings({ ...settings, sortKeys: checked })
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="auto-format">Auto Format</Label>
                <Switch
                  id="auto-format"
                  checked={settings.autoFormat}
                  onCheckedChange={(checked) =>
                    setSettings({ ...settings, autoFormat: checked })
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="minify-copy">Minify on Copy</Label>
                <Switch
                  id="minify-copy"
                  checked={settings.minifyOnCopy}
                  onCheckedChange={(checked) =>
                    setSettings({ ...settings, minifyOnCopy: checked })
                  }
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
