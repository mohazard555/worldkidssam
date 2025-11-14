import React, { useState, useContext } from 'react';
import { AppContext } from '../App';
import PuzzlesCarousel from './PuzzlesCarousel';
import SpeedCompetition from './SpeedCompetition';
import { PuzzleIcon, SparkleIcon } from './Icons';

const QuizSection: React.FC = () => {
    const { appData } = useContext(AppContext)!;
    const [activeTab, setActiveTab] = useState<'puzzles' | 'competitions'>('puzzles');

    const quizzes = appData.settings.quizzes || [];

    if (quizzes.length === 0) {
        return (
             <div className="text-center text-white/80 p-8 bg-slate-800/50 rounded-xl">
                <p className="font-bold text-lg">لا توجد ألغاز حالياً.</p>
                <p className="text-sm mt-2">لإضافة ألغاز، اذهب إلى لوحة التحكم ⚙️ ثم قسم "ألغاز".</p>
            </div>
        );
    }

    const TabButton = ({ tab, label, icon }: { tab: 'puzzles' | 'competitions'; label: string; icon: React.ReactNode }) => (
        <button
            onClick={() => setActiveTab(tab)}
            className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 font-bold text-lg rounded-t-lg transition-all border-b-4 ${
                activeTab === tab 
                ? 'bg-slate-800/50 text-yellow-300 border-yellow-300' 
                : 'bg-slate-900/50 text-white/70 hover:bg-slate-900/80 border-transparent'
            }`}
        >
            {icon}
            <span>{label}</span>
        </button>
    );

    return (
        <div id="quiz-section-content" className="animate-fade-in">
            <div className="flex">
                <TabButton tab="puzzles" label="الألغاز" icon={<PuzzleIcon className="w-6 h-6"/>} />
                <TabButton tab="competitions" label="مسابقات" icon={<SparkleIcon className="w-6 h-6"/>} />
            </div>
            <div className="pt-4 bg-slate-800/50 p-4 rounded-b-lg">
                {activeTab === 'puzzles' && <PuzzlesCarousel quizzes={quizzes} />}
                {activeTab === 'competitions' && <SpeedCompetition />}
            </div>
        </div>
    );
};

export default QuizSection;
