import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// VISTAS
import MantenedorInfoExterna from "../views/MantenedorInfoExterna";
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

          {/* Ingreso de calificación (con valores iniciales) */}
          <Route
            path="/ingreso"
            element={
              <IngresoCalificacion
                mercadoInicial="ACC"
                anioInicial="2024"
              />
            }
          />

          {/* Listado */}
          <Route path="/listado" element={<ListadoCalificaciones />} />

          {/* Cargas masivas */}
          <Route path="/carga-monto" element={<CargaPorMonto />} />
          <Route path="/carga-factor" element={<CargaPorFactor />} />

          {/* Mantenedor de Información Externa*/}
          <Route path="/info-externa" element={<MantenedorInfoExterna />} />

          {/* Si la ruta no existe → volver al menú */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </MainLayout>
    </BrowserRouter>
  );
}
