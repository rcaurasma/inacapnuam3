export default function ModalVerCalificacion({ calificacion, onClose }) {
  if (!calificacion) return null;

  function imprimir() {
    window.print();
  }

  return (
    <div className="modal-overlay">
      <div className="modal-content modal-lg">

        {/* HEADER */}
        <div className="modal-header">
          <h2>Detalle de Calificación</h2>
          <button className="icon-btn" onClick={onClose} title="Cerrar">
            ✖
          </button>
        </div>

        {/* BODY */}
        <div className="modal-body">
          <section>
            <h4>Datos básicos</h4>
            <p><strong>Ejercicio:</strong> {calificacion.anioComercial}</p>
            <p><strong>Instrumento:</strong> {calificacion.instrumento}</p>
            <p><strong>Mercado:</strong> {calificacion.mercado}</p>
            <p><strong>Origen:</strong> {calificacion.origen}</p>
            <p><strong>Fuente:</strong> {calificacion.fuente || "-"}</p>
            <p><strong>Descripción:</strong> {calificacion.descripcion}</p>
            <p><strong>Secuencia evento:</strong> {calificacion.secuenciaEvento}</p>
            <p><strong>Fecha pago:</strong> {calificacion.fechaPago}</p>
            <p><strong>Acogido ISFUT:</strong> {calificacion.acogidoIsfut ? "Sí" : "No"}</p>
            <p><strong>Valor histórico:</strong> ${calificacion.valorHistorico}</p>
          </section>

          <hr />

          <section>
            <h4>Factores</h4>

            {calificacion.factors?.length > 0 ? (
              <div className="table-wrapper">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Factor</th>
                      <th>Calculado</th>
                      <th>Original</th>
                    </tr>
                  </thead>
                  <tbody>
                    {calificacion.factors.map(f => (
                      <tr key={f.id}>
                        <td>{f.label || `Factor ${f.id}`}</td>
                        <td>{Number(f.calculado || 0).toFixed(6)}</td>
                        <td>{f.original ?? "-"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p>Sin factores.</p>
            )}
          </section>
        </div>

        {/* FOOTER */}
        <div className="modal-footer">
          <button className="btn" onClick={onClose}>
            Cerrar
          </button>
          <button className="btn primary" onClick={imprimir}>
            Imprimir / PDF
          </button>
        </div>
      </div>
    </div>
  );
}
