import { useState, useEffect } from "react";

import {
  obtenerInfoExterna,
  crearInfoExterna,
  eliminarInfoExterna,
  actualizarInfoExterna,
} from "../services/InformacionExternaService";


import ModalCargaMasivaInfoExterna from "../components/modals/ModalCargaMasivaInfoExterna.jsx";
import ModalIngresarInfoExterna from "../components/modals/ModalIngresarInfoExterna.jsx";


import { MARKETS } from "../constants/markets";
import { ORIGINS } from "../constants/origins";
import { FACTOR_HEADERS, DEFAULT_INFO_EXTERNA } from "../constants/defaultInfoExterna";

export default function MantenedorInfoExterna() {
  const [filtro, setFiltro] = useState({
    mercado: "",
    origen: "",
    ejercicio: "",
  });

  const [lista, setLista] = useState([]);
  const [seleccion, setSeleccion] = useState(null);

  const [mostrarModalCarga, setMostrarModalCarga] = useState(false);
  const [mostrarModalIngresar, setMostrarModalIngresar] = useState(false);

  const initialForm = () => ({ ...DEFAULT_INFO_EXTERNA });
  const [form, setForm] = useState(initialForm);

  useEffect(() => {
    cargar();
  }, []);

  async function cargar() {
    const data = await obtenerInfoExterna(filtro);
    setLista(data);
  }

  function handleFiltro(e) {
    setFiltro({ ...filtro, [e.target.name]: e.target.value });
  }

  function limpiarFiltros() {
    setFiltro({ mercado: "", origen: "", ejercicio: "" });
    cargar();
  }

  async function borrarSeleccionado() {
    if (!seleccion) return alert("Seleccione un registro primero.");
    if (!confirm("¿Eliminar registro seleccionado?")) return;

    await eliminarInfoExterna(seleccion.id);
    setSeleccion(null);
    cargar();
  }

  return (
    <div className="page">
      <h2>Mantenedor — Información Externa</h2>

      {/* FILTROS */}
      <div className="infoext-card">
        <h3>Filtros</h3>

        <div className="filters-grid">
          <select className="select" name="mercado" value={filtro.mercado} onChange={handleFiltro}>
            <option value="">Tipo Mercado</option>
            {MARKETS.map((m) => (
              <option key={m.value} value={m.value}>{m.label}</option>
            ))}
          </select>

          <select className="select" name="origen" value={filtro.origen} onChange={handleFiltro}>
            <option value="">Origen</option>
            {ORIGINS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>

          <input
            className="input"
            name="ejercicio"
            placeholder="Periodo Comercial (Año)"
            value={filtro.ejercicio}
            onChange={handleFiltro}
          />
        </div>

        <div className="actions-row">
          <button className="btn" onClick={cargar}>Buscar</button>
          <button className="btn ghost" onClick={limpiarFiltros}>Limpiar</button>
        </div>
      </div>

      {/* LISTADO */}
      <h3 style={{ marginTop: "12px" }}>Listado</h3>

      <div className="infoext-table-container">
        <table className="infoext-table">
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
            {lista.map((row) => (
              <tr
                key={row.id}
                onClick={() => {
                  setSeleccion(row);
                  setForm(row);
                }}
                className={seleccion?.id === row.id ? "infoext-row-selected" : ""}
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

      {/* BOTONES */}
      <div className="actions-row" style={{ marginTop: 10 }}>
        <button className="btn" onClick={borrarSeleccionado}>Eliminar</button>
        <button className="btn" onClick={() => setMostrarModalCarga(true)}>Carga Masiva</button>
        <button className="btn primary" onClick={() => setMostrarModalIngresar(true)}>Ingresar</button>
        <button className="btn ghost" onClick={() => { setForm(initialForm()); setSeleccion(null); }}>
          Limpiar Formulario
        </button>
      </div>

      {/* MODALES */}
      {mostrarModalCarga && (
        <ModalCargaMasivaInfoExterna
          onClose={() => setMostrarModalCarga(false)}
          onSuccess={() => {
            cargar();
            setMostrarModalCarga(false);
          }}
        />
      )}

      {mostrarModalIngresar && (
        <ModalIngresarInfoExterna
          onClose={() => setMostrarModalIngresar(false)}
          onSuccess={() => {
            cargar();
            setMostrarModalIngresar(false);
          }}
        />
      )}
    </div>
  );
}
