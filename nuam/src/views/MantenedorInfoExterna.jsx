import { useState, useEffect } from "react";
import {
  obtenerInfoExterna,
  crearInfoExterna,
  eliminarInfoExterna,
  actualizarInfoExterna,
} from "../services/InformacionExternaService";

import ModalCargaMasivaInfoExterna from "../components/modals/ModalCargaMasivaInfoExterna";

const FACTOR_HEADERS = [
  "Ajuste capital",            // F8
  "Renta devengada",           // F9
  "Renta percibida",           // F10
  "Corrección monetaria",      // F11
  "Gasto rechazado",           // F12
  "Crédito total",             // F13
  "Crédito parcial",           // F14
  "Capital propio",            // F15
  "Valor libro",               // F16
  "Utilidad repartida",        // F17
  "Diferencia tributaria",     // F18
  "Revalorización",            // F19
  "Retención",                 // F20
  "Base exenta",               // F21
  "Interés",                   // F22
  "Ganancia",                  // F23
  "Pérdida",                   // F24
  "Rebaja",                    // F25
  "Renta afecta",              // F26
  "Renta no afecta",           // F27
  "Monto reajustado",          // F28
  "Renta presunta",            // F29
  "Crédito por impuesto",      // F30
  "Crédito externo",           // F31
  "IDPC base",                 // F32
  "IDPC crédito",              // F33
  "Factor adicional",          // F34
  "Reserva",                   // F35
  "Impto sustitutivo",         // F36
  "Diferencia cambio"          // F37
];

export default function MantenedorInfoExterna() {
  const [filtro, setFiltro] = useState({
    mercado: "",
    origen: "",
    ejercicio: "",
  });

  const [lista, setLista] = useState([]);

  const [seleccion, setSeleccion] = useState(null);

  const [mostrarModalCarga, setMostrarModalCarga] = useState(false);

  const [form, setForm] = useState(() => ({
    ejercicio: "",
    instrumento: "",
    fechaPago: "",
    descripcionDividendo: "",
    secuenciaEvento: "",
    acogidoIsfut: "",
    origen: "",
    mercado: "",
    factorActualizacion: "",
    ...Object.fromEntries([...Array(30)].map((_, i) => [`factor${i + 8}`, ""])),
  }));

  async function cargar() {
    const data = await obtenerInfoExterna(filtro);
    setLista(data);
  }

  useEffect(() => {
    cargar();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleFiltro(e) {
    setFiltro({ ...filtro, [e.target.name]: e.target.value });
  }

  function limpiarFiltros() {
    setFiltro({
      mercado: "",
      origen: "",
      ejercicio: "",
    });
    cargar();
  }

  function limpiarFormulario() {
    setForm({
      ejercicio: "",
      instrumento: "",
      fechaPago: "",
      descripcionDividendo: "",
      secuenciaEvento: "",
      acogidoIsfut: "",
      origen: "",
      mercado: "",
      factorActualizacion: "",
      ...Object.fromEntries([...Array(30)].map((_, i) => [`factor${i + 8}`, ""])),
    });
    setSeleccion(null);
  }

  async function guardar() {
    if (seleccion) {
      await actualizarInfoExterna(seleccion.id, form);
      alert("Registro modificado");
    } else {
      await crearInfoExterna(form);
      alert("Registro ingresado");
    }

    limpiarFormulario();
    cargar();
  }

  async function borrarSeleccionado() {
    if (!seleccion) return alert("Seleccione un registro primero.");
    if (!confirm("¿Seguro deseas eliminar el registro seleccionado?")) return;

    await eliminarInfoExterna(seleccion.id);

    alert("Registro eliminado.");
    setSeleccion(null);
    cargar();
  }

  return (
    <div>
      <h2>Mantenedor — Información Externa</h2>

      {/* === FILTROS === */}
      <div style={{ marginBottom: "20px" }}>
          <select name="mercado" value={filtro.mercado} onChange={handleFiltro}>
          <option value="">Tipo Mercado</option>
          <option value="ACC">Acciones</option>
          <option value="CFI">CFI</option>
          <option value="FM">Fondos Mutuos</option>
        </select>

        <select name="origen" value={filtro.origen} onChange={handleFiltro}>
          <option value="">Origen</option>
          <option value="corredora">Corredora</option>
          <option value="entidad">Entidad Prestadora</option>
          <option value="sistema">Sistema</option>
        </select>

        <input
          name="ejercicio"
          placeholder="Periodo Comercial (Año)"
          value={filtro.ejercicio}
          onChange={handleFiltro}
        />

        <button onClick={cargar}>Buscar</button>
        <button onClick={limpiarFiltros}>Limpiar</button>
      </div>

      <h3>Listado</h3>

      <div style={{ overflowX: "auto", maxHeight: "420px" }}>
        <table border="1" cellPadding="5" style={{ width: "100%" }}>
          <thead>
            <tr>
              <th></th>
              <th>Ejercicio</th>
              <th>Mercado</th>
              <th>Instrumento</th>
              <th>Fecha Pago</th>
              <th>Descripción</th>
              <th>Secuencia</th>
              <th>Isfut</th>
              <th>Origen</th>
              <th>Act.</th>

              {FACTOR_HEADERS.map((nombre, i) => (
                <th key={i}>{nombre}</th>
              ))}
            </tr>
          </thead>

          <tbody>
            {lista.map((row) => (
              <tr
                key={row.id}
                onClick={() => {
                  setSeleccion(row);
                  setForm(row);
                }}
                style={{
                  background: seleccion?.id === row.id ? "#e0f3ff" : "",
                  cursor: "pointer",
                }}
              >
                <td>●</td>
                <td>{row.ejercicio}</td>
                <td>{row.mercado}</td>
                <td>{row.instrumento}</td>
                <td>{row.fechaPago}</td>
                <td>{row.descripcionDividendo}</td>
                <td>{row.secuenciaEvento}</td>
                <td>{row.acogidoIsfut}</td>
                <td>{row.origen}</td>
                <td>{row.factorActualizacion}</td>

                {FACTOR_HEADERS.map((_, i) => (
                  <td key={i}>{row[`factor${i + 8}`]}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {lista.length === 0 && <p>No hay registros para mostrar.</p>}

      <div style={{ marginTop: "15px" }}>
        <button onClick={borrarSeleccionado}>Eliminar</button>

        <button style={{ marginLeft: "10px" }} onClick={() => setMostrarModalCarga(true)}>
          Carga Masiva
        </button>

        <button style={{ marginLeft: "10px" }} onClick={guardar}>
          {seleccion ? "Modificar" : "Ingresar"}
        </button>

        <button style={{ marginLeft: "10px" }} onClick={limpiarFormulario}>
          Limpiar Formulario
        </button>
      </div>

      {/* === MODAL CARGA MASIVA === */}
      {mostrarModalCarga && (
        <ModalCargaMasivaInfoExterna
          onClose={() => setMostrarModalCarga(false)}
          onSuccess={() => {
            cargar();
            setMostrarModalCarga(false);
          }}
        />
      )}
    </div>
  );
}
