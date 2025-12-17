// src/services/CalificacionesService.js
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

export async function crearCalificacion(data) {
	const response = await fetch(`${API_URL}/calificaciones`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(data),
	});
	if (!response.ok) throw new Error("Error al crear calificación");
	return await response.json();
}

export async function obtenerCalificacion(id) {
	const response = await fetch(`${API_URL}/calificaciones/${id}`);
	if (!response.ok) throw new Error("Error al obtener calificación");
	const row = await response.json();

	// soporta si el backend devuelve snake_case
	return {
		id: row.id,
		mercado: row.mercado,
		instrumento: row.instrumento,
		anioComercial: row.anio_comercial ?? row.anioComercial,
		secuenciaEvento: row.secuencia_evento ?? row.secuenciaEvento,
		numeroDividendo: row.numero_dividendo ?? row.numeroDividendo,
		valorHistorico: row.valor_historico ?? row.valorHistorico,
		fechaPago: row.fecha_pago ?? row.fechaPago,
		descripcion: row.descripcion,
		origen: row.origen,
		fuente: row.fuente,
		acogidoIsfut: row.acogido_isfut ?? row.acogidoIsfut,
		factors: row.factors_json ?? row.factors ?? [],
		montos: row.montos_json ?? row.montos ?? [],
		createdAt: row.created_at ?? row.createdAt,
		updatedAt: row.updated_at ?? row.updatedAt,
	};
}

export async function obtenerCalificaciones() {
	const response = await fetch(`${API_URL}/calificaciones`);
	if (!response.ok) return [];
	const data = await response.json();

	return data.map(row => ({
		id: row.id,
		mercado: row.mercado,
		instrumento: row.instrumento,
		anioComercial: row.anio_comercial ?? row.anioComercial,
		secuenciaEvento: row.secuencia_evento ?? row.secuenciaEvento,
		numeroDividendo: row.numero_dividendo ?? row.numeroDividendo,
		valorHistorico: row.valor_historico ?? row.valorHistorico,
		fechaPago: row.fecha_pago ?? row.fechaPago,
		descripcion: row.descripcion,
		origen: row.origen,
		fuente: row.fuente,
		acogidoIsfut: row.acogido_isfut ?? row.acogidoIsfut,
		factors: row.factors_json ?? row.factors ?? [],
		montos: row.montos_json ?? row.montos ?? [],
		createdAt: row.created_at ?? row.createdAt,
		updatedAt: row.updated_at ?? row.updatedAt,
	}));
}

export async function eliminarCalificacion(id) {
	await fetch(`${API_URL}/calificaciones/${id}`, { method: "DELETE" });
}

export async function actualizarCalificacion(id, data) {
	await fetch(`${API_URL}/calificaciones/${id}`, {
		method: "PUT",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(data),
	});
}

export async function existeCalificacionPorInstrumento(fechaPago, instrumento) {
	const params = new URLSearchParams({ fechaPago, instrumento });
	const response = await fetch(`${API_URL}/calificaciones/existe?${params}`);
	if (!response.ok) return false;
	const data = await response.json();
	return data.exists;
}

export async function existeCalificacion(rut) {
	const lista = await obtenerCalificaciones();
	return lista.some(c => c.instrumento === rut);
}
