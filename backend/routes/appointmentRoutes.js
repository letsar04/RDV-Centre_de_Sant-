const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const appointmentController = require('../controllers/appointmentController');
const auth = require('../middleware/auth');
const adminAuth = require('../middleware/adminAuth');

// POST /api/appointments (Patient)
router.post('/', auth, [
  body('doctor_id').isInt().withMessage('ID médecin invalide.'),
  body('appointment_date').isDate().withMessage('Date invalide.'),
  body('appointment_time').notEmpty().withMessage('L\'heure est requise.')
], appointmentController.create);

// GET /api/appointments/stats (Admin)
router.get('/stats', auth, adminAuth, appointmentController.getStats);

// GET /api/appointments/my-stats (Patient)
router.get('/my-stats', auth, appointmentController.getPatientStats);

// GET /api/appointments/my (Patient)
router.get('/my', auth, appointmentController.getMyAppointments);

// GET /api/appointments (Admin)
router.get('/', auth, adminAuth, appointmentController.getAll);

// PUT /api/appointments/:id/status (Admin)
router.put('/:id/status', auth, adminAuth, appointmentController.updateStatus);

// PUT /api/appointments/:id/cancel (Patient)
router.put('/:id/cancel', auth, appointmentController.cancel);

module.exports = router;
