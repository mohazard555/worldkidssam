import React, { useState, useEffect } from 'react';
import { Advertisement, Story } from '../types';

interface AdModalProps {
  ad: Advertisement;
  onContinue: () => void;
}

const AdModal: React.FC<AdModalProps> = ({ ad, onContinue }) => {
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleAdClick = () => {
    if (ad.linkUrl) {
      window.open(ad.linkUrl, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4" dir="rtl">
      <div className="bg-gradient-to-br from-yellow-200 to-orange-200 rounded-3xl shadow-2xl w-full max-w-md p-6 relative border-8 border-white text-center">
        <h2 className="text-3xl font-black text-slate-800 mb-2">{ad.title}</h2>
        <p className="text-slate-600 mb-4">{ad.description}</p>
        
        <div 
          className="w-full aspect-video bg-gray-300 rounded-2xl mb-4 overflow-hidden shadow-lg cursor-pointer"
          onClick={handleAdClick}
        >
          <img src={ad.imageUrl} alt={ad.title} className="w-full h-full object-cover" />
        </div>

        <button
          onClick={onContinue}
          disabled={countdown > 0}
          className="w-full bg-green-500 text-white font-bold py-3 px-6 rounded-full hover:bg-green-600 transition-all shadow-lg border-b-4 border-green-700 active:border-b-0 active:translate-y-1 transform text-lg disabled:bg-gray-400 disabled:border-gray-500 disabled:cursor-not-allowed disabled:transform-none"
        >
          {countdown > 0 ? `يمكنك المتابعة بعد ${countdown} ثوانٍ` : "متابعة إلى القصة"}
        </button>
      </div>
    </div>
  );
};

export default AdModal;