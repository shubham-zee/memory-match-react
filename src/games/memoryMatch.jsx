import React, { useState } from "react";
import GameBoard from "../components/GameBoard";
import "./styles/memoryMatch.css";

export default function MemoryMatch() {
  const [stats, setStats] = useState({
    moves: 0,
    elapsed: 0,
    matched: 0,
    totalPairs: 8,
  });

  return (
    <div className="app">
      <header className="header">
        <div className="title">🧠 Memory Match (React)</div>
        <div className="controls">
          <div className="stat">⏱️ {stats.elapsed ?? 0}s</div>
          <div className="stat">🔁 {stats.moves ?? 0} moves</div>
          <div className="stat">
            ✅ {stats.matched ?? 0}/{stats.totalPairs ?? 8} pairs
          </div>
        </div>
      </header>

      <GameBoard pairs={8} onStats={setStats} />

      <div className="footer">
        Built with React + Vite. Try different difficulties above.
      </div>
    </div>
  );
}
