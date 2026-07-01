import { pool } from "../config/database.js";
import { httpError } from "../utils/httpError.js";

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

function validateAppointment({ clientName, serviceName, appointmentDate, appointmentTime }) {
  if (!clientName || !serviceName || !appointmentDate || !appointmentTime) {
    throw httpError(400, "Cliente, servicio, fecha y hora son obligatorios");
  }
}
