// Mise à jour du profil
exports.updateProfile = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { first_name, last_name, phone, address } = req.body;
    const userId = req.user.id;

    // Mettre à jour l'utilisateur
    const updatedUser = await User.update(userId, { first_name, last_name, phone, address });
    if (!updatedUser) {
      return res.status(404).json({ message: 'Utilisateur non trouvé.' });
    }
    res.json({
      id: updatedUser.id,
      first_name: updatedUser.first_name,
      last_name: updatedUser.last_name,
      email: updatedUser.email,
      phone: updatedUser.phone,
      address: updatedUser.address || null,
      role: updatedUser.role
    });
  } catch (error) {
    console.error('Erreur update profil:', error);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
};

exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user.id;

    // Récupérer l'utilisateur (avec son mot de passe actuel)
    const userPassword = await User.findPasswordById(userId);
    if (!userPassword) {
      return res.status(404).json({ message: 'Utilisateur non trouvé.' });
    }

    // Vérifier l'ancien mot de passe
    const isMatch = await bcrypt.compare(currentPassword, userPassword);
    if (!isMatch) {
      return res.status(400).json({ message: 'Mot de passe actuel incorrect.' });
    }

    // Hasher le nouveau mot de passe
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Mettre à jour
    await User.updatePassword(userId, hashedPassword);

    res.json({ message: 'Mot de passe mis à jour avec succès.' });
  } catch (error) {
    console.error('Erreur changement mot de passe:', error);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
};
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const User = require('../models/User');
require('dotenv').config();

// Inscription
exports.register = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { first_name, last_name, email, phone, password } = req.body;

    // Vérifier si l'email existe déjà
    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      return res.status(400).json({ message: 'Cet email est déjà utilisé.' });
    }

    // Hasher le mot de passe
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Créer l'utilisateur
    const user = await User.create({
      first_name,
      last_name,
      email,
      phone,
      password: hashedPassword,
      role: 'patient'
    });

    // Générer le token
    const token = jwt.sign(
      { id: user.id, email: user.email, role: 'patient' },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    res.status(201).json({
      message: 'Inscription réussie !',
      token,
      user: {
        id: user.id,
        first_name,
        last_name,
        email,
        phone,
        address: user.address || null,
        role: 'patient'
      }
    });
  } catch (error) {
    console.error('Erreur inscription:', error);
    res.status(500).json({ message: 'Erreur serveur lors de l\'inscription.' });
  }
};

// Connexion
exports.login = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    // Trouver l'utilisateur
    const user = await User.findByEmail(email);
    if (!user) {
      return res.status(401).json({ message: 'Email ou mot de passe incorrect.' });
    }

    // Vérifier le mot de passe
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Email ou mot de passe incorrect.' });
    }

    // Générer le token
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    res.json({
      message: 'Connexion réussie !',
      token,
      user: {
        id: user.id,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        phone: user.phone,
        address: user.address || null,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Erreur connexion:', error);
    res.status(500).json({ message: 'Erreur serveur lors de la connexion.' });
  }
};

// Profil
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé.' });
    }
    res.json(user);
  } catch (error) {
    console.error('Erreur profil:', error);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
};
