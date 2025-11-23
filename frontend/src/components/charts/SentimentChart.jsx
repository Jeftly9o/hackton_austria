import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const SentimentChart = ({ data }) => {
  const chartData = data?.operators?.map(operator => ({
    name: operator.name,
    Positivo: operator.positive,
    Negativo: operator.negative,
    Neutral: operator.neutral
  })) || [];

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart 
        data={chartData} 
        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="Positivo" fill="#4CAF50" name="Positivo 😊" />
        <Bar dataKey="Negativo" fill="#f44336" name="Negativo 😠" />
        <Bar dataKey="Neutral" fill="#FFC107" name="Neutral 😐" />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default SentimentChart;