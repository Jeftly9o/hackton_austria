// src/pages/AnalisisSatisfaccion.jsx
import React, { useState, useEffect } from 'react';
import { 
  getIssuesByOperator, 
  getOverallSentiment, 
  getComments,
  getIssuesByCategory,
  getSentimentTrend
} from "../services/api";

const AnalisisSatisfaccion = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [
          issuesByOperator,
          overallSentiment,
          comments,
          issuesByCategory,
          sentimentTrend
        ] = await Promise.all([
          getIssuesByOperator(),
          getOverallSentiment(),
          getComments(),
          getIssuesByCategory(),
          getSentimentTrend()
        ]);

        setData({
          issuesByOperator,
          overallSentiment,
          comments,
          issuesByCategory,
          sentimentTrend
        });
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div className="loading">Cargando datos de análisis...</div>;

  return (
    <div className="analisis-satisfaccion">
      <h2>Análisis de Satisfacción</h2>
      
      <div className="stats-grid">
        <div className="stat-card">
          <h3>Sentimiento General</h3>
          <p>Positivo: {data.overallSentiment.positive}%</p>
          <p>Negativo: {data.overallSentiment.negative}%</p>
          <p>Neutral: {data.overallSentiment.neutral}%</p>
        </div>

        <div className="stat-card">
          <h3>Problemas por Operador</h3>
          {Object.entries(data.issuesByOperator).map(([operator, count]) => (
            <p key={operator}>{operator}: {count}</p>
          ))}
        </div>

        <div className="stat-card">
          <h3>Problemas por Categoría</h3>
          {Object.entries(data.issuesByCategory).map(([category, count]) => (
            <p key={category}>{category}: {count}</p>
          ))}
        </div>
      </div>

      <div className="comments-section">
        <h3>Comentarios Recientes</h3>
        {data.comments.slice(0, 5).map(comment => (
          <div key={comment.id} className={`comment ${comment.sentiment}`}>
            <p>{comment.text}</p>
            <span>Operador: {comment.operator} | Sentimiento: {comment.sentiment}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AnalisisSatisfaccion;