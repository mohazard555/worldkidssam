import React, { useState, useContext } from 'react';
import { AppContext } from '../App';
import type { FunnyFlashcard } from '../types';
import { ArrowRightIcon } from './Icons';

const isBase64Image = (str: string) => str.startsWith('data:image');

const FunnyFlashcards: React.FC = () => {
    const { appData } = useContext(AppContext)!;
    const funnyFlashcardsData = appData.settings.funnyFlashcards || [];
    const [selectedCard, setSelectedCard] = useState<FunnyFlashcard | null>(null);

    if (selectedCard) {
        return (
            <div className="relative animate-fade-in w-full aspect-[4/3] max-w-2xl mx-auto rounded-2xl shadow-2xl p-6 flex flex-col items-center justify-center text-white bg-amber-500">
                <button 
                    onClick={() => setSelectedCard(null)}
                    className="absolute top-4 left-4 bg-white/20 hover:bg-white/40 p-2 rounded-full transition-colors"
                    aria-label="رجوع"
                >
                    <ArrowRightIcon className="w-8 h-8"/>
                </button>
                <div className="text-[12rem] h-48 flex items-center justify-center">
                     {isBase64Image(selectedCard.image) ? (
                        <img src={selectedCard.image} alt={selectedCard.name} className="h-full object-contain" />
                    ) : (
                        <span>{selectedCard.image}</span>
                    )}
                </div>
                <div className="text-5xl font-bold mt-4">
                    {selectedCard.name}
                </div>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4">
            {funnyFlashcardsData.map((cardData) => (
                <button 
                    key={cardData.name} 
                    onClick={() => setSelectedCard(cardData)}
                    className="rounded-lg shadow-lg aspect-square flex flex-col items-center justify-center p-2 animate-fade-in transition-all duration-300 hover:scale-110 hover:shadow-2xl bg-amber-500"
                    aria-label={`بطاقة ${cardData.name}`}
                >
                    <div className="text-7xl h-20 flex items-center justify-center">
                       {isBase64Image(cardData.image) ? (
                            <img src={cardData.image} alt={cardData.name} className="h-full object-contain" />
                        ) : (
                            <span>{cardData.image}</span>
                        )}
                    </div>
                     <p className="text-white font-bold text-base mt-2">
                        {cardData.name}
                    </p>
                </button>
            ))}
        </div>
    );
};

export default FunnyFlashcards;