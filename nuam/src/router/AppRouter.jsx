import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// VISTAS
import IngresoCalificacion from "../views/IngresoCalificacion";
import ListadoCalificaciones from "../views/ListadoCalificaciones";
import CargaPorMonto from "../views/CargaPorMonto";
import CargaPorFactor from "../views/CargaPorFactor";
import MenuCalificacionesTributarias from "../views/MenuCalificacionesTributarias";

// LAYOUT
import MainLayout from "../components/layout/MainLayout";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <MainLayout>
        <Routes>
          {/* Menú principal */}
          <Route path="/" element={<MenuCalificacionesTributarias />} />

          {/* CRUD principal */}
          <Route path="/ingreso" element={<IngresoCalificacion />} />
          <Route path="/listado" element={<ListadoCalificaciones />} />

          {/* Cargas masivas */}
          <Route path="/carga-monto" element={<CargaPorMonto />} />
          <Route path="/carga-factor" element={<CargaPorFactor />} />

          {/* Si la ruta no existe → volver al menú */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </MainLayout>
    </BrowserRouter>
  );
}
