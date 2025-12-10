import { useState } from "react";
import Papa from "papaparse";
import {
  crearInfoExterna,
  actualizarInfoExterna,
  existeInfoExternaPorInstrumento,
} from "../../services/InformacionExternaService";

import {
  validarFormatoFactor,
  validarSumaFactores,
} from "../../services/Validadores";

export default function ModalCargaMasivaInfoExterna({ onClose, onSuccess }) {
  const [preview, setPreview] = useState([]);
  const [errores, setErrores] = useState([]);

  function handleFile(e) {
    const file = e.target.files[0];
    if (!file) return;

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (result) => procesarCSV(result.data),
    });
  }

  function procesarCSV(filas) {
    const erroresTemp = [];
    const previewTemp = [];

    for (let index = 0; index < filas.length; index++) {
      const fila = filas[index];

      // validar factores 8–37
      let factoresValidos = true;

      for (let i = 8; i <= 37; i++) {
        const key = `factor${i}`;

        if (fila[key] && !validarFormatoFactor(fila[key])) {
          factoresValidos = false;
          erroresTemp.push({
            fila: index + 1,
            error: `Factor ${i} tiene formato inválido`,
          });
        }
      }

      // validar suma total
      if (!validarSumaFactores(fila)) {
        erroresTemp.push({
          fila: index + 1,
          error: `La suma de factores (8–37) supera 1`,
        });
      }

      previewTemp.push({
        ...fila,
        valido: factoresValidos,
      });
    }

    setPreview(previewTemp);
    setErrores(erroresTemp);
  }

  async function procesarCarga() {
    let agregados = 0;
    let actualizados = 0;

    for (const fila of preview) {
      if (!fila.valido) continue;

      const existe = await existeInfoExternaPorInstrumento(fila.instrumento);

      if (existe) {
        await actualizarInfoExterna(existe, fila);
        actualizados++;
      } else {
        await crearInfoExterna(fila);
        agregados++;
      }
    }

    alert(
      `Carga completada:\n${agregados} nuevos registros\n${actualizados} actualizados`
    );

    onSuccess();
    onClose();
  }

  return (
    <div className="modal">
      <div className="modal-content" style={{ width: "90%", maxHeight: "90vh", overflowY: "auto" }}>
        <h2>Carga Masiva – Información Externa</h2>

        <input type="file" accept=".csv" onChange={handleFile} />

        {errores.length > 0 && (
          <div style={{ marginTop: "10px", color: "red" }}>
            <h4>Errores detectados:</h4>
            {errores.map((err, idx) => (
              <div key={idx}>Fila {err.fila}: {err.error}</div>
            ))}
          </div>
        )}

        {preview.length > 0 && (
          <>
            <h4>Previsualización ({preview.length} filas)</h4>
            <div style={{ overflowX: "scroll", border: "1px solid #ccc", padding: "10px" }}>
              <table>
                <thead>
                  <tr>
                    <th>Ejercicio</th>
                    <th>Instrumento</th>
                    <th>Fecha Pago</th>
                    <th>Descripción</th>
                    <th>Secuencia</th>
                    <th>Isfut</th>
                    <th>Origen</th>
                    <th>Factor Act.</th>
                    {Array.from({ length: 30 }, (_, i) => (
                      <th key={i}>Factor {i + 8}</th>
                    ))}
                    <th>Valido</th>
                  </tr>
                </thead>

                <tbody>
                  {preview.map((p, idx) => (
                    <tr key={idx} style={{ background: !p.valido ? "#ffbbbb" : "white" }}>
                      <td>{p.ejercicio}</td>
                      <td>{p.instrumento}</td>
                      <td>{p.fechaPago}</td>
                      <td>{p.descripcionDividendo}</td>
                      <td>{p.secuenciaEvento}</td>
                      <td>{p.acogidoIsfut}</td>
                      <td>{p.origen}</td>
                      <td>{p.factorActualizacion}</td>

                      {Array.from({ length: 30 }, (_, i) => (
                        <td key={i}>{p[`factor${i + 8}`]}</td>
                      ))}

                      <td>{p.valido ? "✔" : "❌"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        <div style={{ marginTop: "20px" }}>
          <button onClick={procesarCarga}>Procesar</button>
          <button onClick={onClose} style={{ marginLeft: "10px" }}>
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}
