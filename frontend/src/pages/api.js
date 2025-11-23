const API_URL = "http://10.171.152.32:5000/";

export const api = {
  getOverallSentiment: async () => {
    const res = await fetch(`${API_URL}/analisis-individual`);
    const data = await res.json();

    // Calcular porcentaje de sentimientos
    const total = data.length;
    const positive = data.filter((d) => d.sentimiento === "Positivo").length;
    const negative = data.filter((d) => d.sentimiento === "Negativo").length;
    const neutral = data.filter((d) => d.sentimiento === "Neutral").length;

    return {
      data: {
        positive: Math.round((positive / total) * 100),
        negative: Math.round((negative / total) * 100),
        neutral: Math.round((neutral / total) * 100),
      },
    };
  },

  getSentimentByOperator: async () => {
    // si tu CSV tiene columna Operador, aquí lo agrupas...
    // por ahora devolvemos estructura vacía
    return { data: { operators: [] } };
  },

  getIssuesByOperator: async () => {
    const res = await fetch(`${API_URL}/resumen-global`);
    const data = await res.json();

    const conteo = {};

    data.problemas_detectados.forEach((p) => {
      conteo[p] = (conteo[p] || 0) + 1;
    });

    return {
      data: {
        issues: Object.entries(conteo).map(([name, count]) => ({
          name,
          count,
        })),
      },
    };
  },

  getWordCloud: async () => {
    const res = await fetch(`${API_URL}/resumen-global`);
    const data = await res.json();

    return {
      data: {
        words: data.problemas_detectados.map((p) => ({
          text: p,
          value: Math.floor(Math.random() * 80) + 20,
        })),
      },
    };
  },
};
