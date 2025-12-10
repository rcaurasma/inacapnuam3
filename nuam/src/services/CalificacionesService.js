import { initDB, saveDB } from "../database/db";

// ----------------------------------------------
// CREAR
// ----------------------------------------------
export async function crearCalificacion(data) {
  const db = await initDB();

  const stmt = db.prepare(`
    INSERT INTO calificaciones (
      mercado,
      instrumento,
      anioComercial,
      secuenciaEvento,
      numeroDividendo,
      valorHistorico,
      fechaPago,
      descripcion,
      origen,
      fuente,
      acogidoIsfut,
      factorsJson,
      montosJson,
      createdAt,
      updatedAt
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const now = new Date().toISOString();

  stmt.run([
    data.mercado || null,
    data.instrumento || null,
    data.anioComercial || null,
    data.secuenciaEvento || null,
    data.numeroDividendo || null,
    data.valorHistorico != null ? Number(data.valorHistorico) : null,
    data.fechaPago || null,
    data.descripcion || "",
    data.origen || "Operador",
    data.fuente || "Manual",
    data.acogidoIsfut ? 1 : 0,
    JSON.stringify(data.factors || []),
    JSON.stringify(data.montos || []),
    now,
    now,
  ]);

  stmt.free();
  saveDB(db);
}

// ----------------------------------------------
// OBTENER LISTADO
// ----------------------------------------------
export async function obtenerCalificaciones() {
  const db = await initDB();
  const res = db.exec(`SELECT * FROM calificaciones ORDER BY id DESC`);
  if (!res[0]) return [];

  return res[0].values.map(row => ({
    id: row[0],
    mercado: row[1],
    instrumento: row[2],
    anioComercial: row[3],
    secuenciaEvento: row[4],
    numeroDividendo: row[5],
    valorHistorico: row[6],
    fechaPago: row[7],
    descripcion: row[8],
    origen: row[9],
    fuente: row[10],
    acogidoIsfut: Boolean(row[11]),
    factors: safeParseJson(row[12]),
    montos: safeParseJson(row[13]),
    createdAt: row[14],
    updatedAt: row[15],
  }));
}

// ----------------------------------------------
// ELIMINAR
// ----------------------------------------------
export async function eliminarCalificacion(id) {
  const db = await initDB();
  const stmt = db.prepare(`DELETE FROM calificaciones WHERE id = ?`);
  stmt.run([id]);
  stmt.free();
  saveDB(db);
}

// ----------------------------------------------
// ACTUALIZAR
// ----------------------------------------------
export async function actualizarCalificacion(id, data) {
  const db = await initDB();

  const stmt = db.prepare(`
    UPDATE calificaciones
    SET mercado = ?, instrumento = ?, anioComercial = ?, secuenciaEvento = ?,
        numeroDividendo = ?, valorHistorico = ?, fechaPago = ?, descripcion = ?,
        origen = ?, fuente = ?, acogidoIsfut = ?, factorsJson = ?, montosJson = ?,
        updatedAt = ?
    WHERE id = ?
  `);

  stmt.run([
    data.mercado || null,
    data.instrumento || null,
    data.anioComercial || null,
    data.secuenciaEvento || null,
    data.numeroDividendo || null,
    data.valorHistorico != null ? Number(data.valorHistorico) : null,
    data.fechaPago || null,
    data.descripcion || "",
    data.origen || "Operador",
    data.fuente || "Manual",
    data.acogidoIsfut ? 1 : 0,
    JSON.stringify(data.factors || []),
    JSON.stringify(data.montos || []),
    new Date().toISOString(),
    id,
  ]);

  stmt.free();
  saveDB(db);
}

export async function existeCalificacionPorInstrumento(fechaPago, instrumento) {
  const db = await initDB();
  const stmt = db.prepare(
    `SELECT id FROM calificaciones WHERE fechaPago = ? AND instrumento = ? LIMIT 1`
  );
  stmt.bind([fechaPago, instrumento]);
  const exists = stmt.step();
  stmt.free();
  return exists;
}

function safeParseJson(raw) {
  try {
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}
