import IngresoCalificacion from "../../views/IngresoCalificacion";

export default function ModalEditarCalificacion({ registro, onClose, onSaved }) {
  if (!registro) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content modal-xl" style={{ maxHeight: "90vh", overflowY: "auto" }}>
        <button
          className="icon-btn"
          onClick={onClose}
          style={{ float: "right" }}
          title="Cerrar"
        >
          ✖
        </button>

        <IngresoCalificacion
          onCreated={() => {
            onSaved();
            onClose();
          }}
          // 👇 simulamos navegación en modo editar
          key={registro.id}
        />
      </div>
    </div>
  );
}
