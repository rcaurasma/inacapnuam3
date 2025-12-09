import { useState } from "react";
import Papa from "papaparse";
import {
  existeCalificacion,
  crearCalificacion,
  actualizarCalificacion
} from "../services/CalificacionesService";

import {
  validarFormatoFactor,
  validarSumaFactores
} from "../services/Validadores";

export default function CargaPorFactor() {
  const [archivo, setArchivo] = useState(null);

  function handleFile(e) {
    setArchivo(e.target.files[0]);
  }

  async function procesar() {
    if (!archivo) {
      alert("Seleccione un archivo CSV.");
      return;
    }

    Papa.parse(archivo, {
      header: true,
      skipEmptyLines: true,          // ⬅️ evita filas vacías (CRÍTICO)
      dynamicTyping: false,

      complete: async (result) => {
        const registros = result.data;

        for (const reg of registros) {

          // ⛔ Evita errores por filas vacías
          if (!reg.rut || !reg.nombre || !reg.fecha || !reg.tipoSociedad || !reg.mercado) {
            console.warn("Fila inválida:", reg);
            continue;
          }

          // Validar formato de cada factor
          for (let i = 8; i <= 19; i++) {
            const key = `factor${i}`;

            // Si viene vacío → lo dejamos en 0
            if (!reg[key] || reg[key] === "") {
              reg[key] = 0;
              continue;
            }

            if (!validarFormatoFactor(reg[key])) {
              console.warn(`Factor ${i} inválido:`, reg[key], reg);
              continue;
            }

            reg[key] = parseFloat(reg[key]);
          }

          // Validar suma total
          if (!validarSumaFactores(reg)) {
            console.warn("❌ Suma de factores excede 1 →", reg);
            continue;
          }

          const existe = await existeCalificacion(reg.rut);

          if (existe) {
            await actualizarCalificacion(reg.rut, reg);
          } else {
            await crearCalificacion(reg);
          }
        }

        alert("Carga masiva de factores completada.");
      }
    });
  }

  return (
    <div>
      <h3>Carga Masiva por Factor</h3>

      <input type="file" accept=".csv" onChange={handleFile} />
      <button onClick={procesar}>Procesar</button>
    </div>
  );
}
