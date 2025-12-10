import { useState } from "react";
import { crearInfoExterna } from "../../services/InformacionExternaService";

const initialForm = {
  ejercicio: "",
  instrumento: "",
  fechaPago: "",
  descripcionDividendo: "",
  secuenciaEvento: "",
  acogidoIsfut: [],          // múltiple
  origen: "",
  factorActualizacion: "",
};

export default function ModalIngresarInfoExterna({ onClose, onSuccess }) {
  const [form, setForm] = useState(initialForm);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function handleIsfutChange(e) {
    const selected = Array.from(e.target.selectedOptions).map((o) => o.value);
    setForm((prev) => ({ ...prev, acogidoIsfut: selected }));
  }

  async function guardar() {
    // Validaciones básicas
    if (!form.ejercicio.trim()) {
      alert("El campo Ejercicio es obligatorio.");
      return;
    }
    if (!form.instrumento.trim()) {
      alert("El campo Instrumento es obligatorio.");
      return;
    }
    if (!form.fechaPago) {
      alert("La Fecha de pago es obligatoria.");
      return;
    }

    if (
      form.factorActualizacion &&
      isNaN(Number(form.factorActualizacion))
    ) {
      alert("El Factor de actualización debe ser numérico.");
      return;
    }

    const payload = {
      ...form,
      // guardamos ISFUT/ISIFIT como string "ISFUT,ISIFIT" en la BD
      acogidoIsfut: Array.isArray(form.acogidoIsfut)
        ? form.acogidoIsfut.join(",")
        : form.acogidoIsfut,
      factorActualizacion: form.factorActualizacion
        ? Number(form.factorActualizacion)
        : null,
    };

    await crearInfoExterna(payload);
    setForm(initialForm);
    onSuccess();
    onClose();
  }

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <h3>Ingresar Información Externa</h3>

        {/* Ejercicio (año comercial) */}
        <input
          className="input"
          type="number"
          name="ejercicio"
          placeholder="Ejercicio (Año comercial)"
          min="1900"
          max="2100"
          value={form.ejercicio}
          onChange={handleChange}
          required
        />

        {/* Instrumento */}
        <input
          className="input"
          name="instrumento"
          placeholder="Instrumento"
          value={form.instrumento}
          onChange={handleChange}
          required
        />

        {/* Fecha pago */}
        <input
          className="input"
          type="date"
          name="fechaPago"
          value={form.fechaPago}
          onChange={handleChange}
          required
        />

        {/* Descripción dividendo */}
        <input
          className="input"
          name="descripcionDividendo"
          placeholder="Descripción del dividendo"
          value={form.descripcionDividendo}
          onChange={handleChange}
        />

        {/* Secuencia del evento */}
        <input
          className="input"
          name="secuenciaEvento"
          placeholder="Secuencia del evento"
          value={form.secuenciaEvento}
          onChange={handleChange}
        />

        {/* Acogido a ISFUT/ISIFIT (multi select) */}
        <label style={{ fontSize: 13, marginTop: 6 }}>
          Acogido a ISFUT / ISIFIT
        </label>
        <select
          className="select"
          name="acogidoIsfut"
          multiple
          value={form.acogidoIsfut}
          onChange={handleIsfutChange}
        >
          <option value="ISFUT">ISFUT</option>
          <option value="ISIFIT">ISIFIT</option>
        </select>

        {/* Origen */}
        <input
          className="input"
          name="origen"
          placeholder="Origen (Corredora / Sistema)"
          value={form.origen}
          onChange={handleChange}
        />

        {/* Factor de actualización */}
        <input
          className="input"
          type="number"
          step="0.0001"
          name="factorActualizacion"
          placeholder="Factor de actualización"
          value={form.factorActualizacion}
          onChange={handleChange}
        />

        <div className="modal-actions">
          <button className="btn primary" onClick={guardar}>
            Guardar
          </button>
          <button className="btn ghost" onClick={onClose}>
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}
