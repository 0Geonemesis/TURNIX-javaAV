import { httpError } from "../utils/httpError.js";

// Proteccion basica por rol para este sprint.
// En produccion esto debe reemplazarse por JWT firmado desde el backend.
export function requireRoles(allowedRoles) {
  return (req, res, next) => {
    const role = req.headers["x-user-role"];

    if (!role) {
      return next(httpError(401, "Debes iniciar sesion para usar este modulo"));
    }

    if (!allowedRoles.includes(role)) {
      return next(httpError(403, "Tu rol no tiene permiso para realizar esta accion"));
    }

    next();
  };
}
