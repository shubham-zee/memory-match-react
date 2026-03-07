import React, { useState, useEffect, useRef, Suspense } from "react";
import * as THREE from "three";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  Stars,
  Text,
  PerspectiveCamera,
  Environment,
  Float,
  useTexture,
} from "@react-three/drei";
import "./Racing3D.css";
import carImageUrl from "../../public/assets/carImage.png";

const LANES = [-1.5, 0, 1.5];
const INITIAL_SPEED = 0.02;

function PlayerCar({ laneIndex }) {
  const meshRef = useRef();
  const texture = useTexture(carImageUrl);
  const targetX = LANES[laneIndex];

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.position.x = THREE.MathUtils.lerp(
        meshRef.current.position.x,
        targetX,
        0.2,
      );
      meshRef.current.rotation.z = (meshRef.current.position.x - targetX) * 0.2;
    }
  });

  return (
    <group ref={meshRef} position={[0, 0.3, 5]}>
      <mesh castShadow>
        <boxGeometry args={[0.8, 0.4, 1.5]} />
        <meshStandardMaterial
          map={texture}
          color="white"
          metalness={0.6}
          roughness={0.4}
        />
      </mesh>
      <mesh position={[0, 0.3, -0.1]}>
        <boxGeometry args={[0.6, 0.3, 0.7]} />
        <meshStandardMaterial color="#33ccff" transparent opacity={0.6} />
      </mesh>
    </group>
  );
}

function TrafficCar({ position, color }) {
  const texture = useTexture(carImageUrl);
  return (
    <mesh position={position}>
      <boxGeometry args={[0.8, 0.5, 1.5]} />
      <meshStandardMaterial map={texture} color={color} />
    </mesh>
  );
}

function Road() {
  return (
    <group rotation={[-Math.PI / 2, 0, 0]}>
      <mesh receiveShadow>
        <planeGeometry args={[5, 100]} />
        <meshStandardMaterial color="#111" />
      </mesh>
      <mesh position={[0, 0, 0.01]}>
        <planeGeometry args={[0.1, 100]} />
        <meshStandardMaterial color="yellow" transparent opacity={0.8} />
      </mesh>
    </group>
  );
}

export default function Racing3D() {
  const [lane, setLane] = useState(1); // 0, 1, 2
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [traffic, setTraffic] = useState([]);
  const speedRef = useRef(INITIAL_SPEED);
  const frameCount = useRef(0);

  const resetGame = () => {
    setTraffic([]);
    setScore(0);
    setGameOver(false);
    setLane(1);
    speedRef.current = INITIAL_SPEED;
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "ArrowLeft") setLane((l) => Math.max(0, l - 1));
      if (e.key === "ArrowRight") setLane((l) => Math.min(2, l + 1));
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const GameLogic = () => {
    useFrame(() => {
      if (gameOver) return;

      frameCount.current++;

      // Spawn traffic
      if (frameCount.current % 60 === 0) {
        const randomLane = Math.floor(Math.random() * 3);
        const colors = ["#ffaa00", "#00ff88", "#9900ff", "#ffffff"];
        setTraffic((prev) => [
          ...prev,
          {
            id: Date.now(),
            lane: randomLane,
            z: -50,
            color: colors[Math.floor(Math.random() * colors.length)],
          },
        ]);
        setScore((s) => s + 1);
        speedRef.current += 0.001;
      }

      // Move traffic and check collision
      setTraffic((prev) => {
        const next = prev
          .map((car) => ({ ...car, z: car.z + speedRef.current * 10 }))
          .filter((car) => car.z < 10);

        const collision = next.find(
          (car) => car.z > 4 && car.z < 6 && car.lane === lane,
        );
        if (collision) setGameOver(true);

        return next;
      });
    });
    return null;
  };

  return (
    <div className="racing-container">
      <div className="racing-ui">
        <div className="score-board">
          SPEED: {Math.floor(speedRef.current * 1000)} • SCORE: {score}
        </div>
        {gameOver && (
          <div className="game-over-overlay">
            <h1>CRASHED!</h1>
            <p>Final Score: {score}</p>
            <button onClick={resetGame}>RETRY</button>
          </div>
        )}
      </div>

      <Canvas
        shadows
        onPointerDown={(e) => {
          const x = e.clientX / window.innerWidth;
          if (x < 0.5) setLane((l) => Math.max(0, l - 1));
          else setLane((l) => Math.min(2, l + 1));
        }}
      >
        <Suspense fallback={null}>
          <PerspectiveCamera makeDefault position={[0, 2, 10]} fov={50} />
          <Stars
            radius={100}
            depth={50}
            count={5000}
            factor={4}
            saturation={0}
            fade
            speed={1}
          />

          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} intensity={1} castShadow />
          <spotLight
            position={[0, 5, 10]}
            angle={0.3}
            penumbra={1}
            intensity={2}
            castShadow
          />

          <Road />
          <PlayerCar laneIndex={lane} />

          {traffic.map((car) => (
            <TrafficCar
              key={car.id}
              position={[LANES[car.lane], 0.3, car.z]}
              color={car.color}
            />
          ))}

          <GameLogic />
          <Environment preset="night" />
        </Suspense>
      </Canvas>

      <div className="racing-controls-hint">
        Use ⬅️ and ➡️ keys to dodge traffic!
      </div>
    </div>
  );
}
