import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Card } from "@/types/card";

interface EdukiState {
  savedCards: Card[];
  saveCard: (card: Card) => void;
  removeCard: (id: string) => void;
  isSaved: (id: string) => boolean;
}

// persist() gère auto la lecture/écriture dans localStorage sous la clé "eduki-favorites"
// saveCard() suffit, la persistance est transparente
export const useStore = create<EdukiState>()(
  persist(
    (set, get) => ({
      savedCards: [],
      saveCard: (card) =>
        set((state) =>
          state.savedCards.some((c) => c.id === card.id)
            ? state
            : { savedCards: [...state.savedCards, card] }
        ),
      removeCard: (id) =>
        set((state) => ({
          savedCards: state.savedCards.filter((c) => c.id !== id),
        })),
      isSaved: (id) => get().savedCards.some((c) => c.id === id),
    }),
    { name: "eduki-favorites" }
  )
);