import React from "react";
import { Link } from "react-router-dom";
import "./Home.css";

const games = [
  {
    id: "memory-match",
    title: "Memory Match",
    description: "Test your memory by matching pairs of emojis!",
    icon: "🧠",
    path: "/memory-match",
  },
  {
    id: "reaction-timer",
    title: "Reaction Timer",
    description:
      "How fast are your reflexes? Click when the screen turns green!",
    icon: "⚡",
    path: "/reaction-timer",
  },
  {
    id: "emoji-whack",
    title: "Emoji Whack",
    description: "Whack the hamster as fast as you can!",
    icon: "🐹",
    path: "/emoji-whack",
  },
  {
    id: "simon-says",
    title: "Simon Says",
    description: "Repeat the sequence of colors!",
    icon: "🔴",
    path: "/simon-says",
  },
  {
    id: "space-dodge",
    title: "Space Dodge 3D",
    description: "Avoid obstacles in this 3D space runner!",
    icon: "🚀",
    path: "/space-dodge",
  },
  {
    id: "dice-roller",
    title: "3D Dice Roller",
    description: "A simple 3D dice for your board games!",
    icon: "🎲",
    path: "/dice-roller",
  },
  {
    id: "racing-3d",
    title: "Turbo Racer 3D",
    description: "Dodge traffic at high speeds in this neon 3D racer!",
    icon: "🏎️",
    path: "/racing-3d",
  },
];

export default function Home() {
  return (
    <div className="home-container">
      <h1>Choose a Game</h1>
      <div className="game-grid">
        {games.map((game) => (
          <Link to={game.path} key={game.id} className="game-card">
            <div className="game-icon">{game.icon}</div>
            <h3>{game.title}</h3>
            <p>{game.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
