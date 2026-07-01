import { buildReportSummary } from "../services/report.service.js";

// Calcula metricas principales usando clientes, citas y turnos.
export async function getReportSummary(req, res, next) {
  try {
    res.json(await buildReportSummary());
  } catch (error) {
    next(error);
  }
}
