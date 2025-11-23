import React from 'react';

const PublicDataDashboard = () => {
  // Datos de ejemplo - reemplaza con tus datos reales
  const data = {
    correlations: [
      { factor1: "Factor A", factor2: "Factor B", correlation: 0.75 },
      { factor1: "Factor C", factor2: "Factor D", correlation: -0.42 }
    ],
    insights: ["Insight 1", "Insight 2", "Insight 3"]
  };

  return (
    <div className="public-data-dashboard">
      <h2>Public Data Dashboard</h2>
      
      {/* Correlation Factors */}
      <div className="data-section correlation-section">
        <h3>Correlation Factors</h3>
        <div className="correlation-list">
          {data.correlations.map((corr, index) => (
            <div key={index} className="correlation-item">
              <span className="correlation-factor">
                {corr.factor1} vs {corr.factor2}
              </span>
              <span className={`correlation-value ${corr.correlation > 0 ? 'positive' : 'negative'}`}>
                {corr.correlation > 0 ? '+' : ''}{corr.correlation}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Insights Section */}
      <div className="data-section insights-section">
        <h3>Insights</h3>
        <div className="insights-list">
          {data.insights.map((insight, index) => (
            <div key={index} className="insight-item">
              {insight}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PublicDataDashboard;