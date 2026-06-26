import { useEffect, useMemo, useState } from "react";
import {
  createAppointment,
  deleteAppointment,
  getAppointments,
  updateAppointment
} from "../api/appointmentService";
import { createClient, deleteClient, getClients, updateClient } from "../api/clientService";
import { getReportSummary } from "../api/reportService";
import { createTurn, deleteTurn, getTurns, updateTurn } from "../api/turnService";
import PageHeader from "../components/PageHeader.jsx";

const emptyClientForm = {
  fullName: "",
  email: "",
  phone: "",
  documentNumber: "",
  notes: ""
};

const emptyAppointmentForm = {
  clientId: "",
  clientName: "",
  serviceName: "",
  appointmentDate: "",
  appointmentTime: "",
  status: "pendiente",
  notes: ""
};

const emptyTurnForm = {
  turnCode: "",
  clientName: "",
  serviceName: "",
  status: "esperando",
  priority: "normal"
};

// Panel publico de gestion: aqui viven los CRUD principales del sistema.
export default function BusinessPage() {
  const [clients, setClients] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [turns, setTurns] = useState([]);
  const [report, setReport] = useState(null);
  const [message, setMessage] = useState("");
  const [clientForm, setClientForm] = useState(emptyClientForm);
  const [appointmentForm, setAppointmentForm] = useState(emptyAppointmentForm);
  const [turnForm, setTurnForm] = useState(emptyTurnForm);
  const [editingClientId, setEditingClientId] = useState(null);
  const [editingAppointmentId, setEditingAppointmentId] = useState(null);
  const [editingTurnId, setEditingTurnId] = useState(null);

  // Carga todos los datos que alimentan las pestanas.
  async function loadData() {
    try {
      const [clientsResponse, appointmentsResponse, turnsResponse, reportResponse] = await Promise.all([
        getClients(),
        getAppointments(),
        getTurns(),
        getReportSummary()
      ]);

      setClients(clientsResponse.data.clients);
      setAppointments(appointmentsResponse.data.appointments);
      setTurns(turnsResponse.data.turns);
      setReport(reportResponse.data);
      setMessage("");
    } catch (error) {
      setMessage(error.response?.data?.message || "No se pudieron cargar los datos. Revisa MySQL y el backend.");
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  // Genera el siguiente codigo de turno sugerido usando la cantidad actual.
  const nextTurnCode = useMemo(() => {
    return `T-${String(turns.length + 1).padStart(3, "0")}`;
  }, [turns.length]);

  function handleClientChange(event) {
    setClientForm({ ...clientForm, [event.target.name]: event.target.value });
  }

  function handleAppointmentChange(event) {
    const { name, value } = event.target;

    // Si se selecciona un cliente existente, copiamos su nombre al formulario.
    if (name === "clientId") {
      const selectedClient = clients.find((client) => String(client.id) === value);
      setAppointmentForm({
        ...appointmentForm,
        clientId: value,
        clientName: selectedClient ? selectedClient.full_name : appointmentForm.clientName
      });
      return;
    }

    setAppointmentForm({ ...appointmentForm, [name]: value });
  }

  function handleTurnChange(event) {
    setTurnForm({ ...turnForm, [event.target.name]: event.target.value });
  }

  async function handleClientSubmit(event) {
    event.preventDefault();

    try {
      if (editingClientId) {
        await updateClient(editingClientId, clientForm);
        setMessage("Cliente actualizado correctamente.");
      } else {
        await createClient(clientForm);
        setMessage("Cliente creado correctamente.");
      }

      setClientForm(emptyClientForm);
      setEditingClientId(null);
      await loadData();
    } catch (error) {
      setMessage(error.response?.data?.message || "No se pudo guardar el cliente.");
    }
  }

  async function handleAppointmentSubmit(event) {
    event.preventDefault();

    try {
      if (editingAppointmentId) {
        await updateAppointment(editingAppointmentId, appointmentForm);
        setMessage("Cita actualizada correctamente.");
      } else {
        await createAppointment(appointmentForm);
        setMessage("Cita creada correctamente.");
      }

      setAppointmentForm(emptyAppointmentForm);
      setEditingAppointmentId(null);
      await loadData();
    } catch (error) {
      setMessage(error.response?.data?.message || "No se pudo guardar la cita.");
    }
  }

  async function handleTurnSubmit(event) {
    event.preventDefault();

    const payload = {
      ...turnForm,
      turnCode: turnForm.turnCode || nextTurnCode
    };

    try {
      if (editingTurnId) {
        await updateTurn(editingTurnId, payload);
        setMessage("Turno actualizado correctamente.");
      } else {
        await createTurn(payload);
        setMessage("Turno creado correctamente.");
      }

      setTurnForm(emptyTurnForm);
      setEditingTurnId(null);
      await loadData();
    } catch (error) {
      setMessage(error.response?.data?.message || "No se pudo guardar el turno.");
    }
  }

  function editClient(client) {
    setEditingClientId(client.id);
    setClientForm({
      fullName: client.full_name || "",
      email: client.email || "",
      phone: client.phone || "",
      documentNumber: client.document_number || "",
      notes: client.notes || ""
    });
  }

  function editAppointment(appointment) {
    setEditingAppointmentId(appointment.id);
    setAppointmentForm({
      clientId: appointment.client_id || "",
      clientName: appointment.client_name || "",
      serviceName: appointment.service_name || "",
      appointmentDate: formatDateInput(appointment.appointment_date),
      appointmentTime: String(appointment.appointment_time || "").slice(0, 5),
      status: appointment.status || "pendiente",
      notes: appointment.notes || ""
    });
  }

  function editTurn(turn) {
    setEditingTurnId(turn.id);
    setTurnForm({
      turnCode: turn.turn_code || "",
      clientName: turn.client_name || "",
      serviceName: turn.service_name || "",
      status: turn.status || "esperando",
      priority: turn.priority || "normal"
    });
  }

  async function removeClient(id) {
    if (window.confirm("Seguro que deseas eliminar este cliente?")) {
      try {
        await deleteClient(id);
        await loadData();
      } catch (error) {
        setMessage(error.response?.data?.message || "No se pudo eliminar el cliente.");
      }
    }
  }

  async function removeAppointment(id) {
    if (window.confirm("Seguro que deseas eliminar esta cita?")) {
      try {
        await deleteAppointment(id);
        await loadData();
      } catch (error) {
        setMessage(error.response?.data?.message || "No se pudo eliminar la cita.");
      }
    }
  }

  async function removeTurn(id) {
    if (window.confirm("Seguro que deseas eliminar este turno?")) {
      try {
        await deleteTurn(id);
        await loadData();
      } catch (error) {
        setMessage(error.response?.data?.message || "No se pudo eliminar el turno.");
      }
    }
  }

  return (
    <>
      <PageHeader title="Gestion publica de Turnix" description="Administra clientes, citas, turnos y reportes desde un solo panel." />

      {message && <div className="alert alert-info">{message}</div>}

      <section className="content-panel">
        <ul className="nav nav-tabs" id="businessTabs" role="tablist">
          <TabButton id="clientes" label="Clientes" active />
          <TabButton id="citas" label="Citas" />
          <TabButton id="turnos" label="Turnos" />
          <TabButton id="reportes" label="Reportes" />
        </ul>

        <div className="tab-content pt-4">
          <div className="tab-pane fade show active" id="clientes" role="tabpanel" aria-labelledby="clientes-tab">
            <SectionTitle title="Clientes" detail="Registra, edita y elimina clientes del sistema." />
            <ClientForm form={clientForm} editingId={editingClientId} onChange={handleClientChange} onSubmit={handleClientSubmit} onCancel={() => {
              setClientForm(emptyClientForm);
              setEditingClientId(null);
            }} />
            <ClientTable clients={clients} onEdit={editClient} onDelete={removeClient} />
          </div>

          <div className="tab-pane fade" id="citas" role="tabpanel" aria-labelledby="citas-tab">
            <SectionTitle title="Citas" detail="Programa citas por cliente, servicio, fecha, hora y estado." />
            <AppointmentForm clients={clients} form={appointmentForm} editingId={editingAppointmentId} onChange={handleAppointmentChange} onSubmit={handleAppointmentSubmit} onCancel={() => {
              setAppointmentForm(emptyAppointmentForm);
              setEditingAppointmentId(null);
            }} />
            <AppointmentTable appointments={appointments} onEdit={editAppointment} onDelete={removeAppointment} />
          </div>

          <div className="tab-pane fade" id="turnos" role="tabpanel" aria-labelledby="turnos-tab">
            <SectionTitle title="Turnos" detail="Controla la fila de atencion del negocio." />
            <TurnForm form={turnForm} editingId={editingTurnId} nextTurnCode={nextTurnCode} onChange={handleTurnChange} onSubmit={handleTurnSubmit} onCancel={() => {
              setTurnForm(emptyTurnForm);
              setEditingTurnId(null);
            }} />
            <TurnTable turns={turns} onEdit={editTurn} onDelete={removeTurn} />
          </div>

          <div className="tab-pane fade" id="reportes" role="tabpanel" aria-labelledby="reportes-tab">
            <SectionTitle title="Reportes" detail="Resumen calculado desde clientes, citas y turnos." />
            <ReportPanel report={report} />
          </div>
        </div>
      </section>
    </>
  );
}

function TabButton({ id, label, active = false }) {
  return (
    <li className="nav-item" role="presentation">
      <button className={`nav-link ${active ? "active" : ""}`} id={`${id}-tab`} data-bs-toggle="tab" data-bs-target={`#${id}`} type="button" role="tab">
        {label}
      </button>
    </li>
  );
}

function SectionTitle({ title, detail }) {
  return (
    <div className="section-row">
      <div>
        <h2>{title}</h2>
        <p>{detail}</p>
      </div>
    </div>
  );
}

function ClientForm({ form, editingId, onChange, onSubmit, onCancel }) {
  return (
    <form className="crud-form" onSubmit={onSubmit}>
      <div className="row g-3">
        <div className="col-md-6 col-xl-3">
          <label className="form-label">Nombre completo</label>
          <input className="form-control" name="fullName" value={form.fullName} onChange={onChange} required />
        </div>
        <div className="col-md-6 col-xl-3">
          <label className="form-label">Correo</label>
          <input className="form-control" name="email" type="email" value={form.email} onChange={onChange} />
        </div>
        <div className="col-md-6 col-xl-2">
          <label className="form-label">Telefono</label>
          <input className="form-control" name="phone" value={form.phone} onChange={onChange} />
        </div>
        <div className="col-md-6 col-xl-2">
          <label className="form-label">Documento</label>
          <input className="form-control" name="documentNumber" value={form.documentNumber} onChange={onChange} />
        </div>
        <div className="col-xl-2 d-flex align-items-end gap-2">
          <button className="btn btn-primary w-100" type="submit">{editingId ? "Actualizar" : "Agregar"}</button>
          {editingId && <button className="btn btn-outline-secondary" type="button" onClick={onCancel}>Cancelar</button>}
        </div>
        <div className="col-12">
          <label className="form-label">Notas</label>
          <textarea className="form-control" name="notes" rows="2" value={form.notes} onChange={onChange} />
        </div>
      </div>
    </form>
  );
}

function ClientTable({ clients, onEdit, onDelete }) {
  return (
    <DataTable emptyText="Todavia no hay clientes registrados.">
      <thead>
        <tr>
          <th>Cliente</th>
          <th>Correo</th>
          <th>Telefono</th>
          <th>Documento</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        {clients.length === 0 ? <EmptyRow columns={5} text="Todavia no hay clientes registrados." /> : clients.map((client) => (
          <tr key={client.id}>
            <td>{client.full_name}</td>
            <td>{client.email || "-"}</td>
            <td>{client.phone || "-"}</td>
            <td>{client.document_number || "-"}</td>
            <td><ActionButtons onEdit={() => onEdit(client)} onDelete={() => onDelete(client.id)} /></td>
          </tr>
        ))}
      </tbody>
    </DataTable>
  );
}

function AppointmentForm({ clients, form, editingId, onChange, onSubmit, onCancel }) {
  return (
    <form className="crud-form" onSubmit={onSubmit}>
      <div className="row g-3">
        <div className="col-md-6 col-xl-3">
          <label className="form-label">Cliente existente</label>
          <select className="form-select" name="clientId" value={form.clientId} onChange={onChange}>
            <option value="">Escribir manualmente</option>
            {clients.map((client) => (
              <option key={client.id} value={client.id}>{client.full_name}</option>
            ))}
          </select>
        </div>
        <div className="col-md-6 col-xl-3">
          <label className="form-label">Nombre del cliente</label>
          <input className="form-control" name="clientName" value={form.clientName} onChange={onChange} required />
        </div>
        <div className="col-md-6 col-xl-2">
          <label className="form-label">Servicio</label>
          <input className="form-control" name="serviceName" value={form.serviceName} onChange={onChange} required />
        </div>
        <div className="col-md-6 col-xl-2">
          <label className="form-label">Fecha</label>
          <input className="form-control" name="appointmentDate" type="date" value={form.appointmentDate} onChange={onChange} required />
        </div>
        <div className="col-md-6 col-xl-2">
          <label className="form-label">Hora</label>
          <input className="form-control" name="appointmentTime" type="time" value={form.appointmentTime} onChange={onChange} required />
        </div>
        <div className="col-md-6 col-xl-3">
          <label className="form-label">Estado</label>
          <select className="form-select" name="status" value={form.status} onChange={onChange}>
            <option value="pendiente">Pendiente</option>
            <option value="confirmada">Confirmada</option>
            <option value="atendida">Atendida</option>
            <option value="cancelada">Cancelada</option>
          </select>
        </div>
        <div className="col-xl-6">
          <label className="form-label">Notas</label>
          <input className="form-control" name="notes" value={form.notes} onChange={onChange} />
        </div>
        <div className="col-xl-3 d-flex align-items-end gap-2">
          <button className="btn btn-primary w-100" type="submit">{editingId ? "Actualizar cita" : "Agregar cita"}</button>
          {editingId && <button className="btn btn-outline-secondary" type="button" onClick={onCancel}>Cancelar</button>}
        </div>
      </div>
    </form>
  );
}

function AppointmentTable({ appointments, onEdit, onDelete }) {
  return (
    <DataTable>
      <thead>
        <tr>
          <th>Cliente</th>
          <th>Servicio</th>
          <th>Fecha</th>
          <th>Hora</th>
          <th>Estado</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        {appointments.length === 0 ? <EmptyRow columns={6} text="Todavia no hay citas registradas." /> : appointments.map((appointment) => (
          <tr key={appointment.id}>
            <td>{appointment.client_name}</td>
            <td>{appointment.service_name}</td>
            <td>{formatDisplayDate(appointment.appointment_date)}</td>
            <td>{String(appointment.appointment_time || "").slice(0, 5)}</td>
            <td><StatusBadge value={appointment.status} /></td>
            <td><ActionButtons onEdit={() => onEdit(appointment)} onDelete={() => onDelete(appointment.id)} /></td>
          </tr>
        ))}
      </tbody>
    </DataTable>
  );
}

function TurnForm({ form, editingId, nextTurnCode, onChange, onSubmit, onCancel }) {
  return (
    <form className="crud-form" onSubmit={onSubmit}>
      <div className="row g-3">
        <div className="col-md-6 col-xl-2">
          <label className="form-label">Codigo</label>
          <input className="form-control" name="turnCode" placeholder={nextTurnCode} value={form.turnCode} onChange={onChange} />
        </div>
        <div className="col-md-6 col-xl-3">
          <label className="form-label">Cliente</label>
          <input className="form-control" name="clientName" value={form.clientName} onChange={onChange} required />
        </div>
        <div className="col-md-6 col-xl-3">
          <label className="form-label">Servicio</label>
          <input className="form-control" name="serviceName" value={form.serviceName} onChange={onChange} required />
        </div>
        <div className="col-md-6 col-xl-2">
          <label className="form-label">Estado</label>
          <select className="form-select" name="status" value={form.status} onChange={onChange}>
            <option value="esperando">Esperando</option>
            <option value="en_atencion">En atencion</option>
            <option value="atendido">Atendido</option>
            <option value="cancelado">Cancelado</option>
          </select>
        </div>
        <div className="col-md-6 col-xl-2">
          <label className="form-label">Prioridad</label>
          <select className="form-select" name="priority" value={form.priority} onChange={onChange}>
            <option value="normal">Normal</option>
            <option value="preferencial">Preferencial</option>
          </select>
        </div>
        <div className="col-12 d-flex gap-2">
          <button className="btn btn-primary action-submit" type="submit">{editingId ? "Actualizar turno" : "Agregar turno"}</button>
          {editingId && <button className="btn btn-outline-secondary" type="button" onClick={onCancel}>Cancelar</button>}
        </div>
      </div>
    </form>
  );
}

function TurnTable({ turns, onEdit, onDelete }) {
  return (
    <DataTable>
      <thead>
        <tr>
          <th>Codigo</th>
          <th>Cliente</th>
          <th>Servicio</th>
          <th>Estado</th>
          <th>Prioridad</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        {turns.length === 0 ? <EmptyRow columns={6} text="Todavia no hay turnos registrados." /> : turns.map((turn) => (
          <tr key={turn.id}>
            <td>{turn.turn_code}</td>
            <td>{turn.client_name}</td>
            <td>{turn.service_name}</td>
            <td><StatusBadge value={turn.status} /></td>
            <td>{turn.priority}</td>
            <td><ActionButtons onEdit={() => onEdit(turn)} onDelete={() => onDelete(turn.id)} /></td>
          </tr>
        ))}
      </tbody>
    </DataTable>
  );
}

function ReportPanel({ report }) {
  if (!report) {
    return <p>Cargando reportes...</p>;
  }

  const cards = [
    { label: "Clientes registrados", value: report.summary.clients },
    { label: "Citas totales", value: report.summary.appointments },
    { label: "Turnos totales", value: report.summary.turns },
    { label: "Turnos activos", value: report.summary.activeTurns }
  ];

  return (
    <>
      <div className="row g-3">
        {cards.map((card) => (
          <div className="col-md-6 col-xl-3" key={card.label}>
            <article className="mini-report">
              <span>{card.label}</span>
              <strong>{card.value}</strong>
            </article>
          </div>
        ))}
      </div>
      <div className="row g-3 mt-1">
        <div className="col-lg-6">
          <StatusList title="Citas por estado" items={report.appointmentStatus} />
        </div>
        <div className="col-lg-6">
          <StatusList title="Turnos por estado" items={report.turnStatus} />
        </div>
      </div>
    </>
  );
}

function StatusList({ title, items }) {
  return (
    <div className="report-box">
      <h3>{title}</h3>
      {items.length === 0 ? <p>No hay datos todavia.</p> : items.map((item) => (
        <div className="report-line" key={item.status}>
          <span>{item.status}</span>
          <strong>{item.total}</strong>
        </div>
      ))}
    </div>
  );
}

function DataTable({ children }) {
  return <div className="table-responsive crud-table"><table className="table table-hover align-middle">{children}</table></div>;
}

function EmptyRow({ columns, text }) {
  return <tr><td colSpan={columns} className="text-center text-muted py-4">{text}</td></tr>;
}

function ActionButtons({ onEdit, onDelete }) {
  return (
    <div className="table-actions">
      <button className="btn btn-sm btn-outline-primary" type="button" onClick={onEdit}>Editar</button>
      <button className="btn btn-sm btn-outline-danger" type="button" onClick={onDelete}>Borrar</button>
    </div>
  );
}

function StatusBadge({ value }) {
  return <span className={`status-pill status-${value}`}>{value}</span>;
}

function formatDateInput(value) {
  if (!value) return "";
  return String(value).slice(0, 10);
}

function formatDisplayDate(value) {
  if (!value) return "-";
  return new Date(value).toLocaleDateString("es-PE", { timeZone: "UTC" });
}
