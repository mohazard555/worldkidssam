import React, { useState, useEffect, useRef } from 'react';
import { ArrowRightIcon } from './Icons';

interface Weather {
  id: 'sunny' | 'rainy' | 'snowy';
  emoji: string;
  name: string;
}
interface Clothing {
  id: 'sunglasses' | 'umbrella' | 'jacket';
  emoji: string;
  weather: 'sunny' | 'rainy' | 'snowy';
}
const WEATHERS: Weather[] = [
  { id: 'sunny', emoji: '☀️', name: 'مشمس' },
  { id: 'rainy', emoji: '🌧️', name: 'ممطر' },
  { id: 'snowy', emoji: '❄️', name: 'مثلج' },
];
const CLOTHINGS: Clothing[] = [
  { id: 'sunglasses', emoji: '😎', weather: 'sunny' },
  { id: 'umbrella', emoji: '☂️', weather: 'rainy' },
  { id: 'jacket', emoji: '🧥', weather: 'snowy' },
];

const shuffleArray = <T,>(array: T[]): T[] => {
  return [...array].sort(() => Math.random() - 0.5);
};

const WeatherGame: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [currentWeather, setCurrentWeather] = useState<Weather | null>(null);
  const [options, setOptions] = useState<Clothing[]>([]);
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);
  const successAudioRef = useRef<HTMLAudioElement>(null);
  const failureAudioRef = useRef<HTMLAudioElement>(null);

  const setupGame = () => {
    const weather = WEATHERS[Math.floor(Math.random() * WEATHERS.length)];
    setCurrentWeather(weather);
    setOptions(shuffleArray(CLOTHINGS));
    setFeedback(null);
  };

  useEffect(setupGame, []);

  const handleOptionClick = (clothing: Clothing) => {
    if (feedback || !currentWeather) return;

    if (clothing.weather === currentWeather.id) {
        setFeedback('correct');
        successAudioRef.current?.play();
        setTimeout(setupGame, 1200);
    } else {
        setFeedback('incorrect');
        failureAudioRef.current?.play();
        setTimeout(() => setFeedback(null), 1000);
    }
  };

  if (!currentWeather) return null;

  return (
    <div className="bg-slate-800/50 p-4 rounded-lg text-center relative animate-fade-in">
      <button onClick={onBack} className="absolute top-3 left-3 text-white/70 hover:text-white bg-black/20 p-2 rounded-full transition-colors z-10">
        <ArrowRightIcon className="w-6 h-6" />
        <span className="sr-only">رجوع</span>
      </button>
      <h3 className="text-2xl font-bold mb-2">الجو اليوم {currentWeather.name}</h3>
      <p className="text-lg text-slate-300 mb-4">ماذا يجب أن نرتدي؟</p>
      
      <div className="mb-6 flex items-center justify-center text-8xl h-28">
        {currentWeather.emoji}
      </div>
      
      <div className="flex justify-center items-center gap-4 max-w-lg mx-auto">
        {options.map((clothing) => (
          <button
            key={clothing.id}
            onClick={() => handleOptionClick(clothing)}
            disabled={!!feedback}
            className={`aspect-square w-24 h-24 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg flex flex-col items-center justify-center p-2 text-6xl
            ${feedback === 'correct' && clothing.weather === currentWeather.id ? 'bg-green-500 animate-pulse' : ''}
            ${feedback === 'incorrect' && clothing.weather !== currentWeather.id ? 'bg-blue-500 opacity-50' : 'bg-blue-500'}
            `}
          >
            {clothing.emoji}
          </button>
        ))}
      </div>
       <audio ref={successAudioRef} src="https://actions.google.com/sounds/v1/positive/success.ogg" preload="auto" />
       <audio ref={failureAudioRef} src="https://actions.google.com/sounds/v1/errors/error_swoosh.ogg" preload="auto" />
    </div>
  );
};

export default WeatherGame;
