import React, { useMemo, useState, useEffect } from "react";
import "./DiceRoller.css";

/** 15x15 classic board */
const BOARD_SIZE = 15;
const GOAL = [7, 7];

/** Build the standard 52-cell loop around the cross arms */
function buildRing() {
  const ring = [];
  // Left arm (row 6, 0-5)
  for (let c = 0; c <= 5; c++) ring.push([6, c]);
  // Top arm (col 6, 5-0)
  for (let r = 5; r >= 0; r--) ring.push([r, 6]);
  // Top bridge
  ring.push([0, 7]);
  // Top arm (col 8, 0-5)
  for (let r = 0; r <= 5; r++) ring.push([r, 8]);
  // Right arm (row 6, 9-14)
  for (let c = 9; c <= 14; c++) ring.push([6, c]);
  // Right bridge
  ring.push([7, 14]);
  // Right arm (row 8, 14-9)
  for (let c = 14; c >= 9; c--) ring.push([8, c]);
  // Bottom arm (col 8, 9-14)
  for (let r = 9; r <= 14; r++) ring.push([r, 8]);
  // Bottom bridge
  ring.push([14, 7]);
  // Bottom arm (col 6, 14-9)
  for (let r = 14; r >= 9; r--) ring.push([r, 6]);
  // Left arm (row 8, 5-0)
  for (let c = 5; c >= 0; c--) ring.push([8, c]);
  // Left bridge
  ring.push([7, 0]);
  return ring;
}

function getPath(ring, startIdx, homeRun) {
  const path = [];
  for (let i = 0; i < 51; i++) {
    path.push(ring[(startIdx + i) % 52]);
  }
  return [...path, ...homeRun, GOAL];
}

const RED_HOME_RUN = [
  [7, 1],
  [7, 2],
  [7, 3],
  [7, 4],
  [7, 5],
  [7, 6],
];
const BLUE_HOME_RUN = [
  [13, 7],
  [12, 7],
  [11, 7],
  [10, 7],
  [9, 7],
  [8, 7],
];

const RED_BASE_SLOTS = [
  [2, 2],
  [2, 4],
  [4, 2],
  [4, 4],
];
const BLUE_BASE_SLOTS = [
  [11, 11],
  [11, 13],
  [13, 11],
  [13, 13],
];

