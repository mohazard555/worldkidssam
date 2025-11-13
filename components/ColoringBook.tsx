import React, { useState, useContext, useEffect } from 'react';
import { AppContext } from '../App';
import { ChevronLeftIcon, ChevronRightIcon, PaletteIcon } from './Icons';
import ColoringCanvas from './ColoringCanvas';
import { ColoringPage } from '../types';


const ColoringBook: React.FC = () => {
    const { appData } = useContext(AppContext)!;
    const [currentIndex, setCurrentIndex] = useState(0);
    const [selectedImage, setSelectedImage] = useState<ColoringPage | null>(null);

    const images = appData.settings.coloringPages || [];

    // Reset index if images change to prevent out-of-bounds errors
    useEffect(() => {
        if (!selectedImage) {
            setCurrentIndex(0);
        }
    }, [images.length, selectedImage]);
    
    const goToPrevious = () => {
        const isFirstSlide = currentIndex === 0;
        const newIndex = isFirstSlide ? images.length - 1 : currentIndex - 1;
        setCurrentIndex(newIndex);
    };

    const goToNext = () => {
        const isLastSlide = currentIndex === images.length - 1;
        const newIndex = isLastSlide ? 0 : currentIndex + 1;
        setCurrentIndex(newIndex);
    };

    if (selectedImage) {
        return <ColoringCanvas image={selectedImage} onBack={() => setSelectedImage(null)} />;
    }

    if (images.length === 0) {
        return (
             <div className="text-center text-white/80 p-8 bg-slate-800/50 rounded-xl">
                <p className="font-bold text-lg">لا توجد صور حالياً.</p>
                <p className="text-sm mt-2">لإضافة صور، اذهب إلى لوحة التحكم ⚙️ ثم قسم "تسلية".</p>
            </div>
        );
    }

    return (
        <div id="coloring-book-content" className="animate-fade-in">
            <div className="relative w-full aspect-[4/3] bg-slate-800 rounded-xl shadow-lg overflow-hidden group">
                <img 
                    src={images[currentIndex].imageUrl} 
                    alt={`صورة تلوين ${currentIndex + 1}`} 
                    className="w-full h-full object-contain cursor-pointer"
                    onClick={() => setSelectedImage(images[currentIndex])}
                />

                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                    <div className="text-center text-white">
                        <PaletteIcon className="w-16 h-16 mx-auto" />
                        <p className="font-bold text-xl mt-2">اضغط للتلوين!</p>
                    </div>
                </div>

                <button
                    onClick={goToPrevious}
                    className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 text-white bg-red-600 rounded-full p-2 hover:bg-red-700 transition-all shadow-md z-10"
                    aria-label="الصورة السابقة"
                >
                    <ChevronLeftIcon className="w-8 h-8" />
                </button>
                <button
                    onClick={goToNext}
                    className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 text-white bg-red-600 rounded-full p-2 hover:bg-red-700 transition-all shadow-md z-10"
                    aria-label="الصورة التالية"
                >
                    <ChevronRightIcon className="w-8 h-8" />
                </button>

                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white bg-black bg-opacity-60 px-4 py-1 rounded-full text-lg">
                    {images.length} / {currentIndex + 1}
                </div>
            </div>
        </div>
    );
};

export default ColoringBook;