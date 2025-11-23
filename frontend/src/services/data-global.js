import { useEffect, useState } from "react";

function ResumenGlobal() {
  const [resumen, setResumen] = useState(null);

  useEffect(() => {
    fetch("http://localhost:5000/api/resumen-global")
      .then((res) => res.json())
      .then((json) => setResumen(json))
      .catch((err) => console.error("Error:", err));
  }, []);

  if (!resumen) return <p>Cargando resumen...</p>;

  return (
    <div>
      <h2>Resumen Global</h2>

      <p>
        <strong>Calificación promedio:</strong> {resumen.calificacion_promedio}
      </p>

      <h3>Problemas detectados</h3>
      <ul>
        {resumen.problemas_detectados.map((p, i) => (
          <li key={i}>{p}</li>
        ))}
      </ul>

      <h3>Resumen Ejecutivo</h3>
      <p>{resumen.resumen_ejecutivo}</p>
    </div>
  );
}

export default ResumenGlobal;
