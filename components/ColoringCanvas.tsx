import React, { useRef, useEffect, useState } from 'react';
import { ColoringPage } from '../types';
import { ArrowRightIcon, TrashIcon, ShareIcon } from './Icons';

// A helper function to convert hex to RGBA
const hexToRgba = (hex: string): [number, number, number, number] => {
  let r = 0, g = 0, b = 0;
  if (hex.length === 4) { // #RGB
    r = parseInt(hex[1] + hex[1], 16);
    g = parseInt(hex[2] + hex[2], 16);
    b = parseInt(hex[3] + hex[3], 16);
  } else if (hex.length === 7) { // #RRGGBB
    r = parseInt(hex[1] + hex[2], 16);
    g = parseInt(hex[3] + hex[4], 16);
    b = parseInt(hex[5] + hex[6], 16);
  }
  return [r, g, b, 255];
};

const PALETTE = ['#ff0000', '#0000ff', '#00ff00', '#ffff00', '#ffa500', '#800080', '#ffc0cb', '#a52a2a', '#000000', '#ffffff', '#808080', '#00ffff'];

const ColoringCanvas: React.FC<{ image: ColoringPage; onBack: () => void; }> = ({ image, onBack }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [currentColor, setCurrentColor] = useState(PALETTE[0]);
  const [isLoading, setIsLoading] = useState(true);

  const drawImage = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;
    
    setIsLoading(true);
    const img = new Image();
    img.crossOrigin = 'Anonymous';
    img.src = image.imageUrl;
    img.onload = () => {
      // Scale image to fit canvas
      const canvasWidth = canvas.width;
      const canvasHeight = canvas.height;
      const hRatio = canvasWidth / img.width;
      const vRatio = canvasHeight / img.height;
      const ratio = Math.min(hRatio, vRatio) * 0.95; // Add some padding
      const centerShift_x = (canvasWidth - img.width * ratio) / 2;
      const centerShift_y = (canvasHeight - img.height * ratio) / 2;
      
      ctx.fillStyle = "white";
      ctx.fillRect(0, 0, canvasWidth, canvasHeight);
      ctx.drawImage(img, 0, 0, img.width, img.height,
                    centerShift_x, centerShift_y, img.width * ratio, img.height * ratio);
      setIsLoading(false);
    };
    img.onerror = () => {
        setIsLoading(false);
        console.error("Failed to load image for coloring.");
    }
  };

  useEffect(() => {
    drawImage();
  }, [image.imageUrl]);

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas || isLoading) return;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = Math.floor((e.clientX - rect.left) * (canvas.width / rect.width));
    const y = Math.floor((e.clientY - rect.top) * (canvas.height / rect.height));

    floodFill(ctx, x, y, hexToRgba(currentColor));
  };

  const floodFill = (ctx: CanvasRenderingContext2D, startX: number, startY: number, fillColor: [number, number, number, number]) => {
      const canvas = ctx.canvas;
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;
      const canvasWidth = canvas.width;
      const canvasHeight = canvas.height;

      const getPixelIndex = (x: number, y: number) => (y * canvasWidth + x) * 4;

      const targetIndex = getPixelIndex(startX, startY);
      const targetColor = [data[targetIndex], data[targetIndex + 1], data[targetIndex + 2]];

      // If target color is same as fill color, do nothing
      if (targetColor[0] === fillColor[0] && targetColor[1] === fillColor[1] && targetColor[2] === fillColor[2]) {
          return;
      }

      // If target is a line (dark color), do nothing
      if (targetColor[0] < 50 && targetColor[1] < 50 && targetColor[2] < 50) {
          return;
      }

      const queue: [number, number][] = [[startX, startY]];
      const visited = new Set<string>();
      visited.add(`${startX},${startY}`);

      const isColorMatch = (r: number, g: number, b: number) => {
          const tolerance = 20;
          return Math.abs(r - targetColor[0]) <= tolerance &&
                 Math.abs(g - targetColor[1]) <= tolerance &&
                 Math.abs(b - targetColor[2]) <= tolerance;
      };

      while (queue.length > 0) {
          const [x, y] = queue.shift()!;
          const currentIndex = getPixelIndex(x, y);

          data[currentIndex] = fillColor[0];
          data[currentIndex + 1] = fillColor[1];
          data[currentIndex + 2] = fillColor[2];
          data[currentIndex + 3] = 255;

          const neighbors = [[x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1]];
          for (const [nx, ny] of neighbors) {
              const key = `${nx},${ny}`;
              if (nx >= 0 && nx < canvasWidth && ny >= 0 && ny < canvasHeight && !visited.has(key)) {
                  visited.add(key);
                  const neighborIndex = getPixelIndex(nx, ny);
                  if (isColorMatch(data[neighborIndex], data[neighborIndex + 1], data[neighborIndex + 2])) {
                      queue.push([nx, ny]);
                  }
              }
          }
      }
      ctx.putImageData(imageData, 0, 0);
  };
  
  const handleSave = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const link = document.createElement('a');
      link.download = `coloring-page-${Date.now()}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
  };

  return (
    <div className="flex flex-col items-center animate-fade-in w-full">
        <div className="relative w-full max-w-4xl">
            <canvas
                ref={canvasRef}
                width={800}
                height={600}
                onClick={handleCanvasClick}
                className="w-full aspect-[4/3] bg-white rounded-lg shadow-lg cursor-crosshair"
            />
            {isLoading && (
                 <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-lg">
                    <p className="text-white text-xl">جاري تحميل الصورة...</p>
                 </div>
            )}
        </div>

        <div className="mt-4 flex flex-wrap justify-center items-center gap-2 p-3 bg-slate-800 rounded-full shadow-lg">
             <button onClick={onBack} title="رجوع" className="p-3 bg-red-500 rounded-full text-white hover:bg-red-600 transition-colors"><ArrowRightIcon className="w-6 h-6"/></button>
             <button onClick={drawImage} title="مسح الكل" className="p-3 bg-gray-500 rounded-full text-white hover:bg-gray-600 transition-colors"><TrashIcon className="w-6 h-6"/></button>
            
            <div className="w-px h-8 bg-slate-600 mx-2"></div>

            {PALETTE.map(color => (
                <button
                    key={color}
                    onClick={() => setCurrentColor(color)}
                    className={`w-10 h-10 rounded-full border-4 transition-all ${currentColor === color ? 'border-yellow-300 scale-110' : 'border-transparent'}`}
                    style={{ backgroundColor: color }}
                    title={`اختر اللون ${color}`}
                />
            ))}
             <div className="w-px h-8 bg-slate-600 mx-2"></div>
             <button onClick={handleSave} title="حفظ الصورة" className="p-3 bg-green-500 rounded-full text-white hover:bg-green-600 transition-colors"><ShareIcon className="w-6 h-6"/></button>

        </div>
    </div>
  );
};

export default ColoringCanvas;