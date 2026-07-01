import { Navigate, Outlet } from "react-router-dom";
import { getSession } from "../utils/auth";

// Protege las rutas internas. Si no hay sesion, vuelve al login.
export default function ProtectedRoute() {
  return getSession() ? <Outlet /> : <Navigate to="/login" replace />;
}
