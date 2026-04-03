const { pool } = require('../config/db');

class Availability {
  static async findByDoctor(doctorId) {
    const [rows] = await pool.query(
      'SELECT * FROM availabilities WHERE doctor_id = ? ORDER BY FIELD(day_of_week, "lundi","mardi","mercredi","jeudi","vendredi","samedi","dimanche"), start_time',
      [doctorId]
    );
    return rows;
  }

  static async create(availabilityData) {
    const { doctor_id, day_of_week, start_time, end_time } = availabilityData;
    const [result] = await pool.query(
      'INSERT INTO availabilities (doctor_id, day_of_week, start_time, end_time) VALUES (?, ?, ?, ?)',
      [doctor_id, day_of_week, start_time, end_time]
    );
    return { id: result.insertId, ...availabilityData };
  }

  static async update(id, availabilityData) {
    const { day_of_week, start_time, end_time } = availabilityData;
    await pool.query(
      'UPDATE availabilities SET day_of_week = ?, start_time = ?, end_time = ? WHERE id = ?',
      [day_of_week, start_time, end_time, id]
    );
    const [rows] = await pool.query('SELECT * FROM availabilities WHERE id = ?', [id]);
    return rows[0];
  }

  static async delete(id) {
    const [result] = await pool.query('DELETE FROM availabilities WHERE id = ?', [id]);
    return result.affectedRows > 0;
  }

  static async findById(id) {
    const [rows] = await pool.query('SELECT * FROM availabilities WHERE id = ?', [id]);
    return rows[0] || null;
  }
}

module.exports = Availability;
