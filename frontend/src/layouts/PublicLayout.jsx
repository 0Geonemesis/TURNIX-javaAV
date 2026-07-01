import { Link, Outlet } from "react-router-dom";

// Layout publico: muestra navbar y un espacio donde React Router inyecta cada pagina.
export default function PublicLayout() {
  return (
    <div className="app-shell">
      <nav className="navbar navbar-expand-lg bg-white border-bottom sticky-top">
        <div className="container">
          <Link className="navbar-brand fw-bold text-primary" to="/">
            TURN0
          </Link>

          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#publicNavbar"
            aria-controls="publicNavbar"
            aria-expanded="false"
            aria-label="Abrir menu"
          >
            <span className="navbar-toggler-icon" />
          </button>

          <div className="collapse navbar-collapse" id="publicNavbar">
            <div className="navbar-nav ms-auto gap-lg-2">
              <Link className="nav-link" to="/">
                Inicio
              </Link>
              <Link className="nav-link" to="/login">
                Login
              </Link>
              <Link className="btn btn-primary px-3" to="/registro">
                Registro
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <Outlet />
    </div>
  );
}
