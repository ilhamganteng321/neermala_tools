// src/store/useReaderStore.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";

export const ARABIC_COLORS = [
  {
    label: "Hijau (Default)",
    value: "text-emerald-600 dark:text-emerald-400",
    hex: "#059669",
  },
  {
    label: "Emas",
    value: "text-amber-500 dark:text-amber-400",
    hex: "#f59e0b",
  },
  { label: "Biru", value: "text-blue-600 dark:text-blue-400", hex: "#2563eb" },
  {
    label: "Ungu",
    value: "text-violet-600 dark:text-violet-400",
    hex: "#7c3aed",
  },
  {
    label: "Merah Mawar",
    value: "text-rose-600 dark:text-rose-400",
    hex: "#e11d48",
  },
  {
    label: "Putih/Hitam",
    value: "text-gray-900 dark:text-gray-100",
    hex: "#111827",
  },
];

interface ReaderState {
  showTranslation: boolean;
  arabicColorIndex: number;
  toggleTranslation: () => void;
  setArabicColorIndex: (index: number) => void;
}

export const useReaderStore = create<ReaderState>()(
  persist(
    (set) => ({
      showTranslation: true,
      arabicColorIndex: 0,
      toggleTranslation: () =>
        set((state) => ({ showTranslation: !state.showTranslation })),
      setArabicColorIndex: (index: number) => set({ arabicColorIndex: index }),
    }),
    {
      name: "quran-reader-settings", // key di localStorage
    },
  ),
);
