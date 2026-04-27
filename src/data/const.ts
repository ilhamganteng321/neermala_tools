import {
  dracula,
  nightOwl,
  nord,
} from "react-syntax-highlighter/dist/esm/styles/hljs";
import {
  atomDark,
  materialDark,
  oneDark,
  vscDarkPlus,
} from "react-syntax-highlighter/dist/esm/styles/prism";

export type ThemeName =
  | "vscDarkPlus"
  | "oneDark"
  | "dracula"
  | "nord"
  | "materialDark"
  | "nightOwl"
  | "atomDark";

export type Language =
  | "typescript"
  | "javascript"
  | "python"
  | "rust"
  | "go"
  | "java"
  | "cpp"
  | "css"
  | "html"
  | "json"
  | "bash"
  | "sql";

export type GradientPreset = {
  label: string;
  value: string;
};

// ── Constants ─────────────────────────────────────────────────────────────────

export const THEMES: Record<
  ThemeName,
  { style: object; label: string; bg: string }
> = {
  vscDarkPlus: { style: vscDarkPlus, label: "VS Code Dark+", bg: "#1e1e1e" },
  oneDark: { style: oneDark, label: "One Dark", bg: "#282c34" },
  dracula: { style: dracula, label: "Dracula", bg: "#282a36" },
  nord: { style: nord, label: "Nord", bg: "#2e3440" },
  materialDark: {
    style: materialDark,
    label: "Material Dark",
    bg: "#212121",
  },
  nightOwl: { style: nightOwl, label: "Night Owl", bg: "#011627" },
  atomDark: { style: atomDark, label: "Atom Dark", bg: "#1d1f21" },
};

export const LANGUAGES: { value: Language; label: string }[] = [
  { value: "typescript", label: "TypeScript" },
  { value: "javascript", label: "JavaScript" },
  { value: "python", label: "Python" },
  { value: "rust", label: "Rust" },
  { value: "go", label: "Go" },
  { value: "java", label: "Java" },
  { value: "cpp", label: "C++" },
  { value: "css", label: "CSS" },
  { value: "html", label: "HTML" },
  { value: "json", label: "JSON" },
  { value: "bash", label: "Bash" },
  { value: "sql", label: "SQL" },
];

export const GRADIENTS: GradientPreset[] = [
  {
    label: "Neon Dusk",
    value: "linear-gradient(135deg, #0f0c29, #302b63, #24243e)",
  },
  {
    label: "Aurora",
    value: "linear-gradient(135deg, #1a1a2e, #16213e, #0f3460)",
  },
  {
    label: "Forest",
    value: "linear-gradient(135deg, #0a3d2e, #1a5c45, #0d2b1f)",
  },
  { label: "Candy", value: "linear-gradient(135deg, #f953c6, #b91d73)" },
  {
    label: "Sunset",
    value: "linear-gradient(135deg, #ff6b6b, #ee0979, #ff6b6b)",
  },
  { label: "Ocean", value: "linear-gradient(135deg, #005c97, #363795)" },
  { label: "Midnight", value: "linear-gradient(135deg, #141414, #1a1a1a)" },
  { label: "Peach", value: "linear-gradient(135deg, #ed4264, #ffedbc)" },
];

export const DEFAULT_CODE = `function fibonacci(n: number): number {
  if (n <= 1) return n;
  
  let prev = 0, curr = 1;
  for (let i = 2; i <= n; i++) {
    [prev, curr] = [curr, prev + curr];
  }
  
  return curr;
}

console.log(fibonacci(10)); // 55`;

