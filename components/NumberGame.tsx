import React, { useState, useEffect } from 'react';
import { CheckIcon, ArrowLeftIcon } from './Icons';

interface NumberProblem {
  target: number;
  items: { emoji: string; count: number }[];
}

const EMOJIS = ['🍎', '⚽️', '🐱', '☀️', '🚗', '🏠', '⭐️', '🎈', '🍕', '🍓'];

const shuffleArray = <T,>(array: T[]): T[] => {
  return [...array].sort(() => Math.random() - 0.5);
};

const generateProblem = (): NumberProblem => {
    const targetNumber = Math.floor(Math.random() * 9) + 1; // 1-9
    let options: { emoji: string; count: number }[] = [];
    
    // Create the correct option
    const correctEmoji = EMOJIS[Math.floor(Math.random() * EMOJIS.length)];
    options.push({ emoji: correctEmoji, count: targetNumber });

    // Create 3 incorrect options
    const availableEmojis = EMOJIS.filter(e => e !== correctEmoji);
    const shuffledEmojis = shuffleArray(availableEmojis);

    for (let i = 0; i < 3; i++) {
        let wrongNumber;
        do {
            wrongNumber = Math.floor(Math.random() * 9) + 1;
        } while (wrongNumber === targetNumber || options.some(o => o.count === wrongNumber));
        options.push({ emoji: shuffledEmojis[i], count: wrongNumber });
    }
    
    return {
        target: targetNumber,
        items: shuffleArray(options)
    };
};

const NumberGame: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [problem, setProblem] = useState<NumberProblem>(generateProblem());
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);

  const generateNewRound = () => {
    setFeedback(null);
    setProblem(generateProblem());
  };

  const handleOptionClick = (count: number) => {
    if (feedback) return;

    if (count === problem.target) {
      setFeedback('correct');
      setTimeout(() => {
        generateNewRound();
      }, 1000);
    } else {
      setFeedback('incorrect');
      setTimeout(() => {
        setFeedback(null);
      }, 1000);
    }
  };

  return (
    <div className="bg-slate-800/50 p-4 rounded-lg text-center relative animate-fade-in">
      <button onClick={onBack} className="absolute top-3 left-3 text-white/70 hover:text-white bg-black/20 p-2 rounded-full transition-colors z-10">
          <ArrowLeftIcon className="w-6 h-6" />
          <span className="sr-only">رجوع</span>
      </button>
      <h3 className="text-2xl font-bold mb-4">اختر المجموعة الصحيحة</h3>
      <div className="mb-6 h-16 flex items-center justify-center">
        <p className="text-6xl font-black text-yellow-300" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.5)' }}>
          {problem.target}
        </p>
      </div>
      <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto">
        {problem.items.map((option, index) => (
          <button
            key={index}
            onClick={() => handleOptionClick(option.count)}
            className={`relative aspect-square rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center justify-center p-2
            ${feedback && option.count !== problem.target ? 'bg-slate-700 opacity-60' : 'bg-blue-500'}
            `}
            aria-label={`${option.count} ${option.emoji}`}
            disabled={!!feedback}
          >
            <div className="text-4xl leading-none grid grid-cols-3 gap-1">
                {Array.from({ length: option.count }).map((_, i) => (
                    <span key={i}>{option.emoji}</span>
                ))}
            </div>

            {feedback === 'correct' && option.count === problem.target && (
              <div className="absolute inset-0 bg-green-500/80 flex items-center justify-center rounded-xl animate-pulse">
                <CheckIcon className="w-16 h-16 text-white" />
              </div>
            )}
            {feedback === 'incorrect' && option.count !== problem.target && (
                 <div className="absolute inset-0 bg-black/50 rounded-xl"></div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default NumberGame;