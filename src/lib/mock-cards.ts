import type { Card } from "@/types/card";

const POOL: Omit<Card, "id">[] = [
  {
    categorie: "RÉSEAU",
    titre: "Webhook",
    tldr: "Un webhook, c'est une notification HTTP qu'une app envoie à une autre dès qu'un événement se produit.",
    analogie: "Comme une sonnette : au lieu de vérifier ta porte toutes les 5 minutes, on te prévient quand quelqu'un arrive.",
    cas_usage: "Notifier ton serveur à chaque paiement Stripe reçu.",
    exemple_code: 'POST /webhook\n{ "event": "payment.success" }',
  },
  {
    categorie: "SÉCURITÉ",
    titre: "SSH",
    tldr: "SSH chiffre la connexion entre ton terminal et un serveur distant pour l'administrer en toute sécurité.",
    analogie: "Un tunnel privé entre ton clavier et une machine à l'autre bout du monde.",
    cas_usage: "Se connecter à un VPS pour déployer une app.",
    exemple_code: "ssh user@192.168.1.10",
  },
  {
    categorie: "DONNÉES",
    titre: "NoSQL",
    tldr: "Une base NoSQL stocke des données sans schéma rigide de tables, souvent sous forme de documents JSON.",
    analogie: "Un classeur où chaque fiche peut avoir des champs différents, contrairement à un tableau Excel figé.",
    cas_usage: "Stocker des profils utilisateurs aux champs variables.",
    exemple_code: 'db.users.insertOne({ name: "Rui" })',
  },
  {
    categorie: "RÉSEAU",
    titre: "API REST",
    tldr: "Une API REST expose des ressources via des URLs et des verbes HTTP standards (GET, POST...).",
    analogie: "Un menu de restaurant : tu commandes par son nom, pas besoin de savoir comment le plat est cuisiné.",
    cas_usage: "Récupérer la liste des produits depuis un e-commerce.",
    exemple_code: "GET /api/products/42",
  },
  {
    categorie: "SYSTÈME",
    titre: "Cache",
    tldr: "Le cache garde une copie rapide d'une donnée coûteuse à recalculer ou à récupérer.",
    analogie: "Garder les épices utilisées souvent sur le plan de travail plutôt que dans le placard.",
    cas_usage: "Éviter de recalculer un résultat identique à chaque requête.",
    exemple_code: 'cache.set("user:42", data, ttl=60)',
  },
];

// Génère `count` cartes avec des ids uniques, en piochant dans le pool
// À remplacer par un vrai appel IA dans la route la signature ne changera pas
export function generateMockBatch(count: number): Card[] {
  const batch: Card[] = [];
  for (let i = 0; i < count; i++) {
    const base = POOL[Math.floor(Math.random() * POOL.length)];
    batch.push({ ...base, id: `${Date.now()}-${i}-${Math.random().toString(36).slice(2, 7)}` });
  }
  return batch;
}
