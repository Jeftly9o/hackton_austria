import React from 'react';

const InsightsBox = ({ insights, title = "📊 Insights Clave" }) => {
  return (
    <div className="insights-box">
      <h3>{title}</h3>
      <div className="insights-list">
        {insights?.map((insight, index) => (
          <div key={index} className="insight-item">
            <span className="insight-bullet">💡</span>
            <span className="insight-text">{insight}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default InsightsBox;
