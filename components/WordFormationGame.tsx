import React, { useState, useEffect, useRef } from 'react';
import { ArrowRightIcon, CheckIcon, RedoIcon } from './Icons';

const WORDS = ['بطة', 'أسد', 'قمر', 'شمس', 'بيت'];

const shuffleArray = <T,>(array: T[]): T[] => {
  return [...array].sort(() => Math.random() - 0.5);
};

const WordFormationGame: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [targetWord, setTargetWord] = useState('');
  const [scrambledLetters, setScrambledLetters] = useState<string[]>([]);
  const [userAnswer, setUserAnswer] = useState<string[]>([]);
  const [isComplete, setIsComplete] = useState(false);
  const successAudioRef = useRef<HTMLAudioElement>(null);
  const failureAudioRef = useRef<HTMLAudioElement>(null);

  const setupGame = () => {
    const word = WORDS[Math.floor(Math.random() * WORDS.length)];
    setTargetWord(word);
    setScrambledLetters(shuffleArray(word.split('')));
    setUserAnswer([]);
    setIsComplete(false);
  };

  useEffect(setupGame, []);

  const handleLetterClick = (letter: string, index: number) => {
    setUserAnswer(prev => [...prev, letter]);
    setScrambledLetters(prev => prev.filter((_, i) => i !== index));
  };

  const handleAnswerClick = (letter: string, index: number) => {
    setUserAnswer(prev => prev.filter((_, i) => i !== index));
    setScrambledLetters(prev => [...prev, letter]);
  };
  
  useEffect(() => {
    if (userAnswer.length === targetWord.length) {
      if (userAnswer.join('') === targetWord) {
        setIsComplete(true);
        successAudioRef.current?.play();
      } else {
        failureAudioRef.current?.play();
      }
    }
  }, [userAnswer, targetWord]);


  return (
    <div className="bg-slate-800/50 p-4 rounded-lg text-center relative animate-fade-in">
      <button onClick={onBack} className="absolute top-3 left-3 text-white/70 hover:text-white bg-black/20 p-2 rounded-full transition-colors z-10">
        <ArrowRightIcon className="w-6 h-6" />
        <span className="sr-only">رجوع</span>
      </button>
      <h3 className="text-2xl font-bold mb-4">كوّن الكلمة الصحيحة</h3>
      
      {/* Answer Slots */}
      <div className="flex justify-center items-center gap-2 mb-4 h-24 bg-slate-700/50 rounded-lg p-2" dir="ltr">
        {userAnswer.map((letter, index) => (
          <button key={index} onClick={() => handleAnswerClick(letter, index)} className="w-16 h-16 bg-blue-500 rounded-lg flex items-center justify-center text-4xl font-bold">
            {letter}
          </button>
        ))}
         {Array.from({ length: targetWord.length - userAnswer.length }).map((_, index) => (
          <div key={index} className="w-16 h-16 bg-slate-600 rounded-lg" />
        ))}
      </div>
      
      <hr className="border-slate-600 my-4" />

      {/* Scrambled Letters */}
      <div className="flex justify-center items-center gap-2 h-24">
        {scrambledLetters.map((letter, index) => (
          <button
            key={index}
            onClick={() => handleLetterClick(letter, index)}
            className="w-16 h-16 bg-slate-900 rounded-lg flex items-center justify-center text-4xl font-bold cursor-pointer hover:bg-slate-700"
          >
            {letter}
          </button>
        ))}
      </div>
      
      {isComplete && (
        <div className="mt-4 text-center">
            <h4 className="text-2xl font-bold text-green-400">أحسنت! الكلمة صحيحة.</h4>
            <button onClick={setupGame} className="mt-2 bg-blue-500 text-white font-bold py-2 px-6 rounded-full hover:bg-blue-600">
                العب مرة أخرى
            </button>
        </div>
      )}
      <audio ref={successAudioRef} src="https://actions.google.com/sounds/v1/positive/success.ogg" preload="auto" />
      <audio ref={failureAudioRef} src="https://actions.google.com/sounds/v1/errors/error_swoosh.ogg" preload="auto" />
    </div>
  );
};

export default WordFormationGame;
