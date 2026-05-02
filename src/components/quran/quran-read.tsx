// src/components/SurahReader.tsx
import { useState, useEffect, useCallback, useRef, forwardRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ChevronLeft,
  ChevronRight,
  Loader2,
  BookOpen,
  Eye,
  EyeOff,
  Palette,
  Bookmark,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/mode-toggle";
import type { Ayat, Surah } from "@/data/const";
import surahList from "@/data/m_quran_t.json";
import ayatData from "@/data/m_surat_t.json";
import { useReaderStore, ARABIC_COLORS } from "@/store/quran-reader-settings";
import { useBookmarkStore } from "@/store/quran-bookmark-store";

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
  const [showColorPicker, setShowColorPicker] = useState(false);

  const {
    showTranslation,
    arabicColorIndex,
    toggleTranslation,
    setArabicColorIndex,
  } = useReaderStore();

  const observerRef = useRef<IntersectionObserver | null>(null);
  const lastAyatRef = useRef<HTMLDivElement | null>(null);
  const colorPickerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        colorPickerRef.current &&
        !colorPickerRef.current.contains(e.target as Node)
      ) {
        setShowColorPicker(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const surahInfo = (surahList as Surah[]).find(
      (s) => s.no_surat === Number(noSurat),
    );
    setSurah(surahInfo || null);
  }, [noSurat]);

  useEffect(() => {
    if (!noSurat) return;
    setLoading(true);
    const ayatForSurah = (ayatData as Ayat[]).filter(
      (ayat) => ayat.no_surat === Number(noSurat),
    );
    setAllAyat(ayatForSurah);
    setCurrentPage(1);
    setLoading(false);
  }, [noSurat]);

  useEffect(() => {
    const end = currentPage * AYAT_PER_PAGE;
    setDisplayedAyat(allAyat.slice(0, end));
  }, [currentPage, allAyat]);

  const loadMore = useCallback(() => {
    if (displayedAyat.length < allAyat.length && !loadingMore) {
      setLoadingMore(true);
      setTimeout(() => {
        setCurrentPage((prev) => prev + 1);
        setLoadingMore(false);
      }, 500);
    }
  }, [displayedAyat.length, allAyat.length, loadingMore]);

  const navigateToPrevSurah = () => {
    if (Number(noSurat) > 1) navigate(`/surah/${Number(noSurat) - 1}`);
  };

  const navigateToNextSurah = () => {
    if (Number(noSurat) < 114) navigate(`/surah/${Number(noSurat) + 1}`);
  };

  useEffect(() => {
    if (observerRef.current) observerRef.current.disconnect();
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
    if (lastAyatRef.current) observerRef.current.observe(lastAyatRef.current);
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

  const selectedColor = ARABIC_COLORS[arabicColorIndex];

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

            <div className="flex items-center gap-1">
              {/* Toggle Terjemahan */}
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleTranslation}
                title={
                  showTranslation
                    ? "Sembunyikan terjemahan"
                    : "Tampilkan terjemahan"
                }
                className="gap-1 px-2"
              >
                {showTranslation ? (
                  <Eye className="h-4 w-4" />
                ) : (
                  <EyeOff className="h-4 w-4 text-muted-foreground" />
                )}
                <span className="hidden sm:inline text-xs">Terjemahan</span>
              </Button>

              {/* Color Picker */}
              <div className="relative" ref={colorPickerRef}>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowColorPicker((prev) => !prev)}
                  title="Pilih warna teks Arab"
                  className="gap-1.5 px-2"
                >
                  <Palette className="h-4 w-4" />
                  <span
                    className="hidden sm:inline-block h-2.5 w-2.5 rounded-full border border-border"
                    style={{ backgroundColor: selectedColor.hex }}
                  />
                </Button>

                {showColorPicker && (
                  <div className="absolute right-0 top-full mt-2 z-50 w-44 rounded-xl border border-border bg-popover p-2 shadow-lg">
                    <p className="mb-2 px-1 text-xs font-medium text-muted-foreground">
                      Warna Teks Arab
                    </p>
                    <div className="space-y-1">
                      {ARABIC_COLORS.map((color, i) => (
                        <button
                          key={color.value}
                          onClick={() => {
                            setArabicColorIndex(i);
                            setShowColorPicker(false);
                          }}
                          className={`flex w-full items-center gap-2.5 rounded-lg px-2 py-1.5 text-left text-sm transition-colors hover:bg-accent ${
                            arabicColorIndex === i
                              ? "bg-accent font-medium"
                              : ""
                          }`}
                        >
                          <span
                            className="h-3.5 w-3.5 shrink-0 rounded-full border border-border/50"
                            style={{ backgroundColor: color.hex }}
                          />
                          <span>{color.label}</span>
                          {arabicColorIndex === i && (
                            <span className="ml-auto text-xs text-emerald-600 dark:text-emerald-400">
                              ✓
                            </span>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <ModeToggle />
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="mx-auto max-w-4xl px-4 py-6">
        {/* Bismillah */}
        {surah.no_surat !== 1 && surah.no_surat !== 9 && (
          <div className="mb-8 text-center">
            <p className={`font-arabic text-3xl ${selectedColor.value}`}>
              بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
            </p>
            {showTranslation && (
              <p className="mt-2 text-xs text-muted-foreground">
                Dengan nama Allah Yang Maha Pengasih, Maha Penyayang
              </p>
            )}
          </div>
        )}

        {/* Ayat List */}
        <div className="space-y-6">
          {displayedAyat.map((ayat, index) => (
            <AyatCard
              key={ayat.no_ayat}
              ayat={ayat}
              surahName={surah.nm_surat}
              isLast={index === displayedAyat.length - 1}
              ref={index === displayedAyat.length - 1 ? lastAyatRef : null}
              showTranslation={showTranslation}
              arabicColorClass={selectedColor.value}
            />
          ))}
        </div>

        {/* Loading More */}
        {loadingMore && (
          <div className="py-8 text-center">
            <Loader2 className="mx-auto h-6 w-6 animate-spin text-emerald-600" />
            <p className="mt-2 text-sm text-muted-foreground">
              Memuat ayat selanjutnya...
            </p>
          </div>
        )}

        {/* Complete */}
        {displayedAyat.length === allAyat.length && allAyat.length > 0 && (
          <div className="py-8 text-center">
            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 px-4 py-2 text-sm text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400">
              <BookOpen className="h-4 w-4" />
              <div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={navigateToPrevSurah}
                  disabled={Number(noSurat) === 1}
                  className="gap-1"
                >
                  <ChevronLeft className="h-4 w-4" />
                  <span className="hidden sm:inline">Sebelumnya</span>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={navigateToNextSurah}
                  disabled={Number(noSurat) === 114}
                  className="gap-1"
                >
                  <ChevronRight className="h-4 w-4" />
                  <span className="hidden sm:inline">Selanjutnya</span>
                </Button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Bottom Navigation */}
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

// Ayat Card
const AyatCard = forwardRef<
  HTMLDivElement,
  {
    ayat: Ayat;
    surahName: string;
    isLast: boolean;
    showTranslation: boolean;
    arabicColorClass: string;
  }
>(({ ayat, surahName, showTranslation, arabicColorClass }, ref) => {
  const { setBookmark, clearBookmark, isBookmarked } = useBookmarkStore();
  const bookmarked = isBookmarked(ayat.no_surat, ayat.no_ayat);

  const handleBookmarkToggle = () => {
    if (bookmarked) {
      clearBookmark();
    } else {
      // Replace bookmark lama otomatis
      setBookmark({
        noSurat: ayat.no_surat,
        noAyat: ayat.no_ayat,
        nmSurat: surahName,
        arab: ayat.arab,
        tafsir: ayat.tafsir,
        savedAt: Date.now(),
      });
    }
  };

  return (
    <div
      ref={ref}
      className={`group rounded-xl border bg-card p-4 transition-all hover:shadow-md sm:p-6 ${
        bookmarked
          ? "border-amber-400/50 shadow-sm shadow-amber-500/10 dark:border-amber-500/40"
          : "border-border hover:border-emerald-500/30"
      }`}
    >
      {/* Ayat Number + Bookmark */}
      <div className="mb-3 flex items-center gap-2">
        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-500/10 text-xs font-medium text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400">
          {ayat.no_ayat}
        </div>
        <div className="h-px flex-1 bg-linear-to-r from-emerald-500/20 to-transparent" />

        {/* Bookmark button — selalu terlihat, beda state */}
        <button
          onClick={handleBookmarkToggle}
          title={bookmarked ? "Hapus bookmark" : "Simpan bookmark"}
          className={`flex h-7 w-7 items-center justify-center rounded-full transition-all ${
            bookmarked
              ? "bg-amber-500/15 text-amber-500 hover:bg-amber-500/25"
              : "text-muted-foreground hover:bg-amber-500/10 hover:text-amber-500"
          }`}
        >
          <Bookmark
            className={`h-3.5 w-3.5 transition-all ${bookmarked ? "fill-amber-500" : ""}`}
          />
        </button>
      </div>

      {/* Arabic Text */}
      <div className="mb-4 text-right">
        <p
          className={`font-arabic text-2xl leading-loose sm:text-3xl ${arabicColorClass}`}
        >
          {ayat.arab}
        </p>
      </div>

      {/* Translation */}
      {showTranslation && (
        <div className="border-t border-border pt-3">
          <p
            className="text-sm leading-relaxed text-muted-foreground sm:text-base"
            dangerouslySetInnerHTML={{ __html: ayat.tafsir }}
          />
        </div>
      )}
    </div>
  );
});

AyatCard.displayName = "AyatCard";
