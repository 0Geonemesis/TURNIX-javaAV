import { apiClient } from "./apiClient";

// Trae todas las citas.
export function getAppointments() {
  return apiClient.get("/appointments");
}

// Crea una cita nueva.
export function createAppointment(payload) {
  return apiClient.post("/appointments", payload);
}

// Actualiza una cita existente.
export function updateAppointment(id, payload) {
  return apiClient.put(`/appointments/${id}`, payload);
}

// Elimina una cita existente.
export function deleteAppointment(id) {
  return apiClient.delete(`/appointments/${id}`);
}
