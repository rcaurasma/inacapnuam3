import { useEffect, useMemo, useState } from "react";
import { Navigate, Route, Routes, Outlet, useLocation, useNavigate } from "react-router-dom";
import "./App.css";
import MainLayout from "./components/layout/MainLayout.jsx";
import TablaCalificaciones from "./components/ui/TablaCalificaciones.jsx";
import Login from "./views/Login.jsx";
import Register from "./views/Register.jsx";
import IngresoCalificacion from "./views/IngresoCalificacion.jsx";
import { obtenerCalificaciones, eliminarCalificacion } from "./services/CalificacionesService";

const sidebarItems = [
  { id: "/dashboard", label: "Dashboard", icon: "📊", path: "/dashboard" },
  { id: "/calificaciones/ingreso", label: "Calificaciones", icon: "✅", path: "/calificaciones/ingreso" },
  { id: "/documentos", label: "Documentos", icon: "📂", path: "/documentos" },
  { id: "/declaraciones", label: "Declaraciones", icon: "📑", path: "/declaraciones" },
  { id: "/auditoria", label: "Auditoría", icon: "🛡", path: "/auditoria" },
  { id: "/soporte", label: "Soporte", icon: "❓", path: "/soporte" },
];

const factorIdList = Array.from({ length: 30 }, (_, idx) => (idx + 8).toString());

function DashboardPage() {
  const navigate = useNavigate();
  const [filters, setFilters] = useState({ mercado: "", origen: "", anio: "", instrumento: "", factor: "all" });
  const [applied, setApplied] = useState({ mercado: "", origen: "", anio: "", instrumento: "", factor: "all" });
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState(null);
  const [showCargaFactores, setShowCargaFactores] = useState(false);
  const [showCargaMontos, setShowCargaMontos] = useState(false);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const data = await obtenerCalificaciones();
      setRows(data);
      setLoading(false);
    })();
  }, []);

  const filteredRows = useMemo(() => {
    return rows.filter(row => {
      const factorMap = {};
      (row.factors || []).forEach(f => {
        factorMap[String(f.id)] = f.calculado ?? f.valor ?? f.original ?? 0;
      });

      const matchesFactor = applied.factor === "all" || factorMap[applied.factor] != null;

      return (
        (!applied.mercado || row.mercado === applied.mercado) &&
        (!applied.origen || row.origen === applied.origen) &&
        (!applied.anio || String(row.anioComercial) === applied.anio) &&
        (!applied.instrumento || row.instrumento?.toLowerCase().includes(applied.instrumento.toLowerCase())) &&
        matchesFactor
      );
    });
  }, [rows, applied]);

  const recargar = async () => {
    setLoading(true);
    const data = await obtenerCalificaciones();
    setRows(data);
    setLoading(false);
  };

  const handleDelete = async () => {
    if (!selected) {
      alert("Selecciona un registro para eliminar");
      return;
    }
    await eliminarCalificacion(selected.id);
    await recargar();
    setSelected(null);
  };

  const handleModificar = () => {
    if (!selected) {
      alert("Selecciona un registro para modificar");
      return;
    }
    navigate("/calificaciones/ingreso", { state: { registro: selected } });
  };

  return (
    <>
      <div className="hero">
        <h1>Mantenedor de calificaciones</h1>
        <span className="badge">Versión base</span>
      </div>

      <div className="actions-row">
        <button className="btn primary" onClick={() => navigate("/calificaciones/ingreso")}>
          Ingresar nueva calificación
        </button>
        <button className="btn" onClick={() => setShowCargaFactores(true)}>Carga masiva (Factores)</button>
        <button className="btn" onClick={() => setShowCargaMontos(true)}>Carga masiva (Montos)</button>
        <button className="btn" onClick={handleModificar}>Modificar</button>
        <button className="btn" onClick={handleDelete}>Eliminar</button>
      </div>

      <div className="metrics">
        <div className="metric-card">
          <div className="metric-label">Calificaciones activas</div>
          <div className="metric-value">128</div>
        </div>
        <div className="metric-card">
          <div className="metric-label">Pendientes por validar</div>
          <div className="metric-value">14</div>
        </div>
        <div className="metric-card">
          <div className="metric-label">Última carga</div>
          <div className="metric-value">hace 2h</div>
        </div>
      </div>

      <div className="filters-card" style={{ marginBottom: 8 }}>
        <div className="filters-grid">
          <select
            className="select"
            value={filters.mercado}
            onChange={e => setFilters({ ...filters, mercado: e.target.value })}
          >
            <option value="">Mercado (todos)</option>
            <option value="Acciones">Acciones</option>
            <option value="CFI">CFI</option>
            <option value="Fondos mutuos">Fondos mutuos</option>
          </select>

          <select
            className="select"
            value={filters.origen}
            onChange={e => setFilters({ ...filters, origen: e.target.value })}
          >
            <option value="">Origen (todos)</option>
            <option value="Entidad">Entidad prestadora</option>
            <option value="Corredor">Corredor</option>
            <option value="Sistema">Sistema</option>
            <option value="Operador">Operador</option>
          </select>

          <select
            className="select"
            value={filters.anio}
            onChange={e => setFilters({ ...filters, anio: e.target.value })}
          >
            <option value="">Año</option>
            <option value="2025">2025</option>
            <option value="2024">2024</option>
          </select>

          <select
            className="select"
            value={filters.factor}
            onChange={e => setFilters({ ...filters, factor: e.target.value })}
          >
            <option value="all">Factor (todos)</option>
            {factorIdList.map(id => (
              <option key={id} value={id}>{`Factor ${id}`}</option>
            ))}
          </select>

          <input
            className="input"
            placeholder="Buscar instrumento..."
            value={filters.instrumento}
            onChange={e => setFilters({ ...filters, instrumento: e.target.value })}
          />
        </div>
        <div className="actions-row" style={{ justifyContent: "flex-end", marginTop: 10 }}>
          <button className="btn" onClick={() => setApplied({ ...filters })}>Buscar</button>
          <button
            className="btn ghost"
            onClick={() => {
              setFilters({ mercado: "", origen: "", anio: "", instrumento: "", factor: "all" });
              setApplied({ mercado: "", origen: "", anio: "", instrumento: "", factor: "all" });
            }}
          >
            Limpiar
          </button>
        </div>
      </div>

      <TablaCalificaciones
        rows={filteredRows}
        selectedId={selected?.id}
        onSelect={setSelected}
        selectedFactor={applied.factor}
        onEdit={() => handleModificar()}
        onDelete={handleDelete}
      />

      {showCargaFactores && (
        <CargaModal title="Carga de Calificaciones (Factores)" onClose={() => setShowCargaFactores(false)} />
      )}
      {showCargaMontos && (
        <CargaModal title="Carga de Calificaciones (Montos)" onClose={() => setShowCargaMontos(false)} />
      )}

      {loading && <div className="badge">Cargando...</div>}
    </>
  );
}

