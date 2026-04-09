const express = require('express');
const { body } = require('express-validator');
const auth = require('../middleware/auth');
const adminAuth = require('../middleware/adminAuth');
const announcementController = require('../controllers/announcementController');

const router = express.Router();

// POST /api/announcements - Créer une annonce (admin)
router.post('/', [
  auth,
  adminAuth,
  body('title').notEmpty().withMessage('Le titre est requis.'),
  body('description').notEmpty().withMessage('La description est requise.'),
  body('type').isIn(['blood_donation', 'patient_search', 'other']).withMessage('Le type doit être blood_donation, patient_search ou other.'),
  body('author').notEmpty().withMessage('L\'auteur est requis.'),
  body('author_email').isEmail().withMessage('L\'email de l\'auteur doit être valide.'),
  body('urgency').isIn(['low', 'medium', 'high']).withMessage('L\'urgence doit être low, medium ou high.'),
  body('contact').notEmpty().withMessage('Le contact est requis.')
], announcementController.createAnnouncement);

// GET /api/announcements - Récupérer toutes les annonces (admin)
router.get('/', [
  auth,
  adminAuth
], announcementController.getAllAnnouncements);

// GET /api/announcements/public - Récupérer les annonces publiques (patients)
router.get('/public', announcementController.getPublicAnnouncements);

// GET /api/announcements/stats - Récupérer les statistiques (admin)
router.get('/stats', [
  auth,
  adminAuth
], announcementController.getAnnouncementStats);

// GET /api/announcements/:id - Récupérer une annonce par ID (admin)
router.get('/:id', [
  auth,
  adminAuth
], announcementController.getAnnouncementById);

// PUT /api/announcements/:id - Mettre à jour une annonce (admin)
router.put('/:id', [
  auth,
  adminAuth,
  body('title').optional().notEmpty().withMessage('Le titre ne peut pas être vide.'),
  body('description').optional().notEmpty().withMessage('La description ne peut pas être vide.'),
  body('type').optional().isIn(['blood_donation', 'patient_search', 'other']).withMessage('Le type doit être blood_donation, patient_search ou other.'),
  body('author').optional().notEmpty().withMessage('L\'auteur ne peut pas être vide.'),
  body('author_email').optional().isEmail().withMessage('L\'email de l\'auteur doit être valide.'),
  body('urgency').optional().isIn(['low', 'medium', 'high']).withMessage('L\'urgence doit être low, medium ou high.'),
  body('contact').optional().notEmpty().withMessage('Le contact ne peut pas être vide.')
], announcementController.updateAnnouncement);

// DELETE /api/announcements/:id - Supprimer une annonce (admin)
router.delete('/:id', [
  auth,
  adminAuth
], announcementController.deleteAnnouncement);

module.exports = router;
