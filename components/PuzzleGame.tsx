import React, { useState, useContext, useMemo, useEffect } from 'react';
import { AppContext } from '../App';
import { ColoringPage } from '../types';
import { ArrowRightIcon } from './Icons';

const GRID_SIZE = 3;
const PIECES_COUNT = GRID_SIZE * GRID_SIZE;

// Fisher-Yates shuffle algorithm
const shuffle = (array: number[]): number[] => {
  let currentIndex = array.length, randomIndex;
  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
  }
  return array;
};

// Check if a puzzle is solvable
const isSolvable = (pieces: number[]): boolean => {
    let inversions = 0;
    for (let i = 0; i < pieces.length - 1; i++) {
        for (let j = i + 1; j < pieces.length; j++) {
            if (pieces[i] > pieces[j]) {
                inversions++;
            }
        }
    }
    // For a 3x3 grid, the number of inversions must be even.
    return inversions % 2 === 0;
};

const PuzzleGame: React.FC = () => {
    const { appData } = useContext(AppContext)!;
    const [selectedImage, setSelectedImage] = useState<ColoringPage | null>(null);
    const [pieces, setPieces] = useState<number[]>([]);
    const [selectedPieceIndex, setSelectedPieceIndex] = useState<number | null>(null);
    const [isComplete, setIsComplete] = useState(false);

    const puzzleImages = appData.settings.puzzleImages || [];
    
    useEffect(() => {
        if (selectedImage) {
            let shuffledPieces;
            do {
                shuffledPieces = shuffle([...Array(PIECES_COUNT).keys()]);
            } while (!isSolvable(shuffledPieces));
            setPieces(shuffledPieces);
        }
    }, [selectedImage]);
    
    const checkCompletion = (currentPieces: number[]) => {
        for (let i = 0; i < PIECES_COUNT; i++) {
            if (currentPieces[i] !== i) {
                return false;
            }
        }
        return true;
    };

    const handlePieceClick = (clickedIndex: number) => {
        if (isComplete) return;

        if (selectedPieceIndex === null) {
            setSelectedPieceIndex(clickedIndex);
        } else if (selectedPieceIndex === clickedIndex) {
            setSelectedPieceIndex(null); // Deselect
        } else {
            const newPieces = [...pieces];
            [newPieces[selectedPieceIndex], newPieces[clickedIndex]] = [newPieces[clickedIndex], newPieces[selectedPieceIndex]];
            
            if (checkCompletion(newPieces)) {
                setIsComplete(true);
            }
            setPieces(newPieces);
            setSelectedPieceIndex(null);
        }
    };

    const handleSelectImage = (image: ColoringPage) => {
        setSelectedImage(image);
        setIsComplete(false);
        setSelectedPieceIndex(null);
    };
    
    const handleGoBack = () => {
        setSelectedImage(null);
    };

    if (puzzleImages.length === 0) {
        return (
             <div className="text-center text-white/80 p-8 bg-slate-800/50 rounded-xl">
                <p className="font-bold text-lg">لا توجد ألعاب حالياً.</p>
                <p className="text-sm mt-2">لإضافة صور للألغاز، اذهب إلى لوحة التحكم ⚙️ ثم قسم "ألعاب".</p>
            </div>
        );
    }
    
    if (!selectedImage) {
        return (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {puzzleImages.map(image => (
                    <div 
                        key={image.id}
                        className="relative bg-black/50 rounded-lg shadow-md overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-xl cursor-pointer group p-2 aspect-square"
                        onClick={() => handleSelectImage(image)}
                        aria-label="ابدأ اللعبة"
                    >
                        <img className="w-full h-full object-cover rounded-md" src={image.imageUrl} alt="Puzzle thumbnail" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end justify-center p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                             <h3 className="text-white font-bold text-sm text-center">ابدأ اللعبة</h3>
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center">
            <div className="relative w-full max-w-md aspect-square">
                <div 
                    className="grid gap-1 bg-blue-300 p-1 rounded-lg shadow-lg"
                    style={{ gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)` }}
                >
                    {pieces.map((piece, index) => {
                        const row = Math.floor(piece / GRID_SIZE);
                        const col = piece % GRID_SIZE;
                        
                        return (
                            <div
                                key={index}
                                onClick={() => handlePieceClick(index)}
                                className={`relative aspect-square bg-cover bg-no-repeat rounded-md cursor-pointer transition-all duration-300 ${selectedPieceIndex === index ? 'ring-4 ring-yellow-400 scale-95' : 'hover:scale-95'}`}
                                style={{
                                    backgroundImage: `url(${selectedImage.imageUrl})`,
                                    backgroundSize: `${GRID_SIZE * 100}% ${GRID_SIZE * 100}%`,
                                    backgroundPosition: `${col * 100 / (GRID_SIZE - 1)}% ${row * 100 / (GRID_SIZE - 1)}%`,
                                }}
                                role="button"
                                aria-label={`قطعة اللغز ${index + 1}`}
                            ></div>
                        );
                    })}
                </div>
                {isComplete && (
                    <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center rounded-lg animate-fade-in text-center p-4">
                        <h2 className="text-5xl font-black text-yellow-300 mb-4" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.5)'}}>أحسنت!</h2>
                        <p className="text-white text-lg">لقد أكملت اللغز بنجاح.</p>
                        <button onClick={handleGoBack} className="mt-6 bg-green-500 text-white font-bold py-2 px-6 rounded-full hover:bg-green-600 transition-all flex items-center space-x-2 space-x-reverse shadow-lg border-b-4 border-green-700 active:border-b-0 active:translate-y-1 transform">
                            <span>العب مرة أخرى</span>
                        </button>
                    </div>
                )}
            </div>
             {!isComplete && (
                <button onClick={handleGoBack} className="mt-6 bg-red-500 text-white font-bold py-2 px-6 rounded-full hover:bg-red-600 transition-all flex items-center space-x-2 space-x-reverse shadow-lg border-b-4 border-red-700 active:border-b-0 active:translate-y-1 transform">
                    <ArrowRightIcon className="w-5 h-5" />
                    <span>اختر صورة أخرى</span>
                </button>
            )}
        </div>
    );
};

export default PuzzleGame;