export default function LudoGame() {
  const ring = useMemo(buildRing, []);

  const RED_PATH = useMemo(() => getPath(ring, 1, RED_HOME_RUN), [ring]);
  const BLUE_PATH = useMemo(() => getPath(ring, 40, BLUE_HOME_RUN), [ring]);

  const [rolling, setRolling] = useState(false);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [result, setResult] = useState(1);
  const [turn, setTurn] = useState("red");
  const [pieces, setPieces] = useState({
    red: [-1, -1, -1, -1], // -1 = in base, 0..51 = ring index, 52 = GOAL
    blue: [-1, -1, -1, -1],
  });
  const [waitingForMove, setWaitingForMove] = useState(false);
  const [message, setMessage] = useState("Red's Turn! Roll the dice.");

  const checkWinner = (newPieces) => {
    const redDone = newPieces.red.every((p) => p === RED_PATH.length - 1);
    const blueDone = newPieces.blue.every((p) => p === BLUE_PATH.length - 1);
    if (redDone) return "Red";
    if (blueDone) return "Blue";
    return null;
  };

  const handlePieceClick = (player, index) => {
    if (!waitingForMove || turn !== player || rolling) return;

    const path = player === "red" ? RED_PATH : BLUE_PATH;
    const currentPos = pieces[player][index];

    let nextPos = currentPos;

    // From base -> start requires 6
    if (currentPos === -1) {
      if (result !== 6) return;
      nextPos = 0;
    } else {
      nextPos = currentPos + result;
      if (nextPos >= path.length) return;
    }

    const newPieces = {
      ...pieces,
      [player]: pieces[player].map((p, i) => (i === index ? nextPos : p)),
    };
    setPieces(newPieces);
    setWaitingForMove(false);

    const winner = checkWinner(newPieces);
    if (winner) {
      setMessage(`🎉 ${winner} Wins!`);
    } else {
      const next = turn === "red" ? "blue" : "red";
      setTurn(next);
      setMessage(`${next === "red" ? "Red" : "Blue"}'s Turn! Roll the dice.`);
    }
  };

  const rollDice = () => {
    if (rolling || waitingForMove) return;
    setRolling(true);

    const newResult = Math.floor(Math.random() * 6) + 1;
    const extraX = (Math.floor(Math.random() * 3) + 2) * 360;
    const extraY = (Math.floor(Math.random() * 3) + 2) * 360;

    const rotations = [
      { x: 0, y: 0 }, // 1
      { x: 0, y: 90 }, // 2
      { x: -90, y: 0 }, // 3
      { x: 90, y: 0 }, // 4
      { x: 0, y: -90 }, // 5
      { x: 0, y: 180 }, // 6
    ];

    const target = rotations[newResult - 1];
    setRotation({ x: extraX + target.x, y: extraY + target.y });

    setTimeout(() => {
      setRolling(false);
      setResult(newResult);

      const canMove = pieces[turn].some((p) => {
        if (p === -1) return newResult === 6; // bring out
        const path = turn === "red" ? RED_PATH : BLUE_PATH;
        if (p === path.length - 1) return false; // already at goal
        return p + newResult < path.length;
      });

      if (canMove) {
        setWaitingForMove(true);
        setMessage("Select a piece to move!");
      } else {
        setTimeout(() => {
          const next = turn === "red" ? "blue" : "red";
          setTurn(next);
          setMessage(`No moves! ${next === "red" ? "Red" : "Blue"}'s Turn.`);
        }, 600);
      }
    }, 900);
  };

  /** Visual board painter */
  const getCellType = (r, c) => {
    // 6x6 corner bases
    if (r < 6 && c < 6) return "base-red";
    if (r < 6 && c > 8) return "base-green";
    if (r > 8 && c < 6) return "base-blue";
    if (r > 8 && c > 8) return "base-yellow";

    // Surrounding border of the bases (neighbors to the 6x6 yards)
    const isBorder =
      ((r === 6 || r === 8) && (c <= 6 || c >= 8)) ||
      ((c === 6 || c === 8) && (r <= 6 || r >= 8));
    if (isBorder) return "border-black";

    // center 3x3
    if (r >= 6 && r <= 8 && c >= 6 && c <= 8) {
      if (r === 7 && c === 7) return "home-goal";
      return "home-area";
    }

    // Home runs
    if (r === 7 && c >= 1 && c <= 6) return "track-red";
    if (r === 7 && c >= 8 && c <= 13) return "track-yellow";
    if (c === 7 && r >= 1 && r <= 6) return "track-green";
    if (c === 7 && r >= 8 && r <= 13) return "track-blue";

    // Starting squares
    if (r === 6 && c === 1) return "start-red";
    if (r === 1 && c === 8) return "start-green";
    if (r === 8 && c === 13) return "start-yellow";
    if (r === 13 && c === 6) return "start-blue";

    // Rest of the track
    const isTrack = (r >= 6 && r <= 8) || (c >= 6 && c <= 8);
    if (isTrack) {
      return "track";
    }

    // white background grid
    return "blank";
  };

  return (
    <div className="ludo-container">
      <div className="ludo-header">
        <h2>Ludo 3D</h2>
        <div className={`status-msg ${turn}`}>{message}</div>
      </div>

      <div className="ludo-game-area">
        <div className="ludo-board">
          {Array.from({ length: BOARD_SIZE * BOARD_SIZE }).map((_, i) => {
            const r = Math.floor(i / BOARD_SIZE);
            const c = i % BOARD_SIZE;
            const type = getCellType(r, c);
            return <div key={i} className={`cell ${type}`} />;
          })}

          {/* Center 4-color star (3×3) */}
          <div
            className="center-star"
            style={{ gridRow: "7 / span 3", gridColumn: "7 / span 3" }}
          />

          {/* Yards (inner white squares with 4 dots) */}
          <div
            className="yard yard-red"
            style={{ gridRow: "2 / span 4", gridColumn: "2 / span 4" }}
          >
            <span className="stud red" />
            <span className="stud red" />
            <span className="stud red" />
            <span className="stud red" />
          </div>
          <div
            className="yard yard-green"
            style={{ gridRow: "2 / span 4", gridColumn: "11 / span 4" }}
          >
            <span className="stud green" />
            <span className="stud green" />
            <span className="stud green" />
            <span className="stud green" />
          </div>
          <div
            className="yard yard-blue"
            style={{ gridRow: "11 / span 4", gridColumn: "2 / span 4" }}
          >
            <span className="stud blue" />
            <span className="stud blue" />
            <span className="stud blue" />
            <span className="stud blue" />
          </div>
          <div
            className="yard yard-yellow"
            style={{ gridRow: "11 / span 4", gridColumn: "11 / span 4" }}
          >
            <span className="stud yellow" />
            <span className="stud yellow" />
            <span className="stud yellow" />
            <span className="stud yellow" />
          </div>

          {/* Red pieces */}
          {pieces.red.map((pos, i) => {
            let coord;
            if (pos === -1) coord = RED_BASE_SLOTS[i];
            else coord = pos === RED_PATH.length - 1 ? GOAL : RED_PATH[pos];
            const [r, c] = coord;
            return (
              <div
                key={`r-${i}`}
                className={`piece red ${waitingForMove && turn === "red" ? "can-move" : ""}`}
                style={{ gridRow: r + 1, gridColumn: c + 1 }}
                onClick={() => handlePieceClick("red", i)}
              />
            );
          })}

          {/* Blue pieces */}
          {pieces.blue.map((pos, i) => {
            let coord;
            if (pos === -1) coord = BLUE_BASE_SLOTS[i];
            else coord = pos === BLUE_PATH.length - 1 ? GOAL : BLUE_PATH[pos];
            const [r, c] = coord;
            return (
              <div
                key={`b-${i}`}
                className={`piece blue ${waitingForMove && turn === "blue" ? "can-move" : ""}`}
                style={{ gridRow: r + 1, gridColumn: c + 1 }}
                onClick={() => handlePieceClick("blue", i)}
              />
            );
          })}
        </div>

        {/* Dice */}
        <div className="dice-section">
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
          <button
            className={`roll-btn ${turn}`}
            onClick={rollDice}
            disabled={rolling || waitingForMove}
          >
            {rolling ? "..." : `ROLL (${result})`}
          </button>
        </div>
      </div>
    </div>
  );
}
