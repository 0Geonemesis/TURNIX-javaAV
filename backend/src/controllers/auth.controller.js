import { pool } from "../config/database.js";
import { httpError } from "../utils/httpError.js";
import bcrypt from "bcryptjs";

const VALID_ROLES = ["cliente", "dueno_negocio", "administrador"];

// Registro basico para dejar lista la persistencia en MySQL.
// No usamos JWT aun, pero si guardamos la contrasena con hash por seguridad.
export async function register(req, res, next) {
  try {
    const { fullName, email, password, role } = req.body;

    if (!fullName || !email || !password || !role) {
      throw httpError(400, "Todos los campos son obligatorios");
    }

    if (!VALID_ROLES.includes(role)) {
      throw httpError(400, "Rol de usuario no permitido");
    }

    if (password.length < 6) {
      throw httpError(400, "La contrasena debe tener al menos 6 caracteres");
    }

    const normalizedEmail = email.trim().toLowerCase();
    const [existingUsers] = await pool.query("SELECT id FROM users WHERE email = ?", [normalizedEmail]);

    if (existingUsers.length > 0) {
      throw httpError(409, "El correo ya esta registrado");
    }

    // El hash convierte la contrasena en un texto no reversible.
    const passwordHash = await bcrypt.hash(password, 10);

    const [result] = await pool.query(
      "INSERT INTO users (full_name, email, password_hash, role) VALUES (?, ?, ?, ?)",
      [fullName.trim(), normalizedEmail, passwordHash, role]
    );

    res.status(201).json({
      message: "Usuario registrado correctamente",
      user: {
        id: result.insertId,
        fullName: fullName.trim(),
        email: normalizedEmail,
        role
      }
    });
  } catch (error) {
    next(error);
  }
}

// Login basico sin JWT porque el Sprint 1 solo prepara la base del sistema.
export async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      throw httpError(400, "Correo y contrasena son obligatorios");
    }

    const [users] = await pool.query(
      "SELECT id, full_name, email, password_hash, role FROM users WHERE email = ? LIMIT 1",
      [email.trim().toLowerCase()]
    );

    if (users.length === 0 || !(await bcrypt.compare(password, users[0].password_hash))) {
      throw httpError(401, "Credenciales incorrectas");
    }

    const user = users[0];

    res.json({
      message: "Inicio de sesion correcto",
      user: {
        id: user.id,
        fullName: user.full_name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    next(error);
  }
}
