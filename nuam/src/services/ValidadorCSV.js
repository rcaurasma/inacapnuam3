import {
  validarFecha,
  validarTipoSociedad,
  validarMercado,
  validarFormatoFactor,
  validarSumaFactores
} from "./Validadores";

export function validarFila(obj) {
  const errores = [];

  if (!obj.rut) errores.push("RUT vacío");
  if (!obj.nombre) errores.push("Nombre vacío");

  if (isNaN(parseFloat(obj.monto))) errores.push("Monto inválido");

  if (!validarFecha(obj.fecha)) errores.push("Fecha inválida");

  if (!validarTipoSociedad(obj.tipoSociedad)) errores.push("TipoSociedad debe ser A o C");

  if (!validarMercado(obj.mercado)) errores.push("Mercado debe ser 1 a 3 letras");

  // validar factores
  for (let i = 8; i <= 19; i++) {
    const key = `factor${i}`;
    if (obj[key] && !validarFormatoFactor(obj[key])) {
      errores.push(`Factor ${i} con formato inválido`);
    }
  }

  if (!validarSumaFactores(obj)) errores.push("Suma factores 8-19 debe ser <= 1");

  return {
    valido: errores.length === 0,
    errores
  };
}
