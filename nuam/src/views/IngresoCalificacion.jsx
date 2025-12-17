// src/views/IngresoCalificacion.jsx
import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import {
	crearCalificacion,
	actualizarCalificacion,
	existeCalificacionPorInstrumento,
	obtenerCalificacion,
} from "../services/CalificacionesService";
import {
	validarFormatoFactor,
	validarFecha,
	validarSumaFactores,
	validarSecuenciaMayorA,
} from "../services/Validadores";
import { makeDefaultFactors, makeDefaultMontos } from "../constants/factors";

export default function IngresoCalificacion({ modo: modoProp, registro: registroProp, onCreated, onSaved }) {
	const navigate = useNavigate();
	const location = useLocation();
	const params = useParams();

	const locationState = location.state || {};
	const modoFromState = locationState.modo;
	const registroFromState = locationState.registro || null;
	const derivedModo = modoProp || modoFromState || (params?.id ? "editar" : "crear");
	const derivedRegistro = registroProp || registroFromState || null;

	const [modo, setModo] = useState(derivedModo);
	const [registro, setRegistro] = useState(derivedRegistro);

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

	const openedViaProps = Boolean(modoProp || registroProp || onSaved);

	useEffect(() => {
		setModo(derivedModo);
	}, [derivedModo]);

	useEffect(() => {
		setRegistro(derivedRegistro);
	}, [derivedRegistro]);

	// ========= SI VIENES POR RUTA /ingreso/:id, CARGA DESDE API =========
	useEffect(() => {
		const id = params?.id;
		if (!id) return;

		setModo("editar");
		(async () => {
			try {
				const data = await obtenerCalificacion(id);
				setRegistro(data);
			} catch (e) {
				console.error(e);
				alert("No se pudo cargar la calificación a editar");
				navigate("/dashboard");
			}
		})();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [params?.id]);

	// ========= PRECARGA EN EDICIÓN (state o fetch) =========
	useEffect(() => {
		if (modo !== "editar" || !registro) return;

		setForm({
			mercado: registro.mercado || "",
			instrumento: registro.instrumento || "",
			anioComercial: String(registro.anioComercial || "2025"),
			secuenciaEvento: String(registro.secuenciaEvento || "10001"),
			numeroDividendo: String(registro.numeroDividendo || "0"),
			valorHistorico: String(registro.valorHistorico || "0.00"),
			fechaPago: (registro.fechaPago ? String(registro.fechaPago).substring(0, 10) : ""),
			acogidoIsfut: Boolean(registro.acogidoIsfut),
			descripcion: registro.descripcion || "",
			origen: registro.origen || "Operador",
		});

		setFactors((registro.factors && registro.factors.length ? registro.factors : makeDefaultFactors()));
		setMontos((registro.montos && registro.montos.length ? registro.montos : makeDefaultMontos()));
	}, [modo, registro]);

	// ================== CALCULOS ==================
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

	// ================== NAVEGACIÓN ==================
	async function handleNext() {
		if (step === 1) {
			if (!form.mercado || !form.instrumento || !form.fechaPago) {
				alert("Completa Mercado, Instrumento y Fecha de Pago");
				return;
			}

			if (!validarFecha(form.fechaPago)) {
				alert("Fecha inválida");
				return;
			}

			if (!validarSecuenciaMayorA(form.secuenciaEvento)) {
				alert("La secuencia debe ser mayor a 10.000");
				return;
			}

			if (modo === "crear") {
				const exists = await existeCalificacionPorInstrumento(form.fechaPago, form.instrumento);
				if (exists) {
					alert("Ya existe una calificación con el mismo instrumento y fecha");
					return;
				}
			}
		}

		if (step === 2) {
			const factoresObj = factors.reduce(
				(acc, f) => ({ ...acc, [`factor${f.id}`]: f.calculado }),
				{}
			);

			if (!validarSumaFactores(factoresObj)) {
				alert("La suma de los factores (8 al 37) debe ser igual a 1");
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

	// ================== GUARDAR ==================
	async function handleSave() {
		setLoading(true);
		try {
			const payload = { ...form, montos, factors };
			if (modo === "editar") {
				const id = registro?.id ?? params?.id;
				await actualizarCalificacion(id, payload);
				alert("Calificación actualizada correctamente");
				onSaved?.();
				if (!openedViaProps) navigate("/dashboard");
			} else {
				await crearCalificacion(payload);
				alert("Calificación guardada correctamente");
				onCreated?.();
				if (!openedViaProps) navigate("/dashboard");
			}
		} catch (err) {
			console.error(err);
			alert("Error al guardar la calificación");
		} finally {
			setLoading(false);
		}
	}

	// ================== UI ==================
	return (
		<div className="ingreso-container">
			<div className="hero">
				<h1>{modo === "editar" ? "Editar Calificación Tributaria" : "Ingreso Manual de Calificación"}</h1>
			</div>

			<StepIndicator step={step} />

			{/* ================= STEP 1 ================= */}
			{step === 1 && (
				<div className="filters-card" style={{ marginTop: 12 }}>
					<div className="filters-grid">
						<div>
							<label>Mercado *</label>
							<select className="select" name="mercado" value={form.mercado} onChange={handleChange}>
								<option value="">Seleccionar...</option>
								<option value="Acciones">Acciones</option>
								<option value="CFI">CFI</option>
								<option value="Fondos">Fondos Mutuos</option>
							</select>
						</div>

						<div>
							<label>Instrumento *</label>
							<input className="input" name="instrumento" value={form.instrumento} onChange={handleChange} />
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
							<input className="input" name="secuenciaEvento" type="number" value={form.secuenciaEvento} onChange={handleChange} />
						</div>

						<div>
							<label>Descripción</label>
							<input className="input" name="descripcion" value={form.descripcion} onChange={handleChange} />
						</div>

						<div>
							<label>Fecha Pago *</label>
							<input className="input" type="date" name="fechaPago" value={form.fechaPago} onChange={handleChange} />
						</div>

						<div>
							<label>Valor Histórico</label>
							<input className="input" name="valorHistorico" type="number" step="0.01" value={form.valorHistorico} onChange={handleChange} />
						</div>

						<div>
							<label>Origen</label>
							<select className="select" name="origen" value={form.origen} onChange={handleChange}>
								<option value="Operador">Operador</option>
								<option value="Corredor">Corredor</option>
								<option value="Sistema">Sistema</option>
							</select>
						</div>

						<div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 22 }}>
							<input type="checkbox" name="acogidoIsfut" checked={form.acogidoIsfut} onChange={handleChange} />
							<label>Acogido a ISFUT / ISIF</label>
						</div>
					</div>

					<div className="actions-row" style={{ justifyContent: "flex-end" }}>
						<button className="btn primary" onClick={handleNext}>Siguiente</button>
					</div>
				</div>
			)}

			{/* ================= STEP 2 ================= */}
			{step === 2 && (
				<div className="table-card" style={{ marginTop: 12 }}>
					<div className="table-wrapper">
						<table className="table">
							<thead>
								<tr>
									<th>Factor</th>
									<th>Monto</th>
									<th>Calculado</th>
								</tr>
							</thead>
							<tbody>
								{factors.map(f => (
									<tr key={f.id}>
										<td>{f.label}</td>
										<td>
											<input
												className="input"
												type="number"
												step="0.00000001"
												value={montos.find(m => m.id === f.id)?.valor ?? 0}
												onChange={e => handleMontoChange(f.id, e.target.value)}
											/>
										</td>
										<td>
											<input
												className="input"
												type="number"
												step="0.00000001"
												value={f.calculado ?? 0}
												onChange={e => updateFactor(f.id, e.target.value)}
											/>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>

					<div style={{ marginTop: 10, fontWeight: 600 }}>
						Suma factores (8–37): {totalCalculado.toFixed(6)}
					</div>

					<div className="actions-row" style={{ justifyContent: "space-between" }}>
						<button className="btn" onClick={() => setStep(1)}>Volver</button>
						<div style={{ display: "flex", gap: 8 }}>
							<button className="btn" onClick={calcularFactoresDesdeMontos}>Calcular</button>
							<button className="btn primary" onClick={handleNext}>Revisar</button>
						</div>
					</div>
				</div>
			)}

			{/* ================= STEP 3 ================= */}
			{step === 3 && (
				<div className="table-card" style={{ marginTop: 12 }}>
					<h3>Confirmación</h3>
					<p>Confirma el ingreso de la calificación tributaria.</p>

					<div className="actions-row" style={{ justifyContent: "space-between" }}>
						<button className="btn" onClick={() => setStep(2)}>Anterior</button>
						<button className="btn primary" disabled={loading} onClick={handleSave}>
							{loading ? "Guardando..." : "Guardar"}
						</button>
					</div>
				</div>
			)}
		</div>
	);
}

function StepIndicator({ step }) {
	const steps = ["Datos básicos", "Factores", "Revisión"];
	return (
		<div style={{ display: "flex", gap: 12, marginBottom: 16 }}>
			{steps.map((s, i) => (
				<div key={i} style={{ fontWeight: step === i + 1 ? 700 : 400 }}>
					{i + 1}. {s}
				</div>
			))}
		</div>
	);
}
