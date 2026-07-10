import { apiClient } from "./apiClient";

// Servicio para registrar usuarios usando la API .
export function registerUser(payload) {
  return apiClient.post("/auth/register", payload);
}

// Servicio para iniciar sesion 
export function loginUser(payload) {
  return apiClient.post("/auth/login", payload);
}

// Servicio para traer los roles permitidos desde el backend.
export function getRoles() {
  return apiClient.get("/users/roles");
}
