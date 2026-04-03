-- =============================================
-- Centre de Santé - Données de test (Seed)
-- =============================================

USE centre_sante;

-- Admin (mot de passe: admin123 - hashé avec bcrypt)
INSERT INTO users (first_name, last_name, email, phone, password, role) VALUES
('Admin', 'Principal', 'admin@centresante.com', '0600000000', '$2a$10$Uj5E6/Sj6G1oY5OL63VD3OjsQumkgeF3Nvtnqf6sO9sf3Wp3TfEyK', 'admin');

-- Patients (mot de passe: patient123 - hashé avec bcrypt)
INSERT INTO users (first_name, last_name, email, phone, password, role) VALUES
('Jean', 'Dupont', 'jean.dupont@email.com', '0612345678', '$2a$10$tZ23D6gG.zU0pG63VD3OjsQumkgeF3Nvtnqf6sO9sf3Wp3TfEyK', 'patient'),
('Marie', 'Martin', 'marie.martin@email.com', '0698765432', '$2a$10$tZ23D6gG.zU0pG63VD3OjsQumkgeF3Nvtnqf6sO9sf3Wp3TfEyK', 'patient');

-- Médecins
INSERT INTO doctors (first_name, last_name, specialty, phone, email) VALUES
('Dr. Ahmed', 'Benali', 'Médecine Générale', '0611111111', 'dr.benali@centresante.com'),
('Dr. Fatima', 'Zahra', 'Cardiologie', '0622222222', 'dr.zahra@centresante.com'),
('Dr. Karim', 'Ousmane', 'Dermatologie', '0633333333', 'dr.ousmane@centresante.com'),
('Dr. Sophie', 'Lefèvre', 'Pédiatrie', '0644444444', 'dr.lefevre@centresante.com'),
('Dr. Moussa', 'Diallo', 'Ophtalmologie', '0655555555', 'dr.diallo@centresante.com');

-- Disponibilités des médecins
INSERT INTO availabilities (doctor_id, day_of_week, start_time, end_time) VALUES
-- Dr. Benali
(1, 'lundi', '08:00', '12:00'),
(1, 'lundi', '14:00', '17:00'),
(1, 'mercredi', '08:00', '12:00'),
(1, 'vendredi', '08:00', '12:00'),
(1, 'vendredi', '14:00', '17:00'),
-- Dr. Zahra
(2, 'mardi', '09:00', '13:00'),
(2, 'jeudi', '09:00', '13:00'),
(2, 'samedi', '09:00', '12:00'),
-- Dr. Ousmane
(3, 'lundi', '09:00', '12:00'),
(3, 'mercredi', '14:00', '18:00'),
(3, 'vendredi', '09:00', '12:00'),
-- Dr. Lefèvre
(4, 'mardi', '08:00', '12:00'),
(4, 'mardi', '14:00', '17:00'),
(4, 'jeudi', '08:00', '12:00'),
(4, 'jeudi', '14:00', '17:00'),
-- Dr. Diallo
(5, 'lundi', '10:00', '13:00'),
(5, 'mercredi', '10:00', '13:00'),
(5, 'vendredi', '14:00', '17:00');

-- Rendez-vous de test
INSERT INTO appointments (patient_id, doctor_id, appointment_date, appointment_time, status, reason) VALUES
(2, 1, '2026-04-02', '09:00', 'confirme', 'Consultation générale'),
(2, 2, '2026-04-05', '10:00', 'en_attente', 'Contrôle cardiaque'),
(3, 4, '2026-04-03', '08:30', 'en_attente', 'Consultation pédiatrique'),
(3, 3, '2026-04-07', '15:00', 'annule', 'Problème de peau');

-- Notifications de test
INSERT INTO notifications (user_id, title, message, is_read, type, appointment_id) VALUES
(2, 'Rendez-vous confirmé', 'Votre rendez-vous avec Dr. Benali le 02/04/2026 à 09:00 a été confirmé.', FALSE, 'confirmation', 1),
(2, 'Nouveau rendez-vous', 'Votre rendez-vous avec Dr. Zahra le 05/04/2026 à 10:00 est en attente de confirmation.', FALSE, 'creation', 2),
(3, 'Nouveau rendez-vous', 'Votre rendez-vous avec Dr. Lefèvre le 03/04/2026 à 08:30 est en attente de confirmation.', FALSE, 'creation', 3);
