import useFetch from "../hooks/useFetch";
import {
  getOverallSentiment,
  getSentimentByOperator,
  getIssuesByOperator,
  getWordcloud
} from "../services/api";

export default function AnalisisSatisfaccion() {
  const sentimentOverall = useFetch(getOverallSentiment);
  const sentimentByOperator = useFetch(getSentimentByOperator);
  const issuesByOperator = useFetch(getIssuesByOperator);
  const wordcloud = useFetch(getWordcloud);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Análisis de Satisfacción</h1>

      {/* Aquí van las gráficas y componentes */}
    </div>
  );
}
