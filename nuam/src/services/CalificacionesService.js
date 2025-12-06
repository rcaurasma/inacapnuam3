import { initDB, saveDB } from "../database/db";

// ----------------------------------------------
// CREAR
// ----------------------------------------------
export async function crearCalificacion(data) {
  const db = await initDB();

  const stmt = db.prepare(`
    INSERT INTO calificaciones (
      rut, nombre, monto, fecha, tipoSociedad, mercado,
      factor8, factor9, factor10, factor11, factor12, factor13,
      factor14, factor15, factor16, factor17, factor18, factor19
    )
    VALUES (?, ?, ?, ?, ?, ?,
            ?, ?, ?, ?, ?, ?,
            ?, ?, ?, ?, ?, ?)
  `);

  stmt.run([
    data.rut,
    data.nombre,
    parseFloat(data.monto),
    data.fecha,
    data.tipoSociedad,
    data.mercado,

    parseFloat(data.factor8 || 0),
    parseFloat(data.factor9 || 0),
    parseFloat(data.factor10 || 0),
    parseFloat(data.factor11 || 0),
    parseFloat(data.factor12 || 0),
    parseFloat(data.factor13 || 0),
    parseFloat(data.factor14 || 0),
    parseFloat(data.factor15 || 0),
    parseFloat(data.factor16 || 0),
    parseFloat(data.factor17 || 0),
    parseFloat(data.factor18 || 0),
    parseFloat(data.factor19 || 0),
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

  const rows = res[0].values;

  return rows.map(row => ({
    id: row[0],
    rut: row[1],
    nombre: row[2],
    monto: row[3],
    fecha: row[4],
    tipoSociedad: row[5],
    mercado: row[6],

    factor8: row[7],
    factor9: row[8],
    factor10: row[9],
    factor11: row[10],
    factor12: row[11],
    factor13: row[12],
    factor14: row[13],
    factor15: row[14],
    factor16: row[15],
    factor17: row[16],
    factor18: row[17],
    factor19: row[18]
  }));
}

// ----------------------------------------------
// ELIMINAR
// ----------------------------------------------
export async function eliminarCalificacion(id) {
  const db = await initDB();
  db.run(`DELETE FROM calificaciones WHERE id = ${id}`);
  saveDB(db);
}

// ----------------------------------------------
// ACTUALIZAR
// ----------------------------------------------
export async function actualizarCalificacion(id, data) {
  const db = await initDB();

  const stmt = db.prepare(`
    UPDATE calificaciones
    SET rut = ?, nombre = ?, monto = ?, fecha = ?,
        tipoSociedad = ?, mercado = ?,
        factor8 = ?, factor9 = ?, factor10 = ?, factor11 = ?,
        factor12 = ?, factor13 = ?, factor14 = ?, factor15 = ?,
        factor16 = ?, factor17 = ?, factor18 = ?, factor19 = ?
    WHERE id = ?
  `);

  stmt.run([
    data.rut,
    data.nombre,
    parseFloat(data.monto),
    data.fecha,
    data.tipoSociedad,
    data.mercado,

    parseFloat(data.factor8 || 0),
    parseFloat(data.factor9 || 0),
    parseFloat(data.factor10 || 0),
    parseFloat(data.factor11 || 0),
    parseFloat(data.factor12 || 0),
    parseFloat(data.factor13 || 0),
    parseFloat(data.factor14 || 0),
    parseFloat(data.factor15 || 0),
    parseFloat(data.factor16 || 0),
    parseFloat(data.factor17 || 0),
    parseFloat(data.factor18 || 0),
    parseFloat(data.factor19 || 0),

    id
  ]);

  stmt.free();
  saveDB(db);
}

// ----------------------------------------------
// EXISTE POR RUT
// ----------------------------------------------
export async function existeCalificacion(rut) {
  const db = await initDB();
  const res = db.exec(`SELECT id FROM calificaciones WHERE rut = '${rut}'`);
  return res.length > 0;
}
