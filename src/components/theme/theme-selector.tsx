// components/theme/ThemeSelector.tsx

import type { ThemeType } from "@/data/types/invitations";
import { Button } from "@/components/ui/button";

interface ThemeSelectorProps {
  currentTheme: ThemeType;
  onThemeChange: (theme: ThemeType) => void;
}

const themes = [
  { id: "elegant" as const, name: "Elegant", color: "bg-amber-500" },
  { id: "rustic" as const, name: "Rustic", color: "bg-emerald-500" },
  { id: "modern" as const, name: "Modern", color: "bg-rose-500" },
];

export function ThemeSelector({
  currentTheme,
  onThemeChange,
}: ThemeSelectorProps) {
  return (
    <div className="flex gap-3 bg-white/80 backdrop-blur-sm rounded-full p-2 shadow-md">
      {themes.map((theme) => (
        <Button
          key={theme.id}
          onClick={() => onThemeChange(theme.id)}
          className={`
            px-6 py-2 rounded-full transition-all duration-300
            ${
              currentTheme === theme.id
                ? `${theme.color} text-white shadow-lg scale-105`
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }
          `}
        >
          {theme.name}
        </Button>
      ))}
    </div>
  );
}
