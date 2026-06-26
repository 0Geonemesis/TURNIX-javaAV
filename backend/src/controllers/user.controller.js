// Estos roles son la base pedida: cliente, dueno de negocio y administrador.
export function getRoles(req, res) {
  res.json({
    roles: [
      { value: "cliente", label: "Cliente" },
      { value: "dueno_negocio", label: "Dueno de negocio" },
      { value: "administrador", label: "Administrador" }
    ]
  });
}
