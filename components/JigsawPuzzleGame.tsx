import React, { useState, useContext, useMemo, useEffect, useRef } from 'react';
import { AppContext } from '../App';
import { ColoringPage } from '../types';
import { ArrowRightIcon, RedoIcon } from './Icons';

const GRID_SIZE = 3; // 3x3 grid
const PIECES_COUNT = GRID_SIZE * GRID_SIZE;

const shuffleArray = <T,>(array: T[]): T[] => {
  return [...array].sort(() => Math.random() - 0.5);
};

const JigsawPuzzleGame: React.FC<{ onBack: () => void }> = ({ onBack }) => {
    const { appData } = useContext(AppContext)!;
    const [selectedImage, setSelectedImage] = useState<ColoringPage | null>(null);
    const [pieces, setPieces] = useState<number[]>([]);
    const [board, setBoard] = useState<(number | null)[]>([]);
    const [isComplete, setIsComplete] = useState(false);
    
    const successAudioRef = useRef<HTMLAudioElement>(null);
    const failureAudioRef = useRef<HTMLAudioElement>(null);

    const puzzleImages = appData.settings.puzzleImages || [];

    const setupGame = (image: ColoringPage) => {
        setSelectedImage(image);
        setPieces(shuffleArray([...Array(PIECES_COUNT).keys()]));
        setBoard(new Array(PIECES_COUNT).fill(null));
        setIsComplete(false);
    };
    
    useEffect(() => {
        const isFinished = board.every((piece, index) => piece === index);
        if (isFinished && selectedImage) {
            setIsComplete(true);
            successAudioRef.current?.play();
        }
    }, [board, selectedImage]);
    
    const handleDragStart = (e: React.DragEvent<HTMLDivElement>, pieceIndex: number) => {
        e.dataTransfer.setData("pieceIndex", pieceIndex.toString());
    };
    
    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>, slotIndex: number) => {
        const pieceIndex = parseInt(e.dataTransfer.getData("pieceIndex"), 10);
        
        if (board[slotIndex] !== null) return; // Slot is already filled

        // Piece number matches slot index
        if (pieces[pieceIndex] === slotIndex) {
            setBoard(prev => {
                const newBoard = [...prev];
                newBoard[slotIndex] = pieces[pieceIndex];
                return newBoard;
            });
            setPieces(prev => prev.filter((_, i) => i !== pieceIndex));
            successAudioRef.current?.play();
        } else {
            failureAudioRef.current?.play();
            // Optional: add a visual shake effect
            e.currentTarget.classList.add('shake');
            setTimeout(() => e.currentTarget.classList.remove('shake'), 500);
        }
    };
    
    if (!selectedImage) {
        if (puzzleImages.length === 0) {
            return (
                <div className="text-center text-white/80 p-8 bg-slate-800/50 rounded-xl">
                    <p className="font-bold text-lg">لا توجد صور للألغاز حالياً.</p>
                    <p className="text-sm mt-2">لإضافة صور، اذهب إلى لوحة التحكم ⚙️ ثم قسم "ألعاب".</p>
                </div>
            );
        }
        return (
             <div className="animate-fade-in">
                 <button onClick={onBack} className="absolute top-3 left-3 text-white/70 hover:text-white bg-black/20 p-2 rounded-full transition-colors z-10">
                    <ArrowRightIcon className="w-6 h-6" />
                </button>
                <h3 className="text-2xl font-bold mb-4 text-center">اختر صورة لتبدأ اللعبة</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {puzzleImages.map(image => (
                        <div key={image.id} onClick={() => setupGame(image)} className="relative bg-black/50 rounded-lg shadow-md overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-xl cursor-pointer group p-2 aspect-square">
                            <img className="w-full h-full object-cover rounded-md" src={image.imageUrl} alt="Puzzle thumbnail" />
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="bg-slate-800/50 p-4 rounded-lg relative animate-fade-in">
             <button onClick={() => setSelectedImage(null)} className="absolute top-3 left-3 text-white/70 hover:text-white bg-black/20 p-2 rounded-full transition-colors z-20">
                <ArrowRightIcon className="w-6 h-6" />
             </button>
            <h3 className="text-2xl font-bold mb-4 text-center">ركب الصورة!</h3>

            <div className="flex flex-col lg:flex-row items-center justify-center gap-4">
                {/* Board */}
                <div className="grid gap-1 bg-slate-900/50 p-1 rounded-lg w-full max-w-md aspect-square" style={{ gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)` }}>
                    {[...Array(PIECES_COUNT).keys()].map(i => (
                        <div key={i} onDragOver={handleDragOver} onDrop={(e) => handleDrop(e, i)} className="bg-slate-700/50 rounded-sm">
                            {board[i] !== null && (
                                <div className="w-full h-full bg-cover bg-no-repeat"
                                    style={{
                                        backgroundImage: `url(${selectedImage.imageUrl})`,
                                        backgroundSize: `${GRID_SIZE * 100}% ${GRID_SIZE * 100}%`,
                                        backgroundPosition: `${(board[i]! % GRID_SIZE) * 100 / (GRID_SIZE - 1)}% ${Math.floor(board[i]! / GRID_SIZE) * 100 / (GRID_SIZE - 1)}%`,
                                    }}
                                />
                            )}
                        </div>
                    ))}
                </div>
                 {/* Pieces Palette */}
                <div className="grid gap-2 p-2 bg-slate-900/50 rounded-lg w-full max-w-md lg:max-w-xs" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(60px, 1fr))' }}>
                    {pieces.map((piece, index) => (
                         <div key={piece} draggable onDragStart={(e) => handleDragStart(e, index)} className="w-full aspect-square bg-cover bg-no-repeat rounded-md cursor-grab active:cursor-grabbing"
                            style={{
                                backgroundImage: `url(${selectedImage.imageUrl})`,
                                backgroundSize: `${GRID_SIZE * 100}% ${GRID_SIZE * 100}%`,
                                backgroundPosition: `${(piece % GRID_SIZE) * 100 / (GRID_SIZE - 1)}% ${Math.floor(piece / GRID_SIZE) * 100 / (GRID_SIZE - 1)}%`,
                            }}
                         />
                    ))}
                </div>
            </div>

            {isComplete && (
                <div className="mt-4 text-center">
                    <h4 className="text-2xl font-bold text-green-400">أحسنت! اكتملت الصورة.</h4>
                    <button onClick={() => setupGame(selectedImage)} className="mt-2 bg-blue-500 text-white font-bold py-2 px-6 rounded-full hover:bg-blue-600 flex items-center mx-auto space-x-2 space-x-reverse">
                       <RedoIcon className="w-5 h-5"/>
                       <span>العب مرة أخرى</span>
                    </button>
                </div>
            )}

            <style>{`
                .shake {
                    animation: shake 0.5s cubic-bezier(.36,.07,.19,.97) both;
                    transform: translate3d(0, 0, 0);
                }
                @keyframes shake {
                    10%, 90% { transform: translate3d(-1px, 0, 0); }
                    20%, 80% { transform: translate3d(2px, 0, 0); }
                    30%, 50%, 70% { transform: translate3d(-4px, 0, 0); }
                    40%, 60% { transform: translate3d(4px, 0, 0); }
                }
            `}</style>
             <audio ref={successAudioRef} src="https://actions.google.com/sounds/v1/correct/bell_correct.ogg" preload="auto" />
             <audio ref={failureAudioRef} src="https://actions.google.com/sounds/v1/errors/error_swoosh.ogg" preload="auto" />
        </div>
    );
};

export default JigsawPuzzleGame;
