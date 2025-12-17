// =======================================================
// Definición oficial de factores tributarios (DJ 1922 / 1949)
// Factores 8 al 37
// =======================================================

export const FACTOR_LABELS = {
  8: "Crédito por IDPC generados a contar del 01.01.2017",
  9: "Crédito por IDPC acumulados hasta el 31.12.2016",
  10: "Con derecho a crédito por pago de IDPC voluntario",
  11: "Sin derecho a crédito",
  12: "Rentas provenientes del registro RAP y Diferencia Inicial (Art. 14 TER A)",
  13: "Otras rentas percibidas sin prioridad en su orden de imputación",
  14: "Exceso de distribuciones desproporcionadas (N°9 Art.14 A)",
  15: "Utilidades afectadas con impuesto sustitutivo al FUT (ISFUT) Ley 20.780",
  16: "Rentas generadas hasta el 31.12.1983 y/o ISFUT Ley 21.210",
  17: "Rentas exentas de Impuesto Global Complementario (Art.11 Ley 18.401) afectas a Impuesto Adicional",
  18: "Rentas exentas de Impuesto Global Complementario y/o Impuesto Adicional",
  19: "Ingresos no constitutivos de renta",

  // Segundo grupo (20–37)
  20: "No sujetos a restitución generados hasta el 31.12.2019 sin derecho",
  21: "No sujetos a restitución generados hasta el 31.12.2019 con derecho",
  22: "No sujetos a restitución generados a contar del 01.01.2020 sin derecho",
  23: "No sujetos a restitución generados a contar del 01.01.2020 con derecho",
  24: "Sujetos a restitución sin derecho",
  25: "Sujetos a restitución con derecho",
  26: "Sujetos a restitución sin derecho (segundo tramo)",
  27: "Sujetos a restitución con derecho (segundo tramo)",
  28: "Crédito IPE",
  29: "Asociados a rentas afectas sin derecho",
  30: "Asociados a rentas afectas con derecho",
  31: "Asociados a rentas exentas sin derecho",
  32: "Asociados a rentas exentas con derecho",
  33: "Crédito por IPE",

  // Factores sin glosa explícita en DJ (se pueden ajustar si se requiere)
  34: "Factor 34",
  35: "Factor 35",
  36: "Factor 36",
  37: "Factor 37",
};

// =======================================================
// Factores por defecto (8–37)
// =======================================================
export function makeDefaultFactors() {
  return Array.from({ length: 30 }, (_, i) => {
    const id = i + 8;

    return {
      id,
      label: `Factor ${id} - ${FACTOR_LABELS[id] || ""}`,
      original: 0,
      calculado: 0,
      editable: true,
      estado: "Original",
    };
  });
}

// =======================================================
// Montos por defecto (8–37)
// =======================================================
export function makeDefaultMontos() {
  return Array.from({ length: 30 }, (_, i) => {
    const id = i + 8;

    return {
      id,
      label: `Monto ${id} - ${FACTOR_LABELS[id] || ""}`,
      valor: 0,
    };
  });
}
