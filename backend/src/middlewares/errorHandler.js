// Middleware global de errores.
// Si una ruta hace next(error), Express llega aqui y responde de forma ordenada.
export function errorHandler(error, req, res, next) {
  console.error(error);

  if (error.code === "ER_DUP_ENTRY") {
    return res.status(409).json({
      message: "Ya existe un registro con esos datos. Revisa duplicados de usuario, cliente, cita o ticket."
    });
  }

  if (["ECONNREFUSED", "ER_BAD_DB_ERROR", "ER_ACCESS_DENIED_ERROR"].includes(error.code)) {
    return res.status(503).json({
      message: "No se pudo conectar con la base de datos. Revisa MySQL y el archivo .env."
    });
  }

  res.status(error.status || 500).json({
    message: error.message || "Error interno del servidor"
  });
}
