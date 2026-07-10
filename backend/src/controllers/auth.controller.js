import { loginUser, registerUser } from "../services/auth.service.js";
import { sendWelcomeEmail } from "../services/mail.service.js";

// Registro basico para dejar lista la persistencia en MySQL.
// No usamos JWT aun, pero si guardamos la contrasena con hash por seguridad.
export async function register(req, res, next) {
  try {
    const user = await registerUser(req.body);
    let welcomeEmail = { sent: false, reason: "NOT_ATTEMPTED" };

    try {
      welcomeEmail = await sendWelcomeEmail(user);
    } catch (mailError) {
      console.error("No se pudo enviar el correo de bienvenida:", mailError.message);
      welcomeEmail = { sent: false, reason: "MAIL_SEND_FAILED" };
    }

    res.status(201).json({
      message: user.alreadyRegistered
        ? "El usuario ya existia. Se reenvio el correo de bienvenida."
        : "Usuario registrado correctamente",
      user,
      welcomeEmail
    });
  } catch (error) {
    next(error);
  }
}

// Login basico sin JWT porque el Sprint 1 solo prepara la base del sistema.
export async function login(req, res, next) {
  try {
    const user = await loginUser(req.body);
    res.json({
      message: "Inicio de sesion correcto",
      user
    });
  } catch (error) {
    next(error);
  }
}
