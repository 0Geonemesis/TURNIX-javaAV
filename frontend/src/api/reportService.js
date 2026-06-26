import { apiClient } from "./apiClient";

// Trae metricas calculadas para dashboard y reportes.
export function getReportSummary() {
  return apiClient.get("/reports/summary");
}
