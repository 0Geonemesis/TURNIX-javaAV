import { Router } from "express";
import { getReportSummary } from "../controllers/report.controller.js";
import { requireRoles } from "../middlewares/roleGuard.js";

const router = Router();

// Reporte calculado con datos actuales del sistema.
router.get("/summary", requireRoles(["administrador", "dueno_negocio"]), getReportSummary);

export default router;
