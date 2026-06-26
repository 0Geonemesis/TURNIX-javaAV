import { Router } from "express";
import { createTurn, deleteTurn, getTurns, updateTurn } from "../controllers/turn.controller.js";

const router = Router();

// Rutas CRUD de turnos.
router.get("/", getTurns);
router.post("/", createTurn);
router.put("/:id", updateTurn);
router.delete("/:id", deleteTurn);

export default router;
