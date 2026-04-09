# RdvSante - Documentation Technique

## Présentation

RdvSante est une plateforme de gestion de rendez-vous médicaux avec système de notifications et espace d'annonces communautaires.

### Fonctionnalités
- **Patients** : Prise RDV, gestion profil, consultation annonces
- **Admins** : Dashboard, gestion médecins/RDV/annonces
- **Annonces** : Don de sang, recherche patients, autres

---

## Architecture Technique

### Stack Technologique
- **Backend** : Node.js 18+, Express.js, MySQL, JWT
- **Mobile** : React Native 0.84.0, TypeScript
- **Base** : MySQL 8.0+, 5 tables relationnelles

### Structure Projet
```
RdvSante/
+-- backend/          # API Node.js
|   +-- controllers/  # Logique métier
|   +-- models/       # Modèles données
|   +-- routes/       # Routes API
|   +-- database/     # Schéma SQL
+-- mobile/           # React Native
|   +-- screens/      # Écrans
|   +-- components/   # Composants
|   +-- navigation/   # Navigation
```

---

## Installation

### Prérequis
- Node.js 18+
- MySQL 8.0+
- React Native CLI

### Backend
```bash
cd backend
npm install
cp config.env.example config.env
# Configurer variables d'environnement
mysql -u root -p < database/schema.sql
npm run dev
```

### Mobile
```bash
cd mobile
npm install
npx react-native run-android  # ou run-ios
```

---

## Configuration

### Variables d'environnement (config.env)
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=votre_mot_de_passe
DB_NAME=rdvsante
JWT_SECRET=votre_secret_jwt
JWT_EXPIRES_IN=7d
PORT=5000
```

### API Configuration
```javascript
// mobile/src/api/axios.js
const baseURL = 'http://10.0.2.2:5000/api'; // Android
// const baseURL = 'http://localhost:5000/api'; // Dev
```

---

## Base de Données

### Tables principales
- **users** : Patients et administrateurs
- **doctors** : Médecins et spécialités
- **appointments** : Rendez-vous
- **availabilities** : Disponibilités médecins
- **announcements** : Annonces communautaires

### Relations
- users 1:N appointments (patient_id)
- doctors 1:N appointments (doctor_id)
- doctors 1:N availabilities

---

## API Documentation

### Authentification (/api/auth)

#### POST /auth/register
```json
{
  "first_name": "Jean",
  "last_name": "Dupont", 
  "email": "jean@email.com",
  "password": "password123"
}
```

#### POST /auth/login
```json
{
  "email": "jean@email.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "token": "jwt_token_here",
  "user": { "id": 1, "role": "patient" }
}
```

### Médecins (/api/doctors)

#### GET /doctors
Liste de tous les médecins

#### GET /doctors/:id/availabilities  
Disponibilités médecin

### Rendez-vous (/api/appointments)

#### POST /appointments
Créer RDV (patient authentifié)

```json
{
  "doctor_id": 1,
  "date": "2024-12-25",
  "time": "14:30",
  "reason": "Consultation"
}
```

#### GET /appointments/my
RDV du patient connecté

#### PUT /appointments/:id/status
Mettre à jour statut (admin)

### Disponibilités (/api/availabilities)

#### POST /availabilities
Ajouter disponibilité (admin)

```json
{
  "doctor_id": 1,
  "day_of_week": 1,
  "start_time": "09:00", 
  "end_time": "17:00"
}
```

### Annonces (/api/announcements)

#### GET /announcements/public
Annonces publiques (patients)

**Query params:**
- `type`: blood_donation | patient_search | other
- `search`: terme recherche

#### POST /announcements
Créer annonce (admin)

```json
{
  "title": "Don de sang O-",
  "description": "Besoin urgent",
  "type": "blood_donation",
  "author": "Dr. Martin",
  "urgency": "high",
  "contact": "0123456789"
}
```

### Middleware
- **auth** : Vérification token JWT
- **adminAuth** : Vérification rôle admin
- **validation** : Validation express-validator

---

## Déploiement

### Production Backend
```bash
npm install --production
pm2 start server.js --name "rdvsante-api"
```

### NGINX Configuration
```nginx
location /api {
    proxy_pass http://localhost:5000;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
}
```

### Build Mobile
```bash
# Android
npx react-native build-android --mode=release

# iOS  
npx react-native build-ios --mode=Release
```

---

## Maintenance

### Sauvegarde BD
```bash
mysqldump -u root -p rdvsante > backup_$(date +%Y%m%d).sql
```

### Monitoring
```bash
pm2 logs rdvsante-api
curl http://localhost:5000/api/health
```

### Sécurité
- Mots de passe hashés (bcryptjs)
- Tokens JWT (7 jours expiration)
- HTTPS obligatoire en production
- Validation stricte des entrées
- Rate limiting API

---

## Support

### Problèmes courants
- **Connexion BD** : Vérifier identifiants MySQL
- **Token JWT** : Vérifier JWT_SECRET et expiration
- **Réseau mobile** : Vérifier URL API et connectivité

### Contact
- Email : support@rdvsante.com
- Docs : https://docs.rdvsante.com
- Issues : https://github.com/rdvsante/issues

---

*Version 1.0 - Décembre 2024*
