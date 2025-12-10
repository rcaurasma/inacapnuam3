import { initDB, saveDB } from "../database/db";

/* ============================================================
   CREAR REGISTRO
============================================================ */
export async function crearInfoExterna(data) {
  const db = await initDB();

  const fields = Object.keys(data).join(", ");
  const placeholders = Object.keys(data).map(() => "?").join(", ");
  const values = Object.values(data);

  db.run(
    `INSERT INTO informacion_externa (${fields}) VALUES (${placeholders})`,
    values
  );

  saveDB(db);
}

/* ============================================================
   OBTENER REGISTROS CON FILTROS
============================================================ */
export async function obtenerInfoExterna(filtros = {}) {
  const db = await initDB();

  let query = `SELECT * FROM informacion_externa WHERE 1=1`;
  const params = [];

  // === FILTRO POR MERCADO ===
  if (filtros.mercado) {
    query += ` AND mercado = ?`;
    params.push(filtros.mercado);
  }

  // === FILTRO POR ORIGEN ===
  if (filtros.origen) {
    query += ` AND origen = ?`;
    params.push(filtros.origen);
  }

  // === FILTRO POR EJERCICIO ===
  if (filtros.ejercicio) {
    query += ` AND ejercicio LIKE ?`;
    params.push(`%${filtros.ejercicio}%`);
  }

  // Ordenar por ID DESC
  query += ` ORDER BY id DESC`;

  const result = db.exec(query, params);

  if (result.length === 0) return [];

  return result[0].values.map((row) => {
    const obj = {};
    result[0].columns.forEach((col, i) => (obj[col] = row[i]));
    return obj;
  });
}

/* ============================================================
   OBTENER POR ID
============================================================ */
export async function obtenerInfoExternaPorId(id) {
  const db = await initDB();

  const result = db.exec(
    `SELECT * FROM informacion_externa WHERE id = ?`,
    [id]
  );

  if (result.length === 0) return null;

  const row = result[0].values[0];
  const obj = {};

  result[0].columns.forEach((col, i) => (obj[col] = row[i]));
  return obj;
}

/* ============================================================
   BUSCAR POR INSTRUMENTO (para carga masiva)
============================================================ */
export async function existeInfoExternaPorInstrumento(instrumento) {
  const db = await initDB();

  const result = db.exec(
    `SELECT id FROM informacion_externa WHERE instrumento = ?`,
    [instrumento]
  );

  // Si existe → retorna el ID
  return result.length > 0 ? result[0].values[0][0] : null;
}

/* ============================================================
   ACTUALIZAR REGISTRO
============================================================ */
export async function actualizarInfoExterna(id, data) {
  const db = await initDB();

  const fields = Object.keys(data)
    .map((key) => `${key} = ?`)
    .join(", ");

  const values = Object.values(data);

  db.run(
    `UPDATE informacion_externa SET ${fields} WHERE id = ?`,
    [...values, id]
  );

  saveDB(db);
}

/* ============================================================
   ELIMINAR REGISTRO
============================================================ */
export async function eliminarInfoExterna(id) {
  const db = await initDB();
  db.run(`DELETE FROM informacion_externa WHERE id = ?`, [id]);
  saveDB(db);
}
