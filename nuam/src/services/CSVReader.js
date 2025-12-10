export async function leerCSV(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = event => {
      try {
        const text = event.target.result;

        const lineas = text
          .split("\n")
          .map(l => l.trim())
          .filter(Boolean);

        const headers = lineas[0].split(";").map(h => h.trim());

        const registros = [];

        for (let i = 1; i < lineas.length; i++) {
          const valores = lineas[i].split(";").map(v => v.trim());
          const obj = {};

          headers.forEach((h, idx) => {
            obj[h] = valores[idx] ?? "";
          });

          registros.push(obj);
        }

        resolve(registros);
      } catch (err) {
        reject(err);
      }
    };

    reader.onerror = reject;
    reader.readAsText(file);
  });
}
