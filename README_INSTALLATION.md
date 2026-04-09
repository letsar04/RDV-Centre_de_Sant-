# RdvSante - Installation Rapide

## Installation en 5 minutes

### 1. Prérequis
```bash
# Vérifier Node.js
node --version  # >= 18.0

# Vérifier MySQL
mysql --version

# Vérifier React Native CLI
npx react-native --version
```

### 2. Backend
```bash
cd backend
npm install

# Configurer l'environnement
cp config.env.example config.env
# Éditer config.env avec vos identifiants MySQL

# Créer la base de données
mysql -u root -p < database/schema.sql

# Démarrer le serveur
npm run dev
```

### 3. Mobile
```bash
cd mobile
npm install

# Android
npx react-native run-android

# iOS
npx react-native run-ios
```

### 4. Test rapide
- **Admin** : superadmin@centresante.com / admin456
- **Patient** : Créer un compte via l'application

## Configuration Express

### Variables d'environnement essentielles
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=votre_mot_de_passe
DB_NAME=rdvsante
JWT_SECRET=votre_secret_jwt
JWT_EXPIRES_IN=7d
```

### URL API (mobile/src/api/axios.js)
```javascript
const baseURL = 'http://10.0.2.2:5000/api'; // Android
```

## Fonctionnalités Test

### Patient
- [x] Connexion/Inscription
- [x] Prise de rendez-vous
- [x] Consultation annonces
- [x] Gestion profil

### Admin
- [x] Dashboard statistiques
- [x] Gestion médecins
- [x] Validation RDV
- [x] Gestion annonces

## Support

Pour l'installation complète, voir [DOCUMENTATION.md](./DOCUMENTATION.md)

Problèmes ? Contactez support@rdvsante.com
