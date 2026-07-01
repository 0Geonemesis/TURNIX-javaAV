import axios from "axios";

// Cliente centralizado de Axios.
// Todas las llamadas al backend deben salir desde aqui o desde servicios que usen este cliente.
export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:4000/api",
  headers: {
    "Content-Type": "application/json"
  }
});

apiClient.interceptors.request.use((config) => {
  const rawSession = localStorage.getItem("turn0_user");

  if (rawSession) {
    try {
      const session = JSON.parse(rawSession);
      config.headers["x-user-role"] = session.role;
    } catch {
      localStorage.removeItem("turn0_user");
    }
  }

  return config;
});

// Normaliza errores comunes para que las paginas muestren mensajes claros.
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (!error.response) {
      error.friendlyMessage = "No hay conexion con el servidor. Revisa que el backend este encendido.";
    } else if (error.response.status === 503) {
      error.friendlyMessage = "La base de datos no responde. Revisa MySQL y backend/.env.";
    } else {
      error.friendlyMessage = error.response.data?.message || "Ocurrio un error inesperado.";
    }

    return Promise.reject(error);
  }
);
