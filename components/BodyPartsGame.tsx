import React, { useState, useEffect, useRef } from 'react';
import { ArrowRightIcon } from './Icons';

interface BodyPart {
  id: 'eye' | 'ear' | 'nose' | 'mouth' | 'hand' | 'foot';
  emoji: string;
  name: string;
}

const BODY_PARTS: BodyPart[] = [
  { id: 'eye', emoji: '👁️', name: 'عين' },
  { id: 'ear', emoji: '👂', name: 'أذن' },
  { id: 'nose', emoji: '👃', name: 'أنف' },
  { id: 'mouth', emoji: '👄', name: 'فم' },
  { id: 'hand', emoji: '✋', name: 'يد' },
  { id: 'foot', emoji: '🦶', name: 'قدم' },
];

const shuffleArray = <T,>(array: T[]): T[] => {
  return [...array].sort(() => Math.random() - 0.5);
};

const BodyPartsGame: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [targetPart, setTargetPart] = useState<BodyPart>(BODY_PARTS[0]);
  const [options, setOptions] = useState<BodyPart[]>([]);
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);
  const successAudioRef = useRef<HTMLAudioElement>(null);
  const failureAudioRef = useRef<HTMLAudioElement>(null);

  const newRound = () => {
    setFeedback(null);
    const shuffledParts = shuffleArray(BODY_PARTS);
    setTargetPart(shuffledParts[0]);
    
    const otherOptions = shuffledParts.slice(1, 4);
    const allOptions = shuffleArray([shuffledParts[0], ...otherOptions]);
    setOptions(allOptions);
  };

  useEffect(newRound, []);

  const handleOptionClick = (part: BodyPart) => {
    if (feedback) return;

    if (part.id === targetPart.id) {
      setFeedback('correct');
      successAudioRef.current?.play();
      setTimeout(newRound, 1200);
    } else {
      setFeedback('incorrect');
      failureAudioRef.current?.play();
      setTimeout(() => setFeedback(null), 1000);
    }
  };

  return (
    <div className="bg-slate-800/50 p-4 rounded-lg text-center relative animate-fade-in">
      <button onClick={onBack} className="absolute top-3 left-3 text-white/70 hover:text-white bg-black/20 p-2 rounded-full transition-colors z-10">
        <ArrowRightIcon className="w-6 h-6" />
        <span className="sr-only">رجوع</span>
      </button>
      <h3 className="text-2xl font-bold mb-4">ما هو هذا الجزء من الجسم؟</h3>
      
      <div className="mb-6 flex items-center justify-center text-8xl h-28">
        {targetPart.emoji}
      </div>
      
      <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
        {options.map((option) => (
          <button
            key={option.id}
            onClick={() => handleOptionClick(option)}
            disabled={!!feedback}
            className={`relative p-4 text-white font-bold rounded-lg transition-colors duration-300 text-2xl
            ${feedback === 'correct' && option.id === targetPart.id ? 'bg-green-500 animate-pulse' : ''}
            ${feedback === 'incorrect' && option.id !== targetPart.id ? 'bg-blue-500 opacity-50' : 'bg-blue-500 hover:bg-blue-600'}
            `}
          >
            {option.name}
          </button>
        ))}
      </div>
       <audio ref={successAudioRef} src="https://actions.google.com/sounds/v1/positive/success.ogg" preload="auto" />
       <audio ref={failureAudioRef} src="https://actions.google.com/sounds/v1/errors/error_swoosh.ogg" preload="auto" />
    </div>
  );
};

export default BodyPartsGame;
