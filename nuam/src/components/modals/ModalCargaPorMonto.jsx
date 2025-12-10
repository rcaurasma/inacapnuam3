import { useMemo, useState } from "react";
import Papa from "papaparse";
import {
  crearCalificacion,
  actualizarCalificacion,
  existeCalificacion
} from "../../services/CalificacionesService";

function limpiarFila(row) {
  const cleaned = {};
  Object.keys(row || {}).forEach(key => {
    const value = row[key];
    const trimmedKey = typeof key === "string" ? key.trim() : key;
    if (!trimmedKey) return;
    cleaned[trimmedKey] = typeof value === "string" ? value.trim() : value;
  });
  return cleaned;
}

function validarFilaMonto(row) {
  const errores = [];
  if (!row.rut) errores.push("RUT vacío");
  if (!row.nombre) errores.push("Nombre vacío");

  const montoLimpio = typeof row.monto === "string" ? row.monto.replace(/\./g, "").replace(",", ".") : row.monto;
  const monto = Number(montoLimpio);
  if (Number.isNaN(monto)) errores.push("Monto inválido");

  return {
    ...row,
    monto,
    valido: errores.length === 0,
    errores,
  };
}

export default function ModalCargaPorMonto({ onClose }) {
  const [registros, setRegistros] = useState([]);
  const [mensaje, setMensaje] = useState("Selecciona un archivo CSV para comenzar.");
  const [procesando, setProcesando] = useState(false);

  function handleArchivo(event) {
    const file = event.target.files?.[0];
    if (!file) return;

    setProcesando(true);
    setMensaje("Procesando archivo...");

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      dynamicTyping: false,
      complete: result => {
        const filas = (result.data || [])
          .map(limpiarFila)
          .filter(row => Object.values(row).some(value => String(value ?? "").trim() !== ""))
          .map(validarFilaMonto);

        setRegistros(filas);
        setProcesando(false);
        const validas = filas.filter(f => f.valido).length;
        setMensaje(
          filas.length
            ? `Se cargaron ${filas.length} filas (${validas} válidas).`
            : "El archivo no contiene filas válidas."
        );
      },
      error: err => {
        console.error(err);
        setProcesando(false);
        setRegistros([]);
        setMensaje(`Error al leer el CSV: ${err.message}`);
      }
    });
  }

  const registrosValidos = useMemo(() => registros.filter(r => r.valido), [registros]);

  async function confirmar() {
    if (!registrosValidos.length) {
      alert("No hay registros válidos para cargar.");
      return;
    }

    try {
      for (const fila of registrosValidos) {
        const calificacionId = await existeCalificacion(fila);

        if (calificacionId) {
          await actualizarCalificacion(calificacionId, fila);
        } else {
          await crearCalificacion(fila);
        }
      }

      alert(`Carga masiva por monto completada (${registrosValidos.length} registros).`);
      onClose();
    } catch (error) {
      console.error(error);
      alert("Ocurrió un error al guardar la carga masiva. Revisa la consola para más detalles.");
    }
  }

  return (
    <div className="modal-overlay">
      <div className="modal-container" style={{ maxWidth: "680px" }}>
        <h3>Carga Masiva — Montos</h3>

        <div style={{ marginTop: 12 }}>
          <input type="file" accept=".csv" onChange={handleArchivo} disabled={procesando} />
          <div style={{ fontSize: 13, color: "#6b7280", marginTop: 4 }}>{mensaje}</div>
        </div>

        {registros.length === 0 ? (
          <p style={{ marginTop: 20, color: "#4b5563" }}>
            Debes cargar un archivo CSV con, al menos, las columnas RUT, nombre y monto.
          </p>
        ) : (
          <table className="infoext-table" style={{ marginTop: 16 }}>
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
        )}

        <div className="modal-actions">
          <button className="btn primary" onClick={confirmar} disabled={!registrosValidos.length || procesando}>
            Confirmar
          </button>
          <button className="btn" onClick={onClose} disabled={procesando}>Cancelar</button>
        </div>
      </div>
    </div>
  );
}
