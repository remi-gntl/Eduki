"use client";

import { ArrowRight } from "lucide-react";
import { CATEGORY_COLORS } from "@/types/card";

export default function Landing({ onStart }: { onStart: () => void }) {
  return (
    <div className="h-full flex flex-col px-6 pt-8 pb-8 overflow-y-auto">
      <div className="flex items-center justify-between mb-10">
        <span className="font-display text-[20px] font-bold" style={{ color: "#F6F3EA" }}>
          edu<span style={{ color: "#E8483A" }}>ki</span>
        </span>
        <span
          className="font-mono text-[10px] tracking-widest px-2 py-1 rounded"
          style={{ border: "1px solid #F6F3EA33", color: "#F6F3EA88" }}
        >
          BETA
        </span>
      </div>

      <h1 className="font-display text-[34px] font-bold leading-[1.08] mb-4" style={{ color: "#F6F3EA" }}>
        L&apos;informatique,
        <br />
        en <span style={{ color: "#E8483A" }}>fiches</span>.
      </h1>
      <p className="text-[14px] leading-relaxed mb-8" style={{ color: "#B9B6AC" }}>
        Swipe. Apprends. Retiens. Des fiches générées par IA sur le code, le réseau, la data —
        pensées pour tenir dans une pause café.
      </p>

      <div className="relative h-44 mb-10 overflow-hidden">
        {[
          { rot: -8, cat: "RÉSEAU" as const, top: 20 },
          { rot: 4, cat: "SÉCURITÉ" as const, top: 8 },
          { rot: -2, cat: "DONNÉES" as const, top: 0 },
        ].map((c, i) => (
          <div
            key={i}
            className="absolute left-1/2 rounded-xl"
            style={{
              width: "164px",
              height: "102px",
              background: "#17181D",
              border: "1px solid #2C2E3A",
              transform: `translateX(-50%) translateY(${c.top}px) rotate(${c.rot}deg)`,
              zIndex: i,
            }}
          >
            <div
              className="absolute -top-2.5 left-4 px-2 py-0.5 font-mono text-[8px] tracking-wider"
              style={{ background: CATEGORY_COLORS[c.cat].bg, color: CATEGORY_COLORS[c.cat].text }}
            >
              {c.cat}
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={onStart}
        className="w-full py-3.5 rounded-full flex items-center justify-center gap-2 font-medium text-[14px] mb-2.5"
        style={{ background: "#E8483A", color: "#F6F3EA" }}
      >
        Commencer <ArrowRight size={16} />
      </button>
      <p className="text-center font-mono text-[10px] mb-8" style={{ color: "#F6F3EA55" }}>
        Aucun compte. Aucune app à installer.
      </p>

      <div className="mt-auto">
        {[
          { n: "01", t: "Glisse vers le haut", d: "carte suivante, comme un fil" },
          { n: "02", t: "Glisse à droite", d: "direction tes favoris" },
          { n: "03", t: "Généré à la volée", d: "l'IA écrit la suite pendant que tu lis" },
        ].map((f, i) => (
          <div key={i} className="flex gap-3 py-3" style={{ borderTop: "1px solid #F6F3EA1A" }}>
            <span className="font-mono text-[11px] pt-0.5" style={{ color: "#E8483A" }}>
              {f.n}
            </span>
            <div>
              <p className="text-[13px] font-medium" style={{ color: "#F6F3EA" }}>
                {f.t}
              </p>
              <p className="text-[12px]" style={{ color: "#8D8F97" }}>
                {f.d}
              </p>
            </div>
          </div>
        ))}
      </div>

      <p className="font-mono text-[10px] text-center mt-6" style={{ color: "#F6F3EA33" }}>
        eduki — Fait par Rémi Gentil
      </p>
    </div>
  );
}
