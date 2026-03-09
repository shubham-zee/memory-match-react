import { useMotionValueEvent, useScroll, useTransform } from "framer-motion";
import React, { useCallback, useMemo, useRef } from "react";

const HeroScrollImage = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const images = useMemo(() => {
    const loadImages: HTMLImageElement[] = [];
    for (let i = 1; i <= 300; i++) {
      const img = new Image();
      img.src = `/memory-match-react/TripIndia/${i}.jpg`;
      loadImages.push(img);
    }
    return loadImages;
  }, []);

  const currentIndex = useTransform(
    scrollYProgress,
    [0, 1],
    [0, images.length - 1],
  );

  const renderCanvas = useCallback(
    (index: number) => {
      if (images[index]) {
        const canvas = canvasRef.current;
        const context = canvas?.getContext("2d");
        if (canvas && context && images[index]) {
          context.clearRect(0, 0, canvas.width, canvas.height);
          context.drawImage(images[index], 0, 0, canvas.width, canvas.height);
        }
      }
    },
    [images],
  );

  useMotionValueEvent(currentIndex, "change", (value) => {
    renderCanvas(Number(value.toFixed()));
  });

  return (
    <div
      className="canvaContainer"
      ref={containerRef}
      style={{
        height: "2000px",
        width: "100vw",
        backgroundImage: "url('/memory-match-react/TripIndia/1.jpg')",
        backgroundSize: "contain",
        position: "relative",
      }}
    >
      <canvas
        style={{
          position: "sticky",
          top: "0px",
          display: "block",
        }}
        width={window.innerWidth}
        height={window.innerHeight}
        ref={canvasRef}
      ></canvas>
    </div>
  );
};

export default HeroScrollImage;
