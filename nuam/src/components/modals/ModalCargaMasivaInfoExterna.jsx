import { useState } from "react";

import { leerCSV } from "../../services/CSVReader";
import { validarFilaInfoExterna } from "../../services/ValidadorCSV";
import { crearInfoExterna } from "../../services/InformacionExternaService";
import { COLUMN_MAPPING } from "../../constants/columnMapping_TEMP";

export default function ModalCargaMasivaInfoExterna({ onClose, onSuccess }) {
  const [archivo, setArchivo] = useState(null);
  const [preview, setPreview] = useState([]);

  function handleFile(e) {
    setArchivo(e.target.files[0]);
  }

  async function procesarArchivo() {
    if (!archivo) {
      alert("Seleccione un archivo CSV antes de procesar.");
      return;
    }

    const registrosCrudos = await leerCSV(archivo);

    const registrosProcesados = registrosCrudos.map((fila) => {
      const obj = {};

      // Mapear columnas del CSV → nombres internos
      for (const key in COLUMN_MAPPING) {
        const nombreColumnaCSV = COLUMN_MAPPING[key];
        obj[key] = fila[nombreColumnaCSV] ?? "";
      }

      // Validar fila
      const { valido, errores } = validarFilaInfoExterna(obj);

      return {
        data: obj,
        valido,
        errores,
      };
    });

    setPreview(registrosProcesados);
  }

  async function confirmarCarga() {
    const validos = preview.filter((p) => p.valido);

    if (validos.length === 0) {
      alert("No hay registros válidos para cargar.");
      return;
    }

    for (const fila of validos) {
      await crearInfoExterna(fila.data);
    }

    alert(`Carga completada. Se ingresaron ${validos.length} registros.`);
    onSuccess();
  }

  return (
    <div
      style={{
        background: "rgba(0,0,0,0.5)",
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 9999,
      }}
    >
      <div
        style={{
          background: "white",
          padding: 20,
          borderRadius: 6,
          width: "85%",
          maxHeight: "85vh",
          overflowY: "auto",
        }}
      >
        <h2>Carga Masiva de Información Externa</h2>

        <input type="file" accept=".csv" onChange={handleFile} />
        <button onClick={procesarArchivo}>Procesar Archivo</button>
        <button onClick={onClose} style={{ marginLeft: 10 }}>
          Cerrar
        </button>

        <hr />

        <h3>Vista Previa</h3>

        {preview.length === 0 && <p>No hay datos procesados.</p>}

        {preview.length > 0 && (
          <table border="1" cellPadding="5" style={{ width: "100%" }}>
            <thead>
              <tr>
                <th>Estado</th>
                <th>Ejercicio</th>
                <th>Instrumento</th>
                <th>Fecha Pago</th>
                <th>Descripción</th>
                <th>Errores</th>
              </tr>
            </thead>
            <tbody>
              {preview.map((p, index) => (
                <tr
                  key={index}
                  style={{
                    background: p.valido ? "#d6ffd6" : "#ffd6d6",
                  }}
                >
                  <td>{p.valido ? "OK" : "ERROR"}</td>
                  <td>{p.data.ejercicio}</td>
                  <td>{p.data.instrumento}</td>
                  <td>{p.data.fechaPago}</td>
                  <td>{p.data.descripcionDividendo}</td>
                  <td>{p.errores.join(", ")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {preview.length > 0 && (
          <div style={{ marginTop: 20 }}>
            <button onClick={confirmarCarga}>Confirmar Carga</button>
          </div>
        )}
      </div>
    </div>
  );
}
