# Validacion y despliegue de TURN0

## Correccion de defectos

- La API carga `backend/.env` desde una ruta fija del backend, aunque el proyecto se inicie desde otra carpeta.
- Las citas validan cliente, servicio, fecha, hora y estado antes de guardar.
- Los turnos validan codigo, cliente, servicio, estado y prioridad antes de guardar.
- Los errores de duplicados y conexion a MySQL se responden con mensajes claros.

## Refactorizacion

- La logica principal del backend esta separada en rutas, controladores y servicios.
- Los controladores reciben la peticion HTTP y delegan reglas de negocio a servicios.
- La configuracion de entorno esta centralizada en `backend/src/config/env.js`.
- La conexion a MySQL esta centralizada en `backend/src/config/database.js`.

## Validacion de requisitos

Antes de entregar, ejecutar:

```bash
npm run validate
```

Ese comando compila el frontend y confirma que la interfaz React no tenga errores de construccion.

Tambien validar la conexion de la API:

```bash
curl http://localhost:4000/api/health
```

La respuesta esperada es:

```json
{
  "api": "ok",
  "database": "ok",
  "message": "Turnix esta conectado correctamente"
}
```

## Despliegue local

1. Instalar dependencias:

```bash
npm run install:all
```

2. Crear los archivos `.env` tomando como base:

- `backend/.env.example`
- `frontend/.env.example`

3. Crear la base de datos en MySQL ejecutando:

```sql
source backend/database/schema.sql;
```

4. Ejecutar el sistema en desarrollo:

```bash
npm run dev
```

## Despliegue de frontend

Generar archivos optimizados:

```bash
npm run deploy:frontend
```

El resultado queda en:

```text
frontend/dist
```

## Despliegue de backend

Iniciar la API en modo produccion:

```bash
npm run deploy:backend
```
