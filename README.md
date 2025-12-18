![Nuamfoto](https://github.com/user-attachments/assets/f3e149e1-facd-4a3a-936a-be4c88893565)

NUAM - Sistema de Mantenedor de Calificaciones Tributarias

<h1>Información Académica</h1>
- Institución: INACAP - La Serena

Integrantes del Equipo:
- Richard Cedeño
- Daniela García
- Ignacio Larraín
- Franco Munizaga
- Sara Vega
- Carrera: Analista Programador

Asignatura: Proyecto Integrado

Profesor: Victor Godoy Beragua

Fecha de Entrega: 17 de Noviembre de 2025

<h1>Resumen ejecutivo</h1>

NUAM (Núcleo Unificado de Análisis de Mercados) es una aplicación web full‑stack —desarrollada con React en el frontend y Node.js en el backend— diseñada para centralizar, validar y mantener las calificaciones tributarias asociadas a instrumentos financieros emitidos en Chile.

<h1>Contexto y objetivo</h1>

El holding Nuam se ha posicionado como un actor clave en el ámbito financiero y bursátil de la región, brindando servicios especializados a través de sus corredores de bolsa. Entre sus responsabilidades destaca la correcta gestión tributaria asociada a las operaciones de dividendos y otros instrumentos financieros, donde el cumplimiento normativo y la eficiencia en la administración de datos resultan fundamentales. En este contexto, la confiabilidad de la información tributaria es un pilar para garantizar la transparencia frente a los reguladores y la confianza de los inversionistas.

Actualmente el manejo de calificaciones tributarias enfrenta desafíos por la recepción de información desde fuentes externas (declaraciones del SII, certificados de emisores) en formatos no estandarizados. Esto obliga a cargas manuales, aumenta el riesgo de duplicidad y errores, y retrasa la consolidación de datos. NUAM se propone resolver estos problemas con una solución que permita ingresar, modificar, consultar y rastrear la trazabilidad de la información de forma segura y estandarizada.

<h1>Funcionalidades clave</h1>
- Carga masiva de datos desde CSV con validaciones.
- Registro y edición manual de calificaciones tributarias.
- Preview y verificación previa a la persistencia de datos.
- Trazabilidad y bitácora de cambios.
- API REST para integración con otros sistemas internos.
- Interfaz de usuario con formularios y listados para operaciones CRUD.

<h1>Stack tecnológico</h1>
- Frontend: React, Vite
- Backend: Node.js (Express)
- Base de datos: PostgreSQL (esquemas y migraciones en `backend/schema.sql`)
- Tools: npm, vite
- Despliegue: probado en EC2 (Ubuntu Server)

<h1>Requisitos</h1>
- Node 18+
- npm
- PostgreSQL (o contenedor equivalente)

<h1>Instalación rápida (dev)</h1>

```powershell
git clone https://github.com/rcaurasma/inacapnuam3.git
cd nuam
npm install
npm run dev
```

<h1>Construcción para producción</h1>

```powershell
npm run build
# Servir los archivos estáticos desde 'dist' (por ejemplo con nginx)
```

<h1>Nota</h1>
Nota: el backend corre desde la carpeta `backend` y puede levantarse con `node index.js` o un proceso gestor como `pm2`.

<h1>Estructura del proyecto (resumen detallado)</h1>

<h1>Raíz del repositorio</h1>
- `package.json`: dependencias y scripts a nivel raíz (monorepo/gestión).
- `README.md`: este archivo, documenta el proyecto y su estructura.

<h1>Carpeta `nuam/` (aplicación principal)</h1>
- `index.html`: plantilla HTML usada por Vite/React.
- `vite.config.js`: configuración de Vite.
- `package.json`: dependencias y scripts del frontend.
- `eslint.config.js`: reglas de linting.
- `LEEME.md`: notas internas (si existe).

<h1>Carpeta `nuam/backend/` (API y acceso a datos)</h1>
- `index.js`: servidor Express — define rutas API para calificaciones, autenticación y operaciones CRUD.
- `db.js`: configuración de conexión a la base de datos (Pool/Client para PostgreSQL).
- `package.json`: dependencias del backend.
- `schema.sql`: script SQL para crear tablas y relaciones (esquema de calificaciones, usuarios, bitácora).

<h1>Carpeta `nuam/public/`</h1>
- archivos estáticos servidos directamente (favicon, imágenes públicas, etc.).

<h1>Carpeta `nuam/src/` (código fuente frontend React)</h1>
- `main.jsx`: punto de entrada de React, monta la app y configura rutas.
- `index.css`, `App.css`: estilos globales y de la app.
- `App.jsx`: componente raíz que contiene el router y layout principal.

<h1>`nuam/src/assets/`</h1>
- recursos estáticos usados por React (imágenes, íconos, etc.).

<h1>`nuam/src/components/` (componentes reutilizables)</h1>
- `layout/`
  - `Header.jsx`: encabezado y navegación.
  - `Footer.jsx`: pie de página.
  - `Sidebar.jsx`: navegación lateral / filtros rápidos.
  - `MainLayout.jsx`: esqueleto general de las vistas.
- `modals/` (ventanas modales)
  - `ModalCargaMasivaInfoExterna.jsx`: modal para carga masiva desde CSV/Excel.
  - `ModalCargaPorFactor.jsx`: modal para carga por factor.
  - `ModalCargaPorMonto.jsx`: modal para carga por monto.
  - `ModalConfirmacion.jsx`: confirmación genérica de acciones.
  - `ModalEliminarInfoExterna.jsx`: confirmación para eliminar entradas externas.
  - `ModalIngresoCalificacion.jsx`: formulario modal para ingresar calificaciones.
  - `ModalModificarCalificacion.jsx`: modal para editar calificaciones existentes.
  - `ModalModificarInfoExterna.jsx`: editar información importada.
  - `ModalngresarInfoExterna.jsx`: (posible typo en nombre) modal para ingresar info externa.
  - `ModalVerCalificacion.jsx`: vista detallada de una calificación.
- `ui/`
  - `TablaCalificaciones.jsx`: tabla con listado de calificaciones y acciones.
  - `TablaPreviewCarga.jsx`: tabla para previsualizar datos antes de la carga masiva.

<h1>`nuam/src/constants/`</h1>
- `factors.js`: constantes de negocio (factores tributarios, opciones, etc.).

<h1>`nuam/src/forms/`</h1>
- `FormularioFiltros.jsx`: formulario de filtros para listados.
- `FormularioIngresoCalificacion.jsx`: formulario para crear una calificación.
- `FormularioModificarCalificacion.jsx`: formulario para editar una calificación.

<h1>`nuam/src/router/`</h1>
- `AppRouter.jsx`: definiciones de rutas públicas y privadas de la app.

<h1>`nuam/src/services/` (servicios y utilidades)</h1>
- `CalificacionesService.js`: cliente HTTP para consumir la API de calificaciones (GET/POST/PUT/DELETE).
- `InformacionExternaService.js`: lógica para procesar y persistir información externa importada.
- `CSVReader.js`: utilidades para parsear CSV y normalizar columnas.
- `ValidadorCSV.js`: validaciones específicas de formato y reglas de negocio para CSVs.
- `Validadores.js`: validadores reutilizables (emails, RUTs, montos, fechas).

<h1>`nuam/src/views/` (páginas principales)</h1>
- `CargaPorFactor.jsx`: vista para carga por factor.
- `CargaPorMonto.jsx`: vista para carga por monto.
- `IngresoCalificacion.jsx`: página para ingreso manual de calificación.
- `ListadoCalificaciones.jsx`: listado/panel principal con filtros.
- `Login.jsx`: página de inicio de sesión.
- `MantenedorInfoExterna.jsx`: gestión de información externa importada.
- `MenuCalificacionesTributarias.jsx`: menú principal del módulo.
- `ModificarCalificacion.jsx`: página dedicada a edición de calificaciones.
- `Register.jsx`: registro de usuarios (si aplica).

<h1>Cómo está pensado el flujo</h1>
- Los corredores suben archivos CSV/Excel desde la interfaz (`ModalCargaMasivaInfoExterna`).
- `CSVReader` y `ValidadorCSV` normalizan y validan datos en el frontend.
- Se muestra una `TablaPreviewCarga` para revisión; luego se envía a la API.
- `InformacionExternaService` y el backend persisten los datos en PostgreSQL (`backend/schema.sql`).
- `CalificacionesService` obtiene y actualiza las calificaciones para reportes y consultas.

<h1>Despliegue en EC2 (nota rápida)</h1>
- En su instancia Ubuntu Server: clonar el repo, instalar dependencias, construir frontend y ejecutar backend.

