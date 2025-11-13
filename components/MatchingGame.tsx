import React, { useState, useEffect, useRef } from 'react';
import { ArrowRightIcon } from './Icons';

interface MatchItem {
  id: string;
  image: string; // Using emojis for simplicity
  word: string;
}

const ITEMS: MatchItem[] = [
  { id: 'apple', image: '🍎', word: 'تفاحة' },
  { id: 'ball', image: '⚽️', word: 'كرة' },
  { id: 'cat', image: '🐱', word: 'قطة' },
  { id: 'sun', image: '☀️', word: 'شمس' },
  { id: 'car', image: '🚗', word: 'سيارة' },
  { id: 'house', image: '🏠', word: 'بيت' },
];

const shuffleArray = <T,>(array: T[]): T[] => {
  return [...array].sort(() => Math.random() - 0.5);
};

const MatchingGame: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [items, setItems] = useState<MatchItem[]>([]);
  const [shuffledWords, setShuffledWords] = useState<MatchItem[]>([]);
  const [selectedImage, setSelectedImage] = useState<MatchItem | null>(null);
  const [selectedWord, setSelectedWord] = useState<MatchItem | null>(null);
  const [matchedPairs, setMatchedPairs] = useState<string[]>([]);
  const [isComplete, setIsComplete] = useState(false);
  
  const successAudioRef = useRef<HTMLAudioElement>(null);
  const failureAudioRef = useRef<HTMLAudioElement>(null);

  const setupGame = () => {
    const gameItems = shuffleArray(ITEMS).slice(0, 4); // Take 4 random items for each round
    setItems(gameItems);
    setShuffledWords(shuffleArray([...gameItems]));
    setSelectedImage(null);
    setSelectedWord(null);
    setMatchedPairs([]);
    setIsComplete(false);
  };

  useEffect(() => {
    setupGame();
  }, []);
  
  useEffect(() => {
    if (selectedImage && selectedWord) {
      if (selectedImage.id === selectedWord.id) {
        // Correct match
        setMatchedPairs(prev => [...prev, selectedImage.id]);
        successAudioRef.current?.play();
        if (matchedPairs.length + 1 === items.length) {
            setTimeout(() => setIsComplete(true), 300);
        }
      } else {
        // Incorrect match
        failureAudioRef.current?.play();
      }
      
       setTimeout(() => {
          setSelectedImage(null);
          setSelectedWord(null);
        }, 500);

    }
  }, [selectedImage, selectedWord, items.length, matchedPairs.length]);


  const handleImageClick = (item: MatchItem) => {
    if (selectedImage?.id === item.id) {
      setSelectedImage(null); // Deselect
    } else {
      setSelectedImage(item);
    }
  };
  
  const handleWordClick = (item: MatchItem) => {
    if (selectedWord?.id === item.id) {
        setSelectedWord(null); // Deselect
    } else {
        setSelectedWord(item);
    }
  };

  return (
    <div className="bg-slate-800/50 p-4 rounded-lg text-center relative animate-fade-in">
        <button onClick={onBack} className="absolute top-3 left-3 text-white/70 hover:text-white bg-black/20 p-2 rounded-full transition-colors z-10">
            <ArrowRightIcon className="w-6 h-6" />
            <span className="sr-only">رجوع</span>
        </button>
        <h3 className="text-2xl font-bold mb-4">طابق الصورة بالكلمة</h3>
        
        <div className="relative grid grid-cols-2 gap-x-4 gap-y-2 max-w-md mx-auto">
            {/* Images Column */}
            <div className="space-y-2">
                {items.map(item => {
                    const isMatched = matchedPairs.includes(item.id);
                    const isSelected = selectedImage?.id === item.id;
                    return (
                        <button
                            key={`img-${item.id}`}
                            onClick={() => handleImageClick(item)}
                            disabled={isMatched || !!selectedImage}
                            className={`w-full p-4 rounded-xl text-5xl transition-all duration-300 ${isMatched ? 'bg-green-500 opacity-50' : isSelected ? 'bg-yellow-400 ring-4 ring-yellow-200' : 'bg-slate-700 hover:bg-slate-600 disabled:opacity-70 disabled:cursor-not-allowed'}`}
                        >
                            {item.image}
                        </button>
                    )
                })}
            </div>

            {/* Words Column */}
            <div className="space-y-2">
                 {shuffledWords.map(item => {
                    const isMatched = matchedPairs.includes(item.id);
                    const isSelected = selectedWord?.id === item.id;
                    return (
                        <button
                            key={`word-${item.id}`}
                            onClick={() => handleWordClick(item)}
                            disabled={isMatched || !!selectedWord}
                            className={`w-full p-4 h-[92px] flex items-center justify-center rounded-xl text-2xl font-bold transition-all duration-300 ${isMatched ? 'bg-green-500 opacity-50' : isSelected ? 'bg-yellow-400 ring-4 ring-yellow-200' : 'bg-slate-700 hover:bg-slate-600 disabled:opacity-70 disabled:cursor-not-allowed'}`}
                        >
                            {item.word}
                        </button>
                    )
                })}
            </div>
             {isComplete && (
                <div className="absolute inset-0 bg-black/90 flex flex-col items-center justify-center rounded-lg animate-fade-in text-center p-4 z-20">
                    <h2 className="text-5xl font-black text-yellow-300 mb-4" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.5)'}}>أحسنت!</h2>
                    <p className="text-white text-lg">لقد طابقت جميع الصور بنجاح.</p>
                    <button onClick={setupGame} className="mt-6 bg-blue-500 text-white font-bold py-2 px-6 rounded-full hover:bg-blue-600 transition-all flex items-center space-x-2 space-x-reverse shadow-lg border-b-4 border-blue-700 active:border-b-0 active:translate-y-1 transform">
                        <span>العب مرة أخرى</span>
                    </button>
                </div>
            )}
        </div>

        <audio ref={successAudioRef} src="https://actions.google.com/sounds/v1/positive/success.ogg" preload="auto" />
        <audio ref={failureAudioRef} src="https://actions.google.com/sounds/v1/errors/error_swoosh.ogg" preload="auto" />
    </div>
  );
};

export default MatchingGame;