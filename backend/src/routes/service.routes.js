import { Router } from "express";
import { getServices } from "../controllers/service.controller.js";

const router = Router();

// GET /api/services alimenta la pagina de inicio de TURN0.
router.get("/", getServices);

export default router;
