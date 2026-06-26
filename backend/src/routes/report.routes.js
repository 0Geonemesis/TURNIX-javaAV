import { Router } from "express";
import { getReportSummary } from "../controllers/report.controller.js";

const router = Router();

// Reporte calculado con datos actuales del sistema.
router.get("/summary", getReportSummary);

export default router;
