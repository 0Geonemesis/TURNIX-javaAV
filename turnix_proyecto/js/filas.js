// ======================================================
// TURNIX - MÓDULO DE FILAS / TURNOS
// ======================================================

// ---------- CLAVES DE LOCALSTORAGE ----------
const QUEUE_STORAGE_KEY = "turnix_queue";
const APPOINTMENTS_STORAGE_KEY = "turnix_appointments";
const SESSION_STORAGE_KEY = "turnix_session";

// ---------- ELEMENTOS GENERALES ----------
const userBadge = document.getElementById("userBadge");
const logoutBtn = document.getElementById("logoutBtn");
const queueTableBody = document.getElementById("queueTableBody");
const queueCountText = document.getElementById("queueCountText");
const searchQueueInput = document.getElementById("searchQueueInput");
const attendNextBtn = document.getElementById("attendNextBtn");

// ---------- KPIs ----------
const activeTurnsCount = document.getElementById("activeTurnsCount");
const waitingTurnsCount = document.getElementById("waitingTurnsCount");
const attendedTurnsCount = document.getElementById("attendedTurnsCount");
const totalTurnsCount = document.getElementById("totalTurnsCount");

// ---------- MODAL ----------
const queueModal = document.getElementById("queueModal");
const openQueueModalBtn = document.getElementById("openQueueModalBtn");
const closeQueueModalBtn = document.getElementById("closeQueueModalBtn");
const cancelQueueModalBtn = document.getElementById("cancelQueueModalBtn");
const queueForm = document.getElementById("queueForm");
const queueFormMessage = document.getElementById("queueFormMessage");
const queueModalTitle = document.getElementById("queueModalTitle");

// ---------- CAMPOS DEL FORMULARIO ----------
const queueIdInput = document.getElementById("queueId");
const queueAppointmentSelect = document.getElementById("queueAppointment");
const queueStatusSelect = document.getElementById("queueStatus");

/**
 * Leemos la sesión actual.
 * Si no existe, significa que alguien quiso entrar directo a la URL.
 */
function getCurrentSession() {
    const session = localStorage.getItem(SESSION_STORAGE_KEY);
    return session ? JSON.parse(session) : null;
}

/**
 * Protege la página de filas.
 */
function protectQueuePage() {
    const currentSession = getCurrentSession();

    if (!currentSession) {
        window.location.href = "index.html";
        return null;
    }

    return currentSession;
}

/**
 * Muestra el tipo de usuario en la parte superior.
 */
function loadUserInfo(session) {
    userBadge.textContent = session.userType === "negocio" ? "Negocio" : "Cliente";
}

/**
 * Trae las citas registradas.
 * Aquí nacen los turnos: cada turno estará conectado a una cita real.
 */
function getStoredAppointments() {
    const appointments = localStorage.getItem(APPOINTMENTS_STORAGE_KEY);
    return appointments ? JSON.parse(appointments) : [];
}

/**
 * Trae la cola de turnos guardada.
 */
function getStoredQueue() {
    const queue = localStorage.getItem(QUEUE_STORAGE_KEY);
    return queue ? JSON.parse(queue) : [];
}

/**
 * Guarda toda la cola actualizada.
 */
function saveQueue(queue) {
    localStorage.setItem(QUEUE_STORAGE_KEY, JSON.stringify(queue));
}

/**
 * Mensajes del formulario.
 */
function showQueueFormMessage(text, type) {
    queueFormMessage.textContent = text;
    queueFormMessage.className = `form-message ${type}`;
}

/**
 * Abre el modal.
 */
function openQueueModal() {
    queueModal.classList.remove("hidden");
}

/**
 * Cierra el modal.
 */
function closeQueueModal() {
    queueModal.classList.add("hidden");
    showQueueFormMessage("", "");
}

/**
 * Resetea el formulario para dejarlo limpio.
 */
