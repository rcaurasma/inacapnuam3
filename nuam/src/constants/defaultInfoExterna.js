//
// DEFAULT_INFO_EXTERNA
// Plantilla base para un registro del mantenedor de Información Externa
//
export const DEFAULT_INFO_EXTERNA = {
  ejercicio: "",
  instrumento: "",
  fechaPago: "",
  descripcionDividendo: "",
  secuenciaEvento: "",
  acogidoIsfut: "",
  origen: "",
  mercado: "",
  factorActualizacion: "",
  ...Object.fromEntries([...Array(30)].map((_, i) => [`factor${i + 8}`, ""]))
};

//
// FACTOR_HEADERS
// Nombres oficiales para los factores 8 al 37 según homologación
//
export const FACTOR_HEADERS = [
  "Ajuste capital",            // factor8
  "Renta devengada",           // factor9
  "Renta percibida",           // factor10
  "Corrección monetaria",      // factor11
  "Gasto rechazado",           // factor12
  "Crédito total",             // factor13
  "Crédito parcial",           // factor14
  "Capital propio",            // factor15
  "Valor libro",               // factor16
  "Utilidad repartida",        // factor17
  "Diferencia tributaria",     // factor18
  "Revalorización",            // factor19
  "Retención",                 // factor20
  "Base exenta",               // factor21
  "Interés",                   // factor22
  "Ganancia",                  // factor23
  "Pérdida",                   // factor24
  "Rebaja",                    // factor25
  "Renta afecta",              // factor26
  "Renta no afecta",           // factor27
  "Monto reajustado",          // factor28
  "Renta presunta",            // factor29
  "Crédito por impuesto",      // factor30
  "Crédito externo",           // factor31
  "IDPC base",                 // factor32
  "IDPC crédito",              // factor33
  "Factor adicional",          // factor34
  "Reserva",                   // factor35
  "Impto sustitutivo",         // factor36
  "Diferencia cambio"          // factor37
];
