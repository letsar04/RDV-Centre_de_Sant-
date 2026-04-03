const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const authController = require('../controllers/authController');
const auth = require('../middleware/auth');

// POST /api/auth/register
router.post('/register', [
  body('first_name').notEmpty().withMessage('Le prénom est requis.'),
  body('last_name').notEmpty().withMessage('Le nom est requis.'),
  body('email').isEmail().withMessage('Email invalide.'),
  body('phone').notEmpty().withMessage('Le téléphone est requis.'),
  body('password').isLength({ min: 6 }).withMessage('Le mot de passe doit contenir au moins 6 caractères.')
], authController.register);

// POST /api/auth/login
router.post('/login', [
  body('email').isEmail().withMessage('Email invalide.'),
  body('password').notEmpty().withMessage('Le mot de passe est requis.')
], authController.login);

// GET /api/auth/profile
router.get('/profile', auth, authController.getProfile);

// PUT /api/auth/profile
router.put('/profile', auth, [
  body('first_name').notEmpty().withMessage('Le prénom est requis.'),
  body('last_name').notEmpty().withMessage('Le nom est requis.'),
  body('phone').notEmpty().withMessage('Le téléphone est requis.'),
], authController.updateProfile);

// PUT /api/auth/password
router.put('/password', auth, [
  body('currentPassword').notEmpty().withMessage('Le mot de passe actuel est requis.'),
  body('newPassword').isLength({ min: 6 }).withMessage('Le nouveau mot de passe doit contenir au moins 6 caractères.')
], authController.changePassword);

module.exports = router;
