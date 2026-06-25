// ======================================================
// TURNIX - MÓDULO DE REPORTES
// ======================================================

// ---------- CLAVES DE LOCALSTORAGE ----------
const CLIENTS_STORAGE_KEY = "turnix_clients";
const APPOINTMENTS_STORAGE_KEY = "turnix_appointments";
const QUEUE_STORAGE_KEY = "turnix_queue";
const SESSION_STORAGE_KEY = "turnix_session";

// ---------- ELEMENTOS GENERALES ----------
const userBadge = document.getElementById("userBadge");
const logoutBtn = document.getElementById("logoutBtn");

// ---------- KPIs PRINCIPALES ----------
const reportTotalClients = document.getElementById("reportTotalClients");
const reportTotalAppointments = document.getElementById("reportTotalAppointments");
const reportAppointmentsToday = document.getElementById("reportAppointmentsToday");
const reportActiveQueue = document.getElementById("reportActiveQueue");

// ---------- KPIs SECUNDARIOS ----------
const reportAttendedQueue = document.getElementById("reportAttendedQueue");
const reportCancelledQueue = document.getElementById("reportCancelledQueue");
const reportAttentionRate = document.getElementById("reportAttentionRate");
const reportClientsWithAppointments = document.getElementById("reportClientsWithAppointments");

// ---------- RESUMEN ----------
const summaryBestState = document.getElementById("summaryBestState");
const summaryLatestClient = document.getElementById("summaryLatestClient");
const summaryLatestAppointment = document.getElementById("summaryLatestAppointment");

// ---------- TABLA ----------
const reportTableBody = document.getElementById("reportTableBody");
const reportGeneratedDate = document.getElementById("reportGeneratedDate");

// ---------- CANVAS ----------
const reportChart = document.getElementById("reportChart");

// ======================================================
// UTILIDADES DE SESIÓN
// ======================================================

/**
 * Leemos la sesión activa de Turnix.
 * Si no existe, no dejamos entrar a esta pantalla.
 */
function getCurrentSession() {
    const session = localStorage.getItem(SESSION_STORAGE_KEY);
    return session ? JSON.parse(session) : null;
}

/**
 * Protege la página para que no se abra si el usuario no inició sesión.
 */
function protectReportsPage() {
    const currentSession = getCurrentSession();

    if (!currentSession) {
        window.location.href = "index.html";
        return null;
    }

    return currentSession;
}

/**
 * Muestra el tipo de usuario arriba a la derecha.
 */
function loadUserInfo(session) {
    userBadge.textContent = session.userType === "negocio" ? "Negocio" : "Cliente";
}

// ======================================================
// LECTURA DE DATOS
// ======================================================

/**
 * Lee clientes guardados.
 */
function getStoredClients() {
    const clients = localStorage.getItem(CLIENTS_STORAGE_KEY);
    return clients ? JSON.parse(clients) : [];
}

/**
 * Lee citas guardadas.
 */
function getStoredAppointments() {
    const appointments = localStorage.getItem(APPOINTMENTS_STORAGE_KEY);
    return appointments ? JSON.parse(appointments) : [];
}

/**
 * Lee la cola de turnos guardada.
 */
function getStoredQueue() {
    const queue = localStorage.getItem(QUEUE_STORAGE_KEY);
    return queue ? JSON.parse(queue) : [];
}

// ======================================================
// FORMATEO / FECHAS
// ======================================================

/**
 * Devuelve la fecha de hoy en formato YYYY-MM-DD.
 * Esto nos sirve para comparar con las citas guardadas.
 */
function getTodayDateString() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
}

/**
 * Convierte una fecha YYYY-MM-DD a formato más amigable.
 */
function formatDate(dateString) {
    const date = new Date(`${dateString}T00:00:00`);
    return date.toLocaleDateString("es-PE");
}

/**
 * Muestra fecha y hora del último refresco del panel.
 */
function getReportTimestamp() {
    const now = new Date();
    return now.toLocaleString("es-PE");
}

// ======================================================
// CÁLCULOS DEL REPORTE
// ======================================================

/**
 * A partir de clientes, citas y cola, construimos todas las métricas.
 * Lo hacemos en una sola función para que el reporte tenga una sola fuente de verdad.
 */
