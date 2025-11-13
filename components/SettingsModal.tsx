import React, { useState, useContext, ChangeEvent, useRef } from 'react';
import { AppData, Story, StoryPage, Advertisement, QuizQuestion, ColoringPage, Drawing, FunFact } from '../types';
import { AppContext } from '../App';
import { CloseIcon, SettingsIcon, BookIcon, GiftIcon, SyncIcon, TrashIcon, EditIcon, PlusIcon, MusicIcon, SparkleIcon, QuestionIcon, PaletteIcon, PuzzleIcon, LightbulbIcon } from './Icons';

export type Tab = 'general' | 'stories' | 'ads' | 'sync' | 'fun' | 'quizzes' | 'drawings' | 'puzzles' | 'facts';

const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
  });
};

const SettingsModal: React.FC<{ onClose: () => void; initialTab?: Tab }> = ({ onClose, initialTab = 'general' }) => {
  const { appData, setAppData } = useContext(AppContext)!;
  const [localData, setLocalData] = useState<AppData>(JSON.parse(JSON.stringify(appData)));
  const [activeTab, setActiveTab] = useState<Tab>(initialTab);
  const importFileRef = useRef<HTMLInputElement>(null);

  const handleSave = () => {
    setAppData(localData);
    onClose();
  };
  
  // General Settings Handlers
  const handleSettingsChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    const isYoutube = name === 'youtubeUrls';
    setLocalData(prev => ({ ...prev, settings: { ...prev.settings, [name]: isYoutube ? value.split('\n') : value } }));
  };
  const handleLogoChange = async (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const base64 = await fileToBase64(e.target.files[0]);
      setLocalData(prev => ({ ...prev, settings: {...prev.settings, logoUrl: base64 }}));
    }
  };
   const handleBackgroundImageChange = async (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const base64 = await fileToBase64(e.target.files[0]);
      setLocalData(prev => ({ ...prev, settings: { ...prev.settings, backgroundImageUrl: base64 } }));
    }
  };
  const removeBackgroundImage = () => {
    setLocalData(prev => ({ ...prev, settings: { ...prev.settings, backgroundImageUrl: '' } }));
  };
  const handleMusicChange = async (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const base64 = await fileToBase64(e.target.files[0]);
      setLocalData(prev => ({ ...prev, settings: {...prev.settings, backgroundMusicUrl: base64 }}));
    }
  };


  // Story Handlers
  const handleAddStory = async () => {
      const title = prompt("ما هو عنوان القصة الجديدة؟");
      if(title) {
          const newStory: Story = { id: `story-${Date.now()}`, title, thumbnailUrl: '', pages: [], isNew: true };
          setLocalData(prev => ({ ...prev, stories: [...prev.stories, newStory] }));
      }
  };
  const handleStoryTitleChange = (storyId: string, newTitle: string) => {
      setLocalData(prev => ({...prev, stories: prev.stories.map(s => s.id === storyId ? {...s, title: newTitle} : s)}));
  };
  const handleDeleteStory = (storyId: string) => {
      if(window.confirm("هل أنت متأكد من رغبتك في حذف هذه القصة؟")) {
        setLocalData(prev => ({ ...prev, stories: prev.stories.filter(s => s.id !== storyId) }));
      }
  };
  const handleThumbnailChange = async (storyId: string, e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const base64 = await fileToBase64(e.target.files[0]);
      setLocalData(prev => ({...prev, stories: prev.stories.map(s => s.id === storyId ? {...s, thumbnailUrl: base64} : s)}));
    }
  };
  const handleStoryImagesChange = async (storyId: string, e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      const base64Images = await Promise.all(files.map(fileToBase64));
      const newPages: StoryPage[] = base64Images.map(img => ({ imageUrl: img }));
      setLocalData(prev => ({...prev, stories: prev.stories.map(s => s.id === storyId ? {...s, pages: [...s.pages, ...newPages]} : s)}));
    }
  };
  const handleDeleteStoryPage = (storyId: string, pageIndex: number) => {
      setLocalData(prev => ({...prev, stories: prev.stories.map(s => s.id === storyId ? {...s, pages: s.pages.filter((_, i) => i !== pageIndex)} : s)}));
  };
  const handleStoryAudioChange = async (storyId: string, pageIndex: number, e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const base64 = await fileToBase64(e.target.files[0]);
      setLocalData(prev => ({
        ...prev,
        stories: prev.stories.map(s =>
          s.id === storyId
            ? { ...s, pages: s.pages.map((p, i) => i === pageIndex ? { ...p, audioUrl: base64 } : p) }
            : s
        ),
      }));
    }
  };
  const handleRemoveStoryAudio = (storyId: string, pageIndex: number) => {
    setLocalData(prev => ({
      ...prev,
      stories: prev.stories.map(s =>
        s.id === storyId
          ? { ...s, pages: s.pages.map((p, i) => i === pageIndex ? { ...p, audioUrl: undefined } : p) }
          : s
      ),
    }));
  };


  // Ad Handlers
    const handleAddAd = () => {
        const newAd: Advertisement = {
            id: `ad-${Date.now()}`,
            enabled: true,
            title: 'إعلان جديد',
            description: '',
            imageUrl: '',
            linkUrl: ''
        };
        setLocalData(prev => ({...prev, advertisements: [...(prev.advertisements || []), newAd]}));
    };
    const handleDeleteAd = (adId: string) => {
        if(window.confirm("هل أنت متأكد من رغبتك في حذف هذا الإعلان؟")) {
            setLocalData(prev => ({...prev, advertisements: prev.advertisements.filter(ad => ad.id !== adId)}));
        }
    };
    const handleAdChange = (adId: string, e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        const isCheckbox = type === 'checkbox';
        const checked = (e.target as HTMLInputElement).checked;
        const finalValue = isCheckbox ? checked : value;

        setLocalData(prev => ({
            ...prev,
            advertisements: prev.advertisements.map(ad => ad.id === adId ? {...ad, [name]: finalValue} : ad)
        }));
    };
    const handleAdImageChange = async (adId: string, e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const base64 = await fileToBase64(e.target.files[0]);
            setLocalData(prev => ({
                ...prev,
                advertisements: prev.advertisements.map(ad => ad.id === adId ? {...ad, imageUrl: base64} : ad)
            }));
        }
    };
    
  // Fun/Coloring Pages Handlers
  const handleColoringImagesChange = async (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      const base64Images = await Promise.all(files.map(fileToBase64));
      const newPages: ColoringPage[] = base64Images.map(img => ({ id: `coloring-${Date.now()}-${Math.random()}`, imageUrl: img }));
      
      setLocalData(prev => ({
        ...prev,
        settings: {
          ...prev.settings,
          coloringPages: [...(prev.settings.coloringPages || []), ...newPages]
        }
      }));
    }
  };

  const handleDeleteColoringPage = (pageId: string) => {
    setLocalData(prev => ({
      ...prev,
      settings: {
        ...prev.settings,
        coloringPages: prev.settings.coloringPages.filter(p => p.id !== pageId)
      }
    }));
  };

  // Drawing Gallery Handlers
  const handleDrawingsChange = async (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      const base64Images = await Promise.all(files.map(fileToBase64));
      const newDrawings: Drawing[] = base64Images.map(img => ({
        id: `drawing-${Date.now()}-${Math.random()}`,
        imageUrl: img,
        title: 'رسمة جميلة'
      }));
      setLocalData(prev => ({ ...prev, settings: { ...prev.settings, drawings: [...(prev.settings.drawings || []), ...newDrawings] }}));
    }
  };
  const handleDeleteDrawing = (drawingId: string) => {
    setLocalData(prev => ({ ...prev, settings: { ...prev.settings, drawings: prev.settings.drawings.filter(p => p.id !== drawingId) }}));
  };
  const handleDrawingTitleChange = (drawingId: string, newTitle: string) => {
    setLocalData(prev => ({ ...prev, settings: { ...prev.settings, drawings: prev.settings.drawings.map(d => d.id === drawingId ? { ...d, title: newTitle } : d) }}));
  };


  // Quiz Handlers
  const handleAddQuiz = () => {
    const newQuiz: QuizQuestion = {
      id: `quiz-${Date.now()}`,
      questionText: 'سؤال جديد...',
      options: ['إجابة 1', 'إجابة 2'],
      correctAnswerIndex: 0,
    };
    setLocalData(prev => ({ ...prev, settings: { ...prev.settings, quizzes: [...(prev.settings.quizzes || []), newQuiz] } }));
  };
  const handleDeleteQuiz = (quizId: string) => {
    if (window.confirm("هل أنت متأكد من حذف هذا السؤال؟")) {
      setLocalData(prev => ({ ...prev, settings: { ...prev.settings, quizzes: prev.settings.quizzes.filter(q => q.id !== quizId) }}));
    }
  };
  const handleQuizChange = (quizId: string, value: string) => {
    setLocalData(prev => ({ ...prev, settings: { ...prev.settings, quizzes: prev.settings.quizzes.map(q => q.id === quizId ? { ...q, questionText: value } : q) }}));
  };
  const handleOptionChange = (quizId: string, optionIndex: number, value: string) => {
    setLocalData(prev => ({ ...prev, settings: { ...prev.settings, quizzes: prev.settings.quizzes.map(q => q.id === quizId ? { ...q, options: q.options.map((opt, i) => i === optionIndex ? value : opt) } : q) }}));
  };
  const handleCorrectAnswerChange = (quizId: string, optionIndex: number) => {
    setLocalData(prev => ({ ...prev, settings: { ...prev.settings, quizzes: prev.settings.quizzes.map(q => q.id === quizId ? { ...q, correctAnswerIndex: optionIndex } : q) }}));
  };
  const handleAddOption = (quizId: string) => {
    setLocalData(prev => ({ ...prev, settings: { ...prev.settings, quizzes: prev.settings.quizzes.map(q => q.id === quizId ? { ...q, options: [...q.options, 'إجابة جديدة'] } : q) }}));
  };
  const handleDeleteOption = (quizId: string, optionIndex: number) => {
    setLocalData(prev => ({ ...prev, settings: { ...prev.settings, quizzes: prev.settings.quizzes.map(q => {
        if (q.id === quizId) {
            const newOptions = q.options.filter((_, i) => i !== optionIndex);
            // Adjust correct answer index if it's affected
            let newCorrectIndex = q.correctAnswerIndex;
            if (optionIndex < q.correctAnswerIndex) {
                newCorrectIndex = q.correctAnswerIndex - 1;
            } else if (optionIndex === q.correctAnswerIndex) {
                newCorrectIndex = 0; // Reset to first option if correct one is deleted
            }
            return { ...q, options: newOptions, correctAnswerIndex: newCorrectIndex };
        }
        return q;
    })}}));
  };

  // Puzzle Handlers
  const handlePuzzleImagesChange = async (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
        const files = Array.from(e.target.files);
        const base64Images = await Promise.all(files.map(fileToBase64));
        const newPuzzles: ColoringPage[] = base64Images.map(img => ({ id: `puzzle-${Date.now()}-${Math.random()}`, imageUrl: img }));
        
        setLocalData(prev => ({
            ...prev,
            settings: {
                ...prev.settings,
                puzzleImages: [...(prev.settings.puzzleImages || []), ...newPuzzles]
            }
        }));
    }
};
const handleDeletePuzzleImage = (pageId: string) => {
    setLocalData(prev => ({
        ...prev,
        settings: {
            ...prev.settings,
            puzzleImages: prev.settings.puzzleImages.filter(p => p.id !== pageId)
        }
    }));
};

  // Fun Fact Handlers
  const handleAddFunFact = () => {
    const newFact: FunFact = {
      id: `fact-${Date.now()}`,
      text: 'معلومة جديدة...',
    };
    setLocalData(prev => ({ ...prev, settings: { ...prev.settings, funFacts: [...(prev.settings.funFacts || []), newFact] } }));
  };
  const handleDeleteFunFact = (factId: string) => {
    if (window.confirm("هل أنت متأكد من حذف هذه المعلومة؟")) {
      setLocalData(prev => ({ ...prev, settings: { ...prev.settings, funFacts: prev.settings.funFacts.filter(f => f.id !== factId) }}));
    }
  };
  const handleFunFactChange = (factId: string, value: string) => {
    setLocalData(prev => ({ ...prev, settings: { ...prev.settings, funFacts: prev.settings.funFacts.map(f => f.id === factId ? { ...f, text: value } : f) }}));
  };


  // Sync Handlers
  const handleGistChange = (e: ChangeEvent<HTMLInputElement>) => {
      const {name, value} = e.target;
      setLocalData(prev => ({...prev, gist: {...prev.gist, [name]: value}}));
  };
  const handleExport = () => {
    const blob = new Blob([JSON.stringify(appData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'stories-app-data.json';
    a.click();
    URL.revokeObjectURL(url);
  };
  const handleImport = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const importedData = JSON.parse(event.target?.result as string);
          if (window.confirm("هل أنت متأكد من استيراد هذه البيانات؟ سيتم الكتابة فوق جميع البيانات الحالية.")) {
            setLocalData(importedData);
          }
        } catch (err) {
          alert("خطأ في قراءة الملف. تأكد من أنه ملف JSON صالح.");
        }
      };
      reader.readAsText(e.target.files[0]);
    }
  };

  const getGistIdAndFile = () => {
      try {
          const url = new URL(localData.gist.rawUrl);
          const pathParts = url.pathname.split('/');
          if(pathParts.length >= 4 && pathParts[3] === 'raw') {
              const gistId = pathParts[2];
              const filename = pathParts[5];
              return { gistId, filename };
          }
      } catch (e) { /* Invalid URL */ }
      return { gistId: null, filename: null };
  }

  const handleSyncLoad = async () => {
    if(!localData.gist.rawUrl) { alert("الرجاء إدخال رابط Gist Raw URL"); return; }
    try {
        const response = await fetch(localData.gist.rawUrl, { cache: 'no-store' });
        if(!response.ok) throw new Error(`خطأ في الشبكة: ${response.statusText}`);
        const data = await response.json();
        if (window.confirm("تم جلب البيانات من Gist. هل تريد استبدال البيانات الحالية؟")) {
          setLocalData(data);
          alert("تم تحديث البيانات بنجاح!");
        }
    } catch(e) {
        alert(`فشل تحميل البيانات: ${e.message}`);
    }
  };

  const handleSyncSave = async () => {
    if(!localData.gist.accessToken) { alert("الرجاء إدخال GitHub Personal Access Token"); return; }
    const { gistId, filename } = getGistIdAndFile();
    if(!gistId || !filename) { alert("رابط Gist Raw URL غير صالح."); return; }
    
    if(!window.confirm("هل أنت متأكد من رغبتك في حفظ البيانات الحالية إلى Gist؟ سيتم الكتابة فوق المحتوى الحالي للملف.")){
        return;
    }

    try {
        const response = await fetch(`https://api.github.com/gists/${gistId}`, {
            method: 'PATCH',
            headers: {
                'Authorization': `token ${localData.gist.accessToken}`,
                'Accept': 'application/vnd.github.v3+json',
            },
            body: JSON.stringify({
                files: {
                    [filename]: {
                        content: JSON.stringify(localData, null, 2)
                    }
                }
            })
        });
        if(!response.ok) {
            const errorData = await response.json();
            throw new Error(`خطأ في واجهة GitHub: ${errorData.message}`);
        }
        alert("تم حفظ البيانات في Gist بنجاح!");
    } catch (e) {
        alert(`فشل حفظ البيانات: ${e.message}`);
    }
  };


  const TabButton: React.FC<{ tab: Tab; icon: React.ReactNode; label: string }> = ({ tab, icon, label }) => (
    <button onClick={() => setActiveTab(tab)} className={`flex-1 flex flex-col items-center justify-center p-2 sm:py-3 text-sm sm:text-base transition-all duration-300 rounded-t-2xl ${activeTab === tab ? 'bg-white text-blue-600' : 'bg-blue-400/50 text-white hover:bg-blue-400/80'}`}>
      {icon}
      <span className="mt-1 font-bold">{label}</span>
    </button>
  );

  const renderContent = () => {
      switch (activeTab) {
        case 'general': return (
            <div className="space-y-4">
                <h3 className="text-xl font-bold text-slate-700">الإعدادات العامة</h3>
                <div>
                    <label className="block text-sm font-bold text-gray-600 mb-1">عنوان الموقع</label>
                    <input type="text" name="siteTitle" value={localData.settings.siteTitle} onChange={handleSettingsChange} className="w-full px-4 py-2 bg-white border-2 border-blue-200 rounded-full shadow-inner focus:ring-yellow-400 focus:border-yellow-400" />
                </div>
                <div>
                    <label className="block text-sm font-bold text-gray-600 mb-1">الرابط الخارجي (لموافقة الوالدين)</label>
                    <input type="text" name="externalLink" value={localData.settings.externalLink} onChange={handleSettingsChange} className="w-full px-4 py-2 bg-white border-2 border-blue-200 rounded-full shadow-inner focus:ring-yellow-400 focus:border-yellow-400" />
                </div>
                 <div>
                    <label className="block text-sm font-bold text-gray-600 mb-1">الشعار</label>
                    <div className='flex items-center space-x-4 space-x-reverse'>
                        {localData.settings.logoUrl && <img src={localData.settings.logoUrl} alt="logo" className="w-14 h-14 rounded-full object-cover border-4 border-white shadow-md" />}
                        <input type="file" accept="image/*" onChange={handleLogoChange} className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-yellow-100 file:text-yellow-700 hover:file:bg-yellow-200 cursor-pointer"/>
                    </div>
                 </div>
                 <div>
                    <label className="block text-sm font-bold text-gray-600 mb-1">صورة الخلفية</label>
                    <div className='flex items-center space-x-4 space-x-reverse'>
                        {localData.settings.backgroundImageUrl && <img src={localData.settings.backgroundImageUrl} alt="background-preview" className="w-14 h-14 rounded-lg object-cover border-4 border-white shadow-md" />}
                        <input type="file" accept="image/*" onChange={handleBackgroundImageChange} className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-yellow-100 file:text-yellow-700 hover:file:bg-yellow-200 cursor-pointer"/>
                        {localData.settings.backgroundImageUrl && <button onClick={removeBackgroundImage} className="text-red-500 hover:text-red-700 p-1"><TrashIcon className="w-5 h-5"/></button>}
                    </div>
                 </div>
                 <div>
                    <label className="block text-sm font-bold text-gray-600 mb-1">روابط يوتيوب (رابط بكل سطر)</label>
                    <textarea name="youtubeUrls" value={(localData.settings.youtubeUrls || []).join('\n')} onChange={handleSettingsChange} rows={4} className="w-full px-4 py-2 bg-white border-2 border-blue-200 rounded-2xl shadow-inner focus:ring-yellow-400 focus:border-yellow-400" />
                    <p className="text-xs text-gray-500 mt-1">
                        ستظهر هذه الفيديوهات كبطاقات في قسم "شاهد على يوتيوب". سيتم اختيار فيديو عشوائي أيضاً ليظهر قبل بدء القصة.
                    </p>
                 </div>
                 <div>
                    <label className="block text-sm font-bold text-gray-600 mb-1">موسيقى خلفية للقصص (اختياري)</label>
                    <input type="file" accept="audio/*" onChange={handleMusicChange} className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-yellow-100 file:text-yellow-700 hover:file:bg-yellow-200 cursor-pointer"/>
                    {localData.settings.backgroundMusicUrl && (
                        <div className="mt-2">
                            <p className="text-xs text-gray-500 mb-1">الموسيقى الحالية:</p>
                            <audio controls src={localData.settings.backgroundMusicUrl} className="w-full h-10"></audio>
                        </div>
                    )}
                 </div>
                 <hr/>
                 <h3 className="text-lg font-bold text-slate-700 mt-4">معلومات المطور (تظهر بأسفل الصفحة)</h3>
                  <div>
                    <label className="block text-sm font-bold text-gray-600 mb-1">اسم المطور</label>
                    <input type="text" name="developerName" value={localData.settings.developerName} onChange={handleSettingsChange} className="w-full px-4 py-2 bg-white border-2 border-blue-200 rounded-full shadow-inner focus:ring-yellow-400 focus:border-yellow-400" />
                </div>
                 <div>
                    <label className="block text-sm font-bold text-gray-600 mb-1">رابط المطور</label>
                    <input type="text" name="developerLink" value={localData.settings.developerLink} onChange={handleSettingsChange} className="w-full px-4 py-2 bg-white border-2 border-blue-200 rounded-full shadow-inner focus:ring-yellow-400 focus:border-yellow-400" />
                </div>
            </div>
        );
        case 'stories': return (
            <div className="space-y-4">
                <div className="flex justify-between items-center">
                    <h3 className="text-xl font-bold text-slate-700">إدارة القصص</h3>
                    <button onClick={handleAddStory} className="flex items-center space-x-2 space-x-reverse bg-green-500 text-white font-bold py-2 px-4 rounded-full hover:bg-green-600 transition-all shadow-md">
                        <PlusIcon className="w-5 h-5"/>
                        <span>إضافة قصة</span>
                    </button>
                </div>
                <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
                    {localData.stories.map(story => (
                        <details key={story.id} className="bg-blue-100 p-3 rounded-xl border-2 border-blue-200">
                            <summary className="font-bold text-lg cursor-pointer flex justify-between items-center">
                                <span>{story.title}</span>
                                <div>
                                    <button onClick={(e) => {e.preventDefault(); const newTitle = prompt("أدخل العنوان الجديد:", story.title); if(newTitle) handleStoryTitleChange(story.id, newTitle)}} className="p-1 text-blue-600 hover:text-blue-800"><EditIcon className="w-5 h-5"/></button>
                                    <button onClick={(e) => {e.preventDefault(); handleDeleteStory(story.id)}} className="p-1 text-red-600 hover:text-red-800 mr-2"><TrashIcon className="w-5 h-5"/></button>
                                </div>
                            </summary>
                            <div className="mt-4 space-y-4">
                                <div>
                                    <label className="block text-sm font-bold text-gray-600 mb-1">الصورة المصغرة للقصة</label>
                                    <div className="flex items-center space-x-4 space-x-reverse">
                                        {story.thumbnailUrl && <img src={story.thumbnailUrl} alt="thumbnail" className="w-16 h-16 rounded-lg object-cover border-2 border-white"/>}
                                        <input type="file" accept="image/*" onChange={(e) => handleThumbnailChange(story.id, e)} className="block w-full text-sm text-slate-500 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-yellow-100 file:text-yellow-700 hover:file:bg-yellow-200"/>
                                    </div>
                                </div>
                                <hr/>
                                <div>
                                    <label className="block text-sm font-bold text-gray-600 mb-1">صفحات القصة ({story.pages.length})</label>
                                    <input type="file" accept="image/*" multiple onChange={(e) => handleStoryImagesChange(story.id, e)} className="block w-full text-sm text-slate-500 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-yellow-100 file:text-yellow-700 hover:file:bg-yellow-200"/>
                                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2 mt-2">
                                        {story.pages.map((page, index) => (
                                            <div key={index} className="relative group">
                                                <img src={page.imageUrl} alt={`Page ${index + 1}`} className="w-full aspect-square object-cover rounded-md"/>
                                                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center">
                                                    <button onClick={() => handleDeleteStoryPage(story.id, index)} className="text-white bg-red-500 rounded-full p-1 mb-1"><TrashIcon className="w-4 h-4"/></button>
                                                    <input type="file" accept="audio/*" id={`audio-upload-${story.id}-${index}`} className="hidden" onChange={(e) => handleStoryAudioChange(story.id, index, e)} />
                                                    <label htmlFor={`audio-upload-${story.id}-${index}`} className="text-white bg-blue-500 rounded-full p-1 cursor-pointer"><MusicIcon className="w-4 h-4"/></label>
                                                    {page.audioUrl && (
                                                         <button onClick={() => handleRemoveStoryAudio(story.id, index)} className="absolute bottom-1 right-1 text-white bg-yellow-600 rounded-full p-0.5"><CloseIcon className="w-3 h-3"/></button>
                                                    )}
                                                </div>
                                                {page.audioUrl && (
                                                     <div className="absolute top-1 right-1 text-white bg-green-500 rounded-full p-1">
                                                        <MusicIcon className="w-3 h-3"/>
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </details>
                    ))}
                </div>
            </div>
        );
        case 'ads': return (
            <div className="space-y-4">
                <div className="flex justify-between items-center">
                    <h3 className="text-xl font-bold text-slate-700">إدارة الإعلانات</h3>
                    <button onClick={handleAddAd} className="flex items-center space-x-2 space-x-reverse bg-green-500 text-white font-bold py-2 px-4 rounded-full hover:bg-green-600 transition-all shadow-md">
                        <PlusIcon className="w-5 h-5"/>
                        <span>إضافة إعلان</span>
                    </button>
                </div>
                <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
                    {(localData.advertisements || []).map(ad => (
                         <details key={ad.id} className="bg-blue-100 p-3 rounded-xl border-2 border-blue-200">
                             <summary className="font-bold text-lg cursor-pointer flex justify-between items-center">
                                 <span>{ad.title || 'إعلان بلا عنوان'}</span>
                                  <button onClick={(e) => {e.preventDefault(); handleDeleteAd(ad.id)}} className="p-1 text-red-600 hover:text-red-800"><TrashIcon className="w-5 h-5"/></button>
                             </summary>
                             <div className="mt-4 space-y-3">
                                <div className="flex items-center">
                                    <input type="checkbox" id={`enabled-${ad.id}`} name="enabled" checked={ad.enabled} onChange={(e) => handleAdChange(ad.id, e)} className="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"/>
                                    <label htmlFor={`enabled-${ad.id}`} className="mr-2 text-sm font-bold text-gray-700">تفعيل الإعلان</label>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-600 mb-1">العنوان</label>
                                    <input type="text" name="title" value={ad.title} onChange={(e) => handleAdChange(ad.id, e)} className="w-full px-3 py-2 bg-white border border-blue-200 rounded-lg"/>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-600 mb-1">الوصف</label>
                                    <textarea name="description" value={ad.description} onChange={(e) => handleAdChange(ad.id, e)} rows={2} className="w-full px-3 py-2 bg-white border border-blue-200 rounded-lg"/>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-600 mb-1">الرابط (URL)</label>
                                    <input type="text" name="linkUrl" value={ad.linkUrl} onChange={(e) => handleAdChange(ad.id, e)} className="w-full px-3 py-2 bg-white border border-blue-200 rounded-lg"/>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-600 mb-1">الصورة</label>
                                    <div className="flex items-center space-x-4 space-x-reverse">
                                        {ad.imageUrl && <img src={ad.imageUrl} alt="ad-preview" className="w-16 h-16 rounded-lg object-cover border-2 border-white"/>}
                                        <input type="file" accept="image/*" onChange={(e) => handleAdImageChange(ad.id, e)} className="block w-full text-sm text-slate-500 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-yellow-100 file:text-yellow-700 hover:file:bg-yellow-200"/>
                                    </div>
                                </div>
                             </div>
                         </details>
                    ))}
                </div>
            </div>
        );
        case 'fun': return (
            <div className="space-y-4">
                <h3 className="text-xl font-bold text-slate-700">إدارة قسم تلوين ومرح</h3>
                <div>
                    <label className="block text-sm font-bold text-gray-600 mb-1">إضافة صور تلوين جديدة</label>
                    <input type="file" accept="image/*" multiple onChange={handleColoringImagesChange} className="block w-full text-sm text-slate-500 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-yellow-100 file:text-yellow-700 hover:file:bg-yellow-200"/>
                </div>
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2 max-h-[350px] overflow-y-auto pr-2">
                    {(localData.settings.coloringPages || []).map((page) => (
                        <div key={page.id} className="relative group">
                            <img src={page.imageUrl} alt="Coloring page" className="w-full aspect-square object-cover rounded-md"/>
                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <button onClick={() => handleDeleteColoringPage(page.id)} className="text-white bg-red-500 rounded-full p-2"><TrashIcon className="w-5 h-5"/></button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
        case 'quizzes': return (
            <div className="space-y-4">
                 <div className="flex justify-between items-center">
                    <h3 className="text-xl font-bold text-slate-700">إدارة الألغاز والمسابقات</h3>
                    <button onClick={handleAddQuiz} className="flex items-center space-x-2 space-x-reverse bg-green-500 text-white font-bold py-2 px-4 rounded-full hover:bg-green-600 transition-all shadow-md">
                        <PlusIcon className="w-5 h-5"/>
                        <span>إضافة سؤال</span>
                    </button>
                </div>
                <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
                    {(localData.settings.quizzes || []).map((quiz) => (
                        <div key={quiz.id} className="bg-blue-100 p-3 rounded-xl border-2 border-blue-200">
                             <div className="flex justify-between items-start mb-2">
                                <textarea
                                    value={quiz.questionText}
                                    onChange={(e) => handleQuizChange(quiz.id, e.target.value)}
                                    rows={2}
                                    className="flex-grow font-bold text-lg px-2 py-1 bg-white border-2 border-blue-200 rounded-lg shadow-inner focus:ring-yellow-400 focus:border-yellow-400"
                                />
                                <button onClick={() => handleDeleteQuiz(quiz.id)} className="p-2 text-red-600 hover:text-red-800 mr-2"><TrashIcon className="w-5 h-5"/></button>
                            </div>
                            <div className="space-y-2">
                                {quiz.options.map((option, index) => (
                                    <div key={index} className="flex items-center space-x-2 space-x-reverse">
                                        <input
                                            type="radio"
                                            name={`correct-answer-${quiz.id}`}
                                            checked={quiz.correctAnswerIndex === index}
                                            onChange={() => handleCorrectAnswerChange(quiz.id, index)}
                                            className="w-5 h-5 text-green-600 bg-gray-100 border-gray-300 focus:ring-green-500"
                                        />
                                        <input
                                            type="text"
                                            value={option}
                                            onChange={(e) => handleOptionChange(quiz.id, index, e.target.value)}
                                            className="w-full px-3 py-1 bg-white border border-blue-200 rounded-lg"
                                        />
                                        <button onClick={() => handleDeleteOption(quiz.id, index)} className="p-1 text-red-500 hover:text-red-700"><TrashIcon className="w-4 h-4"/></button>
                                    </div>
                                ))}
                                <button onClick={() => handleAddOption(quiz.id)} className="text-sm text-blue-600 hover:underline font-semibold mt-1">+ إضافة خيار</button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
         case 'drawings': return (
            <div className="space-y-4">
                <h3 className="text-xl font-bold text-slate-700">إدارة معرض الرسومات</h3>
                 <div>
                    <label className="block text-sm font-bold text-gray-600 mb-1">إضافة رسومات جديدة</label>
                    <input type="file" accept="image/*" multiple onChange={handleDrawingsChange} className="block w-full text-sm text-slate-500 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-yellow-100 file:text-yellow-700 hover:file:bg-yellow-200"/>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 max-h-[350px] overflow-y-auto pr-2">
                    {(localData.settings.drawings || []).map((drawing) => (
                        <div key={drawing.id} className="relative group bg-slate-200 p-1 rounded-lg">
                            <img src={drawing.imageUrl} alt={drawing.title} className="w-full aspect-square object-contain rounded-md bg-white"/>
                            <div className="absolute inset-1 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-1">
                                <input 
                                  type="text" 
                                  value={drawing.title} 
                                  onChange={(e) => handleDrawingTitleChange(drawing.id, e.target.value)}
                                  className="w-full text-xs text-center bg-white/80 rounded px-1 py-0.5 mb-2"
                                />
                                <button onClick={() => handleDeleteDrawing(drawing.id)} className="text-white bg-red-500 rounded-full p-2"><TrashIcon className="w-5 h-5"/></button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
        case 'puzzles': return (
            <div className="space-y-4">
                <h3 className="text-xl font-bold text-slate-700">إدارة ألعاب الألغاز (Puzzle)</h3>
                <div>
                    <label className="block text-sm font-bold text-gray-600 mb-1">إضافة صور جديدة للألغاز</label>
                    <input type="file" accept="image/*" multiple onChange={handlePuzzleImagesChange} className="block w-full text-sm text-slate-500 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-yellow-100 file:text-yellow-700 hover:file:bg-yellow-200"/>
                </div>
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2 max-h-[350px] overflow-y-auto pr-2">
                    {(localData.settings.puzzleImages || []).map((page) => (
                        <div key={page.id} className="relative group">
                            <img src={page.imageUrl} alt="Puzzle" className="w-full aspect-square object-cover rounded-md"/>
                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <button onClick={() => handleDeletePuzzleImage(page.id)} className="text-white bg-red-500 rounded-full p-2"><TrashIcon className="w-5 h-5"/></button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
        case 'facts': return (
            <div className="space-y-4">
                <div className="flex justify-between items-center">
                    <h3 className="text-xl font-bold text-slate-700">إدارة قسم "هل تعلم"</h3>
                    <button onClick={handleAddFunFact} className="flex items-center space-x-2 space-x-reverse bg-green-500 text-white font-bold py-2 px-4 rounded-full hover:bg-green-600 transition-all shadow-md">
                        <PlusIcon className="w-5 h-5"/>
                        <span>إضافة معلومة</span>
                    </button>
                </div>
                <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
                    {(localData.settings.funFacts || []).map((fact) => (
                        <div key={fact.id} className="flex items-start space-x-2 space-x-reverse bg-blue-100 p-2 rounded-lg">
                            <textarea
                                value={fact.text}
                                onChange={(e) => handleFunFactChange(fact.id, e.target.value)}
                                rows={2}
                                className="flex-grow px-3 py-2 bg-white border-2 border-blue-200 rounded-lg shadow-inner focus:ring-yellow-400 focus:border-yellow-400 resize-y"
                                placeholder="اكتب المعلومة هنا..."
                            />
                            <button onClick={() => handleDeleteFunFact(fact.id)} className="p-2 text-red-600 hover:text-red-800 bg-red-100 rounded-full">
                                <TrashIcon className="w-5 h-5"/>
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        );
        case 'sync': return (
            <div className="space-y-4">
                <h3 className="text-xl font-bold text-slate-700">المزامنة والنسخ الاحتياطي</h3>
                <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 rounded-r-lg" role="alert">
                    <p className="font-bold">ميزة متقدمة!</p>
                    <p className="text-sm">يمكنك استخدام GitHub Gist لحفظ واستعادة بيانات تطبيقك. هذا مفيد للنسخ الاحتياطي أو المزامنة بين الأجهزة.</p>
                </div>
                <div>
                    <label className="block text-sm font-bold text-gray-600 mb-1">رابط Gist Raw URL</label>
                    <input type="text" name="rawUrl" value={localData.gist.rawUrl} onChange={handleGistChange} placeholder="https://gist.githubusercontent.com/user/id/raw/file.json" className="w-full px-4 py-2 bg-white border-2 border-blue-200 rounded-full shadow-inner"/>
                </div>
                 <div>
                    <label className="block text-sm font-bold text-gray-600 mb-1">GitHub Personal Access Token</label>
                    <input type="password" name="accessToken" value={localData.gist.accessToken} onChange={handleGistChange} placeholder="أدخل التوكن الخاص بك هنا" className="w-full px-4 py-2 bg-white border-2 border-blue-200 rounded-full shadow-inner"/>
                    <p className="text-xs text-gray-500 mt-1">
                        مطلوب فقط لحفظ البيانات. يجب أن يكون لديه صلاحية 'gist'.
                        <a href="https://github.com/settings/tokens/new?scopes=gist" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline mr-1">إنشاء توكن جديد</a>
                    </p>
                </div>
                <div className="flex space-x-2 space-x-reverse">
                    <button onClick={handleSyncLoad} className="flex-1 bg-blue-500 text-white font-bold py-2 px-4 rounded-full hover:bg-blue-600">تحميل من Gist</button>
                    <button onClick={handleSyncSave} className="flex-1 bg-green-500 text-white font-bold py-2 px-4 rounded-full hover:bg-green-600">حفظ إلى Gist</button>
                </div>
                <hr/>
                <h3 className="text-lg font-bold text-slate-700 mt-4">استيراد وتصدير يدوي</h3>
                 <div className="flex space-x-2 space-x-reverse">
                    <button onClick={handleExport} className="flex-1 bg-gray-600 text-white font-bold py-2 px-4 rounded-full hover:bg-gray-700">تصدير البيانات</button>
                    <button onClick={() => importFileRef.current?.click()} className="flex-1 bg-gray-600 text-white font-bold py-2 px-4 rounded-full hover:bg-gray-700">استيراد البيانات</button>
                    <input type="file" ref={importFileRef} onChange={handleImport} accept=".json" className="hidden" />
                </div>
            </div>
        );
      }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-2 sm:p-4" onClick={onClose}>
      <div className="bg-gradient-to-br from-blue-200 to-indigo-200 rounded-3xl shadow-2xl w-full max-w-4xl flex flex-col max-h-[95vh]" onClick={(e) => e.stopPropagation()}>
        <header className="flex items-center justify-between p-3 sm:p-4 bg-white/30 rounded-t-3xl border-b-2 border-white/50">
          <div className="flex items-center space-x-3 space-x-reverse">
            <SettingsIcon className="w-8 h-8 text-slate-700" />
            <h2 className="text-2xl sm:text-3xl font-black text-slate-800">لوحة التحكم</h2>
          </div>
          <button onClick={onClose} className="p-2 text-slate-600 bg-white/50 rounded-full hover:bg-red-500 hover:text-white transition-all"><CloseIcon className="w-6 h-6" /></button>
        </header>

        <div className="flex flex-col sm:flex-row flex-1 overflow-hidden">
            <nav className="flex flex-row sm:flex-col justify-around sm:justify-start bg-blue-500/80 p-1 sm:p-2 sm:w-40 overflow-x-auto sm:overflow-x-hidden sm:overflow-y-auto">
                 <TabButton tab="general" icon={<SettingsIcon className="w-6 h-6" />} label="عام" />
                 <TabButton tab="stories" icon={<BookIcon className="w-6 h-6" />} label="القصص" />
                 <TabButton tab="fun" icon={<SparkleIcon className="w-6 h-6" />} label="تسلية" />
                 <TabButton tab="quizzes" icon={<QuestionIcon className="w-6 h-6" />} label="ألغاز" />
                 <TabButton tab="drawings" icon={<PaletteIcon className="w-6 h-6" />} label="المعرض" />
                 <TabButton tab="puzzles" icon={<PuzzleIcon className="w-6 h-6" />} label="ألعاب" />
                 <TabButton tab="facts" icon={<LightbulbIcon className="w-6 h-6" />} label="هل تعلم" />
                 <TabButton tab="ads" icon={<GiftIcon className="w-6 h-6" />} label="الإعلانات" />
                 <TabButton tab="sync" icon={<SyncIcon className="w-6 h-6" />} label="مزامنة" />
            </nav>
            <main className="flex-1 p-4 sm:p-6 bg-white overflow-y-auto">
                {renderContent()}
            </main>
        </div>
        
        <footer className="p-3 sm:p-4 bg-white/30 rounded-b-3xl border-t-2 border-white/50 flex justify-end">
            <button onClick={handleSave} className="bg-blue-600 text-white font-bold py-2 px-8 rounded-full hover:bg-blue-700 transition-all shadow-lg text-lg">حفظ التغييرات</button>
        </footer>
      </div>
    </div>
  );
};

export default SettingsModal;
