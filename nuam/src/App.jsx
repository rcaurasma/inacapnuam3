import { useEffect, useMemo, useState } from "react";
import { Navigate, Route, Routes, Outlet, useLocation, useNavigate } from "react-router-dom";
import "./App.css";

import MainLayout from "./components/layout/MainLayout.jsx";
import TablaCalificaciones from "./components/ui/TablaCalificaciones.jsx";

import Login from "./views/Login.jsx";
import Register from "./views/Register.jsx";
import IngresoCalificacion from "./views/IngresoCalificacion.jsx";

import { obtenerCalificaciones, eliminarCalificacion } from "./services/CalificacionesService";
import MantenedorInfoExterna from "./views/MantenedorInfoExterna.jsx";

// 📌 NUEVAS IMPORTACIONES PARA CARGA MASIVA REAL:
import CargaPorFactor from "./views/CargaPorFactor.jsx";
import CargaPorMonto from "./views/CargaPorMonto.jsx";

import ModalCargaPorFactor from "./components/modals/ModalCargaPorFactor.jsx";
import ModalCargaPorMonto from "./components/modals/ModalCargaPorMonto.jsx";


const sidebarItems = [
  { id: "/dashboard", label: "Dashboard", icon: "📊", path: "/dashboard" },
  { id: "info", label: "Info Externa", path: "/info-externa", icon: "📄" },
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

  // Estados para mostrar modales reales
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

        {/* 📌 BOTONES QUE ACTIVAN LOS MODALES REALES */}
        <button className="btn" onClick={() => setShowCargaFactores(true)}>Carga masiva (Factores)</button>
        <button className="btn" onClick={() => setShowCargaMontos(true)}>Carga masiva (Montos)</button>

        <button className="btn" onClick={handleModificar}>Modificar</button>
        <button className="btn" onClick={handleDelete}>Eliminar</button>
      </div>

      <TablaCalificaciones
        rows={filteredRows}
        selectedId={selected?.id}
        onSelect={setSelected}
        selectedFactor={applied.factor}
      />

      {/* 📌 MODALES REALES DE CARGA MASIVA */}
      {showCargaFactores && (
        <ModalCargaPorFactor onClose={() => setShowCargaFactores(false)} />
      )}

      {showCargaMontos && (
        <ModalCargaPorMonto onClose={() => setShowCargaMontos(false)} />
      )}

      {loading && <div className="badge">Cargando...</div>}
    </>
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
          <Route path="/info-externa" element={<MantenedorInfoExterna />} />
          <Route path="/calificaciones/ingreso" element={<IngresoCalificacion />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to={isAuthed ? "/dashboard" : "/login"} replace />} />
    </Routes>
  );
}
