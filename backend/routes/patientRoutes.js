const express = require('express');
const router = express.Router();
const patientController = require('../controllers/patientController');
const auth = require('../middleware/auth');
const adminAuth = require('../middleware/adminAuth');

// GET /api/patients (Admin)
router.get('/', auth, adminAuth, patientController.getAll);

// GET /api/patients/:id (Admin)
router.get('/:id', auth, adminAuth, patientController.getById);

// DELETE /api/patients/:id (Admin)
router.delete('/:id', auth, adminAuth, patientController.delete);

module.exports = router;
