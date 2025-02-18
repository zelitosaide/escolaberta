"use client";

import { useCallback, useEffect, useState } from "react";

interface Pixel {
  id: number
  x: number
  y: number
  size: number
  speed: number
}

export default function FloatingPixels() {
  // const [pixels, setPixels] = useState<Pixel[]>([]);

  // useEffect(() => {
  //   const createPixels = () => {
  //     const newPixels: Pixel[] = [];
  //     for (let i = 0; i < 20; i++) {
  //       newPixels.push({
  //         id: i,
  //         x: Math.random() * window.innerWidth,
  //         y: Math.random() * window.innerHeight,
  //         size: Math.random() * 4 + 2,
  //         speed: Math.random() * 0.5 + 0.1,
  //       });
  //     }
  //     setPixels(newPixels);
  //   }

  //   createPixels();

  //   const animatePixels = () => {
  //     setPixels((prevPixels) =>
  //       prevPixels.map((pixel) => ({
  //         ...pixel,
  //         y: pixel.y - pixel.speed,
  //         x: pixel.x + Math.sin(pixel.y * 0.1) * 0.5,
  //       })),
  //     );
  //   }

  //   const intervalId = setInterval(animatePixels, 50);

  //   return () => clearInterval(intervalId);
  // }, []);

  // return (
  //   <div className="fixed inset-0 pointer-events-none">
  //     {pixels.map((pixel) => (
  //       <div
  //         key={pixel.id}
  //         className="absolute bg-green-400 opacity-50"
  //         style={{
  //           left: `${pixel.x}px`,
  //           top: `${pixel.y}px`,
  //           width: `${pixel.size}px`,
  //           height: `${pixel.size}px`,
  //         }}
  //       />
  //     ))}
  //   </div>
  // );

  const [pixels, setPixels] = useState<Pixel[]>([]);
  const [dimensions, setDimensions] = useState({
    width: typeof window !== "undefined" ? window.innerWidth : 1920,
    height: typeof window !== "undefined" ? window.innerHeight : 1080,
  });

  // Memoize the update dimensions callback
  const updateDimensions = useCallback(() => {
    setDimensions({
      width: window.innerWidth,
      height: window.innerHeight,
    });
  }, []);

  // Handle window resize
  useEffect(() => {
    window.addEventListener("resize", updateDimensions);
    updateDimensions(); // Initial dimension setup

    return () => window.removeEventListener("resize", updateDimensions)
  }, [updateDimensions]);

  // Initialize pixels
  useEffect(() => {
    const newPixels: Pixel[] = [];
    for (let i = 0; i < 20; i++) {
      newPixels.push({
        id: i,
        x: Math.random() * dimensions.width,
        y: Math.random() * dimensions.height,
        size: Math.random() * 4 + 2,
        speed: Math.random() * 0.5 + 0.1,
      });
    }
    setPixels(newPixels);
  }, [dimensions.width, dimensions.height]);

  // Animation effect
  useEffect(() => {
    const animatePixels = () => {
      setPixels((prevPixels) =>
        prevPixels.map((pixel) => {
          let newY = pixel.y - pixel.speed;
          let newX = pixel.x + Math.sin(pixel.y * 0.1) * 0.5;

          // Reset position when pixel moves off screen
          if (newY < -20) {
            newY = dimensions.height + 20;
            newX = Math.random() * dimensions.width;
          }
          // Wrap around horizontally
          if (newX < -20) newX = dimensions.width + 20;
          if (newX > dimensions.width + 20) newX = -20;

          return {
            ...pixel,
            x: newX,
            y: newY,
          }
        }),
      );
    }

    const intervalId = setInterval(animatePixels, 50);
    return () => clearInterval(intervalId);
  }, [dimensions.width, dimensions.height]);

  return (
    <div className="fixed inset-0 pointer-events-none">
      {pixels.map((pixel) => (
        <div
          key={pixel.id}
          className="absolute bg-green-400 opacity-50"
          style={{
            left: `${pixel.x}px`,
            top: `${pixel.y}px`,
            width: `${pixel.size}px`,
            height: `${pixel.size}px`,
          }}
        />
      ))}
    </div>
  );
}