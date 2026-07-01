import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getRoles, registerUser } from "../api/authService";

// Pagina de registro para los 3 usuarios base: cliente, dueno y administrador.
export default function RegisterPage() {
  const navigate = useNavigate();
  const [roles, setRoles] = useState([]);
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: ""
  });
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("text-muted");

  useEffect(() => {
    getRoles()
      .then((response) => setRoles(response.data.roles))
      .catch(() =>
        setRoles([
          { value: "cliente", label: "Cliente" },
          { value: "dueno_negocio", label: "Dueno de negocio" }
        ])
      );
  }, []);

  function handleChange(event) {
    setForm({ ...form, [event.target.name]: event.target.value });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setMessage("");

    if (!form.fullName || !form.email || !form.password || !form.confirmPassword || !form.role) {
      setMessageType("text-danger");
      setMessage("Completa todos los campos.");
      return;
    }

    if (form.password !== form.confirmPassword) {
      setMessageType("text-danger");
      setMessage("Las contrasenas no coinciden.");
      return;
    }

    try {
      await registerUser({
        fullName: form.fullName,
        email: form.email,
        password: form.password,
        role: form.role
      });
      setMessageType("text-success");
      setMessage("Cuenta creada correctamente. Te llevaremos al login...");
      setTimeout(() => navigate("/login"), 900);
    } catch (error) {
      setMessageType("text-danger");
      setMessage(error.response?.data?.message || "No se pudo registrar el usuario.");
    }
  }

  return (
    <main className="auth-page">
      <section className="auth-card wide">
        <div className="auth-brand">
          <span className="brand-mark">T</span>
          <h1>Crear cuenta</h1>
          <p>Registra un cliente o dueno de negocio. El administrador se crea desde la base de datos.</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="row g-3">
            <div className="col-md-6">
              <label className="form-label" htmlFor="fullName">
                Nombre completo
              </label>
              <input className="form-control" id="fullName" name="fullName" value={form.fullName} onChange={handleChange} />
            </div>

            <div className="col-md-6">
              <label className="form-label" htmlFor="email">
                Correo electronico
              </label>
              <input className="form-control" id="email" name="email" type="email" value={form.email} onChange={handleChange} />
            </div>

            <div className="col-md-6">
              <label className="form-label" htmlFor="password">
                Contrasena
              </label>
              <input className="form-control" id="password" name="password" type="password" value={form.password} onChange={handleChange} />
            </div>

            <div className="col-md-6">
              <label className="form-label" htmlFor="confirmPassword">
                Confirmar contrasena
              </label>
              <input className="form-control" id="confirmPassword" name="confirmPassword" type="password" value={form.confirmPassword} onChange={handleChange} />
            </div>

            <div className="col-12">
              <label className="form-label" htmlFor="role">
                Tipo de usuario
              </label>
              <select className="form-select" id="role" name="role" value={form.role} onChange={handleChange}>
                <option value="">Selecciona una opcion</option>
                {roles.map((role) => (
                  <option key={role.value} value={role.value}>
                    {role.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <p className={`small fw-semibold mt-3 ${messageType}`}>{message}</p>

          <button className="btn btn-primary w-100" type="submit">
            Registrarse
          </button>
        </form>

        <p className="text-center mt-3 mb-0">
          Ya tienes cuenta? <Link to="/login">Inicia sesion</Link>
        </p>
      </section>
    </main>
  );
}
