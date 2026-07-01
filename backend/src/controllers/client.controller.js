import { createClientRecord, deleteClientRecord, listClients, updateClientRecord } from "../services/client.service.js";

// Devuelve todos los clientes ordenados del mas reciente al mas antiguo.
export async function getClients(req, res, next) {
  try {
    res.json({ clients: await listClients() });
  } catch (error) {
    next(error);
  }
}

// Crea un nuevo cliente desde el formulario del frontend.
export async function createClient(req, res, next) {
  try {
    const client = await createClientRecord(req.body);
    res.status(201).json({
      message: "Cliente creado correctamente",
      client
    });
  } catch (error) {
    next(error);
  }
}

// Actualiza los datos de un cliente existente.
export async function updateClient(req, res, next) {
  try {
    await updateClientRecord(req.params.id, req.body);
    res.json({ message: "Cliente actualizado correctamente" });
  } catch (error) {
    next(error);
  }
}

// Elimina un cliente. Las citas relacionadas quedan con client_id en null.
export async function deleteClient(req, res, next) {
  try {
    await deleteClientRecord(req.params.id);
    res.json({ message: "Cliente eliminado correctamente" });
  } catch (error) {
    next(error);
  }
}