// ── Mac Window Dots ───────────────────────────────────────────────────────────
export const ARABIC_NAMES: Record<number, string> = {
  1: "الْفَاتِحَة",
  2: "الْبَقَرَة",
  3: "آلِ عِمْرَان",
  4: "النِّسَاء",
  5: "الْمَائِدَة",
  6: "الْأَنْعَام",
  7: "الْأَعْرَاف",
  8: "الْأَنْفَال",
  9: "التَّوْبَة",
  10: "يُونُس",
  11: "هُود",
  12: "يُوسُف",
  13: "الرَّعْد",
  14: "إِبْرَاهِيم",
  15: "الْحِجْر",
  16: "النَّحْل",
  17: "الْإِسْرَاء",
  18: "الْكَهْف",
  19: "مَرْيَم",
  20: "طه",
  21: "الْأَنْبِيَاء",
  22: "الْحَج",
  23: "الْمُؤْمِنُون",
  24: "النُّور",
  25: "الْفُرْقَان",
  26: "الشُّعَرَاء",
  27: "النَّمْل",
  28: "الْقَصَص",
  29: "الْعَنْكَبُوت",
  30: "الرُّوم",
  31: "لُقْمَان",
  32: "السَّجْدَة",
  33: "الْأَحْزَاب",
  34: "سَبَأ",
  35: "فَاطِر",
  36: "يس",
  37: "الصَّافَّات",
  38: "ص",
  39: "الزُّمَر",
  40: "غَافِر",
  41: "فُصِّلَت",
  42: "الشُّورَى",
  43: "الزُّخْرُف",
  44: "الدُّخَان",
  45: "الْجَاثِيَة",
  46: "الْأَحْقَاف",
  47: "مُحَمَّد",
  48: "الْفَتْح",
  49: "الْحُجُرَات",
  50: "ق",
  51: "الذَّارِيَات",
  52: "الطُّور",
  53: "النَّجْم",
  54: "الْقَمَر",
  55: "الرَّحْمَن",
  56: "الْوَاقِعَة",
  57: "الْحَدِيد",
  58: "الْمُجَادِلَة",
  59: "الْحَشْر",
  60: "الْمُمْتَحَنَة",
  61: "الصَّف",
  62: "الْجُمُعَة",
  63: "الْمُنَافِقُون",
  64: "التَّغَابُن",
  65: "الطَّلَاق",
  66: "التَّحْرِيم",
  67: "الْمُلْك",
  68: "الْقَلَم",
  69: "الْحَاقَّة",
  70: "الْمَعَارِج",
  71: "نُوح",
  72: "الْجِن",
  73: "الْمُزَّمِّل",
  74: "الْمُدَّثِّر",
  75: "الْقِيَامَة",
  76: "الْإِنسَان",
  77: "الْمُرْسَلَات",
  78: "النَّبَأ",
  79: "النَّازِعَات",
  80: "عَبَس",
  81: "التَّكْوِير",
  82: "الِانفِطَار",
  83: "الْمُطَفِّفِين",
  84: "الِانشِقَاق",
  85: "الْبُرُوج",
  86: "الطَّارِق",
  87: "الْأَعْلَى",
  88: "الْغَاشِيَة",
  89: "الْفَجْر",
  90: "الْبَلَد",
  91: "الشَّمْس",
  92: "اللَّيْل",
  93: "الضُّحَى",
  94: "الشَّرْح",
  95: "التِّين",
  96: "الْعَلَق",
  97: "الْقَدْر",
  98: "الْبَيِّنَة",
  99: "الزَّلْزَلَة",
  100: "الْعَادِيَات",
  101: "الْقَارِعَة",
  102: "التَّكَاثُر",
  103: "الْعَصْر",
  104: "الْهُمَزَة",
  105: "الْفِيل",
  106: "قُرَيْش",
  107: "الْمَاعُون",
  108: "الْكَوْثَر",
  109: "الْكَافِرُون",
  110: "النَّصْر",
  111: "الْمَسَد",
  112: "الْإِخْلَاص",
  113: "الْفَلَق",
  114: "النَّاس",
};

export interface Surah {
  arti_surat: string;
  asb_nuzul: string;
  finish: number;
  jml_ayat: number;
  nm_surat: string;
  nm_surat2: string;
  no_surat: number;
  tmp_turun: "Makkiyyah" | "Madaniyyah";
}

export type FilterType = "All" | "Makkiyyah" | "Madaniyyah";

export const FILTER_OPTIONS: { label: string; value: FilterType }[] = [
  { label: "Semua", value: "All" },
  { label: "Makkiyyah", value: "Makkiyyah" },
  { label: "Madaniyyah", value: "Madaniyyah" },
];

export interface Ayat {
  arab: string;
  no_ayat: number;
  no_hal: number;
  no_juz: number;
  no_surat: number;
  tafsir: string;
  tafsir_clearQuran: string | null;
  tafsir_muasir: string | null;
  tafsir_sureQuran: string | null;
}
