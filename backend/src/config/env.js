import dotenv from "dotenv";
import path from "node:path";
import { fileURLToPath } from "node:url";

// Carga las variables del archivo backend/.env en process.env.
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, "../../.env") });

// Centralizar las variables evita repetir process.env por todo el proyecto.
export const env = {
  port: process.env.PORT || 4000,
  clientUrl: process.env.CLIENT_URL || "http://localhost:5173",
  db: {
    host: process.env.DB_HOST || "localhost",
    port: Number(process.env.DB_PORT || 3306),
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "turn0_db"
  },
  mail: {
    host: process.env.SMTP_HOST || "",
    port: Number(process.env.SMTP_PORT || 587),
    user: process.env.SMTP_USER || "",
    pass: process.env.SMTP_PASS || "",
    from: process.env.SMTP_FROM || "TURN0 <no-reply@turn0.com>",
    welcomeTestEmail: process.env.WELCOME_TEST_EMAIL || ""
  }
};
