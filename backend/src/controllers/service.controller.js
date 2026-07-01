// Servicios principales que TURN0 ofrece en la pagina de inicio.
// Por ahora son datos base; luego pueden venir desde MySQL.
export function getServices(req, res) {
  res.json({
    services: [
      {
        id: 1,
        title: "Gestion de clientes",
        description: "Organiza datos de clientes frecuentes y visitantes nuevos."
      },
      {
        id: 2,
        title: "Citas programadas",
        description: "Prepara la agenda del negocio por fecha, hora y estado."
      },
      {
        id: 3,
        title: "Turnos en fila",
        description: "Controla la atencion por orden de llegada y reduce esperas."
      },
      {
        id: 4,
        title: "Reportes",
        description: "Consulta indicadores para tomar mejores decisiones."
      }
    ]
  });
}
