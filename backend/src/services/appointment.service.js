import { pool } from "../config/database.js";
import { httpError } from "../utils/httpError.js";

const VALID_APPOINTMENT_STATUSES = ["pendiente", "confirmada", "atendida", "cancelada"];
const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
const TIME_PATTERN = /^\d{2}:\d{2}(:\d{2})?$/;

export async function listAppointments() {
  const [appointments] = await pool.query(
    `SELECT appointments.*, clients.phone AS client_phone
     FROM appointments
     LEFT JOIN clients ON appointments.client_id = clients.id
     ORDER BY appointment_date DESC, appointment_time DESC`
  );
  return appointments;
}

export async function createAppointmentRecord(data) {
  validateAppointment(data);
  const { clientId, clientName, serviceName, appointmentDate, appointmentTime, status, notes } = data;

  const [result] = await pool.query(
    `INSERT INTO appointments
     (client_id, client_name, service_name, appointment_date, appointment_time, status, notes)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [clientId || null, clientName.trim(), serviceName.trim(), appointmentDate, appointmentTime, status || "pendiente", notes || null]
  );

  return { id: result.insertId };
}

export async function updateAppointmentRecord(id, data) {
  validateAppointment(data);
  const { clientId, clientName, serviceName, appointmentDate, appointmentTime, status, notes } = data;

  const [result] = await pool.query(
    `UPDATE appointments
     SET client_id = ?, client_name = ?, service_name = ?, appointment_date = ?, appointment_time = ?, status = ?, notes = ?
     WHERE id = ?`,
    [clientId || null, clientName.trim(), serviceName.trim(), appointmentDate, appointmentTime, status || "pendiente", notes || null, id]
  );

  if (result.affectedRows === 0) {
    throw httpError(404, "Cita no encontrada");
  }
}

export async function deleteAppointmentRecord(id) {
  const [result] = await pool.query("DELETE FROM appointments WHERE id = ?", [id]);

  if (result.affectedRows === 0) {
    throw httpError(404, "Cita no encontrada");
  }
}

function validateAppointment({ clientName, serviceName, appointmentDate, appointmentTime, status }) {
  if (!clientName || !serviceName || !appointmentDate || !appointmentTime) {
    throw httpError(400, "Cliente, servicio, fecha y hora son obligatorios");
  }

  if (!DATE_PATTERN.test(appointmentDate)) {
    throw httpError(400, "La fecha de la cita debe tener formato AAAA-MM-DD");
  }

  if (!TIME_PATTERN.test(appointmentTime)) {
    throw httpError(400, "La hora de la cita debe tener formato HH:MM");
  }

  if (status && !VALID_APPOINTMENT_STATUSES.includes(status)) {
    throw httpError(400, "Estado de cita no permitido");
  }
}
