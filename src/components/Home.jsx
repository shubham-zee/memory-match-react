import React from "react";
import { Link } from "react-router-dom";
import "./Home.css";
import HeroScrollImage from "./HeroScrollImage";

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
      "Test your reflexes! Click as fast as you can when the screen turns green.",
    icon: "⚡",
    path: "/reaction-timer",
  },
  {
    id: "emoji-whack",
    title: "Emoji Whack",
    description:
      "A classic whack-a-mole game. How many hamsters can you catch?",
    icon: "🐹",
    path: "/emoji-whack",
  },
  {
    id: "simon-says",
    title: "Simon Says",
    description:
      "Follow the pattern of colors and sounds. How long can you keep up?",
    icon: "🔴",
    path: "/simon-says",
  },
  {
    id: "space-dodge",
    title: "Space Dodge 3D",
    description:
      "Navigate your ship through a dangerous asteroid field in 3D space.",
    icon: "🚀",
    path: "/space-dodge",
  },
  {
    id: "dice-roller",
    title: "Ludo 3D",
    description:
      "Roll the 3D dice and race your pieces to the center in this classic board game.",
    icon: "🎲",
    path: "/dice-roller",
  },
  {
    id: "racing-3d",
    title: "Turbo Racer 3D",
    description:
      "High-speed 3D racing action. Dodge traffic and set a new high score!",
    icon: "🏎️",
    path: "/racing-3d",
  },
];

export default function Home() {
  return (
    <>
      <HeroScrollImage />
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
    </>
  );
}
