export function validarSumaFactores(obj) {
  let suma = 0;
  for (let i = 8; i <= 16; i++) {
    suma += Number(obj[`factor${i}`] || 0);
  }
  return suma <= 1;
}
export function validarFormatoFactor(x) {
  if (x === "" || x === null || x === undefined) return true;
  return /^0(\.\d{1,8})?$|^1(\.0{1,8})?$/.test(x);
}
export function validarFecha(fecha) {
  return /^\d{2}-\d{2}-\d{4}$/.test(fecha) || /^\d{4}-\d{2}-\d{2}$/.test(fecha);
}
export function validarTipoSociedad(x) {
  return x === "A" || x === "C";
}
export function validarMercado(x) {
  return /^[A-Za-z]{1,3}$/.test(x);
}

export function validarSecuenciaMayorA(valor) {
  return Number(valor || 0) > 10000;
}
