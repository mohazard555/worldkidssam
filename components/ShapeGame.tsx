import React, { useState, useEffect, useRef } from 'react';
import { CheckIcon, ArrowRightIcon } from './Icons';

interface Shape {
    name: string;
    component: React.FC<{ className?: string }>;
}

const SvgCircle: React.FC<{ className?: string }> = ({ className }) => <svg viewBox="0 0 100 100" className={className}><circle cx="50" cy="50" r="45" fill="currentColor"/></svg>;
const SvgSquare: React.FC<{ className?: string }> = ({ className }) => <svg viewBox="0 0 100 100" className={className}><rect x="5" y="5" width="90" height="90" rx="10" fill="currentColor"/></svg>;
const SvgTriangle: React.FC<{ className?: string }> = ({ className }) => <svg viewBox="0 0 100 100" className={className}><polygon points="50,10 95,90 5,90" fill="currentColor"/></svg>;
const SvgStar: React.FC<{ className?: string }> = ({ className }) => <svg viewBox="0 0 100 100" className={className}><polygon points="50,5 61,40 98,40 68,62 79,96 50,75 21,96 32,62 2,40 39,40" fill="currentColor"/></svg>;

const SHAPES: Shape[] = [
  { name: 'دائرة', component: SvgCircle },
  { name: 'مربع', component: SvgSquare },
  { name: 'مثلث', component: SvgTriangle },
  { name: 'نجمة', component: SvgStar },
];

const COLORS = ['#ef4444', '#3b82f6', '#22c55e', '#eab308', '#f97316', '#8b5cf6', '#ec4899'];

const shuffleArray = <T,>(array: T[]): T[] => {
  return [...array].sort(() => Math.random() - 0.5);
};

const ShapeGame: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [targetShape, setTargetShape] = useState(SHAPES[0]);
  const [options, setOptions] = useState<Shape[]>([]);
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);
  const successAudioRef = useRef<HTMLAudioElement>(null);
  const failureAudioRef = useRef<HTMLAudioElement>(null);

  const generateNewRound = () => {
    setFeedback(null);
    const shuffledShapes = shuffleArray(SHAPES);
    const newTarget = shuffledShapes[0];
    setTargetShape(newTarget);
    setOptions(shuffleArray(SHAPES)); // Always show all 4 shapes
  };

  useEffect(() => {
    generateNewRound();
  }, []);

  const handleOptionClick = (shapeName: string) => {
    if (feedback) return;

    if (shapeName === targetShape.name) {
      setFeedback('correct');
      successAudioRef.current?.play();
      setTimeout(() => {
        generateNewRound();
      }, 1000);
    } else {
      setFeedback('incorrect');
      failureAudioRef.current?.play();
      setTimeout(() => {
        setFeedback(null);
      }, 1000);
    }
  };

  return (
    <div className="bg-slate-800/50 p-4 rounded-lg text-center relative animate-fade-in">
      <button onClick={onBack} className="absolute top-3 left-3 text-white/70 hover:text-white bg-black/20 p-2 rounded-full transition-colors z-10">
          <ArrowRightIcon className="w-6 h-6" />
          <span className="sr-only">رجوع</span>
      </button>
      <h3 className="text-2xl font-bold mb-4">اختر الشكل الصحيح</h3>
      <div className="mb-6 h-16 flex items-center justify-center">
        <p className="text-4xl font-black text-yellow-300 transition-all duration-300" style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.5)' }}>
          {targetShape.name}
        </p>
      </div>
      <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto">
        {options.map((option, index) => {
          const ShapeComponent = option.component;
          const color = COLORS[index % COLORS.length];
          return (
            <button
                key={option.name}
                onClick={() => handleOptionClick(option.name)}
                className="relative aspect-square rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center justify-center p-4 bg-blue-500"
                aria-label={option.name}
                disabled={!!feedback}
            >
                <ShapeComponent className="w-24 h-24" style={{ color: color }}/>

                {feedback === 'correct' && option.name === targetShape.name && (
                <div className="absolute inset-0 bg-green-500/80 flex items-center justify-center rounded-xl animate-pulse">
                    <CheckIcon className="w-16 h-16 text-white" />
                </div>
                )}
                 {feedback === 'incorrect' && option.name !== targetShape.name && (
                 <div className="absolute inset-0 bg-black/50 rounded-xl"></div>
                )}
            </button>
        )})}
      </div>
      <audio ref={successAudioRef} src="https://actions.google.com/sounds/v1/positive/success.ogg" preload="auto" />
      <audio ref={failureAudioRef} src="https://actions.google.com/sounds/v1/errors/error_swoosh.ogg" preload="auto" />
    </div>
  );
};

export default ShapeGame;
