-- Base de datos principal de TURN0.
-- Ejecuta este archivo en MySQL cada vez que agreguemos tablas nuevas.

CREATE DATABASE IF NOT EXISTS turn0_db;
USE turn0_db;

-- Tabla minima de usuarios.
-- password_hash guarda la contrasena protegida, no el texto original.
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  full_name VARCHAR(120) NOT NULL,
  email VARCHAR(120) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('cliente', 'dueno_negocio', 'administrador') NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Clientes atendidos por los negocios que usan TURN0.
CREATE TABLE IF NOT EXISTS clients (
  id INT AUTO_INCREMENT PRIMARY KEY,
  full_name VARCHAR(120) NOT NULL,
  email VARCHAR(120) UNIQUE,
  phone VARCHAR(30),
  document_number VARCHAR(40) UNIQUE,
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
  UNIQUE KEY uq_appointment_slot (appointment_date, appointment_time, service_name),
  CONSTRAINT fk_appointments_client
    FOREIGN KEY (client_id) REFERENCES clients(id)
    ON DELETE SET NULL
);

-- Turnos de atencion por orden de llegada.
CREATE TABLE IF NOT EXISTS turns (
  id INT AUTO_INCREMENT PRIMARY KEY,
  turn_code VARCHAR(20) NOT NULL UNIQUE,
  client_name VARCHAR(120) NOT NULL,
  service_name VARCHAR(120) NOT NULL,
  status ENUM('esperando', 'en_atencion', 'atendido', 'cancelado') NOT NULL DEFAULT 'esperando',
  priority ENUM('normal', 'preferencial') NOT NULL DEFAULT 'normal',
  attended_at TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Atenciones realizadas por el negocio.
-- Sirve para reportar servicios efectivamente completados.
CREATE TABLE IF NOT EXISTS attentions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  client_name VARCHAR(120) NOT NULL,
  service_name VARCHAR(120) NOT NULL,
  attention_date DATE NOT NULL,
  attention_time TIME NOT NULL,
  duration_minutes INT NOT NULL DEFAULT 30,
  status ENUM('completada', 'observada', 'cancelada') NOT NULL DEFAULT 'completada',
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uq_attention_slot (attention_date, attention_time, client_name)
);

-- Usuarios base para probar el sistema.
-- Credenciales:
-- administrador: admin / admin123
-- cliente: cliente / cliente123
-- dueno de negocio: negocio / negocio123
INSERT INTO users (full_name, email, password_hash, role)
VALUES
  ('Administrador TURN0', 'admin', '$2b$10$0LDw.XXSj2VlmorxZmIIaenHn9yg4XGfWmya6KzFnXnYxIZIUwCXS', 'administrador'),
  ('Cliente Demo', 'cliente', '$2b$10$qhdC1mRS1V.juAJ4aTEjxeu3S8No2dSMNwPPZf./AGMVJvgUXLwCy', 'cliente'),
  ('Dueno de Negocio Demo', 'negocio', '$2b$10$HQdvF0orwiRkj4qGZiWNsuBXNGhoa/XIZ.SWbNH8I275.07J5TckO', 'dueno_negocio')
ON DUPLICATE KEY UPDATE
  full_name = VALUES(full_name),
  role = VALUES(role),
  is_active = TRUE;

-- Datos semilla para probar dashboard, calendario, CRUD y reportes.
-- Son registros distribuidos en julio de 2026.
INSERT INTO clients (full_name, email, phone, document_number, notes)
VALUES
  ('Cliente Demo', 'cliente.demo@turn0.com', '900111001', 'CLI-001', 'Cliente base para pruebas de usuario.'),
  ('Ana Torres', 'ana.torres@turn0.com', '900111002', 'CLI-002', 'Prefiere atencion por la manana.'),
  ('Bruno Salas', 'bruno.salas@turn0.com', '900111003', 'CLI-003', 'Consulta recurrente.'),
  ('Carla Rios', 'carla.rios@turn0.com', '900111004', 'CLI-004', 'Cliente nuevo.'),
  ('Diego Ramos', 'diego.ramos@turn0.com', '900111005', 'CLI-005', 'Atencion preferencial ocasional.'),
  ('Elena Paredes', 'elena.paredes@turn0.com', '900111006', 'CLI-006', 'Solicita recordatorios.'),
  ('Fabian Vega', 'fabian.vega@turn0.com', '900111007', 'CLI-007', 'Servicio frecuente.'),
  ('Gabriela Leon', 'gabriela.leon@turn0.com', '900111008', 'CLI-008', 'Cliente corporativo.'),
  ('Hugo Molina', 'hugo.molina@turn0.com', '900111009', 'CLI-009', 'Atencion rapida.'),
  ('Isabel Castro', 'isabel.castro@turn0.com', '900111010', 'CLI-010', 'Cliente recomendado.')
ON DUPLICATE KEY UPDATE
  full_name = VALUES(full_name),
  phone = VALUES(phone),
  notes = VALUES(notes);

