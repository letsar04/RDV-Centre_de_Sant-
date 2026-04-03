const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const doctorController = require('../controllers/doctorController');
const auth = require('../middleware/auth');
const adminAuth = require('../middleware/adminAuth');

// GET /api/doctors
router.get('/', auth, doctorController.getAll);

// GET /api/doctors/:id
router.get('/:id', auth, doctorController.getById);

// POST /api/doctors (Admin)
router.post('/', auth, adminAuth, [
  body('first_name').notEmpty().withMessage('Le prénom est requis.'),
  body('last_name').notEmpty().withMessage('Le nom est requis.'),
  body('specialty').notEmpty().withMessage('La spécialité est requise.')
], doctorController.create);

// PUT /api/doctors/:id (Admin)
router.put('/:id', auth, adminAuth, doctorController.update);

// DELETE /api/doctors/:id (Admin)
router.delete('/:id', auth, adminAuth, doctorController.delete);

module.exports = router;
