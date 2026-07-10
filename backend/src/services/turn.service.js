import { pool } from "../config/database.js";
import { httpError } from "../utils/httpError.js";

const VALID_TURN_STATUSES = ["esperando", "en_atencion", "atendido", "cancelado"];
const VALID_PRIORITIES = ["normal", "preferencial"];

export async function listTurns() {
  const [turns] = await pool.query("SELECT * FROM turns ORDER BY created_at DESC");
  return turns;
}

export async function createTurnRecord({ turnCode, clientName, serviceName, status = "esperando", priority = "normal" }) {
  validateTurn({ turnCode, clientName, serviceName, status, priority });

  const [result] = await pool.query(
    "INSERT INTO turns (turn_code, client_name, service_name, status, priority, attended_at) VALUES (?, ?, ?, ?, ?, ?)",
    [
      turnCode.trim(),
      clientName.trim(),
      serviceName.trim(),
      status,
      priority,
      status === "atendido" ? new Date() : null
    ]
  );

  return { id: result.insertId };
}

export async function updateTurnRecord(id, { turnCode, clientName, serviceName, status = "esperando", priority = "normal" }) {
  validateTurn({ turnCode, clientName, serviceName, status, priority });

  const [currentRows] = await pool.query("SELECT status FROM turns WHERE id = ?", [id]);
  if (currentRows.length === 0) {
    throw httpError(404, "Turno no encontrado");
  }

  if (currentRows[0].status === "atendido" && status !== "atendido") {
    throw httpError(409, "Un ticket atendido no puede volver a estados anteriores");
  }

  const attendedAtExpression = status === "atendido" ? "COALESCE(attended_at, CURRENT_TIMESTAMP)" : "NULL";
  const [result] = await pool.query(
    `UPDATE turns
     SET turn_code = ?, client_name = ?, service_name = ?, status = ?, priority = ?, attended_at = ${attendedAtExpression}
     WHERE id = ?`,
    [turnCode.trim(), clientName.trim(), serviceName.trim(), status, priority, id]
  );

  if (result.affectedRows === 0) {
    throw httpError(404, "Turno no encontrado");
  }
}

export async function deleteTurnRecord(id) {
  const [rows] = await pool.query("SELECT status FROM turns WHERE id = ?", [id]);
  if (rows.length === 0) {
    throw httpError(404, "Turno no encontrado");
  }

  if (rows[0].status === "atendido") {
    throw httpError(409, "No se puede borrar un ticket que ya fue atendido");
  }

  await pool.query("DELETE FROM turns WHERE id = ?", [id]);
}

function validateTurn({ turnCode, clientName, serviceName, status, priority }) {
  if (!turnCode || !clientName || !serviceName) {
    throw httpError(400, "Codigo, cliente y servicio son obligatorios");
  }

  if (status && !VALID_TURN_STATUSES.includes(status)) {
    throw httpError(400, "Estado de turno no permitido");
  }

  if (priority && !VALID_PRIORITIES.includes(priority)) {
    throw httpError(400, "Prioridad de turno no permitida");
  }
}
