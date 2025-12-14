import { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import {
  crearCalificacion,
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
  const location = useLocation();
  const registro = location.state?.registro;
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    mercado: "Acciones",
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
    if (registro) {
      setForm({
        mercado: registro.mercado || "Acciones",
        instrumento: registro.instrumento || "",
        anioComercial: String(registro.anioComercial || "2025"),
        secuenciaEvento: String(registro.secuenciaEvento || "10001"),
        numeroDividendo: String(registro.numeroDividendo || "0"),
        valorHistorico: String(registro.valorHistorico || "0.00"),
        fechaPago: registro.fechaPago || "",
        acogidoIsfut: Boolean(registro.acogidoIsfut),
        descripcion: registro.descripcion || "",
        origen: registro.origen || "Operador",
      });
      if (registro.factors) setFactors(registro.factors);
      if (registro.montos) setMontos(registro.montos);
    }
  }, [registro]);

  const totalCalculado = useMemo(() => factors.reduce((acc, f) => acc + Number(f.calculado || 0), 0), [factors]);
  const totalMontos = useMemo(() => montos.reduce((acc, m) => acc + Number(m.valor || 0), 0), [montos]);

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
        const calculado = total ? Number(monto) / Number(total) : 0;
        return { ...f, calculado: Number(calculado.toFixed(8)), original: Number(monto) };
      })
    );
  }

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  }

  function handleMontoChange(id, value) {
    setMontos(prev => prev.map(m => (m.id === id ? { ...m, valor: value === "" ? "" : Number(value) } : m)));
  }

  async function handleNext() {
    if (step === 1) {
      if (!form.mercado || !form.instrumento || !form.fechaPago) {
        alert("Completa Mercado, Instrumento y Fecha Pago");
        return;
      }
      if (!validarFecha(form.fechaPago)) {
        alert("Fecha inválida");
        return;
      }

      if (!validarSecuenciaMayorA(form.secuenciaEvento)) {
        alert("La secuencia de evento debe ser mayor a 10.000");
        return;
      }

      const exists = await existeCalificacionPorInstrumento(form.fechaPago, form.instrumento);
      if (exists) {
        alert("Ya existe una calificación con la misma fecha e instrumento");
        return;
      }
    }

    if (step === 2) {
      const factoresObj = factors.reduce((acc, f) => ({ ...acc, [`factor${f.id}`]: f.calculado }), {});
      if (!validarSumaFactores(factoresObj)) {
        alert("La suma de factores (8 al 16) no debe superar 1");
        return;
      }

      for (const f of factors) {
        if (!validarFormatoFactor(String(f.calculado))) {
          alert(`Formato inválido en ${f.label}`);
          return;
        }
      }
    }

    setStep(prev => Math.min(prev + 1, 3));
  }

  async function handleSave() {
    setLoading(true);
    try {
      await crearCalificacion({
        ...form,
        montos,
        factors,
      });
      alert("Calificación guardada en la base temporal (SQLite en memoria)");
      setStep(1);
      setForm({
        mercado: "Acciones",
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
      setFactors(makeDefaultFactors());
      setMontos(makeDefaultMontos());
      onCreated?.();
    } catch (err) {
      console.error(err);
      alert("Error al guardar la calificación");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="ingreso-container">
      <div className="hero">
        <h1>Ingreso Manual de Calificación</h1>
      </div>

      <StepIndicator step={step} />

      {step === 1 && (
        <div className="filters-card" style={{ marginTop: 12 }}>
          <div className="filters-grid">
            <div>
              <label>Mercado *</label>
              <select className="select" name="mercado" value={form.mercado} onChange={handleChange}>
                <option value="">Seleccionar...</option>
                <option value="Nacional">Nacional</option>
                <option value="Internacional">Internacional</option>
              </select>
            </div>

            <div>
              <label>Instrumento *</label>
              <input
                className="input"
                name="instrumento"
                placeholder="Buscar instrumento..."
                value={form.instrumento}
                onChange={handleChange}
              />
            </div>

            <div>
              <label>Año Comercial *</label>
              <select className="select" name="anioComercial" value={form.anioComercial} onChange={handleChange}>
                <option value="2025">2025</option>
                <option value="2024">2024</option>
              </select>
            </div>

            <div>
              <label>Secuencia Evento *</label>
              <input
                className="input"
                name="secuenciaEvento"
                type="number"
                min="0"
                value={form.secuenciaEvento}
                onChange={handleChange}
              />
            </div>

            <div>
              <label>Descripción</label>
              <input
                className="input"
                name="descripcion"
                placeholder="Detalle del evento"
                value={form.descripcion}
                onChange={handleChange}
              />
            </div>

            <div>
              <label>Número de Dividendo</label>
              <input
                className="input"
                name="numeroDividendo"
                type="number"
                min="0"
                value={form.numeroDividendo}
                onChange={handleChange}
              />
            </div>

            <div>
              <label>Fecha Pago *</label>
              <input
                className="input"
                name="fechaPago"
                type="date"
                value={form.fechaPago}
                onChange={handleChange}
              />
            </div>

            <div>
              <label>Valor Histórico</label>
              <input
                className="input"
                name="valorHistorico"
                type="number"
                step="0.01"
                value={form.valorHistorico}
                onChange={handleChange}
              />
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 22 }}>
              <input
                type="checkbox"
                id="acogidoIsfut"
                name="acogidoIsfut"
                checked={form.acogidoIsfut}
                onChange={handleChange}
              />
              <label htmlFor="acogidoIsfut">Acogido a ISFUT</label>
            </div>
            <div>
              <label>Origen</label>
              <select className="select" name="origen" value={form.origen} onChange={handleChange}>
                <option value="Operador">Operador</option>
                <option value="Corredor">Corredor</option>
                <option value="Sistema">Sistema</option>
              </select>
            </div>
          </div>

          <div className="actions-row" style={{ justifyContent: "flex-end" }}>
            <button
              className="btn"
              onClick={() =>
                setForm({
                  mercado: "Acciones",
                  instrumento: "",
                  anioComercial: "2025",
                  secuenciaEvento: "10001",
                  numeroDividendo: "0",
                  valorHistorico: "0.00",
                  fechaPago: "",
                  acogidoIsfut: false,
                  descripcion: "",
                  origen: "Operador",
                })
              }
            >
              Cancelar
            </button>
            <button className="btn primary" onClick={handleNext}>
              Siguiente
            </button>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="table-card" style={{ marginTop: 12 }}>
          <div style={{ color: "#5b6570", marginBottom: 8, fontSize: 13 }}>
            Verifica los factores calculados antes de guardar.
          </div>
          <div className="table-wrapper">
            <table className="table">
              <thead>
                <tr>
                  <th>Campo</th>
                  <th>Monto</th>
                  <th>Factor Calculado</th>
                  <th>Editable</th>
                  <th>Estado</th>
                </tr>
              </thead>
              <tbody>
                {factors.map(factor => (
                  <tr key={factor.id}>
                    <td>{factor.label}</td>
                    <td>
                      <input
                        className="input"
                        type="number"
                        step="0.00000001"
                        value={montos.find(m => m.id === factor.id)?.valor}
                        onChange={e => handleMontoChange(factor.id, e.target.value)}
                      />
                    </td>
                    <td>
                      <input
                        className="input"
                        type="number"
                        step="0.00000001"
                        value={factor.calculado}
                        onChange={e => updateFactor(factor.id, e.target.value)}
                        disabled={!factor.editable}
                      />
                    </td>
                    <td>
                      <input type="checkbox" checked={factor.editable} readOnly />
                    </td>
                    <td>
                      <span className="row-tag tag-green">{factor.estado}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div style={{ marginTop: 10, fontWeight: 600 }}>
            Suma montos: {totalMontos.toFixed(2)} — Suma calculada factores: {totalCalculado.toFixed(6)}
          </div>

          <div className="actions-row" style={{ justifyContent: "space-between" }}>
            <div style={{ display: "flex", gap: 8 }}>
              <button className="btn" onClick={() => setStep(1)}>
                Cancelar
              </button>
              <button className="btn" onClick={calcularFactoresDesdeMontos}>
                Calcular
              </button>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <button className="btn" onClick={handleNext}>
                Grabar
              </button>
            </div>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="table-card" style={{ marginTop: 12 }}>
          <h3 style={{ marginTop: 0 }}>Revisión</h3>
          <p style={{ color: "#5b6570" }}>
            Confirmar guardado de la calificación manual.
          </p>
          <div className="actions-row" style={{ justifyContent: "space-between" }}>
            <button className="btn" onClick={() => setStep(2)}>
              Anterior
            </button>
            <button className="btn primary" disabled={loading} onClick={handleSave}>
              {loading ? "Guardando..." : "Guardar"}
            </button>
          </div>
        </div>
      )}

      <CargaSimulada />
    </div>
  );
}

function StepIndicator({ step }) {
  const steps = [
    { id: 1, label: "Datos básicos" },
    { id: 2, label: "Montos" },
    { id: 3, label: "Revisión" },
  ];

  return (
    <div style={{ display: "flex", gap: 12, marginBottom: 16, marginTop: 8 }}>
      {steps.map(item => (
        <div key={item.id} style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div
            style={{
              width: 30,
              height: 30,
              borderRadius: "50%",
              border: `2px solid ${step === item.id ? "var(--green)" : "#ccc"}`,
              display: "grid",
              placeItems: "center",
              color: step === item.id ? "var(--green)" : "#333",
              background: step === item.id ? "#e8f5ef" : "#fff",
              fontWeight: 700,
            }}
          >
            {item.id}
          </div>
          <div style={{ color: "#5b6570", fontSize: 13 }}>{item.label}</div>
        </div>
      ))}
    </div>
  );
}

function CargaSimulada() {
  const [mode, setMode] = useState("archivo");
  return (
    <div className="table-card" style={{ marginTop: 16 }}>
      <div className="actions-row" style={{ marginBottom: 12 }}>
        <button className={`btn ${mode === "archivo" ? "primary" : ""}`} onClick={() => setMode("archivo")}>
          Subir archivo
        </button>
        <button className={`btn ${mode === "texto" ? "primary" : ""}`} onClick={() => setMode("texto")}>
          Pegar texto
        </button>
      </div>

      {mode === "archivo" && (
        <div className="filters-grid">
          <div>
            <label>Archivo CSV</label>
            <input className="input" type="file" accept=".csv" />
          </div>
          <div>
            <label>Formato esperado</label>
            <div className="badge">Campos: ejercicio, mercado, instrumento, fechaPago, factores 8-37</div>
          </div>
        </div>
      )}

      {mode === "texto" && (
        <div>
          <label>Ingresar texto o pegar CSV</label>
          <textarea className="input" style={{ width: "100%", minHeight: 120 }} placeholder="factor8,factor9,..." />
        </div>
      )}
    </div>
  );
}
