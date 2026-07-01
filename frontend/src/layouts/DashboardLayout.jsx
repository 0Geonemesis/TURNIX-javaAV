import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { clearSession, getRolePermissions, getSession } from "../utils/auth";

// Layout interno reutilizable para dashboard y pantalla principal del negocio.
export default function DashboardLayout() {
  const navigate = useNavigate();
  const session = getSession();
  const permissions = getRolePermissions(session?.role);

  function handleLogout() {
    clearSession();
    navigate("/login");
  }

  return (
    <div className="dashboard-shell">
      <aside className="dashboard-sidebar">
        <Link className="brand-block" to="/dashboard">
          <span className="brand-mark">0</span>
          <span>
            <strong>TURN0</strong>
            <small>{permissions.label}</small>
          </span>
        </Link>

        <nav className="dashboard-nav">
          <NavLink to="/dashboard">Dashboard</NavLink>
          <NavLink to="/negocio">Gestion</NavLink>
          <NavLink to="/">Inicio publico</NavLink>
          <button className="sidebar-button" type="button" onClick={handleLogout}>
            Cerrar sesion
          </button>
        </nav>
      </aside>

      <main className="dashboard-main">
        <Outlet />
      </main>
    </div>
  );
}
