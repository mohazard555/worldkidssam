import React, { useState } from 'react';
import ColorGame from './ColorGame';
import AnimalPicturesGame from './AnimalPicturesGame';
import MatchingGame from './MatchingGame';
import NumberGame from './NumberGame';
import ShapeGame from './ShapeGame';
import SpotTheDifferenceGame from './SpotTheDifferenceGame';
import OrderingGame from './OrderingGame';
import FindObjectGame from './FindObjectGame';
import FirstLetterGame from './FirstLetterGame';
import WordFormationGame from './WordFormationGame';
import AdditionGame from './AdditionGame';
import ComparisonGame from './ComparisonGame';
import HabitatGame from './HabitatGame';
import WeatherGame from './WeatherGame';
import BehaviorGame from './BehaviorGame';
import FeelingsGame from './FeelingsGame';
import DesignCharacterGame from './DesignCharacterGame';
import ConnectDotsGame from './ConnectDotsGame';
import MemoryGame from './MemoryGame';
import JigsawPuzzleGame from './JigsawPuzzleGame';
import FindArabicLetterGame from './FindArabicLetterGame';
import FindEnglishLetterGame from './FindEnglishLetterGame';
import VehiclePicturesGame from './VehicleSoundsGame';
import BodyPartsGame from './BodyPartsGame';
import CompleteWordGame from './CompleteWordGame';
import FruitsGame from './FruitsGame';
import VegetablesGame from './VegetablesGame';
import JobsGame from './JobsGame';
import SportsGame from './SportsGame';
import FoodsGame from './FoodsGame';

import { 
    PaletteIcon, PawIcon, AbcIcon, NumberIcon, ShapesIcon, SpotTheDifferenceIcon, OrderingGameIcon, FindObjectIcon, FirstLetterIcon, WordFormationIcon, AdditionIcon, ComparisonIcon, HabitatIcon, WeatherIcon, BehaviorIcon, FeelingsIcon, DesignCharacterIcon, JigsawIcon, FindLetterIcon,
    VehicleIcon, BodyPartsIcon, CompleteWordIcon, ConnectDotsIcon, BrainIcon, FruitIcon, VegetableIcon, JobIcon, SportIcon, FoodIcon
} from './Icons';

type GameType = 'colors' | 'animals' | 'matching' | 'numbers' | 'shapes' | 'spot-the-difference' | 'ordering' | 'find-object' | 'first-letter' | 'word-formation' | 'addition' | 'comparison' | 'habitat' | 'weather' | 'behavior' | 'feelings' | 'design-character' | 'connect-dots' | 'memory' | 'jigsaw-puzzle' | 'find-arabic-letter' | 'find-english-letter' | 'vehicle-pictures' | 'body-parts' | 'complete-word' | 'fruits' | 'vegetables' | 'jobs' | 'sports' | 'foods';
type Game = GameType | null;

interface GameCardProps {
    onClick: () => void;
    title: string;
    description: string;
    icon: React.ReactNode;
    color: string;
}

const GameCard: React.FC<GameCardProps> = ({ onClick, title, description, icon, color }) => (
    <button
        onClick={onClick}
        className={`group relative aspect-[4/3] rounded-2xl p-4 text-white text-center flex flex-col items-center justify-center transform transition-all hover:scale-105 shadow-lg hover:shadow-2xl ${color}`}
    >
        <div className="mb-2 transition-transform group-hover:rotate-12 duration-300">{icon}</div>
        <h3 className="text-2xl font-black">{title}</h3>
        <p className="mt-1 text-sm font-semibold">{description}</p>
    </button>
);


