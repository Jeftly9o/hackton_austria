import { useEffect, useState } from "react";
import { api } from "../pages/api.js";

export default function Dashboard() {
  const [overall, setOverall] = useState(null);
  const [issues, setIssues] = useState(null);
  const [wordCloud, setWordCloud] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const [sentimentRes, issuesRes, wordCloudRes] = await Promise.all([
          api.getOverallSentiment(),
          api.getIssuesByOperator(),
          api.getWordCloud(),
        ]);

        setOverall(sentimentRes.data);
        setIssues(issuesRes.data);
        setWordCloud(wordCloudRes.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) {
    return <p>Cargando...</p>;
  }

  return (
    <div style={{ padding: "20px" }}>
      {overall && (
        <div style={{ marginBottom: "30px" }}>
          <h2>Sentimiento General</h2>
          <p>Positivo: {overall.positive}%</p>
          <p>Negativo: {overall.negative}%</p>
          <p>Neutral: {overall.neutral}%</p>
        </div>
      )}

      {issues && issues.issues && (
        <div style={{ marginBottom: "30px" }}>
          <h2>Problemas Detectados</h2>
          <ul>
            {issues.issues.map((issue, index) => (
              <li key={index}>
                {issue.name}: {issue.count} veces
              </li>
            ))}
          </ul>
        </div>
      )}

      {wordCloud && wordCloud.words && (
        <div>
          <h2>Nube de Palabras</h2>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
            {wordCloud.words.map((word, index) => (
              <span
                key={index}
                style={{
                  padding: "5px 10px",
                  backgroundColor: "#f0f0f0",
                  borderRadius: "15px",
                  fontSize: "14px",
                }}
              >
                {word.text}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