INSERT INTO appointments (client_id, client_name, service_name, appointment_date, appointment_time, status, notes)
VALUES
  ((SELECT id FROM clients WHERE email = 'cliente.demo@turn0.com'), 'Cliente Demo', 'Consulta general', '2026-07-02', '09:00:00', 'confirmada', 'Cita visible para cronometro del cliente.'),
  ((SELECT id FROM clients WHERE email = 'ana.torres@turn0.com'), 'Ana Torres', 'Corte y estilo', '2026-07-03', '10:30:00', 'pendiente', 'Primera cita del mes.'),
  ((SELECT id FROM clients WHERE email = 'bruno.salas@turn0.com'), 'Bruno Salas', 'Revision tecnica', '2026-07-05', '15:00:00', 'confirmada', 'Traer comprobante.'),
  ((SELECT id FROM clients WHERE email = 'carla.rios@turn0.com'), 'Carla Rios', 'Asesoria', '2026-07-07', '11:00:00', 'atendida', 'Atencion completada.'),
  ((SELECT id FROM clients WHERE email = 'diego.ramos@turn0.com'), 'Diego Ramos', 'Consulta general', '2026-07-09', '16:30:00', 'pendiente', 'Validar prioridad.'),
  ((SELECT id FROM clients WHERE email = 'elena.paredes@turn0.com'), 'Elena Paredes', 'Reserva express', '2026-07-12', '08:45:00', 'confirmada', 'Llega temprano.'),
  ((SELECT id FROM clients WHERE email = 'fabian.vega@turn0.com'), 'Fabian Vega', 'Corte y estilo', '2026-07-14', '13:00:00', 'cancelada', 'Cliente reprogramara.'),
  ((SELECT id FROM clients WHERE email = 'gabriela.leon@turn0.com'), 'Gabriela Leon', 'Atencion corporativa', '2026-07-17', '09:30:00', 'pendiente', 'Enviar factura.'),
  ((SELECT id FROM clients WHERE email = 'hugo.molina@turn0.com'), 'Hugo Molina', 'Revision tecnica', '2026-07-20', '14:15:00', 'confirmada', 'Servicio recurrente.'),
  ((SELECT id FROM clients WHERE email = 'isabel.castro@turn0.com'), 'Isabel Castro', 'Asesoria', '2026-07-23', '12:00:00', 'pendiente', 'Nueva recomendacion.'),
  ((SELECT id FROM clients WHERE email = 'ana.torres@turn0.com'), 'Ana Torres', 'Consulta general', '2026-07-26', '17:00:00', 'confirmada', 'Seguimiento.'),
  ((SELECT id FROM clients WHERE email = 'cliente.demo@turn0.com'), 'Cliente Demo', 'Reserva express', '2026-07-29', '10:00:00', 'pendiente', 'Segunda cita del cliente demo.')
ON DUPLICATE KEY UPDATE
  client_name = VALUES(client_name),
  status = VALUES(status),
  notes = VALUES(notes);

INSERT INTO turns (turn_code, client_name, service_name, status, priority, attended_at, created_at)
VALUES
  ('T-001', 'Ana Torres', 'Consulta general', 'atendido', 'normal', '2026-07-01 09:25:00', '2026-07-01 09:00:00'),
  ('T-002', 'Bruno Salas', 'Revision tecnica', 'atendido', 'preferencial', '2026-07-02 10:15:00', '2026-07-02 09:45:00'),
  ('T-003', 'Carla Rios', 'Asesoria', 'cancelado', 'normal', NULL, '2026-07-04 11:30:00'),
  ('T-004', 'Diego Ramos', 'Consulta general', 'esperando', 'normal', NULL, '2026-07-08 14:00:00'),
  ('T-005', 'Elena Paredes', 'Reserva express', 'en_atencion', 'preferencial', NULL, '2026-07-10 08:40:00'),
  ('T-006', 'Fabian Vega', 'Corte y estilo', 'atendido', 'normal', '2026-07-13 16:05:00', '2026-07-13 15:20:00'),
  ('T-007', 'Gabriela Leon', 'Atencion corporativa', 'esperando', 'preferencial', NULL, '2026-07-16 12:00:00'),
  ('T-008', 'Hugo Molina', 'Revision tecnica', 'atendido', 'normal', '2026-07-19 10:50:00', '2026-07-19 10:05:00'),
  ('T-009', 'Isabel Castro', 'Asesoria', 'esperando', 'normal', NULL, '2026-07-24 09:10:00'),
  ('T-010', 'Cliente Demo', 'Reserva express', 'en_atencion', 'normal', NULL, '2026-07-28 13:35:00')
ON DUPLICATE KEY UPDATE
  client_name = VALUES(client_name),
  service_name = VALUES(service_name),
  status = VALUES(status),
  priority = VALUES(priority),
  attended_at = VALUES(attended_at);

INSERT INTO attentions (client_name, service_name, attention_date, attention_time, duration_minutes, status, notes)
VALUES
  ('Ana Torres', 'Consulta general', '2026-07-01', '09:25:00', 25, 'completada', 'Atencion rapida y sin observaciones.'),
  ('Bruno Salas', 'Revision tecnica', '2026-07-02', '10:15:00', 40, 'completada', 'Se realizo revision completa.'),
  ('Carla Rios', 'Asesoria', '2026-07-07', '11:00:00', 30, 'completada', 'Asesoria finalizada.'),
  ('Fabian Vega', 'Corte y estilo', '2026-07-13', '16:05:00', 45, 'completada', 'Cliente satisfecho.'),
  ('Hugo Molina', 'Revision tecnica', '2026-07-19', '10:50:00', 35, 'observada', 'Requiere seguimiento.'),
  ('Gabriela Leon', 'Atencion corporativa', '2026-07-21', '09:40:00', 55, 'completada', 'Atencion de cuenta corporativa.'),
  ('Isabel Castro', 'Asesoria', '2026-07-24', '09:45:00', 30, 'completada', 'Servicio recomendado.'),
  ('Cliente Demo', 'Consulta general', '2026-07-30', '10:30:00', 20, 'completada', 'Atencion demo registrada.')
ON DUPLICATE KEY UPDATE
  service_name = VALUES(service_name),
  duration_minutes = VALUES(duration_minutes),
  status = VALUES(status),
  notes = VALUES(notes);
