# Application de Questions et Réponses en Temps Réel

Cette application permet de créer des événements, d'ajouter des questions et des réponses, avec une synchronisation en temps réel entre tous les clients connectés.

## Fonctionnalités

- Création d'événements avec titre et description
- Ajout de questions à un événement
- Système de likes pour les questions
- Ajout de réponses aux questions
- Synchronisation en temps réel entre tous les clients
- Interface utilisateur moderne et responsive

## Technologies Utilisées

- Frontend :
  - React avec TypeScript
  - Redux Toolkit pour la gestion d'état
  - Material-UI pour l'interface utilisateur
  - Socket.IO Client pour la communication en temps réel

- Backend :
  - Node.js avec Express
  - Socket.IO pour la communication en temps réel
  - TypeScript pour le typage statique

## Installation

1. Cloner le repository :
```bash
git clone <repository-url>
cd <repository-name>
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

1. Démarrer le serveur :
```bash
cd server
yarn start
```

2. Démarrer le client :
```bash
cd client
npm run dev
```

L'application sera accessible à l'adresse : http://localhost:5173

## Utilisation

1. Créer un événement :
   - Cliquez sur "Create Event"
   - Remplissez le titre et la description
   - Cliquez sur "Create"

2. Ajouter une question :
   - Sélectionnez un événement
   - Entrez votre question dans le champ de texte
   - Cliquez sur "Add Question"

3. Voter pour une question :
   - Cliquez sur le bouton "Like" à côté d'une question
   - Le nombre de likes sera mis à jour en temps réel

4. Répondre à une question :
   - Cliquez sur une question pour voir ses détails
   - Entrez votre réponse dans le champ de texte
   - Cliquez sur "Submit Answer"

## Structure du Projet

```
.
├── client/                 # Application frontend
│   ├── src/
│   │   ├── components/    # Composants React
│   │   ├── slices/        # Redux slices
│   │   ├── middleware/    # Middleware Redux
│   │   └── types.ts       # Types TypeScript
│   └── package.json
│
└── server/                 # Serveur backend
    ├── src/
    │   ├── index.ts       # Point d'entrée
    │   └── types.ts       # Types TypeScript
    └── package.json
```

## Contribution

Les contributions sont les bienvenues ! N'hésitez pas à :
1. Fork le projet
2. Créer une branche pour votre fonctionnalité
3. Commiter vos changements
4. Pousser vers la branche
5. Ouvrir une Pull Request

## Licence

Ce projet est sous licence MIT. Voir le fichier LICENSE pour plus de détails. 