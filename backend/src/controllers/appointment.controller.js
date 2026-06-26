import { pool } from "../config/database.js";
import { httpError } from "../utils/httpError.js";

// Lista las citas junto con informacion basica del cliente relacionado.
export async function getAppointments(req, res, next) {
  try {
    const [appointments] = await pool.query(
      `SELECT appointments.*, clients.phone AS client_phone
       FROM appointments
       LEFT JOIN clients ON appointments.client_id = clients.id
       ORDER BY appointment_date DESC, appointment_time DESC`
    );
    res.json({ appointments });
  } catch (error) {
    next(error);
  }
}

// Crea una cita. Puede ligarse a un cliente existente o usar un nombre manual.
export async function createAppointment(req, res, next) {
  try {
    const { clientId, clientName, serviceName, appointmentDate, appointmentTime, status, notes } = req.body;

    if (!clientName || !serviceName || !appointmentDate || !appointmentTime) {
      throw httpError(400, "Cliente, servicio, fecha y hora son obligatorios");
    }

    const [result] = await pool.query(
      `INSERT INTO appointments
       (client_id, client_name, service_name, appointment_date, appointment_time, status, notes)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [clientId || null, clientName.trim(), serviceName.trim(), appointmentDate, appointmentTime, status || "pendiente", notes || null]
    );

    res.status(201).json({ message: "Cita creada correctamente", id: result.insertId });
  } catch (error) {
    next(error);
  }
}

// Actualiza los campos principales de una cita.
export async function updateAppointment(req, res, next) {
  try {
    const { id } = req.params;
    const { clientId, clientName, serviceName, appointmentDate, appointmentTime, status, notes } = req.body;

    if (!clientName || !serviceName || !appointmentDate || !appointmentTime) {
      throw httpError(400, "Cliente, servicio, fecha y hora son obligatorios");
    }

    const [result] = await pool.query(
      `UPDATE appointments
       SET client_id = ?, client_name = ?, service_name = ?, appointment_date = ?, appointment_time = ?, status = ?, notes = ?
       WHERE id = ?`,
      [clientId || null, clientName.trim(), serviceName.trim(), appointmentDate, appointmentTime, status || "pendiente", notes || null, id]
    );

    if (result.affectedRows === 0) {
      throw httpError(404, "Cita no encontrada");
    }

    res.json({ message: "Cita actualizada correctamente" });
  } catch (error) {
    next(error);
  }
}

// Elimina una cita por su id.
export async function deleteAppointment(req, res, next) {
  try {
    const { id } = req.params;
    const [result] = await pool.query("DELETE FROM appointments WHERE id = ?", [id]);

    if (result.affectedRows === 0) {
      throw httpError(404, "Cita no encontrada");
    }

    res.json({ message: "Cita eliminada correctamente" });
  } catch (error) {
    next(error);
  }
}
