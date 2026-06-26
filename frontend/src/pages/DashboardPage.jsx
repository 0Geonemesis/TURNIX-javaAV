import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getReportSummary } from "../api/reportService";
import PageHeader from "../components/PageHeader.jsx";

const emptySummary = {
  clients: 0,
  appointments: 0,
  turns: 0,
  pendingAppointments: 0,
  activeTurns: 0
};

// Dashboard principal con metricas reales calculadas desde MySQL.
export default function DashboardPage() {
  const [summary, setSummary] = useState(emptySummary);
  const [recentAppointments, setRecentAppointments] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    getReportSummary()
      .then((response) => {
        setSummary(response.data.summary);
        setRecentAppointments(response.data.recentAppointments);
      })
      .catch(() => {
        setMessage("No se pudieron cargar las metricas. Revisa que MySQL este configurado.");
      });
  }, []);

  const cards = [
    { label: "Clientes", value: summary.clients, detail: "Clientes registrados" },
    { label: "Citas", value: summary.appointments, detail: "Citas totales" },
    { label: "Citas pendientes", value: summary.pendingAppointments, detail: "Pendientes o confirmadas" },
    { label: "Turnos activos", value: summary.activeTurns, detail: "Esperando o en atencion" }
  ];

  return (
    <>
      <PageHeader title="Dashboard Turnix" description="Resumen general de clientes, citas, turnos y actividad reciente." />

      {message && <div className="alert alert-warning">{message}</div>}

      <section className="row g-3">
        {cards.map((card) => (
          <div className="col-md-6 col-xl-3" key={card.label}>
            <article className="metric-card">
              <span>{card.label}</span>
              <strong>{card.value}</strong>
              <p>{card.detail}</p>
            </article>
          </div>
        ))}
      </section>

      <section className="content-panel mt-4">
        <div className="section-row">
          <div>
            <h2>Actividad reciente</h2>
            <p>Ultimas citas registradas en Turnix.</p>
          </div>
          <Link className="btn btn-primary" to="/negocio">
            Ir a gestion
          </Link>
        </div>

        <div className="table-responsive">
          <table className="table table-hover align-middle">
            <thead>
              <tr>
                <th>Cliente</th>
                <th>Servicio</th>
                <th>Fecha</th>
                <th>Hora</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              {recentAppointments.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center text-muted py-4">
                    Todavia no hay citas registradas.
                  </td>
                </tr>
              ) : (
                recentAppointments.map((appointment) => (
                  <tr key={appointment.id}>
                    <td>{appointment.client_name}</td>
                    <td>{appointment.service_name}</td>
                    <td>{formatDisplayDate(appointment.appointment_date)}</td>
                    <td>{String(appointment.appointment_time || "").slice(0, 5)}</td>
                    <td>{appointment.status}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}

function formatDisplayDate(value) {
  if (!value) return "-";
  return new Date(value).toLocaleDateString("es-PE", { timeZone: "UTC" });
}
