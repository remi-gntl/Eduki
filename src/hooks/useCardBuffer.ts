"use client";

import { useEffect, useRef, useState } from "react";
import type { Card as CardType } from "@/types/card";

const BUFFER_TARGET = 10;
const REFILL_TRIGGER = 5;
const MAX_SEEN_TITLES = 40; // evite un prompt qui grossit indéfiniment en session longue

async function fetchCards(count: number, exclude: string[]): Promise<CardType[]> {
  const res = await fetch("/api/generate-cards", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ count, exclude }),
  });
  const data = await res.json();
  return data.cards as CardType[];
}

// génération démarre dès l'arrivée sur le site
export function useCardBuffer() {
  const [cards, setCards] = useState<CardType[]>([]);
  const [index, setIndex] = useState(0);
  const isFetching = useRef(false);
  const seenTitles = useRef<string[]>([]);

  function absorb(newCards: CardType[]) {
    setCards((prev) => [...prev, ...newCards]);
    seenTitles.current = [...seenTitles.current, ...newCards.map((c) => c.titre)].slice(-MAX_SEEN_TITLES);
  }

  useEffect(() => {
    fetchCards(BUFFER_TARGET, []).then(absorb);
  }, []);

  useEffect(() => {
    const remaining = cards.length - index;
    if (cards.length > 0 && remaining <= REFILL_TRIGGER && !isFetching.current) {
      isFetching.current = true;
      fetchCards(BUFFER_TARGET, seenTitles.current).then((newCards) => {
        absorb(newCards);
        isFetching.current = false;
      });
    }
  }, [index, cards.length]);

  return {
    cards,
    index,
    advance: () => setIndex((i) => Math.min(i + 1, cards.length - 1)),
    isReady: cards.length > 0,
  };
}
