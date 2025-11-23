// Datos de ejemplo
export const mockData = {
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
  
  // Simular delay de API
  const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
  
  export const api = {
    getOverallSentiment: async () => {
      await delay(800);
      return { data: mockData.overall };
    },
    
    getSentimentByOperator: async () => {
      await delay(600);
      return { data: mockData.byOperator };
    },
    
    getIssuesByOperator: async () => {
      await delay(700);
      return { data: mockData.issues };
    },
    
    getWordCloud: async () => {
      await delay(500);
      return { data: mockData.wordcloud };
    }
  };