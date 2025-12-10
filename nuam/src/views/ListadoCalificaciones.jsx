import { useState, useEffect } from "react";
import { obtenerCalificaciones, eliminarCalificacion } from "../services/CalificacionesService";
import IngresoCalificacion from "./IngresoCalificacion";
import ModificarCalificacion from "./ModificarCalificacion";

export default function ListadoCalificaciones() {
  const [lista, setLista] = useState([]);
  const [editId, setEditId] = useState(null);

  async function cargarDatos() {
    const data = await obtenerCalificaciones();
    setLista(data);
  }

  async function borrar(id) {
    await eliminarCalificacion(id);
    await cargarDatos();
  }

  function cancelarEdicion() {
    setEditId(null);
  }

  useEffect(() => {
    cargarDatos();
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h1>Listado de Calificaciones</h1>

      <IngresoCalificacion onCreated={cargarDatos} />

      {editId && (
        <ModificarCalificacion
          id={editId}
          onUpdated={() => {
            cargarDatos();
            cancelarEdicion();
          }}
          onCancel={cancelarEdicion}
        />
      )}

      {lista.length === 0 && <p>No hay registros cargados.</p>}

      {lista.map(item => (
        <div key={item.id} style={{ marginTop: "10px" }}>
          <strong>{item.instrumento}</strong>  {item.mercado}  {item.fechaPago}  ${item.valorHistorico}

          <button
            onClick={() => setEditId(item.id)}
            style={{ marginLeft: "10px" }}
          >
            Editar
          </button>

          <button
            onClick={() => borrar(item.id)}
            style={{ marginLeft: "10px", color: "red" }}
          >
            Eliminar
          </button>
        </div>
      ))}
    </div>
  );
}
