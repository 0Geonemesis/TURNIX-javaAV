import { Router } from "express";
import { createClient, deleteClient, getClients, updateClient } from "../controllers/client.controller.js";

const router = Router();

// Rutas CRUD de clientes.
router.get("/", getClients);
router.post("/", createClient);
router.put("/:id", updateClient);
router.delete("/:id", deleteClient);

export default router;
