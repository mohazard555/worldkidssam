import React from 'react';
import { Story } from '../types';

interface StoryCardProps {
  story: Story;
  onStorySelect: (story: Story) => void;
}

const StoryCard: React.FC<StoryCardProps> = ({ story, onStorySelect }) => {
  const hasPages = story.pages && story.pages.length > 0;
  return (
    <div 
      className={`relative bg-black/50 rounded-2xl shadow-lg overflow-hidden transform transition-all duration-300 p-2 aspect-[3/4] ${hasPages ? 'hover:scale-105 hover:shadow-2xl cursor-pointer group' : 'opacity-70'}`}
      onClick={hasPages ? () => onStorySelect(story) : undefined}
      aria-label={story.title}
    >
      <img className="w-full h-full object-cover rounded-lg" src={story.thumbnailUrl} alt={story.title} />
       {hasPages && (
        <div className="absolute bottom-0 left-0 right-0 bg-black/50 p-2 text-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <h3 className="text-white font-bold text-sm truncate">{story.title}</h3>
        </div>
       )}
       {!hasPages && (
         <div className="absolute inset-0 bg-black/70 flex items-center justify-center p-2 text-center">
            <div>
                <h3 className="text-white font-bold text-sm">{story.title}</h3>
                <p className="text-yellow-300 text-xs mt-1">قصة فارغة</p>
            </div>
         </div>
      )}
       {story.isNew && (
        <div className="absolute top-2 -right-3 bg-yellow-400 text-slate-800 text-xs font-bold px-3 py-1 rounded-full shadow-lg transform rotate-12">
            جديد
        </div>
      )}
    </div>
  );
};

export default StoryCard;
