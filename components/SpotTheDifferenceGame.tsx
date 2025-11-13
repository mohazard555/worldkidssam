import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeftIcon } from './Icons';

interface Difference {
  id: number;
  x: number; // percentage
  y: number; // percentage
  radius: number; // percentage
}

const LEVEL_DATA = {
  image1: `<svg viewBox="0 0 100 100"><rect width="100" height="100" fill="#87CEEB" /><circle cx="80" cy="20" r="15" fill="#FFD700" /><path d="M0 80 Q 25 70, 50 80 T 100 80 V 100 H 0 Z" fill="#32CD32" /><rect x="45" y="60" width="10" height="20" fill="#8B4513" /><polygon points="40,60 60,60 50,40" fill="#228B22" /><circle cx="20" cy="85" r="5" fill="#FF69B4" /><circle cx="23" cy="88" r="3" fill="#FFC0CB" /></svg>`,
  image2: `<svg viewBox="0 0 100 100"><rect width="100" height="100" fill="#87CEEB" /><circle cx="80" cy="20" r="12" fill="#FFD700" /><path d="M0 80 Q 25 70, 50 80 T 100 80 V 100 H 0 Z" fill="#32CD32" /><rect x="45" y="65" width="10" height="15" fill="#A0522D" /><polygon points="40,60 60,60 50,40" fill="#006400" /><circle cx="23" cy="88" r="3" fill="#FFC0CB" /></svg>`,
  differences: [
    { id: 1, x: 80, y: 20, radius: 15 }, // Sun size
    { id: 2, x: 50, y: 70, radius: 10 }, // Tree trunk
    { id: 3, x: 50, y: 50, radius: 10 }, // Tree leaves color
    { id: 4, x: 20, y: 85, radius: 5 },  // Missing flower
  ] as Difference[],
};

const SpotTheDifferenceGame: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [found, setFound] = useState<number[]>([]);
  const [isComplete, setIsComplete] = useState(false);
  const imageRef = useRef<HTMLDivElement>(null);
  
  const successAudioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (found.length === LEVEL_DATA.differences.length) {
      setIsComplete(true);
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
    return `data:image/svg+xml;base64,${btoa(svgString)}`;
  };

  return (
    <div className="bg-slate-800/50 p-4 rounded-lg text-center relative animate-fade-in">
      <button onClick={onBack} className="absolute top-3 right-3 text-white/70 hover:text-white bg-black/20 p-2 rounded-full transition-colors z-20">
        <ArrowLeftIcon className="w-6 h-6 transform -scale-x-100" />
        <span className="sr-only">رجوع</span>
      </button>

      <h3 className="text-2xl font-bold mb-2">أوجد الاختلافات</h3>
      <p className="text-lg mb-4">
        {LEVEL_DATA.differences.length} / {found.length}
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 relative">
        <div className="relative aspect-square">
            <img src={createSVGStringAsDataURI(LEVEL_DATA.image1)} className="w-full h-full object-contain rounded-lg border-2 border-slate-600"/>
        </div>
        <div ref={imageRef} onClick={handleImageClick} className="relative aspect-square cursor-pointer">
            <img src={createSVGStringAsDataURI(LEVEL_DATA.image2)} className="w-full h-full object-contain rounded-lg border-2 border-slate-600"/>
            {LEVEL_DATA.differences.map(diff => {
                const isFound = found.includes(diff.id);
                if (isFound) {
                    return (
                        <div
                            key={diff.id}
                            className="absolute border-4 border-red-500 rounded-full animate-pulse"
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
