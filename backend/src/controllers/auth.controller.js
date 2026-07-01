import { loginUser, registerUser } from "../services/auth.service.js";

// Registro basico para dejar lista la persistencia en MySQL.
// No usamos JWT aun, pero si guardamos la contrasena con hash por seguridad.
export async function register(req, res, next) {
  try {
    const user = await registerUser(req.body);
    res.status(201).json({
      message: "Usuario registrado correctamente",
      user
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
