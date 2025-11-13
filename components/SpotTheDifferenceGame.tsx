import React, { useState, useRef, useEffect } from 'react';
import { ArrowRightIcon } from './Icons';

interface Difference {
  id: number;
  x: number; // percentage
  y: number; // percentage
  radius: number; // percentage
}

const LEVEL_DATA = {
  image1: `<svg viewBox="0 0 200 150" xmlns="http://www.w3.org/2000/svg"><rect width="200" height="150" fill="#a0d3f5"/><circle cx="30" cy="30" r="20" fill="#fce57e"/><rect y="120" width="200" height="30" fill="#78c28a"/><path d="M 80 120 C 80 100, 90 100, 90 120 Z" fill="#9b7653"/><path d="M 70 80 C 60 90, 80 110, 100 80 C 120 110, 140 90, 130 80 C 120 70, 80 70, 70 80 Z" fill="#60a83f"/><circle cx="150" cy="130" r="8" fill="#e55e5e"/><circle cx="170" cy="135" r="5" fill="#f4a460"/><path d="M20,120 L30,100 L40,120 Z" fill="#f4a460" transform="rotate(15,30,110)"/><path d="M10,120 L20,100 L30,120 Z" fill="#60a83f" transform="rotate(-10,20,110)"/></svg>`,
  image2: `<svg viewBox="0 0 200 150" xmlns="http://www.w3.org/2000/svg"><rect width="200" height="150" fill="#a0d3f5"/><circle cx="30" cy="30" r="20" fill="#fce57e"/><path d="M35 25 Q 30 30 35 35" stroke="#e55e5e" stroke-width="2" fill="none" transform="rotate(45 30 30)"/><rect y="120" width="200" height="30" fill="#78c28a"/><path d="M 80 120 C 80 100, 90 100, 90 120 Z" fill="#9b7653"/><path d="M 70 80 C 60 90, 80 110, 100 80 C 120 110, 140 90, 130 80 C 120 70, 80 70, 70 80 Z" fill="#88c44e"/><circle cx="150" cy="130" r="8" fill="#5e8be5"/><circle cx="170" cy="135" r="5" fill="#f4a460"/><path d="M20,120 L30,100 L40,120 Z" fill="#f4a460" transform="rotate(15,30,110)"/></svg>`,
  differences: [
    { id: 1, x: 15, y: 20, radius: 4 }, // Sunglasses on sun
    { id: 2, x: 50, y: 56, radius: 10 }, // Tree color
    { id: 3, x: 75, y: 86, radius: 5 },  // Ball color
    { id: 4, x: 10, y: 73, radius: 5 },  // Missing plant
  ] as Difference[],
};

const SpotTheDifferenceGame: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [found, setFound] = useState<number[]>([]);
  const [isComplete, setIsComplete] = useState(false);
  const imageRef = useRef<HTMLDivElement>(null);
  
  const successAudioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (found.length === LEVEL_DATA.differences.length) {
       setTimeout(() => setIsComplete(true), 500);
    }
  }, [found]);

  const handleImageClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isComplete || !imageRef.current) return;

    const rect = imageRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    for (const diff of LEVEL_DATA.differences) {
      if (found.includes(diff.id)) continue;

      const distance = Math.sqrt(Math.pow(x - diff.x, 2) + Math.pow(y - diff.y, 2));
      if (distance <= diff.radius) {
        setFound(prev => [...prev, diff.id]);
        successAudioRef.current?.play();
        break;
      }
    }
  };
  
  const resetGame = () => {
      setFound([]);
      setIsComplete(false);
  };

  const createSVGStringAsDataURI = (svgString: string) => {
    const encoded = btoa(unescape(encodeURIComponent(svgString)));
    return `data:image/svg+xml;base64,${encoded}`;
  };

  return (
    <div className="bg-slate-800/50 p-4 rounded-lg text-center relative animate-fade-in">
      <button onClick={onBack} className="absolute top-3 left-3 text-white/70 hover:text-white bg-black/20 p-2 rounded-full transition-colors z-20">
        <ArrowRightIcon className="w-6 h-6" />
        <span className="sr-only">رجوع</span>
      </button>

      <h3 className="text-2xl font-bold mb-2">أوجد الاختلافات</h3>
      <p className="text-lg mb-4 font-bold text-yellow-300">
        {LEVEL_DATA.differences.length} / {found.length}
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 relative">
        <div className="relative aspect-[4/3]">
            <img src={createSVGStringAsDataURI(LEVEL_DATA.image1)} className="w-full h-full object-contain rounded-lg border-2 border-slate-600"/>
        </div>
        <div ref={imageRef} onClick={handleImageClick} className="relative aspect-[4/3] cursor-pointer">
            <img src={createSVGStringAsDataURI(LEVEL_DATA.image2)} className="w-full h-full object-contain rounded-lg border-2 border-slate-600"/>
            {LEVEL_DATA.differences.map(diff => {
                const isFound = found.includes(diff.id);
                if (isFound) {
                    return (
                        <div
                            key={diff.id}
                            className="absolute border-4 border-green-400 bg-green-400/30 rounded-full animate-pulse pointer-events-none"
                            style={{
                                top: `${diff.y}%`,
                                left: `${diff.x}%`,
                                width: `${diff.radius * 2}%`,
                                height: `${diff.radius * 2}%`,
                                transform: 'translate(-50%, -50%)',
                            }}
                        />
                    );
                }
                return null;
            })}
        </div>
         {isComplete && (
            <div className="absolute inset-0 bg-black/90 flex flex-col items-center justify-center rounded-lg animate-fade-in text-center p-4 z-20">
                <h2 className="text-5xl font-black text-yellow-300 mb-4" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.5)'}}>رائع!</h2>
                <p className="text-white text-lg">لقد وجدت كل الاختلافات بنجاح.</p>
                <button onClick={resetGame} className="mt-6 bg-blue-500 text-white font-bold py-2 px-6 rounded-full hover:bg-blue-600 transition-all flex items-center space-x-2 space-x-reverse shadow-lg border-b-4 border-blue-700 active:border-b-0 active:translate-y-1 transform">
                    <span>العب مرة أخرى</span>
                </button>
            </div>
        )}
      </div>
      <audio ref={successAudioRef} src="https://actions.google.com/sounds/v1/positive/bell_notification.ogg" preload="auto" />
    </div>
  );
};

export default SpotTheDifferenceGame;