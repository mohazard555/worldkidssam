import React, { useState, useEffect, useRef } from 'react';
import { ArrowRightIcon } from './Icons';

const VEHICLES = [
  { name: 'سيارة', emoji: '🚗' },
  { name: 'قطار', emoji: '🚂' },
  { name: 'طائرة', emoji: '✈️' },
  { name: 'دراجة نارية', emoji: '🏍️' },
  { name: 'سفينة', emoji: '🚢' },
  { name: 'إسعاف', emoji: '🚑' },
  { name: 'مطافئ', emoji: '🚒' },
  { name: 'هليكوبتر', emoji: '🚁' },
];

const shuffleArray = <T,>(array: T[]): T[] => {
  return [...array].sort(() => Math.random() - 0.5);
};

const VehicleSoundsGame: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [targetVehicle, setTargetVehicle] = useState(VEHICLES[0]);
  const [options, setOptions] = useState<typeof VEHICLES>([]);
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);
  const successAudioRef = useRef<HTMLAudioElement>(null);
  const failureAudioRef = useRef<HTMLAudioElement>(null);

  const generateNewRound = () => {
    setFeedback(null);
    const shuffled = shuffleArray(VEHICLES);
    const newTarget = shuffled[0];
    setTargetVehicle(newTarget);

    const otherOptions = shuffled.slice(1, 4);
    const allOptions = shuffleArray([newTarget, ...otherOptions]);
    setOptions(allOptions);
  };

  useEffect(() => {
    generateNewRound();
  }, []);

  const handleOptionClick = (vehicleName: string) => {
    if (feedback) return;

    if (vehicleName === targetVehicle.name) {
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
  
  const getButtonClass = (vehicleName: string): string => {
      const isCorrectAnswer = vehicleName === targetVehicle.name;
      
      if (!feedback) {
          return "bg-slate-700 hover:bg-slate-600";
      }

      if (feedback === 'correct' && isCorrectAnswer) {
          return "bg-green-600 animate-pulse";
      }
      
      if (feedback === 'incorrect' && isCorrectAnswer) {
          return "bg-green-600";
      }

      if (feedback === 'incorrect' && !isCorrectAnswer) {
          return "bg-red-600";
      }
      
      return "bg-slate-700 opacity-50";
  };

  return (
    <div className="bg-slate-800/50 p-4 rounded-lg text-center relative animate-fade-in">
      <button onClick={onBack} className="absolute top-3 left-3 text-white/70 hover:text-white bg-black/20 p-2 rounded-full transition-colors z-10">
          <ArrowRightIcon className="w-6 h-6" />
          <span className="sr-only">رجوع</span>
      </button>
      <h3 className="text-2xl font-bold mb-4">ما اسم هذه المركبة؟</h3>
      <div className="mb-6 flex items-center justify-center text-8xl h-28">
        <span className="animate-bounce">{targetVehicle.emoji}</span>
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
      <audio ref={successAudioRef} src="https://actions.google.com/sounds/v1/positive/success.ogg" preload="auto" />
      <audio ref={failureAudioRef} src="https://actions.google.com/sounds/v1/errors/error_swoosh.ogg" preload="auto" />
    </div>
  );
};

export default VehicleSoundsGame;