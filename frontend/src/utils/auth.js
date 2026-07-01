const SESSION_KEY = "turn0_user";

// Guarda la sesion simple del usuario autenticado.
export function saveSession(user) {
  localStorage.setItem(SESSION_KEY, JSON.stringify(user));
}

// Lee la sesion actual. Si no existe o esta corrupta, devuelve null.
export function getSession() {
  try {
    const rawSession = localStorage.getItem(SESSION_KEY);
    return rawSession ? JSON.parse(rawSession) : null;
  } catch {
    localStorage.removeItem(SESSION_KEY);
    return null;
  }
}

// Cierra la sesion local.
export function clearSession() {
  localStorage.removeItem(SESSION_KEY);
}

// Permisos visuales por rol. En un siguiente sprint esto debe validarse tambien con JWT en backend.
export function getRolePermissions(role) {
  const permissions = {
    administrador: {
      label: "Administrador",
      tabs: ["clientes", "citas", "turnos", "reportes"],
      canManage: true,
      canViewReports: true
    },
    dueno_negocio: {
      label: "Dueno de negocio",
      tabs: ["clientes", "citas", "turnos", "reportes"],
      canManage: true,
      canViewReports: true
    },
    cliente: {
      label: "Cliente",
      tabs: ["citas"],
      canManage: false,
      canViewReports: false
    }
  };

  return permissions[role] || permissions.cliente;
}
