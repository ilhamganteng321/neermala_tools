// lib/themeStyles.ts
export const themes = {
  elegant: {
    background: "bg-gradient-to-br from-amber-50 to-stone-50",
    textColor: "text-stone-800",
    accentColor: "text-amber-600",
    pattern: {
      backgroundImage: "radial-gradient(circle, #d4a373 1px, transparent 1px)",
      backgroundSize: "20px 20px",
    },
  },
  rustic: {
    background: "bg-gradient-to-br from-emerald-50 to-teal-50",
    textColor: "text-emerald-900",
    accentColor: "text-teal-700",
    pattern: {
      backgroundImage: 'url("data:image/svg+xml,%3Csvg...")', // Leaf pattern
      backgroundSize: "30px 30px",
    },
  },
  modern: {
    background: "bg-gradient-to-br from-slate-50 to-gray-50",
    textColor: "text-slate-800",
    accentColor: "text-rose-500",
    pattern: {
      backgroundImage: "linear-gradient(45deg, #f43f5e 1px, transparent 1px)",
      backgroundSize: "15px 15px",
    },
  },
};

export const getThemeStyles = (theme: string) => {
  return themes[theme as keyof typeof themes] || themes.elegant;
};
