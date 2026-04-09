const { pool } = require('../config/db');

class Announcement {
  // Créer une annonce
  static async create(announcementData) {
    const {
      title,
      description,
      type,
      author,
      author_email,
      location,
      blood_type,
      urgency,
      contact,
      admin_id
    } = announcementData;

    const query = `
      INSERT INTO announcements (
        title, description, type, author, author_email, location, 
        blood_type, urgency, contact, admin_id, status, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'active', NOW())
    `;

    try {
      const [result] = await pool.execute(query, [
        title, description, type, author, author_email, location,
        blood_type, urgency, contact, admin_id
      ]);
      return result.insertId;
    } catch (error) {
      console.error('Erreur création annonce:', error);
      throw error;
    }
  }

  // Récupérer toutes les annonces
  static async getAll(status = 'active') {
    const query = `
      SELECT a.*, u.first_name as admin_name, u.last_name as admin_lastname
      FROM announcements a
      LEFT JOIN users u ON a.admin_id = u.id
      WHERE a.status = ?
      ORDER BY a.created_at DESC
    `;

    try {
      const [rows] = await pool.execute(query, [status]);
      return rows;
    } catch (error) {
      console.error('Erreur récupération annonces:', error);
      throw error;
    }
  }

  // Récupérer une annonce par ID
  static async findById(id) {
    const query = `
      SELECT a.*, u.first_name as admin_name, u.last_name as admin_lastname
      FROM announcements a
      LEFT JOIN users u ON a.admin_id = u.id
      WHERE a.id = ?
    `;

    try {
      const [rows] = await pool.execute(query, [id]);
      return rows[0] || null;
    } catch (error) {
      console.error('Erreur récupération annonce:', error);
      throw error;
    }
  }

  // Mettre à jour une annonce
  static async update(id, updateData) {
    const fields = [];
    const values = [];

    Object.keys(updateData).forEach(key => {
      if (updateData[key] !== undefined) {
        fields.push(`${key} = ?`);
        values.push(updateData[key]);
      }
    });

    if (fields.length === 0) return false;

    values.push(id);
    const query = `UPDATE announcements SET ${fields.join(', ')} WHERE id = ?`;

    try {
      const [result] = await pool.execute(query, values);
      return result.affectedRows > 0;
    } catch (error) {
      console.error('Erreur mise à jour annonce:', error);
      throw error;
    }
  }

  // Supprimer une annonce (soft delete)
  static async delete(id) {
    const query = `UPDATE announcements SET status = 'deleted' WHERE id = ?`;

    try {
      const [result] = await pool.execute(query, [id]);
      return result.affectedRows > 0;
    } catch (error) {
      console.error('Erreur suppression annonce:', error);
      throw error;
    }
  }

  // Récupérer les annonces par type
  static async getByType(type) {
    const query = `
      SELECT a.*, u.first_name as admin_name, u.last_name as admin_lastname
      FROM announcements a
      LEFT JOIN users u ON a.admin_id = u.id
      WHERE a.type = ? AND a.status = 'active'
      ORDER BY a.created_at DESC
    `;

    try {
      const [rows] = await pool.execute(query, [type]);
      return rows;
    } catch (error) {
      console.error('Erreur récupération annonces par type:', error);
      throw error;
    }
  }

  // Compter les annonces par type
  static async getCountByType() {
    const query = `
      SELECT type, COUNT(*) as count
      FROM announcements
      WHERE status = 'active'
      GROUP BY type
    `;

    try {
      const [rows] = await pool.execute(query);
      return rows;
    } catch (error) {
      console.error('Erreur comptage annonces:', error);
      throw error;
    }
  }
}

module.exports = Announcement;
