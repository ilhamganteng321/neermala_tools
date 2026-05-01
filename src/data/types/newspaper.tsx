export interface NewspaperData {
  headerTitle: string;
  date: string;
  mainTitle: string;
  description: string;
  quote: string;
  image: string | null;
}

export interface ThemePalette {
  bg: string;
  paper: string;
  ink: string;
  muted: string;
  border: string;
  accent: string;
  rule: string;
  shadow: string;
}

export interface Theme {
  light: ThemePalette;
  dark: ThemePalette;
}
