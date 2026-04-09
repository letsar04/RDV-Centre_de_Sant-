# Documentation RdvSante

## Table des matières

1. [Présentation](#présentation)
2. [Architecture Technique](#architecture-technique)
3. [Installation](#installation)
4. [Configuration](#configuration)
5. [Base de Données](#base-de-données)
6. [API Documentation](#api-documentation)
7. [Déploiement](#déploiement)
8. [Maintenance](#maintenance)

---

## Présentation

RdvSante est une plateforme complète de gestion de rendez-vous médicaux avec système de notifications et espace d'annonces communautaires.

### Fonctionnalités principales

#### Patients
- Prise de rendez-vous en ligne
- Consultation des disponibilités des médecins
- Gestion du profil personnel
- Annulation de rendez-vous
- Consultation des annonces communautaires
- Notifications automatiques

#### Administrateurs
- Dashboard avec statistiques
- Gestion des médecins et disponibilités
- Validation des rendez-vous
- Gestion des annonces communautaires
- Accès aux données globales

#### Annonces Communautaires
- Don de sang
- Recherche de patients
- Autres annonces médicales
- Filtrage par type et urgence

---

## Architecture Technique

### Vue d'ensemble

```
RdvSante/
|
+-- backend/                 # API Node.js/Express
|   +-- controllers/         # Logique métier
|   +-- models/             # Modèles de données
|   +-- routes/             # Routes API
|   +-- middleware/         # Authentification
|   +-- database/           # Schéma SQL
|   +-- config.env          # Variables environnement
|
+-- mobile/                 # Application React Native
|   +-- src/
|   |   +-- screens/        # Écrans de l'application
|   |   +-- components/     # Composants réutilisables
|   |   +-- navigation/     # Navigation
|   |   +-- api/           # Client API
|   |   +-- context/       # Contexte global
|   |   +-- utils/         # Utilitaires
|
+-- docs/                   # Documentation
```

### Technologies

#### Backend
- **Node.js 18+** : Runtime JavaScript
- **Express.js** : Framework web
- **MySQL** : Base de données relationnelle
- **JWT** : Authentification par tokens
- **bcryptjs** : Hashage des mots de passe
- **express-validator** : Validation des données
- **nodemon** : Développement (auto-reload)

#### Mobile
- **React Native 0.84.0** : Framework cross-platform
- **TypeScript** : Typage statique
- **React Navigation** : Navigation
- **Axios** : Client HTTP
- **AsyncStorage** : Stockage local
- **Vector Icons** : Icônes

#### Base de Données
- **MySQL 8.0+** : SGBD relationnel
- **5 tables** avec relations foreign key
- **Index optimisés** pour les performances

---

## Installation

### Prérequis

- Node.js 18+
- MySQL 8.0+
- React Native CLI
- Android Studio (pour Android)
- Xcode (pour iOS)

### Installation Backend

```bash
# Cloner le projet
git clone <repository-url>
cd RdvSante/backend

# Installer les dépendances
npm install

# Configurer les variables d'environnement
cp config.env.example config.env
# Éditer config.env avec vos informations

# Créer la base de données
mysql -u root -p < database/schema.sql
mysql -u root -p < database/seed.sql

# Démarrer le serveur
npm run dev
```

### Installation Mobile

```bash
# Naviguer vers le dossier mobile
cd ../mobile

# Installer les dépendances
npm install

# Pour Android
npx react-native run-android

# Pour iOS
npx react-native run-ios
```

---

## Configuration

### Variables d'environnement (backend/config.env)

```env
# Base de données
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=votre_mot_de_passe
DB_NAME=rdvsante

# JWT
JWT_SECRET=votre_secret_jwt_tres_long_et_securise
JWT_EXPIRES_IN=7d

# Serveur
PORT=5000
NODE_ENV=development
```

### Configuration API (mobile/src/api/axios.js)

```javascript
const baseURL = 'http://10.0.2.2:5000/api'; // Émulateur Android
// const baseURL = 'http://localhost:5000/api'; // Développement
// const baseURL = 'https://votre-domaine.com/api'; // Production
```

---

## Base de Données

### Schéma des tables

#### users
```sql
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(20),
  password VARCHAR(255) NOT NULL,
  role ENUM('patient', 'admin') DEFAULT 'patient',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### doctors
```sql
CREATE TABLE doctors (
  id INT AUTO_INCREMENT PRIMARY KEY,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  specialty VARCHAR(100) NOT NULL,
  phone VARCHAR(20),
  email VARCHAR(255),
  image_url VARCHAR(500),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### appointments
```sql
CREATE TABLE appointments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  patient_id INT NOT NULL,
  doctor_id INT NOT NULL,
  date DATE NOT NULL,
  time TIME NOT NULL,
  status ENUM('pending', 'confirmed', 'cancelled', 'completed') DEFAULT 'pending',
  reason TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (patient_id) REFERENCES users(id),
  FOREIGN KEY (doctor_id) REFERENCES doctors(id)
);
```

#### availabilities
```sql
CREATE TABLE availabilities (
  id INT AUTO_INCREMENT PRIMARY KEY,
  doctor_id INT NOT NULL,
  day_of_week ENUM(1,2,3,4,5,6,7) NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  FOREIGN KEY (doctor_id) REFERENCES doctors(id),
  UNIQUE(doctor_id, day_of_week)
);
```

#### announcements
```sql
CREATE TABLE announcements (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  type ENUM('blood_donation', 'patient_search', 'other') NOT NULL,
  author VARCHAR(255) NOT NULL,
  author_email VARCHAR(255) NOT NULL,
  location VARCHAR(255),
  blood_type VARCHAR(10),
  urgency ENUM('low', 'medium', 'high') DEFAULT 'medium',
  contact VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## API Documentation

### Authentification (/api/auth)

#### POST /auth/register
Inscription d'un patient

**Body:**
```json
{
  "first_name": "Jean",
  "last_name": "Dupont",
  "email": "jean.dupont@email.com",
  "phone": "0123456789",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Patient créé avec succès",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### POST /auth/login
Connexion utilisateur

**Body:**
```json
{
  "email": "jean.dupont@email.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Connexion réussie",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "first_name": "Jean",
    "last_name": "Dupont",
    "email": "jean.dupont@email.com",
    "role": "patient"
  }
}
```

#### GET /auth/profile
Profil utilisateur (authentifié)

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "user": {
    "id": 1,
    "first_name": "Jean",
    "last_name": "Dupont",
    "email": "jean.dupont@email.com",
    "phone": "0123456789",
    "role": "patient"
  }
}
```

### Médecins (/api/doctors)

#### GET /doctors
Liste de tous les médecins

**Response:**
```json
{
  "success": true,
  "doctors": [
    {
      "id": 1,
      "first_name": "Dr. Martin",
      "last_name": "Durand",
      "specialty": "Cardiologie",
      "phone": "0123456789",
      "email": "dr.durand@email.com",
      "image_url": "https://example.com/image.jpg"
    }
  ]
}
```

#### GET /doctors/:id
Détails d'un médecin

#### GET /doctors/:id/availabilities
Disponibilités d'un médecin

### Rendez-vous (/api/appointments)

#### POST /appointments
Créer un rendez-vous (patient)

**Body:**
```json
{
  "doctor_id": 1,
  "date": "2024-12-25",
  "time": "14:30",
  "reason": "Consultation générale"
}
```

#### GET /appointments/my
Rendez-vous du patient connecté

#### GET /appointments/stats
Statistiques globales (admin)

#### PUT /appointments/:id/status
Mettre à jour le statut (admin)

**Body:**
```json
{
  "status": "confirmed"
}
```

### Disponibilités (/api/availabilities)

#### GET /availabilities
Toutes les disponibilités

#### POST /availabilities
Ajouter une disponibilité (admin)

**Body:**
```json
{
  "doctor_id": 1,
  "day_of_week": 1,
  "start_time": "09:00",
  "end_time": "17:00"
}
```

#### PUT /availabilities/:id
Modifier une disponibilité (admin)

#### DELETE /availabilities/:id
Supprimer une disponibilité (admin)

### Annonces (/api/announcements)

#### GET /announcements/public
Annonces publiques (patients)

**Query Parameters:**
- `type`: blood_donation | patient_search | other
- `search`: terme de recherche

#### GET /announcements
Toutes les annonces (admin)

#### POST /announcements
Créer une annonce (admin)

**Body:**
```json
{
  "title": "Don de sang O- urgent",
  "description": "Besoin urgent de donneurs de sang O-",
  "type": "blood_donation",
  "author": "Dr. Martin",
  "author_email": "dr.martin@email.com",
  "location": "Hôpital Central",
  "blood_type": "O-",
  "urgency": "high",
  "contact": "0123456789"
}
```

#### PUT /announcements/:id
Modifier une annonce (admin)

#### DELETE /announcements/:id
Supprimer une annonce (admin)

#### GET /announcements/stats
Statistiques des annonces (admin)

### Middleware

#### auth
Vérification du token JWT

```javascript
// Headers requis
Authorization: Bearer <token>
```

#### adminAuth
Vérification du rôle administrateur

#### Validation
Toutes les routes utilisent express-validator pour la validation des entrées.

---

## Déploiement

### Production Backend

```bash
# Installation des dépendances de production
npm install --production

# Configuration des variables d'environnement
export NODE_ENV=production
export PORT=5000

# Démarrage avec PM2 (process manager)
npm install -g pm2
pm2 start server.js --name "rdvsante-api"
```

### Configuration NGINX

```nginx
server {
    listen 80;
    server_name votre-domaine.com;

    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### Build Mobile

```bash
# Android
cd mobile
npx react-native build-android --mode=release

# iOS
npx react-native build-ios --mode=Release
```

---

## Maintenance

### Sauvegarde Base de Données

```bash
# Sauvegarde quotidienne
mysqldump -u root -p rdvsante > backup_$(date +%Y%m%d).sql

# Restauration
mysql -u root -p rdvsante < backup_20241225.sql
```

### Monitoring

#### Logs Backend
```bash
# Logs PM2
pm2 logs rdvsante-api

# Logs système
tail -f /var/log/nginx/error.log
```

#### Health Check
```bash
# Vérifier le statut de l'API
curl http://localhost:5000/api/health
```

### Mises à jour

#### Backend
```bash
# Pull des modifications
git pull origin main

# Mise à jour des dépendances
npm update

# Redémarrage du service
pm2 restart rdvsante-api
```

#### Migration Base de Données
```bash
# Appliquer les migrations
mysql -u root -p rdvsante < database/migrations/v1.1.0.sql
```

### Sécurité

- **Mots de passe** : Hashage avec bcryptjs
- **Tokens JWT** : Expiration 7 jours
- **HTTPS** : Obligatoire en production
- **CORS** : Configuration restrictive
- **Rate limiting** : Limiter les requêtes API
- **Input validation** : Validation stricte des données

---

## Support

### Problèmes courants

#### Erreur de connexion à la base de données
- Vérifier les identifiants MySQL
- Confirmer que le service MySQL est démarré
- Vérifier les permissions utilisateur

#### Erreur token JWT
- Vérifier la variable JWT_SECRET
- Confirmer l'expiration du token
- Nettoyer le stockage local sur mobile

#### Erreur réseau mobile
- Vérifier l'URL de l'API dans axios.js
- Confirmer la connectivité réseau
- Vérifier les pare-feux

### Contact

Pour toute question technique ou demande de support :
- Email : support@rdvsante.com
- Documentation : https://docs.rdvsante.com
- Issues GitHub : https://github.com/rdvsante/issues

---

*Document version 1.0 - Dernière mise à jour : Décembre 2024*
