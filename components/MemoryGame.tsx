import React, { useState, useEffect, useRef } from 'react';
import { ArrowRightIcon, RedoIcon } from './Icons';

const EMOJIS = ['🍎', '🍌', '🍇', '🍉', '🍓', '🍑', '🍍', '🥝'];

const shuffleArray = <T,>(array: T[]): T[] => {
  return [...array].sort(() => Math.random() - 0.5);
};

const MemoryGame: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [cards, setCards] = useState<(string | null)[]>([]);
  const [flipped, setFlipped] = useState<number[]>([]);
  const [matched, setMatched] = useState<string[]>([]);
  const [isComplete, setIsComplete] = useState(false);
  const successAudioRef = useRef<HTMLAudioElement>(null);
  const flipAudioRef = useRef<HTMLAudioElement>(null);

  const setupGame = () => {
    const gameEmojis = shuffleArray([...EMOJIS, ...EMOJIS]);
    setCards(gameEmojis);
    setFlipped([]);
    setMatched([]);
    setIsComplete(false);
  };

  useEffect(setupGame, []);

  useEffect(() => {
    if (matched.length === EMOJIS.length) {
      setIsComplete(true);
      successAudioRef.current?.play();
    }
  }, [matched]);

  useEffect(() => {
    if (flipped.length === 2) {
      const [firstIndex, secondIndex] = flipped;
      if (cards[firstIndex] === cards[secondIndex]) {
        setMatched(prev => [...prev, cards[firstIndex]!]);
      }
      setTimeout(() => setFlipped([]), 1000);
    }
  }, [flipped, cards]);

  const handleCardClick = (index: number) => {
    if (flipped.length === 2 || flipped.includes(index) || matched.includes(cards[index]!)) {
      return;
    }
    flipAudioRef.current?.play();
    setFlipped(prev => [...prev, index]);
  };
  
  return (
    <div className="bg-slate-800/50 p-4 rounded-lg text-center relative animate-fade-in">
      <button onClick={onBack} className="absolute top-3 left-3 text-white/70 hover:text-white bg-black/20 p-2 rounded-full transition-colors z-10">
        <ArrowRightIcon className="w-6 h-6" />
        <span className="sr-only">رجوع</span>
      </button>
      <h3 className="text-2xl font-bold mb-4">لعبة الذاكرة</h3>
      
      <div className="relative max-w-md mx-auto">
        <div className="grid grid-cols-4 gap-2 sm:gap-4">
          {cards.map((card, index) => {
            const isFlipped = flipped.includes(index) || matched.includes(card!);
            return (
              <div key={index} className="aspect-square [perspective:1000px]" onClick={() => handleCardClick(index)}>
                <div className={`relative w-full h-full transition-transform duration-500 [transform-style:preserve-3d] ${isFlipped ? '[transform:rotateY(180deg)]' : ''}`}>
                  {/* Card Back */}
                  <div className="absolute w-full h-full bg-blue-500 rounded-lg flex items-center justify-center text-4xl font-bold text-white [backface-visibility:hidden]">?</div>
                  {/* Card Front */}
                  <div className={`absolute w-full h-full rounded-lg flex items-center justify-center text-4xl [backface-visibility:hidden] [transform:rotateY(180deg)] ${matched.includes(card!) ? 'bg-green-500' : 'bg-slate-600'}`}>
                    {card}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        {isComplete && (
             <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center rounded-lg animate-fade-in text-center p-4 z-20">
                <h2 className="text-4xl font-black text-yellow-300 mb-4">رائع!</h2>
                <button onClick={setupGame} className="mt-6 bg-blue-500 text-white font-bold py-2 px-6 rounded-full hover:bg-blue-600 flex items-center space-x-2 space-x-reverse">
                    <RedoIcon className="w-5 h-5"/>
                    <span>العب مرة أخرى</span>
                </button>
            </div>
        )}
      </div>
      <audio ref={successAudioRef} src="https://actions.google.com/sounds/v1/positive/success.ogg" preload="auto" />
      <audio ref={flipAudioRef} src="https://actions.google.com/sounds/v1/ui/card_turn_1.ogg" preload="auto" />
    </div>
  );
};

export default MemoryGame;
