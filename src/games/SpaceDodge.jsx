import React, { useState, useEffect, useCallback, useRef } from "react";
import "./SpaceDodge.css";

const SPAWN_INTERVAL = 1200;
const GAME_SPEED = 8;

export default function SpaceDodge() {
  const [playerPos, setPlayerPos] = useState(0); // -1, 0, 1
  const [obstacles, setObstacles] = useState([]);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [highScore, setHighScore] = useState(
    () => Number(localStorage.getItem("spaceDodge_highScore")) || 0,
  );

  const gameLoopRef = useRef();
  const lastSpawnRef = useRef(0);

  const moveLeft = () => !gameOver && setPlayerPos((p) => Math.max(-1, p - 1));
  const moveRight = () => !gameOver && setPlayerPos((p) => Math.min(1, p + 1));

  const resetGame = () => {
    setPlayerPos(0);
    setObstacles([]);
    setScore(0);
    setGameOver(false);
    lastSpawnRef.current = performance.now();
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "ArrowLeft") moveLeft();
      if (e.key === "ArrowRight") moveRight();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [gameOver]);

  const updateGame = useCallback(
    (time) => {
      if (gameOver) return;

      if (time - lastSpawnRef.current > SPAWN_INTERVAL) {
        const lane = Math.floor(Math.random() * 3) - 1;
        setObstacles((prev) => [
          ...prev,
          { id: Math.random(), lane, z: -1500 },
        ]);
        lastSpawnRef.current = time;
      }

      setObstacles((prev) => {
        const next = prev
          .map((obs) => ({ ...obs, z: obs.z + GAME_SPEED }))
          .filter((obs) => obs.z < 200);

        const collision = next.find(
          (obs) => obs.z > -60 && obs.z < 40 && obs.lane === playerPos,
        );

        if (collision) {
          setGameOver(true);
          return prev;
        }

        if (next.length < prev.length) {
          setScore((s) => {
            const newScore = s + 1;
            if (newScore > highScore) {
              setHighScore(newScore);
              localStorage.setItem("spaceDodge_highScore", newScore);
            }
            return newScore;
          });
        }
        return next;
      });

      gameLoopRef.current = requestAnimationFrame(updateGame);
    },
    [gameOver, playerPos, highScore],
  );

  useEffect(() => {
    if (!gameOver) {
      gameLoopRef.current = requestAnimationFrame(updateGame);
    }
    return () => cancelAnimationFrame(gameLoopRef.current);
  }, [updateGame, gameOver]);

  return (
    <div className="space-dodge-container">
      <div className="game-overlay">
        <div className="stats-bar">
          <span>Score: {score}</span>
          <span>High Score: {highScore}</span>
        </div>
        {gameOver && (
          <div className="modal">
            <h2>MISSION FAILED</h2>
            <p>Final Score: {score}</p>
            <button className="restart-btn" onClick={resetGame}>
              RELAUNCH
            </button>
          </div>
        )}
      </div>

      <div className="space-scene">
        <div className="stars-layer"></div>
        <div className="world">
          <div
            className="player-ship"
            style={{
              transform: `translateX(calc(${playerPos} * var(--lane-width)))`,
            }}
          >
            <div className="cube ship-cube">
              <div className="face f-front">🚀</div>
              <div className="face f-back"></div>
              <div className="face f-left"></div>
              <div className="face f-right"></div>
              <div className="face f-top"></div>
              <div className="face f-bottom"></div>
            </div>
          </div>

          {obstacles.map((obs) => (
            <div
              key={obs.id}
              className="obstacle-entity"
              style={{
                transform: `translateX(calc(${obs.lane} * var(--lane-width))) translateZ(${obs.z}px)`,
              }}
            >
              <div className="cube obs-cube">
                <div className="face f-front">☄️</div>
                <div className="face f-back"></div>
                <div className="face f-left"></div>
                <div className="face f-right"></div>
                <div className="face f-top"></div>
                <div className="face f-bottom"></div>
              </div>
            </div>
          ))}
          <div className="grid-floor"></div>
        </div>
      </div>

      <div className="touch-zones">
        <div className="zone" onClick={moveLeft}></div>
        <div className="zone" onClick={moveRight}></div>
      </div>
    </div>
  );
}
