import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeftIcon } from './Icons';

interface TargetObject {
  id: string;
  name: string;
  x: number; // percentage
  y: number; // percentage
  radius: number; // percentage
}

const LEVEL_DATA = {
  image: `<svg viewBox="0 0 200 150"><rect width="200" height="150" fill="#f0e4d7" /><!-- Table --><rect x="30" y="100" width="140" height="10" rx="2" fill="#8B4513" /><rect x="40" y="110" width="10" height="30" fill="#8B4513" /><rect x="150" y="110" width="10" height="30" fill="#8B4513" /><!-- Objects on table --><rect x="120" y="80" width="20" height="20" fill="#22c55e" /><!-- Book --><circle cx="50" cy="90" r="10" fill="#ef4444" /><!-- Ball --><!-- Window --><rect x="70" y="20" width="60" height="40" fill="#87CEEB" /><line x1="100" y1="20" x2="100" y2="60" stroke="#fff" stroke-width="2"/><line x1="70" y1="40" x2="130" y2="40" stroke="#fff" stroke-width="2"/><!-- Cat --><path d="M160 120 C 155 110, 165 110, 170 120 L 180 140 H 150 Z" fill="#78350f" /><circle cx="162" cy="125" r="2" fill="black"/><circle cx="168" cy="125" r="2" fill="black"/><polygon points="160,120 155,115 160,118" fill="#78350f" /><polygon points="170,120 175,115 170,118" fill="#78350f" /></svg>`,
  targets: [
    { id: 'cat', name: 'القطة', x: 82.5, y: 86.6, radius: 10 },
    { id: 'ball', name: 'الكرة الحمراء', x: 25, y: 60, radius: 8 },
    { id: 'book', name: 'الكتاب الأخضر', x: 65, y: 59, radius: 8 },
  ] as TargetObject[],
};

const FindObjectGame: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [found, setFound] = useState<string[]>([]);
  const [isComplete, setIsComplete] = useState(false);
  const [currentTargetIndex, setCurrentTargetIndex] = useState(0);
  const imageRef = useRef<HTMLDivElement>(null);
  const successAudioRef = useRef<HTMLAudioElement>(null);

  const currentTarget = LEVEL_DATA.targets[currentTargetIndex];

  useEffect(() => {
    if (found.length === LEVEL_DATA.targets.length) {
      setIsComplete(true);
    } else {
      // Find next unfound target
      let nextIndex = 0;
      const targetIds = LEVEL_DATA.targets.map(t => t.id);
      while (found.includes(targetIds[nextIndex])) {
        nextIndex++;
      }
      setCurrentTargetIndex(nextIndex);
    }
  }, [found]);

  const handleImageClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isComplete || !imageRef.current || !currentTarget) return;

    const rect = imageRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    const distance = Math.sqrt(Math.pow(x - currentTarget.x, 2) + Math.pow(y - currentTarget.y, 2));
    if (distance <= currentTarget.radius) {
      setFound(prev => [...prev, currentTarget.id]);
      successAudioRef.current?.play();
    }
  };

  const resetGame = () => {
    setFound([]);
    setIsComplete(false);
    setCurrentTargetIndex(0);
  };
  
  const createSVGStringAsDataURI = (svgString: string) => {
    return `data:image/svg+xml;base64,${btoa(svgString)}`;
  };


  return (
    <div className="bg-slate-800/50 p-4 rounded-lg text-center relative animate-fade-in">
       <button onClick={onBack} className="absolute top-3 left-3 text-white/70 hover:text-white bg-black/20 p-2 rounded-full transition-colors z-20">
          <ArrowLeftIcon className="w-6 h-6" />
          <span className="sr-only">رجوع</span>
      </button>

      <div className={`transition-opacity duration-500 ${isComplete ? 'opacity-0' : 'opacity-100'}`}>
        <h3 className="text-2xl font-bold mb-2">ابحث عن الشيء!</h3>
        <p className="text-lg mb-4 h-8">
            أين هي <span className="font-black text-yellow-300">{currentTarget?.name}</span>؟
        </p>
      </div>


      <div className="relative w-full aspect-[4/3] cursor-pointer" ref={imageRef} onClick={handleImageClick}>
        <img src={createSVGStringAsDataURI(LEVEL_DATA.image)} className="w-full h-full object-contain rounded-lg border-2 border-slate-600"/>
        {LEVEL_DATA.targets.map(target => {
          const isFound = found.includes(target.id);
          if (isFound) {
            return (
              <div
                key={target.id}
                className="absolute border-4 border-green-400 bg-green-400/30 rounded-full animate-pulse pointer-events-none"
                style={{
                  top: `${target.y}%`,
                  left: `${target.x}%`,
                  width: `${target.radius * 2}%`,
                  height: `${target.radius * 2}%`,
                  transform: 'translate(-50%, -50%)',
                }}
              />
            );
          }
          return null;
        })}
        {isComplete && (
          <div className="absolute inset-0 bg-black/90 flex flex-col items-center justify-center rounded-lg animate-fade-in text-center p-4 z-20">
              <h2 className="text-5xl font-black text-yellow-300 mb-4" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.5)'}}>أحسنت!</h2>
              <p className="text-white text-lg">لقد وجدت كل الأشياء بنجاح.</p>
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

export default FindObjectGame;
