import React, { useState, useRef } from "react";
import "./ReactionTimer.css";

export default function ReactionTimer() {
  const [status, setStatus] = useState("waiting"); // waiting, ready, test, result, early
  const [reactionTime, setReactionTime] = useState(null);
  const timerRef = useRef(null);
  const startTimeRef = useRef(null);

  const startTest = () => {
    setStatus("ready");
    setReactionTime(null);
    const delay = Math.floor(Math.random() * 3000) + 2000; // 2-5 seconds
    timerRef.current = setTimeout(() => {
      setStatus("test");
      startTimeRef.current = Date.now();
    }, delay);
  };

  const handleAreaClick = () => {
    if (status === "waiting" || status === "result" || status === "early") {
      startTest();
    } else if (status === "ready") {
      clearTimeout(timerRef.current);
      setStatus("early");
    } else if (status === "test") {
      const endTime = Date.now();
      setReactionTime(endTime - startTimeRef.current);
      setStatus("result");
    }
  };

  return (
    <div className="reaction-container">
      <div className={`reaction-area ${status}`} onClick={handleAreaClick}>
        {status === "waiting" && (
          <div className="message">
            <h2>Reaction Time Test</h2>
            <p>Click anywhere to start</p>
            <span className="icon">🖱️</span>
          </div>
        )}
        {status === "ready" && (
          <div className="message">
            <h2>Wait for Green...</h2>
            <span className="icon">🔴</span>
          </div>
        )}
        {status === "test" && (
          <div className="message">
            <h2>CLICK NOW!</h2>
            <span className="icon">🟢</span>
          </div>
        )}
        {(status === "result" || status === "early") && (
          <div className="message">
            <h2>{status === "early" ? "Too early!" : `${reactionTime} ms`}</h2>
            <p>Click to try again</p>
            <span className="icon">{status === "early" ? "⚠️" : "⚡"}</span>
          </div>
        )}
      </div>
    </div>
  );
}
