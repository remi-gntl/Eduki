"use client";

import { useState } from "react";
import Landing from "@/components/Landing";
import CardStack from "@/components/CardStack";
import FavoritesList from "@/components/FavoritesList";
import { useCardBuffer } from "@/hooks/useCardBuffer";

type View = "landing" | "cards" | "favorites";

export default function Home() {
  const [view, setView] = useState<View>("landing");
  const { cards, index, advance, goBack, pendingMessage } = useCardBuffer();

  return (
    <main className="h-dvh w-full overflow-hidden flex justify-center" style={{ background: "#0B0C10" }}>
      <div className="w-full max-w-md h-full">
        {view === "landing" && <Landing onStart={() => setView("cards")} />}
        {view === "cards" && (
          <CardStack
            cards={cards}
            index={index}
            onAdvance={advance}
            onPrevious={goBack}
            onBack={() => setView("landing")}
            onOpenFavorites={() => setView("favorites")}
            pendingMessage={pendingMessage}
          />
        )}
        {view === "favorites" && <FavoritesList onBack={() => setView("cards")} />}
      </div>
    </main>
  );
}