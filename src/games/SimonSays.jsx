import React, { useState, useCallback } from "react";
import "./SimonSays.css";

const COLORS = ["red", "blue", "green", "yellow"];

export default function SimonSays() {
  const [sequence, setSequence] = useState([]);
  const [userSequence, setUserSequence] = useState([]);
  const [isDisplaying, setIsDisplaying] = useState(false);
  const [activeColor, setActiveColor] = useState(null);
  const [gameState, setGameState] = useState("idle"); // idle, playing, gameover

  const startNewRound = useCallback(async (currentSequence) => {
    const nextColor = COLORS[Math.floor(Math.random() * COLORS.length)];
    const newSequence = [...currentSequence, nextColor];
    setSequence(newSequence);
    setUserSequence([]);

    setIsDisplaying(true);
    for (const color of newSequence) {
      setActiveColor(color);
      await new Promise((r) => setTimeout(r, 600));
      setActiveColor(null);
      await new Promise((r) => setTimeout(r, 200));
    }
    setIsDisplaying(false);
  }, []);

  const handleColorClick = (color) => {
    if (isDisplaying || gameState !== "playing") return;

    const newUserSequence = [...userSequence, color];
    setUserSequence(newUserSequence);

    if (color !== sequence[userSequence.length]) {
      setGameState("gameover");
      return;
    }

    if (newUserSequence.length === sequence.length) {
      setTimeout(() => startNewRound(sequence), 1000);
    }
  };

  const startGame = () => {
    setGameState("playing");
    startNewRound([]);
  };

  return (
    <div className="simon-container">
      <div className="simon-header">
        <h2>Simon Says</h2>
        <div className="simon-score">Level: {sequence.length}</div>
      </div>

      <div className="simon-board">
        {COLORS.map((color) => (
          <div
            key={color}
            className={`simon-pad ${color} ${activeColor === color ? "active" : ""}`}
            onClick={() => handleColorClick(color)}
          />
        ))}
        <div className="simon-center">
          {gameState !== "playing" ? (
            <button onClick={startGame}>
              {gameState === "idle" ? "Start" : "Restart"}
            </button>
          ) : (
            <span>{isDisplaying ? "Watch" : "Go!"}</span>
          )}
        </div>
      </div>

      {gameState === "gameover" && (
        <div className="simon-msg">
          Game Over! You reached Level {sequence.length}
        </div>
      )}
    </div>
  );
}
