const Availability = require('../models/Availability');
const Doctor = require('../models/Doctor');
const { validationResult } = require('express-validator');

// Disponibilités d'un médecin
exports.getByDoctor = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.doctorId);
    if (!doctor) {
      return res.status(404).json({ message: 'Médecin non trouvé.' });
    }

    const availabilities = await Availability.findByDoctor(req.params.doctorId);
    res.json(availabilities);
  } catch (error) {
    console.error('Erreur disponibilités:', error);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
};

// Ajouter une disponibilité (Admin)
exports.create = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { doctor_id, day_of_week, start_time, end_time } = req.body;

    // Vérifier que le médecin existe
    const doctor = await Doctor.findById(doctor_id);
    if (!doctor) {
      return res.status(404).json({ message: 'Médecin non trouvé.' });
    }

    const availability = await Availability.create({ doctor_id, day_of_week, start_time, end_time });
    res.status(201).json({ message: 'Disponibilité ajoutée.', availability });
  } catch (error) {
    console.error('Erreur ajout disponibilité:', error);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
};

// Modifier une disponibilité (Admin)
exports.update = async (req, res) => {
  try {
    const availability = await Availability.findById(req.params.id);
    if (!availability) {
      return res.status(404).json({ message: 'Disponibilité non trouvée.' });
    }

    const updated = await Availability.update(req.params.id, req.body);
    res.json({ message: 'Disponibilité modifiée.', availability: updated });
  } catch (error) {
    console.error('Erreur modification disponibilité:', error);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
};

// Supprimer une disponibilité (Admin)
exports.delete = async (req, res) => {
  try {
    const deleted = await Availability.delete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: 'Disponibilité non trouvée.' });
    }
    res.json({ message: 'Disponibilité supprimée.' });
  } catch (error) {
    console.error('Erreur suppression disponibilité:', error);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
};
