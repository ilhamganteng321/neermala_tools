// src/components/quran.tsx
import { useState, useMemo } from "react";
import { Search, BookOpen, MapPin, Hash } from "lucide-react";
import { useNavigate } from "react-router-dom";
import quranData from "@/data/m_quran_t.json";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  ARABIC_NAMES,
  FILTER_OPTIONS,
  type FilterType,
  type Surah,
} from "@/data/const";

export default function QuranList() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState<FilterType>("All");

  const surahs = quranData as Surah[];

  const filtered = useMemo(() => {
    return surahs.filter((s) => {
      const q = searchTerm.toLowerCase();
      const matchSearch =
        !q ||
        s.nm_surat.toLowerCase().includes(q) ||
        s.arti_surat.toLowerCase().includes(q) ||
        String(s.no_surat).includes(q);
      const matchType = selectedType === "All" || s.tmp_turun === selectedType;
      return matchSearch && matchType;
    });
  }, [searchTerm, selectedType, surahs]);

  const handleSurahClick = (noSurat: number) => {
    navigate(`/surah/${noSurat}`);
  };

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      <div className="mx-auto max-w-6xl px-4 py-4">
        {/* Header with search and mode toggle */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center justify-between mt-8">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-600 shadow-md">
                <BookOpen className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold leading-none tracking-tight text-foreground">
                  Al-Qur'an
                </h1>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {filtered.length} dari {surahs.length} surah
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="mt-4 flex gap-1.5 border-t border-border pt-3">
          {FILTER_OPTIONS.map(({ label, value }) => (
            <button
              key={value}
              onClick={() => setSelectedType(value)}
              className={cn(
                "rounded-full px-4 py-1.5 text-xs font-medium transition-all",
                selectedType === value
                  ? "bg-emerald-600 text-white shadow-sm"
                  : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground",
              )}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <main className="mx-auto max-w-6xl px-4 py-6">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
              <Search className="h-7 w-7 text-muted-foreground" />
            </div>
            <p className="mt-4 text-base font-medium text-foreground">
              Tidak ditemukan
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              Coba kata kunci lain
            </p>
            <Button
              variant="outline"
              size="sm"
              className="mt-4"
              onClick={() => {
                setSearchTerm("");
                setSelectedType("All");
              }}
            >
              Reset pencarian
            </Button>
          </div>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filtered.map((surah) => (
              <SurahCard
                key={surah.no_surat}
                surah={surah}
                onClick={() => handleSurahClick(surah.no_surat)}
              />
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-8 text-center text-xs text-muted-foreground">
        Al-Qur'an Digital · {new Date().getFullYear()}
      </footer>
    </div>
  );
}

// Surah Card Component
function SurahCard({ surah, onClick }: { surah: Surah; onClick: () => void }) {
  const isMakki = surah.tmp_turun === "Makkiyyah";

  return (
    <div
      onClick={onClick}
      className={cn(
        "group relative flex cursor-pointer flex-col gap-0 overflow-hidden rounded-xl border border-border bg-card",
        "transition-all duration-200 hover:-translate-y-0.5 hover:border-emerald-500/50 hover:shadow-lg hover:shadow-emerald-500/5",
      )}
    >
      {/* Top stripe accent */}
      <div
        className={cn(
          "h-0.5 w-full",
          isMakki ? "bg-emerald-500" : "bg-blue-500",
        )}
      />

      <div className="flex flex-col gap-3 p-4">
        {/* Row 1: Number + Arabic name */}
        <div className="flex items-start justify-between">
          <div
            className={cn(
              "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-sm font-bold",
              isMakki
                ? "bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400"
                : "bg-blue-500/10 text-blue-600 dark:bg-blue-500/15 dark:text-blue-400",
            )}
          >
            {surah.no_surat}
          </div>

          <span
            className={cn(
              "font-arabic text-2xl leading-relaxed",
              isMakki
                ? "text-emerald-600 dark:text-emerald-400"
                : "text-blue-600 dark:text-blue-400",
            )}
          >
            {ARABIC_NAMES[surah.no_surat]}
          </span>
        </div>

        {/* Row 2: Latin name + meaning */}
        <div>
          <p className="text-base font-semibold leading-tight text-card-foreground">
            {surah.nm_surat}
          </p>
          <p className="mt-0.5 text-sm text-muted-foreground">
            {surah.arti_surat}
          </p>
        </div>

        {/* Row 3: Meta */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Hash className="h-3 w-3" />
              {surah.jml_ayat} ayat
            </span>
            <span className="flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              {surah.tmp_turun === "Makkiyyah" ? "Mekah" : "Madinah"}
            </span>
          </div>

          <Badge
            className={cn(
              "border-0 text-[10px] font-medium",
              isMakki
                ? "bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400"
                : "bg-blue-500/10 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400",
            )}
          >
            {isMakki ? "Makkiyyah" : "Madaniyyah"}
          </Badge>
        </div>
      </div>
    </div>
  );
}
