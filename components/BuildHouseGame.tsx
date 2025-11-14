import React, { useState, useRef } from 'react';
import { ArrowRightIcon, RedoIcon } from './Icons';

interface Piece {
  id: string;
  emoji: string;
}

const PIECES: Piece[] = [
  { id: 'door', emoji: '🚪' },
  { id: 'window', emoji: '🪟' },
  { id: 'roof', emoji: '🔺' },
  { id: 'sun', emoji: '☀️' },
];

const BuildHouseGame: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [placedPieces, setPlacedPieces] = useState<Record<string, { x: number; y: number }>>({});
  const dropZoneRef = useRef<HTMLDivElement>(null);

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, piece: Piece) => {
    e.dataTransfer.setData("pieceId", piece.id);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const pieceId = e.dataTransfer.getData("pieceId");
    if (!pieceId || !dropZoneRef.current) return;

    const rect = dropZoneRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setPlacedPieces(prev => ({ ...prev, [pieceId]: { x, y } }));
  };
  
  const resetGame = () => setPlacedPieces({});

  return (
    <div className="bg-slate-800/50 p-4 rounded-lg relative animate-fade-in">
      <button onClick={onBack} className="absolute top-3 left-3 text-white/70 hover:text-white bg-black/20 p-2 rounded-full transition-colors z-20">
        <ArrowRightIcon className="w-6 h-6" />
        <span className="sr-only">رجوع</span>
      </button>
      <div className="text-center">
        <h3 className="text-2xl font-bold mb-4">ابنِ منزلك الخاص</h3>
      </div>
      
      <div className="flex flex-col md:flex-row items-center gap-4">
        {/* Piece Palette */}
        <div className="flex md:flex-col gap-2 p-2 bg-slate-900/50 rounded-lg">
          {PIECES.map(piece => (
            <div
              key={piece.id}
              draggable
              onDragStart={(e) => handleDragStart(e, piece)}
              className="w-16 h-16 bg-blue-500 rounded-lg flex items-center justify-center text-5xl cursor-grab active:cursor-grabbing"
            >
              {piece.emoji}
            </div>
          ))}
          <button onClick={resetGame} className="w-16 h-16 bg-red-500 rounded-lg flex items-center justify-center text-white"><RedoIcon className="w-8 h-8"/></button>
        </div>

        {/* Drop Zone */}
        <div
          ref={dropZoneRef}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          className="relative w-full aspect-video bg-green-200 rounded-lg overflow-hidden border-4 border-dashed border-slate-600"
          style={{ background: 'linear-gradient(to bottom, #87ceeb 50%, #228b22 50%)' }}
        >
          {/* House Base */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-48 h-32 bg-[#d2b48c] border-4 border-[#8b4513]" />
          
          {Object.entries(placedPieces).map(([id, pos]) => (
            <div
              key={id}
              className="absolute text-5xl"
              style={{ left: `${(pos as { x: number; y: number }).x - 28}px`, top: `${(pos as { x: number; y: number }).y - 28}px` }}
            >
              {PIECES.find(p => p.id === id)?.emoji}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BuildHouseGame;
