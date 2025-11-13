import React, { useState, createContext, useMemo, useEffect, useRef } from 'react';
import { AppData, Story, Advertisement } from './types';
import StoryCard from './components/StoryCard';
import StoryViewer from './components/StoryViewer';
import SettingsModal, { Tab } from './components/SettingsModal';
import AdModal from './components/AdModal';
import useLocalStorage from './hooks/useLocalStorage';
import { SettingsIcon, ArrowLeftIcon, ArrowRightIcon, SearchIcon, BookIcon, SparkleIcon, YoutubeIcon, QuestionIcon, PaletteIcon, SpeakerOnIcon, SpeakerOffIcon, GiftIcon, PuzzleIcon, LightbulbIcon, PawIcon } from './components/Icons';
import ColoringBook from './components/ColoringBook';
import YoutubeSection from './components/YoutubeSection';
import QuizSection from './components/QuizSection';
import DrawingGallery from './components/DrawingGallery';
import SectionCard from './components/SectionCard';
import PuzzleGame from './components/PuzzleGame';
import DidYouKnow from './components/DidYouKnow';
import InteractiveGames from './components/InteractiveGames';

type View = 'home' | 'ad' | 'youtube' | 'story';
type MainTab = 'stories' | 'games' | 'fun';

interface IAppContext {
    appData: AppData;
    setAppData: (data: AppData) => void;
}

export const AppContext = createContext<IAppContext | null>(null);

