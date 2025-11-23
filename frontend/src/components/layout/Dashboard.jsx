import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import SentimentChart from '../charts/SentimentChart';
import IssuesChart from '../charts/IssuesChart';
import WordCloud from '../charts/WordCloud';
import Loading from '../common/Loading';
//import ErrorMessage from '../common/ErrorMessage';
import '../../styles/Dashboard.css';

const Dashboard = () => {
  const [data, setData] = useState({
    overall: null,
    byOperator: null,
    issues: null,
    wordcloud: null
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        const [
          overallRes, 
          byOperatorRes, 
          issuesRes, 
          wordcloudRes
        ] = await Promise.all([
          api.getOverallSentiment(),
          api.getSentimentByOperator(),
          api.getIssuesByOperator(),
          api.getWordCloud()
        ]);

        setData({
          overall: overallRes.data,
          byOperator: byOperatorRes.data,
          issues: issuesRes.data,
          wordcloud: wordcloudRes.data
        });

      } catch (err) {
        setError('Error cargando los datos: ' + err.message);
        console.error('Error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <Loading />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>📊 Dashboard de Análisis de Satisfacción</h1>
        <p>Análisis en tiempo real de feedback de clientes</p>
      </header>

      <div className="charts-grid">
        {/* Resumen General */}
        <div className="chart-container summary-section">
          <h2>📈 Resumen General de Sentimiento</h2>
          <div className="summary-cards">
            <div className="summary-card positive">
              <h3>😊 Positivo</h3>
              <span className="value">{data.overall?.positive || 0}%</span>
            </div>
            <div className="summary-card negative">
              <h3>😠 Negativo</h3>
              <span className="value">{data.overall?.negative || 0}%</span>
            </div>
            <div className="summary-card neutral">
              <h3>😐 Neutral</h3>
              <span className="value">{data.overall?.neutral || 0}%</span>
            </div>
          </div>
        </div>

        {/* Gráfica de Sentimiento por Operador */}
        <div className="chart-container">
          <h2>👥 Sentimiento por Operador</h2>
          <SentimentChart data={data.byOperator} />
        </div>

        {/* Gráfica de Problemas Comunes */}
        <div className="chart-container">
          <h2>🔧 Problemas Más Comunes</h2>
          <IssuesChart data={data.issues} />
        </div>

        {/* Nube de Palabras */}
        <div className="chart-container">
          <h2>💬 Nube de Palabras - Feedback</h2>
          <WordCloud data={data.wordcloud} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;