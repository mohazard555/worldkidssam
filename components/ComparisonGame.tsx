import React, { useState, useEffect, useRef } from 'react';
import { ArrowRightIcon, CheckIcon } from './Icons';

interface ComparisonProblem {
  options: { emoji: string; count: number }[];
  answer: number;
}

const EMOJIS = ['⚽️', '🍓', '🚗', '⭐️', '🎈'];

const generateProblem = (): ComparisonProblem => {
  const emoji = EMOJIS[Math.floor(Math.random() * EMOJIS.length)];
  let num1, num2;
  do {
    num1 = Math.floor(Math.random() * 9) + 1;
    num2 = Math.floor(Math.random() * 9) + 1;
  } while (num1 === num2);
  
  const options = [{ emoji, count: num1 }, { emoji, count: num2 }];
  const answer = Math.max(num1, num2);

  return { options, answer };
};

const ComparisonGame: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [problem, setProblem] = useState<ComparisonProblem>(generateProblem());
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);
  const successAudioRef = useRef<HTMLAudioElement>(null);
  const failureAudioRef = useRef<HTMLAudioElement>(null);

  const newRound = () => {
    setFeedback(null);
    setProblem(generateProblem());
  };

  const handleOptionClick = (count: number) => {
    if (feedback) return;

    if (count === problem.answer) {
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
      <h3 className="text-2xl font-bold mb-4">اختر المجموعة الأكبر</h3>
      
      <div className="grid grid-cols-2 gap-4 max-w-lg mx-auto">
        {problem.options.map((option, index) => (
          <button
            key={index}
            onClick={() => handleOptionClick(option.count)}
            disabled={!!feedback}
            className={`relative aspect-square rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center justify-center p-2
            ${feedback && option.count !== problem.answer ? 'bg-slate-700 opacity-60' : 'bg-blue-500'}
            `}
          >
            <div className="text-4xl leading-tight grid grid-cols-3 gap-1">
              {Array.from({ length: option.count }).map((_, i) => <span key={i}>{option.emoji}</span>)}
            </div>
            {feedback === 'correct' && option.count === problem.answer && (
              <div className="absolute inset-0 bg-green-500/80 flex items-center justify-center rounded-xl animate-pulse">
                <CheckIcon className="w-16 h-16 text-white" />
              </div>
            )}
          </button>
        ))}
      </div>
      <audio ref={successAudioRef} src="https://actions.google.com/sounds/v1/positive/success.ogg" preload="auto" />
      <audio ref={failureAudioRef} src="https://actions.google.com/sounds/v1/errors/error_swoosh.ogg" preload="auto" />
    </div>
  );
};

export default ComparisonGame;
