import React, { useState, useEffect, useRef } from 'react';
import { ArrowRightIcon, CheckIcon } from './Icons';

interface OrderItem {
  id: number;
  content: string; // Emoji
}

const LEVEL_DATA: OrderItem[] = [
  { id: 1, content: '🌱' }, // Seed
  { id: 2, content: '🌿' }, // Sprout
  { id: 3, content: '🌳' }, // Tree
  { id: 4, content: '🍎' }, // Tree with fruit
];

const shuffleArray = <T,>(array: T[]): T[] => {
  return [...array].sort(() => Math.random() - 0.5);
};

const OrderingGame: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [items, setItems] = useState<OrderItem[]>([]);
  const [slots, setSlots] = useState<(OrderItem | null)[]>([]);
  const [feedback, setFeedback] = useState<( 'correct' | 'incorrect' | null)[]>([]);
  const [isComplete, setIsComplete] = useState(false);
  const draggedItem = useRef<OrderItem | null>(null);
  const successAudioRef = useRef<HTMLAudioElement>(null);
  const failureAudioRef = useRef<HTMLAudioElement>(null);

  const setupGame = () => {
    setItems(shuffleArray([...LEVEL_DATA]));
    setSlots(new Array(LEVEL_DATA.length).fill(null));
    setFeedback(new Array(LEVEL_DATA.length).fill(null));
    setIsComplete(false);
  };

  useEffect(setupGame, []);

  const handleDragStart = (item: OrderItem) => {
    draggedItem.current = item;
  };
  
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDrop = (index: number) => {
    if (draggedItem.current && !slots[index]) {
      setSlots(prev => {
        const newSlots = [...prev];
        newSlots[index] = draggedItem.current;
        return newSlots;
      });
      setItems(prev => prev.filter(item => item.id !== draggedItem.current!.id));
      draggedItem.current = null;
    }
  };
  
  const handleSlotClick = (index: number) => {
      if (isComplete) return;
      const itemToReturn = slots[index];
      if(itemToReturn){
        setSlots(prev => {
           const newSlots = [...prev];
           newSlots[index] = null;
           return newSlots;
        });
        setItems(prev => [...prev, itemToReturn].sort((a,b) => a.id - b.id)); // sort for consistent order
        setFeedback(new Array(LEVEL_DATA.length).fill(null));
      }
  };

  const checkOrder = () => {
    if (slots.some(slot => slot === null)) {
        alert("الرجاء ملء جميع المربعات أولاً!");
        return;
    }
    const newFeedback = slots.map((item, index) => {
      if (item && item.id === index + 1) {
        return 'correct';
      } else if (item) {
        return 'incorrect';
      }
      return null;
    });
    setFeedback(newFeedback);

    const allCorrect = newFeedback.every(f => f === 'correct');
    if (allCorrect) {
        successAudioRef.current?.play();
        setIsComplete(true);
    } else {
        failureAudioRef.current?.play();
    }
  };

  return (
    <div className="bg-slate-800/50 p-4 rounded-lg text-center relative animate-fade-in">
       <button onClick={onBack} className="absolute top-3 left-3 text-white/70 hover:text-white bg-black/20 p-2 rounded-full transition-colors z-10">
          <ArrowRightIcon className="w-6 h-6" />
          <span className="sr-only">رجوع</span>
      </button>
      <h3 className="text-2xl font-bold mb-2">رحلة البذرة</h3>
      <p className="text-sm text-slate-300 mb-4">اسحب الصور من الأسفل إلى المربعات بالترتيب الصحيح</p>
      
      {/* Target Slots */}
      <div className="flex justify-center items-center gap-2 mb-4">
        {slots.map((item, index) => (
          <div
            key={index}
            onDragOver={handleDragOver}
            onDrop={() => handleDrop(index)}
            onClick={() => handleSlotClick(index)}
            className={`w-20 h-20 sm:w-24 sm:h-24 rounded-lg flex items-center justify-center text-5xl transition-colors
            ${feedback[index] === 'correct' ? 'bg-green-500' : feedback[index] === 'incorrect' ? 'bg-red-500' : 'bg-slate-700'}
            ${!item ? 'border-2 border-dashed border-slate-500' : 'cursor-pointer'}`}
          >
            {item?.content}
          </div>
        ))}
      </div>
      
      <hr className="border-slate-600 my-4" />

      {/* Source Items */}
      <div className="flex justify-center items-center gap-2 h-28">
         {items.map((item) => (
          <div
            key={item.id}
            draggable
            onDragStart={() => handleDragStart(item)}
            className="w-20 h-20 sm:w-24 sm:h-24 bg-blue-500 rounded-lg flex items-center justify-center text-5xl cursor-grab active:cursor-grabbing"
          >
            {item.content}
          </div>
        ))}
      </div>
      
       {!isComplete && (
            <button
                onClick={checkOrder}
                className="mt-4 bg-yellow-500 text-slate-800 font-bold py-2 px-6 rounded-full hover:bg-yellow-400 transition-all flex items-center mx-auto space-x-2 space-x-reverse shadow-lg border-b-4 border-yellow-700 active:border-b-0 active:translate-y-1 transform"
                >
                <CheckIcon className="w-5 h-5"/>
                <span>تأكد من إجابتي</span>
            </button>
        )}

      {isComplete && (
        <div className="mt-4 text-center">
            <h4 className="text-2xl font-bold text-green-400">أحسنت! الترتيب صحيح.</h4>
            <button onClick={setupGame} className="mt-2 bg-blue-500 text-white font-bold py-2 px-6 rounded-full hover:bg-blue-600">
                العب مرة أخرى
            </button>
        </div>
      )}

      <audio ref={successAudioRef} src="https://actions.google.com/sounds/v1/positive/success.ogg" preload="auto" />
      <audio ref={failureAudioRef} src="https://actions.google.com/sounds/v1/errors/error_swoosh.ogg" preload="auto" />
    </div>
  );
};

export default OrderingGame;
