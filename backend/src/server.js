import app from "./app.js";
import { env } from "./config/env.js";

// Este archivo solo levanta el servidor.
// Separarlo de app.js ayuda a probar la app despues sin abrir un puerto real.
const server = app.listen(env.port, () => {
  console.log(`TURN0 API escuchando en http://localhost:${env.port}`);
});

server.on("error", (error) => {
  if (error.code === "EADDRINUSE") {
    console.error(`El puerto ${env.port} ya esta en uso. Cierra la otra terminal de npm run dev o detén el proceso Node anterior.`);
    process.exit(1);
  }

  throw error;
});
