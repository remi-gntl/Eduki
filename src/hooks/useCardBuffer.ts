"use client";

import { useEffect, useRef, useState } from "react";
import type { Card as CardType } from "@/types/card";
import { SEED_CARDS } from "@/lib/seed-cards";
import { useHistoryStore } from "@/store/useHistoryStore";

const BUFFER_TARGET = 10;
const REFILL_TRIGGER = 5;
const IDLE_TOPUP_MS = 7000;
const IDLE_TOPUP_COUNT = 5;
const MAX_SEEN_FOR_PROMPT = 40; // liste envoyée a l'IA, plus courte que l'historique complet

async function fetchCards(count: number, exclude: string[]): Promise<CardType[]> {
  const res = await fetch("/api/generate-cards", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ count, exclude }),
  });
  const data = await res.json();
  return data.cards as CardType[];
}

export function useCardBuffer() {
  const persistedSeen = useHistoryStore((s) => s.seenTitles);
  const addSeen = useHistoryStore((s) => s.addSeen);

  const [cards, setCards] = useState<CardType[]>(() =>
    SEED_CARDS.filter((c) => !persistedSeen.includes(c.titre))
  );
  const [index, setIndex] = useState(0);
  const isFetching = useRef(false);
  const seenForPrompt = useRef<string[]>([...persistedSeen]);
  const [pendingMessage, setPendingMessage] = useState<string | null>(null);

  function absorb(newCards: CardType[]) {
    setCards((prev) => [...prev, ...newCards]);
    const titles = newCards.map((c) => c.titre);
    seenForPrompt.current = [...seenForPrompt.current, ...titles].slice(-MAX_SEEN_FOR_PROMPT);
    addSeen(titles);
  }

  function refill(count: number) {
    if (isFetching.current) return;
    isFetching.current = true;
    fetchCards(count, seenForPrompt.current)
      .then(absorb)
      .finally(() => {
        isFetching.current = false;
      });
  }

  useEffect(() => {
    if (cards.length > 0) addSeen(cards.map((c) => c.titre));
    refill(BUFFER_TARGET);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const remaining = cards.length - index;
    if (remaining <= REFILL_TRIGGER) refill(BUFFER_TARGET);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, cards.length]);

  useEffect(() => {
    const remaining = cards.length - index;
    if (remaining >= BUFFER_TARGET) return;
    const timer = setTimeout(() => refill(IDLE_TOPUP_COUNT), IDLE_TOPUP_MS);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, cards.length]);

  function advance() {
    const hasNext = index + 1 < cards.length;
    if (!hasNext) {
      setPendingMessage("On prépare la suite, patiente un instant…");
      setTimeout(() => setPendingMessage(null), 1800);
      return;
    }
    setIndex((i) => i + 1);
  }

  function goBack() {
    setIndex((i) => Math.max(0, i - 1));
  }

  return { cards, index, advance, goBack, pendingMessage };
}