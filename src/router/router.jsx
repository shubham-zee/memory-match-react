import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import MemoryMatch from "../games/memoryMatch";
import Home from "../components/Home";
import ReactionTimer from "../games/ReactionTimer";
import EmojiWhack from "../games/EmojiWhack";
import SimonSays from "../games/SimonSays";
import SpaceDodge from "../games/SpaceDodge";
import DiceRoller from "../games/DiceRoller";
import Racing3D from "../games/Racing3D";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "memory-match",
        element: <MemoryMatch />,
      },
      {
        path: "reaction-timer",
        element: <ReactionTimer />,
      },
      {
        path: "emoji-whack",
        element: <EmojiWhack />,
      },
      {
        path: "simon-says",
        element: <SimonSays />,
      },
      {
        path: "space-dodge",
        element: <SpaceDodge />,
      },
      {
        path: "dice-roller",
        element: <DiceRoller />,
      },
      {
        path: "racing-3d",
        element: <Racing3D />,
      },
      {
        path: "about",
        element: (
          <div style={{ textAlign: "center", marginTop: "50px" }}>
            <h1>About Us</h1>
            <p>We build fun and interactive games with React!</p>
          </div>
        ),
      },
      {
        path: "contact",
        element: (
          <div style={{ textAlign: "center", marginTop: "50px" }}>
            <h1>Contact Us</h1>
            <p>Get in touch at contact@gamehub.com</p>
          </div>
        ),
      },
    ],
  },
]);

export default router;
