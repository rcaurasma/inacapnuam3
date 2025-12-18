import { useEffect, useState } from "react";
import {
  obtenerCalificaciones,
  eliminarCalificacion,
} from "../services/CalificacionesService";
import TablaCalificaciones from "../components/ui/TablaCalificaciones";
import ModalEditarCalificacion from "../components/modals/ModalEditarCalificacion";

export default function ListadoCalificaciones() {
  const [rows, setRows] = useState([]);
  const [selected, setSelected] = useState(null);
  const [showEdit, setShowEdit] = useState(false);

  async function cargar() {
    const data = await obtenerCalificaciones();
    setRows(data);
    setSelected(null);
  }

  useEffect(() => {
    (async () => {
      await cargar();
    })();
  }, []);

  function editar(row) {
    setSelected(row);
    setShowEdit(true);
  }

  function modificarSeleccionado() {
    if (!selected) {
      alert("Seleccione una calificación");
      return;
    }
    setShowEdit(true);
  }

  async function eliminar(row) {
    if (!window.confirm("¿Eliminar esta calificación?")) return;
    await eliminarCalificacion(row.id);
    cargar();
  }

  return (
    <div className="page-container">
      {/* === BOTONES SUPERIORES === */}
      <div className="actions-row" style={{ marginBottom: 12 }}>
        <button
          className="btn primary"
          onClick={() => window.location.href = "/ingreso"}
        >
          Ingresar nueva calificación
        </button>

        <button className="btn" onClick={modificarSeleccionado}>
          Modificar
        </button>
      </div>

      {/* === TABLA === */}
      <TablaCalificaciones
        rows={rows}
        selectedId={selected?.id}
        onSelect={setSelected}
        onEdit={editar}
        onDelete={eliminar}
      />

      {/* === MODAL EDICIÓN === */}
      {showEdit && (
        <ModalEditarCalificacion
          registro={selected}
          onClose={() => setShowEdit(false)}
          onSaved={cargar}
        />
      )}
    </div>
  );
}
