import React, { useState, useRef } from 'react';
import { ArrowRightIcon, RedoIcon } from './Icons';

interface Piece {
  id: string;
  emoji: string;
  color: string;
}

const BLOCKS: Piece[] = [
  { id: 'red', emoji: '🟥', color: '#ef4444' },
  { id: 'blue', emoji: '🟦', color: '#3b82f6' },
  { id: 'green', emoji: '🟩', color: '#22c55e' },
  { id: 'yellow', emoji: '🟨', color: '#eab308' },
  { id: 'orange', emoji: '🟧', color: '#f97316' },
  { id: 'purple', emoji: '🟪', color: '#8b5cf6' },
];

const BlockBuildingGame: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [placedPieces, setPlacedPieces] = useState<({ id: string, x: number; y: number, color: string })[]>([]);
  const dropZoneRef = useRef<HTMLDivElement>(null);

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, piece: Piece) => {
    e.dataTransfer.setData("pieceId", piece.id);
    e.dataTransfer.setData("pieceColor", piece.color);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const pieceId = e.dataTransfer.getData("pieceId");
    const pieceColor = e.dataTransfer.getData("pieceColor");
    if (!pieceId || !dropZoneRef.current) return;

    const rect = dropZoneRef.current.getBoundingClientRect();
    // Snap to a grid for easier building
    const gridSize = 40;
    const x = Math.round((e.clientX - rect.left - gridSize / 2) / gridSize) * gridSize;
    const y = Math.round((e.clientY - rect.top - gridSize / 2) / gridSize) * gridSize;

    setPlacedPieces(prev => [...prev, { id: `${pieceId}-${Date.now()}`, x, y, color: pieceColor }]);
  };
  
  const resetGame = () => setPlacedPieces([]);

  return (
    <div className="bg-slate-800/50 p-4 rounded-lg relative animate-fade-in">
      <button onClick={onBack} className="absolute top-3 left-3 text-white/70 hover:text-white bg-black/20 p-2 rounded-full transition-colors z-20">
        <ArrowRightIcon className="w-6 h-6" />
        <span className="sr-only">رجوع</span>
      </button>
      <div className="text-center">
        <h3 className="text-2xl font-bold mb-4">بناء المكعبات</h3>
      </div>
      
      <div className="flex flex-col md:flex-row items-center gap-4">
        {/* Piece Palette */}
        <div className="flex md:flex-col gap-2 p-2 bg-slate-900/50 rounded-lg">
          {BLOCKS.map(piece => (
            <div
              key={piece.id}
              draggable
              onDragStart={(e) => handleDragStart(e, piece)}
              className="w-16 h-16 rounded-lg flex items-center justify-center text-5xl cursor-grab active:cursor-grabbing"
              style={{ backgroundColor: piece.color }}
            />
          ))}
          <button onClick={resetGame} className="w-16 h-16 bg-red-500 rounded-lg flex items-center justify-center text-white"><RedoIcon className="w-8 h-8"/></button>
        </div>

        {/* Drop Zone */}
        <div
          ref={dropZoneRef}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          className="relative w-full aspect-video bg-sky-300 rounded-lg overflow-hidden border-4 border-dashed border-slate-600"
        >
          {placedPieces.map((piece) => (
            <div
              key={piece.id}
              className="absolute w-10 h-10 rounded"
              style={{ left: `${piece.x}px`, top: `${piece.y}px`, backgroundColor: piece.color }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default BlockBuildingGame;
