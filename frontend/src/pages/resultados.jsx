import { useEffect, useState } from "react";
import { api } from "../pages/api.js";

export default function Dashboard() {
  const [overall, setOverall] = useState(null);

  useEffect(() => {
    async function fetchData() {
      const res = await api.getOverallSentiment();
      setOverall(res.data);
    }
    fetchData();
  }, []);

  return (
    <div>
      {overall ? (
        <>
          <h2>Sentimiento General</h2>
          <p>Positivo: {overall.positive}%</p>
          <p>Negativo: {overall.negative}%</p>
          <p>Neutral: {overall.neutral}%</p>
        </>
      ) : (
        <p>Cargando...</p>
      )}
    </div>
  );
}
