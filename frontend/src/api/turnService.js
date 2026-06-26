import { apiClient } from "./apiClient";

// Trae todos los turnos.
export function getTurns() {
  return apiClient.get("/turns");
}

// Crea un turno nuevo.
export function createTurn(payload) {
  return apiClient.post("/turns", payload);
}

// Actualiza un turno existente.
export function updateTurn(id, payload) {
  return apiClient.put(`/turns/${id}`, payload);
}

// Elimina un turno existente.
export function deleteTurn(id) {
  return apiClient.delete(`/turns/${id}`);
}
