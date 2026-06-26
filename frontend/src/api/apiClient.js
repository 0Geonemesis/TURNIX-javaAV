import axios from "axios";

// Cliente centralizado de Axios.
// Todas las llamadas al backend deben salir desde aqui o desde servicios que usen este cliente.
export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:4000/api",
  headers: {
    "Content-Type": "application/json"
  }
});
