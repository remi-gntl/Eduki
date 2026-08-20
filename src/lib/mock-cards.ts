import type { Card } from "@/types/card";

const POOL: Omit<Card, "id">[] = [
  {
    categorie: "RÉSEAU",
    titre: "Webhook",
    tldr: "Un webhook est une notification HTTP qu'une application envoie automatiquement à une autre dès qu'un événement précis se produit.",
    analogie: "Comme une sonnette : au lieu de vérifier ta porte toutes les 5 minutes, on te prévient quand quelqu'un arrive.",
    cas_usage: "Notifier ton serveur à chaque paiement Stripe reçu.",
    schema: ["Événement se produit (paiement)", "Stripe appelle ton URL", "Ton serveur reçoit les données", "Tu déclenches une action"],
  },
  {
    categorie: "SÉCURITÉ",
    titre: "SSH",
    signification: "SSH = Secure Shell",
    tldr: "SSH chiffre la connexion entre ton terminal et un serveur distant pour l'administrer en toute sécurité.",
    analogie: "Un tunnel privé entre ton clavier et une machine à l'autre bout du monde.",
    cas_usage: "Se connecter à un VPS pour déployer une app.",
    schema: ["Connexion ssh lancée", "Négociation chiffrée", "Authentification", "Session sécurisée ouverte"],
  },
  {
    categorie: "DONNÉES",
    titre: "NoSQL",
    tldr: "Une base NoSQL stocke des données sans schéma rigide de tables, souvent sous forme de documents JSON.",
    analogie: "Un classeur où chaque fiche peut avoir des champs différents, contrairement à un tableau Excel figé.",
    cas_usage: "Stocker des profils utilisateurs aux champs variables.",
    schema: ["Document JSON créé", "Stocké sans schéma fixe", "Interrogé par requête", "Structure libre à tout moment"],
  },
  {
    categorie: "RÉSEAU",
    titre: "API REST",
    tldr: "Une API REST expose des ressources via des URLs et des verbes HTTP standards (GET, POST...).",
    analogie: "Un menu de restaurant : tu commandes par son nom, pas besoin de savoir comment le plat est cuisiné.",
    cas_usage: "Récupérer la liste des produits depuis un e-commerce.",
    schema: ["Client envoie GET /produits", "Serveur traite la requête", "Réponse JSON renvoyée", "Client affiche les données"],
  },
  {
    categorie: "SYSTÈME",
    titre: "Cache",
    tldr: "Le cache garde une copie rapide d'une donnée coûteuse à recalculer ou à récupérer.",
    analogie: "Garder les épices utilisées souvent sur le plan de travail plutôt que dans le placard.",
    cas_usage: "Éviter de recalculer un résultat identique à chaque requête.",
    schema: ["Requête arrive", "Donnée déjà en cache ?", "Oui → réponse instantanée", "Non → calcul puis mise en cache"],
  },
  {
    categorie: "ARCHITECTURE",
    titre: "Design Pattern",
    tldr: "Un design pattern est une solution réutilisable à un problème de conception logicielle récurrent.",
    analogie: "Un plan d'architecte standard pour construire un escalier : la structure est connue, les matériaux changent.",
    cas_usage: "Utiliser le pattern Singleton pour garantir une seule connexion à la base de données.",
    schema: ["Problème récurrent identifié", "Pattern connu choisi", "Structure appliquée au code", "Réutilisable ailleurs"],
  },
  {
    categorie: "LANGAGE",
    titre: "Pointeur",
    tldr: "Un pointeur est une variable qui stocke l'adresse mémoire d'une autre donnée plutôt que la donnée elle-même.",
    analogie: "Une adresse postale : elle ne contient pas la maison, juste l'indication pour la trouver.",
    cas_usage: "Manipuler de grandes structures en C sans les copier en mémoire.",
    schema: ["Variable x = 42 en mémoire", "Pointeur p stocke l'adresse", "*p accède à la valeur", "Modification indirecte possible"],
  },
];

export function generateMockBatch(count: number): Card[] {
  const batch: Card[] = [];
  for (let i = 0; i < count; i++) {
    const base = POOL[Math.floor(Math.random() * POOL.length)];
    batch.push({ ...base, id: `${Date.now()}-${i}-${Math.random().toString(36).slice(2, 7)}` });
  }
  return batch;
}