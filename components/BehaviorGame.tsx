import React, { useState, useEffect, useRef } from 'react';
import { ArrowRightIcon, CheckIcon } from './Icons';

interface Situation {
  id: string;
  prompt: string;
  emoji: string;
  options: { text: string; correct: boolean }[];
}

const SITUATIONS: Situation[] = [
  {
    id: 'trash',
    prompt: 'تجد قمامة على الأرض، ماذا تفعل؟',
    emoji: '🗑️',
    options: [
      { text: 'أضعها في سلة المهملات', correct: true },
      { text: 'أتركها مكانها', correct: false },
    ],
  },
  {
    id: 'friend_crying',
    prompt: 'صديقك يبكي، ماذا تفعل؟',
    emoji: '😢',
    options: [
      { text: 'أضحك عليه', correct: false },
      { text: 'أواسيه وأسأله ما به', correct: true },
    ],
  },
   {
    id: 'sharing',
    prompt: 'لديك لعبة واحدة وصديقك يريد اللعب بها، ماذا تفعل؟',
    emoji: '🧸',
    options: [
      { text: 'أشاركه اللعبة', correct: true },
      { text: 'أرفض وألعب وحدي', correct: false },
    ],
  },
];

const shuffleArray = <T,>(array: T[]): T[] => {
  return [...array].sort(() => Math.random() - 0.5);
};


const BehaviorGame: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [situation, setSituation] = useState<Situation>(SITUATIONS[0]);
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);
  const successAudioRef = useRef<HTMLAudioElement>(null);
  const failureAudioRef = useRef<HTMLAudioElement>(null);

  const newRound = () => {
    setFeedback(null);
    const newSituation = SITUATIONS[Math.floor(Math.random() * SITUATIONS.length)];
    setSituation({ ...newSituation, options: shuffleArray(newSituation.options) });
  };
  
  useEffect(newRound, []);

  const handleOptionClick = (option: { text: string; correct: boolean }) => {
    if (feedback) return;

    if (option.correct) {
      setFeedback('correct');
      successAudioRef.current?.play();
      setTimeout(newRound, 1500);
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
      <h3 className="text-2xl font-bold mb-2">تصرف صح!</h3>
      
      <div className="mb-4 flex items-center justify-center text-7xl h-24">
        {situation.emoji}
      </div>
      <p className="text-xl text-slate-200 mb-6 min-h-[56px]">{situation.prompt}</p>

      <div className="grid grid-cols-1 gap-4 max-w-md mx-auto">
        {situation.options.map((option, index) => (
          <button
            key={index}
            onClick={() => handleOptionClick(option)}
            disabled={!!feedback}
            className={`relative p-4 text-white font-bold rounded-lg transition-colors duration-300 text-lg
            ${feedback === 'correct' && option.correct ? 'bg-green-500 animate-pulse' : ''}
            ${feedback === 'incorrect' && !option.correct ? 'bg-red-500' : ''}
            ${!feedback ? 'bg-blue-500 hover:bg-blue-600' : ''}
            ${feedback && !option.correct ? 'opacity-50' : ''}
            `}
          >
            {option.text}
          </button>
        ))}
      </div>
      <audio ref={successAudioRef} src="https://actions.google.com/sounds/v1/positive/success.ogg" preload="auto" />
      <audio ref={failureAudioRef} src="https://actions.google.com/sounds/v1/errors/error_swoosh.ogg" preload="auto" />
    </div>
  );
};

export default BehaviorGame;
