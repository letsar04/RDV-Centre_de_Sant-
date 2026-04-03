const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const availabilityController = require('../controllers/availabilityController');
const auth = require('../middleware/auth');
const adminAuth = require('../middleware/adminAuth');

// GET /api/availabilities/doctor/:doctorId
router.get('/doctor/:doctorId', auth, availabilityController.getByDoctor);

// POST /api/availabilities (Admin)
router.post('/', auth, adminAuth, [
  body('doctor_id').isInt().withMessage('ID médecin invalide.'),
  body('day_of_week').isIn(['lundi','mardi','mercredi','jeudi','vendredi','samedi','dimanche']).withMessage('Jour invalide.'),
  body('start_time').notEmpty().withMessage('Heure de début requise.'),
  body('end_time').notEmpty().withMessage('Heure de fin requise.')
], availabilityController.create);

// PUT /api/availabilities/:id (Admin)
router.put('/:id', auth, adminAuth, availabilityController.update);

// DELETE /api/availabilities/:id (Admin)
router.delete('/:id', auth, adminAuth, availabilityController.delete);

module.exports = router;
