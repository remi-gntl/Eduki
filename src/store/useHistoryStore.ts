"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

const MAX_HISTORY = 300;

interface HistoryState {
  seenTitles: string[];
  addSeen: (titles: string[]) => void;
}

export const useHistoryStore = create<HistoryState>()(
  persist(
    (set, get) => ({
      seenTitles: [],
      addSeen: (titles) => {
        const merged = Array.from(new Set([...get().seenTitles, ...titles])).slice(-MAX_HISTORY);
        set({ seenTitles: merged });
      },
    }),
    { name: "eduki-history" }
  )
);