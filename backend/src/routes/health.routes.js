import { Router } from "express";
import { getHealth } from "../controllers/health.controller.js";

// Router permite separar las rutas por modulo.
const router = Router();

// GET /api/health revisa API y conexion MySQL.
router.get("/", getHealth);

export default router;
