import { createTurnRecord, deleteTurnRecord, listTurns, updateTurnRecord } from "../services/turn.service.js";

// Lista los turnos del mas nuevo al mas antiguo.
export async function getTurns(req, res, next) {
  try {
    res.json({ turns: await listTurns() });
  } catch (error) {
    next(error);
  }
}

// Crea un turno de atencion.
export async function createTurn(req, res, next) {
  try {
    const turn = await createTurnRecord(req.body);
    res.status(201).json({ message: "Turno creado correctamente", turn });
  } catch (error) {
    next(error);
  }
}

// Actualiza un turno existente.
export async function updateTurn(req, res, next) {
  try {
    await updateTurnRecord(req.params.id, req.body);
    res.json({ message: "Turno actualizado correctamente" });
  } catch (error) {
    next(error);
  }
}

// Elimina un turno por su id.
export async function deleteTurn(req, res, next) {
  try {
    await deleteTurnRecord(req.params.id);
    res.json({ message: "Turno eliminado correctamente" });
  } catch (error) {
    next(error);
  }
}
