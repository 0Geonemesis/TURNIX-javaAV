import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getServices } from "../api/serviceService";

// Pagina de inicio: presenta todos los servicios principales de Turnix.
export default function HomePage() {
  const [services, setServices] = useState([]);
  const [apiStatus, setApiStatus] = useState("Cargando servicios...");

  useEffect(() => {
    getServices()
      .then((response) => {
        setServices(response.data.services);
        setApiStatus("");
      })
      .catch(() => {
        setApiStatus("No se pudo conectar con la API. Mostrando servicios base.");
        setServices([
          { id: 1, title: "Gestion de clientes", description: "Organiza informacion de clientes." },
          { id: 2, title: "Citas programadas", description: "Agenda reservas del negocio." },
          { id: 3, title: "Turnos en fila", description: "Administra el orden de atencion." },
          { id: 4, title: "Reportes", description: "Consulta indicadores del negocio." }
        ]);
      });
  }, []);

  return (
    <main>
      <section className="home-hero">
        <div className="container">
          <div className="row align-items-center g-4">
            <div className="col-lg-7">
              <span className="badge text-bg-light mb-3">Sistema para pequenos negocios</span>
              <h1>Turnix</h1>
              <p>
                Gestiona filas, citas, clientes y reportes desde una base preparada para crecer .
              </p>
              <div className="d-flex flex-wrap gap-2">
                <Link className="btn btn-light btn-lg" to="/registro">
                  Crear cuenta
                </Link>
                <Link className="btn btn-outline-light btn-lg" to="/login">
                  Iniciar sesion
                </Link>
              </div>
            </div>
            <div className="col-lg-5">
              <div className="hero-panel">
                <h2>INFORMACION PUBLICA </h2>
                <ul>
                  <li>TEL : 123-456-7890</li>
                  <li>CORREO : info@turnix.com</li>
                  <li>YOUTUBE : @turnix</li>
                  <li>ASOCIADOS : Empresas</li>
                </ul>
                <small>{apiStatus}</small>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="container py-5">
        <div className="section-title">
          <p className="eyebrow">Servicios</p>
          <h2>Lo que ofrece nuestra pagina</h2>
        </div>

        <div className="row g-3">
          {services.map((service) => (
            <div className="col-md-6 col-xl-3" key={service.id}>
              <article className="service-card h-100">
                <span>{service.id}</span>
                <h3>{service.title}</h3>
                <p>{service.description}</p>
              </article>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
