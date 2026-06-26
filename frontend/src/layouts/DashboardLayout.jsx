import { Link, NavLink, Outlet } from "react-router-dom";

// Layout interno reutilizable para dashboard y pantalla principal del negocio.
export default function DashboardLayout() {
  return (
    <div className="dashboard-shell">
      <aside className="dashboard-sidebar">
        <Link className="brand-block" to="/dashboard">
          <span className="brand-mark">T</span>
          <span>
            <strong>Turnix</strong>
            <small>Panel principal</small>
          </span>
        </Link>

        <nav className="dashboard-nav">
          <NavLink to="/dashboard">Dashboard</NavLink>
          <NavLink to="/negocio">Gestion publica</NavLink>
          <NavLink to="/">Inicio publico</NavLink>
        </nav>
      </aside>

      <main className="dashboard-main">
        <Outlet />
      </main>
    </div>
  );
}
