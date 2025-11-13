import React, { useState } from 'react';
import ColorGame from './ColorGame';
import AnimalSoundsGame from './AnimalSoundsGame';
import MatchingGame from './MatchingGame';
import NumberGame from './NumberGame';
import ShapeGame from './ShapeGame';
import SpotTheDifferenceGame from './SpotTheDifferenceGame';
import OrderingGame from './OrderingGame';
import FindObjectGame from './FindObjectGame';
import { PaletteIcon, PawIcon, AbcIcon, NumberIcon, ShapesIcon, SpotTheDifferenceIcon, OrderingGameIcon, FindObjectIcon } from './Icons';

type Game = 'colors' | 'animals' | 'matching' | 'numbers' | 'shapes' | 'spot-the-difference' | 'ordering' | 'find-object' | null;

const InteractiveGames: React.FC = () => {
    const [activeGame, setActiveGame] = useState<Game>(null);

    if (activeGame === 'colors') {
        return <ColorGame onBack={() => setActiveGame(null)} />;
    }
    if (activeGame === 'animals') {
        return <AnimalSoundsGame onBack={() => setActiveGame(null)} />;
    }
    if (activeGame === 'matching') {
        return <MatchingGame onBack={() => setActiveGame(null)} />;
    }
    if (activeGame === 'numbers') {
        return <NumberGame onBack={() => setActiveGame(null)} />;
    }
    if (activeGame === 'shapes') {
        return <ShapeGame onBack={() => setActiveGame(null)} />;
    }
    if (activeGame === 'spot-the-difference') {
        return <SpotTheDifferenceGame onBack={() => setActiveGame(null)} />;
    }
    if (activeGame === 'ordering') {
        return <OrderingGame onBack={() => setActiveGame(null)} />;
    }
    if (activeGame === 'find-object') {
        return <FindObjectGame onBack={() => setActiveGame(null)} />;
    }


    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
            <button 
                onClick={() => setActiveGame('colors')}
                className="group relative aspect-video bg-gradient-to-br from-pink-500 to-purple-600 rounded-2xl p-6 text-white text-center flex flex-col items-center justify-center transform transition-all hover:scale-105 shadow-lg hover:shadow-2xl"
            >
                <PaletteIcon className="w-16 h-16 mb-4 transition-transform group-hover:rotate-12" />
                <h3 className="text-3xl font-black">لعبة الألوان</h3>
                <p className="mt-2 font-semibold">تعلم أسماء الألوان</p>
            </button>
            <button 
                onClick={() => setActiveGame('animals')}
                className="group relative aspect-video bg-gradient-to-br from-green-500 to-teal-600 rounded-2xl p-6 text-white text-center flex flex-col items-center justify-center transform transition-all hover:scale-105 shadow-lg hover:shadow-2xl"
            >
                <PawIcon className="w-16 h-16 mb-4 transition-transform group-hover:rotate-12" />
                <h3 className="text-3xl font-black">أصوات الحيوانات</h3>
                <p className="mt-2 font-semibold">خمن صوت الحيوان</p>
            </button>
            <button 
                onClick={() => setActiveGame('matching')}
                className="group relative aspect-video bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl p-6 text-white text-center flex flex-col items-center justify-center transform transition-all hover:scale-105 shadow-lg hover:shadow-2xl"
            >
                <AbcIcon className="w-16 h-16 mb-4 transition-transform group-hover:rotate-12" />
                <h3 className="text-3xl font-black">لعبة المطابقة</h3>
                <p className="mt-2 font-semibold">طابق الصورة بالكلمة</p>
            </button>
             <button 
                onClick={() => setActiveGame('numbers')}
                className="group relative aspect-video bg-gradient-to-br from-orange-500 to-yellow-500 rounded-2xl p-6 text-white text-center flex flex-col items-center justify-center transform transition-all hover:scale-105 shadow-lg hover:shadow-2xl"
            >
                <NumberIcon className="w-16 h-16 mb-4 transition-transform group-hover:rotate-12" />
                <h3 className="text-3xl font-black">لعبة الأرقام</h3>
                <p className="mt-2 font-semibold">تعلم العد وحساب الأشياء</p>
            </button>
            <button 
                onClick={() => setActiveGame('shapes')}
                className="group relative aspect-video bg-gradient-to-br from-rose-500 to-red-600 rounded-2xl p-6 text-white text-center flex flex-col items-center justify-center transform transition-all hover:scale-105 shadow-lg hover:shadow-2xl"
            >
                <ShapesIcon className="w-16 h-16 mb-4 transition-transform group-hover:rotate-12" />
                <h3 className="text-3xl font-black">لعبة الأشكال</h3>
                <p className="mt-2 font-semibold">تعرف على الأشكال الهندسية</p>
            </button>
             <button 
                onClick={() => setActiveGame('spot-the-difference')}
                className="group relative aspect-video bg-gradient-to-br from-cyan-500 to-blue-500 rounded-2xl p-6 text-white text-center flex flex-col items-center justify-center transform transition-all hover:scale-105 shadow-lg hover:shadow-2xl"
            >
                <SpotTheDifferenceIcon className="w-16 h-16 mb-4 transition-transform group-hover:rotate-12" />
                <h3 className="text-3xl font-black">اختلافات الصور</h3>
                <p className="mt-2 font-semibold">ابحث عن الفروقات</p>
            </button>
            <button 
                onClick={() => setActiveGame('ordering')}
                className="group relative aspect-video bg-gradient-to-br from-lime-500 to-green-500 rounded-2xl p-6 text-white text-center flex flex-col items-center justify-center transform transition-all hover:scale-105 shadow-lg hover:shadow-2xl"
            >
                <OrderingGameIcon className="w-16 h-16 mb-4 transition-transform group-hover:rotate-12" />
                <h3 className="text-3xl font-black">رتب الأشياء</h3>
                <p className="mt-2 font-semibold">ضع الصور في ترتيبها الصحيح</p>
            </button>
            <button 
                onClick={() => setActiveGame('find-object')}
                className="group relative aspect-video bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl p-6 text-white text-center flex flex-col items-center justify-center transform transition-all hover:scale-105 shadow-lg hover:shadow-2xl"
            >
                <FindObjectIcon className="w-16 h-16 mb-4 transition-transform group-hover:rotate-12" />
                <h3 className="text-3xl font-black">ابحث عن الشيء</h3>
                <p className="mt-2 font-semibold">ابحث عن العناصر المخبأة</p>
            </button>
        </div>
    );
};

export default InteractiveGames;