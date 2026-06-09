# RdvSante - Projet Étudiant

## Instructions d'Installation Rapide

### Prérequis
- Node.js 18+
- MySQL 8.0+
- React Native CLI

### Installation

#### Backend
```bash
cd backend
npm install
```

#### Configuration
1. Copier `config.env.example` vers `config.env`
2. Configurer les variables MySQL et JWT
3. Créer la base de données `centre_sante`
4. Importer `database/schema.sql`

#### Démarrage
```bash
npm run dev
```

#### Mobile
```bash
cd mobile
npm install
npx react-native run-android
```

### Comptes de test
- **Admin** : superadmin@centresante.com / admin456
- **Patient** : créer via l'application

### Fonctionnalités principales
- Gestion de rendez-vous médicaux
- Système d'annonces communautaires
- Dashboard administrateur
- Notifications automatiques

### Architecture
- **Backend** : Node.js + Express + MySQL
- **Mobile** : React Native + TypeScript
- **Auth** : JWT + bcrypt
- **API** : RESTful avec validation

---
*Projet développé dans le cadre de [votre cours]*
