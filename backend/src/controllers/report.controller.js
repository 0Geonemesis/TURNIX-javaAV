import { pool } from "../config/database.js";

// Calcula metricas principales usando clientes, citas y turnos.
export async function getReportSummary(req, res, next) {
  try {
    const [[clientCount]] = await pool.query("SELECT COUNT(*) AS total FROM clients");
    const [[appointmentCount]] = await pool.query("SELECT COUNT(*) AS total FROM appointments");
    const [[turnCount]] = await pool.query("SELECT COUNT(*) AS total FROM turns");
    const [[pendingAppointments]] = await pool.query("SELECT COUNT(*) AS total FROM appointments WHERE status IN ('pendiente', 'confirmada')");
    const [[activeTurns]] = await pool.query("SELECT COUNT(*) AS total FROM turns WHERE status IN ('esperando', 'en_atencion')");

    const [appointmentStatus] = await pool.query("SELECT status, COUNT(*) AS total FROM appointments GROUP BY status");
    const [turnStatus] = await pool.query("SELECT status, COUNT(*) AS total FROM turns GROUP BY status");
    const [recentAppointments] = await pool.query(
      "SELECT id, client_name, service_name, appointment_date, appointment_time, status FROM appointments ORDER BY created_at DESC LIMIT 5"
    );

    res.json({
      summary: {
        clients: clientCount.total,
        appointments: appointmentCount.total,
        turns: turnCount.total,
        pendingAppointments: pendingAppointments.total,
        activeTurns: activeTurns.total
      },
      appointmentStatus,
      turnStatus,
      recentAppointments
    });
  } catch (error) {
    next(error);
  }
}
