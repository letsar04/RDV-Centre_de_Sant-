const User = require('../models/User');

// Liste des patients (Admin)
exports.getAll = async (req, res) => {
  try {
    const patients = await User.findAll('patient');
    res.json(patients);
  } catch (error) {
    console.error('Erreur liste patients:', error);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
};

// Détail d'un patient (Admin)
exports.getById = async (req, res) => {
  try {
    const patient = await User.findById(req.params.id);
    if (!patient || patient.role !== 'patient') {
      return res.status(404).json({ message: 'Patient non trouvé.' });
    }
    res.json(patient);
  } catch (error) {
    console.error('Erreur détail patient:', error);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
};

// Supprimer un patient (Admin)
exports.delete = async (req, res) => {
  try {
    const deleted = await User.delete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: 'Patient non trouvé.' });
    }
    res.json({ message: 'Patient supprimé avec succès.' });
  } catch (error) {
    console.error('Erreur suppression patient:', error);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
};
