const Notification = require('../models/Notification');

// Mes notifications
exports.getMyNotifications = async (req, res) => {
  try {
    const notifications = await Notification.findByUser(req.user.id);
    const unreadCount = await Notification.getUnreadCount(req.user.id);
    res.json({ notifications, unreadCount });
  } catch (error) {
    console.error('Erreur notifications:', error);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
};

// Marquer comme lu
exports.markAsRead = async (req, res) => {
  try {
    const notification = await Notification.markAsRead(req.params.id);
    if (!notification) {
      return res.status(404).json({ message: 'Notification non trouvée.' });
    }
    res.json({ message: 'Notification marquée comme lue.', notification });
  } catch (error) {
    console.error('Erreur marquage notification:', error);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
};

// Tout marquer comme lu
exports.markAllAsRead = async (req, res) => {
  try {
    await Notification.markAllAsRead(req.user.id);
    res.json({ message: 'Toutes les notifications marquées comme lues.' });
  } catch (error) {
    console.error('Erreur marquage notifications:', error);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
};
