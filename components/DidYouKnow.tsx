import React, { useState, useContext, useEffect } from 'react';
import { AppContext } from '../App';
import { ChevronLeftIcon, ChevronRightIcon, LightbulbIcon } from './Icons';
import { FunFact } from '../types';

const DidYouKnow: React.FC = () => {
    const { appData } = useContext(AppContext)!;
    const [currentIndex, setCurrentIndex] = useState(0);
    
    const facts = appData.settings.funFacts || [];

    useEffect(() => {
        setCurrentIndex(0);
    }, [facts.length]);
    
    const goToPrevious = () => {
        const isFirst = currentIndex === 0;
        const newIndex = isFirst ? facts.length - 1 : currentIndex - 1;
        setCurrentIndex(newIndex);
    };

    const goToNext = () => {
        const isLast = currentIndex === facts.length - 1;
        const newIndex = isLast ? 0 : currentIndex + 1;
        setCurrentIndex(newIndex);
    };

    if (facts.length === 0) {
        return (
             <div className="text-center text-white/80 p-8 bg-slate-800/50 rounded-xl">
                <p className="font-bold text-lg">لا توجد معلومات حالياً.</p>
                <p className="text-sm mt-2">لإضافة معلومات، اذهب إلى لوحة التحكم ⚙️ ثم قسم "هل تعلم".</p>
            </div>
        );
    }

    return (
        <div id="did-you-know-content" className="animate-fade-in">
            <div className="relative w-full min-h-[150px] bg-gradient-to-br from-yellow-300 to-amber-400 rounded-2xl shadow-lg overflow-hidden p-6 flex flex-col items-center justify-center text-slate-800">
                 <div className="absolute top-4 right-4 text-yellow-600/50">
                    <LightbulbIcon className="w-16 h-16 opacity-30" />
                 </div>
                 
                <p className="text-xl md:text-2xl font-bold text-center z-10" key={currentIndex}>
                    {facts[currentIndex].text}
                </p>

                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-slate-700 bg-white/50 px-3 py-1 rounded-full text-sm font-bold">
                    {facts.length} / {currentIndex + 1}
                </div>

                <button
                    onClick={goToPrevious}
                    className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 text-slate-800 bg-white/70 rounded-full p-2 hover:bg-white transition-all shadow-md z-10"
                    aria-label="المعلومة السابقة"
                >
                    <ChevronLeftIcon className="w-7 h-7" />
                </button>
                <button
                    onClick={goToNext}
                    className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 text-slate-800 bg-white/70 rounded-full p-2 hover:bg-white transition-all shadow-md z-10"
                    aria-label="المعلومة التالية"
                >
                    <ChevronRightIcon className="w-7 h-7" />
                </button>

            </div>
        </div>
    );
};

export default DidYouKnow;