function resetQueueForm() {
    queueForm.reset();
    queueIdInput.value = "";
    queueModalTitle.textContent = "Nuevo turno";
    showQueueFormMessage("", "");
}

/**
 * Convierte una fecha a formato amigable.
 */
function formatDate(dateString) {
    const date = new Date(`${dateString}T00:00:00`);
    return date.toLocaleDateString("es-PE");
}

/**
 * Genera el siguiente número de turno.
 * Ejemplo:
 * - si no hay ninguno -> T-001
 * - si el último fue T-009 -> T-010
 * - si el último fue T-010 -> T-011
 */
function generateNextTurnCode(queue) {
    if (queue.length === 0) {
        return "T-001";
    }

    const lastTurn = queue[queue.length - 1];
    const lastNumber = Number(lastTurn.turnCode.split("-")[1]);
    const nextNumber = lastNumber + 1;

    return `T-${String(nextNumber).padStart(3, "0")}`;
}

/**
 * Llena el select con las citas disponibles.
 * Mostramos cliente + fecha + hora para que no sea una lista ciega.
 */
function populateAppointmentsSelect() {
    const appointments = getStoredAppointments();

    queueAppointmentSelect.innerHTML = `
        <option value="">Selecciona una cita</option>
    `;

    appointments.forEach(appointment => {
        const option = document.createElement("option");
        option.value = appointment.id;
        option.textContent = `${appointment.clientName} | ${formatDate(appointment.date)} | ${appointment.time} | ${appointment.status}`;
        queueAppointmentSelect.appendChild(option);
    });
}

/**
 * Devuelve la clase visual según el estado del turno.
 */
function getQueueStatusClass(status) {
    switch (status) {
        case "En espera":
            return "queue-status-waiting";
        case "En atención":
            return "queue-status-progress";
        case "Atendido":
            return "queue-status-done";
        case "Cancelado":
            return "queue-status-cancelled";
        default:
            return "";
    }
}

/**
 * Dibuja la tabla de turnos.
 */
