// Encabezado reutilizable para paginas internas.
export default function PageHeader({ title, description }) {
  return (
    <header className="page-header">
      <div>
        <p className="eyebrow">Turnix</p>
        <h1>{title}</h1>
        <p>{description}</p>
      </div>
    </header>
  );
}
