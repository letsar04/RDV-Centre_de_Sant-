const { pool } = require('../config/db');

class Notification {
  static async create(notificationData) {
    const { user_id, title, message, type, appointment_id } = notificationData;
    const [result] = await pool.query(
      'INSERT INTO notifications (user_id, title, message, type, appointment_id) VALUES (?, ?, ?, ?, ?)',
      [user_id, title, message, type, appointment_id || null]
    );
    return { id: result.insertId, ...notificationData, is_read: false };
  }

  static async findByUser(userId) {
    const [rows] = await pool.query(
      'SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC',
      [userId]
    );
    return rows;
  }

  static async markAsRead(id) {
    await pool.query('UPDATE notifications SET is_read = TRUE WHERE id = ?', [id]);
    const [rows] = await pool.query('SELECT * FROM notifications WHERE id = ?', [id]);
    return rows[0];
  }

  static async markAllAsRead(userId) {
    await pool.query('UPDATE notifications SET is_read = TRUE WHERE user_id = ?', [userId]);
    return true;
  }

  static async getUnreadCount(userId) {
    const [rows] = await pool.query(
      'SELECT COUNT(*) as count FROM notifications WHERE user_id = ? AND is_read = FALSE',
      [userId]
    );
    return rows[0].count;
  }
}

module.exports = Notification;
