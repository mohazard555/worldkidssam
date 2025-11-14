import React, { useState, useRef, useEffect } from 'react';
import { ArrowRightIcon, RedoIcon } from './Icons';

const LEVELS = [
  { // Star
    points: [
      { x: 50, y: 5 }, { x: 61, y: 40 }, { x: 98, y: 40 }, { x: 68, y: 62 },
      { x: 79, y: 96 }, { x: 50, y: 75 }, { x: 21, y: 96 }, { x: 32, y: 62 },
      { x: 2, y: 40 }, { x: 39, y: 40 }
    ]
  },
  { // House
    points: [
      { x: 50, y: 5 }, { x: 95, y: 40 }, { x: 95, y: 95 }, { x: 5, y: 95 },
      { x: 5, y: 40 }, { x: 50, y: 5 }, { x: 5, y: 40 }, { x: 95, y: 40 } // re-trace for roof base
    ]
  }
];

const ConnectDotsGame: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [level, setLevel] = useState(LEVELS[0]);
  const [connected, setConnected] = useState<number[]>([]);
  const [isComplete, setIsComplete] = useState(false);
  const successAudioRef = useRef<HTMLAudioElement>(null);

  const resetGame = () => {
    setConnected([]);
    setIsComplete(false);
    setLevel(LEVELS[Math.floor(Math.random() * LEVELS.length)]);
  };

  useEffect(resetGame, []);

  const handleDotClick = (index: number) => {
    if (isComplete) return;
    if (index === connected.length) {
      const newConnected = [...connected, index];
      setConnected(newConnected);
      successAudioRef.current?.play();

      if (newConnected.length === level.points.length) {
        setIsComplete(true);
      }
    }
  };

  return (
    <div className="bg-slate-800/50 p-4 rounded-lg text-center relative animate-fade-in">
      <button onClick={onBack} className="absolute top-3 left-3 text-white/70 hover:text-white bg-black/20 p-2 rounded-full transition-colors z-10">
        <ArrowRightIcon className="w-6 h-6" />
        <span className="sr-only">رجوع</span>
      </button>
      <h3 className="text-2xl font-bold mb-4">صل النقاط بالترتيب</h3>
      
      <div className="relative w-full max-w-lg mx-auto aspect-square bg-white/10 rounded-lg p-4">
        <svg viewBox="0 0 100 100" className="w-full h-full">
          {/* Completed Lines */}
          {connected.map((dotIndex, i) => {
            if (i === 0) return null;
            const p1 = level.points[connected[i - 1]];
            const p2 = level.points[dotIndex];
            return <line key={i} x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y} stroke="#34d399" strokeWidth="1.5" />;
          })}
          
          {/* Final Shape on complete */}
           {isComplete && (
                <polygon points={level.points.map(p => `${p.x},${p.y}`).join(' ')} fill="#34d399" opacity="0.3" />
           )}

          {/* Dots */}
          {level.points.map((p, i) => (
            <g key={i} onClick={() => handleDotClick(i)} className="cursor-pointer">
              <circle cx={p.x} cy={p.y} r="3" fill={connected.includes(i) ? "#34d399" : (connected.length === i ? "#facc15" : "#f1f5f9")} />
              <text x={p.x} y={p.y - 5} fontSize="5" fill="#f1f5f9" textAnchor="middle">{i + 1}</text>
            </g>
          ))}
        </svg>
         {isComplete && (
            <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center rounded-lg animate-fade-in text-center p-4 z-20">
                <h2 className="text-4xl font-black text-yellow-300 mb-4">أحسنت!</h2>
                <button onClick={resetGame} className="mt-6 bg-blue-500 text-white font-bold py-2 px-6 rounded-full hover:bg-blue-600 flex items-center space-x-2 space-x-reverse">
                    <RedoIcon className="w-5 h-5"/>
                    <span>العب مرة أخرى</span>
                </button>
            </div>
        )}
      </div>
       <audio ref={successAudioRef} src="https://actions.google.com/sounds/v1/ui/swoosh_away.ogg" preload="auto" />
    </div>
  );
};

export default ConnectDotsGame;
