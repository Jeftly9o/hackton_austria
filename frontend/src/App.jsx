import React, { useState } from "react";
import AnalysisDashboard from "./pages/AnalisisSatisfaccion";
import PublicDataDashboard from "./pages/PublicDataDashboard";
import "./App.css";

function App() {
  const [currentView, setCurrentView] = useState("analysis");

  return (
    <div className="App">
      <nav>
        <button onClick={() => setCurrentView("analysis")}>Analysis</button>
        <button onClick={() => setCurrentView("public")}>Public Data</button>
      </nav>
      
      {currentView === "analysis" && <AnalysisDashboard />}
      {currentView === "public" && <PublicDataDashboard />}
    </div>
  );
}

export default App;
