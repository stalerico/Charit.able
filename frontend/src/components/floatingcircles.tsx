import { useEffect, useState } from "react";

type Circle = {
  id: number;
  size: number;
  x: number;
  y: number;
  duration: number;
  delay: number;
};

const NUM_CIRCLES = 20;

export default function FloatingCircles() {
  const [circles, setCircles] = useState<Circle[]>([]);

  useEffect(() => {
    const newCircles = Array.from({ length: NUM_CIRCLES }, (_, i) => ({
      id: i,
      size: Math.random() * 20 + 5, // 5-25px
      x: Math.random() * 100,
      y: Math.random() * 100,
      duration: Math.random() * 20 + 10, // 10-30s
      delay: Math.random() * 5,
    }));
    setCircles(newCircles);
  }, []);

  return (
    <div className="fixed inset-0 -z-10 pointer-events-none">
      {circles.map((circle) => (
        <div
          key={circle.id}
          className="absolute rounded-full bg-white opacity-10 animate-float"
          style={{
            width: `${circle.size}px`,
            height: `${circle.size}px`,
            top: `${circle.y}vh`,
            left: `${circle.x}vw`,
            animationDuration: `${circle.duration}s`,
            animationDelay: `${circle.delay}s`,
          }}
        />
      ))}

      <style>
        {`
          @keyframes float {
            0% { transform: translate(0, 0); }
            50% { transform: translate(10px, -20px); }
            100% { transform: translate(0, 0); }
          }
          .animate-float {
            animation-name: float;
            animation-iteration-count: infinite;
            animation-timing-function: ease-in-out;
          }
        `}
      </style>
    </div>
  );
}
