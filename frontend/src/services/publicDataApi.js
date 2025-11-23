// Datos mock para la nueva sección
export const publicDataMock = {
    sources: [
      { name: "Datos Oficiales Austria", type: "Público", reliability: "Alta" },
      { name: "Encuestas de Satisfacción", type: "Interno", reliability: "Media" },
      { name: "Datos de Red Social", type: "Público", reliability: "Baja" },
      { name: "Reportes Internos", type: "Interno", reliability: "Alta" }
    ],
    delays: {
      operators: [
        { name: "Operador A", delays: 45, avgDelayMinutes: 15 },
        { name: "Operador B", delays: 32, avgDelayMinutes: 25 },
        { name: "Operador C", delays: 28, avgDelayMinutes: 8 },
        { name: "Operador D", delays: 51, avgDelayMinutes: 30 }
      ]
    },
    complaints: {
      operators: [
        { name: "Operador A", complaints: 12, resolutionRate: 85 },
        { name: "Operador B", complaints: 25, resolutionRate: 60 },
        { name: "Operador C", complaints: 8, resolutionRate: 92 },
        { name: "Operador D", complaints: 31, resolutionRate: 45 }
      ]
    },
    correlations: [
      { factor1: "Tiempo de Espera", factor2: "Satisfacción", correlation: -0.78 },
      { factor1: "Precio", factor2: "Quejas", correlation: 0.65 },
      { factor1: "Cobertura", factor2: "Recomendación", correlation: 0.82 }
    ],
    insights: [
      "📉 Los retrasos generan 3x más quejas que otros factores",
      "💰 Operadores con precios altos tienen 40% menos satisfacción",
      "🌐 La cobertura de red impacta directamente en las recomendaciones",
      "⏱️ Cada 10 min de espera reduce la satisfacción en 2 puntos"
    ],
    comparison: {
      metrics: {
        austria: { satisfaction: 72, delays: 15, coverage: 88, price: 65 },
        mexico: { satisfaction: 68, delays: 25, coverage: 75, price: 45 }
      },
      insights: [
        "Austria tiene mejor cobertura pero precios más altos",
        "México muestra más retrasos pero mejor relación precio-calidad",
        "La satisfacción es similar a pesar de las diferencias estructurales"
      ]
    }
  };
  
  const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
  
  export const publicDataApi = {
    getPublicData: async () => {
      await delay(600);
      return { data: publicDataMock.sources };
    },
    
    getInternalData: async () => {
      await delay(700);
      return { 
        data: {
          delays: publicDataMock.delays,
          complaints: publicDataMock.complaints
        }
      };
    },
    
    getCorrelations: async () => {
      await delay(500);
      return { data: publicDataMock.correlations };
    },
    
    getInsights: async () => {
      await delay(400);
      return { data: publicDataMock.insights };
    },
    
    getComparison: async () => {
      await delay(800);
      return { data: publicDataMock.comparison };
    }
  };
  