function renderQueueTable(queueToRender) {
    queueTableBody.innerHTML = "";

    if (queueToRender.length === 0) {
        queueTableBody.innerHTML = `
            <tr>
                <td colspan="6" class="empty-state-cell">
                    Aún no hay turnos registrados en la cola.
                </td>
            </tr>
        `;
        return;
    }

    queueToRender.forEach(queueItem => {
        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${queueItem.turnCode}</td>
            <td>${queueItem.clientName}</td>
            <td>${formatDate(queueItem.date)}</td>
            <td>${queueItem.time}</td>
            <td>
                <span class="status-badge ${getQueueStatusClass(queueItem.status)}">
                    ${queueItem.status}
                </span>
            </td>
            <td>
                <div class="table-actions">
                    <button class="table-action-btn edit-btn" data-id="${queueItem.id}">
                        Editar
                    </button>
                    <button class="table-action-btn delete-btn" data-id="${queueItem.id}">
                        Eliminar
                    </button>
                    <button class="table-action-btn done-btn" data-id="${queueItem.id}">
                        Atendido
                    </button>
                </div>
            </td>
        `;

        queueTableBody.appendChild(row);
    });

    attachQueueActionEvents();
}

/**
 * Actualiza el texto del contador superior.
 */
function updateQueueCountText(queue) {
    const total = queue.length;
    queueCountText.textContent = `${total} turno${total !== 1 ? "s" : ""} registrado${total !== 1 ? "s" : ""}`;
}

/**
 * Actualiza los KPIs de la parte superior.
 */
function updateQueueKpis(queue) {
    const waiting = queue.filter(item => item.status === "En espera").length;
    const inProgress = queue.filter(item => item.status === "En atención").length;
    const attended = queue.filter(item => item.status === "Atendido").length;

    waitingTurnsCount.textContent = waiting;
    activeTurnsCount.textContent = waiting + inProgress;
    attendedTurnsCount.textContent = attended;
    totalTurnsCount.textContent = queue.length;
}

/**
 * Redibuja toda la vista.
 */
function refreshQueueView() {
    const queue = getStoredQueue();
    updateQueueCountText(queue);
    updateQueueKpis(queue);
    renderQueueTable(queue);
}

/**
 * Carga un turno dentro del formulario para editarlo.
 */
function loadQueueIntoForm(queueId) {
    const queue = getStoredQueue();
    const queueItem = queue.find(item => item.id === Number(queueId));

    if (!queueItem) return;

    queueIdInput.value = queueItem.id;
    queueAppointmentSelect.value = queueItem.appointmentId;
    queueStatusSelect.value = queueItem.status;

    queueModalTitle.textContent = "Editar turno";
    showQueueFormMessage("", "");
    openQueueModal();
}

/**
 * Elimina un turno de la cola.
 */
function deleteQueueItem(queueId) {
    const queue = getStoredQueue();
    const queueItem = queue.find(item => item.id === Number(queueId));

    if (!queueItem) return;

    const confirmDelete = confirm(`¿Seguro que quieres eliminar el turno ${queueItem.turnCode} de ${queueItem.clientName}?`);

    if (!confirmDelete) return;

    const updatedQueue = queue.filter(item => item.id !== Number(queueId));
    saveQueue(updatedQueue);
    refreshQueueView();
}

/**
 * Marca un turno como atendido con un clic.
 * Esto sirve para no entrar a editar si solo quieres cerrar la atención.
 */
function markQueueAsDone(queueId) {
    const queue = getStoredQueue();

    const updatedQueue = queue.map(item => {
        if (item.id === Number(queueId)) {
            return {
                ...item,
                status: "Atendido"
            };
        }
        return item;
    });

    saveQueue(updatedQueue);
    refreshQueueView();
}

/**
 * Atender siguiente:
 * busca el primer turno "En espera" y lo pasa a "En atención".
 * Si ya hay uno en atención, no abre otro para no desordenar la cola.
 */
function attendNextTurn() {
    const queue = getStoredQueue();

    const hasTurnInProgress = queue.some(item => item.status === "En atención");
    if (hasTurnInProgress) {
        alert("Ya hay un turno en atención. Ciérralo o márcalo como atendido antes de abrir otro.");
        return;
    }

    const nextWaitingTurn = queue.find(item => item.status === "En espera");

    if (!nextWaitingTurn) {
        alert("No hay turnos en espera por atender.");
        return;
    }

    const updatedQueue = queue.map(item => {
        if (item.id === nextWaitingTurn.id) {
            return {
                ...item,
                status: "En atención"
            };
        }
        return item;
    });

    saveQueue(updatedQueue);
    refreshQueueView();
}

/**
 * Conecta los botones de la tabla.
 */
function attachQueueActionEvents() {
    const editButtons = document.querySelectorAll(".edit-btn");
    const deleteButtons = document.querySelectorAll(".delete-btn");
    const doneButtons = document.querySelectorAll(".done-btn");

    editButtons.forEach(button => {
        button.addEventListener("click", function () {
            const queueId = this.dataset.id;
            populateAppointmentsSelect();
            loadQueueIntoForm(queueId);
        });
    });

    deleteButtons.forEach(button => {
        button.addEventListener("click", function () {
            const queueId = this.dataset.id;
            deleteQueueItem(queueId);
        });
    });

    doneButtons.forEach(button => {
        button.addEventListener("click", function () {
            const queueId = this.dataset.id;
            markQueueAsDone(queueId);
        });
    });
}

/**
 * Búsqueda en tiempo real.
 */
function handleQueueSearch() {
    const searchTerm = searchQueueInput.value.trim().toLowerCase();
    const queue = getStoredQueue();

    if (!searchTerm) {
        renderQueueTable(queue);
        updateQueueCountText(queue);
        updateQueueKpis(queue);
        return;
    }

    const filteredQueue = queue.filter(item =>
        item.turnCode.toLowerCase().includes(searchTerm) ||
        item.clientName.toLowerCase().includes(searchTerm) ||
        item.date.toLowerCase().includes(searchTerm) ||
        item.time.toLowerCase().includes(searchTerm) ||
        item.status.toLowerCase().includes(searchTerm)
    );

    renderQueueTable(filteredQueue);
    updateQueueCountText(filteredQueue);
    updateQueueKpis(filteredQueue);
}

/**
 * Guardar o editar turno.
 */
queueForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const queueId = queueIdInput.value;
    const appointmentId = queueAppointmentSelect.value;
    const status = queueStatusSelect.value;

    showQueueFormMessage("", "");

    if (!appointmentId || !status) {
        showQueueFormMessage("Completa todos los campos antes de guardar el turno.", "error");
        return;
    }

    const appointments = getStoredAppointments();

    if (appointments.length === 0) {
        showQueueFormMessage("Primero registra al menos una cita antes de crear turnos.", "error");
        return;
    }

    const selectedAppointment = appointments.find(appointment => appointment.id === Number(appointmentId));

    if (!selectedAppointment) {
        showQueueFormMessage("No se encontró la cita seleccionada.", "error");
        return;
    }

    const queue = getStoredQueue();

    // ---------- MODO EDITAR ----------
    if (queueId) {
        const updatedQueue = queue.map(item => {
            if (item.id === Number(queueId)) {
                return {
                    ...item,
                    appointmentId: selectedAppointment.id,
                    clientName: selectedAppointment.clientName,
                    date: selectedAppointment.date,
                    time: selectedAppointment.time,
                    status
                };
            }
            return item;
        });

        saveQueue(updatedQueue);
        closeQueueModal();
        resetQueueForm();
        refreshQueueView();
        return;
    }

    // Evitamos duplicar la misma cita en la cola
    const appointmentAlreadyInQueue = queue.some(item => item.appointmentId === Number(appointmentId));

    if (appointmentAlreadyInQueue) {
        showQueueFormMessage("Esa cita ya tiene un turno asignado en la cola.", "error");
        return;
    }

    const newQueueItem = {
        id: Date.now(),
        turnCode: generateNextTurnCode(queue),
        appointmentId: selectedAppointment.id,
        clientName: selectedAppointment.clientName,
        date: selectedAppointment.date,
        time: selectedAppointment.time,
        status,
        createdAt: new Date().toISOString()
    };

    queue.push(newQueueItem);
    saveQueue(queue);

    closeQueueModal();
    resetQueueForm();
    refreshQueueView();
});

// ---------- EVENTOS DEL MODAL ----------
openQueueModalBtn.addEventListener("click", function () {
    const appointments = getStoredAppointments();

    if (appointments.length === 0) {
        alert("Primero registra al menos una cita en el módulo Citas.");
        return;
    }

    populateAppointmentsSelect();
    resetQueueForm();
    openQueueModal();
});

closeQueueModalBtn.addEventListener("click", function () {
    closeQueueModal();
    resetQueueForm();
});

cancelQueueModalBtn.addEventListener("click", function () {
    closeQueueModal();
    resetQueueForm();
});

// Cerrar modal al tocar fuera
queueModal.addEventListener("click", function (event) {
    if (event.target === queueModal) {
        closeQueueModal();
        resetQueueForm();
    }
});

// ---------- BUSCADOR ----------
searchQueueInput.addEventListener("input", handleQueueSearch);

// ---------- BOTÓN ATENDER SIGUIENTE ----------
attendNextBtn.addEventListener("click", attendNextTurn);

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
const currentSession = protectQueuePage();

if (currentSession) {
    loadUserInfo(currentSession);
    populateAppointmentsSelect();
    refreshQueueView();
}