import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { getAppointments } from "../api/appointmentService";
import { getReportSummary } from "../api/reportService";
import AppointmentCountdown from "../components/AppointmentCountdown.jsx";
import PageHeader from "../components/PageHeader.jsx";
import { getRolePermissions, getSession } from "../utils/auth";

const emptySummary = {
  clients: 0,
  appointments: 0,
  turns: 0,
  attentions: 0,
  pendingAppointments: 0,
  activeTurns: 0,
  attendedTurns: 0,
  averageAttentionMinutes: 0
};

// Dashboard principal con metricas reales y calendario mensual de citas.
export default function DashboardPage() {
  const session = getSession();
  const permissions = getRolePermissions(session?.role);
  const [summary, setSummary] = useState(emptySummary);
  const [recentAppointments, setRecentAppointments] = useState([]);
  const [monthlyAppointments, setMonthlyAppointments] = useState([]);
  const [message, setMessage] = useState("");
  const [currentMonth, setCurrentMonth] = useState(new Date());

  useEffect(() => {
    if (permissions.canViewReports) {
      getReportSummary()
        .then((response) => {
          setSummary(response.data.summary);
          setRecentAppointments(response.data.recentAppointments);
          setMonthlyAppointments(response.data.monthlyAppointments);
        })
        .catch((error) => {
          setMessage(error.friendlyMessage || "No se pudieron cargar las metricas.");
        });
      return;
    }

    getAppointments()
      .then((response) => {
        const appointments = response.data.appointments.filter((appointment) => {
          return appointment.client_name?.toLowerCase() === session?.fullName?.toLowerCase();
        });
        setSummary({
          ...emptySummary,
          appointments: appointments.length,
          pendingAppointments: appointments.filter((item) => ["pendiente", "confirmada"].includes(item.status)).length
        });
        setRecentAppointments(appointments.slice(0, 8));
        setMonthlyAppointments(appointments);
      })
      .catch((error) => {
        setMessage(error.friendlyMessage || "No se pudieron cargar tus citas.");
      });
  }, [permissions.canViewReports]);

  const cards = [
    { label: "Clientes", value: summary.clients, detail: "Registrados" },
    { label: "Citas", value: summary.appointments, detail: "Agendadas" },
    { label: "Atenciones", value: summary.attentions, detail: "Completadas o registradas" },
    { label: "Promedio", value: `${summary.averageAttentionMinutes} min`, detail: "Tiempo de atencion" }
  ];

  const calendarDays = useMemo(() => buildCalendarDays(currentMonth, monthlyAppointments), [currentMonth, monthlyAppointments]);

  function moveMonth(amount) {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + amount, 1));
  }

  return (
    <>
      <PageHeader title="Dashboard TURN0" description="Resumen operativo, calendario mensual y ultimas citas agendadas." />

      {message && <div className="alert alert-warning">{message}</div>}

      <AppointmentCountdown appointments={monthlyAppointments} title={permissions.canManage ? "Proxima cita agendada" : "Tu proxima cita"} />

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
            <h2>Calendario mensual de citas</h2>
            <p>{currentMonth.toLocaleDateString("es-PE", { month: "long", year: "numeric" })}</p>
          </div>
          <div className="toolbar-actions">
            <button className="btn btn-outline-secondary" type="button" onClick={() => moveMonth(-1)}>Anterior</button>
            <button className="btn btn-outline-secondary" type="button" onClick={() => setCurrentMonth(new Date())}>Hoy</button>
            <button className="btn btn-outline-secondary" type="button" onClick={() => moveMonth(1)}>Siguiente</button>
            <Link className="btn btn-primary" to="/negocio">Gestionar</Link>
          </div>
        </div>

        <div className="calendar-grid">
          {["Lun", "Mar", "Mie", "Jue", "Vie", "Sab", "Dom"].map((day) => (
            <strong className="calendar-weekday" key={day}>{day}</strong>
          ))}
          {calendarDays.map((day) => (
            <article className={`calendar-day ${day.isCurrentMonth ? "" : "muted"}`} key={day.key}>
              <span>{day.date.getDate()}</span>
              <div>
                {day.appointments.slice(0, 3).map((appointment) => (
                  <p className="calendar-event" key={appointment.id}>
                    {String(appointment.appointment_time || "").slice(0, 5)} {appointment.client_name}
                  </p>
                ))}
                {day.appointments.length > 3 && <small>+{day.appointments.length - 3} mas</small>}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="content-panel mt-4">
        <div className="section-row">
          <div>
            <h2>Actividad reciente</h2>
            <p>Ultimas citas registradas en TURN0.</p>
          </div>
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
                <tr><td colSpan="5" className="text-center text-muted py-4">Todavia no hay citas registradas.</td></tr>
              ) : recentAppointments.map((appointment) => (
                <tr key={appointment.id}>
                  <td>{appointment.client_name}</td>
                  <td>{appointment.service_name}</td>
                  <td>{formatDisplayDate(appointment.appointment_date)}</td>
                  <td>{String(appointment.appointment_time || "").slice(0, 5)}</td>
                  <td>{appointment.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}

function buildCalendarDays(month, appointments) {
  const year = month.getFullYear();
  const monthIndex = month.getMonth();
  const firstDay = new Date(year, monthIndex, 1);
  const startOffset = (firstDay.getDay() + 6) % 7;
  const startDate = new Date(year, monthIndex, 1 - startOffset);

  return Array.from({ length: 42 }, (_, index) => {
    const date = new Date(startDate);
    date.setDate(startDate.getDate() + index);
    const key = date.toISOString().slice(0, 10);

    return {
      key,
      date,
      isCurrentMonth: date.getMonth() === monthIndex,
      appointments: appointments.filter((appointment) => String(appointment.appointment_date).slice(0, 10) === key)
    };
  });
}

function formatDisplayDate(value) {
  if (!value) return "-";
  return new Date(value).toLocaleDateString("es-PE", { timeZone: "UTC" });
}