function buildReportData() {
    const clients = getStoredClients();
    const appointments = getStoredAppointments();
    const queue = getStoredQueue();

    const today = getTodayDateString();

    const totalClients = clients.length;
    const totalAppointments = appointments.length;

    const appointmentsToday = appointments.filter(appointment => appointment.date === today).length;

    const activeQueue = queue.filter(item =>
        item.status === "En espera" || item.status === "En atención"
    ).length;

    const attendedQueue = queue.filter(item => item.status === "Atendido").length;
    const cancelledQueue = queue.filter(item => item.status === "Cancelado").length;

    // Clientes únicos que tienen al menos una cita
    const clientsWithAppointmentsSet = new Set(
        appointments.map(appointment => appointment.clientId)
    );
    const clientsWithAppointments = clientsWithAppointmentsSet.size;

    // Tasa de atención
    const attentionRate =
        queue.length === 0
            ? 0
            : Math.round((attendedQueue / queue.length) * 100);

    // Conteo por estado para el gráfico
    const waitingCount = queue.filter(item => item.status === "En espera").length;
    const inProgressCount = queue.filter(item => item.status === "En atención").length;
    const doneCount = attendedQueue;
    const cancelledCount = cancelledQueue;

    // Estado dominante del sistema
    const stateMap = [
        { label: "En espera", value: waitingCount },
        { label: "En atención", value: inProgressCount },
        { label: "Atendido", value: doneCount },
        { label: "Cancelado", value: cancelledCount }
    ];

    const bestState = stateMap.sort((a, b) => b.value - a.value)[0];

    // Último cliente agregado
    let latestClientText = "Sin registros";
    if (clients.length > 0) {
        const latestClient = [...clients].sort((a, b) => b.id - a.id)[0];
        latestClientText = latestClient.name;
    }

    // Última cita registrada
    let latestAppointmentText = "Sin citas";
    if (appointments.length > 0) {
        const latestAppointment = [...appointments].sort((a, b) => b.id - a.id)[0];
        latestAppointmentText = `${latestAppointment.clientName} - ${formatDate(latestAppointment.date)} ${latestAppointment.time}`;
    }

    return {
        totalClients,
        totalAppointments,
        appointmentsToday,
        activeQueue,
        attendedQueue,
        cancelledQueue,
        attentionRate,
        clientsWithAppointments,
        waitingCount,
        inProgressCount,
        doneCount,
        cancelledCount,
        bestStateLabel: bestState && bestState.value > 0 ? `${bestState.label} (${bestState.value})` : "Sin datos",
        latestClientText,
        latestAppointmentText,
        generatedAt: getReportTimestamp(),
        queueLength: queue.length
    };
}

// ======================================================
// PINTADO DE KPIs
// ======================================================

/**
 * Inserta los números en las tarjetas KPI.
 */
function renderReportKpis(reportData) {
    reportTotalClients.textContent = reportData.totalClients;
    reportTotalAppointments.textContent = reportData.totalAppointments;
    reportAppointmentsToday.textContent = reportData.appointmentsToday;
    reportActiveQueue.textContent = reportData.activeQueue;

    reportAttendedQueue.textContent = reportData.attendedQueue;
    reportCancelledQueue.textContent = reportData.cancelledQueue;
    reportAttentionRate.textContent = `${reportData.attentionRate}%`;
    reportClientsWithAppointments.textContent = reportData.clientsWithAppointments;
}

/**
 * Pinta la caja de resumen lateral.
 */
function renderSummary(reportData) {
    summaryBestState.textContent = reportData.bestStateLabel;
    summaryLatestClient.textContent = reportData.latestClientText;
    summaryLatestAppointment.textContent = reportData.latestAppointmentText;
}

/**
 * Pinta la tabla resumen del sistema.
 */
