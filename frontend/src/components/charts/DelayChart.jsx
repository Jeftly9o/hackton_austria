import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const DelayChart = ({ data }) => {
  const chartData = data?.operators?.map(operator => ({
    name: operator.name,
    Retrasos: operator.delays,
    'Minutos Promedio': operator.avgDelayMinutes
  })) || [];

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="Retrasos" fill="#FF6B6B" name="Número de Retrasos" />
        <Bar dataKey="Minutos Promedio" fill="#4ECDC4" name="Minutos Promedio" />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default DelayChart;
