const { pool } = require('../config/db');

class Doctor {
  static async findAll() {
    const [rows] = await pool.query('SELECT * FROM doctors ORDER BY last_name ASC');
    return rows;
  }

  static async findById(id) {
    const [rows] = await pool.query('SELECT * FROM doctors WHERE id = ?', [id]);
    return rows[0] || null;
  }

  static async findBySpecialty(specialty) {
    const [rows] = await pool.query('SELECT * FROM doctors WHERE specialty LIKE ?', [`%${specialty}%`]);
    return rows;
  }

  static async create(doctorData) {
    const { first_name, last_name, specialty, phone, email, image_url } = doctorData;
    const [result] = await pool.query(
      'INSERT INTO doctors (first_name, last_name, specialty, phone, email, image_url) VALUES (?, ?, ?, ?, ?, ?)',
      [first_name, last_name, specialty, phone, email, image_url || null]
    );
    return { id: result.insertId, ...doctorData };
  }

  static async update(id, doctorData) {
    const { first_name, last_name, specialty, phone, email, image_url } = doctorData;
    await pool.query(
      'UPDATE doctors SET first_name = ?, last_name = ?, specialty = ?, phone = ?, email = ?, image_url = ? WHERE id = ?',
      [first_name, last_name, specialty, phone, email, image_url, id]
    );
    return this.findById(id);
  }

  static async delete(id) {
    const [result] = await pool.query('DELETE FROM doctors WHERE id = ?', [id]);
    return result.affectedRows > 0;
  }
}

module.exports = Doctor;
