-- Migracion para bases TURN0 que ya existian antes de esta mejora.
-- Ejecutala despues de schema.sql si ya tenias tablas creadas.

USE turn0_db;

-- Usuarios: activar columna de estado si no existe.
ALTER TABLE users
  ADD COLUMN is_active BOOLEAN NOT NULL DEFAULT TRUE;

-- Clientes: evita duplicar correo o documento.
ALTER TABLE clients
  ADD UNIQUE KEY uq_clients_email (email),
  ADD UNIQUE KEY uq_clients_document (document_number);

-- Citas: evita duplicar un mismo servicio en la misma fecha y hora.
ALTER TABLE appointments
  ADD UNIQUE KEY uq_appointment_slot (appointment_date, appointment_time, service_name);

-- Turnos: evita duplicar tickets y registra cuando fueron atendidos.
ALTER TABLE turns
  ADD UNIQUE KEY uq_turn_code (turn_code),
  ADD COLUMN attended_at TIMESTAMP NULL;

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
INSERT INTO users (full_name, email, password_hash, role)
VALUES
  ('Administrador TURN0', 'admin', '$2b$10$0LDw.XXSj2VlmorxZmIIaenHn9yg4XGfWmya6KzFnXnYxIZIUwCXS', 'administrador'),
  ('Cliente Demo', 'cliente', '$2b$10$qhdC1mRS1V.juAJ4aTEjxeu3S8No2dSMNwPPZf./AGMVJvgUXLwCy', 'cliente'),
  ('Dueno de Negocio Demo', 'negocio', '$2b$10$HQdvF0orwiRkj4qGZiWNsuBXNGhoa/XIZ.SWbNH8I275.07J5TckO', 'dueno_negocio')
ON DUPLICATE KEY UPDATE
  full_name = VALUES(full_name),
  role = VALUES(role),
  is_active = TRUE;

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
