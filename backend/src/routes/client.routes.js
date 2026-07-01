import { Router } from "express";
import { createClient, deleteClient, getClients, updateClient } from "../controllers/client.controller.js";
import { requireRoles } from "../middlewares/roleGuard.js";

const router = Router();

// Rutas CRUD de clientes.
router.get("/", requireRoles(["administrador", "dueno_negocio"]), getClients);
router.post("/", requireRoles(["administrador", "dueno_negocio"]), createClient);
router.put("/:id", requireRoles(["administrador", "dueno_negocio"]), updateClient);
router.delete("/:id", requireRoles(["administrador", "dueno_negocio"]), deleteClient);

export default router;
