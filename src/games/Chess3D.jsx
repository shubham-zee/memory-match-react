import React, { useState } from "react";
import "./Chess3D.css";

const INITIAL_BOARD = [
  ["♜", "♞", "♝", "♛", "♚", "♝", "♞", "♜"],
  ["♟", "♙", "♟", "♟", "♟", "♟", "♟", "♟"],
  Array(8).fill(null),
  Array(8).fill(null),
  Array(8).fill(null),
  Array(8).fill(null),
  ["♙", "♙", "♙", "♙", "♙", "♙", "♙", "♙"],
  ["♖", "♘", "♗", "♕", "♔", "♗", "♘", "♖"],
];

export default function Chess3D() {
  const [board, setBoard] = useState(INITIAL_BOARD);
  const [selected, setSelected] = useState(null); // {r, c}
  const [turn, setTurn] = useState("white");

  const handleSquareClick = (r, c) => {
    const piece = board[r][c];

    // Select a piece
    if (piece && !selected) {
      // Basic turn check: White pieces are ♖♘♗♕♔♙, Black are ♜♞♝♛♚♟
      const isWhite = "♖♘♗♕♔♙".includes(piece);
      if ((turn === "white" && isWhite) || (turn === "black" && !isWhite)) {
        setSelected({ r, c });
      }
      return;
    }

    // Move a piece
    if (selected) {
      if (selected.r === r && selected.c === c) {
        setSelected(null);
        return;
      }

      const newBoard = board.map((row) => [...row]);
      newBoard[r][c] = board[selected.r][selected.c];
      newBoard[selected.r][selected.c] = null;

      setBoard(newBoard);
      setSelected(null);
      setTurn(turn === "white" ? "black" : "white");
    }
  };

  return (
    <div className="chess-container">
      <div className="chess-info">
        <h2>3D Emoji Chess</h2>
        <div className={`turn-indicator ${turn}`}>
          {turn.toUpperCase()}'S TURN
        </div>
        <button
          className="reset-btn"
          onClick={() => {
            setBoard(INITIAL_BOARD);
            setSelected(null);
            setTurn("white");
          }}
        >
          Reset Game
        </button>
      </div>

      <div className="chess-scene">
        <div className="chess-board-3d">
          {board.map((row, r) =>
            row.map((piece, c) => {
              const isBlackSquare = (r + c) % 2 === 1;
              const isSelected = selected?.r === r && selected?.c === c;

              return (
                <div
                  key={`${r}-${c}`}
                  className={`square ${isBlackSquare ? "black-sq" : "white-sq"} ${isSelected ? "selected-sq" : ""}`}
                  onClick={() => handleSquareClick(r, c)}
                >
                  {piece && (
                    <div className="piece-3d">
                      <span className="piece-shadow"></span>
                      <span className="piece-content">{piece}</span>
                    </div>
                  )}
                </div>
              );
            }),
          )}
        </div>
      </div>

      <div className="chess-footer">
        <p>Click a piece to select, then click a square to move.</p>
      </div>
    </div>
  );
}
