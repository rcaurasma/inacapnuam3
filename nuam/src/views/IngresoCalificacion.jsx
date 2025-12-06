import { useState } from "react";
import {
  crearCalificacion,
  actualizarCalificacion,
  existeCalificacion
} from "../services/CalificacionesService";

import {
  validarFecha,
  validarTipoSociedad,
  validarMercado,
  validarFormatoFactor,
  validarSumaFactores
} from "../services/Validadores"; // <-- archivo nuevo que crearemos

export default function IngresoCalificacion({ onCreated }) {
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

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function guardar() {

    // ==== VALIDACIONES ====

    if (!validarFecha(form.fecha)) {
      alert("Fecha inválida. Debe estar en formato DD-MM-AAAA");
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

    // validar suma <= 1
    if (!validarSumaFactores(form)) {
      alert("La suma de factores (8 al 19) no debe superar 1");
      return;
    }

    // ==== EXISTE → ACTUALIZAR | NO EXISTE → CREAR ====
    const existe = await existeCalificacion(form.rut);

    if (existe) {
      await actualizarCalificacion(form.rut, form);
      alert("Registro actualizado");
    } else {
      await crearCalificacion(form);
      alert("Registro creado");
    }

    if (onCreated) onCreated();

    // reset
    setForm({
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
  }

  return (
    <div>
      <h3>Ingresar Calificación</h3>

      <input name="rut" placeholder="RUT" value={form.rut} onChange={handleChange} />
      <input name="nombre" placeholder="Nombre" value={form.nombre} onChange={handleChange} />
      <input name="monto" placeholder="Monto" value={form.monto} onChange={handleChange} />
      <input name="fecha" placeholder="DD-MM-AAAA" value={form.fecha} onChange={handleChange} />

      <input name="tipoSociedad" placeholder="Tipo (A/C)" value={form.tipoSociedad} onChange={handleChange} />
      <input name="mercado" placeholder="Mercado" value={form.mercado} onChange={handleChange} />

      {/* FACTORES */}
      {[...Array(12)].map((_, idx) => {
        const n = idx + 8;
        return (
          <input
            key={n}
            name={`factor${n}`}
            placeholder={`Factor ${n}`}
            value={form[`factor${n}`]}
            onChange={handleChange}
          />
        );
      })}

      <button onClick={guardar}>Guardar</button>
    </div>
  );
}
