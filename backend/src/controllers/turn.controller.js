import { pool } from "../config/database.js";
import { httpError } from "../utils/httpError.js";

// Lista los turnos del mas nuevo al mas antiguo.
export async function getTurns(req, res, next) {
  try {
    const [turns] = await pool.query("SELECT * FROM turns ORDER BY created_at DESC");
    res.json({ turns });
  } catch (error) {
    next(error);
  }
}

// Crea un turno de atencion.
export async function createTurn(req, res, next) {
  try {
    const { turnCode, clientName, serviceName, status, priority } = req.body;

    if (!turnCode || !clientName || !serviceName) {
      throw httpError(400, "Codigo, cliente y servicio son obligatorios");
    }

    const [result] = await pool.query(
      "INSERT INTO turns (turn_code, client_name, service_name, status, priority) VALUES (?, ?, ?, ?, ?)",
      [turnCode.trim(), clientName.trim(), serviceName.trim(), status || "esperando", priority || "normal"]
    );

    res.status(201).json({ message: "Turno creado correctamente", id: result.insertId });
  } catch (error) {
    next(error);
  }
}

// Actualiza un turno existente.
export async function updateTurn(req, res, next) {
  try {
    const { id } = req.params;
    const { turnCode, clientName, serviceName, status, priority } = req.body;

    if (!turnCode || !clientName || !serviceName) {
      throw httpError(400, "Codigo, cliente y servicio son obligatorios");
    }

    const [result] = await pool.query(
      "UPDATE turns SET turn_code = ?, client_name = ?, service_name = ?, status = ?, priority = ? WHERE id = ?",
      [turnCode.trim(), clientName.trim(), serviceName.trim(), status || "esperando", priority || "normal", id]
    );

    if (result.affectedRows === 0) {
      throw httpError(404, "Turno no encontrado");
    }

    res.json({ message: "Turno actualizado correctamente" });
  } catch (error) {
    next(error);
  }
}

// Elimina un turno por su id.
export async function deleteTurn(req, res, next) {
  try {
    const { id } = req.params;
    const [result] = await pool.query("DELETE FROM turns WHERE id = ?", [id]);

    if (result.affectedRows === 0) {
      throw httpError(404, "Turno no encontrado");
    }

    res.json({ message: "Turno eliminado correctamente" });
  } catch (error) {
    next(error);
  }
}
