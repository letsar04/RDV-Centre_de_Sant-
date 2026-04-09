const { validationResult } = require('express-validator');
const Announcement = require('../models/Announcement');

// Créer une annonce (admin)
exports.createAnnouncement = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      title,
      description,
      type,
      author,
      author_email,
      location,
      blood_type,
      urgency,
      contact
    } = req.body;

    const announcementData = {
      title,
      description,
      type,
      author,
      author_email,
      location,
      blood_type,
      urgency,
      contact,
      admin_id: req.user.id
    };

    const announcementId = await Announcement.create(announcementData);

    res.status(201).json({
      message: 'Annonce créée avec succès',
      announcementId
    });
  } catch (error) {
    console.error('Erreur création annonce:', error);
    res.status(500).json({ message: 'Erreur serveur lors de la création de l\'annonce.' });
  }
};

// Récupérer toutes les annonces (admin)
exports.getAllAnnouncements = async (req, res) => {
  try {
    const { status, type } = req.query;
    const announcements = type 
      ? await Announcement.getByType(type)
      : await Announcement.getAll(status || 'active');

    res.json(announcements);
  } catch (error) {
    console.error('Erreur récupération annonces:', error);
    res.status(500).json({ message: 'Erreur serveur lors de la récupération des annonces.' });
  }
};

// Récupérer une annonce par ID (admin)
exports.getAnnouncementById = async (req, res) => {
  try {
    const { id } = req.params;
    const announcement = await Announcement.findById(id);

    if (!announcement) {
      return res.status(404).json({ message: 'Annonce non trouvée.' });
    }

    res.json(announcement);
  } catch (error) {
    console.error('Erreur récupération annonce:', error);
    res.status(500).json({ message: 'Erreur serveur lors de la récupération de l\'annonce.' });
  }
};

// Mettre à jour une annonce (admin)
exports.updateAnnouncement = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const updateData = req.body;

    // Vérifier si l'annonce existe
    const existingAnnouncement = await Announcement.findById(id);
    if (!existingAnnouncement) {
      return res.status(404).json({ message: 'Annonce non trouvée.' });
    }

    // Vérifier que l'admin est bien l'auteur ou un super admin
    if (existingAnnouncement.admin_id !== req.user.id && req.user.email !== 'superadmin@centresante.com') {
      return res.status(403).json({ message: 'Non autorisé à modifier cette annonce.' });
    }

    const updated = await Announcement.update(id, updateData);

    if (!updated) {
      return res.status(400).json({ message: 'Échec de la mise à jour.' });
    }

    res.json({ message: 'Annonce mise à jour avec succès.' });
  } catch (error) {
    console.error('Erreur mise à jour annonce:', error);
    res.status(500).json({ message: 'Erreur serveur lors de la mise à jour de l\'annonce.' });
  }
};

// Supprimer une annonce (admin)
exports.deleteAnnouncement = async (req, res) => {
  try {
    const { id } = req.params;

    // Vérifier si l'annonce existe
    const existingAnnouncement = await Announcement.findById(id);
    if (!existingAnnouncement) {
      return res.status(404).json({ message: 'Annonce non trouvée.' });
    }

    // Vérifier que l'admin est bien l'auteur ou un super admin
    if (existingAnnouncement.admin_id !== req.user.id && req.user.email !== 'superadmin@centresante.com') {
      return res.status(403).json({ message: 'Non autorisé à supprimer cette annonce.' });
    }

    const deleted = await Announcement.delete(id);

    if (!deleted) {
      return res.status(400).json({ message: 'Échec de la suppression.' });
    }

    res.json({ message: 'Annonce supprimée avec succès.' });
  } catch (error) {
    console.error('Erreur suppression annonce:', error);
    res.status(500).json({ message: 'Erreur serveur lors de la suppression de l\'annonce.' });
  }
};

// Récupérer les statistiques des annonces (admin)
exports.getAnnouncementStats = async (req, res) => {
  try {
    const stats = await Announcement.getCountByType();
    
    // Calculer le total
    const total = stats.reduce((sum, stat) => sum + stat.count, 0);

    res.json({
      total,
      byType: stats
    });
  } catch (error) {
    console.error('Erreur récupération statistiques annonces:', error);
    res.status(500).json({ message: 'Erreur serveur lors de la récupération des statistiques.' });
  }
};

// Récupérer les annonces publiques (pour les patients)
exports.getPublicAnnouncements = async (req, res) => {
  try {
    const { type, search } = req.query;
    
    let announcements;
    if (type) {
      announcements = await Announcement.getByType(type);
    } else {
      announcements = await Announcement.getAll('active');
    }

    // Filtrer par recherche si nécessaire
    if (search) {
      announcements = announcements.filter(announcement => 
        announcement.title.toLowerCase().includes(search.toLowerCase()) ||
        announcement.description.toLowerCase().includes(search.toLowerCase())
      );
    }

    res.json(announcements);
  } catch (error) {
    console.error('Erreur récupération annonces publiques:', error);
    res.status(500).json({ message: 'Erreur serveur lors de la récupération des annonces.' });
  }
};
