// ======================================================
// TURNIX - INICIO DE SESIÓN
// ======================================================

const loginForm = document.getElementById("loginForm");
const loginMessage = document.getElementById("loginMessage");

// Llaves de localStorage.
// Una guarda usuarios; la otra guarda quién inició sesión.
const USERS_STORAGE_KEY = "turnix_users";
const SESSION_STORAGE_KEY = "turnix_session";

/**
 * Muestra mensajes dentro del login.
 * Así evitamos repetir el mismo bloque una y otra vez.
 */
function showLoginMessage(text, type) {
    loginMessage.textContent = text;
    loginMessage.className = `form-message ${type}`;
}

/**
 * Recupera la lista de usuarios guardados.
 * Si aún no hay registros, devuelve un arreglo vacío.
 */
function getStoredUsers() {
    const users = localStorage.getItem(USERS_STORAGE_KEY);
    return users ? JSON.parse(users) : [];
}

// Escuchamos el envío del formulario de login.
loginForm.addEventListener("submit", function (event) {
    event.preventDefault();

    // Leemos los campos y normalizamos el correo en minúsculas.
    const email = document.getElementById("loginEmail").value.trim().toLowerCase();
    const password = document.getElementById("loginPassword").value.trim();

    // Limpiamos mensajes anteriores.
    showLoginMessage("", "");

    // Validación rápida para evitar procesar campos vacíos.
    if (!email || !password) {
        showLoginMessage("Ingresa tu correo y tu contraseña.", "error");
        return;
    }

    // Traemos los usuarios guardados.
    const users = getStoredUsers();

    // Buscamos un usuario cuyo correo y contraseña coincidan.
    const foundUser = users.find(user => user.email === email && user.password === password);

    // Si no encontramos coincidencia, no dejamos pasar.
    if (!foundUser) {
        showLoginMessage("Correo o contraseña incorrectos.", "error");
        return;
    }

    // Si sí encontramos al usuario, guardamos una sesión simple.
    // No hace falta meter toda la base de usuarios aquí; solo la info clave.
    const sessionData = {
        id: foundUser.id,
        fullName: foundUser.fullName,
        email: foundUser.email,
        userType: foundUser.userType,
        loginAt: new Date().toISOString()
    };

    localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(sessionData));

    showLoginMessage("Inicio de sesión correcto. Entrando al panel...", "success");

    // Espera corta para que el usuario vea el mensaje y luego redirección.
    setTimeout(() => {
        window.location.href = "dashboard.html";
    }, 1200);
});