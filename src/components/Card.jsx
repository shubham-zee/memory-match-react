import React from "react";

export default function Card({
  card,
  isFlipped,
  isMatched,
  onClick,
  disabled,
}) {
  return (
    <div
      className={`card ${isFlipped ? "flipped" : ""} ${isMatched ? "matched" : ""}`}
      onClick={() => !disabled && !isMatched && onClick(card)}
      role="button"
      aria-label={isFlipped ? card.emoji : "Hidden card"}
      tabIndex={0}
      onKeyDown={(e) => {
        if ((e.key === "Enter" || e.key === " ") && !disabled && !isMatched)
          onClick(card);
      }}
    >
      <div className="card-inner">
        <div className="card-face card-front">🎴</div>
        <div className="card-face card-back">{card.emoji}</div>
      </div>
    </div>
  );
}
