import bcrypt from "bcryptjs";
import { pool } from "../config/database.js";
import { httpError } from "../utils/httpError.js";

const PUBLIC_REGISTER_ROLES = ["cliente", "dueno_negocio"];

// Servicio de registro: valida, hashea contrasena y guarda usuario.
export async function registerUser({ fullName, email, password, role }) {
  if (!fullName || !email || !password || !role) {
    throw httpError(400, "Todos los campos son obligatorios");
  }

  if (!PUBLIC_REGISTER_ROLES.includes(role)) {
    throw httpError(403, "No se puede crear un administrador desde el registro publico");
  }

  if (password.length < 6) {
    throw httpError(400, "La contrasena debe tener al menos 6 caracteres");
  }

  const normalizedEmail = email.trim().toLowerCase();
  const [existingUsers] = await pool.query("SELECT id, full_name, email, role FROM users WHERE email = ?", [normalizedEmail]);

  if (existingUsers.length > 0) {
    const existingUser = existingUsers[0];
    return {
      id: existingUser.id,
      fullName: existingUser.full_name,
      email: existingUser.email,
      role: existingUser.role,
      alreadyRegistered: true
    };
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const [result] = await pool.query(
    "INSERT INTO users (full_name, email, password_hash, role) VALUES (?, ?, ?, ?)",
    [fullName.trim(), normalizedEmail, passwordHash, role]
  );

  return {
    id: result.insertId,
    fullName: fullName.trim(),
    email: normalizedEmail,
    role,
    alreadyRegistered: false
  };
}

// Servicio de login: permite usuario tipo texto, por ejemplo admin.
export async function loginUser({ email, password }) {
  if (!email || !password) {
    throw httpError(400, "Usuario y contrasena son obligatorios");
  }

  const [users] = await pool.query(
    "SELECT id, full_name, email, password_hash, role, is_active FROM users WHERE email = ? LIMIT 1",
    [email.trim().toLowerCase()]
  );

  if (users.length === 0 || !(await bcrypt.compare(password, users[0].password_hash))) {
    throw httpError(401, "Credenciales incorrectas");
  }

  if (!users[0].is_active) {
    throw httpError(403, "El usuario esta desactivado");
  }

  const user = users[0];
  return {
    id: user.id,
    fullName: user.full_name,
    email: user.email,
    role: user.role
  };
}
