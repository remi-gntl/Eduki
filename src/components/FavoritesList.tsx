"use client";

import { useState } from "react";
import { ChevronLeft, Trash2, X } from "lucide-react";
import { useStore } from "@/store/useStore";
import { CATEGORY_COLORS } from "@/types/card";
import type { Card as CardType } from "@/types/card";
import CardFace from "./CardFace";

export default function FavoritesList({ onBack }: { onBack: () => void }) {
  const savedCards = useStore((s) => s.savedCards);
  const removeCard = useStore((s) => s.removeCard);
  const [openCard, setOpenCard] = useState<CardType | null>(null);
  const [pendingDelete, setPendingDelete] = useState<CardType | null>(null);

  return (
    <div className="h-full flex flex-col px-5 pt-3 pb-6">
      <div className="flex items-center gap-3 mb-5 shrink-0">
        <button onClick={onBack} aria-label="Retour">
          <ChevronLeft size={20} color="#F6F3EA88" />
        </button>
        <span className="font-mono text-[11px] tracking-widest" style={{ color: "#F6F3EA88" }}>
          MES FAVORIS ({savedCards.length})
        </span>
      </div>

      {savedCards.length === 0 ? (
        <div className="flex-1 flex items-center justify-center text-center px-6">
          <p className="text-[13px]" style={{ color: "#8D8F97" }}>
            Rien pour l&apos;instant. Glisse une fiche vers la droite pour la garder ici.
          </p>
        </div>
      ) : (
        <div className="flex-1 min-h-0 overflow-y-auto">
          {savedCards.map((card) => {
            const color = CATEGORY_COLORS[card.categorie];
            return (
              <div
                key={card.id}
                className="flex items-start gap-3 py-4"
                style={{ borderTop: "1px solid #F6F3EA14" }}
              >
                <button onClick={() => setOpenCard(card)} className="flex-1 text-left min-w-0">
                  <span
                    className="inline-block px-2 py-0.5 rounded-full text-[9px] font-semibold mb-1.5"
                    style={{ background: `${color.bg}22`, color: color.bg, fontFamily: "'JetBrains Mono',monospace" }}
                  >
                    {card.categorie}
                  </span>
                  <p className="text-[14px] font-medium mb-0.5" style={{ color: "#F6F3EA" }}>
                    {card.titre}
                  </p>
                  <p className="text-[12px] line-clamp-2" style={{ color: "#8D8F97" }}>
                    {card.tldr}
                  </p>
                </button>
                <button
                  onClick={() => setPendingDelete(card)}
                  aria-label="Retirer des favoris"
                  className="shrink-0 mt-1 opacity-40 hover:opacity-100 active:opacity-100 transition-opacity"
                >
                  <Trash2 size={15} color="#E8483A" />
                </button>
              </div>
            );
          })}
        </div>
      )}

      {openCard && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center"
          style={{ background: "#000000AA" }}
          onClick={() => setOpenCard(null)}
        >
          <div
            className="w-full max-w-md h-[85%] rounded-t-[28px] overflow-hidden relative"
            style={{ background: "#121319" }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setOpenCard(null)}
              aria-label="Fermer"
              className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full flex items-center justify-center"
              style={{ background: "#F6F3EA22" }}
            >
              <X size={16} color="#F6F3EA" />
            </button>
            <div className="h-full overflow-y-auto pt-12">
              <CardFace card={openCard} center={false} />
            </div>
          </div>
        </div>
      )}

      {pendingDelete && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center px-8"
          style={{ background: "#000000AA" }}
          onClick={() => setPendingDelete(null)}
        >
          <div
            className="w-full max-w-xs rounded-2xl p-5"
            style={{ background: "#17181D", border: "1px solid #2C2E3A" }}
            onClick={(e) => e.stopPropagation()}
          >
            <p className="text-[14px] font-medium mb-1" style={{ color: "#F6F3EA" }}>
              Retirer cette fiche ?
            </p>
            <p className="text-[12.5px] mb-5" style={{ color: "#8D8F97" }}>
              « {pendingDelete.titre} » sera enlevée de tes favoris.
            </p>
            <div className="flex gap-2.5">
              <button
                onClick={() => setPendingDelete(null)}
                className="flex-1 py-2.5 rounded-full text-[13px] font-medium"
                style={{ border: "1px solid #F6F3EA33", color: "#F6F3EA" }}
              >
                Annuler
              </button>
              <button
                onClick={() => {
                  removeCard(pendingDelete.id);
                  setPendingDelete(null);
                }}
                className="flex-1 py-2.5 rounded-full text-[13px] font-medium"
                style={{ background: "#E8483A", color: "#F6F3EA" }}
              >
                Retirer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
