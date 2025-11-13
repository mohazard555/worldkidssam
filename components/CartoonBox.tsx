import React from 'react';

interface CartoonBoxProps {
  children: React.ReactNode;
  color: 'yellow' | 'blue' | 'pink';
  className?: string;
  title?: string;
  icon?: React.ReactNode;
}

const colors = {
  yellow: {
    bg: 'bg-yellow-200',
    border: 'border-yellow-400',
    text: 'text-yellow-900',
    shadow: 'shadow-yellow-500/50'
  },
  blue: {
    bg: 'bg-sky-200',
    border: 'border-sky-400',
    text: 'text-sky-900',
    shadow: 'shadow-sky-500/50'
  },
  pink: {
    bg: 'bg-pink-200',
    border: 'border-pink-400',
    text: 'text-pink-900',
    shadow: 'shadow-pink-500/50'
  }
};

const CartoonBox: React.FC<CartoonBoxProps> = ({ children, color, className, title, icon }) => {
  const theme = colors[color];
  return (
    <div className={`relative p-4 border-4 ${theme.border} rounded-2xl ${theme.bg} ${theme.text} shadow-lg ${theme.shadow} ${className} transform -rotate-1`}>
      <div className="transform rotate-1">
        {title && (
            <h3 className="text-2xl font-black mb-2 flex items-center justify-center gap-2 text-center">
                {icon}
                <span>{title}</span>
            </h3>
        )}
        <div className="text-base font-semibold leading-relaxed text-center">
            {children}
        </div>
      </div>
    </div>
  );
};

export default CartoonBox;
