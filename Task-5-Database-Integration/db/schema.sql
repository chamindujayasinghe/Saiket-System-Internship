-- =========================================================
-- Task 5 — Database schema (MySQL)
-- Run manually:   mysql -u root -p < db/schema.sql
-- Or use:         npm run db:init   (creates the DB from DB_NAME in .env)
-- =========================================================

CREATE DATABASE IF NOT EXISTS saiket_users
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE saiket_users;

CREATE TABLE IF NOT EXISTS users (
  id          INT UNSIGNED     NOT NULL AUTO_INCREMENT,
  name        VARCHAR(100)     NOT NULL,
  email       VARCHAR(255)     NOT NULL,
  age         TINYINT UNSIGNED NOT NULL,
  created_at  TIMESTAMP        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at  TIMESTAMP        NULL     DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,

  PRIMARY KEY (id),
  UNIQUE KEY uq_users_email (email),
  CONSTRAINT chk_users_age CHECK (age BETWEEN 1 AND 150)
);
