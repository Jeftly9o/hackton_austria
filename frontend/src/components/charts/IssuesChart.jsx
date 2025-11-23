import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const IssuesChart = ({ data }) => {
  const chartData = data?.issues?.map(issue => ({
    name: issue.name,
    Frecuencia: issue.count
  })) || [];

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart 
        data={chartData} 
        layout="vertical"
        margin={{ top: 20, right: 30, left: 100, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis type="number" />
        <YAxis type="category" dataKey="name" width={80} />
        <Tooltip />
        <Legend />
        <Bar dataKey="Frecuencia" fill="#8884d8" name="Frecuencia" />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default IssuesChart;