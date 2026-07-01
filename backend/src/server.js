import app from "./app.js";
import { env } from "./config/env.js";

// Este archivo solo levanta el servidor.
// Separarlo de app.js ayuda a probar la app despues sin abrir un puerto real.
app.listen(env.port, () => {
  console.log(`TURN0 API escuchando en http://localhost:${env.port}`);
});
