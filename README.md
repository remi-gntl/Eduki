# Eduki (App de Micro-Learning)

## Le Concept
Eduki est une Progressive Web App (PWA) de micro-learning dédiée à l'informatique, pensée 100% mobile-first. 
L'utilisateur fait défiler des fiches de concepts (ex: Webhook, SSH, NoSQL) générées dynamiquement par IA.
Transformant le "doomscrolling" en "smart-scrolling" ! 

## Stack Technique (V1)
- **Framework** : Next.js (App Router)
- **Styling** : Tailwind CSS
- **Animations / Swipe** : Framer Motion
- **Stockage Local** : Zustand (avec middleware Persist)
- **PWA** : next-pwa
- **Backend / IA** : Next.js Route Handlers + API Gemini/OpenAI

## Installation en local

1. **Cloner le repository**
```bash
git clone <ton-url-github>
cd smart-scroll-app
```

2. **Installer les dépendances**
```bash
npm install
```

3. **Variables d'environnement**
Créer un fichier `.env.local` à la racine et ajouter votre clé API IA :
```env
AI_API_KEY=cle_api_a_renseigner
```

4. **Lancer le serveur de développement**
```bash
npm run dev
```
Ouvrez [http://localhost:3000](http://localhost:3000) dans votre navigateur.

## Architecture (a venir)
- `/src/app` : Les pages (Accueil, Swipe) et routes API.
- `/src/components` : Composants réutilisables (Card, SkeletonLoader).
- `/src/store` : Configuration Zustand pour le LocalStorage.