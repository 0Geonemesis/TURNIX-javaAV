import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../api/authService";
import { saveSession } from "../utils/auth";

// Pagina de login conectada al backend sin JWT por ahora.
export default function LoginPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("text-muted");

  function handleChange(event) {
    setForm({ ...form, [event.target.name]: event.target.value });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setMessage("");

    if (!form.email || !form.password) {
      setMessageType("text-danger");
      setMessage("Completa correo y contrasena.");
      return;
    }

    try {
      const response = await loginUser(form);
      saveSession(response.data.user);
      setMessageType("text-success");
      setMessage("Inicio de sesion correcto. Entrando al dashboard...");
      setTimeout(() => navigate("/dashboard"), 800);
    } catch (error) {
      setMessageType("text-danger");
      setMessage(error.response?.data?.message || "No se pudo iniciar sesion.");
    }
  }

  return (
    <main className="auth-page">
      <section className="auth-card">
        <div className="auth-brand">
          <span className="brand-mark">0</span>
          <h1>Iniciar sesion</h1>
          <p>Accede al panel de TURN0.</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label" htmlFor="email">
              Usuario o correo
            </label>
            <input className="form-control" id="email" name="email" type="text" value={form.email} onChange={handleChange} />
          </div>

          <div className="mb-3">
            <label className="form-label" htmlFor="password">
              Contrasena
            </label>
            <input className="form-control" id="password" name="password" type="password" value={form.password} onChange={handleChange} />
          </div>

          <p className={`small fw-semibold ${messageType}`}>{message}</p>

          <button className="btn btn-primary w-100" type="submit">
            Entrar
          </button>
        </form>

        <p className="text-center mt-3 mb-0">
          No tienes cuenta? <Link to="/registro">Registrate</Link>
        </p>
      </section>
    </main>
  );
}
