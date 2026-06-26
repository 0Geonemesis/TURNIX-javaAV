import { apiClient } from "./apiClient";

// Servicio para traer la lista de servicios que se muestra en Inicio.
export function getServices() {
  return apiClient.get("/services");
}
