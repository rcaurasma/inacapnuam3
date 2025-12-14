const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

/* ============================================================
   CREAR REGISTRO
============================================================ */
export async function crearInfoExterna(data) {
  const response = await fetch(`${API_URL}/info-externa`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error("Error al crear información externa");
  return await response.json();
}

/* ============================================================
   OBTENER REGISTROS CON FILTROS
============================================================ */
export async function obtenerInfoExterna(filtros = {}) {
  const params = new URLSearchParams(filtros);
  const response = await fetch(`${API_URL}/info-externa?${params}`);
  if (!response.ok) return [];
  const data = await response.json();

  // Mapeo de snake_case a camelCase
  return data.map(row => {
    const obj = {};
    // Copiamos propiedades directas
    for (const key in row) {
      // Convertir snake_case a camelCase simple
      const camelKey = key.replace(/_([a-z])/g, (g) => g[1].toUpperCase());
      obj[camelKey] = row[key];
      
      // Casos especiales si el mapeo automático falla o queremos nombres específicos
      if (key === 'factor_actualizacion') obj.factorActualizacion = row[key];
      if (key === 'fecha_pago') obj.fechaPago = row[key];
      if (key === 'descripcion_dividendo') obj.descripcionDividendo = row[key];
      if (key === 'secuencia_evento') obj.secuenciaEvento = row[key];
      if (key === 'acogido_isfut') obj.acogidoIsfut = row[key];
    }
    return obj;
  });
}

/* ============================================================
   OBTENER POR ID
============================================================ */
export async function obtenerInfoExternaPorId(id) {
  // Reutilizamos la búsqueda general filtrando en cliente o podríamos hacer endpoint específico
  // Por simplicidad y dado que no hice endpoint específico de ID en backend (solo delete/put),
  // podemos hacer fetch de todo y buscar, o agregar endpoint.
  // Agregué PUT y DELETE por ID, pero no GET por ID.
  // Usaré obtenerInfoExterna y filtraré.
  const todos = await obtenerInfoExterna();
  return todos.find(x => x.id === Number(id)) || null;
}

/* ============================================================
   BUSCAR POR INSTRUMENTO (para carga masiva)
============================================================ */
export async function existeInfoExternaPorInstrumento(instrumento) {
  // Podríamos optimizar con endpoint, pero por ahora filtramos
  const todos = await obtenerInfoExterna();
  const encontrado = todos.find(x => x.instrumento === instrumento);
  return encontrado ? encontrado.id : null;
}

/* ============================================================
   ACTUALIZAR REGISTRO
============================================================ */
export async function actualizarInfoExterna(id, data) {
  await fetch(`${API_URL}/info-externa/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
}

/* ============================================================
   ELIMINAR REGISTRO
============================================================ */
export async function eliminarInfoExterna(id) {
  await fetch(`${API_URL}/info-externa/${id}`, { method: "DELETE" });
}
