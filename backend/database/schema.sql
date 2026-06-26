-- Base de datos inicial para Sprint 1.
-- Ejecuta este archivo en MySQL antes de probar register/login.

CREATE DATABASE IF NOT EXISTS turnix_db;
USE turnix_db;

-- Tabla minima de usuarios.
-- password_hash guarda la contrasena protegida, no el texto original.
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  full_name VARCHAR(120) NOT NULL,
  email VARCHAR(120) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('cliente', 'dueno_negocio', 'administrador') NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Clientes atendidos por los negocios que usan Turnix.
CREATE TABLE IF NOT EXISTS clients (
  id INT AUTO_INCREMENT PRIMARY KEY,
  full_name VARCHAR(120) NOT NULL,
  email VARCHAR(120),
  phone VARCHAR(30),
  document_number VARCHAR(40),
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Citas programadas para una fecha y hora concreta.
CREATE TABLE IF NOT EXISTS appointments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  client_id INT,
  client_name VARCHAR(120) NOT NULL,
  service_name VARCHAR(120) NOT NULL,
  appointment_date DATE NOT NULL,
  appointment_time TIME NOT NULL,
  status ENUM('pendiente', 'confirmada', 'atendida', 'cancelada') NOT NULL DEFAULT 'pendiente',
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_appointments_client
    FOREIGN KEY (client_id) REFERENCES clients(id)
    ON DELETE SET NULL
);

-- Turnos de atencion por orden de llegada.
CREATE TABLE IF NOT EXISTS turns (
  id INT AUTO_INCREMENT PRIMARY KEY,
  turn_code VARCHAR(20) NOT NULL,
  client_name VARCHAR(120) NOT NULL,
  service_name VARCHAR(120) NOT NULL,
  status ENUM('esperando', 'en_atencion', 'atendido', 'cancelado') NOT NULL DEFAULT 'esperando',
  priority ENUM('normal', 'preferencial') NOT NULL DEFAULT 'normal',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
