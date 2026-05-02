// src/store/quran-bookmark.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface BookmarkItem {
  noSurat: number;
  noAyat: number;
  nmSurat: string;
  arab: string;
  tafsir: string;
  savedAt: number;
}

interface BookmarkStore {
  bookmark: BookmarkItem | null;
  setBookmark: (item: BookmarkItem) => void;
  clearBookmark: () => void;
  isBookmarked: (noSurat: number, noAyat: number) => boolean;
}

export const useBookmarkStore = create<BookmarkStore>()(
  persist(
    (set, get) => ({
      bookmark: null,

      setBookmark: (item) => set({ bookmark: item }),

      clearBookmark: () => set({ bookmark: null }),

      isBookmarked: (noSurat, noAyat) => {
        const bm = get().bookmark;
        return bm?.noSurat === noSurat && bm?.noAyat === noAyat;
      },
    }),
    { name: "quran-bookmark" },
  ),
);
