import { apiClient } from "./apiClient";

// Trae todos los clientes guardados en MySQL.
export function getClients() {
  return apiClient.get("/clients");
}

// Crea un cliente nuevo.
export function createClient(payload) {
  return apiClient.post("/clients", payload);
}

// Actualiza un cliente existente.
export function updateClient(id, payload) {
  return apiClient.put(`/clients/${id}`, payload);
}

// Elimina un cliente existente.
export function deleteClient(id) {
  return apiClient.delete(`/clients/${id}`);
}
