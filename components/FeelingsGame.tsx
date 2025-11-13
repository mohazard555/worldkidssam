import React, { useState, useEffect, useRef } from 'react';
import { ArrowRightIcon } from './Icons';

interface Feeling {
  id: 'happy' | 'sad' | 'angry' | 'surprised';
  emoji: string;
  name: string;
}

const FEELINGS: Feeling[] = [
  { id: 'happy', emoji: '😃', name: 'سعيد' },
  { id: 'sad', emoji: '😢', name: 'حزين' },
  { id: 'angry', emoji: '😡', name: 'غاضب' },
  { id: 'surprised', emoji: '😮', name: 'متفاجئ' },
];

const shuffleArray = <T,>(array: T[]): T[] => {
  return [...array].sort(() => Math.random() - 0.5);
};

const FeelingsGame: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [targetFeeling, setTargetFeeling] = useState<Feeling>(FEELINGS[0]);
  const [options, setOptions] = useState<Feeling[]>([]);
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);
  const successAudioRef = useRef<HTMLAudioElement>(null);
  const failureAudioRef = useRef<HTMLAudioElement>(null);

  const newRound = () => {
    setFeedback(null);
    const shuffledFeelings = shuffleArray(FEELINGS);
    setTargetFeeling(shuffledFeelings[0]);
    setOptions(shuffleArray(shuffledFeelings));
  };

  useEffect(newRound, []);

  const handleOptionClick = (feeling: Feeling) => {
    if (feedback) return;

    if (feeling.id === targetFeeling.id) {
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
      <h3 className="text-2xl font-bold mb-4">ما هو هذا الشعور؟</h3>
      
      <div className="mb-6 flex items-center justify-center text-8xl h-28">
        {targetFeeling.emoji}
      </div>
      
      <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
        {options.map((option) => (
          <button
            key={option.id}
            onClick={() => handleOptionClick(option)}
            disabled={!!feedback}
            className={`relative p-4 text-white font-bold rounded-lg transition-colors duration-300 text-2xl
            ${feedback === 'correct' && option.id === targetFeeling.id ? 'bg-green-500 animate-pulse' : ''}
            ${feedback === 'incorrect' && option.id !== targetFeeling.id ? 'bg-blue-500 opacity-50' : 'bg-blue-500 hover:bg-blue-600'}
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

export default FeelingsGame;
