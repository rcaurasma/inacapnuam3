export default function ModalConfirmacion({ mensaje, onConfirm, onCancel }) {
  return (
    <div style={{ background: "#fff", padding: 20, border: "1px solid #ccc" }}>
      <h3>Confirmación</h3>

      <p>{mensaje || "¿Estás seguro?"}</p>

      <button onClick={onConfirm} style={{ marginRight: 10 }}>
        Confirmar
      </button>
      <button onClick={onCancel}>Cancelar</button>
    </div>
  );
}
