import dotenv from "dotenv";

// Carga las variables del archivo backend/.env en process.env.
dotenv.config();

// Centralizar las variables evita repetir process.env por todo el proyecto.
export const env = {
  port: process.env.PORT || 4000,
  clientUrl: process.env.CLIENT_URL || "http://localhost:5173",
  db: {
    host: process.env.DB_HOST || "localhost",
    port: Number(process.env.DB_PORT || 3306),
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "turnix_db"
  }
};
