import initSqlJs from "sql.js";

let db = null;
const DB_VERSION = "2";
const DB_KEY = "db_nuam";
const DB_VERSION_KEY = "db_nuam_version";

export async function initDB() {
  if (db) return db;

  const SQL = await initSqlJs({
    locateFile: (file) => `https://sql.js.org/dist/${file}`,
  });

  const savedVersion = localStorage.getItem(DB_VERSION_KEY);
  const saved = localStorage.getItem(DB_KEY);

  if (saved && savedVersion === DB_VERSION) {
    const uint8 = Uint8Array.from(JSON.parse(saved));
    db = new SQL.Database(uint8);
  } else {
    // reset DB when schema changes
    localStorage.removeItem(DB_KEY);
    db = new SQL.Database();

    // Crear tabla solo una vez (cuando no existe BD previa)
db.run(`
  CREATE TABLE IF NOT EXISTS calificaciones (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    rut TEXT NOT NULL,
    nombre TEXT NOT NULL,
    monto REAL NOT NULL,
    fecha TEXT NOT NULL,
    tipoSociedad TEXT,
    mercado TEXT,
    corredor TEXT,

    factor8 REAL, factor9 REAL, factor10 REAL, factor11 REAL,
    factor12 REAL, factor13 REAL, factor14 REAL, factor15 REAL,
    factor16 REAL, factor17 REAL, factor18 REAL, factor19 REAL,

    factor20 REAL, factor21 REAL, factor22 REAL, factor23 REAL,
    factor24 REAL, factor25 REAL, factor26 REAL, factor27 REAL,
    factor28 REAL, factor29 REAL, factor30 REAL, factor31 REAL,
    factor32 REAL, factor33 REAL, factor34 REAL, factor35 REAL,
    factor36 REAL, factor37 REAL
  );
`);


    // Guardamos solo al crear la tabla
    saveDB(db);
    localStorage.setItem(DB_VERSION_KEY, DB_VERSION);
  }

  return db;
}

// Guarda la base de datos en localStorage
export function saveDB(db) {
  const data = db.export();
  const bytes = Array.from(data);
  localStorage.setItem(DB_KEY, JSON.stringify(bytes));
  localStorage.setItem(DB_VERSION_KEY, DB_VERSION);
}