function PlaceholderPage({ title }) {
  return (
    <div className="table-card">
      <h2 style={{ marginTop: 0 }}>{title}</h2>
      <p style={{ color: "#5b6570" }}>Próximamente.</p>
    </div>
  );
}

function CargaModal({ title, onClose }) {
  return (
    <div className="table-card" style={{ marginTop: 16 }}>
      <div className="actions-row" style={{ justifyContent: "space-between" }}>
        <h3 style={{ margin: 0 }}>{title}</h3>
        <button className="btn" onClick={onClose}>Cerrar</button>
      </div>
      <div className="filters-grid">
        <div>
          <label>Archivo CSV</label>
          <input className="input" type="file" accept=".csv" />
        </div>
        <div>
          <label>Especificación</label>
          <div className="badge">Campos: ejercicio, mercado, instrumento, fechaPago, factores 8-37</div>
        </div>
      </div>
      <div className="table-card" style={{ marginTop: 12 }}>
        <p style={{ color: "#5b6570" }}>Previsualización pendiente de carga.</p>
        <button className="btn primary">Subir archivo</button>
      </div>
    </div>
  );
}

function ProtectedRoute({ isAuthed }) {
  const location = useLocation();
  if (!isAuthed) return <Navigate to="/login" state={{ from: location }} replace />;
  return <Outlet />;
}

export default function App() {
  const [isAuthed, setIsAuthed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const user = isAuthed ? { name: "Juan Alfaro", role: "Corredor", initials: "JA" } : null;

  const handleLogin = data => {
    if (!data.email || !data.password) {
      alert("Ingresa correo y contraseña");
      return;
    }
    setIsAuthed(true);
    navigate("/dashboard", { replace: true });
  };

  const handleRegister = data => {
    if (!data.email || !data.password || !data.name) {
      alert("Completa los campos requeridos");
      return;
    }
    setIsAuthed(true);
    navigate("/dashboard", { replace: true });
  };

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login onSubmit={handleLogin} />} />
      <Route path="/register" element={<Register onSubmit={handleRegister} />} />

      <Route element={<ProtectedRoute isAuthed={isAuthed} />}>
        <Route
          element={
            <MainLayout
              user={user}
              sidebarItems={sidebarItems}
              active={location.pathname}
              onDashboard={() => navigate("/dashboard")}
              onLogin={() => navigate("/login")}
              onRegister={() => navigate("/register")}
            />
          }
        >
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/calificaciones/ingreso" element={<IngresoCalificacion />} />
          <Route path="/documentos" element={<PlaceholderPage title="Documentos" />} />
          <Route path="/declaraciones" element={<PlaceholderPage title="Declaraciones" />} />
          <Route path="/auditoria" element={<PlaceholderPage title="Auditoría" />} />
          <Route path="/soporte" element={<PlaceholderPage title="Soporte" />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to={isAuthed ? "/dashboard" : "/login"} replace />} />
    </Routes>
  );
}
