export default function FormularioFactores({ form, handleChange }) {
  return (
    <div style={{ marginTop: "10px" }}>
      <h4>Factores (8 al 19)</h4>

      <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
        {[...Array(12)].map((_, idx) => {
          const n = idx + 8;
          return (
            <input
              key={n}
              name={`factor${n}`}
              placeholder={`Factor ${n}`}
              value={form[`factor${n}`] || ""}
              onChange={handleChange}
              style={{ width: "100px", padding: "4px" }}
            />
          );
        })}
      </div>
    </div>
  );
}
