import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import PublicLayout from "../layouts/PublicLayout.jsx";
import DashboardLayout from "../layouts/DashboardLayout.jsx";
import HomePage from "../pages/HomePage.jsx";
import LoginPage from "../pages/LoginPage.jsx";
import RegisterPage from "../pages/RegisterPage.jsx";
import DashboardPage from "../pages/DashboardPage.jsx";
import BusinessPage from "../pages/BusinessPage.jsx";

// React Router define que componente se muestra segun la URL.
export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rutas publicas para visitantes, clientes y usuarios nuevos. */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/registro" element={<RegisterPage />} />
        </Route>

        {/* Rutas internas que luego podran protegerse con JWT. */}
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/negocio" element={<BusinessPage />} />
        </Route>

        {/* Cualquier ruta desconocida vuelve al inicio. */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
