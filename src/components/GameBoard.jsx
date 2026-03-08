import React, { useEffect, useMemo, useState } from "react";
import Card from "./Card";
import { createDeck } from "../utils";

export default function GameBoard({ pairs = 8, onStats }) {
  const [deck, setDeck] = useState(() => createDeck(pairs));
  const [choiceOne, setChoiceOne] = useState(null);
  const [choiceTwo, setChoiceTwo] = useState(null);
  const [moves, setMoves] = useState(0);
  const [disabled, setDisabled] = useState(false);
  const [startTime, setStartTime] = useState(() => Date.now());
  const [elapsed, setElapsed] = useState(0);

  // Timer (good use of effect: sync with external time)
  useEffect(() => {
    const t = setInterval(
      () => setElapsed(Math.floor((Date.now() - startTime) / 1000)),
      250,
    );
    return () => clearInterval(t);
  }, [startTime]);

  // Stats & completion notification (also fine in an effect)
  const matchedCount = useMemo(
    () => deck.filter((c) => c.matched).length,
    [deck],
  );
  useEffect(() => {
    const stats = {
      moves,
      elapsed,
      matched: matchedCount / 2,
      totalPairs: pairs,
      complete: matchedCount === pairs * 2,
    };

    // Defer the callback to avoid synchronous cascading renders in the parent
    const timeoutId = setTimeout(() => {
      onStats?.(stats);
    }, 0);

    return () => clearTimeout(timeoutId);
  }, [moves, elapsed, matchedCount, pairs, onStats]);

  function handleChoice(card) {
    if (disabled) return;
    if (card.id === choiceOne?.id || card.id === choiceTwo?.id) return;

    // First selection
    if (!choiceOne) {
      setChoiceOne(card);
      return;
    }

    // Second selection: do the match logic here (event-driven)
    setChoiceTwo(card);
    setDisabled(true);

    const first = choiceOne; // capture before state updates
    const second = card;
    const isMatch = first.emoji === second.emoji;

    setMoves((m) => m + 1);

    setTimeout(
      () => {
        setDeck((prev) =>
          prev.map((c) =>
            c.emoji === first.emoji
              ? { ...c, matched: isMatch ? true : c.matched }
              : c,
          ),
        );
        // reset turn
        setChoiceOne(null);
        setChoiceTwo(null);
        setDisabled(false);
      },
      isMatch ? 450 : 800,
    );
  }

  function newGame(nextPairs = pairs) {
    setDeck(createDeck(nextPairs));
    setMoves(0);
    setChoiceOne(null);
    setChoiceTwo(null);
    setDisabled(false);
    setStartTime(Date.now());
    setElapsed(0);
  }

  return (
    <>
      <div
        className="controls"
        style={{
          marginTop: 16,
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: "8px",
        }}
      >
        <button className="btn primary" onClick={() => newGame(pairs)}>
          🔄 New Game
        </button>
        <button className="btn" onClick={() => newGame(6)}>
          Easy (6 pairs)
        </button>
        <button className="btn" onClick={() => newGame(8)}>
          Normal (8)
        </button>
        <button className="btn" onClick={() => newGame(10)}>
          Hard (10)
        </button>
      </div>

      <div
        className="board"
        style={{ gridTemplateColumns: `repeat(auto-fit, minmax(70px, 1fr))` }}
      >
        {deck.map((card) => {
          const isFlipped =
            card.id === choiceOne?.id ||
            card.id === choiceTwo?.id ||
            card.matched;

          return (
            <Card
              key={card.id}
              card={card}
              isFlipped={isFlipped}
              isMatched={card.matched}
              onClick={handleChoice}
              disabled={disabled}
            />
          );
        })}
      </div>

      <div className="footer">
        {matchedCount === pairs * 2 ? (
          <strong>
            🎉 Completed in {moves} moves, {elapsed}s!
          </strong>
        ) : (
          <span>Find all pairs. Good luck!</span>
        )}
      </div>
    </>
  );
}
