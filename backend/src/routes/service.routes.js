import { Router } from "express";
import { getServices } from "../controllers/service.controller.js";

const router = Router();

// GET /api/services alimenta la pagina de inicio de Turnix.
router.get("/", getServices);

export default router;
