import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import { generateMockBatch } from "@/lib/mock-cards";
import type { Card } from "@/types/card";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const CATEGORIES = ["RÉSEAU", "SÉCURITÉ", "DONNÉES", "SYSTÈME", "ARCHITECTURE", "LANGAGE"] as const;

const responseSchema = {
  type: "object",
  properties: {
    cards: {
      type: "array",
      items: {
        type: "object",
        properties: {
          categorie: { type: "string", enum: [...CATEGORIES] },
          titre: { type: "string" },
          tldr: { type: "string" },
          analogie: { type: "string" },
          cas_usage: { type: "string" },
          exemple_code: { type: "string" },
        },
        required: ["categorie", "titre", "tldr", "analogie", "cas_usage", "exemple_code"],
      },
    },
  },
  required: ["cards"],
} as const;

function buildPrompt(count: number, exclude: string[]) {
  const excludeBlock = exclude.length
    ? `\n\nNe génère AUCUN des concepts suivants, déjà couverts récemment (explore vraiment autre chose) : ${exclude.join(", ")}.`
    : "";

  return `Tu es un rédacteur pédagogique spécialisé en informatique, tu écris pour une app de micro-learning façon TikTok.

Génère exactement ${count} fiches, chacune sur UN concept informatique différent. Couvre un spectre large : réseau, sécurité, bases de données, systèmes/infra, architecture logicielle (design patterns, architecture hexagonale, multi-tenant, PWA, bundlers...), langages et bas-niveau (compilation, pointeurs, typage...), conteneurisation, etc. Varie vraiment les sujets, ne reste pas sur les grands classiques déjà très utilisés (webhook, API REST, cache, VPS, DNS, SSH).

Contraintes strictes pour chaque fiche :
- categorie : uniquement l'une de ces valeurs : ${CATEGORIES.join(", ")}
- titre : le nom du concept, 2-4 mots max
- tldr : explication claire et complète du concept, en une phrase dense (35-50 mots), sans jargon non expliqué
- analogie : comparaison concrète et parlante du quotidien (25-40 mots)
- cas_usage : exemple d'usage réel, précis, avec un contexte (25-35 mots)
- exemple_code : extrait de code ou de commande court (2-5 lignes), réaliste, syntaxiquement correct, avec un commentaire si utile

Toutes les fiches doivent porter sur des concepts DIFFÉRENTS entre eux dans cette même génération. Écris en français, sois techniquement exact, ne simplifie jamais au point de dire quelque chose de faux.${excludeBlock}`;
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const count = typeof body.count === "number" ? body.count : 10;
  const exclude: string[] = Array.isArray(body.exclude) ? body.exclude.slice(0, 40) : [];

  if (!process.env.GEMINI_API_KEY) {
    await new Promise((r) => setTimeout(r, 400));
    return NextResponse.json({ cards: generateMockBatch(count) });
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: buildPrompt(count, exclude),
      config: {
        responseMimeType: "application/json",
        responseSchema,
        temperature: 1.1,
      },
    });

    const parsed = JSON.parse(response.text ?? "{}") as { cards?: Omit<Card, "id">[] };
    const rawCards = parsed.cards ?? [];
    if (rawCards.length === 0) throw new Error("Réponse IA vide");

    const cards: Card[] = rawCards.map((c, i) => ({
      ...c,
      id: `${Date.now()}-${i}-${Math.random().toString(36).slice(2, 7)}`,
    }));

    return NextResponse.json({ cards });
  } catch (err) {
    // on ne casse jamais le buffer côté front : on sert du mock en secours au lieu de err. 500 (Rate limit, erreur réseau, JSON invalide...)
    console.error("Erreur génération IA:", err);
    return NextResponse.json({ cards: generateMockBatch(count) });
  }
}
