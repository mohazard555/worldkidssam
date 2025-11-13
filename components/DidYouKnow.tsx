import React, { useContext } from 'react';
import { AppContext } from '../App';
import { LightbulbIcon } from './Icons';
import { FunFact } from '../types';

const FactCard: React.FC<{ fact: FunFact }> = ({ fact }) => (
    <div className="bg-slate-800 rounded-2xl shadow-lg overflow-hidden flex flex-col transition-transform duration-300 hover:scale-105">
        <div className="aspect-video bg-slate-700">
             {fact.imageUrl ? (
                 <img src={fact.imageUrl} alt={fact.text.substring(0, 20)} className="w-full h-full object-cover"/>
            ) : (
                <div className="w-full h-full bg-gradient-to-br from-yellow-300 to-amber-400 flex items-center justify-center">
                    <LightbulbIcon className="w-16 h-16 text-slate-800 opacity-20" />
                </div>
            )}
        </div>
        <div className="p-4 flex-grow flex items-center">
            <p className="text-white text-base font-semibold text-center w-full">
                {fact.text}
            </p>
        </div>
    </div>
);


const DidYouKnow: React.FC = () => {
    const { appData } = useContext(AppContext)!;
    
    const facts = appData.settings.funFacts || [];

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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {facts.map(fact => (
                    <FactCard key={fact.id} fact={fact} />
                ))}
            </div>
        </div>
    );
};

export default DidYouKnow;