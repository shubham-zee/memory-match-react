import React, { useState } from "react";
import "./DiceRoller.css";

export default function DiceRoller() {
  const [rolling, setRolling] = useState(false);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [result, setResult] = useState(1);

  const rollDice = () => {
    if (rolling) return;
    setRolling(true);

    const newResult = Math.floor(Math.random() * 6) + 1;
    const extraX = Math.floor(Math.random() * 4) * 90 + 720;
    const extraY = Math.floor(Math.random() * 4) * 90 + 720;

    const rotations = [
      { x: 0, y: 0 },
      { x: 0, y: 180 },
      { x: 0, y: -90 },
      { x: 0, y: 90 },
      { x: -90, y: 0 },
      { x: 90, y: 0 },
    ];

    const target = rotations[newResult - 1];
    setRotation({ x: extraX + target.x, y: extraY + target.y });

    setTimeout(() => {
      setRolling(false);
      setResult(newResult);
    }, 1000);
  };

  return (
    <div className="dice-container">
      <h2>3D Dice Roller</h2>
      <div className="dice-scene">
        <div
          className={`dice ${rolling ? "is-rolling" : ""}`}
          style={{
            transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
          }}
          onClick={rollDice}
        >
          <div className="dice-face d-front">1</div>
          <div className="dice-face d-back">6</div>
          <div className="dice-face d-left">2</div>
          <div className="dice-face d-right">5</div>
          <div className="dice-face d-top">3</div>
          <div className="dice-face d-bottom">4</div>
        </div>
      </div>
      <div className="dice-result">
        {rolling ? "Rolling..." : `Result: ${result}`}
      </div>
      <button className="roll-btn" onClick={rollDice} disabled={rolling}>
        ROLL DICE
      </button>
    </div>
  );
}
