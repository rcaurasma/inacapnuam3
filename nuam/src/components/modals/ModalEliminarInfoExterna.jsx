import { eliminarInfoExterna } from "../../services/InformacionExternaService";

export default function ModalEliminarInfoExterna({ id, onClose, onSuccess }) {
  async function eliminar() {
    await eliminarInfoExterna(id);
    onSuccess();
    onClose();
  }

  return (
    <div className="modal">
      <div className="modal-content">
        <h3>¿Seguro que deseas eliminar este registro?</h3>

        <button onClick={eliminar} style={{ color: "red" }}>
          Sí, eliminar
        </button>
        <button onClick={onClose}>Cancelar</button>
      </div>
    </div>
  );
}
