// ======================================================
// TURNIX - MÓDULO DE PERFIL
// ======================================================

// ---------- CLAVES DE LOCALSTORAGE ----------
const USERS_STORAGE_KEY = "turnix_users";
const SESSION_STORAGE_KEY = "turnix_session";

// ---------- ELEMENTOS GENERALES ----------
const userBadge = document.getElementById("userBadge");
const logoutBtn = document.getElementById("logoutBtn");

// ---------- TARJETA RESUMEN ----------
const profileAvatar = document.getElementById("profileAvatar");
const profileNameText = document.getElementById("profileNameText");
const profileEmailText = document.getElementById("profileEmailText");
const profileTypeText = document.getElementById("profileTypeText");
const profileCreatedAtText = document.getElementById("profileCreatedAtText");
const profileIdText = document.getElementById("profileIdText");

// ---------- FORMULARIO ----------
const profileForm = document.getElementById("profileForm");
const profileUserId = document.getElementById("profileUserId");
const profileName = document.getElementById("profileName");
const profileEmail = document.getElementById("profileEmail");
const profileUserType = document.getElementById("profileUserType");
const profileCreatedAt = document.getElementById("profileCreatedAt");

const profileCurrentPassword = document.getElementById("profileCurrentPassword");
const profileNewPassword = document.getElementById("profileNewPassword");
const profileConfirmPassword = document.getElementById("profileConfirmPassword");

const profileFormMessage = document.getElementById("profileFormMessage");
const resetProfileBtn = document.getElementById("resetProfileBtn");

// Guardaremos aquí una copia del usuario actual para poder “revertir”
let originalUserData = null;

// ======================================================
// SESIÓN Y PROTECCIÓN
// ======================================================

/**
 * Leemos la sesión actual.
 * Si no existe, significa que no hay nadie autenticado.
 */
function getCurrentSession() {
    const session = localStorage.getItem(SESSION_STORAGE_KEY);
    return session ? JSON.parse(session) : null;
}

/**
 * Esta pantalla no debería abrirse si no existe una sesión válida.
 */
function protectProfilePage() {
    const currentSession = getCurrentSession();

    if (!currentSession) {
        window.location.href = "index.html";
        return null;
    }

    return currentSession;
}

/**
 * Muestra arriba el tipo de cuenta del usuario logueado.
 */
function loadUserInfo(session) {
    userBadge.textContent = session.userType === "negocio" ? "Negocio" : "Cliente";
}

// ======================================================
// DATOS DE USUARIOS
// ======================================================

/**
 * Traemos todos los usuarios registrados en Turnix.
 */
function getStoredUsers() {
    const users = localStorage.getItem(USERS_STORAGE_KEY);
    return users ? JSON.parse(users) : [];
}

/**
 * Guardamos la lista completa de usuarios.
 */
function saveUsers(users) {
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
}

/**
 * Guarda la sesión actualizada.
 * Esto es clave porque si el usuario cambia nombre/correo/rol,
 * la sesión también debe reflejarlo para que el sistema no quede “partido”.
 */
function saveSession(sessionData) {
    localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(sessionData));
}

// ======================================================
// UTILIDADES DE VISTA
// ======================================================

/**
 * Mensajes del formulario.
 */
function showProfileMessage(text, type) {
    profileFormMessage.textContent = text;
    profileFormMessage.className = `form-message ${type}`;
}

/**
 * Convierte "negocio" o "cliente" a texto más bonito para la tarjeta.
 */
function formatUserType(userType) {
    return userType === "negocio" ? "Negocio" : "Cliente";
}

/**
 * Devuelve una fecha bonita en formato peruano.
 */
function formatDate(dateString) {
    if (!dateString) return "Sin fecha";

    const date = new Date(dateString);
    return date.toLocaleDateString("es-PE", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit"
    });
}

/**
 * Devuelve la inicial del usuario para la bolita del perfil.
 */
function getUserInitial(name) {
    if (!name || !name.trim()) return "U";
    return name.trim().charAt(0).toUpperCase();
}

/**
 * Limpia los campos de cambio de contraseña.
 * Lo hago aparte porque estos campos son delicados y conviene resetearlos
 * cada vez que se guarda o se revierte el formulario.
 */
function clearPasswordFields() {
    profileCurrentPassword.value = "";
    profileNewPassword.value = "";
    profileConfirmPassword.value = "";
}

// ======================================================
// CARGA DEL PERFIL
// ======================================================

/**
 * Busca al usuario actual dentro de turnix_users usando el ID de la sesión.
 */
function getLoggedUser() {
    const currentSession = getCurrentSession();
    if (!currentSession) return null;

    const users = getStoredUsers();
    return users.find(user => user.id === currentSession.id) || null;
}

/**
 * Dibuja la tarjeta lateral del perfil.
 */
function renderProfileSummary(user) {
    profileAvatar.textContent = getUserInitial(user.name);
    profileNameText.textContent = user.name;
    profileEmailText.textContent = user.email;
    profileTypeText.textContent = formatUserType(user.userType);
    profileCreatedAtText.textContent = formatDate(user.createdAt);
    profileIdText.textContent = user.id;
}

/**
 * Carga los datos del usuario dentro del formulario.
 */
function fillProfileForm(user) {
    profileUserId.value = user.id;
    profileName.value = user.name;
    profileEmail.value = user.email;
    profileUserType.value = user.userType;
    profileCreatedAt.value = formatDate(user.createdAt);

    clearPasswordFields();
    showProfileMessage("", "");
}

