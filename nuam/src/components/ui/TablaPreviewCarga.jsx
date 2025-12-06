export default function TablaPreviewCarga({ filas }) {
  return (
    <table border="1" cellPadding="4" style={{ marginTop: "20px" }}>
      <thead>
        <tr>
          <th>RUT</th>
          <th>Nombre</th>
          <th>Monto</th>
          <th>Fecha</th>
          <th>Tipo</th>
          <th>Mercado</th>
          <th>Acción</th>
        </tr>
      </thead>

      <tbody>
        {filas.map((f, idx) => (
          <tr key={idx}>
            <td>{f.rut}</td>
            <td>{f.nombre}</td>
            <td>{f.monto}</td>
            <td>{f.fecha}</td>
            <td>{f.tipoSociedad}</td>
            <td>{f.mercado}</td>
            <td>{f.accion}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
