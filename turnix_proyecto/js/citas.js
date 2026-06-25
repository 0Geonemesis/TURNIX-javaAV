// ======================================================
// TURNIX - MÓDULO DE CITAS
// ======================================================

// ---------- CLAVES DE LOCALSTORAGE ----------
const APPOINTMENTS_STORAGE_KEY = "turnix_appointments";
const CLIENTS_STORAGE_KEY = "turnix_clients";
const SESSION_STORAGE_KEY = "turnix_session";

// ---------- ELEMENTOS GENERALES ----------
const userBadge = document.getElementById("userBadge");
const logoutBtn = document.getElementById("logoutBtn");
const appointmentsTableBody = document.getElementById("appointmentsTableBody");
const appointmentsCountText = document.getElementById("appointmentsCountText");
const searchAppointmentInput = document.getElementById("searchAppointmentInput");

// ---------- MODAL ----------
const appointmentModal = document.getElementById("appointmentModal");
const openAppointmentModalBtn = document.getElementById("openAppointmentModalBtn");
const closeAppointmentModalBtn = document.getElementById("closeAppointmentModalBtn");
const cancelAppointmentModalBtn = document.getElementById("cancelAppointmentModalBtn");
const appointmentForm = document.getElementById("appointmentForm");
const appointmentFormMessage = document.getElementById("appointmentFormMessage");
const appointmentModalTitle = document.getElementById("appointmentModalTitle");

// ---------- CAMPOS DEL FORMULARIO ----------
const appointmentIdInput = document.getElementById("appointmentId");
const appointmentClientSelect = document.getElementById("appointmentClient");
const appointmentDateInput = document.getElementById("appointmentDate");
const appointmentTimeInput = document.getElementById("appointmentTime");
const appointmentStatusSelect = document.getElementById("appointmentStatus");

/**
 * Leemos la sesión activa.
 * Si no hay sesión, significa que entraron a la fuerza a la URL
 * y no por el login de Turnix.
 */
function getCurrentSession() {
    const session = localStorage.getItem(SESSION_STORAGE_KEY);
    return session ? JSON.parse(session) : null;
}

/**
 * Blindaje básico de la vista.
 * Si no hay sesión, lo mandamos al login para no dejar la puerta abierta.
 */
function protectAppointmentsPage() {
    const currentSession = getCurrentSession();

    if (!currentSession) {
        window.location.href = "index.html";
        return null;
    }

    return currentSession;
}

/**
 * Muestra el tipo de usuario en la esquina superior derecha.
 */
function loadUserInfo(session) {
    userBadge.textContent = session.userType === "negocio" ? "Negocio" : "Cliente";
}

/**
 * Trae los clientes registrados.
 * Esto es clave porque una cita siempre debe estar asociada a un cliente existente.
 */
function getStoredClients() {
    const clients = localStorage.getItem(CLIENTS_STORAGE_KEY);
    return clients ? JSON.parse(clients) : [];
}

/**
 * Trae las citas guardadas.
 */
function getStoredAppointments() {
    const appointments = localStorage.getItem(APPOINTMENTS_STORAGE_KEY);
    return appointments ? JSON.parse(appointments) : [];
}

/**
 * Guarda la lista completa de citas.
 */
function saveAppointments(appointments) {
    localStorage.setItem(APPOINTMENTS_STORAGE_KEY, JSON.stringify(appointments));
}

/**
 * Mensajes debajo del formulario del modal.
 */
function showAppointmentFormMessage(text, type) {
    appointmentFormMessage.textContent = text;
    appointmentFormMessage.className = `form-message ${type}`;
}

/**
 * Abre el modal.
 */
function openAppointmentModal() {
    appointmentModal.classList.remove("hidden");
}

/**
 * Cierra el modal.
 */
function closeAppointmentModal() {
    appointmentModal.classList.add("hidden");
    showAppointmentFormMessage("", "");
}

/**
 * Limpia el formulario para dejarlo listo.
 */
function resetAppointmentForm() {
    appointmentForm.reset();
    appointmentIdInput.value = "";
    appointmentModalTitle.textContent = "Nueva cita";
    showAppointmentFormMessage("", "");
}

/**
 * Llena el select con los clientes registrados.
 * Si no hay clientes, la lista quedará vacía salvo el placeholder.
 */
function populateClientsSelect() {
    const clients = getStoredClients();

    appointmentClientSelect.innerHTML = `
        <option value="">Selecciona un cliente</option>
    `;

    clients.forEach(client => {
        const option = document.createElement("option");
        option.value = client.id;
        option.textContent = `${client.name} - ${client.phone}`;
        appointmentClientSelect.appendChild(option);
    });
}

