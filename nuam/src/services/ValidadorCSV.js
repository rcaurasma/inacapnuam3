import {
  validarFecha,
  validarTipoSociedad,
  validarMercado,
  validarFormatoFactor,
  validarSumaFactores
} from "./Validadores";

/* ============================================================
   DETECTAR TIPO DE REGISTRO
============================================================ */
function esCalificacion(obj) {
  // Tiene campos típicos de calificación tributaria
  return obj.rut && obj.monto && obj.mercado;
}

function esInfoExterna(obj) {
  // Tiene campos típicos de información externa
  return obj.ejercicio || obj.instrumento || obj.fechaPago;
}

/* ============================================================
   VALIDACIONES PARA CALIFICACIONES TRIBUTARIAS
============================================================ */
export function validarFilaCalificacion(obj) {
  const errores = [];

  if (!obj.rut) errores.push("RUT vacío");
  if (!obj.nombre) errores.push("Nombre vacío");

  if (isNaN(parseFloat(obj.monto))) errores.push("Monto inválido");

  if (!validarFecha(obj.fecha)) errores.push("Fecha inválida (DD-MM-AAAA)");

  if (!validarTipoSociedad(obj.tipoSociedad))
    errores.push("TipoSociedad debe ser A o C");

  if (!validarMercado(obj.mercado))
    errores.push("Mercado debe ser 1 a 3 letras");

  // Factores 8 al 19: formato numérico 0,00 y suma <= 1
  for (let i = 8; i <= 19; i++) {
    const key = `factor${i}`;
    if (obj[key] && !validarFormatoFactor(obj[key])) {
      errores.push(`Factor ${i} con formato inválido`);
    }
  }

  if (!validarSumaFactores(obj)) {
    errores.push("Suma factores 8-19 debe ser <= 1");
  }

  return {
    valido: errores.length === 0,
    errores
  };
}

/* ============================================================
   VALIDACIONES PARA INFORMACIÓN EXTERNA
============================================================ */
export function validarFilaInfoExterna(obj) {
  const errores = [];

  if (!obj.ejercicio) errores.push("Ejercicio vacío");
  if (!obj.instrumento) errores.push("Instrumento vacío");

  if (!validarFecha(obj.fechaPago))
    errores.push("Fecha de pago inválida (DD-MM-AAAA)");

  if (!obj.origen) errores.push("Origen vacío");

  // Factor de actualización numérico (si viene)
  if (obj.factorActualizacion && isNaN(parseFloat(obj.factorActualizacion))) {
    errores.push("Factor de actualización inválido");
  }

  // Factores 8 al 37: numéricos (el formato exacto se puede relajar aquí)
  for (let i = 8; i <= 37; i++) {
    const key = `factor${i}`;
    if (obj[key] && isNaN(parseFloat(obj[key]))) {
      errores.push(`Factor ${i} debe ser numérico`);
    }
  }

  return {
    valido: errores.length === 0,
    errores
  };
}

/* ============================================================
   VALIDADOR GENÉRICO (por compatibilidad)
============================================================ */
export function validarFila(obj) {
  if (esCalificacion(obj)) {
    return validarFilaCalificacion(obj);
  }

  if (esInfoExterna(obj)) {
    return validarFilaInfoExterna(obj);
  }

  return {
    valido: false,
    errores: ["No se pudo determinar el tipo de registro (calificación / info externa)"]
  };
}
