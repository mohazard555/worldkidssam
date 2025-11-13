import React, { useState, useEffect, useRef } from 'react';
import { ArrowRightIcon, RedoIcon } from './Icons';

interface Animal {
  id: string;
  emoji: string;
  habitat: 'jungle' | 'sea' | 'farm';
}
interface Habitat {
  id: 'jungle' | 'sea' | 'farm';
  name: string;
  emoji: string;
}
const ANIMALS: Animal[] = [
  { id: 'lion', emoji: '🦁', habitat: 'jungle' },
  { id: 'fish', emoji: '🐠', habitat: 'sea' },
  { id: 'cow', emoji: '🐮', habitat: 'farm' },
  { id: 'monkey', emoji: '🐵', habitat: 'jungle' },
  { id: 'whale', emoji: '🐳', habitat: 'sea' },
  { id: 'chicken', emoji: '🐔', habitat: 'farm' },
];
const HABITATS: Habitat[] = [
  { id: 'jungle', name: 'الغابة', emoji: '🌳' },
  { id: 'sea', name: 'البحر', emoji: '🌊' },
  { id: 'farm', name: 'المزرعة', emoji: '🏡' },
];

const shuffleArray = <T,>(array: T[]): T[] => {
  return [...array].sort(() => Math.random() - 0.5);
};

const HabitatGame: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [currentAnimal, setCurrentAnimal] = useState<Animal | null>(null);
  const [score, setScore] = useState(0);
  const [animalQueue, setAnimalQueue] = useState<Animal[]>([]);
  const [feedback, setFeedback] = useState<Record<string, 'correct'|'incorrect'>>({});
  const successAudioRef = useRef<HTMLAudioElement>(null);
  const failureAudioRef = useRef<HTMLAudioElement>(null);

  const setupGame = () => {
    const shuffledAnimals = shuffleArray(ANIMALS);
    setAnimalQueue(shuffledAnimals);
    setCurrentAnimal(shuffledAnimals[0]);
    setScore(0);
    setFeedback({});
  };

  useEffect(setupGame, []);

  const handleDrop = (habitat: Habitat) => {
    if (!currentAnimal) return;

    if (currentAnimal.habitat === habitat.id) {
        successAudioRef.current?.play();
        setScore(prev => prev + 1);
        setFeedback(prev => ({...prev, [habitat.id]: 'correct'}));
    } else {
        failureAudioRef.current?.play();
        setFeedback(prev => ({...prev, [habitat.id]: 'incorrect'}));
    }
    
    setTimeout(() => {
        const newQueue = animalQueue.slice(1);
        setAnimalQueue(newQueue);
        setCurrentAnimal(newQueue[0] || null);
        setFeedback({});
    }, 1000);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };
  
  if (!currentAnimal) {
    return (
        <div className="bg-slate-800/50 p-4 rounded-lg text-center relative animate-fade-in flex flex-col items-center justify-center min-h-[400px]">
            <h3 className="text-3xl font-bold text-yellow-300">أحسنت!</h3>
            <p className="text-xl mt-2">لقد أكملت اللعبة بنجاح.</p>
            <p className="text-lg mt-1">النتيجة: {score} من {ANIMALS.length}</p>
            <button onClick={setupGame} className="mt-6 bg-blue-500 text-white font-bold py-2 px-6 rounded-full hover:bg-blue-600 flex items-center space-x-2 space-x-reverse">
                <RedoIcon className="w-5 h-5"/>
                <span>العب مرة أخرى</span>
            </button>
            <button onClick={onBack} className="absolute top-3 left-3 text-white/70 hover:text-white bg-black/20 p-2 rounded-full transition-colors z-10">
                <ArrowRightIcon className="w-6 h-6" />
            </button>
        </div>
    );
  }

  return (
    <div className="bg-slate-800/50 p-4 rounded-lg text-center relative animate-fade-in">
      <button onClick={onBack} className="absolute top-3 left-3 text-white/70 hover:text-white bg-black/20 p-2 rounded-full transition-colors z-10">
        <ArrowRightIcon className="w-6 h-6" />
        <span className="sr-only">رجوع</span>
      </button>
      <h3 className="text-2xl font-bold mb-4">أين يعيش هذا الحيوان؟</h3>
      
      <div className="mb-6 flex items-center justify-center h-28">
        <div draggable className="text-8xl cursor-grab active:cursor-grabbing animate-bounce">
            {currentAnimal.emoji}
        </div>
      </div>
      
      <div className="grid grid-cols-3 gap-2 max-w-lg mx-auto">
        {HABITATS.map((habitat) => (
          <div
            key={habitat.id}
            onDrop={() => handleDrop(habitat)}
            onDragOver={handleDragOver}
            className={`aspect-square rounded-xl transition-all duration-300 shadow-lg flex flex-col items-center justify-center p-2 text-2xl font-bold
            ${feedback[habitat.id] === 'correct' ? 'bg-green-500' : ''}
            ${feedback[habitat.id] === 'incorrect' ? 'bg-red-500' : ''}
            ${!feedback[habitat.id] ? 'bg-blue-500' : ''}
            `}
          >
            <div className="text-6xl">{habitat.emoji}</div>
            <span className="mt-2">{habitat.name}</span>
          </div>
        ))}
      </div>
       <audio ref={successAudioRef} src="https://actions.google.com/sounds/v1/positive/success.ogg" preload="auto" />
       <audio ref={failureAudioRef} src="https://actions.google.com/sounds/v1/errors/error_swoosh.ogg" preload="auto" />
    </div>
  );
};

export default HabitatGame;
