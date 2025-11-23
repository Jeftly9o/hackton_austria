import { useEffect, useState } from "react";

function AnalisisIndividual() {
  const [data, setData] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    fetch("http://localhost:5000/api/analisis-individual")
      .then((res) => res.json())
      .then((json) => {
        setData(json);
        setCargando(false);
      })
      .catch((err) => console.error("Error:", err));
  }, []);

  if (cargando) return <p>Cargando...</p>;

  return (
    <div>
      <h2>Análisis Individual</h2>
      {data.map((item, index) => (
        <div key={index}>
          <p>
            <strong>Asunto:</strong> {item.asunto}
          </p>
          <p>
            <strong>Contenido:</strong> {item.contenido}
          </p>
          <p>
            <strong>Sentimiento:</strong> {item.sentimiento}
          </p>
          <p>
            <strong>Problemas:</strong> {item.problemas}
          </p>
          <p>
            <strong>Calificación:</strong> {item.calificacion}
          </p>
          <hr />
        </div>
      ))}
    </div>
  );
}

export default AnalisisIndividual;
