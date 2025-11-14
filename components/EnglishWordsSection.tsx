import React, { useContext } from 'react';
import { AppContext } from '../App';

const EnglishWordsSection: React.FC = () => {
    const { appData } = useContext(AppContext)!;
    const flashcards = appData.settings.englishWordFlashcards || [];

    if (flashcards.length === 0) {
        return (
             <div className="text-center text-white/80 p-8 bg-slate-800/50 rounded-xl">
                <p className="font-bold text-lg">لا توجد بطاقات إنجليزية حالياً.</p>
                <p className="text-sm mt-2">لإضافة بطاقات، اذهب إلى لوحة التحكم ⚙️ ثم قسم "إنجليزية".</p>
            </div>
        );
    }
    
    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 [perspective:1000px]">
             {flashcards.map((card) => (
                <div key={card.id} className="group relative w-full aspect-[3/4] transition-transform duration-500 [transform-style:preserve-3d] hover:[transform:rotateY(180deg)]">
                    {/* Front of Card */}
                    <div className="absolute w-full h-full bg-gradient-to-br from-sky-400 to-blue-600 rounded-xl shadow-lg flex flex-col items-center justify-between p-2 [backface-visibility:hidden]">
                        <div className="w-full h-3/5 bg-white/30 rounded-lg flex items-center justify-center p-2">
                            <img src={card.imageUrl} alt={card.englishWord} className="max-w-full max-h-full object-contain" />
                        </div>
                        <p className="text-white text-2xl font-bold" dir="ltr">{card.englishWord}</p>
                    </div>

                    {/* Back of Card */}
                    <div className="absolute w-full h-full bg-gradient-to-br from-teal-400 to-green-600 rounded-xl shadow-lg flex flex-col items-center justify-center p-2 [backface-visibility:hidden] [transform:rotateY(180deg)]">
                        <p className="text-white text-3xl font-bold">{card.arabicMeaning}</p>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default EnglishWordsSection;
