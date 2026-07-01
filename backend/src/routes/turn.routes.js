import { Router } from "express";
import { createTurn, deleteTurn, getTurns, updateTurn } from "../controllers/turn.controller.js";
import { requireRoles } from "../middlewares/roleGuard.js";

const router = Router();

// Rutas CRUD de turnos.
router.get("/", requireRoles(["administrador", "dueno_negocio"]), getTurns);
router.post("/", requireRoles(["administrador", "dueno_negocio"]), createTurn);
router.put("/:id", requireRoles(["administrador", "dueno_negocio"]), updateTurn);
router.delete("/:id", requireRoles(["administrador", "dueno_negocio"]), deleteTurn);

export default router;
