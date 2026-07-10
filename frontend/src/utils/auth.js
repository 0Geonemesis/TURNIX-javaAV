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
      canViewReports: true,
      flowTitle: "Flujo administrador",
      flowSteps: [
        "Revisar el dashboard general",
        "Supervisar clientes, citas y turnos",
        "Validar reportes y descargar PDF",
        "Controlar errores operativos y datos duplicados"
      ]
    },
    dueno_negocio: {
      label: "Vendedor / negocio",
      tabs: ["clientes", "citas", "turnos", "reportes"],
      canManage: true,
      canViewReports: true,
      flowTitle: "Flujo vendedor / negocio",
      flowSteps: [
        "Registrar clientes",
        "Agendar citas",
        "Gestionar turnos de atencion",
        "Revisar reportes del negocio"
      ]
    },
    cliente: {
      label: "Cliente",
      tabs: ["citas"],
      canManage: false,
      canViewReports: false,
      flowTitle: "Flujo cliente",
      flowSteps: [
        "Ingresar al sistema",
        "Crear o revisar sus citas",
        "Ver el cronometro de su proxima cita",
        "Consultar el estado de sus reservas"
      ]
    }
  };

  return permissions[role] || permissions.cliente;
}
