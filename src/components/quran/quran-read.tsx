// src/components/SurahReader.tsx
import { useState, useEffect, useCallback, useRef, forwardRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight, Loader2, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/mode-toggle";
import type { Ayat, Surah } from "@/data/const";
import surahList from "@/data/m_quran_t.json";
import ayatData from "@/data/m_surat_t.json"; // Your ayat JSON file

const AYAT_PER_PAGE = 10;

export default function SurahReader() {
  const { noSurat } = useParams<{ noSurat: string }>();
  const navigate = useNavigate();
  const [surah, setSurah] = useState<Surah | null>(null);
  const [allAyat, setAllAyat] = useState<Ayat[]>([]);
  const [displayedAyat, setDisplayedAyat] = useState<Ayat[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const lastAyatRef = useRef<HTMLDivElement | null>(null);
  // Load surah info
  useEffect(() => {
    const surahInfo = (surahList as Surah[]).find(
      (s) => s.no_surat === Number(noSurat),
    );
    setSurah(surahInfo || null);
  }, [noSurat]);

  // Load all ayat for this surah
  useEffect(() => {
    if (!noSurat) return;

    setLoading(true);
    // Simulate loading - replace with actual data fetching
    const ayatForSurah = (ayatData as Ayat[]).filter(
      (ayat) => ayat.no_surat === Number(noSurat),
    );
    setAllAyat(ayatForSurah);
    setCurrentPage(1);
    setLoading(false);
  }, [noSurat]);

  // Update displayed ayat when page changes
  useEffect(() => {
    const start = 0;
    const end = currentPage * AYAT_PER_PAGE;
    setDisplayedAyat(allAyat.slice(start, end));
  }, [currentPage, allAyat]);

  // Setup infinite scroll
  const loadMore = useCallback(() => {
    if (displayedAyat.length < allAyat.length && !loadingMore) {
      setLoadingMore(true);
      setTimeout(() => {
        setCurrentPage((prev) => prev + 1);
        setLoadingMore(false);
      }, 500); // Small delay for better UX
    }
  }, [displayedAyat.length, allAyat.length, loadingMore]);

  useEffect(() => {
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (
          entries[0].isIntersecting &&
          displayedAyat.length < allAyat.length
        ) {
          loadMore();
        }
      },
      { threshold: 0.1 },
    );

    if (lastAyatRef.current) {
      observerRef.current.observe(lastAyatRef.current);
    }

    return () => observerRef.current?.disconnect();
  }, [displayedAyat.length, allAyat.length, loadMore]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center">
          <Loader2 className="mx-auto h-8 w-8 animate-spin text-emerald-600" />
          <p className="mt-4 text-muted-foreground">Memuat surah...</p>
        </div>
      </div>
    );
  }

  if (!surah) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-background">
        <h1 className="text-2xl font-bold">Surah tidak ditemukan</h1>
        <Button onClick={() => navigate("/quran")} className="mt-4">
          Kembali
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
        <div className="mx-auto max-w-4xl px-4 py-3">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/quran")}
              className="gap-1"
            >
              <ChevronLeft className="h-4 w-4" />
              <span className="hidden sm:inline">Kembali</span>
            </Button>
            <div className="text-center">
              <h1 className="text-base font-semibold sm:text-lg">
                {surah.nm_surat}
              </h1>
              <p className="text-xs text-muted-foreground">
                {surah.arti_surat} · {surah.jml_ayat} Ayat
              </p>
            </div>

            <ModeToggle />
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="mx-auto max-w-4xl px-4 py-6">
        {/* Bismillah for non-Al-Fatihah */}
        {surah.no_surat !== 1 && surah.no_surat !== 9 && (
          <div className="mb-8 text-center">
            <p className="font-arabic text-3xl text-emerald-600 dark:text-emerald-400">
              بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
            </p>
            <p className="mt-2 text-xs text-muted-foreground">
              Dengan nama Allah Yang Maha Pengasih, Maha Penyayang
            </p>
          </div>
        )}

        {/* Ayat List */}
        <div className="space-y-6">
          {displayedAyat.map((ayat, index) => (
              <AyatCard
                key={ayat.no_ayat}
                ayat={ayat}
                isLast={index === displayedAyat.length - 1}
                ref={index === displayedAyat.length - 1 ? lastAyatRef : null}
              />
            ))}
        </div>

        {/* Loading More Indicator */}
        {loadingMore && (
          <div className="py-8 text-center">
            <Loader2 className="mx-auto h-6 w-6 animate-spin text-emerald-600" />
            <p className="mt-2 text-sm text-muted-foreground">
              Memuat ayat selanjutnya...
            </p>
          </div>
        )}

        {/* Complete Indicator */}
        {displayedAyat.length === allAyat.length && allAyat.length > 0 && (
          <div className="py-8 text-center">
            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 px-4 py-2 text-sm text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400">
              <BookOpen className="h-4 w-4" />
              <span>Telah sampai pada akhir surah</span>
            </div>
          </div>
        )}
      </main>

      {/* Navigation Buttons for Desktop */}
      <div className="sticky bottom-4 z-50 flex justify-center gap-3">
        {currentPage > 1 && (
          <Button
            onClick={() => {
              setCurrentPage(1);
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            variant="outline"
            size="sm"
            className="shadow-lg"
          >
            Ke Atas
          </Button>
        )}
        {displayedAyat.length < allAyat.length && (
          <Button
            onClick={loadMore}
            variant="default"
            size="sm"
            className="shadow-lg"
          >
            <ChevronRight className="mr-1 h-4 w-4" />
            Load More
          </Button>
        )}
      </div>
    </div>
  );
}

// Ayat Card Component with forwardRef for infinite scroll
const AyatCard = forwardRef<
  HTMLDivElement,
  {
    ayat: Ayat;
    isLast: boolean;
  }
>(({ ayat, isLast }, ref) => {
  return (
    <div
      ref={ref}
      className="group rounded-xl border border-border bg-card p-4 transition-all hover:border-emerald-500/30 hover:shadow-md sm:p-6"
    >
      {/* Ayat Number */}
      <div className="mb-3 flex items-center gap-2">
        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-500/10 text-xs font-medium text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400">
          {ayat.no_ayat}
        </div>
        <div className="h-px flex-1 bg-linear-to-r from-emerald-500/20 to-transparent" />
      </div>

      {/* Arabic Text */}
      <div className="mb-4 text-right">
        <p className="font-arabic text-2xl leading-loose sm:text-3xl">
          {ayat.arab}
        </p>
      </div>

      {/* Translation */}
      <div className="border-t border-border pt-3">
        <p
          className="text-sm leading-relaxed text-muted-foreground sm:text-base"
          dangerouslySetInnerHTML={{ __html: ayat.tafsir }}
        />
      </div>
    </div>
  );
});

AyatCard.displayName = "AyatCard";
