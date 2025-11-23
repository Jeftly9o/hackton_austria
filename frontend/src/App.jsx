import React from "react";
import EmailDashboard from "./components/layout/EmailDashboard";
import Dashboard from "./pages/resultados";
import "./App.css";

function App() {
  return (
    <div className="App">
      <EmailDashboard />
      <Dashboard />
    </div>
  );
}

export default App;
