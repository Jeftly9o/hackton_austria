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

  // src/services/api.js

// Simulamos datos para desarrollo
const mockIssuesData = {
    "Operador A": 45,
    "Operador B": 32,
    "Operador C": 28,
    "Operador D": 51,
    "Operador E": 19
  };
  
  const mockSentimentData = {
    positive: 65,
    negative: 20,
    neutral: 15
  };
  
  const mockCommentsData = [
    { id: 1, text: "Excelente servicio", sentiment: "positive", operator: "Operador A" },
    { id: 2, text: "Muy mala atención", sentiment: "negative", operator: "Operador B" },
    { id: 3, text: "Regular, podría mejorar", sentiment: "neutral", operator: "Operador C" }
  ];
  
  // Funciones de la API
  export const getIssuesByOperator = async () => {
    // Simulamos delay de API
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(mockIssuesData);
      }, 500);
    });
  };
  
  export const getOverallSentiment = async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(mockSentimentData);
      }, 500);
    });
  };
  
  export const getComments = async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(mockCommentsData);
      }, 500);
    });
  };
  
  export const getIssuesByCategory = async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          "Problemas Técnicos": 25,
          "Atención al Cliente": 40,
          "Facturación": 15,
          "Cobertura": 35
        });
      }, 500);
    });
  };
  
  export const getSentimentTrend = async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          { month: "Ene", positive: 60, negative: 25, neutral: 15 },
          { month: "Feb", positive: 62, negative: 23, neutral: 15 },
          { month: "Mar", positive: 65, negative: 20, neutral: 15 },
          { month: "Abr", positive: 63, negative: 22, neutral: 15 }
        ]);
      }, 500);
    });
  };