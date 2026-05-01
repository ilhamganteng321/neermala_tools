// src/types/funfact.ts
export interface FunFact {
  title: string;
  description: string;
  label: string;
  image: string | null; // base64 or object URL
  themeColor: string;
}

export const defaultFunFact: FunFact = {
  title: "TAHUKAH KAMU?",
  description:
    "Otak manusia menggunakan sekitar 20% dari total energi tubuh, meskipun beratnya hanya 2% dari berat badan.\n\nBagikan fakta menarik ini ke teman-temanmu!",
  label: "FUN FACT",
  image: null,
  themeColor: "#f97316", // orange-500
};

