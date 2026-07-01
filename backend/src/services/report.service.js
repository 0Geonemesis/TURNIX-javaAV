import { pool } from "../config/database.js";

export async function buildReportSummary() {
  const [[clientCount]] = await pool.query("SELECT COUNT(*) AS total FROM clients");
  const [[appointmentCount]] = await pool.query("SELECT COUNT(*) AS total FROM appointments");
  const [[turnCount]] = await pool.query("SELECT COUNT(*) AS total FROM turns");
  const [[attentionCount]] = await pool.query("SELECT COUNT(*) AS total FROM attentions");
  const [[pendingAppointments]] = await pool.query("SELECT COUNT(*) AS total FROM appointments WHERE status IN ('pendiente', 'confirmada')");
  const [[activeTurns]] = await pool.query("SELECT COUNT(*) AS total FROM turns WHERE status IN ('esperando', 'en_atencion')");
  const [[attendedTurns]] = await pool.query("SELECT COUNT(*) AS total FROM turns WHERE status = 'atendido'");
  const [[averageAttention]] = await pool.query("SELECT COALESCE(ROUND(AVG(duration_minutes)), 0) AS total FROM attentions WHERE status = 'completada'");

  const [appointmentStatus] = await pool.query("SELECT status, COUNT(*) AS total FROM appointments GROUP BY status");
  const [turnStatus] = await pool.query("SELECT status, COUNT(*) AS total FROM turns GROUP BY status");
  const [recentAppointments] = await pool.query(
    "SELECT id, client_name, service_name, appointment_date, appointment_time, status FROM appointments ORDER BY created_at DESC LIMIT 8"
  );
  const [monthlyAppointments] = await pool.query(
    `SELECT id, client_name, service_name, appointment_date, appointment_time, status
     FROM appointments
     WHERE appointment_date BETWEEN DATE_SUB(CURDATE(), INTERVAL 2 MONTH) AND DATE_ADD(CURDATE(), INTERVAL 2 MONTH)
     ORDER BY appointment_date ASC, appointment_time ASC`
  );

  return {
    summary: {
      clients: clientCount.total,
      appointments: appointmentCount.total,
      turns: turnCount.total,
      attentions: attentionCount.total,
      pendingAppointments: pendingAppointments.total,
      activeTurns: activeTurns.total,
      attendedTurns: attendedTurns.total,
      averageAttentionMinutes: averageAttention.total
    },
    appointmentStatus,
    turnStatus,
    recentAppointments,
    monthlyAppointments
  };
}