function renderReportTable(reportData) {
    reportTableBody.innerHTML = "";

    const rows = [
        {
            metric: "Clientes registrados",
            value: reportData.totalClients,
            comment: reportData.totalClients > 0
                ? "La base de clientes ya tiene movimiento."
                : "Aún no se registran clientes."
        },
        {
            metric: "Citas registradas",
            value: reportData.totalAppointments,
            comment: reportData.totalAppointments > 0
                ? "Ya existen citas cargadas dentro del sistema."
                : "Todavía no se han creado citas."
        },
        {
            metric: "Citas del día",
            value: reportData.appointmentsToday,
            comment: reportData.appointmentsToday > 0
                ? "Hoy sí hay agenda activa."
                : "Hoy no hay citas registradas."
        },
        {
            metric: "Turnos activos",
            value: reportData.activeQueue,
            comment: reportData.activeQueue > 0
                ? "Hay turnos pendientes o en atención."
                : "No hay turnos activos en este momento."
        },
        {
            metric: "Turnos atendidos",
            value: reportData.attendedQueue,
            comment: reportData.attendedQueue > 0
                ? "Ya se completaron atenciones en la cola."
                : "Aún no se marcan turnos como atendidos."
        },
        {
            metric: "Turnos cancelados",
            value: reportData.cancelledQueue,
            comment: reportData.cancelledQueue > 0
                ? "Hay turnos que no llegaron a concretarse."
                : "No hay turnos cancelados registrados."
        },
        {
            metric: "Tasa de atención",
            value: `${reportData.attentionRate}%`,
            comment: reportData.queueLength > 0
                ? "Porcentaje de turnos atendidos sobre el total de la cola."
                : "No se puede calcular todavía porque la cola está vacía."
        },
        {
            metric: "Clientes con cita",
            value: reportData.clientsWithAppointments,
            comment: reportData.clientsWithAppointments > 0
                ? "Parte de la base de clientes ya está usando el sistema de citas."
                : "Ningún cliente tiene cita asociada por ahora."
        }
    ];

    rows.forEach(rowData => {
        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${rowData.metric}</td>
            <td>${rowData.value}</td>
            <td>${rowData.comment}</td>
        `;

        reportTableBody.appendChild(row);
    });

    reportGeneratedDate.textContent = `Actualizado: ${reportData.generatedAt}`;
}

// ======================================================
// GRÁFICO SIMPLE EN CANVAS
// ======================================================

/**
 * Dibuja un gráfico de barras simple con Canvas nativo.
 * No usamos librerías externas para mantener el proyecto liviano.
 */
function drawReportChart(reportData) {
    if (!reportChart) return;

    const ctx = reportChart.getContext("2d");
    const width = reportChart.width;
    const height = reportChart.height;

    // Limpiamos el lienzo antes de volver a pintar
    ctx.clearRect(0, 0, width, height);

    const data = [
        { label: "En espera", value: reportData.waitingCount, color: "#f59e0b" },
        { label: "En atención", value: reportData.inProgressCount, color: "#2563eb" },
        { label: "Atendido", value: reportData.doneCount, color: "#16a34a" },
        { label: "Cancelado", value: reportData.cancelledCount, color: "#dc2626" }
    ];

    const maxValue = Math.max(...data.map(item => item.value), 1);

    const chartPadding = 50;
    const chartBottom = height - 45;
    const chartTop = 30;
    const chartHeight = chartBottom - chartTop;

    const barWidth = 90;
    const gap = 45;
    const totalChartWidth = (barWidth * data.length) + (gap * (data.length - 1));
    const startX = (width - totalChartWidth) / 2;

    // Título auxiliar del gráfico
    ctx.fillStyle = "#0f172a";
    ctx.font = "bold 16px Arial";
    ctx.fillText("Distribución de turnos por estado", 20, 22);

    data.forEach((item, index) => {
        const x = startX + index * (barWidth + gap);
        const barHeight = (item.value / maxValue) * chartHeight;
        const y = chartBottom - barHeight;

        // Barra
        ctx.fillStyle = item.color;
        ctx.fillRect(x, y, barWidth, barHeight);

        // Valor arriba de la barra
        ctx.fillStyle = "#0f172a";
        ctx.font = "bold 14px Arial";
        ctx.textAlign = "center";
        ctx.fillText(item.value, x + barWidth / 2, y - 10);

        // Etiqueta debajo
        ctx.font = "13px Arial";
        ctx.fillText(item.label, x + barWidth / 2, chartBottom + 22);
    });

    // Línea base
    ctx.beginPath();
    ctx.moveTo(30, chartBottom);
    ctx.lineTo(width - 30, chartBottom);
    ctx.strokeStyle = "#cbd5e1";
    ctx.lineWidth = 1;
    ctx.stroke();

    ctx.textAlign = "start";
}

// ======================================================
// REFRESCO GENERAL DEL MÓDULO
// ======================================================

/**
 * Vuelve a leer los datos del sistema y repinta todo.
 * Si mañana cambias Clientes, Citas o Filas, esta función absorberá los cambios.
 */
function refreshReportsView() {
    const reportData = buildReportData();

    renderReportKpis(reportData);
    renderSummary(reportData);
    renderReportTable(reportData);
    drawReportChart(reportData);
}

// ======================================================
// CIERRE DE SESIÓN
// ======================================================

function logout() {
    localStorage.removeItem(SESSION_STORAGE_KEY);
    window.location.href = "index.html";
}

logoutBtn.addEventListener("click", logout);

// ======================================================
// ARRANQUE DEL MÓDULO
// ======================================================

const currentSession = protectReportsPage();

if (currentSession) {
    loadUserInfo(currentSession);
    refreshReportsView();
}