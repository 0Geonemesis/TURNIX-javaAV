// Helper pequeno para crear errores con codigo HTTP.
// Ejemplo: throw httpError(400, "Correo invalido")
export function httpError(status, message) {
  const error = new Error(message);
  error.status = status;
  return error;
}