const InteractiveGames: React.FC = () => {
    const [activeGame, setActiveGame] = useState<Game>(null);

    const gameComponents: Record<GameType, React.ReactNode> = {
        'colors': <ColorGame onBack={() => setActiveGame(null)} />,
        'animals': <AnimalPicturesGame onBack={() => setActiveGame(null)} />,
        'matching': <MatchingGame onBack={() => setActiveGame(null)} />,
        'numbers': <NumberGame onBack={() => setActiveGame(null)} />,
        'shapes': <ShapeGame onBack={() => setActiveGame(null)} />,
        'spot-the-difference': <SpotTheDifferenceGame onBack={() => setActiveGame(null)} />,
        'ordering': <OrderingGame onBack={() => setActiveGame(null)} />,
        'find-object': <FindObjectGame onBack={() => setActiveGame(null)} />,
        'first-letter': <FirstLetterGame onBack={() => setActiveGame(null)} />,
        'word-formation': <WordFormationGame onBack={() => setActiveGame(null)} />,
        'addition': <AdditionGame onBack={() => setActiveGame(null)} />,
        'comparison': <ComparisonGame onBack={() => setActiveGame(null)} />,
        'habitat': <HabitatGame onBack={() => setActiveGame(null)} />,
        'weather': <WeatherGame onBack={() => setActiveGame(null)} />,
        'behavior': <BehaviorGame onBack={() => setActiveGame(null)} />,
        'feelings': <FeelingsGame onBack={() => setActiveGame(null)} />,
        'design-character': <DesignCharacterGame onBack={() => setActiveGame(null)} />,
        'connect-dots': <ConnectDotsGame onBack={() => setActiveGame(null)} />,
        'memory': <MemoryGame onBack={() => setActiveGame(null)} />,
        'jigsaw-puzzle': <JigsawPuzzleGame onBack={() => setActiveGame(null)} />,
        'find-arabic-letter': <FindArabicLetterGame onBack={() => setActiveGame(null)} />,
        'find-english-letter': <FindEnglishLetterGame onBack={() => setActiveGame(null)} />,
        'vehicle-pictures': <VehiclePicturesGame onBack={() => setActiveGame(null)} />,
        'body-parts': <BodyPartsGame onBack={() => setActiveGame(null)} />,
        'complete-word': <CompleteWordGame onBack={() => setActiveGame(null)} />,
        'fruits': <FruitsGame onBack={() => setActiveGame(null)} />,
        'vegetables': <VegetablesGame onBack={() => setActiveGame(null)} />,
        'jobs': <JobsGame onBack={() => setActiveGame(null)} />,
        'sports': <SportsGame onBack={() => setActiveGame(null)} />,
        'foods': <FoodsGame onBack={() => setActiveGame(null)} />,
    };
    
    if (activeGame && gameComponents[activeGame]) {
        return <>{gameComponents[activeGame]}</>;
    }

    return (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 animate-fade-in">
            <GameCard onClick={() => setActiveGame('fruits')} title="لعبة الفواكه" description="خمن اسم الفاكهة" icon={<FruitIcon className="w-12 h-12" />} color="bg-gradient-to-br from-red-400 to-orange-500" />
            <GameCard onClick={() => setActiveGame('vegetables')} title="لعبة الخضروات" description="خمن اسم الخضار" icon={<VegetableIcon className="w-12 h-12" />} color="bg-gradient-to-br from-lime-500 to-green-600" />
            <GameCard onClick={() => setActiveGame('jobs')} title="لعبة المهن" description="خمن اسم المهنة" icon={<JobIcon className="w-12 h-12" />} color="bg-gradient-to-br from-sky-400 to-blue-600" />
            <GameCard onClick={() => setActiveGame('sports')} title="لعبة الرياضات" description="خمن اسم الرياضة" icon={<SportIcon className="w-12 h-12" />} color="bg-gradient-to-br from-amber-400 to-yellow-500" />
            <GameCard onClick={() => setActiveGame('foods')} title="لعبة الأطعمة" description="خمن اسم الطعام" icon={<FoodIcon className="w-12 h-12" />} color="bg-gradient-to-br from-pink-400 to-rose-500" />
            <GameCard onClick={() => setActiveGame('memory')} title="لعبة الذاكرة" description="طابق الصور المتشابهة" icon={<BrainIcon className="w-12 h-12" />} color="bg-gradient-to-br from-amber-400 to-yellow-500" />
            <GameCard onClick={() => setActiveGame('connect-dots')} title="صل النقاط" description="اكتشف الشكل المخفي" icon={<ConnectDotsIcon className="w-12 h-12" />} color="bg-gradient-to-br from-fuchsia-500 to-purple-600" />
            <GameCard onClick={() => setActiveGame('complete-word')} title="أكمل الكلمة" description="اختر الكلمة المناسبة" icon={<CompleteWordIcon className="w-12 h-12" />} color="bg-gradient-to-br from-lime-400 to-green-600" />
            <GameCard onClick={() => setActiveGame('vehicle-pictures')} title="صور المركبات" description="خمن اسم المركبة" icon={<VehicleIcon className="w-12 h-12" />} color="bg-gradient-to-br from-slate-400 to-gray-600" />
            <GameCard onClick={() => setActiveGame('body-parts')} title="أجزاء الجسم" description="تعرف على جسم الإنسان" icon={<BodyPartsIcon className="w-12 h-12" />} color="bg-gradient-to-br from-pink-400 to-rose-500" />
            <GameCard onClick={() => setActiveGame('jigsaw-puzzle')} title="تركيب الصور" description="جمع القطع المبعثرة" icon={<JigsawIcon className="w-12 h-12" />} color="bg-gradient-to-br from-teal-400 to-cyan-600" />
            <GameCard onClick={() => setActiveGame('find-arabic-letter')} title="ابحث عن الحرف" description="الأحرف العربية" icon={<FindLetterIcon className="w-12 h-12" />} color="bg-gradient-to-br from-orange-400 to-red-500" />
            <GameCard onClick={() => setActiveGame('find-english-letter')} title="Find the Letter" description="English Alphabet" icon={<FindLetterIcon className="w-12 h-12" />} color="bg-gradient-to-br from-sky-400 to-indigo-500" />
            <GameCard onClick={() => setActiveGame('design-character')} title="صمم شخصيتك" description="اختر الشعر والملابس" icon={<DesignCharacterIcon className="w-12 h-12" />} color="bg-gradient-to-br from-fuchsia-500 to-purple-600" />
            <GameCard onClick={() => setActiveGame('first-letter')} title="أول حرف" description="اختر الحرف الأول للكلمة" icon={<FirstLetterIcon className="w-12 h-12" />} color="bg-gradient-to-br from-red-500 to-orange-500" />
            <GameCard onClick={() => setActiveGame('word-formation')} title="كوّن الكلمة" description="رتب الحروف لتكوين كلمة" icon={<WordFormationIcon className="w-12 h-12" />} color="bg-gradient-to-br from-yellow-500 to-lime-500" />
            <GameCard onClick={() => setActiveGame('numbers')} title="عد الأشياء" description="تعلم العد والأرقام" icon={<NumberIcon className="w-12 h-12" />} color="bg-gradient-to-br from-green-500 to-teal-500" />
            <GameCard onClick={() => setActiveGame('addition')} title="الجمع والمرح" description="حل مسائل الجمع البسيطة" icon={<AdditionIcon className="w-12 h-12" />} color="bg-gradient-to-br from-cyan-500 to-blue-500" />
            <GameCard onClick={() => setActiveGame('comparison')} title="من الأكبر؟" description="قارن بين الكميات المختلفة" icon={<ComparisonIcon className="w-12 h-12" />} color="bg-gradient-to-br from-indigo-500 to-purple-500" />
            <GameCard onClick={() => setActiveGame('habitat')} title="أين يعيش؟" description="طابق الحيوان ببيئته" icon={<HabitatIcon className="w-12 h-12" />} color="bg-gradient-to-br from-pink-500 to-rose-500" />
            <GameCard onClick={() => setActiveGame('weather')} title="الطقس اليوم" description="اختر الملابس المناسبة للطقس" icon={<WeatherIcon className="w-12 h-12" />} color="bg-gradient-to-br from-sky-400 to-blue-600" />
            <GameCard onClick={() => setActiveGame('ordering')} title="رحلة البذرة" description="رتب مراحل نمو النبات" icon={<OrderingGameIcon className="w-12 h-12" />} color="bg-gradient-to-br from-lime-500 to-green-500" />
            <GameCard onClick={() => setActiveGame('behavior')} title="تصرف صح!" description="تعلم القيم والسلوك الإيجابي" icon={<BehaviorIcon className="w-12 h-12" />} color="bg-gradient-to-br from-amber-400 to-orange-500" />
            <GameCard onClick={() => setActiveGame('feelings')} title="تعرف على المشاعر" description="تنمية الذكاء العاطفي" icon={<FeelingsIcon className="w-12 h-12" />} color="bg-gradient-to-br from-violet-500 to-fuchsia-500" />
            <GameCard onClick={() => setActiveGame('colors')} title="لعبة الألوان" description="تعلم أسماء الألوان" icon={<PaletteIcon className="w-12 h-12" />} color="bg-gradient-to-br from-pink-500 to-purple-600" />
            <GameCard onClick={() => setActiveGame('animals')} title="صور الحيوانات" description="خمن اسم الحيوان" icon={<PawIcon className="w-12 h-12" />} color="bg-gradient-to-br from-green-500 to-teal-600" />
            <GameCard onClick={() => setActiveGame('matching')} title="لعبة المطابقة" description="طابق الصورة بالكلمة" icon={<AbcIcon className="w-12 h-12" />} color="bg-gradient-to-br from-blue-500 to-indigo-600" />
            <GameCard onClick={() => setActiveGame('shapes')} title="لعبة الأشكال" description="تعرف على الأشكال الهندسية" icon={<ShapesIcon className="w-12 h-12" />} color="bg-gradient-to-br from-rose-500 to-red-600" />
            <GameCard onClick={() => setActiveGame('spot-the-difference')} title="اختلافات الصور" description="ابحث عن الفروقات" icon={<SpotTheDifferenceIcon className="w-12 h-12" />} color="bg-gradient-to-br from-cyan-500 to-blue-500" />
            <GameCard onClick={() => setActiveGame('find-object')} title="ابحث عن الشيء" description="ابحث عن العناصر المخبأة" icon={<FindObjectIcon className="w-12 h-12" />} color="bg-gradient-to-br from-amber-500 to-orange-600" />
        </div>
    );
};

export default InteractiveGames;