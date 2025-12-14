import { useState } from "react";
import { leerCSV } from "../services/CSVReader";
import { validarFila } from "../services/ValidadorCSV";
import ModalCargaPorMonto from "../components/modals/ModalCargaPorMonto.jsx";

export default function CargaPorMonto() {
  const [registros, setRegistros] = useState([]);
  const [mostrarModal, setMostrarModal] = useState(false);

  async function handleFile(e) {
    const file = e.target.files[0];
    if (!file) return;

    const filas = await leerCSV(file);
    const procesadas = filas.map((fila) => {
      const { valido, errores } = validarFila(fila);
      return { ...fila, valido, errores };
    });
    setRegistros(procesadas);
    setMostrarModal(true);
  }

  return (
    <div>
      <h2>Carga Masiva por Monto</h2>

      <input
        type="file"
        accept=".csv"
        onChange={handleFile}
        style={{ marginBottom: "20px" }}
      />

      {mostrarModal && (
        <ModalCargaPorMonto
          registros={registros}
          onClose={() => setMostrarModal(false)}
        />
      )}
    </div>
  );
}
