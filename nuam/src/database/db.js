import initSqlJs from "sql.js";

let db = null;
const DB_VERSION = "4"; // Forzar nueva estructura cuando cambie el esquema
const DB_KEY = "db_nuam";
const DB_VERSION_KEY = "db_nuam_version";

export async function initDB() {
  if (db) return db;

  const SQL = await initSqlJs({
    locateFile: (file) => `https://sql.js.org/dist/${file}`,
  });

  const savedVersion = localStorage.getItem(DB_VERSION_KEY);
  const saved = localStorage.getItem(DB_KEY);

  // Si la versión coincide → cargar la BD guardada
  if (saved && savedVersion === DB_VERSION) {
    const uint8 = Uint8Array.from(JSON.parse(saved));
    db = new SQL.Database(uint8);
    return db;
  }

  // Si la versión no coincide → borrar y crear nueva BD
  localStorage.removeItem(DB_KEY);
  db = new SQL.Database();

  /* ============================================================
     TABLA: CALIFICACIONES
  ============================================================ */
  db.run(`
    CREATE TABLE IF NOT EXISTS calificaciones (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      mercado TEXT,
      instrumento TEXT,
      anioComercial TEXT,
      secuenciaEvento TEXT,
      numeroDividendo TEXT,
      valorHistorico REAL,
      fechaPago TEXT,
      descripcion TEXT,
      origen TEXT,
      fuente TEXT,
      acogidoIsfut INTEGER,
      factorsJson TEXT,
      montosJson TEXT,
      createdAt TEXT,
      updatedAt TEXT
    );
  `);

  /* ============================================================
     TABLA: INFORMACIÓN EXTERNA
     ⬇️ nombres alineados con tu frontend (MantenedorInfoExterna)
  ============================================================ */
  db.run(`
    CREATE TABLE IF NOT EXISTS informacion_externa (
      id INTEGER PRIMARY KEY AUTOINCREMENT,

      ejercicio TEXT,
      mercado TEXT,
      instrumento TEXT,
      fechaPago TEXT,

      descripcionDividendo TEXT,  -- 👈 CORRECTO PARA TU FRONTEND
      secuenciaEvento TEXT,       -- 👈 CORRECTO PARA TU FRONTEND
      acogidoIsfut TEXT,          -- 👈 ISFUT/ISIFIT COMBINADO O LISTA

      origen TEXT,
      factorActualizacion REAL,

      factor8 REAL,
      factor9 REAL,
      factor10 REAL,
      factor11 REAL,
      factor12 REAL,
      factor13 REAL,
      factor14 REAL,
      factor15 REAL,
      factor16 REAL,
      factor17 REAL,
      factor18 REAL,
      factor19 REAL,
      factor20 REAL,
      factor21 REAL,
      factor22 REAL,
      factor23 REAL,
      factor24 REAL,
      factor25 REAL,
      factor26 REAL,
      factor27 REAL,
      factor28 REAL,
      factor29 REAL,
      factor30 REAL,
      factor31 REAL,
      factor32 REAL,
      factor33 REAL,
      factor34 REAL,
      factor35 REAL,
      factor36 REAL,
      factor37 REAL
    );
  `);

  // Guardar BD inicial
  saveDB(db);
  localStorage.setItem(DB_VERSION_KEY, DB_VERSION);

  return db;
}

/* ============================================================
   GUARDAR BD EN LOCALSTORAGE
============================================================ */
export function saveDB(db) {
  const data = db.export();
  const bytes = Array.from(data);
  localStorage.setItem(DB_KEY, JSON.stringify(bytes));
  localStorage.setItem(DB_VERSION_KEY, DB_VERSION);
}
