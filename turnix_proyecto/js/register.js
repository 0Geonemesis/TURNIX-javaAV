// ======================================================
// TURNIX - REGISTRO DE USUARIOS
// ======================================================

// "Pescar" el formulario y el espacio donde mostraremos mensajes.
const registerForm = document.getElementById("registerForm");
const registerMessage = document.getElementById("registerMessage");

// Esta llave será el "cajón" donde guardaremos todos los usuarios en localStorage.
const USERS_STORAGE_KEY = "turnix_users";

/**
 * Mostrar mensajes bonitos al usuario sin repetir código por todos lados.
 * @param {string} text - Lo que queremos decirle al usuario
 * @param {string} type - Puede ser "error" o "success"
 */
function showRegisterMessage(text, type) {
    registerMessage.textContent = text;
    registerMessage.className = `form-message ${type}`;
}

/**
 * Trae los usuarios guardados en localStorage.
 * Si todavía no existe nada, devolvemos un arreglo vacío
 * para que el resto del sistema no explote.
 */
function getStoredUsers() {
    const users = localStorage.getItem(USERS_STORAGE_KEY);
    return users ? JSON.parse(users) : [];
}

/**
 * Guarda la lista completa de usuarios.
 * Piensa en esto como "sobrescribir la libreta" con la versión actualizada.
 */
function saveUsers(users) {
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
}

// Cuando el usuario envíe el formulario, hacemos todo el proceso de registro.
registerForm.addEventListener("submit", function (event) {
    // Frenamos el envío clásico del formulario para manejarlo con JS.
    event.preventDefault();

    // Leemos lo que escribió el usuario y de paso limpiamos espacios molestos.
    const fullName = document.getElementById("fullName").value.trim();
    const email = document.getElementById("registerEmail").value.trim().toLowerCase();
    const password = document.getElementById("registerPassword").value.trim();
    const confirmPassword = document.getElementById("confirmPassword").value.trim();
    const userType = document.getElementById("userType").value;

    // Reiniciamos el mensaje para no mezclar errores viejos con el intento actual.
    showRegisterMessage("", "");

    // ===== VALIDACIONES =====

    // Si algún campo está vacío, cortamos el proceso aquí mismo.
    if (!fullName || !email || !password || !confirmPassword || !userType) {
        showRegisterMessage("Completa todos los campos antes de continuar.", "error");
        return;
    }

    // Contraseña muy corta = futura fuente de dolores de cabeza.
    if (password.length < 6) {
        showRegisterMessage("La contraseña debe tener al menos 6 caracteres.", "error");
        return;
    }

    // Si las contraseñas no coinciden, mejor detenerse antes de guardar basura.
    if (password !== confirmPassword) {
        showRegisterMessage("Las contraseñas no coinciden. Revísalas con calma.", "error");
        return;
    }

    // Sacamos la lista actual de usuarios guardados.
    const users = getStoredUsers();

    // Revisamos si ya existe alguien con ese correo.
    const userExists = users.some(user => user.email === email);

    if (userExists) {
        showRegisterMessage("Ese correo ya está registrado en Turnix.", "error");
        return;
    }

    // Creamos el nuevo usuario.
    // Más adelante esto migrará a BD, pero la estructura ya queda lista.
    const newUser = {
        id: Date.now(), // ID rápido y práctico para esta versión local
        fullName,
        email,
        password,
        userType,
        createdAt: new Date().toISOString()
    };

    // Agregamos el usuario a la lista.
    users.push(newUser);

    // Guardamos la lista actualizada en localStorage.
    saveUsers(users);

    // Le avisamos al usuario que todo salió bien.
    showRegisterMessage("Cuenta creada con éxito. Te llevaremos al login en un momento...", "success");

    // Limpiamos el formulario para dejarlo prolijo.
    registerForm.reset();

    // Damos un pequeño tiempo para que lea el mensaje y luego lo mandamos al login.
    setTimeout(() => {
        window.location.href = "index.html";
    }, 1800);
});