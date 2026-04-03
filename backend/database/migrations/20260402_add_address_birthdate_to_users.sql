-- Migration pour ajouter les champs manquants au profil utilisateur
ALTER TABLE users ADD COLUMN address VARCHAR(255) NULL;
ALTER TABLE users ADD COLUMN birthdate DATE NULL;