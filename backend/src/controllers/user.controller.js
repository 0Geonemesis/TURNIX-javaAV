// Roles disponibles en el registro publico. El administrador se crea solo desde el script SQL.
export function getRoles(req, res) {
  res.json({
    roles: [
      { value: "cliente", label: "Cliente" },
      { value: "dueno_negocio", label: "Dueno de negocio" }
    ]
  });
}
