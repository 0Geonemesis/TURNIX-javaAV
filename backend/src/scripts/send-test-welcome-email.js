import { env } from "../config/env.js";
import { sendWelcomeEmail } from "../services/mail.service.js";

const testEmail = env.mail.welcomeTestEmail || env.mail.user;

if (!testEmail) {
  console.error("Configura WELCOME_TEST_EMAIL o SMTP_USER en backend/.env para probar el envio.");
  process.exit(1);
}

const testUser = {
  fullName: "Usuario de Prueba TURN0",
  email: testEmail,
  role: "dueno_negocio"
};

try {
  const result = await sendWelcomeEmail(testUser);

  if (!result.sent) {
    console.error("El correo no se envio porque falta configuracion SMTP.");
    console.error("Completa SMTP_USER, SMTP_PASS y WELCOME_TEST_EMAIL en backend/.env.");
    process.exit(1);
  }

  console.log(`Correo de bienvenida enviado correctamente a ${result.to}.`);
} catch (error) {
  console.error("No se pudo enviar el correo de prueba.");
  console.error(error.message);
  process.exit(1);
}
