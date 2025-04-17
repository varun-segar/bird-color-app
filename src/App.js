import React, { useState } from "react";
import { filterBirdsByColors } from "./utils/birdSorter";

function App() {
  const [colors, setColors] = useState(["#ff0000", "#00ff00", "#0000ff"]);
  const [enabled, setEnabled] = useState([true, false, false]);
  const [results, setResults] = useState([]);

  const handleSearch = async () => {
    const activeColors = colors.filter((_, i) => enabled[i]);
    if (activeColors.length === 0) {
      alert("Select at least one color.");
      return;
    }
    const birds = await filterBirdsByColors(activeColors);
    setResults(birds);
  };

  return (
    <div style={{ textAlign: "center", padding: "2em" }}>
      <h1>🕊️ Bird Color Finder</h1>

      {[0, 1, 2].map((i) => (
        <div key={i}>
          <label>
            <input
              type="checkbox"
              checked={enabled[i]}
              onChange={(e) => {
                const copy = [...enabled];
                copy[i] = e.target.checked;
                setEnabled(copy);
              }}
            />
            {["🎯 Primary", "🎨 Secondary", "✨ Accent"][i]} Color
          </label>
          <input
            type="color"
            value={colors[i]}
            onChange={(e) => {
              const copy = [...colors];
              copy[i] = e.target.value;
              setColors(copy);
            }}
          />
        </div>
      ))}

      <br />
      <button onClick={handleSearch}>Search</button>

      <div>
        {results.length === 0 ? (
          <p>No results yet</p>
        ) : (
          results.map((bird, i) => (
            <div key={i} style={{ margin: "1em", display: "flex", alignItems: "center", justifyContent: "center", gap: "1em" }}>
              <img src={bird.image} alt={bird.name} height="100" style={{ borderRadius: "8px" }} />
              <div>
                <h3>{bird.name}</h3>
                <p>
                  Matched: <span style={{ color: bird.matched_color }}>{bird.matched_color}</span>
                </p>
                <p>RGB Distance: {bird.distance}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default App;