import React, { useState, useEffect, useRef, useContext } from 'react';
import { Story } from '../types';
import { ChevronLeftIcon, ChevronRightIcon, CloseIcon, SpeakerOnIcon, SpeakerOffIcon } from './Icons';
import { AppContext } from '../App';

interface StoryViewerProps {
  story: Story;
  onClose: () => void;
}

const StoryViewer: React.FC<StoryViewerProps> = ({ story, onClose }) => {
  const { appData } = useContext(AppContext)!;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const turnAudioRef = useRef<HTMLAudioElement>(null);
  const musicAudioRef = useRef<HTMLAudioElement>(null);
  const narrationAudioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    // Preload images
    story.pages.forEach((page) => {
      const img = new Image();
      img.src = page.imageUrl;
    });
  }, [story.pages]);

  // Handle music playback
  useEffect(() => {
    const audioEl = musicAudioRef.current;
    if (audioEl && appData.settings.backgroundMusicUrl) {
      audioEl.volume = 0.3;
      const playPromise = audioEl.play();
      if (playPromise !== undefined) {
        playPromise.catch(error => {
          console.error("Audio autoplay was prevented:", error);
          setIsMuted(true);
        });
      }
    }
    
    return () => {
      audioEl?.pause();
    };
  }, [appData.settings.backgroundMusicUrl]);

  // Sync the muted state of all audio elements with the isMuted state
  useEffect(() => {
      if(musicAudioRef.current) {
          musicAudioRef.current.muted = isMuted;
      }
      if(narrationAudioRef.current) {
          narrationAudioRef.current.muted = isMuted;
      }
  }, [isMuted]);

  // Handle narration playback
  useEffect(() => {
    const currentPage = story.pages[currentIndex];
    const audioEl = narrationAudioRef.current;
    if (audioEl && currentPage.audioUrl) {
        audioEl.src = currentPage.audioUrl;
        audioEl.play().catch(e => console.error("Narration audio play failed:", e));
    } else if (audioEl) {
        audioEl.pause();
        if (audioEl.hasAttribute('src')) {
            audioEl.removeAttribute('src');
        }
    }
  }, [currentIndex, story.pages]);


  const playSound = () => {
    if(turnAudioRef.current) {
      turnAudioRef.current.currentTime = 0;
      turnAudioRef.current.play().catch(e => console.error("Audio play failed:", e));
    }
  };

  const goToPrevious = () => {
    const isFirstSlide = currentIndex === 0;
    const newIndex = isFirstSlide ? story.pages.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
    playSound();
  };

  const goToNext = () => {
    const isLastSlide = currentIndex === story.pages.length - 1;
    const newIndex = isLastSlide ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
    playSound();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4">
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-4xl aspect-[4/3] flex flex-col items-center justify-center p-2">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 sm:top-[-15px] sm:right-[-15px] text-white bg-red-600 rounded-full p-2 hover:bg-red-700 transition-all z-20 shadow-lg"
          aria-label="إغلاق عرض القصة"
        >
          <CloseIcon className="w-8 h-8" />
        </button>
        
        <div className="relative w-full h-full">
            <img 
                src={story.pages[currentIndex].imageUrl} 
                alt={`${story.title} - صفحة ${currentIndex + 1}`} 
                className="w-full h-full object-contain rounded-lg"
            />
        </div>

        <button
          onClick={goToPrevious}
          className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 text-white bg-red-600 rounded-full p-2 hover:bg-red-700 transition-all shadow-md z-10"
          aria-label="الصورة السابقة"
        >
          <ChevronLeftIcon className="w-8 h-8" />
        </button>
        <button
          onClick={goToNext}
          className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 text-white bg-red-600 rounded-full p-2 hover:bg-red-700 transition-all shadow-md z-10"
          aria-label="الصورة التالية"
        >
          <ChevronRightIcon className="w-8 h-8" />
        </button>
        <div className="absolute bottom-4 text-white bg-black bg-opacity-60 px-4 py-1 rounded-full text-lg">
            {story.pages.length} / {currentIndex + 1}
        </div>
        
        {(appData.settings.backgroundMusicUrl || story.pages.some(p => p.audioUrl)) && (
            <>
                <button
                    onClick={() => setIsMuted(!isMuted)}
                    className="absolute bottom-2 left-2 text-white bg-green-500 rounded-full p-3 hover:bg-green-600 transition-all z-10 shadow-md"
                    aria-label={isMuted ? "تشغيل الصوت" : "كتم الصوت"}
                >
                    {isMuted ? <SpeakerOffIcon className="w-7 h-7" /> : <SpeakerOnIcon className="w-7 h-7" />}
                </button>
            </>
        )}
      </div>
      <audio ref={turnAudioRef} src="https://actions.google.com/sounds/v1/ui/page_turn.ogg" preload="auto" />
      {appData.settings.backgroundMusicUrl && <audio ref={musicAudioRef} src={appData.settings.backgroundMusicUrl} loop />}
      <audio ref={narrationAudioRef} preload="auto" />
    </div>
  );
};

export default StoryViewer;