const DEFAULT_APP_DATA: AppData = {
    settings: {
        siteTitle: "عالم قصص الأطفال",
        logoUrl: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0iI2Y5YTgwNSI+PHBhdGggZD0iTTEyIDE3LjI3TDE4LjE4IDIxbC0xLjY0LTcuMDNMMjIgOS4yNGwtNy4xOS0uNjFMMTIgMiA5LjE5IDguNjMgMiA5LjI0bDUuNDYgNC43M0w1LjgyIDIxeiIvPjwvc3ZnPg==",
        youtubeUrls: ["https://www.youtube.com/watch?v=dQw4w9WgXcQ"],
        externalLink: "https://www.google.com/search?q=parental+consent+form",
        backgroundImageUrl: '',
        developerName: '',
        developerLink: '',
        coloringPages: [],
        quizzes: [
            {
                id: 'quiz-1',
                questionText: 'ما هو لون السماء في يوم صافٍ؟',
                options: ['أحمر', 'أزرق', 'أخضر', 'أصفر'],
                correctAnswerIndex: 1
            }
        ],
        drawings: [
            {
                id: 'drawing-1',
                imageUrl: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIj48cGF0aCBkPSJNMCA4MCBDMjAgNjAsIDQwIDYwLCA1MCA4MCBDNjAgNjAsIDgwIDYwLCAxMDAgODAgVjEwMCBIMFY4MFoiIGZpbGw9IiM4Q0M5OUMiPjwvcGF0aD48cGF0aCBkPSJNNDAgNDAgQzQwIDIwLCA2MCAyMCwgNjAgNDAgQzgwIDQwLCA4MCA2MCwgNjAgNjAgQzYwIDgwLCA0MCA4MCwgNDAgNjAgQzIwIDYwLCAyMCA0MCwgNDAgNDBaIiBmaWxsPSIjRkZDNzA1Ij48L3BhdGg+PGNpcmNsZSBjeD0iNTAiIGN5PSI1MCIgcj0iMjUiIGZpbGw9IiNGRkZBRTYiPjwvY2lyYle+PC9zdmc+',
                title: 'رسمة الشمس الساطعة'
            }
        ],
        puzzleImages: [],
        funFacts: [],
    },
    stories: [
      { id: 'animal-1', title: 'الثعلب الشجاع', thumbnailUrl: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIj48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iIzdGQkEyRiI+PC9yZWN0PjxwYXRoIGQ9Ik01MCAxMCBDMzAgMTAsIDI1IDMwLCAyNSAzMCBDMjUgNDAsIDQwIDQ1LCA0MCA0NSBMNjAgNDUgQzYwIDQ1LCA3NSA0MCwgNzUgMzAgQzc1IDMwLCA3MCAxMCwgNTAgMTBaIiBmaWxsPSIjRkY3QjAwIj48L3BhdGg+PHBhdGggZD0iTTUwIDYwIEw1MCA5MCBDMzAgOTAsIDI1IDcwLCAyNSA3MCBMNzUgNzAgQzc1IDcwLCA3MCA5MCwgNTAgOTBaIiBmaWxsPSIjRkY3QjAwIj48L3BhdGggZD0iTTM1IDM1IEw0NSAzNSBMNDAgMjUgWiIgZmlsbD0iI0ZGRiI+PC9wYXRoPjxwYXRoIGQ9Ik01NSAzNSBMNjUgMzUgTDYwIDI1IFoiIGZpbGw9IiNGRkYiPjwvcGF0aD48Y2lyY2xlIGN4PSIzOCIgY3k9IjM4IiByPSIyIiBmaWxsPSIjMDAwIj48L2NpcmNsZT48Y2lyY2xlIGN4PSI2MiIgY3k9IjM4IiByPSIyIiBmaWxsPSIjMDAwIj48L2NpcmNsZT48cGF0aCBkPSJNNCAyMCBDMjAgLTUsIDgwIC01LCA5NiAyMCBMOTAgMjUgQzgwIDAsIDIwIDAsIDEwIDI1IFoiIGZpbGw9IiNGRjdCMDAiPjwvcGF0aD48L3N2Zz4=', pages: [ { imageUrl: 'https://picsum.photos/seed/a1-1/800/600' } ]},
      { id: 'animal-2', title: 'البومة الحكيمة', thumbnailUrl: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIj48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iI0E3RDdGNCI+PC9yZWN0PjxwYXRoIGQ9Ik01MCAyMCBDMzAgMjAsIDI1IDQ1LCAyNSA0NSBMNzUgNDUgQzc1IDQ1LCA3MCAyMCwgNTAgMjBaIiBmaWxsPSIjNUQ0QzNCIj48L3BhdGg+PHBhdGggZD0iTTI1IDQ1IEw3NSA0NSBMNzUgODAgQzcwIDg1LCAzMCA4NSwgMjUgODAgWiIgZmlsbD0iI0E2NzY1OCI+PC9wYXRoPjxjaXJjbGUgY3g9IjQwIiBjeT0iNDUiIHI9IjE1IiBmaWxsPSIjRkZGIj48L2NpcmNsZT48Y2lyY2xlIGN4PSI2MCIgY3k9IjQ1IiByPSIxNSIgZmlsbD0iI0ZGRiI+PC9jaXJjbGU+PGNpcmNsZSBjeD0iNDAiIGN5PSI0NSIgcj0iNSIgZmlsbD0iIzAwMCI+PC9jaXJjbGU+PGNpcmNsZSBjeD0iNjAiIGN5PSI0NSIgcj0iNSIgZmlsbD0iIzAwMCI+PC9jaXJjbGU+PHBhdGggZD0iTTQ1IDI1IEw1NSAyNSBMNTAgMTUgWiIgZmlsbD0iIzVENCZDUIiPjwvcGF0aD48cGF0aCBkPSJNNTAgNjAgTDYwIDcwIEw0MCA3MCBaIiBmaWxsPSIjRkZBNTAwIj48L3BhdGg+PC9zdmc+', pages: [ { imageUrl: 'https://picsum.photos/seed/a2-1/800/600' } ]},
    ],
    advertisements: [],
    gist: {
        rawUrl: '',
        accessToken: ''
    }
};

const Header: React.FC<{ 
    onSettingsClick: () => void;
    onAdsClick: () => void;
    isMuted: boolean;
    onMuteToggle: () => void;
}> = ({ onSettingsClick, onAdsClick, isMuted, onMuteToggle }) => {
    const { appData } = React.useContext(AppContext)!;
    return (
        <header className="bg-black/30 backdrop-blur-sm sticky top-0 z-40 shadow-md">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center py-3">
                <div className="flex items-center space-x-3 space-x-reverse">
                    <img src={appData.settings.logoUrl} alt="Logo" className="h-10 w-10 sm:h-12 sm:w-12 rounded-full object-cover border-2 border-white/50"/>
                    <h1 className="text-3xl sm:text-5xl font-black bg-gradient-to-r from-yellow-300 via-orange-400 to-red-500 text-transparent bg-clip-text" style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.2)' }}>{appData.settings.siteTitle}</h1>
                </div>
                <div className="flex items-center space-x-1 sm:space-x-2 space-x-reverse">
                     <button onClick={onMuteToggle} className="text-white hover:text-yellow-300 transition-colors p-2 rounded-full" aria-label={isMuted ? 'تشغيل الصوت العام' : 'كتم الصوت العام'}>
                        {isMuted ? <SpeakerOffIcon className="w-7 h-7" /> : <SpeakerOnIcon className="w-7 h-7" />}
                    </button>
                    <button onClick={onAdsClick} className="text-white hover:text-yellow-300 transition-colors p-2 rounded-full" aria-label="الإعلانات">
                        <GiftIcon className="w-7 h-7" />
                    </button>
                    <button onClick={onSettingsClick} className="text-white hover:text-yellow-300 transition-colors p-2 rounded-full" aria-label="الإعدادات">
                        <SettingsIcon className="w-7 h-7" />
                    </button>
                </div>
            </div>
        </header>
    );
};

const App: React.FC = () => {
  const [appData, setAppData] = useLocalStorage<AppData>('appData', DEFAULT_APP_DATA);
  const [selectedStory, setSelectedStory] = useState<Story | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [adToShow, setAdToShow] = useState<Advertisement | null>(null);
  const [storyAfterAd, setStoryAfterAd] = useState<Story | null>(null);
  const [isGloballyMuted, setIsGloballyMuted] = useLocalStorage<boolean>('isGloballyMuted', false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [activeMainTab, setActiveMainTab] = useState<MainTab>('stories');
  const [searchTerm, setSearchTerm] = useState('');
  const [settingsInitialTab, setSettingsInitialTab] = useState<Tab | undefined>();

  useEffect(() => {
    document.title = appData.settings.siteTitle;
    const favicon = document.querySelector("link[rel~='icon']");
    if (favicon) {
      (favicon as HTMLLinkElement).href = appData.settings.logoUrl;
    }
  }, [appData.settings.siteTitle, appData.settings.logoUrl]);
  
   useEffect(() => {
    if (audioRef.current) {
      audioRef.current.muted = isGloballyMuted;
    }
  }, [isGloballyMuted]);


  const handleStorySelect = (story: Story) => {
    const enabledAds = appData.advertisements.filter(ad => ad.enabled);
    if (enabledAds.length > 0) {
      const randomAd = enabledAds[Math.floor(Math.random() * enabledAds.length)];
      setAdToShow(randomAd);
      setStoryAfterAd(story);
    } else {
      setSelectedStory(story);
    }
  };

  const handleAdContinue = () => {
    if (storyAfterAd) {
      setSelectedStory(storyAfterAd);
    }
    setAdToShow(null);
    setStoryAfterAd(null);
  };
  
  const handleOpenSettings = () => {
    setSettingsInitialTab(undefined);
    setIsSettingsOpen(true);
  };

  const handleOpenAds = () => {
    setSettingsInitialTab('ads');
    setIsSettingsOpen(true);
  };

  const handleCloseSettings = () => setIsSettingsOpen(false);

  const filteredStories = useMemo(() => {
    if (!searchTerm) return appData.stories;
    return appData.stories.filter(story =>
      story.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, appData.stories]);

  const backgroundStyle = appData.settings.backgroundImageUrl ? {
      backgroundImage: `url(${appData.settings.backgroundImageUrl})`
  } : {};
  
  return (
    <AppContext.Provider value={{ appData, setAppData }}>
        <div className="min-h-screen text-white" style={backgroundStyle}>
            <Header 
                onSettingsClick={handleOpenSettings}
                onAdsClick={handleOpenAds}
                isMuted={isGloballyMuted}
                onMuteToggle={() => setIsGloballyMuted(!isGloballyMuted)}
            />
            <main className="container mx-auto p-4 sm:p-6 lg:p-8">
                <div className="mb-8 flex justify-center space-x-1 space-x-reverse bg-slate-900/50 p-1 rounded-full max-w-md mx-auto text-sm">
                    <button 
                        onClick={() => setActiveMainTab('stories')}
                        className={`flex-1 flex items-center justify-center space-x-1.5 space-x-reverse px-3 py-1.5 rounded-full font-bold transition-all duration-300 ${activeMainTab === 'stories' ? 'bg-yellow-400 text-slate-800 shadow-md' : 'text-white hover:bg-white/10'}`}
                    >
                        <BookIcon className="w-5 h-5" />
                        <span>القصص والفيديو</span>
                    </button>
                    <button 
                        onClick={() => setActiveMainTab('games')}
                        className={`flex-1 flex items-center justify-center space-x-1.5 space-x-reverse px-3 py-1.5 rounded-full font-bold transition-all duration-300 ${activeMainTab === 'games' ? 'bg-yellow-400 text-slate-800 shadow-md' : 'text-white hover:bg-white/10'}`}
                    >
                        <PuzzleIcon className="w-5 h-5" />
                        <span>الألعاب والتسلية</span>
                    </button>
                    <button 
                        onClick={() => setActiveMainTab('fun')}
                        className={`flex-1 flex items-center justify-center space-x-1.5 space-x-reverse px-3 py-1.5 rounded-full font-bold transition-all duration-300 ${activeMainTab === 'fun' ? 'bg-yellow-400 text-slate-800 shadow-md' : 'text-white hover:bg-white/10'}`}
                    >
                        <LightbulbIcon className="w-5 h-5" />
                        <span>هل تعلم</span>
                    </button>
                </div>

                <div>
                    {activeMainTab === 'stories' && (
                        <div className="animate-fade-in">
                             <SectionCard
                                title="قصص مصورة"
                                count={filteredStories.length}
                                icon={<BookIcon className="w-8 h-8" />}
                                colorClasses="from-blue-500 to-indigo-600"
                                defaultOpen={true}
                            >
                                <div className="relative mb-6">
                                    <input
                                        type="search"
                                        placeholder="ابحث عن قصة..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="w-full bg-slate-800/50 text-white placeholder-gray-400 rounded-full py-3 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-yellow-400 border border-transparent focus:border-yellow-400"
                                    />
                                    <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-400" />
                                </div>
                                {filteredStories.length > 0 ? (
                                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                                    {filteredStories.map((story) => (
                                        <StoryCard key={story.id} story={story} onStorySelect={handleStorySelect} />
                                    ))}
                                    </div>
                                ) : (
                                    <div className="text-center text-white/80 p-8 bg-slate-800/50 rounded-xl">
                                        <p className="font-bold text-lg">{searchTerm ? 'لا توجد نتائج بحث!' : 'لا توجد قصص حالياً.'}</p>
                                        <p className="text-sm mt-2">{searchTerm ? 'جرّب كلمة بحث أخرى.' : 'لإضافة قصص، اذهب إلى لوحة التحكم ⚙️.'}</p>
                                    </div>
                                )}
                            </SectionCard>
                             <SectionCard
                                title="شاهد على يوتيوب"
                                count={appData.settings.youtubeUrls.length}
                                icon={<YoutubeIcon className="w-8 h-8" />}
                                colorClasses="from-red-500 to-red-700"
                            >
                                <YoutubeSection />
                            </SectionCard>
                        </div>
                    )}

                    {activeMainTab === 'games' && (
                         <div className="animate-fade-in">
                             <SectionCard
                                title="ألعاب تعليمية"
                                count={8}
                                icon={<PawIcon className="w-8 h-8" />}
                                colorClasses="from-teal-500 to-cyan-600"
                                defaultOpen={true}
                            >
                                <InteractiveGames />
                            </SectionCard>
                            <SectionCard
                                title="تلوين ومرح"
                                count={appData.settings.coloringPages.length}
                                icon={<SparkleIcon className="w-8 h-8" />}
                                colorClasses="from-pink-500 to-rose-500"
                            >
                                <ColoringBook />
                            </SectionCard>
                            
                            <SectionCard
                                title="ألغاز ومسابقات"
                                count={appData.settings.quizzes.length}
                                icon={<QuestionIcon className="w-8 h-8" />}
                                colorClasses="from-green-500 to-teal-600"
                            >
                                <QuizSection />
                            </SectionCard>
                            
                            <SectionCard
                                title="ألعاب مسلية"
                                count={appData.settings.puzzleImages.length}
                                icon={<PuzzleIcon className="w-8 h-8" />}
                                colorClasses="from-purple-500 to-indigo-600"
                            >
                                <PuzzleGame />
                            </SectionCard>
                            
                            <SectionCard
                                title="معرض الرسومات"
                                count={appData.settings.drawings.length}
                                icon={<PaletteIcon className="w-8 h-8" />}
                                colorClasses="from-orange-500 to-amber-600"
                            >
                                <DrawingGallery />
                            </SectionCard>
                        </div>
                    )}
                     {activeMainTab === 'fun' && (
                         <div className="animate-fade-in">
                            <SectionCard
                                title="هل تعلم يا طفلي العزيز"
                                count={(appData.settings.funFacts || []).length}
                                icon={<LightbulbIcon className="w-8 h-8" />}
                                colorClasses="from-yellow-400 to-orange-500"
                                defaultOpen={true}
                            >
                                <DidYouKnow />
                            </SectionCard>
                        </div>
                    )}
                </div>
            </main>
            { (appData.settings.developerName || appData.settings.developerLink) && (
                 <footer className="text-center p-4 text-sm text-white/50">
                    <p>
                        تطوير: {' '}
                        <a href={appData.settings.developerLink || '#'} target="_blank" rel="noopener noreferrer" className="hover:text-yellow-300 underline">
                           {appData.settings.developerName || 'المطور'}
                        </a>
                    </p>
                </footer>
            )}
        </div>
        {selectedStory && <StoryViewer story={selectedStory} onClose={() => setSelectedStory(null)} />}
        {isSettingsOpen && <SettingsModal onClose={handleCloseSettings} initialTab={settingsInitialTab}/>}
        {adToShow && <AdModal ad={adToShow} onContinue={handleAdContinue} />}
    </AppContext.Provider>
  );
};

export default App;