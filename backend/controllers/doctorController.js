const Doctor = require('../models/Doctor');
const Availability = require('../models/Availability');
const { validationResult } = require('express-validator');

// Liste des médecins
exports.getAll = async (req, res) => {
  try {
    const { specialty } = req.query;
    let doctors;
    if (specialty) {
      doctors = await Doctor.findBySpecialty(specialty);
    } else {
      doctors = await Doctor.findAll();
    }
    res.json(doctors);
  } catch (error) {
    console.error('Erreur liste médecins:', error);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
};

// Détail d'un médecin
exports.getById = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id);
    if (!doctor) {
      return res.status(404).json({ message: 'Médecin non trouvé.' });
    }

    // Récupérer aussi les disponibilités
    const availabilities = await Availability.findByDoctor(doctor.id);
    
    res.json({ ...doctor, availabilities });
  } catch (error) {
    console.error('Erreur détail médecin:', error);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
};

// Créer un médecin (Admin)
exports.create = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const doctor = await Doctor.create(req.body);
    res.status(201).json({ message: 'Médecin ajouté avec succès.', doctor });
  } catch (error) {
    console.error('Erreur création médecin:', error);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
};

// Modifier un médecin (Admin)
exports.update = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id);
    if (!doctor) {
      return res.status(404).json({ message: 'Médecin non trouvé.' });
    }

    const updated = await Doctor.update(req.params.id, { ...doctor, ...req.body });
    res.json({ message: 'Médecin modifié avec succès.', doctor: updated });
  } catch (error) {
    console.error('Erreur modification médecin:', error);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
};

// Supprimer un médecin (Admin)
exports.delete = async (req, res) => {
  try {
    const deleted = await Doctor.delete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: 'Médecin non trouvé.' });
    }
    res.json({ message: 'Médecin supprimé avec succès.' });
  } catch (error) {
    console.error('Erreur suppression médecin:', error);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
};

// Disponibilités d'un médecin
exports.getAvailabilities = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id);
    if (!doctor) {
      return res.status(404).json({ message: 'Médecin non trouvé.' });
    }

    const availabilities = await Availability.findByDoctor(req.params.id);
    res.json(availabilities);
  } catch (error) {
    console.error('Erreur disponibilités médecin:', error);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
};
