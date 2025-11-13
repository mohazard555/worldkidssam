import React, { useState, useRef, useEffect } from 'react';
import { ArrowRightIcon } from './Icons';

interface TargetObject {
  id: string;
  name: string;
  x: number; // percentage
  y: number; // percentage
  radius: number; // percentage
}

const LEVEL_DATA = {
  image: `<svg viewBox="0 0 200 150" xmlns="http://www.w3.org/2000/svg"><rect width="200" height="150" fill="#c2d8e2"/><rect y="100" width="200" height="50" fill="#a4c6a4"/><rect x="120" y="50" width="60" height="80" rx="5" fill="#d8b48c"/><rect x="130" y="90" width="20" height="20" fill="#7a6c5d"/><rect x="125" y="60" width="25" height="20" fill="#f0e4d7"/><rect x="150" y="60" width="25" height="20" fill="#f0e4d7"/><polygon points="115,50 185,50 150,20" fill="#b48c6c"/><path d="M 20,100 C 10,80 30,70 40,80 L 60,100 Z" fill="#e55e5e"/><path d="M 15,100 C 5,80 25,70 35,80 L 55,100 Z" fill="#f4a460" transform="translate(10, 0)"/><circle cx="180" cy="130" r="10" fill="#fce57e"/><circle cx="50" cy="120" r="5" fill="#7a6c5d"/><circle cx="90" cy="110" r="15" fill="#5e8be5"/></svg>`,
  targets: [
    { id: 'sun', name: 'الشمس', x: 90, y: 86.6, radius: 10 },
    { id: 'ball', name: 'الكرة الزرقاء', x: 45, y: 73.3, radius: 10 },
    { id: 'mushroom', name: 'الفطر الأحمر', x: 15, y: 60, radius: 8 },
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
      setTimeout(() => setIsComplete(true), 500);
    } else {
      // Find next unfound target
      let nextIndex = 0;
      const targetIds = LEVEL_DATA.targets.map(t => t.id);
      while (found.includes(targetIds[nextIndex]) && nextIndex < targetIds.length) {
        nextIndex++;
      }
      if(nextIndex < targetIds.length) {
        setCurrentTargetIndex(nextIndex);
      }
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
    const encoded = btoa(unescape(encodeURIComponent(svgString)));
    return `data:image/svg+xml;base64,${encoded}`;
  };


  return (
    <div className="bg-slate-800/50 p-4 rounded-lg text-center relative animate-fade-in">
       <button onClick={onBack} className="absolute top-3 left-3 text-white/70 hover:text-white bg-black/20 p-2 rounded-full transition-colors z-20">
          <ArrowRightIcon className="w-6 h-6" />
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