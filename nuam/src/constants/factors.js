export const factorNames = [
  "Crédito por IDPC",
  "Utilidades Distribuidas",
  "Retiros Efectivos",
  "Intereses Gravados",
  "Rentas Percibidas",
  "Ganancias Capital",
  "Factor 14",
  "Factor 15",
  "Factor 16",
  "Factor 17",
  "Factor 18",
  "Factor 19",
  "Factor 20",
  "Factor 21",
  "Factor 22",
  "Factor 23",
  "Factor 24",
  "Factor 25",
  "Factor 26",
  "Factor 27",
  "Factor 28",
  "Factor 29",
  "Factor 30",
  "Factor 31",
  "Factor 32",
  "Factor 33",
  "Factor 34",
  "Factor 35",
  "Factor 36",
  "Factor 37",
];

export function makeDefaultFactors() {
  return factorNames.map((label, idx) => {
    const id = idx + 8;
    return {
      id,
      label: `Factor ${id} - ${label}`,
      original: 0,
      calculado: 0,
      editable: true,
      estado: "Original",
    };
  });
}

export function makeDefaultMontos() {
  return factorNames.map((label, idx) => ({ id: idx + 8, label: `Monto ${idx + 8} - ${label}`, valor: 0 }));
}
