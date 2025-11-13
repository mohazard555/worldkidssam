import React, { useState, useContext } from 'react';
import { AppContext } from '../App';
import type { AlphabetFlashcard } from '../types';
import { ArrowRightIcon } from './Icons';

const isBase64Image = (str: string) => str.startsWith('data:image');

const EnglishAlphabetFlashcards: React.FC = () => {
    const { appData } = useContext(AppContext)!;
    const englishAlphabetData = appData.settings.englishAlphabetData || [];
    const [selectedLetter, setSelectedLetter] = useState<AlphabetFlashcard | null>(null);

    if (selectedLetter) {
        return (
            <div className={`relative animate-fade-in w-full aspect-[4/3] max-w-2xl mx-auto rounded-2xl shadow-2xl p-6 flex flex-col items-center justify-center text-white ${selectedLetter.color}`} dir="ltr">
                <button 
                    onClick={() => setSelectedLetter(null)}
                    className="absolute top-4 right-4 bg-white/20 hover:bg-white/40 p-2 rounded-full transition-colors"
                    aria-label="Back"
                >
                    <ArrowRightIcon className="w-8 h-8 transform -scale-x-100"/>
                </button>

                <div className="text-[12rem] font-black leading-none" style={{ textShadow: '4px 4px 8px rgba(0,0,0,0.2)'}}>
                    {selectedLetter.letter}
                </div>
                <div className="text-8xl mt-4 h-24 flex items-center justify-center">
                    {isBase64Image(selectedLetter.image) ? (
                        <img src={selectedLetter.image} alt={selectedLetter.word} className="h-full object-contain" />
                    ) : (
                        <span>{selectedLetter.image}</span>
                    )}
                </div>
                <div className="text-5xl font-bold mt-4">
                    {selectedLetter.word}
                </div>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-7 lg:grid-cols-8 xl:grid-cols-10 gap-4">
            {englishAlphabetData.map((letterData) => (
                <button 
                    key={letterData.letter} 
                    onClick={() => setSelectedLetter(letterData)}
                    className={`rounded-lg shadow-lg aspect-square flex items-center justify-center animate-fade-in transition-all duration-300 hover:scale-110 hover:shadow-2xl ${letterData.color}`}
                    aria-label={`Flashcard for letter ${letterData.letter}`}
                >
                    <p className="text-white font-black text-6xl" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.2)'}}>
                        {letterData.letter}
                    </p>
                </button>
            ))}
        </div>
    );
};

export default EnglishAlphabetFlashcards;