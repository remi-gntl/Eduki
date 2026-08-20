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
          signification: { type: "string" },
          tldr: { type: "string" },
          analogie: { type: "string" },
          cas_usage: { type: "string" },
          schema: {
            type: "array",
            items: { type: "string" },
          },
        },
        required: ["categorie", "titre", "tldr", "analogie", "cas_usage", "schema"],
      },
    },
  },
  required: ["cards"],
} as const;

function buildPrompt(count: number, exclude: string[]) {
  const excludeBlock = exclude.length
    ? `\n\nÉvite de reprendre ces concepts déjà vus récemment : ${exclude.join(", ")}. Tu peux tout à fait rester sur des notions connues et concrètes — il n'est pas nécessaire de chercher des sujets rares pour varier.`
    : "";

  return `Tu es un rédacteur pédagogique spécialisé en informatique, tu écris pour une app de micro-learning façon TikTok destinée à des développeurs débutants à intermédiaires.

Génère exactement ${count} fiches, chacune sur UN concept informatique différent. Reste sur des concepts CONNUS et RÉELS, de ceux qu'on croise vraiment en développement web/logiciel courant — jamais de sujets de recherche, de jargon ultra spécialisé ou de termes obscurs. Exemples du niveau attendu (inspire-toi de ce type de sujets, sans forcément les reprendre) : webhook, API REST, VPS, DNS, SSH, cache, NoSQL, ORM, JWT, CORS, conteneur/Docker, load balancer, design pattern, architecture hexagonale, PWA, pointeur, langage compilé vs interprété, bundler.

Couvre un spectre large entre ces domaines : réseau, sécurité, bases de données, systèmes/infra, architecture logicielle, langages. Mais privilégie toujours la clarté et la notoriété du concept à l'originalité du choix — mieux vaut un classique bien expliqué qu'un terme que personne n'a jamais entendu.

Contraintes strictes pour chaque fiche :
- categorie : uniquement l'une de ces valeurs : ${CATEGORIES.join(", ")}
- titre : le nom du concept, 2-4 mots max, un terme reconnaissable (pas un néologisme ni un nom obscur)
- signification : si le titre est un sigle ou un acronyme (ex: VPS, SSH, ORM, JWT, CORS, DNS...), écris ce que chaque lettre signifie, au format "VPS = Virtual Private Server". Si le titre n'est PAS un sigle, laisse ce champ vide ("").
- tldr : explication claire et complète du concept, en une phrase dense (35-50 mots), sans jargon non expliqué
- analogie : comparaison concrète et parlante du quotidien (25-40 mots)
- cas_usage : exemple d'usage réel, précis, avec un contexte (25-35 mots)
- schema : un tableau de 3 à 5 étapes COURTES (3-8 mots chacune) qui déroulent visuellement le concept comme un mini schéma (un flux, un processus, ou une décomposition en éléments clés). Exemple pour "DNS" : ["Utilisateur tape eduki.app", "Requête envoyée au DNS", "DNS renvoie l'adresse IP", "Connexion au serveur"]. Chaque étape doit apporter une info concrète, jamais du remplissage.

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
      model: "gemini-3.5-flash-lite",
      contents: buildPrompt(count, exclude),
      config: {
        responseMimeType: "application/json",
        responseSchema,
        temperature: 0.9,
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
    console.error("Erreur génération IA:", err);
    return NextResponse.json({ cards: generateMockBatch(count) });
  }
}