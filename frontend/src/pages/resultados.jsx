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

// --- COMPONENTE PRINCIPAL ---
export default function EmailDashboard() {
  const [individualData, setIndividualData] = useState([]);
  const [globalData, setGlobalData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("");

  // Datos simulados por si la API no está conectada (Para visualización inmediata)
  const mockIndividual = [
    {
      asunto: "Retraso en línea 1",
      contenido: "El metro tardó 20 min en llegar...",
      sentimiento: "Negativo",
      problemas: "Retrasos",
      calificacion: 2,
    },
    {
      asunto: "Felicitaciones",
      contenido: "Buen servicio hoy, muy limpio.",
      sentimiento: "Positivo",
      problemas: "Ninguno",
      calificacion: 9,
    },
    {
      asunto: "Calor insoportable",
      contenido: "No sirve el aire acondicionado.",
      sentimiento: "Negativo",
      problemas: "Averías",
      calificacion: 3,
    },
    {
      asunto: "Duda horario",
      contenido: "¿A qué hora cierra la estación?",
      sentimiento: "Neutral",
      problemas: "Otros",
      calificacion: 6,
    },
    {
      asunto: "Mucha gente",
      contenido: "Imposible entrar al vagón.",
      sentimiento: "Negativo",
      problemas: "Saturación",
      calificacion: 1,
    },
  ];

  const mockGlobal = {
    problemas_detectados: ["Retrasos", "Averías", "Saturación", "Otros"],
    calificacion_promedio: 4.2,
    resumen_ejecutivo:
      "El análisis indica una tendencia negativa relacionada principalmente con la frecuencia de paso y el confort térmico. Los usuarios reportan retrasos constantes en horas pico. Se recomienda revisión de infraestructura.",
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Intentamos conectar con tu API Flask local
        // Nota: Asegúrate de que tu servidor Flask esté corriendo en el puerto 5000
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

  // Función para determinar color según sentimiento
  const getSentimentColor = (sentimiento) => {
    const s = sentimiento.toLowerCase();
    if (s.includes("positivo"))
      return "bg-green-100 text-green-800 border-green-200";
    if (s.includes("negativo")) return "bg-red-100 text-red-800 border-red-200";
    return "bg-gray-100 text-gray-800 border-gray-200";
  };

  // Filtrado de tabla
  const filteredData = individualData.filter(
    (item) =>
      item.asunto.toLowerCase().includes(filter.toLowerCase()) ||
      item.problemas.toLowerCase().includes(filter.toLowerCase())
  );

  if (loading)
    return (
      <div className="flex items-center justify-center h-screen bg-slate-50">
        <div className="text-center">
          <Activity className="w-10 h-10 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-slate-500">Analizando correos con IA...</p>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-slate-50 p-6 font-sans text-slate-900">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <header className="flex justify-between items-center bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <div>
            <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
              <BarChart3 className="w-8 h-8 text-blue-600" />
              Panel de Inteligencia de Correos
            </h1>
            <p className="text-slate-500 mt-1">
              Análisis automatizado con Llama 3.1
            </p>
          </div>
          {error && (
            <span className="px-4 py-2 bg-amber-50 text-amber-700 text-sm rounded-full border border-amber-200 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" />
              {error}
            </span>
          )}
        </header>

        {/* Sección de Resumen Global */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Tarjeta de Promedio */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
            <h3 className="text-sm font-medium text-slate-500 uppercase tracking-wider mb-4">
              Calificación Promedio
            </h3>
            <div className="flex items-end gap-4">
              <span className="text-5xl font-bold text-slate-800">
                {globalData?.calificacion_promedio?.toFixed(1) || "0.0"}
              </span>
              <span className="text-xl text-slate-400 mb-1">/ 10</span>
            </div>
            <div className="w-full bg-slate-100 h-2 rounded-full mt-4 overflow-hidden">
              <div
                className={`h-full rounded-full ${
                  globalData?.calificacion_promedio < 5
                    ? "bg-red-500"
                    : "bg-green-500"
                }`}
                style={{
                  width: `${(globalData?.calificacion_promedio || 0) * 10}%`,
                }}
              ></div>
            </div>
          </div>

          {/* Tarjeta de Resumen Ejecutivo */}
          <div className="md:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-slate-100 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <FileText className="w-24 h-24 text-blue-600" />
            </div>
            <h3 className="text-sm font-medium text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-blue-500" />
              Resumen Ejecutivo (IA)
            </h3>
            <p className="text-slate-700 leading-relaxed whitespace-pre-line text-sm md:text-base">
              {globalData?.resumen_ejecutivo || "No hay resumen disponible."}
            </p>
          </div>
        </div>

        {/* Tabla de Análisis Individual */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h2 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-slate-500" />
              Detalle de Correos ({individualData.length})
            </h2>

            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Buscar por asunto o problema..."
                className="pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-64"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50 text-xs uppercase font-semibold text-slate-500">
                <tr>
                  <th className="px-6 py-4">Asunto</th>
                  <th className="px-6 py-4">Sentimiento</th>
                  <th className="px-6 py-4">Problema Detectado</th>
                  <th className="px-6 py-4 text-center">Calif.</th>
                  <th className="px-6 py-4">Extracto Contenido</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredData.length > 0 ? (
                  filteredData.map((item, index) => (
                    <tr
                      key={index}
                      className="hover:bg-slate-50 transition-colors"
                    >
                      <td className="px-6 py-4 font-medium text-slate-800">
                        {item.asunto}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium border ${getSentimentColor(
                            item.sentimiento
                          )}`}
                        >
                          {item.sentimiento}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="flex items-center gap-2">
                          {item.problemas !== "Ninguno" && (
                            <AlertTriangle className="w-4 h-4 text-amber-500" />
                          )}
                          {item.problemas}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center font-bold">
                        <span
                          className={
                            item.calificacion < 5
                              ? "text-red-600"
                              : "text-green-600"
                          }
                        >
                          {item.calificacion}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-slate-400 italic max-w-xs truncate">
                        {item.contenido}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="5"
                      className="px-6 py-12 text-center text-slate-400"
                    >
                      No se encontraron resultados para tu búsqueda.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
