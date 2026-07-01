import { pool } from "../config/database.js";
import { httpError } from "../utils/httpError.js";

export async function listClients() {
  const [clients] = await pool.query("SELECT * FROM clients ORDER BY created_at DESC");
  return clients;
}

export async function createClientRecord({ fullName, email, phone, documentNumber, notes }) {
  if (!fullName) {
    throw httpError(400, "El nombre del cliente es obligatorio");
  }

  const [result] = await pool.query(
    "INSERT INTO clients (full_name, email, phone, document_number, notes) VALUES (?, ?, ?, ?, ?)",
    [fullName.trim(), normalizeNullable(email), normalizeNullable(phone), normalizeNullable(documentNumber), normalizeNullable(notes)]
  );

  return { id: result.insertId };
}

export async function updateClientRecord(id, { fullName, email, phone, documentNumber, notes }) {
  if (!fullName) {
    throw httpError(400, "El nombre del cliente es obligatorio");
  }

  const [result] = await pool.query(
    "UPDATE clients SET full_name = ?, email = ?, phone = ?, document_number = ?, notes = ? WHERE id = ?",
    [fullName.trim(), normalizeNullable(email), normalizeNullable(phone), normalizeNullable(documentNumber), normalizeNullable(notes), id]
  );

  if (result.affectedRows === 0) {
    throw httpError(404, "Cliente no encontrado");
  }
}

export async function deleteClientRecord(id) {
  const [result] = await pool.query("DELETE FROM clients WHERE id = ?", [id]);

  if (result.affectedRows === 0) {
    throw httpError(404, "Cliente no encontrado");
  }
}

function normalizeNullable(value) {
  return value && String(value).trim() ? String(value).trim() : null;
}
