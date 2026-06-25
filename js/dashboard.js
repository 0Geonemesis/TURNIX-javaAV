// ======================================================
// TURNIX - DASHBOARD PRINCIPAL
// ======================================================

const SESSION_STORAGE_KEY = "turnix_session";

// Elementos del dashboard que vamos a llenar con datos
const welcomeText = document.getElementById("welcomeText");
const userBadge = document.getElementById("userBadge");
const logoutBtn = document.getElementById("logoutBtn");

const kpiClients = document.getElementById("kpiClients");
const kpiAppointments = document.getElementById("kpiAppointments");
const kpiTurns = document.getElementById("kpiTurns");
const kpiAverage = document.getElementById("kpiAverage");

const appointmentsTableBody = document.getElementById("appointmentsTableBody");

/**
 * Lee la sesión actual desde localStorage.
 * Si no hay sesión, significa que alguien quiso entrar al dashboard
 * "por la ventana" sin pasar por login.
 */
function getCurrentSession() {
    const session = localStorage.getItem(SESSION_STORAGE_KEY);
    return session ? JSON.parse(session) : null;
}

/**
 * Crea una etiqueta visual para el estado de una cita.
 * Esto nos ayuda a no tener una tabla plana y aburrida.
 */
function buildStatusBadge(status) {
    let cssClass = "";

    if (status === "Confirmada") {
        cssClass = "status-confirmada";
    } else if (status === "Pendiente") {
        cssClass = "status-pendiente";
    } else {
        cssClass = "status-cancelada";
    }

    return `<span class="status-badge ${cssClass}">${status}</span>`;
}

/**
 * Llena la tabla de últimas citas con datos demo.
 * Más adelante estos datos saldrán de una base real o de un módulo de citas.
 */
function renderRecentAppointments() {
    const demoAppointments = [
        { client: "María López", date: "24/06/2026", time: "09:00", status: "Confirmada" },
        { client: "Carlos Ruiz", date: "24/06/2026", time: "10:30", status: "Pendiente" },
        { client: "Andrea Torres", date: "24/06/2026", time: "12:00", status: "Confirmada" },
        { client: "Luis Mendoza", date: "24/06/2026", time: "14:15", status: "Cancelada" }
    ];

    appointmentsTableBody.innerHTML = "";

    demoAppointments.forEach(appointment => {
        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${appointment.client}</td>
            <td>${appointment.date}</td>
            <td>${appointment.time}</td>
            <td>${buildStatusBadge(appointment.status)}</td>
        `;

        appointmentsTableBody.appendChild(row);
    });
}

/**
 * Coloca valores demo en los KPIs.
 * Esto nos sirve para que el dashboard ya tenga vida visual desde ahora.
 */
function loadKpis() {
    kpiClients.textContent = "128";
    kpiAppointments.textContent = "18";
    kpiTurns.textContent = "6";
    kpiAverage.textContent = "17 min";
}

/**
 * Si no hay sesión, no deberíamos permitir el acceso al dashboard.
 * Aquí lo protegemos de forma básica.
 */
function protectDashboard() {
    const currentSession = getCurrentSession();

    if (!currentSession) {
        window.location.href = "index.html";
        return null;
    }

    return currentSession;
}

/**
 * Carga la información principal del usuario en pantalla.
 */
function loadUserInfo(session) {
    welcomeText.textContent = `Bienvenido, ${session.fullName}`;
    userBadge.textContent = session.userType === "negocio" ? "Negocio" : "Cliente";
}

/**
 * Cierra la sesión del usuario.
 * En otras palabras: borra la sesión actual y lo devuelve al login.
 */
function logout() {
    localStorage.removeItem(SESSION_STORAGE_KEY);
    window.location.href = "index.html";
}

// ===== INICIO DEL DASHBOARD =====
const currentSession = protectDashboard();

if (currentSession) {
    loadUserInfo(currentSession);
    loadKpis();
    renderRecentAppointments();
}

// Conectamos el botón de cerrar sesión con su acción.
logoutBtn.addEventListener("click", logout);