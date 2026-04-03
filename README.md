# RdvSante - Plateforme de Gestion de Rendez-vous Médicaux

RdvSante est une application mobile complète conçue pour faciliter la prise de rendez-vous entre patients et médecins d'un centre de santé. Elle offre une interface fluide pour les patients et un tableau de bord de supervision pour les administrateurs.

## 🚀 Technologies Utilisées

### Backend
- **Node.js & Express** : Serveur d'API robuste et rapide.
- **MySQL** : Base de données relationnelle pour une gestion intègre des données.
- **Bcryptjs** : Hachage sécurisé des mots de passe.
- **JWT (JSON Web Tokens)** : Authentification sécurisée des utilisateurs.

### Frontend (Mobile)
- **React Native (CLI)** : Pour une expérience utilisateur native et performante.
- **TypeScript** : Pour un code plus sûr et mieux documenté.
- **Axios** : Gestion des requêtes API avec intercepteurs pour l'authentification.
- **React Navigation** : Système de navigation fluide (Stacks & Tabs).

## ✨ Fonctionnalités Principales

### 👤 Module Patient
- **Authentification** : Création de compte et connexion sécurisée.
- **Profil** : Gestion des informations personnelles et changement de mot de passe.
- **Recherche** : Consultation de la liste des médecins et de leurs spécialités.
- **Rendez-vous** :
  - Prise de rendez-vous en ligne.
  - Consultation de l'historique des rendez-vous.
  - Annulation et report de rendez-vous.
  - Visualisation du prochain rendez-vous confirmé sur l'accueil.

### 🔑 Module Administrateur
- **Tableau de Bord** : 
  - Statistiques en temps réel (Total RDV, En attente, Confirmés, Annulés).
  - Liste des médecins disponibles aujourd'hui.
- **Gestion des RDV** : Confirmation ou refus des demandes de rendez-vous des patients.

## 🛠️ Installation et Configuration

### Prérequis
- Node.js (v18+)
- MySQL Server
- Android Studio (pour l'émulateur)

### Configuration Backend
1. Naviguer dans le dossier `backend`.
2. Installer les dépendances : `npm install`.
3. Configurer le fichier `.env` avec vos accès MySQL.
4. Initialiser la base de données avec `database/schema.sql` et `database/seed.sql`.
5. Lancer le serveur : `npm run dev`.

### Configuration Mobile
1. Naviguer dans le dossier `mobile`.
2. Installer les dépendances : `npm install`.
3. (Android) Lancer l'émulateur.
4. Lancer l'application : `npx react-native run-android`.

## 📁 Structure du Projet

```text
RdvSante/
├── backend/                # API Node.js
│   ├── config/             # Configuration BD
│   ├── controllers/        # Logique métier
│   ├── models/             # Modèles de données (SQL)
│   ├── routes/             # Points d'entrée API
│   └── server.js           # Point d'entrée serveur
└── mobile/                 # Application React Native
    ├── src/
    │   ├── api/            # Client Axios
    │   ├── components/     # Composants réutilisables
    │   ├── context/        # Gestion d'état (Auth)
    │   ├── navigation/     # Configuration des routes
    │   └── screens/        # Écrans de l'application
    └── App.tsx             # Composant racine
```

---
*Projet développé dans le cadre d'un cursus scolaire - Centre de Santé RdvSante.*
