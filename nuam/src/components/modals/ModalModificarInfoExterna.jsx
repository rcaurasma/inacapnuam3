import { useState, useEffect } from "react";
import {
  obtenerInfoExternaPorId,
  actualizarInfoExterna,
} from "../../services/InformacionExternaService";

export default function ModalModificarInfoExterna({ id, onClose, onSuccess }) {
  const [form, setForm] = useState(null);

  useEffect(() => {
    async function cargar() {
      const registro = await obtenerInfoExternaPorId(id);
      setForm(registro);
    }
    cargar();
  }, [id]);

  if (!form) return null;

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function guardar() {
    await actualizarInfoExterna(id, form);
    onSuccess();
    onClose();
  }

  return (
    <div className="modal">
      <div className="modal-content">
        <h3>Modificar Información Externa</h3>

        <input name="ejercicio" value={form.ejercicio} onChange={handleChange} />
        <input name="instrumento" value={form.instrumento} onChange={handleChange} />
        <input name="fechaPago" value={form.fechaPago} onChange={handleChange} />
        <input
          name="descripcionDividendo"
          value={form.descripcionDividendo}
          onChange={handleChange}
        />
        <input
          name="secuenciaEvento"
          value={form.secuenciaEvento}
          onChange={handleChange}
        />
        <input
          name="acogidoIsfut"
          value={form.acogidoIsfut}
          onChange={handleChange}
        />
        <input name="origen" value={form.origen} onChange={handleChange} />
        <input
          name="factorActualizacion"
          value={form.factorActualizacion}
          onChange={handleChange}
        />

        <button onClick={guardar}>Guardar cambios</button>
        <button onClick={onClose}>Cancelar</button>
      </div>
    </div>
  );
}
