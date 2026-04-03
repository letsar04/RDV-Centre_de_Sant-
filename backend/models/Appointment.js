const { pool } = require('../config/db');

class Appointment {
  static async create(appointmentData) {
    const { patient_id, doctor_id, appointment_date, appointment_time, reason } = appointmentData;
    const [result] = await pool.query(
      'INSERT INTO appointments (patient_id, doctor_id, appointment_date, appointment_time, reason) VALUES (?, ?, ?, ?, ?)',
      [patient_id, doctor_id, appointment_date, appointment_time, reason || null]
    );
    return { id: result.insertId, ...appointmentData, status: 'en_attente' };
  }

  static async findById(id) {
    const [rows] = await pool.query(
      `SELECT a.*, 
              u.first_name AS patient_first_name, u.last_name AS patient_last_name, u.phone AS patient_phone,
              d.first_name AS doctor_first_name, d.last_name AS doctor_last_name, d.specialty AS doctor_specialty
       FROM appointments a
       JOIN users u ON a.patient_id = u.id
       JOIN doctors d ON a.doctor_id = d.id
       WHERE a.id = ?`,
      [id]
    );
    return rows[0] || null;
  }

  static async findByPatient(patientId) {
    const [rows] = await pool.query(
      `SELECT a.*, 
              d.first_name AS doctor_first_name, d.last_name AS doctor_last_name, d.specialty AS doctor_specialty
       FROM appointments a
       JOIN doctors d ON a.doctor_id = d.id
       WHERE a.patient_id = ?
       ORDER BY a.appointment_date DESC, a.appointment_time DESC`,
      [patientId]
    );
    return rows;
  }

  static async findAll(status = null) {
    let query = `SELECT a.*, 
                        u.first_name AS patient_first_name, u.last_name AS patient_last_name, u.phone AS patient_phone,
                        d.first_name AS doctor_first_name, d.last_name AS doctor_last_name, d.specialty AS doctor_specialty
                 FROM appointments a
                 JOIN users u ON a.patient_id = u.id
                 JOIN doctors d ON a.doctor_id = d.id`;
    const params = [];
    if (status) {
      query += ' WHERE a.status = ?';
      params.push(status);
    }
    query += ' ORDER BY a.appointment_date DESC, a.appointment_time DESC';
    const [rows] = await pool.query(query, params);
    return rows;
  }

  static async updateStatus(id, status) {
    await pool.query('UPDATE appointments SET status = ? WHERE id = ?', [status, id]);
    return this.findById(id);
  }

  static async cancel(id) {
    return this.updateStatus(id, 'annule');
  }

  static async getStats() {
    const [total] = await pool.query('SELECT COUNT(*) as count FROM appointments');
    const [enAttente] = await pool.query("SELECT COUNT(*) as count FROM appointments WHERE status = 'en_attente'");
    const [confirme] = await pool.query("SELECT COUNT(*) as count FROM appointments WHERE status = 'confirme'");
    const [annule] = await pool.query("SELECT COUNT(*) as count FROM appointments WHERE status = 'annule'");
    
    // Médecins disponibles aujourd'hui
    const days = ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'];
    const currentDay = days[new Date().getDay()];
    
    const [doctorsToday] = await pool.query(
      `SELECT DISTINCT d.first_name, d.last_name, d.specialty 
       FROM doctors d 
       JOIN availabilities v ON d.id = v.doctor_id 
       WHERE v.day_of_week = ?`,
      [currentDay]
    );

    return {
      total: total[0].count,
      en_attente: enAttente[0].count,
      confirme: confirme[0].count,
      annule: annule[0].count,
      doctors_today: doctorsToday
    };
  }

  static async getPatientStats(patientId) {
    const [total] = await pool.query('SELECT COUNT(*) as count FROM appointments WHERE patient_id = ?', [patientId]);
    const [enAttente] = await pool.query("SELECT COUNT(*) as count FROM appointments WHERE patient_id = ? AND status = 'en_attente'", [patientId]);
    const [confirme] = await pool.query("SELECT COUNT(*) as count FROM appointments WHERE patient_id = ? AND status = 'confirme'", [patientId]);
    const [prochain] = await pool.query(
      `SELECT a.*, d.first_name AS doctor_first_name, d.last_name AS doctor_last_name, d.specialty AS doctor_specialty
       FROM appointments a JOIN doctors d ON a.doctor_id = d.id
       WHERE a.patient_id = ? AND a.status = 'confirme' AND a.appointment_date >= CURDATE()
       ORDER BY a.appointment_date ASC, a.appointment_time ASC LIMIT 1`,
      [patientId]
    );
    return {
      total: total[0].count,
      en_attente: enAttente[0].count,
      confirme: confirme[0].count,
      prochain: prochain[0] || null
    };
  }
}

module.exports = Appointment;
