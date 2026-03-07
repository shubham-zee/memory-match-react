import React, { useState, useEffect } from "react";
import "./EmojiWhack.css";

const GRID_SIZE = 9;
const GAME_DURATION = 20;

export default function EmojiWhack() {
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [activeHole, setActiveHole] = useState(null);
  const [gameState, setGameState] = useState("idle"); // idle, playing, finished

  const startGame = () => {
    setScore(0);
    setTimeLeft(GAME_DURATION);
    setGameState("playing");
  };

  const handleWhack = (index) => {
    if (gameState === "playing" && index === activeHole) {
      setScore((s) => s + 1);
      setActiveHole(null);
    }
  };

  useEffect(() => {
    if (gameState !== "playing") return;

    if (timeLeft === 0) {
      setGameState("finished");
      setActiveHole(null);
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((t) => t - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [gameState, timeLeft]);

  useEffect(() => {
    if (gameState !== "playing") return;

    const interval = setInterval(
      () => {
        const nextHole = Math.floor(Math.random() * GRID_SIZE);
        setActiveHole(nextHole);
      },
      Math.max(500, 1000 - score * 25),
    );

    return () => clearInterval(interval);
  }, [gameState, score]);

  return (
    <div className="whack-container">
      <div className="whack-header">
        <div className="whack-stat">Score: {score}</div>
        <div className="whack-stat">Time: {timeLeft}s</div>
        {gameState !== "playing" && (
          <button className="whack-btn" onClick={startGame}>
            {gameState === "idle" ? "Start Game" : "Play Again"}
          </button>
        )}
      </div>
      <div className="whack-grid">
        {Array.from({ length: GRID_SIZE }).map((_, i) => (
          <div key={i} className="whack-hole" onClick={() => handleWhack(i)}>
            <div className={`whack-mole ${i === activeHole ? "up" : ""}`}>
              🐹
            </div>
          </div>
        ))}
      </div>
      {gameState === "finished" && (
        <div className="whack-overlay">Game Over! Final Score: {score}</div>
      )}
    </div>
  );
}
