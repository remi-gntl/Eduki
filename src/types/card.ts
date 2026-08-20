export type Categorie = "RÉSEAU" | "SÉCURITÉ" | "DONNÉES" | "SYSTÈME" | "ARCHITECTURE" | "LANGAGE";

export interface Card {
  id: string;
  categorie: Categorie;
  titre: string;
  signification?: string;
  tldr: string;
  analogie: string;
  cas_usage: string;
  schema: string[];
}

export const CATEGORY_COLORS: Record<Categorie, { bg: string; text: string }> = {
  "RÉSEAU": { bg: "#4C7EFF", text: "#0A1A3D" },
  "SÉCURITÉ": { bg: "#E8483A", text: "#3D0E09" },
  "DONNÉES": { bg: "#F0A63B", text: "#3D2604" },
  "SYSTÈME": { bg: "#9B8CFF", text: "#211448" },
  "ARCHITECTURE": { bg: "#34C6B0", text: "#0B2C26" },
  "LANGAGE": { bg: "#E85DA0", text: "#3D0E23" },
};