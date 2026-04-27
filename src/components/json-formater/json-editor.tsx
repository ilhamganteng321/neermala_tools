// src/components/JsonEditor.tsx
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { AlertCircle, CheckCircle } from "lucide-react";

interface JsonEditorProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export default function JsonEditor({
  value,
  onChange,
  className,
}: JsonEditorProps) {
  const [localValue, setLocalValue] = useState(value);
  const [error, setError] = useState<string | null>(null);
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  const handleChange = (newValue: string) => {
    setLocalValue(newValue);
    try {
      if (newValue.trim()) {
        JSON.parse(newValue);
        setError(null);
        setIsValid(true);
        onChange(newValue);
      } else {
        setError(null);
        setIsValid(false);
      }
    } catch (err) {
      setError((err as Error).message);
      setIsValid(false);
    }
  };

  return (
    <div className={cn("relative", className)}>
      <div className="relative">
        <textarea
          value={localValue}
          onChange={(e) => handleChange(e.target.value)}
          className={cn(
            "min-h-62.5 w-full rounded-md border bg-muted/30 p-3 font-mono text-sm outline-none focus:ring-2",
            error
              ? "border-red-500 focus:ring-red-500"
              : isValid && localValue
                ? "border-emerald-500 focus:ring-emerald-500"
                : "border-border focus:ring-emerald-500",
          )}
          placeholder="Edit JSON disini..."
        />
        <div className="absolute right-2 top-2">
          {isValid && localValue && (
            <CheckCircle className="h-4 w-4 text-emerald-500" />
          )}
          {error && <AlertCircle className="h-4 w-4 text-red-500" />}
        </div>
      </div>
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
}
