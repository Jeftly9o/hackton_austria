import React from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip, Legend } from 'recharts';

const ComparisonRadarChart = ({ data }) => {
  if (!data) return <div>Cargando comparación...</div>;

  const radarData = [
    { subject: 'Satisfacción', Austria: data.austria.satisfaction, México: data.mexico.satisfaction, fullMark: 100 },
    { subject: 'Cobertura', Austria: data.austria.coverage, México: data.mexico.coverage, fullMark: 100 },
    { subject: 'Precio', Austria: data.austria.price, México: data.mexico.price, fullMark: 100 },
    { subject: 'Retrasos', Austria: 100 - data.austria.delays, México: 100 - data.mexico.delays, fullMark: 100 },
  ];

  return (
    <ResponsiveContainer width="100%" height={300}>
      <RadarChart data={radarData}>
        <PolarGrid />
        <PolarAngleAxis dataKey="subject" />
        <PolarRadiusAxis angle={30} domain={[0, 100]} />
        <Radar name="Austria" dataKey="Austria" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
        <Radar name="México" dataKey="México" stroke="#82ca9d" fill="#82ca9d" fillOpacity={0.6} />
        <Tooltip />
        <Legend />
      </RadarChart>
    </ResponsiveContainer>
  );
};

export default ComparisonRadarChart;
