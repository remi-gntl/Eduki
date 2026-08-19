"use client";

import { useState } from "react";
import { Bookmark, ChevronLeft, Loader2 } from "lucide-react";
import type { Card as CardType } from "@/types/card";
import Card from "./Card";
import { useStore } from "@/store/useStore";

interface CardStackProps {
  cards: CardType[];
  index: number;
  onAdvance: () => void;
  onBack: () => void;
  onOpenFavorites: () => void;
}

export default function CardStack({ cards, index, onAdvance, onBack, onOpenFavorites }: CardStackProps) {
  const [toast, setToast] = useState<string | null>(null);
  const savedCount = useStore((s) => s.savedCards.length);

  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(null), 1600);
  }

  const current = cards[index];
  const hasNextLoaded = index + 1 < cards.length;

  return (
    <div className="h-full flex flex-col px-5 pt-3 pb-6 relative">
      <div className="flex items-center justify-between mb-4 shrink-0">
        <button onClick={onBack} aria-label="Retour">
          <ChevronLeft size={20} color="#F6F3EA88" />
        </button>
        <span className="font-mono text-[11px] tracking-widest" style={{ color: "#F6F3EA88" }}>
          FICHES
        </span>
        <button onClick={onOpenFavorites} className="flex items-center gap-1.5" aria-label="Mes favoris">
          <Bookmark size={16} color="#C3F53B" />
          <span className="font-mono text-[12px]" style={{ color: "#C3F53B" }}>
            {savedCount}
          </span>
        </button>
      </div>

      <div className="relative flex-1 min-h-0">
        {!current ? (
          <SkeletonCard />
        ) : (
          <Card
            key={current.id}
            card={current}
            showNextSkeleton={!hasNextLoaded}
            onAdvance={onAdvance}
            onSaved={() => showToast("Ajouté aux favoris")}
          />
        )}
      </div>

      {toast && (
        <div
          className="absolute bottom-6 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full font-mono text-[12px]"
          style={{ background: "#C3F53B", color: "#1E2B00" }}
        >
          {toast}
        </div>
      )}
    </div>
  );
}

// Affiché quand scroll plus rapide que génération, on load avant d'afficher la carte 
function SkeletonCard() {
  return (
    <div
      className="absolute inset-0 rounded-2xl flex flex-col items-center justify-center gap-3"
      style={{ background: "#17181D", border: "1px solid #262832" }}
    >
      <Loader2 size={22} className="animate-spin" color="#F6F3EA55" />
      <span className="font-mono text-[11px] tracking-widest" style={{ color: "#F6F3EA55" }}>
        GÉNÉRATION…
      </span>
    </div>
  );
}
