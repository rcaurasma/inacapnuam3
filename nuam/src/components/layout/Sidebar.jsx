import { Link } from "react-router-dom";

export default function Sidebar() {
  return (
    <div className="sidebar">
      <h3>Calificaciones Tributarias</h3>

      <ul>
        <li><Link to="/">Menú principal</Link></li>
        <li><Link to="/ingreso">Ingresar Calificación</Link></li>
        <li><Link to="/listado">Listado</Link></li>
        <li><Link to="/carga-monto">Carga por Monto</Link></li>
        <li><Link to="/carga-factor">Carga por Factor</Link></li>
      </ul>
    </div>
  );
}
