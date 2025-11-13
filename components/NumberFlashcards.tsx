import React, { useState, useContext } from 'react';
import { AppContext } from '../App';
import type { NumberFlashcard } from '../types';
import { ArrowRightIcon } from './Icons';

const toEasternArabicNumerals = (str: string) => {
    const easternArabicNumerals = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
    return str.replace(/[0-9]/g, d => easternArabicNumerals[parseInt(d)]);
};

const NumberFlashcards: React.FC = () => {
    const { appData } = useContext(AppContext)!;
    const numberFlashcardsData = appData.settings.numberFlashcards || [];
    const [selectedNumber, setSelectedNumber] = useState<NumberFlashcard | null>(null);

    if (selectedNumber) {
        return (
            <div className={`relative animate-fade-in w-full aspect-[4/3] max-w-2xl mx-auto rounded-2xl shadow-2xl p-6 flex flex-col items-center justify-center text-white bg-sky-500`}>
                <button 
                    onClick={() => setSelectedNumber(null)}
                    className="absolute top-4 left-4 bg-white/20 hover:bg-white/40 p-2 rounded-full transition-colors"
                    aria-label="رجوع"
                >
                    <ArrowRightIcon className="w-8 h-8"/>
                </button>

                <div className="flex items-baseline justify-center gap-6" style={{ textShadow: '4px 4px 8px rgba(0,0,0,0.2)'}}>
                    <div className="text-[8rem] font-black leading-none">
                        {selectedNumber.number}
                    </div>
                     <div className="text-[8rem] font-black leading-none">
                        {toEasternArabicNumerals(selectedNumber.number.toString())}
                    </div>
                </div>
                <div className="text-4xl sm:text-5xl mt-4 h-16 flex items-center justify-center flex-wrap gap-2">
                    {Array.from({ length: selectedNumber.number }).map((_, i) => <span key={i}>{selectedNumber.representation}</span>)}
                </div>
                <div className="text-5xl font-bold mt-4">
                    {selectedNumber.word}
                </div>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-5 gap-4">
            {numberFlashcardsData.map((numberData) => (
                <button 
                    key={numberData.number} 
                    onClick={() => setSelectedNumber(numberData)}
                    className={`rounded-lg shadow-lg aspect-square flex flex-col items-center justify-center p-2 animate-fade-in transition-all duration-300 hover:scale-110 hover:shadow-2xl bg-sky-500`}
                    aria-label={`بطاقة رقم ${numberData.word}`}
                >
                    <div className="flex items-center justify-center gap-4" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.2)'}}>
                        <p className="text-white font-black text-5xl">
                            {numberData.number}
                        </p>
                         <p className="text-white font-black text-5xl">
                            {toEasternArabicNumerals(numberData.number.toString())}
                        </p>
                    </div>
                     <p className="text-white font-bold text-lg mt-1">
                        {numberData.word}
                    </p>
                </button>
            ))}
        </div>
    );
};

export default NumberFlashcards;