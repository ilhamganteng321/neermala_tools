// src/components/quran.tsx
import { useState, useMemo } from "react";
import {
  Search,
  BookOpen,
  MapPin,
  Hash,
  Bookmark,
  Trash2,
  ChevronRight,
} from "lucide-react";
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
import { useBookmarkStore } from "@/store/quran-bookmark-store";

export default function QuranList() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState<FilterType>("All");

  const { bookmark, clearBookmark } = useBookmarkStore();

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
        {/* Header */}
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

      {/* Bookmark Section — hanya tampil kalau ada bookmark */}
      {bookmark && (
        <section className="mx-auto max-w-6xl px-4 pb-2 pt-6">
          {/* Label */}
          <div className="mb-2 flex items-center gap-2">
            <Bookmark className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
            <span className="text-xs font-semibold uppercase tracking-widest text-amber-600 dark:text-amber-400">
              Terakhir Dibaca
            </span>
          </div>

          {/* Card */}
          <div
            onClick={() => navigate(`/surah/${bookmark.noSurat}`)}
            className="group relative cursor-pointer overflow-hidden rounded-2xl border-2 border-amber-400/40 bg-gradient-to-br from-amber-50 to-orange-50 p-5 transition-all hover:border-amber-400/70 hover:shadow-lg hover:shadow-amber-500/10 dark:from-amber-950/30 dark:to-orange-950/20 dark:border-amber-500/30 dark:hover:border-amber-400/50"
          >
            {/* Decorative background glow */}
            <div className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-amber-400/10 blur-2xl" />

            <div className="relative flex items-start justify-between gap-4">
              {/* Left: info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-3">
                  <span className="rounded-lg bg-amber-500 px-2.5 py-0.5 text-xs font-bold text-white shadow-sm">
                    {bookmark.nmSurat}
                  </span>
                  <span className="rounded-lg bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700 dark:bg-amber-900/50 dark:text-amber-300">
                    Ayat {bookmark.noAyat}
                  </span>
                </div>

                {/* Arabic preview */}
                <p className="text-right font-arabic text-2xl leading-loose text-amber-800 dark:text-amber-200 line-clamp-2 mb-2">
                  {bookmark.arab}
                </p>

                {/* Translation preview */}
                <p
                  className="text-xs leading-relaxed text-amber-700/70 dark:text-amber-300/60 line-clamp-2"
                  dangerouslySetInnerHTML={{
                    __html:
                      bookmark.tafsir.replace(/<[^>]*>/g, "").slice(0, 100) +
                      "…",
                  }}
                />
              </div>
            </div>

            {/* Footer */}
            <div className="mt-4 flex items-center justify-between">
              <span className="text-[10px] text-amber-600/60 dark:text-amber-400/50">
                {formatRelativeTime(new Date(bookmark.savedAt))}
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    clearBookmark();
                  }}
                  className="rounded-lg px-2.5 py-1 text-xs text-amber-600/60 transition-colors hover:bg-amber-200/50 hover:text-red-500 dark:text-amber-400/50 dark:hover:bg-red-900/30"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
                <span className="flex items-center gap-1 rounded-lg bg-amber-500 px-3 py-1.5 text-xs font-semibold text-white shadow-sm transition-all group-hover:bg-amber-600">
                  Lanjut baca
                  <ChevronRight className="h-3 w-3" />
                </span>
              </div>
            </div>
          </div>
        </section>
      )}

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

// Helper: relative time
function formatRelativeTime(date: Date): string {
  const now = Date.now();
  const diff = now - date.getTime();
  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  if (mins < 1) return "Baru saja";
  if (mins < 60) return `${mins} menit lalu`;
  if (hours < 24) return `${hours} jam lalu`;
  return `${days} hari lalu`;
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
