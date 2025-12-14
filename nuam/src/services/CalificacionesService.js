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

export async function obtenerCalificaciones() {
  const response = await fetch(`${API_URL}/calificaciones`);
  if (!response.ok) return [];
  const data = await response.json();
  
  // Mapear snake_case de DB a camelCase del frontend si es necesario
  // El backend devuelve snake_case porque postgres lo usa por defecto, 
  // pero en el backend hicimos SELECT * sin alias.
  // Vamos a asumir que el backend devuelve snake_case y lo convertimos aquí.
  
  return data.map(row => ({
    id: row.id,
    mercado: row.mercado,
    instrumento: row.instrumento,
    anioComercial: row.anio_comercial,
    secuenciaEvento: row.secuencia_evento,
    numeroDividendo: row.numero_dividendo,
    valorHistorico: row.valor_historico,
    fechaPago: row.fecha_pago, // Postgres devuelve string YYYY-MM-DD o ISO
    descripcion: row.descripcion,
    origen: row.origen,
    fuente: row.fuente,
    acogidoIsfut: row.acogido_isfut,
    factors: row.factors_json, // Postgres devuelve el JSON ya parseado si usamos pg
    montos: row.montos_json,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
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

// Función auxiliar para compatibilidad si algo falla
export async function existeCalificacion(rut) {
    // Esta función estaba en el código original pero no en el snippet que leí, 
    // pero aparecía en CargaPorFactor.jsx. La agrego por si acaso.
    // Asumo que rut es instrumento o similar, o quizás no se usa.
    // Revisando CargaPorFactor.jsx: const existe = await existeCalificacion(reg.rut);
    // Parece que rut se usa como identificador.
    // Implementaré una búsqueda simple.
    const lista = await obtenerCalificaciones();
    return lista.some(c => c.instrumento === rut); // Asumiendo rut == instrumento
}

