// src/App.js
import React, { useState } from "react";
import RaceVisualizer from "./components/RaceVisualizer";

function App() {
  const [year, setYear] = useState(2025);
  const [gp, setGp] = useState("Miami");
  const [strategyData, setStrategyData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchStrategy = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `http://localhost:5001/strategy?year=${year}&gp=${gp}`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setStrategyData(data);

      if (data.length === 0) {
        setError("No strategy data available.");
      }
    } catch (err) {
      console.error("Error fetching strategy:", err);
      setError("Failed to fetch strategy data");
      setStrategyData([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App">
      <h1>F1 Race Strategy Visualizer</h1>

      <div>
        <label>
          Year:
          <input
            type="number"
            value={year}
            onChange={(e) => setYear(e.target.value)}
          />
        </label>

        <label>
          GP:
          <input
            type="text"
            value={gp}
            onChange={(e) => setGp(e.target.value)}
          />
        </label>

        <button onClick={fetchStrategy}>Fetch Strategy</button>
      </div>

      {loading && <p>Loading strategy...</p>}

      {error && <p style={{ color: "red" }}>{error}</p>}

      {strategyData.length > 0 && (
        <RaceVisualizer strategyData={strategyData} />
      )}

      {strategyData.length === 0 && !loading && !error && (
        <p>No strategy data available.</p>
      )}
    </div>
  );
}

export default App;
