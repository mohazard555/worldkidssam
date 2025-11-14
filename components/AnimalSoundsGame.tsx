import React, { useState, useEffect, useRef } from 'react';
import { SpeakerOnIcon, ArrowRightIcon } from './Icons';

const ANIMALS = [
  { name: 'قطة', soundUrl: 'https://actions.google.com/sounds/v1/animals/cat_purr_close.ogg' },
  { name: 'كلب', soundUrl: 'https://actions.google.com/sounds/v1/animals/dog_barking.ogg' },
  { name: 'بقرة', soundUrl: 'https://actions.google.com/sounds/v1/animals/cow_moo.ogg' },
  { name: 'أسد', soundUrl: 'https://actions.google.com/sounds/v1/animals/lion_growl.ogg' },
  { name: 'خروف', soundUrl: 'https://actions.google.com/sounds/v1/animals/sheep_bleet.ogg' },
  { name: 'حصان', soundUrl: 'https://actions.google.com/sounds/v1/animals/horse_whinny.ogg' },
  { name: 'ديك', soundUrl: 'https://actions.google.com/sounds/v1/animals/rooster_crowing.ogg' },
  { name: 'فيل', soundUrl: 'https://actions.google.com/sounds/v1/animals/elephant_call.ogg' },
];

const shuffleArray = <T,>(array: T[]): T[] => {
  return [...array].sort(() => Math.random() - 0.5);
};

const AnimalSoundsGame: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [targetAnimal, setTargetAnimal] = useState(ANIMALS[0]);
  const [options, setOptions] = useState<typeof ANIMALS>([]);
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);
  const successAudioRef = useRef<HTMLAudioElement>(null);
  const failureAudioRef = useRef<HTMLAudioElement>(null);
  const animalSoundRef = useRef<HTMLAudioElement>(null);

  const generateNewRound = () => {
    setFeedback(null);
    const shuffled = shuffleArray(ANIMALS);
    const newTarget = shuffled[0];
    setTargetAnimal(newTarget);

    const otherOptions = shuffled.slice(1, 4);
    const allOptions = shuffleArray([newTarget, ...otherOptions]);
    setOptions(allOptions);
  };
  
  const playSound = () => {
      if (targetAnimal && animalSoundRef.current) {
          animalSoundRef.current.src = targetAnimal.soundUrl;
          animalSoundRef.current.play().catch(e => console.error("Animal sound play failed:", e));
      }
  };

  useEffect(() => {
    generateNewRound();
  }, []);

  useEffect(() => {
    if(targetAnimal) {
       setTimeout(playSound, 300);
    }
  }, [targetAnimal]);

  const handleOptionClick = (animalName: string) => {
    if (feedback) return;

    if (animalName === targetAnimal.name) {
      setFeedback('correct');
      successAudioRef.current?.play();
      setTimeout(() => {
        generateNewRound();
      }, 1500);
    } else {
      setFeedback('incorrect');
      failureAudioRef.current?.play();
      setTimeout(() => {
        setFeedback(null);
      }, 1000);
    }
  };
  
  const getButtonClass = (animalName: string): string => {
      const isSelectedOption = feedback === 'incorrect' && animalName !== targetAnimal.name;
      const isCorrectAnswer = animalName === targetAnimal.name;
      
      if (!feedback) {
          return "bg-blue-500 hover:bg-blue-600";
      }

      if (feedback === 'correct' && isCorrectAnswer) {
          return "bg-green-600 animate-pulse";
      }
      
      if (feedback === 'incorrect' && isCorrectAnswer) {
          return "bg-green-600";
      }

      if (isSelectedOption) {
          return "bg-red-600";
      }
      
      return "bg-blue-500 opacity-50";
  };

  return (
    <div className="bg-slate-800/50 p-4 rounded-lg text-center relative animate-fade-in">
      <button onClick={onBack} className="absolute top-3 left-3 text-white/70 hover:text-white bg-black/20 p-2 rounded-full transition-colors z-10">
          <ArrowRightIcon className="w-6 h-6" />
          <span className="sr-only">رجوع</span>
      </button>
      <h3 className="text-2xl font-bold mb-4">ما هو صاحب الصوت؟</h3>
      <div className="mb-6">
        <button 
          onClick={playSound}
          className="bg-yellow-400 text-slate-800 p-5 rounded-full shadow-lg transform transition-all hover:scale-110"
          aria-label="إعادة سماع الصوت"
        >
          <SpeakerOnIcon className="w-12 h-12" />
        </button>
      </div>
      <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto">
        {options.map((option) => (
          <button
            key={option.name}
            onClick={() => handleOptionClick(option.name)}
            disabled={!!feedback}
            className={`p-4 text-white font-bold rounded-lg transition-colors duration-300 text-xl ${getButtonClass(option.name)}`}
          >
            {option.name}
          </button>
        ))}
      </div>
      <audio ref={animalSoundRef} preload="auto" />
      <audio ref={successAudioRef} src="https://actions.google.com/sounds/v1/positive/success.ogg" preload="auto" />
      <audio ref={failureAudioRef} src="https://actions.google.com/sounds/v1/errors/error_swoosh.ogg" preload="auto" />
    </div>
  );
};

export default AnimalSoundsGame;