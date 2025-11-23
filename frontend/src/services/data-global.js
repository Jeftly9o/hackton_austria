import React, { useState, useEffect } from "react";
import {
  BarChart3,
  MessageSquare,
  AlertTriangle,
  CheckCircle,
  Search,
  FileText,
  Activity,
} from "lucide-react";

export default function EmailDashboard() {
  const [individualData, setIndividualData] = useState([]);
  const [globalData, setGlobalData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("");

  const mockIndividual = [];

  const mockGlobal = {};

  useEffect(() => {
    const fetchData = async () => {
      try {
        const resIndividual = await fetch(
          "http://127.0.0.1:5000/api/analisis-individual"
        );
        const resGlobal = await fetch(
          "http://127.0.0.1:5000/api/resumen-global"
        );

        if (!resIndividual.ok || !resGlobal.ok)
          throw new Error("Error conectando a la API");

        const dataInd = await resIndividual.json();
        const dataGlob = await resGlobal.json();

        setIndividualData(dataInd);
        setGlobalData(dataGlob);
        setError(null);
      } catch (err) {
        console.warn(
          "No se pudo conectar al backend (es normal en este entorno de demo). Usando datos de prueba."
        );
        setIndividualData(mockIndividual);
        setGlobalData(mockGlobal);
        setError(
          "Modo Demo: Backend no detectado (mostrando datos de ejemplo)"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);
const mockData = {
    overall: { 
      positive: 65, 
      negative: 20, 
      neutral: 15 
    },
    byOperator: {
      operators: [
        { name: "Operador A", positive: 70, negative: 15, neutral: 15 },
        { name: "Operador B", positive: 60, negative: 25, neutral: 15 },
        { name: "Operador C", positive: 75, negative: 10, neutral: 15 },
        { name: "Operador D", positive: 55, negative: 30, neutral: 15 }
      ]
    },
    issues: {
      issues: [
        { name: "Tiempo de espera", count: 45 },
        { name: "Atención al cliente", count: 32 },
        { name: "Problemas técnicos", count: 28 },
        { name: "Facturación", count: 15 },
        { name: "Cobertura de señal", count: 12 }
      ]
    },
    wordcloud: {
      words: [
        { text: "rápido", value: 100 },
        { text: "buen servicio", value: 85 },
        { text: "espera", value: 75 },
        { text: "resolución", value: 60 },
        { text: "amable", value: 55 },
        { text: "eficiente", value: 50 },
        { text: "problema", value: 45 },
        { text: "solución", value: 40 },
        { text: "cliente", value: 35 },
        { text: "tiempo", value: 30 }
      ]
    }
  };
