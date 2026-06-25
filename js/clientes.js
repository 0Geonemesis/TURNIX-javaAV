// ======================================================
// TURNIX - MÓDULO DE CLIENTES
// ======================================================

// ---------- CLAVES DE LOCALSTORAGE ----------
const CLIENTS_STORAGE_KEY = "turnix_clients";
const SESSION_STORAGE_KEY = "turnix_session";

// ---------- ELEMENTOS PRINCIPALES DE LA PANTALLA ----------
const userBadge = document.getElementById("userBadge");
const logoutBtn = document.getElementById("logoutBtn");
const clientsTableBody = document.getElementById("clientsTableBody");
const clientsCountText = document.getElementById("clientsCountText");
const searchClientInput = document.getElementById("searchClientInput");

// ---------- ELEMENTOS DEL MODAL ----------
const clientModal = document.getElementById("clientModal");
const openClientModalBtn = document.getElementById("openClientModalBtn");
const closeClientModalBtn = document.getElementById("closeClientModalBtn");
const cancelClientModalBtn = document.getElementById("cancelClientModalBtn");
const clientForm = document.getElementById("clientForm");
const clientFormMessage = document.getElementById("clientFormMessage");
const modalTitle = document.getElementById("modalTitle");

// ---------- CAMPOS DEL FORMULARIO ----------
const clientIdInput = document.getElementById("clientId");
const clientNameInput = document.getElementById("clientName");
const clientEmailInput = document.getElementById("clientEmail");
const clientPhoneInput = document.getElementById("clientPhone");

/**
 * Lee la sesión actual del usuario.
 * Si no hay sesión, significa que entraron a clientes sin pasar por login.
 */
function getCurrentSession() {
    const session = localStorage.getItem(SESSION_STORAGE_KEY);
    return session ? JSON.parse(session) : null;
}

/**
 * Protege la pantalla de clientes.
 * Si no hay usuario logueado, lo devolvemos al login.
 */
function protectClientesPage() {
    const currentSession = getCurrentSession();

    if (!currentSession) {
        window.location.href = "index.html";
        return null;
    }

    return currentSession;
}

/**
 * Muestra el tipo de usuario arriba a la derecha.
 * No es obligatorio para que funcione el sistema, pero sí ayuda
 * a que la interfaz se sienta más viva y más real.
 */
function loadUserInfo(session) {
    userBadge.textContent = session.userType === "negocio" ? "Negocio" : "Cliente";
}

/**
 * Trae la lista de clientes desde localStorage.
 * Si todavía no hay ninguno, devolvemos un arreglo vacío para trabajar tranquilos.
 */
function getStoredClients() {
    const clients = localStorage.getItem(CLIENTS_STORAGE_KEY);
    return clients ? JSON.parse(clients) : [];
}

/**
 * Guarda la lista de clientes actualizada.
 * Cada vez que agregamos, editamos o eliminamos, esta función deja todo persistido.
 */
function saveClients(clients) {
    localStorage.setItem(CLIENTS_STORAGE_KEY, JSON.stringify(clients));
}

/**
 * Muestra mensajes debajo del formulario del modal.
 * Así no repetimos el mismo bloque una y otra vez.
 */
function showClientFormMessage(text, type) {
    clientFormMessage.textContent = text;
    clientFormMessage.className = `form-message ${type}`;
}

/**
 * Abre el modal.
 * Le quitamos la clase "hidden" para que aparezca en pantalla.
 */
function openClientModal() {
    clientModal.classList.remove("hidden");
}

/**
 * Cierra el modal y de paso limpia cualquier mensaje viejo que haya quedado.
 */
function closeClientModal() {
    clientModal.classList.add("hidden");
    showClientFormMessage("", "");
}

/**
 * Limpia el formulario.
 * Lo usamos cuando el usuario quiere crear un cliente nuevo
 * o cuando cerramos el modal y queremos dejarlo listo para la siguiente vez.
 */
