import { useState, useEffect } from "react";
import { actualizarCalificacion } from "../services/CalificacionesService";

export default function ModalModificarCalificacion({ registro, onClose, onSaved }) {
  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (registro) {
      setForm({
        mercado: registro.mercado || "",
        instrumento: registro.instrumento || "",
        anioComercial: registro.anioComercial || "2025",
        secuenciaEvento: registro.secuenciaEvento || "",
        descripcion: registro.descripcion || "",
        fechaPago: registro.fechaPago?.substring(0, 10) || "",
        valorHistorico: registro.valorHistorico || 0,
        origen: registro.origen || "Operador",
        acogidoIsfut: !!registro.acogidoIsfut,
      });
    }
  }, [registro]);

  if (!registro || !form) return null;

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  }

  async function handleSave() {
    setLoading(true);
    try {
      await actualizarCalificacion(registro.id, {
        ...registro,
        ...form,
      });
      onSaved();
      onClose();
    } catch (e) {
      console.error(e);
      alert("Error al actualizar");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="modal-backdrop">
      <div className="modal-card">
        <h3>Modificar Calificación</h3>

        <div className="filters-grid">
          <input name="instrumento" value={form.instrumento} onChange={handleChange} placeholder="Instrumento" />
          <input type="date" name="fechaPago" value={form.fechaPago} onChange={handleChange} />
          <input name="secuenciaEvento" value={form.secuenciaEvento} onChange={handleChange} />
          <input name="descripcion" value={form.descripcion} onChange={handleChange} />
          <input type="number" name="valorHistorico" value={form.valorHistorico} onChange={handleChange} />
        </div>

        <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
          <button className="btn" onClick={onClose}>Cancelar</button>
          <button className="btn primary" onClick={handleSave} disabled={loading}>
            {loading ? "Guardando..." : "Guardar"}
          </button>
        </div>
      </div>
    </div>
  );
}
