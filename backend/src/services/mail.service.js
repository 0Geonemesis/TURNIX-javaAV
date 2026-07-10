import nodemailer from "nodemailer";
import { env } from "../config/env.js";

// Envia el correo de bienvenida despues de registrar un cliente o vendedor.
export async function sendWelcomeEmail(user) {
  // El correo de bienvenida siempre se envia al correo que el usuario escribio en la interfaz.
  // WELCOME_TEST_EMAIL queda reservado solo para el script npm run test:mail.
  const recipient = user.email;
  const subject = `Bienvenido a TURN0, ${user.fullName}`;
  const html = buildWelcomeTemplate(user);

  // Si SMTP no esta configurado, no rompemos el registro.
  // Dejamos el correo preparado en consola para poder revisar la plantilla.
  if (!env.mail.host || !env.mail.user || !env.mail.pass) {
    console.log("Correo de bienvenida preparado, pero SMTP no esta configurado.");
    console.log({ to: recipient, subject });
    return { sent: false, reason: "SMTP_NOT_CONFIGURED" };
  }

  const transporter = nodemailer.createTransport({
    host: env.mail.host,
    port: env.mail.port,
    secure: env.mail.port === 465,
    auth: {
      user: env.mail.user,
      pass: env.mail.pass
    }
  });

  const from = env.mail.from.includes("no-reply@turn0.com") && env.mail.user
    ? `TURN0 <${env.mail.user}>`
    : env.mail.from;

  await transporter.sendMail({
    from,
    to: recipient,
    subject,
    html
  });

  return { sent: true, to: recipient };
}

function buildWelcomeTemplate(user) {
  const roleName = user.role === "dueno_negocio" ? "vendedor / negocio" : "cliente";
  const mainAction = user.role === "dueno_negocio" ? "organizar clientes, citas, turnos y reportes" : "agendar y revisar tus citas";

  return `
    <!doctype html>
    <html lang="es">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Bienvenido a TURN0</title>
      </head>
      <body style="margin:0;background:#eef5f4;font-family:Arial,Helvetica,sans-serif;color:#17202a;">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#eef5f4;padding:28px 12px;">
          <tr>
            <td align="center">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:620px;background:#ffffff;border-radius:14px;overflow:hidden;border:1px solid #d8e4e1;">
                <tr>
                  <td style="background:linear-gradient(135deg,#0f766e,#17202a);padding:34px 28px;color:#ffffff;">
                    <div style="font-size:14px;letter-spacing:2px;font-weight:700;">TURN0</div>
                    <h1 style="margin:10px 0 0;font-size:30px;line-height:1.15;">Bienvenido, ${escapeHtml(user.fullName)}</h1>
                    <p style="margin:12px 0 0;color:#ccfbf1;font-size:16px;">Tu cuenta como ${roleName} fue creada correctamente.</p>
                  </td>
                </tr>
                <tr>
                  <td style="padding:28px;">
                    <p style="font-size:16px;line-height:1.6;margin:0 0 18px;">
                      Gracias por unirte a TURN0. Desde ahora podras ${mainAction} desde una plataforma pensada para pequenos negocios que necesitan atender mejor y reducir tiempos de espera.
                    </p>
                    <div style="background:#ecfdf5;border-left:5px solid #0f766e;border-radius:10px;padding:18px;margin:22px 0;">
                      <h2 style="font-size:18px;margin:0 0 10px;">Nuestros planes para TURN0</h2>
                      <ul style="padding-left:20px;margin:0;line-height:1.7;">
                        <li>Mejorar la gestion de citas con recordatorios y calendario mensual.</li>
                        <li>Optimizar turnos para que los clientes esperen menos tiempo.</li>
                        <li>Crear reportes claros para que el negocio tome mejores decisiones.</li>
                        <li>Integrar nuevas herramientas para clientes, vendedores y administradores.</li>
                      </ul>
                    </div>
                    <p style="font-size:15px;line-height:1.6;margin:0 0 22px;color:#64748b;">
                      Si recibiste este correo como prueba, significa que el envio de bienvenida ya esta conectado al flujo de registro.
                    </p>
                    <a href="${env.clientUrl}/login" style="display:inline-block;background:#0f766e;color:#ffffff;text-decoration:none;padding:13px 20px;border-radius:8px;font-weight:700;">
                      Entrar a TURN0
                    </a>
                  </td>
                </tr>
                <tr>
                  <td style="padding:18px 28px;background:#f8fafc;color:#64748b;font-size:13px;">
                    TURN0 - Sistema de filas, citas, turnos y reportes para pequenos negocios.
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
    </html>
  `;
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
