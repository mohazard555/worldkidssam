import React, { useState, ReactNode } from 'react';
import { ChevronDownIcon } from './Icons';

interface SectionCardProps {
  title: string;
  count: number;
  icon: ReactNode;
  colorClasses: string; // e.g., "from-blue-500 to-indigo-600"
  children: ReactNode;
  defaultOpen?: boolean;
}

const SectionCard: React.FC<SectionCardProps> = ({ title, count, icon, colorClasses, children, defaultOpen = false }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  if (count === 0) {
      // Don't render the card if there's no content to show, except for stories which has a special empty state.
      // This can be adjusted based on desired behavior for each section.
      if (title !== "قصص مصورة") {
        return null;
      }
  }

  return (
    <div className={`rounded-2xl shadow-lg mb-8 text-white overflow-hidden transition-all duration-500`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex justify-between items-center text-right p-4 sm:p-6 bg-gradient-to-br ${colorClasses}`}
        aria-expanded={isOpen}
        aria-controls={`section-content-${title}`}
      >
        <div className="flex items-center space-x-3 space-x-reverse">
          <div className="bg-white/20 p-2 rounded-lg">{icon}</div>
          <h2 className="text-2xl sm:text-3xl font-bold">{title} ({count})</h2>
        </div>
        <ChevronDownIcon className={`w-8 h-8 text-white transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      {isOpen && (
        <div id={`section-content-${title}`} className="bg-black/20 p-4 sm:p-6 animate-fade-in">
          {children}
        </div>
      )}
    </div>
  );
};

export default SectionCard;
