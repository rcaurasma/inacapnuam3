import { useState } from "react";
import { crearInfoExterna } from "../../services/InformacionExternaService";

export default function ModalIngresarInfoExterna({ onClose, onSuccess }) {
  const [form, setForm] = useState({
    ejercicio: "",
    instrumento: "",
    fechaPago: "",
    descripcionDividendo: "",
    secuenciaEvento: "",
    acogidoIsfut: "",
    origen: "",
    factorActualizacion: "",
  });

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function guardar() {
    await crearInfoExterna(form);
    onSuccess();
    onClose();
  }

  return (
    <div className="modal">
      <div className="modal-content">
        <h3>Ingresar Información Externa</h3>

        <input name="ejercicio" placeholder="Ejercicio" onChange={handleChange} />
        <input name="instrumento" placeholder="Instrumento" onChange={handleChange} />

        <input
          name="fechaPago"
          placeholder="Fecha pago (DD-MM-AAAA)"
          onChange={handleChange}
        />

        <input
          name="descripcionDividendo"
          placeholder="Descripción del dividendo"
          onChange={handleChange}
        />

        <input
          name="secuenciaEvento"
          placeholder="Secuencia del evento"
          onChange={handleChange}
        />

        <input
          name="acogidoIsfut"
          placeholder="Acogido a ISFUT/ISIFT"
          onChange={handleChange}
        />

        <input
          name="origen"
          placeholder="Origen (Corredora/Sistema)"
          onChange={handleChange}
        />

        <input
          name="factorActualizacion"
          placeholder="Factor de actualización"
          onChange={handleChange}
        />

        <button onClick={guardar}>Guardar</button>
        <button onClick={onClose}>Cancelar</button>
      </div>
    </div>
  );
}
