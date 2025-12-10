// ===== Validar suma de factores 8–19 <= 1 =====
export function validarSumaFactores(obj) {
  let suma = 0;
  // regla estricta HU004/005: factores 8 al 16
  for (let i = 8; i <= 16; i++) {
    suma += Number(obj[`factor${i}`] || 0);
  }
  return suma <= 1;
}

// ===== Validar formato de factor =====
// Acepta: 0.12345678 … hasta 8 decimales
export function validarFormatoFactor(x) {
  if (x === "" || x === null || x === undefined) return true;
  return /^0(\.\d{1,8})?$|^1(\.0{1,8})?$/.test(x);
}

// ===== Validar fecha DD-MM-AAAA =====
export function validarFecha(fecha) {
  // acepta DD-MM-AAAA o AAAA-MM-DD (input date)
  return /^\d{2}-\d{2}-\d{4}$/.test(fecha) || /^\d{4}-\d{2}-\d{2}$/.test(fecha);
}

// ===== Tipo sociedad A / C =====
export function validarTipoSociedad(x) {
  return x === "A" || x === "C";
}

// ===== Mercado 1 a 3 letras =====
export function validarMercado(x) {
  return /^[A-Za-z]{1,3}$/.test(x);
}

export async function existeCalificacionPorInstrumento(fechaPago, instrumento) {
  const db = await initDB();
  const res = db.exec(
    `SELECT id FROM calificaciones WHERE fechaPago='${fechaPago}' AND instrumento='${instrumento}'`
  );
  return res.length > 0;
}

export function validarSecuenciaMayorA(valor) {
  return Number(valor || 0) > 10000;
}
