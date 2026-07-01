import express from "express";
import cors from "cors";
import { env } from "./config/env.js";
import { errorHandler } from "./middlewares/errorHandler.js";
import healthRoutes from "./routes/health.routes.js";
import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import serviceRoutes from "./routes/service.routes.js";
import clientRoutes from "./routes/client.routes.js";
import appointmentRoutes from "./routes/appointment.routes.js";
import turnRoutes from "./routes/turn.routes.js";
import reportRoutes from "./routes/report.routes.js";

// Creamos una unica instancia de Express para configurar toda la API.
const app = express();

// CORS permite que React, que corre en otro puerto, pueda llamar a Express.
app.use(
  cors({
    origin: env.clientUrl,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true
  })
);

// express.json permite leer datos enviados desde React en formato JSON.
app.use(express.json());

// Ruta raiz sencilla para confirmar en el navegador que la API esta viva.
app.get("/", (req, res) => {
  res.json({
    app: "TURN0 API",
    message: "Base de TURN0 funcionando"
  });
});

// Rutas modulares. Cada archivo de routes agrupa un tema de la API.
app.use("/api/health", healthRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/clients", clientRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/turns", turnRoutes);
app.use("/api/reports", reportRoutes);

// Middleware final para capturar errores y responder siempre en JSON.
app.use(errorHandler);

export default app;
