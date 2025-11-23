import React from "react";
import useFetch from "../hooks/useFetch";
import { api } from "../services/api";
import Loading from "../components/common/Loading";

import DelaysChart from "../components/charts/DelaysChart";
import ComplaintsChart from "../components/charts/ComplaintsChart";
import CorrelationsChart from "../components/charts/CorrelationsChart";

export default function PublicInternalData() {
  const publicData = useFetch(api.getPublicData);
  const internalData = useFetch(api.getInternalData);
  const correlations = useFetch(api.getCorrelations);
  const insights = useFetch(api.getInsights);

  if (!publicData || !internalData) return <Loading />;

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>Datos Públicos + Internos</h1>
        <p>Análisis de datos públicos y internos de los operadores</p>
      </header>

      {/* Fuentes */}
      <section className="chart-container">
        <h2>Fuentes usadas</h2>
        <ul>
          {publicData?.data?.sources?.map((src, idx) => (
            <li key={idx}>{src}</li>
          ))}
        </ul>
      </section>

      {/* Gráficas */}
      <div className="charts-grid">
        <div className="chart-container">
          <h2>Retrasos por Operador</h2>
          <DelaysChart data={publicData?.data?.delays} />
        </div>

        <div className="chart-container">
          <h2>Quejas por Operador</h2>
          <ComplaintsChart data={internalData?.data?.complaints} />
        </div>

        <div className="chart-container">
          <h2>Correlaciones</h2>
          <CorrelationsChart data={correlations?.data} />
        </div>
      </div>

      {/* Insights */}
      <section className="chart-container">
        <h2>Insights</h2>
        <ul>
          {insights?.data?.map((insight, idx) => (
            <li key={idx}>{insight}</li>
          ))}
        </ul>
      </section>
    </div>
  );
}
