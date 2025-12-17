import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  crearCalificacion,
  actualizarCalificacion,
  existeCalificacionPorInstrumento,
} from "../services/CalificacionesService";
import {
  validarFormatoFactor,
  validarFecha,
  validarSumaFactores,
  validarSecuenciaMayorA,
} from "../services/Validadores";
import { makeDefaultFactors, makeDefaultMontos } from "../constants/factors";

export default function IngresoCalificacion({ onCreated }) {
  const navigate = useNavigate();
  const location = useLocation();

  const modo = location.state?.modo || "crear";
  const registro = location.state?.registro || null;

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    mercado: "",
    instrumento: "",
    anioComercial: "2025",
    secuenciaEvento: "10001",
    numeroDividendo: "0",
    valorHistorico: "0.00",
    fechaPago: "",
    acogidoIsfut: false,
    descripcion: "",
    origen: "Operador",
  });

  const [factors, setFactors] = useState(makeDefaultFactors());
  const [montos, setMontos] = useState(makeDefaultMontos());

  useEffect(() => {
    if (modo === "editar" && registro) {
      setForm({
        mercado: registro.mercado || "",
        instrumento: registro.instrumento || "",
        anioComercial: String(registro.anioComercial || "2025"),
        secuenciaEvento: String(registro.secuenciaEvento || "10001"),
        numeroDividendo: String(registro.numeroDividendo || "0"),
        valorHistorico: String(registro.valorHistorico || "0.00"),
        fechaPago: registro.fechaPago?.substring(0, 10) || "",
        acogidoIsfut: Boolean(registro.acogidoIsfut),
        descripcion: registro.descripcion || "",
        origen: registro.origen || "Operador",
      });

      setFactors(registro.factors || makeDefaultFactors());
      setMontos(registro.montos || makeDefaultMontos());
    }
  }, [modo, registro]);

  const totalCalculado = useMemo(
    () => factors.reduce((acc, f) => acc + Number(f.calculado || 0), 0),
    [factors]
  );

  const totalMontos = useMemo(
    () => montos.reduce((acc, m) => acc + Number(m.valor || 0), 0),
    [montos]
  );

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  }

  function handleMontoChange(id, value) {
    setMontos(prev =>
      prev.map(m => (m.id === id ? { ...m, valor: value === "" ? "" : Number(value) } : m))
    );
  }

  function updateFactor(id, value) {
    setFactors(prev =>
      prev.map(f => (f.id === id ? { ...f, calculado: value === "" ? "" : Number(value) } : f))
    );
  }

  function calcularFactoresDesdeMontos() {
    const total = totalMontos || 1;
    setFactors(prev =>
      prev.map(f => {
        const monto = montos.find(m => m.id === f.id)?.valor || 0;
        const calculado = total ? monto / total : 0;
        return { ...f, calculado: Number(calculado.toFixed(8)), original: monto };
      })
    );
  }

  async function handleNext() {
    if (step === 1) {
      if (!form.mercado || !form.instrumento || !form.fechaPago) return alert("Completa los campos obligatorios");
      if (!validarFecha(form.fechaPago)) return alert("Fecha inválida");
      if (!validarSecuenciaMayorA(form.secuenciaEvento)) return alert("Secuencia debe ser mayor a 10.000");

      if (modo === "crear") {
        const exists = await existeCalificacionPorInstrumento(form.fechaPago, form.instrumento);
        if (exists) return alert("Ya existe una calificación con el mismo instrumento y fecha");
      }
    }

    if (step === 2) {
      const factoresObj = factors.reduce((acc, f) => ({ ...acc, [`factor${f.id}`]: f.calculado }), {});
      if (!validarSumaFactores(factoresObj)) return alert("La suma de factores (8 al 37) debe ser 1");

      for (const f of factors) {
        if (!validarFormatoFactor(String(f.calculado))) return alert(`Formato inválido en ${f.label}`);
      }
    }

    setStep(prev => Math.min(prev + 1, 3));
  }

  async function handleSave() {
    setLoading(true);
    try {
      if (modo === "editar") {
        await actualizarCalificacion(registro.id, { ...form, montos, factors });
        alert("Calificación actualizada correctamente");
      } else {
        await crearCalificacion({ ...form, montos, factors });
        alert("Calificación creada correctamente");
      }
      onCreated?.();
      navigate("/calificaciones");
    } catch {
      alert("Error al guardar");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="ingreso-container">
      <div className="hero">
        <h1>{modo === "editar" ? "Editar Calificación Tributaria" : "Ingreso Manual de Calificación"}</h1>
      </div>

      <StepIndicator step={step} />

      {step === 1 && (
        <div className="filters-card">
          <div className="filters-grid">
            <select className="select" name="mercado" value={form.mercado} onChange={handleChange}>
              <option value="">Mercado *</option>
              <option value="Acciones">Acciones</option>
              <option value="CFI">CFI</option>
              <option value="Fondos">Fondos Mutuos</option>
            </select>

            <input className="input" name="instrumento" value={form.instrumento} onChange={handleChange} disabled={modo === "editar"} />
            <select className="select" name="anioComercial" value={form.anioComercial} onChange={handleChange} disabled={modo === "editar"}>
              <option value="2025">2025</option>
              <option value="2024">2024</option>
            </select>

            <input className="input" name="secuenciaEvento" type="number" value={form.secuenciaEvento} onChange={handleChange} disabled={modo === "editar"} />
            <input className="input" name="descripcion" value={form.descripcion} onChange={handleChange} />
            <input className="input" type="date" name="fechaPago" value={form.fechaPago} onChange={handleChange} disabled={modo === "editar"} />
            <input className="input" name="valorHistorico" type="number" value={form.valorHistorico} onChange={handleChange} />

            <select className="select" name="origen" value={form.origen} onChange={handleChange}>
              <option value="Operador">Operador</option>
              <option value="Corredor">Corredor</option>
              <option value="Sistema">Sistema</option>
            </select>

            <label>
              <input type="checkbox" name="acogidoIsfut" checked={form.acogidoIsfut} onChange={handleChange} /> Acogido a ISFUT
            </label>
          </div>

          <div className="actions-row">
            <button className="btn primary" onClick={handleNext}>Siguiente</button>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="table-card">
          <table className="table">
            <thead>
              <tr><th>Factor</th><th>Monto</th><th>Calculado</th></tr>
            </thead>
            <tbody>
              {factors.map(f => (
                <tr key={f.id}>
                  <td>{f.label}</td>
                  <td><input className="input" type="number" value={montos.find(m => m.id === f.id)?.valor} onChange={e => handleMontoChange(f.id, e.target.value)} /></td>
                  <td><input className="input" type="number" value={f.calculado} onChange={e => updateFactor(f.id, e.target.value)} /></td>
                </tr>
              ))}
            </tbody>
          </table>

          <div>Suma factores: {totalCalculado.toFixed(6)}</div>

          <div className="actions-row">
            <button className="btn" onClick={() => setStep(1)}>Volver</button>
            <button className="btn" onClick={calcularFactoresDesdeMontos}>Calcular</button>
            <button className="btn primary" onClick={handleNext}>Revisar</button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="table-card">
          <h3>{modo === "editar" ? "Confirmar actualización" : "Confirmar ingreso"}</h3>
          <div className="actions-row">
            <button className="btn" onClick={() => setStep(2)}>Anterior</button>
            <button className="btn primary" onClick={handleSave} disabled={loading}>
              {loading ? "Guardando..." : "Guardar"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function StepIndicator({ step }) {
  return (
    <div style={{ display: "flex", gap: 12, marginBottom: 16 }}>
      {["Datos básicos", "Factores", "Revisión"].map((s, i) => (
        <div key={i} style={{ fontWeight: step === i + 1 ? 700 : 400 }}>
          {i + 1}. {s}
        </div>
      ))}
    </div>
  );
}
