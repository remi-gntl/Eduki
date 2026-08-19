"use client";

import { Lightbulb, Target } from "lucide-react";
import type { Card as CardType } from "@/types/card";
import { CATEGORY_COLORS } from "@/types/card";

export default function CardFace({ card, center = true }: { card: CardType; center?: boolean }) {
  const color = CATEGORY_COLORS[card.categorie];

  return (
    <div className={`min-h-full flex flex-col px-6 py-7 ${center ? "justify-center" : ""}`}>
      <span
        className="inline-block px-2.5 py-1 rounded-full text-[10px] font-semibold tracking-wide mb-5 self-start"
        style={{ background: `${color.bg}22`, color: color.bg, fontFamily: "'JetBrains Mono',monospace" }}
      >
        {card.categorie}
      </span>

      <h2 className="font-display text-[30px] font-bold leading-tight mb-5" style={{ color: "#F6F3EA" }}>
        {card.titre}
      </h2>

      <div className="mb-6 pl-4" style={{ borderLeft: `3px solid ${color.bg}` }}>
        <p className="text-[16.5px] leading-snug font-medium" style={{ color: "#F6F3EA" }}>
          {card.tldr}
        </p>
      </div>

      <IconField icon={Lightbulb} text={card.analogie} />
      <IconField icon={Target} text={card.cas_usage} />

      <div className="rounded-xl overflow-hidden mt-2" style={{ background: "#0D0E12" }}>
        <div className="flex items-center gap-1.5 px-3 py-2" style={{ background: "#16171D" }}>
          <span className="w-2 h-2 rounded-full" style={{ background: "#E8483A55" }} />
          <span className="w-2 h-2 rounded-full" style={{ background: "#F0A63B55" }} />
          <span className="w-2 h-2 rounded-full" style={{ background: "#C3F53B55" }} />
        </div>
        <pre
          className="px-3.5 py-3 text-[12px] whitespace-pre-wrap leading-relaxed overflow-x-auto"
          style={{ fontFamily: "'JetBrains Mono',monospace", color: "#C3F53B" }}
        >
          {card.exemple_code}
        </pre>
      </div>
    </div>
  );
}

function IconField({ icon: Icon, text }: { icon: typeof Lightbulb; text: string }) {
  return (
    <div className="flex gap-3 mb-5">
      <div
        className="mt-0.5 shrink-0 w-6 h-6 rounded-full flex items-center justify-center"
        style={{ background: "#F6F3EA14" }}
      >
        <Icon size={12} color="#F6F3EA99" />
      </div>
      <p className="text-[14.5px] leading-relaxed" style={{ color: "#DDD9CE" }}>
        {text}
      </p>
    </div>
  );
}
