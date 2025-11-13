import React, { useContext } from 'react';
import SectionCard from './SectionCard';
import AnimalFlashcards from './AnimalFlashcards';
import ArabicAlphabetFlashcards from './ArabicAlphabetFlashcards';
import EnglishAlphabetFlashcards from './EnglishAlphabetFlashcards';
import ColorFlashcards from './ColorFlashcards';
import NumberFlashcards from './NumberFlashcards';
import ShapeFlashcards from './ShapeFlashcards';
import FunnyFlashcards from './FunnyFlashcards';
import { PawIcon, AbcIcon, AbcEnIcon, PaletteIcon, NumberIcon, ShapesIcon, FeelingsIcon } from './Icons';
import { AppContext } from '../App';

const Flashcards: React.FC = () => {
    const { appData } = useContext(AppContext)!;
    const settings = appData.settings;

    return (
        <div>
            <SectionCard
                title="بطاقات الحيوانات"
                count={(settings.animalFlashcards || []).length}
                icon={<PawIcon className="w-8 h-8" />}
                colorClasses="from-green-500 to-teal-600"
                defaultOpen={true}
            >
                <AnimalFlashcards />
            </SectionCard>
            <SectionCard
                title="بطاقات الأحرف العربية"
                count={(settings.arabicAlphabetData || []).length}
                icon={<AbcIcon className="w-8 h-8" />}
                colorClasses="from-blue-500 to-indigo-600"
            >
                <ArabicAlphabetFlashcards />
            </SectionCard>
            <SectionCard
                title="بطاقات الأحرف الإنجليزية"
                count={(settings.englishAlphabetData || []).length}
                icon={<AbcEnIcon className="w-8 h-8" />}
                colorClasses="from-red-500 to-orange-500"
            >
                <EnglishAlphabetFlashcards />
            </SectionCard>
            <SectionCard
                title="بطاقات الألوان"
                count={(settings.colorFlashcards || []).length}
                icon={<PaletteIcon className="w-8 h-8" />}
                colorClasses="from-rose-400 to-red-500"
            >
                <ColorFlashcards />
            </SectionCard>
            <SectionCard
                title="بطاقات الأرقام"
                count={(settings.numberFlashcards || []).length}
                icon={<NumberIcon className="w-8 h-8" />}
                colorClasses="from-sky-400 to-cyan-500"
            >
                <NumberFlashcards />
            </SectionCard>
            <SectionCard
                title="بطاقات الأشكال"
                count={(settings.shapeFlashcards || []).length}
                icon={<ShapesIcon className="w-8 h-8" />}
                colorClasses="from-violet-500 to-fuchsia-500"
            >
                <ShapeFlashcards />
            </SectionCard>
             <SectionCard
                title="بطاقات مضحكة"
                count={(settings.funnyFlashcards || []).length}
                icon={<FeelingsIcon className="w-8 h-8" />}
                colorClasses="from-amber-400 to-yellow-500"
            >
                <FunnyFlashcards />
            </SectionCard>
        </div>
    );
};

export default Flashcards;