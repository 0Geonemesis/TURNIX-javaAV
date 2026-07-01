import {
  createAppointmentRecord,
  deleteAppointmentRecord,
  listAppointments,
  updateAppointmentRecord
} from "../services/appointment.service.js";

// Lista las citas junto con informacion basica del cliente relacionado.
export async function getAppointments(req, res, next) {
  try {
    res.json({ appointments: await listAppointments() });
  } catch (error) {
    next(error);
  }
}

// Crea una cita. Puede ligarse a un cliente existente o usar un nombre manual.
export async function createAppointment(req, res, next) {
  try {
    const appointment = await createAppointmentRecord(req.body);
    res.status(201).json({ message: "Cita creada correctamente", appointment });
  } catch (error) {
    next(error);
  }
}

// Actualiza los campos principales de una cita.
export async function updateAppointment(req, res, next) {
  try {
    await updateAppointmentRecord(req.params.id, req.body);
    res.json({ message: "Cita actualizada correctamente" });
  } catch (error) {
    next(error);
  }
}

// Elimina una cita por su id.
export async function deleteAppointment(req, res, next) {
  try {
    await deleteAppointmentRecord(req.params.id);
    res.json({ message: "Cita eliminada correctamente" });
  } catch (error) {
    next(error);
  }
}
