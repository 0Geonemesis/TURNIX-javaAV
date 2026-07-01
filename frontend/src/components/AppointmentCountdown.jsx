import { useEffect, useMemo, useState } from "react";

// Cronometro de la proxima cita futura.
export default function AppointmentCountdown({ appointments, title = "Proxima cita" }) {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timerId = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timerId);
  }, []);

  const nextAppointment = useMemo(() => {
    return appointments
      .map((appointment) => ({
        ...appointment,
        startsAt: buildAppointmentDate(appointment)
      }))
      .filter((appointment) => appointment.startsAt && appointment.startsAt > now && appointment.status !== "cancelada")
      .sort((first, second) => first.startsAt - second.startsAt)[0];
  }, [appointments, now]);

  if (!nextAppointment) {
    return (
      <section className="countdown-card">
        <div>
          <span>{title}</span>
          <h2>Sin citas proximas</h2>
          <p>Cuando se registre una cita futura, el cronometro aparecera aqui.</p>
        </div>
      </section>
    );
  }

  const remaining = getRemainingParts(nextAppointment.startsAt - now);

  return (
    <section className="countdown-card">
      <div>
        <span>{title}</span>
        <h2>{nextAppointment.client_name}</h2>
        <p>
          {nextAppointment.service_name} - {formatDate(nextAppointment.startsAt)}
        </p>
      </div>
      <div className="countdown-timer" aria-label="Tiempo restante para la cita">
        <strong>{remaining.days}</strong><small>dias</small>
        <strong>{remaining.hours}</strong><small>horas</small>
        <strong>{remaining.minutes}</strong><small>min</small>
        <strong>{remaining.seconds}</strong><small>seg</small>
      </div>
    </section>
  );
}

function buildAppointmentDate(appointment) {
  const date = String(appointment.appointment_date || "").slice(0, 10);
  const time = String(appointment.appointment_time || "00:00").slice(0, 5);

  if (!date) return null;
  return new Date(`${date}T${time}:00`);
}

function getRemainingParts(milliseconds) {
  const totalSeconds = Math.max(0, Math.floor(milliseconds / 1000));
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return {
    days: String(days).padStart(2, "0"),
    hours: String(hours).padStart(2, "0"),
    minutes: String(minutes).padStart(2, "0"),
    seconds: String(seconds).padStart(2, "0")
  };
}

function formatDate(date) {
  return date.toLocaleString("es-PE", {
    dateStyle: "medium",
    timeStyle: "short"
  });
}
