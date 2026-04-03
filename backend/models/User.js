const { pool } = require('../config/db');

class User {
  static async findByEmail(email) {
    const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    return rows[0] || null;
  }

  static async findById(id) {
    const [rows] = await pool.query('SELECT id, first_name, last_name, email, phone, address, role, created_at FROM users WHERE id = ?', [id]);
    return rows[0] || null;
  }

  static async findPasswordById(id) {
    const [rows] = await pool.query('SELECT password FROM users WHERE id = ?', [id]);
    return rows[0] ? rows[0].password : null;
  }

  static async updatePassword(id, hashedPassword) {
    await pool.query('UPDATE users SET password = ? WHERE id = ?', [hashedPassword, id]);
    return true;
  }

  static async create(userData) {
    const { first_name, last_name, email, phone, password, role, address } = userData;
    const [result] = await pool.query(
      'INSERT INTO users (first_name, last_name, email, phone, password, role, address) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [first_name, last_name, email, phone, password, role || 'patient', address || null]
    );
    return { id: result.insertId, ...userData };
  }

  static async findAll(role = null) {
    let query = 'SELECT id, first_name, last_name, email, phone, address, role, created_at FROM users';
    const params = [];
    if (role) {
      query += ' WHERE role = ?';
      params.push(role);
    }
    query += ' ORDER BY created_at DESC';
    const [rows] = await pool.query(query, params);
    return rows;
  }

  static async update(id, userData) {
    const { first_name, last_name, phone, address } = userData;
    await pool.query(
      'UPDATE users SET first_name = ?, last_name = ?, phone = ?, address = ? WHERE id = ?',
      [first_name, last_name, phone, address || null, id]
    );
    return this.findById(id);
  }

  static async delete(id) {
    const [result] = await pool.query('DELETE FROM users WHERE id = ?', [id]);
    return result.affectedRows > 0;
  }
}

module.exports = User;
