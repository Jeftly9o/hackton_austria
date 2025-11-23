import React from 'react';

const ErrorMessage = ({ message }) => (
  <div className="error-message">
    <h3>❌ Error al cargar el dashboard</h3>
    <p>{message}</p>
    <button onClick={() => window.location.reload()}>
      🔄 Reintentar
    </button>
  </div>
);

export default ErrorMessage;