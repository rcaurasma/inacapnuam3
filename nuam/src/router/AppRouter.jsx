import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import MantenedorInfoExterna from "../views/MantenedorInfoExterna";
import IngresoCalificacion from "../views/IngresoCalificacion";
import ListadoCalificaciones from "../views/ListadoCalificaciones";
import CargaPorMonto from "../views/CargaPorMonto";
import CargaPorFactor from "../views/CargaPorFactor";
import MenuCalificacionesTributarias from "../views/MenuCalificacionesTributarias";

import MainLayout from "../components/layout/MainLayout";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <MainLayout>
        <Routes>
          <Route path="/" element={<MenuCalificacionesTributarias />} />

          {/* CRUD */}
          <Route path="/ingreso" element={<IngresoCalificacion />} />
          <Route path="/listado" element={<ListadoCalificaciones />} />

          {/* Cargas masivas */}
          <Route path="/carga-monto" element={<CargaPorMonto />} />
          <Route path="/carga-factor" element={<CargaPorFactor />} />

          <Route path="/info-externa" element={<MantenedorInfoExterna />} />

          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </MainLayout>
    </BrowserRouter>
  );
}
