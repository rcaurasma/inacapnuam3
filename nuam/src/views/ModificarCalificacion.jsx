import { useState, useEffect } from "react";
import {
  actualizarCalificacion,
  obtenerCalificaciones
} from "../services/CalificacionesService";

import {
  validarFecha,
  validarTipoSociedad,
  validarMercado,
  validarFormatoFactor,
  validarSumaFactores
} from "../services/Validadores";

import FormularioFactores from "../components/inputs/FormularioFactores.jsx";

export default function ModificarCalificacion({ id, onUpdated, onCancel }) {
  const [form, setForm] = useState({
    rut: "",
    nombre: "",
    monto: "",
    fecha: "",
    tipoSociedad: "",
    mercado: "",
    factor8: "",
    factor9: "",
    factor10: "",
    factor11: "",
    factor12: "",
    factor13: "",
    factor14: "",
    factor15: "",
    factor16: "",
    factor17: "",
    factor18: "",
    factor19: "",
  });

  useEffect(() => {
    async function cargar() {
      const lista = await obtenerCalificaciones();
      const actual = lista.find(x => x.id === id);

      if (actual) setForm(actual);
    }
    cargar();
  }, [id]);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function guardarCambios() {
    // === VALIDACIONES ===

    if (!validarFecha(form.fecha)) {
      alert("Fecha inválida. Debe ser DD-MM-AAAA");
      return;
    }

    if (!validarTipoSociedad(form.tipoSociedad)) {
      alert("Tipo de sociedad debe ser A o C");
      return;
    }

    if (!validarMercado(form.mercado)) {
      alert("El mercado debe tener 1 a 3 letras");
      return;
    }

    // validar formato de cada factor
    for (let i = 8; i <= 19; i++) {
      const key = `factor${i}`;
      if (form[key] && !validarFormatoFactor(form[key])) {
        alert(`El factor ${i} tiene formato inválido`);
        return;
      }
    }

    if (!validarSumaFactores(form)) {
      alert("La suma de factores (8 al 19) no debe superar 1");
      return;
    }

    // === ACTUALIZAR ===
    await actualizarCalificacion(id, form);

    if (onUpdated) onUpdated();
  }

  return (
    <div style={{ marginTop: "20px" }}>
      <h3>Modificar Calificación</h3>

      <input name="rut" placeholder="RUT" value={form.rut} onChange={handleChange} />

      <input name="nombre" placeholder="Nombre" value={form.nombre} onChange={handleChange} />

      <input name="monto" placeholder="Monto" value={form.monto} onChange={handleChange} />

      <input name="fecha" placeholder="DD-MM-AAAA" value={form.fecha} onChange={handleChange} />

      <input name="tipoSociedad" placeholder="Tipo (A/C)" value={form.tipoSociedad} onChange={handleChange} />

      <input name="mercado" placeholder="Mercado" value={form.mercado} onChange={handleChange} />

      {/* FACTORES usando componente reutilizable */}
      <FormularioFactores form={form} handleChange={handleChange} />

      <button onClick={guardarCambios}>Guardar Cambios</button>
      <button onClick={onCancel} style={{ marginLeft: "10px" }}>Cancelar</button>
    </div>
  );
}
