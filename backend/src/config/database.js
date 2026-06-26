import mysql from "mysql2/promise";
import { env } from "./env.js";

// Pool mantiene conexiones reutilizables con MySQL.
// Es mejor que abrir una conexion nueva por cada consulta.
export const pool = mysql.createPool({
  host: env.db.host,
  port: env.db.port,
  user: env.db.user,
  password: env.db.password,
  database: env.db.database,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Esta funcion sirve para probar si MySQL responde correctamente.
export async function checkDatabaseConnection() {
  const connection = await pool.getConnection();
  await connection.ping();
  connection.release();
}
