import React, { useState, useEffect, useRef } from 'react';
import { CheckIcon, ArrowRightIcon } from './Icons';

interface NumberProblem {
  emoji: string;
  count: number;
  options: number[];
}

const EMOJIS = ['🍎', '⚽️', '🐱', '☀️', '🚗', '🏠', '⭐️', '🎈', '🍕', '🍓'];

const shuffleArray = <T,>(array: T[]): T[] => {
  return [...array].sort(() => Math.random() - 0.5);
};

const generateProblem = (): NumberProblem => {
    const targetCount = Math.floor(Math.random() * 9) + 2; // 2-10
    const targetEmoji = EMOJIS[Math.floor(Math.random() * EMOJIS.length)];
    
    let options: number[] = [targetCount];
    while (options.length < 4) {
        let wrongNumber;
        do {
            wrongNumber = Math.floor(Math.random() * 9) + 2;
        } while (options.includes(wrongNumber));
        options.push(wrongNumber);
    }
    
    return {
        emoji: targetEmoji,
        count: targetCount,
        options: shuffleArray(options)
    };
};

const NumberGame: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [problem, setProblem] = useState<NumberProblem>(generateProblem());
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);

  const successAudioRef = useRef<HTMLAudioElement>(null);
  const failureAudioRef = useRef<HTMLAudioElement>(null);

  const generateNewRound = () => {
    setFeedback(null);
    setSelectedOption(null);
    setProblem(generateProblem());
  };

  const handleOptionClick = (option: number) => {
    if (feedback) return;
    
    setSelectedOption(option);

    if (option === problem.count) {
      setFeedback('correct');
      successAudioRef.current?.play();
      setTimeout(() => {
        generateNewRound();
      }, 1200);
    } else {
      setFeedback('incorrect');
      failureAudioRef.current?.play();
      setTimeout(() => {
        setFeedback(null);
        setSelectedOption(null);
      }, 1000);
    }
  };

  return (
    <div className="bg-slate-800/50 p-4 rounded-lg text-center relative animate-fade-in">
      <button onClick={onBack} className="absolute top-3 left-3 text-white/70 hover:text-white bg-black/20 p-2 rounded-full transition-colors z-10">
          <ArrowRightIcon className="w-6 h-6" />
          <span className="sr-only">رجوع</span>
      </button>
      <h3 className="text-2xl font-bold mb-4">كم عدد الأشياء في الصورة؟</h3>

      <div className="mb-6 min-h-[120px] flex items-center justify-center p-4 bg-slate-700/50 rounded-lg">
        <div className="text-4xl leading-none grid grid-cols-5 gap-2">
            {Array.from({ length: problem.count }).map((_, i) => (
                <span key={i} className="animate-fade-in" style={{animationDelay: `${i*50}ms`}}>{problem.emoji}</span>
            ))}
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto">
        {problem.options.map((option, index) => {
            const isCorrect = option === problem.count;
            const isSelected = selectedOption === option;

            let buttonClass = 'bg-blue-500 hover:bg-blue-600';

            if (feedback && isSelected) {
                buttonClass = isCorrect ? 'bg-green-500 animate-pulse' : 'bg-red-500';
            } else if (feedback && !isSelected) {
                buttonClass = isCorrect ? 'bg-green-500' : 'bg-blue-500 opacity-50';
            }

            return (
              <button
                key={index}
                onClick={() => handleOptionClick(option)}
                className={`aspect-square rounded-xl transition-all duration-300 transform shadow-lg flex items-center justify-center p-2 text-5xl font-bold ${buttonClass}`}
                disabled={!!feedback}
              >
               {option}
              </button>
            )
        })}
      </div>
      <audio ref={successAudioRef} src="https://actions.google.com/sounds/v1/positive/success.ogg" preload="auto" />
      <audio ref={failureAudioRef} src="https://actions.google.com/sounds/v1/errors/error_swoosh.ogg" preload="auto" />
    </div>
  );
};

export default NumberGame;
