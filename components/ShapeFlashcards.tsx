import React, { useState, useContext } from 'react';
import { AppContext } from '../App';
import type { ShapeFlashcard } from '../types';
import { ArrowRightIcon } from './Icons';

const ShapeFlashcards: React.FC = () => {
    const { appData } = useContext(AppContext)!;
    const shapeFlashcardsData = appData.settings.shapeFlashcards || [];
    const [selectedShape, setSelectedShape] = useState<ShapeFlashcard | null>(null);

    if (selectedShape) {
        return (
            <div className={`relative animate-fade-in w-full aspect-[4/3] max-w-2xl mx-auto rounded-2xl shadow-2xl p-6 flex flex-col items-center justify-center text-white ${selectedShape.colorClass}`}>
                <button 
                    onClick={() => setSelectedShape(null)}
                    className="absolute top-4 left-4 bg-white/20 hover:bg-white/40 p-2 rounded-full transition-colors"
                    aria-label="رجوع"
                >
                    <ArrowRightIcon className="w-8 h-8"/>
                </button>

                <div className="w-64 h-64">
                    <img src={selectedShape.image} alt={selectedShape.name} className="w-full h-full object-contain" style={{filter: 'drop-shadow(0 5px 10px rgba(0,0,0,0.3))'}} />
                </div>
                <div className="text-5xl font-bold mt-4">
                    {selectedShape.name}
                </div>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {shapeFlashcardsData.map((shapeData) => (
                <button 
                    key={shapeData.name} 
                    onClick={() => setSelectedShape(shapeData)}
                    className={`rounded-lg shadow-lg aspect-square flex flex-col items-center justify-center p-4 animate-fade-in transition-all duration-300 hover:scale-110 hover:shadow-2xl ${shapeData.colorClass}`}
                    aria-label={`بطاقة شكل ${shapeData.name}`}
                >
                    <div className="w-24 h-24">
                        <img src={shapeData.image} alt={shapeData.name} className="w-full h-full object-contain" style={{filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.2))'}}/>
                    </div>
                    <p className="text-white font-bold text-xl mt-2">
                        {shapeData.name}
                    </p>
                </button>
            ))}
        </div>
    );
};

export default ShapeFlashcards;