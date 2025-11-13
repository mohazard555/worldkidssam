import React, { useState, useEffect, useRef } from 'react';
import { ArrowRightIcon, CheckIcon } from './Icons';

interface AdditionProblem {
  num1: number;
  num2: number;
  answer: number;
  options: number[];
  emoji: string;
}

const EMOJIS = ['🐠', '🍎', '🚗', '⭐️', '🎈'];

const shuffleArray = <T,>(array: T[]): T[] => {
  return [...array].sort(() => Math.random() - 0.5);
};

const generateProblem = (): AdditionProblem => {
  const num1 = Math.floor(Math.random() * 5) + 1;
  const num2 = Math.floor(Math.random() * 5) + 1;
  const answer = num1 + num2;
  const emoji = EMOJIS[Math.floor(Math.random() * EMOJIS.length)];

  let options = [answer];
  while (options.length < 4) {
    let wrongAnswer;
    do {
      wrongAnswer = Math.floor(Math.random() * 9) + 2;
    } while (options.includes(wrongAnswer));
    options.push(wrongAnswer);
  }

  return { num1, num2, answer, options: shuffleArray(options), emoji };
};

const AdditionGame: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [problem, setProblem] = useState<AdditionProblem>(generateProblem());
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);
  const successAudioRef = useRef<HTMLAudioElement>(null);
  const failureAudioRef = useRef<HTMLAudioElement>(null);

  const newRound = () => {
    setFeedback(null);
    setProblem(generateProblem());
  };

  const handleOptionClick = (option: number) => {
    if (feedback) return;

    if (option === problem.answer) {
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
      <h3 className="text-2xl font-bold mb-4">ما هو المجموع؟</h3>

      <div className="mb-6 flex items-center justify-center text-4xl space-x-4 space-x-reverse h-24">
        <div className="flex gap-1">
          {Array.from({ length: problem.num1 }).map((_, i) => <span key={i}>{problem.emoji}</span>)}
        </div>
        <span className="text-yellow-300 font-bold">+</span>
        <div className="flex gap-1">
          {Array.from({ length: problem.num2 }).map((_, i) => <span key={i}>{problem.emoji}</span>)}
        </div>
        <span className="text-yellow-300 font-bold">=</span>
        <span className="text-yellow-300 font-bold text-5xl">?</span>
      </div>

      <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto">
        {problem.options.map((option) => (
          <button
            key={option}
            onClick={() => handleOptionClick(option)}
            disabled={!!feedback}
            className={`relative p-4 text-white font-bold rounded-lg transition-colors duration-300 text-4xl
            ${feedback === 'correct' && option === problem.answer ? 'bg-green-500 animate-pulse' : ''}
            ${feedback === 'incorrect' && option !== problem.answer ? 'bg-blue-500 opacity-50' : 'bg-blue-500 hover:bg-blue-600'}`}
          >
            {option}
            {feedback === 'incorrect' && option === problem.answer && (
              <div className="absolute inset-0 bg-green-500/80 flex items-center justify-center rounded-lg">
                <CheckIcon className="w-12 h-12 text-white" />
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

export default AdditionGame;
