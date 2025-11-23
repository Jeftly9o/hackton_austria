import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Line, LineChart } from 'recharts';

const ComplaintsChart = ({ data }) => {
  const chartData = data?.operators?.map(operator => ({
    name: operator.name,
    Quejas: operator.complaints,
    'Tasa Resolución (%)': operator.resolutionRate
  })) || [];

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis yAxisId="left" />
        <YAxis yAxisId="right" orientation="right" />
        <Tooltip />
        <Legend />
        <Bar yAxisId="left" dataKey="Quejas" fill="#FFA726" name="Número de Quejas" />
        <Line yAxisId="right" type="monotone" dataKey="Tasa Resolución (%)" stroke="#1976D2" name="Tasa Resolución %" strokeWidth={2} />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default ComplaintsChart;