/**
 * Convierte YYYY-MM-DD a formato más legible.
 */
function formatDate(dateString) {
    const date = new Date(`${dateString}T00:00:00`);
    return date.toLocaleDateString("es-PE");
}

/**
 * Dibuja la tabla de citas.
 */
function renderAppointmentsTable(appointmentsToRender) {
    appointmentsTableBody.innerHTML = "";

    if (appointmentsToRender.length === 0) {
        appointmentsTableBody.innerHTML = `
            <tr>
                <td colspan="7" class="empty-state-cell">
                    Aún no hay citas registradas en Turnix.
                </td>
            </tr>
        `;
        return;
    }

    appointmentsToRender.forEach(appointment => {
        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${appointment.clientName}</td>
            <td>${appointment.clientEmail}</td>
            <td>${appointment.clientPhone}</td>
            <td>${formatDate(appointment.date)}</td>
            <td>${appointment.time}</td>
            <td>
                <span class="status-badge ${getStatusClass(appointment.status)}">
                    ${appointment.status}
                </span>
            </td>
            <td>
                <div class="table-actions">
                    <button class="table-action-btn edit-btn" data-id="${appointment.id}">
                        Editar
                    </button>
                    <button class="table-action-btn delete-btn" data-id="${appointment.id}">
                        Eliminar
                    </button>
                </div>
            </td>
        `;

        appointmentsTableBody.appendChild(row);
    });

    attachAppointmentActionEvents();
}

/**
 * Le da color visual al estado.
 * Así la tabla se entiende de un vistazo.
 */
function getStatusClass(status) {
    switch (status) {
        case "Pendiente":
            return "status-pending";
        case "Confirmada":
            return "status-confirmed";
        case "Atendida":
            return "status-attended";
        case "Cancelada":
            return "status-cancelled";
        default:
            return "";
    }
}

/**
 * Actualiza el contador superior.
 */
function updateAppointmentsCountText(appointments) {
    const total = appointments.length;
    appointmentsCountText.textContent = `${total} cita${total !== 1 ? "s" : ""} registrada${total !== 1 ? "s" : ""}`;
}

/**
 * Redibuja toda la vista.
 */
function refreshAppointmentsView() {
    const appointments = getStoredAppointments();
    updateAppointmentsCountText(appointments);
    renderAppointmentsTable(appointments);
}

/**
 * Carga una cita en el formulario para editarla.
 */
function loadAppointmentIntoForm(appointmentId) {
    const appointments = getStoredAppointments();
    const appointmentToEdit = appointments.find(appointment => appointment.id === Number(appointmentId));

    if (!appointmentToEdit) return;

    appointmentIdInput.value = appointmentToEdit.id;
    appointmentClientSelect.value = appointmentToEdit.clientId;
    appointmentDateInput.value = appointmentToEdit.date;
    appointmentTimeInput.value = appointmentToEdit.time;
    appointmentStatusSelect.value = appointmentToEdit.status;

    appointmentModalTitle.textContent = "Editar cita";
    showAppointmentFormMessage("", "");
    openAppointmentModal();
}

/**
 * Elimina una cita con confirmación previa.
 */
function deleteAppointment(appointmentId) {
    const appointments = getStoredAppointments();
    const appointmentToDelete = appointments.find(appointment => appointment.id === Number(appointmentId));

    if (!appointmentToDelete) return;

    const confirmDelete = confirm(`¿Seguro que quieres eliminar la cita de "${appointmentToDelete.clientName}" del ${formatDate(appointmentToDelete.date)}?`);

    if (!confirmDelete) return;

    const updatedAppointments = appointments.filter(appointment => appointment.id !== Number(appointmentId));
    saveAppointments(updatedAppointments);
    refreshAppointmentsView();
}

/**
 * Conecta los botones de editar y eliminar después de dibujar la tabla.
 */
function attachAppointmentActionEvents() {
    const editButtons = document.querySelectorAll(".edit-btn");
    const deleteButtons = document.querySelectorAll(".delete-btn");

    editButtons.forEach(button => {
        button.addEventListener("click", function () {
            const appointmentId = this.dataset.id;
            loadAppointmentIntoForm(appointmentId);
        });
    });

    deleteButtons.forEach(button => {
        button.addEventListener("click", function () {
            const appointmentId = this.dataset.id;
            deleteAppointment(appointmentId);
        });
    });
}

/**
 * Búsqueda en tiempo real por cliente, fecha, hora o estado.
 */
function handleAppointmentSearch() {
    const searchTerm = searchAppointmentInput.value.trim().toLowerCase();
    const appointments = getStoredAppointments();

    if (!searchTerm) {
        renderAppointmentsTable(appointments);
        updateAppointmentsCountText(appointments);
        return;
    }

    const filteredAppointments = appointments.filter(appointment =>
        appointment.clientName.toLowerCase().includes(searchTerm) ||
        appointment.clientEmail.toLowerCase().includes(searchTerm) ||
        appointment.clientPhone.toLowerCase().includes(searchTerm) ||
        appointment.date.toLowerCase().includes(searchTerm) ||
        appointment.time.toLowerCase().includes(searchTerm) ||
        appointment.status.toLowerCase().includes(searchTerm)
    );

    renderAppointmentsTable(filteredAppointments);
    updateAppointmentsCountText(filteredAppointments);
}

/**
 * Aquí se guarda o actualiza una cita.
 */
appointmentForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const appointmentId = appointmentIdInput.value;
    const clientId = appointmentClientSelect.value;
    const date = appointmentDateInput.value;
    const time = appointmentTimeInput.value;
    const status = appointmentStatusSelect.value;

    showAppointmentFormMessage("", "");

    if (!clientId || !date || !time || !status) {
        showAppointmentFormMessage("Completa todos los campos antes de guardar la cita.", "error");
        return;
    }

    const clients = getStoredClients();

    // Si no hay clientes, no tiene sentido crear una cita huérfana.
    if (clients.length === 0) {
        showAppointmentFormMessage("Primero registra al menos un cliente antes de crear citas.", "error");
        return;
    }

    const selectedClient = clients.find(client => client.id === Number(clientId));

    if (!selectedClient) {
        showAppointmentFormMessage("No se encontró el cliente seleccionado.", "error");
        return;
    }

    const appointments = getStoredAppointments();

    // ---------- MODO EDITAR ----------
    if (appointmentId) {
        const updatedAppointments = appointments.map(appointment => {
            if (appointment.id === Number(appointmentId)) {
                return {
                    ...appointment,
                    clientId: selectedClient.id,
                    clientName: selectedClient.name,
                    clientEmail: selectedClient.email,
                    clientPhone: selectedClient.phone,
                    date,
                    time,
                    status
                };
            }
            return appointment;
        });

        saveAppointments(updatedAppointments);
        closeAppointmentModal();
        resetAppointmentForm();
        refreshAppointmentsView();
        return;
    }

    // ---------- MODO CREAR ----------
    const newAppointment = {
        id: Date.now(),
        clientId: selectedClient.id,
        clientName: selectedClient.name,
        clientEmail: selectedClient.email,
        clientPhone: selectedClient.phone,
        date,
        time,
        status,
        createdAt: new Date().toISOString()
    };

    appointments.push(newAppointment);
    saveAppointments(appointments);

    closeAppointmentModal();
    resetAppointmentForm();
    refreshAppointmentsView();
});

// ---------- EVENTOS DEL MODAL ----------
openAppointmentModalBtn.addEventListener("click", function () {
    const clients = getStoredClients();

    // Si no hay clientes, evitamos abrir un formulario que no se puede completar.
    if (clients.length === 0) {
        alert("Primero registra al menos un cliente en el módulo Clientes.");
        return;
    }

    populateClientsSelect();
    resetAppointmentForm();
    openAppointmentModal();
});

closeAppointmentModalBtn.addEventListener("click", function () {
    closeAppointmentModal();
    resetAppointmentForm();
});

cancelAppointmentModalBtn.addEventListener("click", function () {
    closeAppointmentModal();
    resetAppointmentForm();
});

// Si hacen clic fuera de la tarjeta del modal, lo cerramos.
appointmentModal.addEventListener("click", function (event) {
    if (event.target === appointmentModal) {
        closeAppointmentModal();
        resetAppointmentForm();
    }
});

// ---------- BUSCADOR ----------
searchAppointmentInput.addEventListener("input", handleAppointmentSearch);

/**
 * Cierre de sesión.
 */
function logout() {
    localStorage.removeItem(SESSION_STORAGE_KEY);
    window.location.href = "index.html";
}

logoutBtn.addEventListener("click", logout);

// ======================================================
// ARRANQUE DEL MÓDULO
// ======================================================
const currentSession = protectAppointmentsPage();

if (currentSession) {
    loadUserInfo(currentSession);
    populateClientsSelect();
    refreshAppointmentsView();
}