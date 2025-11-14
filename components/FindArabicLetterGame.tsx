import React, { useState, useEffect, useRef } from 'react';
import { ArrowRightIcon } from './Icons';

const ARABIC_LETTERS = 'أبتثجحخدذرزسشصضطظعغفقكلمنهوي'.split('');

const shuffleArray = <T,>(array: T[]): T[] => {
  return [...array].sort(() => Math.random() - 0.5);
};

const FindArabicLetterGame: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [targetLetter, setTargetLetter] = useState('');
  const [options, setOptions] = useState<string[]>([]);
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);
  const successAudioRef = useRef<HTMLAudioElement>(null);
  const failureAudioRef = useRef<HTMLAudioElement>(null);

  const generateNewRound = () => {
    setFeedback(null);
    const shuffled = shuffleArray(ARABIC_LETTERS);
    const newTarget = shuffled[0];
    setTargetLetter(newTarget);

    const otherOptions = shuffled.slice(1, 9);
    const allOptions = shuffleArray([newTarget, ...otherOptions]);
    setOptions(allOptions);
  };

  useEffect(generateNewRound, []);

  const handleOptionClick = (letter: string) => {
    if (feedback) return;

    if (letter === targetLetter) {
      setFeedback('correct');
      successAudioRef.current?.play();
      setTimeout(generateNewRound, 1200);
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
      <h3 className="text-2xl font-bold mb-4">أين هو حرف...</h3>
      <div className="mb-6 h-20 flex items-center justify-center">
        <p className="text-8xl font-black text-yellow-300 transition-all duration-300" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.5)' }}>
          {targetLetter}
        </p>
      </div>
      <div className="grid grid-cols-3 gap-4 max-w-sm mx-auto">
        {options.map((option) => (
          <button
            key={option}
            onClick={() => handleOptionClick(option)}
            disabled={!!feedback}
            className={`relative p-4 text-white font-bold rounded-lg transition-all duration-300 text-5xl aspect-square flex items-center justify-center
            ${feedback === 'correct' && option === targetLetter ? 'bg-green-500 animate-pulse' : ''}
            ${feedback === 'incorrect' && option !== targetLetter ? 'bg-blue-500 opacity-30' : 'bg-blue-500 hover:bg-blue-600'}
            `}
          >
            {option}
          </button>
        ))}
      </div>
      <audio ref={successAudioRef} src="https://actions.google.com/sounds/v1/positive/success.ogg" preload="auto" />
      <audio ref={failureAudioRef} src="https://actions.google.com/sounds/v1/errors/error_swoosh.ogg" preload="auto" />
    </div>
  );
};

export default FindArabicLetterGame;
