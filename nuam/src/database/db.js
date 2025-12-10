import initSqlJs from "sql.js";

let db = null;
const DB_VERSION = "3";
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
