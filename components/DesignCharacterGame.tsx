import React, { useState } from 'react';
import { ArrowRightIcon } from './Icons';

const HAIR_OPTIONS = ['#2c1d10', '#a56224', '#f5d689', '#e84a4a'];
const EYES_OPTIONS = ['#3a86ff', '#3c9a40', '#7b4f2c'];
const CLOTHES_OPTIONS = ['#ef476f', '#ffd166', '#06d6a0', '#118ab2'];

const DesignCharacterGame: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [hairColor, setHairColor] = useState(HAIR_OPTIONS[0]);
  const [eyeColor, setEyeColor] = useState(EYES_OPTIONS[0]);
  const [clothesColor, setClothesColor] = useState(CLOTHES_OPTIONS[0]);

  const Character = () => (
    <svg viewBox="0 0 100 150" className="w-full h-full">
      {/* Head */}
      <circle cx="50" cy="40" r="25" fill="#f2d5b1" />
      {/* Eyes */}
      <circle cx="40" cy="40" r="4" fill={eyeColor} />
      <circle cx="60" cy="40" r="4" fill={eyeColor} />
      {/* Smile */}
      <path d="M 40 50 Q 50 58 60 50" stroke="#99582a" strokeWidth="2" fill="none" />
      {/* Hair */}
      <path d="M 25 40 Q 50 10 75 40 L 75 25 C 75 10 25 10 25 25 Z" fill={hairColor} />
      {/* Body */}
      <path d="M 35 65 L 35 120 C 35 140 65 140 65 120 L 65 65 Z" fill={clothesColor} />
    </svg>
  );

  const OptionButton: React.FC<{ color: string, onClick: () => void, isSelected: boolean }> = ({ color, onClick, isSelected }) => (
    <button
      onClick={onClick}
      className={`w-12 h-12 rounded-full transition-all duration-200 border-4 ${isSelected ? 'border-yellow-300 scale-110' : 'border-transparent'}`}
      style={{ backgroundColor: color }}
      aria-label={`Select color ${color}`}
    />
  );

  return (
    <div className="bg-slate-800/50 p-4 rounded-lg text-center relative animate-fade-in">
      <button onClick={onBack} className="absolute top-3 left-3 text-white/70 hover:text-white bg-black/20 p-2 rounded-full transition-colors z-10">
        <ArrowRightIcon className="w-6 h-6" />
        <span className="sr-only">رجوع</span>
      </button>
      <h3 className="text-2xl font-bold mb-4">صمم شخصيتك</h3>
      
      <div className="flex flex-col md:flex-row items-center justify-center gap-4">
        {/* Character Display */}
        <div className="w-48 h-72 bg-slate-700 rounded-lg p-2">
          <Character />
        </div>

        {/* Options */}
        <div className="space-y-4">
          <div>
            <h4 className="font-bold mb-2">الشعر</h4>
            <div className="flex gap-2 justify-center">{HAIR_OPTIONS.map(c => <OptionButton key={c} color={c} onClick={() => setHairColor(c)} isSelected={hairColor === c} />)}</div>
          </div>
          <div>
            <h4 className="font-bold mb-2">العيون</h4>
            <div className="flex gap-2 justify-center">{EYES_OPTIONS.map(c => <OptionButton key={c} color={c} onClick={() => setEyeColor(c)} isSelected={eyeColor === c} />)}</div>
          </div>
          <div>
            <h4 className="font-bold mb-2">الملابس</h4>
            <div className="flex gap-2 justify-center">{CLOTHES_OPTIONS.map(c => <OptionButton key={c} color={c} onClick={() => setClothesColor(c)} isSelected={clothesColor === c} />)}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DesignCharacterGame;
