import React, { useState, useEffect, useRef } from 'react';
import { CheckIcon, ArrowRightIcon } from './Icons';

const COLORS = [
  { name: 'أحمر', value: '#ef4444' },
  { name: 'أزرق', value: '#3b82f6' },
  { name: 'أخضر', value: '#22c55e' },
  { name: 'أصفر', value: '#eab308' },
  { name: 'برتقالي', value: '#f97316' },
  { name: 'بنفسجي', value: '#8b5cf6' },
  { name: 'وردي', value: '#ec4899' },
  { name: 'بني', value: '#78350f' },
  { name: 'أسود', value: '#1e293b' },
];

const shuffleArray = <T,>(array: T[]): T[] => {
  return [...array].sort(() => Math.random() - 0.5);
};

const ColorGame: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [targetColor, setTargetColor] = useState(COLORS[0]);
  const [options, setOptions] = useState<typeof COLORS>([]);
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);
  const successAudioRef = useRef<HTMLAudioElement>(null);
  const failureAudioRef = useRef<HTMLAudioElement>(null);

  const generateNewRound = () => {
    setFeedback(null);
    const shuffled = shuffleArray(COLORS);
    const newTarget = shuffled[0];
    setTargetColor(newTarget);

    const otherOptions = shuffled.slice(1, 4);
    const allOptions = shuffleArray([newTarget, ...otherOptions]);
    setOptions(allOptions);
  };

  useEffect(() => {
    generateNewRound();
  }, []);

  const handleOptionClick = (colorValue: string) => {
    if (feedback) return; // Prevent clicking after an answer

    if (colorValue === targetColor.value) {
      setFeedback('correct');
      successAudioRef.current?.play();
      setTimeout(() => {
        generateNewRound();
      }, 1000);
    } else {
      setFeedback('incorrect');
      failureAudioRef.current?.play();
      setTimeout(() => {
        setFeedback(null);
      }, 1000);
    }
  };

  return (
    <div className="bg-slate-800/50 p-4 rounded-lg text-center relative animate-fade-in">
       <button onClick={onBack} className="absolute top-3 left-3 text-white/70 hover:text-white bg-black/20 p-2 rounded-full transition-colors z-10">
          <ArrowRightIcon className="w-6 h-6" />
          <span className="sr-only">رجوع</span>
      </button>
      <h3 className="text-2xl font-bold mb-4">اختر اللون الصحيح</h3>
      <div className="mb-6 h-16 flex items-center justify-center">
        <p className="text-4xl font-black transition-all duration-300" style={{ color: targetColor.value, textShadow: '1px 1px 2px rgba(0,0,0,0.5)' }}>
          {targetColor.name}
        </p>
      </div>
      <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto">
        {options.map((option) => (
          <button
            key={option.value}
            onClick={() => handleOptionClick(option.value)}
            className="relative aspect-square rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg"
            style={{ backgroundColor: option.value }}
            aria-label={option.name}
            disabled={!!feedback}
          >
            {feedback === 'correct' && option.value === targetColor.value && (
              <div className="absolute inset-0 bg-green-500/80 flex items-center justify-center rounded-xl animate-pulse">
                <CheckIcon className="w-16 h-16 text-white" />
              </div>
            )}
             {feedback === 'incorrect' && option.value !== targetColor.value && (
                 <div className="absolute inset-0 bg-black/50 rounded-xl"></div>
            )}
          </button>
        ))}
      </div>
      <audio ref={successAudioRef} src="https://actions.google.com/sounds/v1/positive/success.ogg" preload="auto" />
      <audio ref={failureAudioRef} src="https://actions.google.com/sounds/v1/errors/error_swoosh.ogg" preload="auto" />
    </div>
  );
};

export default ColorGame;