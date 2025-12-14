import {
  crearCalificacion,
  actualizarCalificacion,
  existeCalificacion
} from "../../services/CalificacionesService";

export default function ModalCargaPorMonto({ registros, onClose }) {

  async function confirmar() {
    for (const fila of registros) {
      if (!fila.valido) continue;

      const existe = await existeCalificacion(fila.rut);

      if (existe) {
        await actualizarCalificacion(fila.id, fila);
      } else {
        await crearCalificacion(fila);
      }
    }

    alert("Carga masiva completada");
    onClose();
  }

  return (
    <div style={{ background: "#fff", padding: 20, border: "1px solid #ccc" }}>
      <h3>Preview Carga Masiva</h3>

      <table border="1" cellPadding="4">
        <thead>
          <tr>
            <th>RUT</th>
            <th>Nombre</th>
            <th>Monto</th>
            <th>Estado</th>
            <th>Errores</th>
          </tr>
        </thead>

        <tbody>
          {registros.map((r, idx) => (
            <tr key={idx} style={{ background: r.valido ? "#d7ffd7" : "#ffd7d7" }}>
              <td>{r.rut}</td>
              <td>{r.nombre}</td>
              <td>{r.monto}</td>
              <td>{r.valido ? "OK" : "ERROR"}</td>
              <td>{r.errores?.join(", ")}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <button onClick={confirmar}>Confirmar Carga</button>
      <button onClick={onClose}>Cancelar</button>
    </div>
  );
}
