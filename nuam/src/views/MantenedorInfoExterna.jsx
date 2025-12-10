import { useState, useEffect } from "react";

import {
  obtenerInfoExterna,
  crearInfoExterna,
  eliminarInfoExterna,
  actualizarInfoExterna,
} from "../services/InformacionExternaService";

import ModalCargaMasivaInfoExterna from "../components/modals/ModalCargaMasivaInfoExterna";

// Importar constantes
import { MARKETS } from "../constants/markets";
import { ORIGINS } from "../constants/origins";
import { FACTOR_HEADERS, DEFAULT_INFO_EXTERNA } from "../constants/defaultInfoExterna";

// TOTAL FACTORES = columnas factor8 a factor37 (30 factores)
const TOTAL_FACTORES = 30;

export default function MantenedorInfoExterna() {

  // -----------------------------
  // ESTADOS
  // -----------------------------
  const [filtro, setFiltro] = useState({
    mercado: "",
    origen: "",
    ejercicio: "",
  });

  const [lista, setLista] = useState([]);
  const [seleccion, setSeleccion] = useState(null);

  const [mostrarModalCarga, setMostrarModalCarga] = useState(false);

  const initialForm = () => ({
    ...DEFAULT_INFO_EXTERNA
  });

  const [form, setForm] = useState(initialForm);

  // -----------------------------
  // CARGA INICIAL
  // -----------------------------
  useEffect(() => {
    cargar();
  }, []);

  async function cargar() {
    const data = await obtenerInfoExterna(filtro);
    setLista(data);
  }

  // -----------------------------
  // MANEJO DE FORMULARIOS
  // -----------------------------
  function handleFiltro(e) {
    setFiltro({ ...filtro, [e.target.name]: e.target.value });
  }

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function limpiarFiltros() {
    setFiltro({ mercado: "", origen: "", ejercicio: "" });
    cargar();
  }

  function limpiarFormulario() {
    setForm(initialForm());
    setSeleccion(null);
  }

  // -----------------------------
  // GUARDAR / MODIFICAR
  // -----------------------------
  async function guardar() {
    if (!form.ejercicio || !form.instrumento || !form.fechaPago) {
      alert("Los campos Ejercicio, Instrumento y Fecha Pago son obligatorios.");
      return;
    }

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

  // -----------------------------
  // ELIMINAR
  // -----------------------------
  async function borrarSeleccionado() {
    if (!seleccion) return alert("Seleccione un registro primero.");
    if (!confirm("¿Seguro deseas eliminar el registro seleccionado?")) return;

    await eliminarInfoExterna(seleccion.id);
    alert("Registro eliminado.");

    setSeleccion(null);
    cargar();
  }

  // -----------------------------
  // RENDER
  // -----------------------------
  return (
    <div>
      <h2>Mantenedor — Información Externa</h2>

      {/* FILTROS */}
      <div style={{ marginBottom: "20px" }}>
        <h3>Filtros</h3>

        <select name="mercado" value={filtro.mercado} onChange={handleFiltro}>
          <option value="">Tipo Mercado</option>
          {MARKETS.map(m => (
            <option key={m.value} value={m.value}>{m.label}</option>
          ))}
        </select>

        <select name="origen" value={filtro.origen} onChange={handleFiltro}>
          <option value="">Origen</option>
          {ORIGINS.map(o => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
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

      {/* LISTADO */}
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

              {FACTOR_HEADERS.map((nombre, idx) => (
                <th key={idx}>{nombre}</th>
              ))}
            </tr>
          </thead>

          <tbody>
            {lista.map(row => (
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

                {FACTOR_HEADERS.map((_, idx) => (
                  <td key={idx}>{row[`factor${idx + 8}`]}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {lista.length === 0 && <p>No hay registros para mostrar.</p>}

      {/* ACCIONES */}
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

      {/* MODAL */}
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
