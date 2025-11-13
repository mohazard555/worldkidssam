import React, { useContext } from 'react';
import { AppContext } from '../App';

const AnimalFlashcards: React.FC = () => {
    const { appData } = useContext(AppContext)!;
    const animalFlashcardsData = appData.settings.animalFlashcards || [];

    if (animalFlashcardsData.length === 0) {
        return (
             <div className="text-center text-white/80 p-8 bg-slate-800/50 rounded-xl">
                <p className="font-bold text-lg">لا توجد بطاقات حيوانات حالياً.</p>
                <p className="text-sm mt-2">لإضافة بطاقات، اذهب إلى لوحة التحكم ⚙️ ثم قسم "بطاقات".</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {animalFlashcardsData.map((animal, index) => (
                <div key={index} className="bg-slate-800 rounded-lg shadow-lg overflow-hidden group flex flex-col text-center animate-fade-in transition-transform duration-300 hover:scale-105">
                    <div className="aspect-square bg-slate-700 p-2">
                        <img src={animal.image} alt={animal.name} className="w-full h-full object-contain" />
                    </div>
                    <div className="p-2 bg-slate-900/50">
                        <p className="text-white font-bold text-lg truncate" title={animal.name}>
                            {animal.name}
                        </p>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default AnimalFlashcards;