import { checkDatabaseConnection } from "../config/database.js";

// Controlador de salud del sistema.
// En Sprint 1 nos ayuda a confirmar que Express y MySQL estan conectados.
export async function getHealth(req, res) {
  try {
    await checkDatabaseConnection();

    res.json({
      api: "ok",
      database: "ok",
      message: "TURN0 esta conectado correctamente"
    });
  } catch (error) {
    res.status(500).json({
      api: "ok",
      database: "error",
      message: "La API responde, pero MySQL no esta conectado",
      detail: error.message
    });
  }
}
