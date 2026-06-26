// Middleware global de errores.
// Si una ruta hace next(error), Express llega aqui y responde de forma ordenada.
export function errorHandler(error, req, res, next) {
  console.error(error);

  res.status(error.status || 500).json({
    message: error.message || "Error interno del servidor"
  });
}
