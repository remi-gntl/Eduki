"use client";

import { ChevronUp, Heart } from "lucide-react";
import type { Card as CardType } from "@/types/card";
import { CATEGORY_COLORS } from "@/types/card";
import { useSwipeCard } from "@/hooks/useSwipeCard";
import { useStore } from "@/store/useStore";
import CardFace from "./CardFace";

interface CardProps {
  card: CardType;
  onAdvance: () => void;
  onSaved: () => void;
  showNextSkeleton?: boolean;
}

export default function Card({ card, onAdvance, onSaved, showNextSkeleton }: CardProps) {
  const saveCard = useStore((s) => s.saveCard);

  const { bind, transform, isDragging, showKeepHint, showNextHint, triggerNext, triggerSave } =
    useSwipeCard({
      onNext: onAdvance,
      onSave: () => {
        saveCard(card);
        onSaved();
      },
    });

  const color = CATEGORY_COLORS[card.categorie];

  return (
    <div className="h-full flex flex-col gap-4">
      <div className="relative flex-1 min-h-0">
        {showNextSkeleton && (
          <div
            className="absolute inset-0 rounded-[28px] translate-y-2.5 scale-[0.97] opacity-50"
            style={{ background: "#15161B", border: "1px solid #23242C" }}
          />
        )}

        <div
          {...bind}
          className="absolute inset-0 rounded-[28px] select-none touch-none flex flex-col overflow-hidden"
          style={{
            background: `radial-gradient(120% 90% at 50% 0%, ${color.bg}26 0%, #121319 55%)`,
            transform,
            transition: isDragging ? "none" : "transform 0.22s ease-out",
            cursor: isDragging ? "grabbing" : "grab",
            boxShadow: "0 20px 40px -20px rgba(0,0,0,0.5)",
          }}
        >
          {showKeepHint && (
            <div
              className="absolute top-6 right-6 z-10 px-3 py-1.5 rounded-full text-[11px] font-bold rotate-6"
              style={{ background: "#C3F53B", color: "#1E2B00", fontFamily: "'JetBrains Mono',monospace" }}
            >
              GARDER
            </div>
          )}
          {showNextHint && (
            <div
              className="absolute top-6 left-6 z-10 px-3 py-1.5 rounded-full text-[11px] font-bold -rotate-3"
              style={{ border: "1px solid #F6F3EA66", color: "#F6F3EA", fontFamily: "'JetBrains Mono',monospace" }}
            >
              SUIVANT
            </div>
          )}

          <div className="flex-1 min-h-0 overflow-y-auto">
            <CardFace card={card} />
          </div>

          <div className="flex justify-center pb-3 shrink-0">
            <ChevronUp size={18} className="animate-bounce" color="#F6F3EA55" />
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center gap-10 shrink-0 pb-1">
        <button
          onClick={triggerSave}
          aria-label="Sauvegarder"
          className="w-12 h-12 rounded-full flex items-center justify-center active:scale-90 transition-transform"
          style={{ border: "1px solid #F6F3EA33" }}
        >
          <Heart size={19} color="#C3F53B" />
        </button>
        <button
          onClick={triggerNext}
          aria-label="Carte suivante"
          className="w-12 h-12 rounded-full flex items-center justify-center active:scale-90 transition-transform"
          style={{ background: "#F6F3EA" }}
        >
          <ChevronUp size={21} color="#0B0C10" />
        </button>
      </div>
    </div>
  );
}
