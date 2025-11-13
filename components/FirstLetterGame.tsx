import React, { useState, useEffect, useRef } from 'react';
import { ArrowRightIcon, CheckIcon } from './Icons';

interface GameItem {
  image: string;
  word: string;
  correctLetter: string;
  options: string[];
}

const ITEMS: Omit<GameItem, 'options'>[] = [
  { image: '🍎', word: 'تفاحة', correctLetter: 'أ' },
  { image: '🍌', word: 'موز', correctLetter: 'م' },
  { image: '🐱', word: 'قطة', correctLetter: 'ق' },
  { image: '🐶', word: 'كلب', correctLetter: 'ك' },
  { image: '☀️', word: 'شمس', correctLetter: 'ش' },
  { image: '🌙', word: 'قمر', correctLetter: 'ق' },
];

const ALL_LETTERS = 'أبتثجحخدذرزسشصضطظعغفقكلمنهوي'.split('');

const shuffleArray = <T,>(array: T[]): T[] => {
  return [...array].sort(() => Math.random() - 0.5);
};

const generateProblem = (): GameItem => {
    const item = ITEMS[Math.floor(Math.random() * ITEMS.length)];
    let options = [item.correctLetter];
    while(options.length < 4) {
        const randomLetter = ALL_LETTERS[Math.floor(Math.random() * ALL_LETTERS.length)];
        if (!options.includes(randomLetter)) {
            options.push(randomLetter);
        }
    }
    return { ...item, options: shuffleArray(options) };
};

const FirstLetterGame: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [problem, setProblem] = useState<GameItem>(generateProblem());
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);
  const successAudioRef = useRef<HTMLAudioElement>(null);
  const failureAudioRef = useRef<HTMLAudioElement>(null);

  const generateNewRound = () => {
    setFeedback(null);
    setProblem(generateProblem());
  };

  const handleOptionClick = (letter: string) => {
    if (feedback) return;

    if (letter === problem.correctLetter) {
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
      <h3 className="text-2xl font-bold mb-4">ما هو الحرف الأول؟</h3>
      <div className="mb-6 flex items-center justify-center text-8xl bg-slate-700/50 rounded-lg p-4 h-40">
        {problem.image}
      </div>
      <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto">
        {problem.options.map((letter) => (
          <button
            key={letter}
            onClick={() => handleOptionClick(letter)}
            disabled={!!feedback}
            className={`relative p-4 text-white font-bold rounded-lg transition-colors duration-300 text-4xl
            ${feedback === 'correct' && letter === problem.correctLetter ? 'bg-green-500 animate-pulse' : ''}
            ${feedback === 'incorrect' && letter !== problem.correctLetter ? 'bg-blue-500 opacity-50' : 'bg-blue-500 hover:bg-blue-600'}
            `}
          >
            {letter}
            {feedback === 'incorrect' && letter === problem.correctLetter && (
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

export default FirstLetterGame;
