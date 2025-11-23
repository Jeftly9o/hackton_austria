import React from 'react';
import '../../styles/WordCloud.css';

const WordCloud = ({ data }) => {
  const words = data?.words || [];

  // Ordenar palabras por frecuencia (valor)
  const sortedWords = [...words].sort((a, b) => b.value - a.value);

  return (
    <div className="word-cloud-container">
      <div className="word-cloud">
        {sortedWords.map((word, index) => {
          // Tamaño basado en la frecuencia (14px a 60px)
          const size = Math.max(14, Math.min(60, word.value / 2));
          
          return (
            <span
              key={index}
              className="word-cloud-item"
              style={{
                fontSize: `${size}px`,
                color: getColorByIndex(index),
                opacity: 0.7 + (index * 0.03),
                transform: `rotate(${getRandomRotation()}deg)`,
                fontWeight: getFontWeight(size)
              }}
              title={`Frecuencia: ${word.value}`}
            >
              {word.text}
            </span>
          );
        })}
      </div>
    </div>
  );
};

// Función para colores basados en índice
const getColorByIndex = (index) => {
  const colors = [
    '#1f77b4', '#ff7f0e', '#2ca02c', '#d62728', '#9467bd',
    '#8c564b', '#e377c2', '#7f7f7f', '#bcbd22', '#17becf'
  ];
  return colors[index % colors.length];
};

// Rotación aleatoria para efecto visual
const getRandomRotation = () => {
  return Math.random() * 60 - 30; // Entre -30 y 30 grados
};

// Peso de fuente basado en tamaño
const getFontWeight = (size) => {
  if (size > 40) return 'bold';
  if (size > 25) return '600';
  return 'normal';
};

export default WordCloud;