import { pool } from "../config/database.js";
import { httpError } from "../utils/httpError.js";

// Devuelve todos los clientes ordenados del mas reciente al mas antiguo.
export async function getClients(req, res, next) {
  try {
    const [clients] = await pool.query("SELECT * FROM clients ORDER BY created_at DESC");
    res.json({ clients });
  } catch (error) {
    next(error);
  }
}

// Crea un nuevo cliente desde el formulario del frontend.
export async function createClient(req, res, next) {
  try {
    const { fullName, email, phone, documentNumber, notes } = req.body;

    if (!fullName) {
      throw httpError(400, "El nombre del cliente es obligatorio");
    }

    const [result] = await pool.query(
      "INSERT INTO clients (full_name, email, phone, document_number, notes) VALUES (?, ?, ?, ?, ?)",
      [fullName.trim(), email || null, phone || null, documentNumber || null, notes || null]
    );

    res.status(201).json({
      message: "Cliente creado correctamente",
      client: { id: result.insertId, full_name: fullName, email, phone, document_number: documentNumber, notes }
    });
  } catch (error) {
    next(error);
  }
}

// Actualiza los datos de un cliente existente.
export async function updateClient(req, res, next) {
  try {
    const { id } = req.params;
    const { fullName, email, phone, documentNumber, notes } = req.body;

    if (!fullName) {
      throw httpError(400, "El nombre del cliente es obligatorio");
    }

    const [result] = await pool.query(
      "UPDATE clients SET full_name = ?, email = ?, phone = ?, document_number = ?, notes = ? WHERE id = ?",
      [fullName.trim(), email || null, phone || null, documentNumber || null, notes || null, id]
    );

    if (result.affectedRows === 0) {
      throw httpError(404, "Cliente no encontrado");
    }

    res.json({ message: "Cliente actualizado correctamente" });
  } catch (error) {
    next(error);
  }
}

// Elimina un cliente. Las citas relacionadas quedan con client_id en null.
export async function deleteClient(req, res, next) {
  try {
    const { id } = req.params;
    const [result] = await pool.query("DELETE FROM clients WHERE id = ?", [id]);

    if (result.affectedRows === 0) {
      throw httpError(404, "Cliente no encontrado");
    }

    res.json({ message: "Cliente eliminado correctamente" });
  } catch (error) {
    next(error);
  }
}