/**
 * Carga el perfil completo.
 */
function loadProfileData() {
    const loggedUser = getLoggedUser();

    if (!loggedUser) {
        alert("No se encontró el usuario actual en la base local del sistema.");
        localStorage.removeItem(SESSION_STORAGE_KEY);
        window.location.href = "index.html";
        return;
    }

    // Guardamos una copia limpia para poder volver atrás si el usuario toca “Revertir”
    originalUserData = { ...loggedUser };

    renderProfileSummary(loggedUser);
    fillProfileForm(loggedUser);
}

// ======================================================
// VALIDACIONES
// ======================================================

/**
 * Revisa si el correo ya existe en otro usuario.
 * Permitimos el mismo correo solo si pertenece al usuario que está editando su propio perfil.
 */
function isEmailTakenByAnotherUser(email, currentUserId) {
    const users = getStoredUsers();

    return users.some(user =>
        user.email.toLowerCase() === email.toLowerCase() &&
        user.id !== currentUserId
    );
}

/**
 * Revisa si el usuario quiere cambiar contraseña.
 * Basta con que alguno de los 3 campos tenga algo escrito.
 */
function wantsToChangePassword() {
    return (
        profileCurrentPassword.value.trim() !== "" ||
        profileNewPassword.value.trim() !== "" ||
        profileConfirmPassword.value.trim() !== ""
    );
}

/**
 * Valida todo lo relacionado al cambio de contraseña.
 */
function validatePasswordChange(loggedUser) {
    const currentPassword = profileCurrentPassword.value.trim();
    const newPassword = profileNewPassword.value.trim();
    const confirmPassword = profileConfirmPassword.value.trim();

    // Si quiere cambiar contraseña, los 3 campos deben estar completos
    if (!currentPassword || !newPassword || !confirmPassword) {
        return "Si vas a cambiar la contraseña, completa los tres campos.";
    }

    if (currentPassword !== loggedUser.password) {
        return "La contraseña actual no coincide con la registrada.";
    }

    if (newPassword.length < 6) {
        return "La nueva contraseña debe tener al menos 6 caracteres.";
    }

    if (newPassword !== confirmPassword) {
        return "La confirmación de la nueva contraseña no coincide.";
    }

    if (newPassword === currentPassword) {
        return "La nueva contraseña no debería ser igual a la actual.";
    }

    return null;
}

// ======================================================
// GUARDAR CAMBIOS
// ======================================================

/**
 * Guarda los cambios del perfil y, si hace falta, actualiza la contraseña.
 */
function handleProfileSave(event) {
    event.preventDefault();

    const loggedUser = getLoggedUser();

    if (!loggedUser) {
        showProfileMessage("No se pudo recuperar la sesión del usuario actual.", "error");
        return;
    }

    const userId = Number(profileUserId.value);
    const name = profileName.value.trim();
    const email = profileEmail.value.trim();
    const userType = profileUserType.value;

    showProfileMessage("", "");

    if (!name || !email || !userType) {
        showProfileMessage("Completa los campos principales del perfil antes de guardar.", "error");
        return;
    }

    if (isEmailTakenByAnotherUser(email, userId)) {
        showProfileMessage("Ese correo ya está registrado en otra cuenta del sistema.", "error");
        return;
    }

    // Si el usuario tocó los campos de contraseña, validamos todo ese bloque
    if (wantsToChangePassword()) {
        const passwordError = validatePasswordChange(loggedUser);

        if (passwordError) {
            showProfileMessage(passwordError, "error");
            return;
        }
    }

    const users = getStoredUsers();

    const updatedUsers = users.map(user => {
        if (user.id === userId) {
            return {
                ...user,
                name,
                email,
                userType,
                password: wantsToChangePassword()
                    ? profileNewPassword.value.trim()
                    : user.password
            };
        }

        return user;
    });

    saveUsers(updatedUsers);

    // Buscamos el usuario actualizado para refrescar la sesión
    const updatedUser = updatedUsers.find(user => user.id === userId);

    if (!updatedUser) {
        showProfileMessage("Ocurrió un problema al actualizar la cuenta.", "error");
        return;
    }

    // Aquí actualizamos la sesión actual con los datos nuevos
    saveSession({
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        userType: updatedUser.userType
    });

    originalUserData = { ...updatedUser };

    renderProfileSummary(updatedUser);
    fillProfileForm(updatedUser);
    loadUserInfo(updatedUser);

    showProfileMessage("Perfil actualizado correctamente. Los cambios ya quedaron guardados en Turnix.", "success");
}

/**
 * Devuelve el formulario al último estado guardado.
 */
function resetProfileFormToOriginal() {
    if (!originalUserData) return;

    fillProfileForm(originalUserData);
    renderProfileSummary(originalUserData);
    showProfileMessage("Se restauraron los datos visibles al último estado guardado.", "success");
}

// ======================================================
// CIERRE DE SESIÓN
// ======================================================

function logout() {
    localStorage.removeItem(SESSION_STORAGE_KEY);
    window.location.href = "index.html";
}

// ======================================================
// EVENTOS
// ======================================================

profileForm.addEventListener("submit", handleProfileSave);

resetProfileBtn.addEventListener("click", resetProfileFormToOriginal);

logoutBtn.addEventListener("click", logout);

// ======================================================
// ARRANQUE DEL MÓDULO
// ======================================================

const currentSession = protectProfilePage();

if (currentSession) {
    loadUserInfo(currentSession);
    loadProfileData();
}