function resetClientForm() {
    clientForm.reset();
    clientIdInput.value = "";
    modalTitle.textContent = "Nuevo cliente";
    showClientFormMessage("", "");
}

/**
 * Convierte una fecha ISO a una fecha más agradable de leer.
 * Ejemplo: 2026-06-24T22:10:00.000Z -> 24/06/2026
 */
function formatDate(isoDate) {
    const date = new Date(isoDate);
    return date.toLocaleDateString("es-PE");
}

/**
 * Dibuja la tabla de clientes.
 * Recibe una lista y la pinta en pantalla.
 * Esto nos sirve tanto para mostrar todo como para mostrar resultados filtrados del buscador.
 */
function renderClientsTable(clientsToRender) {
    clientsTableBody.innerHTML = "";

    if (clientsToRender.length === 0) {
        clientsTableBody.innerHTML = `
            <tr>
                <td colspan="5" class="empty-state-cell">
                    Aún no hay clientes registrados en Turnix.
                </td>
            </tr>
        `;
        return;
    }

    clientsToRender.forEach(client => {
        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${client.name}</td>
            <td>${client.email}</td>
            <td>${client.phone}</td>
            <td>${formatDate(client.createdAt)}</td>
            <td>
                <div class="table-actions">
                    <button class="table-action-btn edit-btn" data-id="${client.id}">
                        Editar
                    </button>
                    <button class="table-action-btn delete-btn" data-id="${client.id}">
                        Eliminar
                    </button>
                </div>
            </td>
        `;

        clientsTableBody.appendChild(row);
    });

    // Después de dibujar la tabla, conectamos los botones de editar y eliminar.
    attachClientActionEvents();
}

/**
 * Actualiza el contador que aparece arriba de la tabla.
 * Un detalle pequeño, pero le da más contexto a la pantalla.
 */
function updateClientsCountText(clients) {
    const total = clients.length;
    clientsCountText.textContent = `${total} cliente${total !== 1 ? "s" : ""} registrado${total !== 1 ? "s" : ""}`;
}

/**
 * Esta función es la "foto general" del módulo:
 * - lee los clientes guardados
 * - actualiza el contador
 * - pinta la tabla
 */
function refreshClientsView() {
    const clients = getStoredClients();
    updateClientsCountText(clients);
    renderClientsTable(clients);
}

/**
 * Carga los datos de un cliente en el formulario para editarlo.
 * En vez de crear un nuevo cliente, el usuario modifica el existente.
 */
function loadClientIntoForm(clientId) {
    const clients = getStoredClients();
    const clientToEdit = clients.find(client => client.id === Number(clientId));

    if (!clientToEdit) return;

    clientIdInput.value = clientToEdit.id;
    clientNameInput.value = clientToEdit.name;
    clientEmailInput.value = clientToEdit.email;
    clientPhoneInput.value = clientToEdit.phone;

    modalTitle.textContent = "Editar cliente";
    showClientFormMessage("", "");
    openClientModal();
}

/**
 * Elimina un cliente de localStorage.
 * Antes de borrarlo, pedimos confirmación para evitar clics accidentales.
 */
function deleteClient(clientId) {
    const clients = getStoredClients();
    const clientToDelete = clients.find(client => client.id === Number(clientId));

    if (!clientToDelete) return;

    const confirmDelete = confirm(`¿Seguro que quieres eliminar a "${clientToDelete.name}"?`);

    if (!confirmDelete) return;

    const updatedClients = clients.filter(client => client.id !== Number(clientId));
    saveClients(updatedClients);
    refreshClientsView();
}

/**
 * Conecta los botones de editar y eliminar después de que la tabla se dibuja.
 * Esto es necesario porque esos botones no existen hasta que JS crea las filas.
 */
function attachClientActionEvents() {
    const editButtons = document.querySelectorAll(".edit-btn");
    const deleteButtons = document.querySelectorAll(".delete-btn");

    editButtons.forEach(button => {
        button.addEventListener("click", function () {
            const clientId = this.dataset.id;
            loadClientIntoForm(clientId);
        });
    });

    deleteButtons.forEach(button => {
        button.addEventListener("click", function () {
            const clientId = this.dataset.id;
            deleteClient(clientId);
        });
    });
}

/**
 * Busca clientes por nombre, correo o teléfono.
 * La búsqueda se actualiza mientras el usuario escribe.
 */
function handleClientSearch() {
    const searchTerm = searchClientInput.value.trim().toLowerCase();
    const clients = getStoredClients();

    if (!searchTerm) {
        renderClientsTable(clients);
        updateClientsCountText(clients);
        return;
    }

    const filteredClients = clients.filter(client =>
        client.name.toLowerCase().includes(searchTerm) ||
        client.email.toLowerCase().includes(searchTerm) ||
        client.phone.toLowerCase().includes(searchTerm)
    );

    renderClientsTable(filteredClients);
    updateClientsCountText(filteredClients);
}

/**
 * Guarda o actualiza un cliente.
 * Si el input oculto clientId tiene valor, editamos.
 * Si está vacío, creamos uno nuevo.
 */
clientForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const id = clientIdInput.value;
    const name = clientNameInput.value.trim();
    const email = clientEmailInput.value.trim().toLowerCase();
    const phone = clientPhoneInput.value.trim();

    showClientFormMessage("", "");

    // Validaciones básicas para no guardar información incompleta.
    if (!name || !email || !phone) {
        showClientFormMessage("Completa todos los campos antes de guardar.", "error");
        return;
    }

    const clients = getStoredClients();

    // ---------- MODO EDITAR ----------
    if (id) {
        const repeatedEmail = clients.some(client =>
            client.email === email && client.id !== Number(id)
        );

        if (repeatedEmail) {
            showClientFormMessage("Ya existe otro cliente con ese correo.", "error");
            return;
        }

        const updatedClients = clients.map(client => {
            if (client.id === Number(id)) {
                return {
                    ...client,
                    name,
                    email,
                    phone
                };
            }
            return client;
        });

        saveClients(updatedClients);
        closeClientModal();
        resetClientForm();
        refreshClientsView();
        return;
    }

    // ---------- MODO CREAR ----------
    const emailAlreadyExists = clients.some(client => client.email === email);

    if (emailAlreadyExists) {
        showClientFormMessage("Ese correo ya está registrado como cliente.", "error");
        return;
    }

    const newClient = {
        id: Date.now(),
        name,
        email,
        phone,
        createdAt: new Date().toISOString()
    };

    clients.push(newClient);
    saveClients(clients);

    closeClientModal();
    resetClientForm();
    refreshClientsView();
});

// ---------- EVENTOS DEL MODAL ----------
openClientModalBtn.addEventListener("click", function () {
    resetClientForm();
    openClientModal();
});

closeClientModalBtn.addEventListener("click", function () {
    closeClientModal();
    resetClientForm();
});

cancelClientModalBtn.addEventListener("click", function () {
    closeClientModal();
    resetClientForm();
});

// Si el usuario hace clic fuera de la tarjeta del modal, lo cerramos.
clientModal.addEventListener("click", function (event) {
    if (event.target === clientModal) {
        closeClientModal();
        resetClientForm();
    }
});

// ---------- EVENTO DE BÚSQUEDA ----------
searchClientInput.addEventListener("input", handleClientSearch);

/**
 * Cierra sesión y manda al usuario de vuelta al login.
 */
function logout() {
    localStorage.removeItem(SESSION_STORAGE_KEY);
    window.location.href = "index.html";
}

logoutBtn.addEventListener("click", logout);

// ======================================================
// ARRANQUE DEL MÓDULO
// ======================================================
const currentSession = protectClientesPage();

if (currentSession) {
    loadUserInfo(currentSession);
    refreshClientsView();
}