import { api } from '../../services/api';
import Sidebar from './Sidebar.css';

export default function Sidebar() {
  return (
    <nav className="sidebar">
      <ul>
        <li><Link to="/Home">Inicio</Link></li>
        <li><Link to="/">Análisis de Satisfacción</Link></li>
        <li><Link to="/">Datos Públicos + Internos</Link></li>
        {/* Agrega más links según tus APIs */}
      </ul>
    </nav>
  );
}
