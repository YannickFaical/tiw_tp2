# TIW8 - Application Q&A en Temps Réel

Une application de Questions & Réponses en temps réel développée avec React, TypeScript et WebSocket.

## Fonctionnalités

- Interface utilisateur moderne et responsive
- Communication en temps réel via WebSocket
- Système de vote pour les questions
- Ajout de nouvelles questions
- Synchronisation automatique entre les clients
- Support mobile et desktop

## Prérequis

- Node.js (v14 ou supérieur)
- npm ou yarn

## Installation

1. Cloner le repository :
```bash
git clone [URL_DU_REPO]
cd tiw8-qa-app
```

2. Installer les dépendances du serveur :
```bash
cd server
npm install
```

3. Installer les dépendances du client :
```bash
cd ../client
npm install
```

## Démarrage

1. Démarrer le serveur WebSocket :
```bash
cd server
npm start
```

2. Dans un autre terminal, démarrer le client :
```bash
cd client
npm run dev
```

3. Ouvrir l'application dans votre navigateur :
- Local : http://localhost:5173
- Réseau : http://[VOTRE_IP]:5173

## Utilisation sur Mobile

Pour accéder à l'application depuis votre téléphone :

1. Assurez-vous que votre téléphone et votre ordinateur sont sur le même réseau WiFi
2. Trouvez l'adresse IP de votre ordinateur :
   - Linux/Mac : `ip addr show | grep "inet " | grep -v 127.0.0.1`
   - Windows : `ipconfig`
3. Ouvrez votre navigateur mobile et accédez à : `http://[VOTRE_IP]:5173`

## Structure du Projet

```
tiw8-qa-app/
├── client/                 # Application React
│   ├── src/
│   │   ├── components/    # Composants React
│   │   ├── context/      # Context React
│   │   └── model.ts      # Types TypeScript
│   └── package.json
└── server/                # Serveur WebSocket
    ├── src/
    │   └── index.ts      # Serveur WebSocket
    └── package.json
```

## Technologies Utilisées

- **Frontend**
  - React
  - TypeScript
  - Tailwind CSS
  - Framer Motion
  - WebSocket

- **Backend**
  - Node.js
  - WebSocket (ws)
  - TypeScript

## Développement

### Commandes Disponibles

- `npm run dev` : Démarre le serveur de développement
- `npm run build` : Compile l'application pour la production
- `npm start` : Démarre le serveur de production

### Structure des Données

```typescript
interface Question {
  id: string
  content: string
  votes: number
  author?: string
  color?: string
}

interface Event {
  id: string
  title: string
  questions: Question[]
}

interface AppState {
  currentEventId: string
  events: Event[]
}
```

## Contribution

1. Fork le projet
2. Créer une branche pour votre fonctionnalité
3. Commiter vos changements
4. Pousser vers la branche
5. Ouvrir une Pull Request

## Licence

MIT 