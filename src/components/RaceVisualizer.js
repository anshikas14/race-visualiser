// src/RaceVisualizer.js
import React from "react";
import "./RaceVisualizer.css";

const lapCount = 57;
const lapWidth = 20; // width in pixels per lap

const compoundColors = {
  SOFT: "#ff9999",
  MEDIUM: "#ffcc00",
  HARD: "#9999ff",
  INTERMEDIATE: "#00cc66",
  WET: "#3399ff",
};

function RaceVisualizer({ strategy }) {
  if (!strategy || strategy.length === 0) {
    return <div>No strategy data available.</div>;
  }

  // Get unique drivers
  const drivers = [...new Set(strategy.map((s) => s.Driver))];

  // Build laps per driver including empty laps
  const driverLaps = drivers.map((driver) => {
    const driverStints = strategy.filter((s) => s.Driver === driver);
    const laps = Array.from({ length: lapCount }, (_, i) => {
      const lapNum = i + 1;
      const stint = driverStints.find((s) => s.LapNumber === lapNum);
      return stint || null;
    });
    return { driver, laps };
  });

  return (
    <div className="visualizer-container">
      {/* Lap numbers */}
      <div className="lap-numbers">
        {Array.from({ length: lapCount }, (_, i) => (
          <span key={i} className="lap-number" style={{ left: i * lapWidth }}>
            {i + 1}
          </span>
        ))}
      </div>

      {/* Driver rows */}
      <div className="drivers">
        {driverLaps.map(({ driver, laps }) => (
          <div className="driver-row" key={driver}>
            <div className="driver-name">{driver}</div>
            <div className="stints-row" style={{ width: lapCount * lapWidth }}>
              {laps.map((lap, i) =>
                lap ? (
                  <div
                    key={i}
                    className="stint-bar-absolute"
                    style={{
                      left: i * lapWidth,
                      width: lapWidth,
                      backgroundColor: compoundColors[lap.Compound.toUpperCase()],
                    }}
                  />
                ) : null
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="legend">
        {Object.entries(compoundColors).map(([compound, color]) => (
          <div key={compound} className="legend-item">
            <span className="legend-color" style={{ backgroundColor: color }} />
            {compound.charAt(0) + compound.slice(1).toLowerCase()}
          </div>
        ))}
      </div>
    </div>
  );
}

export default RaceVisualizer;
