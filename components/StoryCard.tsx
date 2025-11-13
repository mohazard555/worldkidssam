import React from 'react';
import { Story } from '../types';

interface StoryCardProps {
  story: Story;
  onStorySelect: (story: Story) => void;
}

const StoryCard: React.FC<StoryCardProps> = ({ story, onStorySelect }) => {
  return (
    <div 
      className="relative bg-black/50 rounded-2xl shadow-lg overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-2xl cursor-pointer group p-2 aspect-[3/4]"
      onClick={() => onStorySelect(story)}
      aria-label={story.title}
    >
      <img className="w-full h-full object-cover rounded-lg" src={story.thumbnailUrl} alt={story.title} />
      <div className="absolute bottom-0 left-0 right-0 bg-black/50 p-2 text-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <h3 className="text-white font-bold text-sm truncate">{story.title}</h3>
      </div>
       {story.isNew && (
        <div className="absolute top-2 -right-3 bg-yellow-400 text-slate-800 text-xs font-bold px-3 py-1 rounded-full shadow-lg transform rotate-12">
            جديد
        </div>
      )}
    </div>
  );
};

export default StoryCard;