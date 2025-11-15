// src/App.js
import React, { useState } from "react";
import RaceVisualizer from "./RaceVisualizer";   // FIXED IMPORT PATH

function App() {
  const [year, setYear] = useState(2023);        // use real race year
  const [gp, setGp] = useState("Miami");
  const [strategyData, setStrategyData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchStrategy = async () => {
    setLoading(true);
    setError(null);
    setStrategyData(null);

    try {
      const response = await fetch(
        `http://localhost:5001/strategy?year=${year}&gp=${gp}`
      );

      const data = await response.json();
      console.log("API response:", data);

      if (!response.ok) {
        setError(data.error || "API error");
        return;
      }

      // Store ONLY the strategy array (what your visualizer expects)
      if (!data.strategy || data.strategy.length === 0) {
        setError("No strategy data available.");
        return;
      }

      setStrategyData(data.strategy);

    } catch (err) {
      console.error("Error fetching strategy:", err);
      setError("Failed to fetch strategy data");
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

      {/* Only show graph if strategy exists */}
      {strategyData && (
        <RaceVisualizer strategy={strategyData} />
      )}
    </div>
  );
}

export default App;
