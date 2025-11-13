import React, { useState, useContext } from 'react';
import { AppContext } from '../App';
import type { ColorFlashcard } from '../types';
import { ArrowRightIcon } from './Icons';

const ColorFlashcards: React.FC = () => {
    const { appData } = useContext(AppContext)!;
    const colorFlashcardsData = appData.settings.colorFlashcards || [];
    const [selectedColor, setSelectedColor] = useState<ColorFlashcard | null>(null);
    
    // Function to determine if text should be dark or light based on background color
    const getTextColor = (hex: string) => {
        const r = parseInt(hex.substr(1, 2), 16);
        const g = parseInt(hex.substr(3, 2), 16);
        const b = parseInt(hex.substr(5, 2), 16);
        const yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;
        return (yiq >= 128) ? 'text-black' : 'text-white';
    };


    if (selectedColor) {
        return (
            <div className="relative animate-fade-in w-full aspect-[4/3] max-w-2xl mx-auto rounded-2xl shadow-2xl p-6 flex flex-col items-center justify-center" style={{ backgroundColor: selectedColor.hex }}>
                <button 
                    onClick={() => setSelectedColor(null)}
                    className="absolute top-4 left-4 bg-black/20 hover:bg-black/40 p-2 rounded-full transition-colors"
                    aria-label="رجوع"
                >
                    <ArrowRightIcon className={`w-8 h-8 ${getTextColor(selectedColor.hex)}`}/>
                </button>
                <div className={`text-6xl font-black mt-4 ${getTextColor(selectedColor.hex)}`} style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.3)'}}>
                    {selectedColor.name}
                </div>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4">
            {colorFlashcardsData.map((colorData) => (
                <button 
                    key={colorData.name} 
                    onClick={() => setSelectedColor(colorData)}
                    className="rounded-lg shadow-lg aspect-square flex items-end justify-center p-2 animate-fade-in transition-all duration-300 hover:scale-110 hover:shadow-2xl"
                    style={{ backgroundColor: colorData.hex }}
                    aria-label={`بطاقة لون ${colorData.name}`}
                >
                    <p className={`font-bold text-sm ${getTextColor(colorData.hex)} bg-black/30 px-2 py-0.5 rounded-full`}>
                        {colorData.name}
                    </p>
                </button>
            ))}
        </div>
    );
};

export default ColorFlashcards;