const Appointment = require('../models/Appointment');
const Notification = require('../models/Notification');
const Doctor = require('../models/Doctor');
const User = require('../models/User');
const { validationResult } = require('express-validator');

// Créer un rendez-vous (Patient)
exports.create = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { doctor_id, appointment_date, appointment_time, reason } = req.body;

    // Vérifier que le médecin existe
    const doctor = await Doctor.findById(doctor_id);
    if (!doctor) {
      return res.status(404).json({ message: 'Médecin non trouvé.' });
    }

    const appointment = await Appointment.create({
      patient_id: req.user.id,
      doctor_id,
      appointment_date,
      appointment_time,
      reason
    });

    // Créer une notification pour le patient
    await Notification.create({
      user_id: req.user.id,
      title: 'Nouveau rendez-vous',
      message: `Votre rendez-vous avec ${doctor.first_name} ${doctor.last_name} le ${appointment_date} à ${appointment_time} est en attente de confirmation.`,
      type: 'creation',
      appointment_id: appointment.id
    });

    res.status(201).json({ message: 'Rendez-vous créé avec succès.', appointment });
  } catch (error) {
    console.error('Erreur création RDV:', error);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
};

// Mes rendez-vous (Patient)
exports.getMyAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.findByPatient(req.user.id);
    res.json(appointments);
  } catch (error) {
    console.error('Erreur mes RDV:', error);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
};

// Tous les rendez-vous (Admin)
exports.getAll = async (req, res) => {
  try {
    const { status } = req.query;
    const appointments = await Appointment.findAll(status || null);
    res.json(appointments);
  } catch (error) {
    console.error('Erreur liste RDV:', error);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
};

// Modifier le statut d'un RDV (Admin - confirmer/refuser)
exports.updateStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (!['confirme', 'annule'].includes(status)) {
      return res.status(400).json({ message: 'Statut invalide. Utilisez "confirme" ou "annule".' });
    }

    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) {
      return res.status(404).json({ message: 'Rendez-vous non trouvé.' });
    }

    const updated = await Appointment.updateStatus(req.params.id, status);

    // Créer une notification pour le patient
    const notifType = status === 'confirme' ? 'confirmation' : 'annulation';
    const notifTitle = status === 'confirme' ? 'Rendez-vous confirmé' : 'Rendez-vous refusé';
    const notifMessage = status === 'confirme'
      ? `Votre rendez-vous avec ${appointment.doctor_first_name} ${appointment.doctor_last_name} le ${appointment.appointment_date} à ${appointment.appointment_time} a été confirmé.`
      : `Votre rendez-vous avec ${appointment.doctor_first_name} ${appointment.doctor_last_name} le ${appointment.appointment_date} à ${appointment.appointment_time} a été refusé.`;

    await Notification.create({
      user_id: appointment.patient_id,
      title: notifTitle,
      message: notifMessage,
      type: notifType,
      appointment_id: parseInt(req.params.id)
    });

    res.json({ message: `Rendez-vous ${status}.`, appointment: updated });
  } catch (error) {
    console.error('Erreur mise à jour statut:', error);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
};

// Annuler un RDV (Patient)
exports.cancel = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) {
      return res.status(404).json({ message: 'Rendez-vous non trouvé.' });
    }

    // Vérifier que c'est bien le patient qui annule
    if (appointment.patient_id !== req.user.id) {
      return res.status(403).json({ message: 'Vous ne pouvez annuler que vos propres rendez-vous.' });
    }

    if (appointment.status === 'annule') {
      return res.status(400).json({ message: 'Ce rendez-vous est déjà annulé.' });
    }

    const updated = await Appointment.cancel(req.params.id);

    // Notification
    await Notification.create({
      user_id: req.user.id,
      title: 'Rendez-vous annulé',
      message: `Votre rendez-vous avec ${appointment.doctor_first_name} ${appointment.doctor_last_name} le ${appointment.appointment_date} a été annulé.`,
      type: 'annulation',
      appointment_id: parseInt(req.params.id)
    });

    res.json({ message: 'Rendez-vous annulé.', appointment: updated });
  } catch (error) {
    console.error('Erreur annulation RDV:', error);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
};

// Statistiques (Admin)
exports.getStats = async (req, res) => {
  try {
    const stats = await Appointment.getStats();
    res.json(stats);
  } catch (error) {
    console.error('Erreur stats:', error);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
};

// Statistiques patient
exports.getPatientStats = async (req, res) => {
  try {
    const stats = await Appointment.getPatientStats(req.user.id);
    res.json(stats);
  } catch (error) {
    console.error('Erreur stats patient:', error);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
};

// Détails d'un rendez-vous
exports.getAppointmentById = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) {
      return res.status(404).json({ message: 'Rendez-vous non trouvé.' });
    }

    // Vérifier que c'est bien le patient qui consulte
    if (appointment.patient_id !== req.user.id) {
      return res.status(403).json({ message: 'Vous ne pouvez consulter que vos propres rendez-vous.' });
    }

    res.json(appointment);
  } catch (error) {
    console.error('Erreur détails RDV:', error);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
};

// Reporter un rendez-vous
exports.reschedule = async (req, res) => {
  try {
    const { appointment_date, appointment_time } = req.body;
    
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) {
      return res.status(404).json({ message: 'Rendez-vous non trouvé.' });
    }

    // Vérifier que c'est bien le patient qui modifie
    if (appointment.patient_id !== req.user.id) {
      return res.status(403).json({ message: 'Vous ne pouvez modifier que vos propres rendez-vous.' });
    }

    if (appointment.status === 'annule') {
      return res.status(400).json({ message: 'Impossible de reporter un rendez-vous annulé.' });
    }

    const updated = await Appointment.reschedule(req.params.id, appointment_date, appointment_time);

    // Notification
    await Notification.create({
      user_id: req.user.id,
      title: 'Rendez-vous reporté',
      message: `Votre rendez-vous avec ${appointment.doctor_first_name} ${appointment.doctor_last_name} a été reporté au ${appointment_date} à ${appointment_time}.`,
      type: 'creation',
      appointment_id: parseInt(req.params.id)
    });

    res.json({ message: 'Rendez-vous reporté.', appointment: updated });
  } catch (error) {
    console.error('Erreur report RDV:', error);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
};
