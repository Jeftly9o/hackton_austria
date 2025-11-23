import React from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

export default function DelaysChart({ data }) {
  if (!data) return null;
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <XAxis dataKey="operator" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="delay" fill="#8884d8" />
      </BarChart>
    </ResponsiveContainer>
  );
}
