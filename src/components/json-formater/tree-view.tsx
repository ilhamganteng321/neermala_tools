// src/components/JsonTreeView.tsx
import { useState } from "react";
import { ChevronRight, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface JsonTreeViewProps {
  data: any;
  level?: number;
  path?: string;
}

export default function JsonTreeView({
  data,
  level = 0,
  path = "",
}: JsonTreeViewProps) {
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});

  const toggleCollapse = (key: string) => {
    setCollapsed((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const getType = (value: any): string => {
    if (value === null) return "null";
    if (Array.isArray(value)) return "array";
    return typeof value;
  };

  const getTypeColor = (type: string): string => {
    switch (type) {
      case "string":
        return "text-emerald-600 dark:text-emerald-400";
      case "number":
        return "text-blue-600 dark:text-blue-400";
      case "boolean":
        return "text-purple-600 dark:text-purple-400";
      case "null":
        return "text-gray-500";
      case "array":
        return "text-orange-600 dark:text-orange-400";
      default:
        return "text-foreground";
    }
  };

  const renderValue = (value: any, key: string | number) => {
    const type = getType(value);
    const isCollapsed = collapsed[`${path}${key}`];
    const hasChildren = typeof value === "object" && value !== null;

    if (!hasChildren) {
      return (
        <div className="ml-4 inline">
          <span className={cn("text-sm", getTypeColor(type))}>
            {type === "string" ? `"${value}"` : String(value)}
          </span>
        </div>
      );
    }

    const isArray = Array.isArray(value);
    const length = isArray ? value.length : Object.keys(value).length;
    const preview = isArray
      ? `Array(${length})`
      : `{${Object.keys(value).join(", ")}}`;

    return (
      <div className="ml-4">
        <button
          onClick={() => toggleCollapse(`${path}${key}`)}
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          {isCollapsed ? (
            <ChevronRight className="h-3 w-3" />
          ) : (
            <ChevronDown className="h-3 w-3" />
          )}
          <span className={cn("text-xs", getTypeColor(type))}>
            {isCollapsed && preview}
          </span>
        </button>
        {!isCollapsed && (
          <div className="ml-4 border-l-2 border-border pl-2">
            {Object.entries(value).map(([k, v]) => (
              <div key={k} className="my-1">
                <span className="text-sm font-medium text-foreground">
                  {isArray ? `[${k}]` : k}:
                </span>
                {renderValue(v, k)}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="font-mono text-sm" style={{ paddingLeft: level * 16 }}>
      {renderValue(data, "root")}
    </div>
  );
}
