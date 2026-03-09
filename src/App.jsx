import { Outlet } from "react-router-dom";
import Navbar from "./components/Navbar";
import HeroScrollImage from "./components/HeroScrollImage";

export default function App() {
  return (
    <div className="app">
      <Navbar />
      <main>
        <Outlet />
      </main>
    </div>
  );
}
