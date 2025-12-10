import { useState } from "react";
import {
  crearCalificacion,
  actualizarCalificacion,
  existeCalificacion
} from "../services/CalificacionesService";

export default function IngresoCalificacion({ onCreated, mercadoInicial = "", anioInicial = "" }) {
  const [form, setForm] = useState({
    mercado: mercadoInicial,            // pre-cargado desde el mantenedor
    instrumento: "",
    secuenciaEvento: "",
    dividendo: 0,
    fechaPago: "",
    valorHistorico: "",
    anio: anioInicial,                  // pre-cargado
    descripcion: "",
    isfut: false,
    factorActualizacion: 0
  });

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value
    });
  }

  async function guardar() {
    // VALIDACIONES HDU1
    if (!form.instrumento.trim()) {
      alert("Debe ingresar el Instrumento.");
      return;
    }

    if (!form.secuenciaEvento || Number(form.secuenciaEvento) <= 10000) {
      alert("La secuencia de evento debe ser numérica y mayor a 10.000.");
      return;
    }

    if (!form.fechaPago) {
      alert("Debe seleccionar la Fecha de Pago.");
      return;
    }

    if (!form.anio) {
      alert("El año comercial no puede estar vacío.");
      return;
    }

    // IDENTIFICADOR PRINCIPAL = instrumento
    const existe = await existeCalificacion(form.instrumento);

    if (existe) {
      await actualizarCalificacion(form.instrumento, form);
      alert("Calificación actualizada");
    } else {
      await crearCalificacion(form);
      alert("Calificación creada");
    }

    if (onCreated) onCreated();

    // RESET
    setForm({
      mercado: mercadoInicial,
      instrumento: "",
      secuenciaEvento: "",
      dividendo: 0,
      fechaPago: "",
      valorHistorico: "",
      anio: anioInicial,
      descripcion: "",
      isfut: false,
      factorActualizacion: 0
    });
  }

  return (
    <div>
      <h3>Ingresar Calificación Tributaria</h3>

      <div style={{ marginBottom: "10px" }}>
        <input
          name="mercado"
          placeholder="Mercado"
          value={form.mercado}
          readOnly
        />
      </div>

      <div style={{ marginBottom: "10px" }}>
        <input
          name="instrumento"
          placeholder="Instrumento"
          value={form.instrumento}
          onChange={handleChange}
        />
      </div>

      <div style={{ marginBottom: "10px" }}>
        <input
          name="secuenciaEvento"
          placeholder="Secuencia Evento (>10000)"
          value={form.secuenciaEvento}
          onChange={handleChange}
        />
      </div>

      <div style={{ marginBottom: "10px" }}>
        <input
          name="dividendo"
          placeholder="Dividendo"
          type="number"
          value={form.dividendo}
          onChange={handleChange}
        />
      </div>

      <div style={{ marginBottom: "10px" }}>
        <input
          type="date"
          name="fechaPago"
          value={form.fechaPago}
          onChange={handleChange}
        />
      </div>

      <div style={{ marginBottom: "10px" }}>
        <input
          name="valorHistorico"
          placeholder="Valor Histórico"
          value={form.valorHistorico}
          onChange={handleChange}
        />
      </div>

      <div style={{ marginBottom: "10px" }}>
        <input
          name="anio"
          placeholder="Año Comercial"
          value={form.anio}
          readOnly
        />
      </div>

      <div style={{ marginBottom: "10px" }}>
        <input
          name="descripcion"
          placeholder="Descripción"
          value={form.descripcion}
          onChange={handleChange}
        />
      </div>

      <div style={{ marginBottom: "10px" }}>
        <label>
          ISFUT:
          <input
            type="checkbox"
            name="isfut"
            checked={form.isfut}
            onChange={handleChange}
            style={{ marginLeft: "10px" }}
          />
        </label>
      </div>

      <div style={{ marginBottom: "10px" }}>
        <input
          name="factorActualizacion"
          placeholder="Factor Actualización"
          type="number"
          value={form.factorActualizacion}
          onChange={handleChange}
        />
      </div>

      <button onClick={guardar}>Guardar</button>
    </div>
  );
}
