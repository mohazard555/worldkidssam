

import React, { useState, createContext, useMemo, useEffect, useRef } from 'react';
import { AppData, Story, Advertisement, AppSettings, EnglishWordFlashcard } from './types';
import StoryCard from './components/StoryCard';
import StoryViewer from './components/StoryViewer';
import SettingsModal, { Tab } from './components/SettingsModal';
import AdModal from './components/AdModal';
import useLocalStorage from './hooks/useLocalStorage';
import { SettingsIcon, ArrowLeftIcon, ArrowRightIcon, SearchIcon, BookIcon, SparkleIcon, YoutubeIcon, QuestionIcon, PaletteIcon, SpeakerOnIcon, SpeakerOffIcon, GiftIcon, PuzzleIcon, LightbulbIcon, PawIcon, AbcIcon, MusicIcon, AbcEnIcon } from './components/Icons';
import ColoringBook from './components/ColoringBook';
import YoutubeSection from './components/YoutubeSection';
import QuizSection from './components/QuizSection';
import DrawingGallery from './components/DrawingGallery';
import SectionCard from './components/SectionCard';
import PuzzleGame from './components/PuzzleGame';
import DidYouKnow from './components/DidYouKnow';
import InteractiveGames from './components/InteractiveGames';
import Flashcards from './components/Flashcards';
import CartoonBox from './components/CartoonBox';
import KidsSongsSection from './components/KidsSongsSection';
import EnglishWordsSection from './components/EnglishWordsSection';

// --- CENTRAL GIST CONFIGURATION ---
// If you provide a Gist Raw URL here, the app will fetch its data from this URL for all visitors.
// This makes the Gist the single source of truth for the app's content.
// If left empty, the app will use the local DEFAULT_APP_DATA.
const GIST_RAW_URL = 'https://gist.githubusercontent.com/mohazard555/ea2b7ed29b36c869c33d6fff01580357/raw/fc0b31bc657ca1cdefa98fb456ec0cb05efb27be/worldkidssam-data.json';

type View = 'home' | 'ad' | 'youtube' | 'story';
type MainTab = 'stories' | 'games' | 'fun' | 'flashcards';

interface IAppContext {
    appData: AppData;
    setAppData: (data: AppData | ((prevData: AppData) => AppData)) => void;
}

export const AppContext = createContext<IAppContext | null>(null);

const colors = [
    'bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-lime-500', 
    'bg-green-500', 'bg-teal-500', 'bg-cyan-500', 'bg-sky-500', 
    'bg-blue-500', 'bg-indigo-500', 'bg-purple-500', 'bg-fuchsia-500', 
    'bg-pink-500', 'bg-rose-500'
];

const DEFAULT_APP_DATA: AppData = {
    settings: {
        siteTitle: "عالم قصص الأطفال",
        logoUrl: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0iI2Y5YTgwNSI+PHBhdGggZD0iTTEyIDE3LjI3TDE4LjE4IDIxbC0xLjY0LTcuMDNMMjIgOS4yNGwtNy4xOS0uNjFMMTIgMiA5LjE5IDguNjMgMiA5LjI0bDUuNDYgNC43M0w1LjgyIDIxeiIvPjwvc3ZnPg==",
        youtubeUrls: ["https://www.youtube.com/watch?v=dQw4w9WgXcQ"],
        songUrls: [],
        externalLink: "https://www.google.com/search?q=parental+consent+form",
        backgroundImageUrl: '',
        developerName: '',
        developerLink: '',
        siteNotice: "مرحباً يا أصدقاء! لا تنسوا تفقد قسم الألعاب التفاعلية الممتعة!",
        aboutSectionText: "أهلاً بكم في عالم قصص الأطفال! هنا يمكنكم قراءة القصص الجميلة، اللعب بالألعاب المسلية، تلوين الصور الرائعة، ومشاهدة الفيديوهات الممتعة. نتمنى لكم وقتاً سعيداً!",
        coloringPages: [
            { id: 'coloring-dino', imageUrl: 'data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PSIwIDAgMTAwIDEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBzdHJva2U9ImJsYWNrIiBzdHJva2Utd2lkdGg9IjIiIGZpbGw9IndoaXRlIj48cGF0aCBkPSJNIDUwLDgwIEMgNDAsOTUgMjAsOTUgMTAsODAgUSA1LDcwIDE1LDYwIEMgMjAsNTAgMzAsNTAgMzUsNjAgQyA0MCw2NSA0NSw3MCA1MCw4MCBaIiAvPjxwYXRoIGQ9Ik0gMzUsNjAgQyAzMCw0MCA0MCwyMCA2MCwyMCBDIDgwLDIwIDkwLDQwIDg1LDYwIFEgODAsNzAgNzAsNzAgTCA1MCw4MCBaIiAvPjxjaXJjbGUgY3g9Ijc1IiBjeT0iMzUiIHI9IjMiIGZpbGw9ImJsYWNrIiAvPjxwYXRoIGQ9Ik0gNzAgNDVSBRIDc1IDUwIDgwIDQ1IiBzdHJva2U9ImJsYWNrIiBzdHJva2Utd2lkdGg9IjEuNSIgZmlsbD0ibm9uZSIvPjwvZz48L3N2Zz4=' },
            { id: 'coloring-robot', imageUrl: 'data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PSIwIDAgMTAwIDEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBzdHJva2U9ImJsYWNrIiBzdHJva2Utd2lkdGg9IjIiIGZpbGw9IndoaXRlIj48cmVjdCB4PSIzMCIgeT0iMjAiIHdpZHRoPSI0MCIgaGVpZ2h0PSIzMCIgcng9IjUiIC8+PHJlY3QgeD0iMjUiIHk9IjUwIiB3aWR0aD0iNTAiIGhlaWdodD0iNDAiIHJ4PSI1IiAvPjxjaXJjbGUgY3g9IjQwIiBjeT0iMzUiIHI9IjQiIGZpbGw9ImJsYWNrIiAvPjxjaXJjbGUgY3g9IjYwIiBjeT0iMzUiIHI9IjQiIGZpbGw9ImJsYWNrIiAvPjxyZWN0IHg9IjQwIiB5PSI0MiIgd2lkdGg9IjIwIiBoZWlnaHQ9IjMiIGZpbGw9ImJsYWNrIiAvPjxyZWN0IHg9IjE1IiB5PSI1NSIgd2lkdGg9IjEwIiBoZWlnaHQ9IjI1IiAvPjxyZWN0IHg9Ijc1IiB5PSI1NSIgd2lkdGg9IjEwIiBoZWlnaHQ9IjI1IiAvPjxyZWN0IHg9IjM1IiB5PSI5MCIgd2lkdGg9IjEwIiBoZWlnaHQ9IjEwIiAvPjxyZWN0IHg9IjU1IiB5PSI5MCIgd2lkdGg9IjEwIiBoZWlnaHQ9IjEwIiAvPjwvZz48L3N2Zz4=' },
            { id: 'coloring-butterfly', imageUrl: 'data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PSIwIDAgMTAwIDEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBzdHJva2U9ImJsYWNrIiBzdHJva2Utd2lkdGg9IjIiIGZpbGw9IndoaXRlIj48cGF0aCBkPSJNIDUwLDIwIEMgMjAsMTAgMTAsNTAgNTAsNTAgQyA5MCw1MCA4MCwxMCA1MCwyMCBaIiAvPjxwYXRoIGQ9Ik0gNTAsODAgQyAyMCw5MCAxMCw1MCA1MCw1MCBDIDkwLDUwIDgwLDkwIDUwLDgwIFoiIC8+PHBhdGggZD0iTSA0OCAyMCBMIDQ4IDgwIE0gNTIgMjAgTCA1MiA4MCIgc3Ryb2tlLXdpZHRoPSIxIi8+PGNpcmNsZSBjeD0iNTAiIGN5PSIxNSIgcj0iNCIvPjxsaW5lIHgxPSI0NSIgeTE9IjEwIiB4Mj0iNDAiIHkyPSI1Ii8+PGxpbmUgeDE9IjU1IiB5MT0iMTAiIHgyPSI2MCIgeTI9IjUiLz48L2c+PC9zdmc+' },
            { id: 'coloring-rocket', imageUrl: 'data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PSIwIDAgMTAwIDEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBzdHJva2U9ImJsYWNrIiBzdHJva2Utd2lkdGg9IjIiIGZpbGw9IndoaXRlIj48cGF0aCBkPSJNIDUwIDEwIEwgNzAgNDAgTCA3MCA4MCBRIDUwIDk1IDMwIDgwIEwgMzAgNDAgWiIgLz48cG9seWdvbiBwb2ludHM9IjUwLDEwIDQwLDI1IDYwLDI1IiBmaWxsPSJ3aGl0ZSIgc3Ryb2tlPSJibGFjayIgc3Ryb2tlLXdpZHRoPSIyIiAvPjxjaXJjbGUgY3g9IjUwIiBjeT0iNTUiIHI9IjEwIiAvPjxwb2x5Z29uIHBvaW50cz0iMzAsODAgMjAsOTUgNDAsODAiIC8+PHBvbHlnb24gcG9pbnRzPSI3MCw4MCA2MCw4MCA4MCw5NSIgLz48L2c+PC9zdmc+' },
            { id: 'coloring-cupcake', imageUrl: 'data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PSIwIDAgMTAwIDEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBzdHJva2U9ImJsYWNrIiBzdHJva2Utd2lkdGg9IjIiIGZpbGw9IndoaXRlIj48cGF0aCBkPSJNIDI1IDcwIEwgMzAgOTUgSCA3MCBMIDc1IDcwIFoiIC8+PHBhdGggZD0iTSAyMCA3MCBDIDIwIDQwLCA4MCA0MCwgODAgNzAgWiIgLz48Y2lyY2xlIGN4PSI1MCIgY3k9IjM1IiByPSI1IiBmaWxsPSJ3aGl0ZSIgc3Ryb2tlPSJibGFjayIgc3Ryb2tlLXdpZHRoPSIyIiAvPjxwYXRoIGQ9Ik0gMzUgNjAgUSA1MCA1MCA2NSA2MCIgZmlsbD0ibm9uZSIvPjxwYXRoIGQ9Ik0gMzAgNTAgUSA1MCA0MCA3MCA1MCIgZmlsbD0ibm9uZSIvPjwvZz48L3N2Zz4=' },
        ],
        quizzes: [
            { id: 'quiz-1', questionText: 'ما هو لون السماء في يوم صافٍ؟', options: ['أحمر', 'أزرق', 'أخضر', 'أصفر'], correctAnswerIndex: 1 },
            { id: 'quiz-2', questionText: 'ما هو صوت القطة؟', options: ['مواء', 'نباح', 'خوار', 'بطبطة'], correctAnswerIndex: 0 },
            { id: 'quiz-3', questionText: "أي حيوان يلقب بـ 'ملك الغابة'؟", options: ['الأسد', 'النمر', 'الفيل', 'الزرافة'], correctAnswerIndex: 0 },
            { id: 'quiz-4', questionText: 'ما هو لون الموز؟', options: ['أصفر', 'أحمر', 'أزرق', 'أخضر'], correctAnswerIndex: 0 },
            { id: 'quiz-5', questionText: 'كم عدد أرجل العنكبوت؟', options: ['6', '8', '4', '10'], correctAnswerIndex: 1 },
            { id: 'quiz-6', questionText: 'ماذا يصنع النحل؟', options: ['العسل', 'الحليب', 'الخبز', 'العصير'], correctAnswerIndex: 0 },
            { id: 'quiz-7', questionText: 'أي من هذه الحيوانات يطير؟', options: ['العصفور', 'القطة', 'الكلب', 'السمكة'], correctAnswerIndex: 0 },
            { id: 'quiz-8', questionText: 'ماذا نستخدم لنرى الأشياء البعيدة؟', options: ['التلسكوب', 'الميكروسكوب', 'النظارة', 'العدسة المكبرة'], correctAnswerIndex: 0 }
        ],
        drawings: [
            {
                id: 'drawing-1',
                imageUrl: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIj48cGF0aCBkPSJNMCA4MCBDMjAgNjAsIDQwIDYwLCA1MCA4MCBDNjAgNjAsIDgwIDYwLCAxMDAgODAgVjEwMCBIMFY4MFoiIGZpbGw9IiM4Q0M5OUMiPjwvcGF0aD48cGF0aCBkPSJNNDAgNDAgQzQwIDIwLCA2MCAyMCwgNjAgNDAgQzgwIDQwLCA4MCA2MCwgNjAgNjAgQzYwIDgwLCA0MCA4MCwgNDAgNjAgQzIwIDYwLCAyMCA0MCwgNDAgNDBaIiBmaWxsPSIjRkZDNzA1Ij48L3BhdGg+PGNpcmNsZSBjeD0iNTAiIGN5PSI1MCIgcj0iMjUiIGZpbGw9IiNGRkZBRTYiPjwvY2lyYle+PC9zdmc+',
                title: 'رسمة الشمس الساطعة'
            }
        ],
        puzzleImages: [],
        funFacts: [
            {
                id: 'fact-1',
                text: 'هل تعلم أن قلب الحوت الأزرق كبير جدًا لدرجة أن طفلًا يمكنه السباحة في شرايينه؟',
                imageUrl: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIj48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iIzc0Q0RFOCI+PC9yZWN0PjxwYXRoIGQ9Ik0xMCA1MCBDMzAgMjAsIDcwIDIwLCA5MCA1MCBDNzAgODAsIDMwIDgwLCAxMCA1MFoiIGZpbGw9IiMwMDZBQ0QiPjwvcGF0aD48Y2lyY2xlIGN4PSIyMCIgY3k9IjQ1IiByPSI1IiBmaWxsPSIjRkZGIj48L2NpcmNsZT48L3N2Zz4=',
            },
            {
                id: 'fact-2',
                text: 'النمل لا ينام أبدًا!',
                imageUrl: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIj48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iI0E2NzY1OCI+PC9yZWN0PjxyZWN0IHg9IjQwIiB5PSI0MCIgd2lkdGg9IjIwIiBoZWlnaHQ9IjMwIiByeD0iMTAiIGZpbGw9IiMzNzE5MEUiPjwvcmVjdD48cmVjdCB4PSIyMCIgeT0iNTAiIHdpZHRoPSI2MCIgaGVpZ2h0PSIyMCIgcng9IjEwIiBmaWxsPSIjNTk0MDA4Ij48L3JlY3Q+PGNpcmNsZSBjeD0iNTAiIGN5PSIzMCIgcj0iMTAiIGZpbGw9IiMzNzE5MEUiPjwvY2lyY2xlPjwvc3ZnPg==',
            },
        ],
        animalFlashcards: [
            { name: 'أسد', image: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIj48Y2lyY2xlIGN4PSI1MCIgY3k9IjUwIiByPSI0NSIgZmlsbD0iI2I4NmIwMCIvPjxjaXJjbGUgY3g9IjUwIiBjeT0iNTAiIHI9IjMyIiBmaWxsPSIjZmRhNTIyIi8+PGNpcmNsZSBjeD0iMzgiIGN5PSI0MiIgcj0iNCIgZmlsbD0iIzAwMDAwMCIvPjxjaXJjbGUgY3g9IjYyIiBjeT0iNDIiIHI9IjQiIGZpbGw9IiMwMDAwMDAiLz48cG9seWdvbiBwb2ludHM9IjQ1LDYwIDU1LDYwIDUwLDY4IiBmaWxsPSIjZmY4MDgwIi8+PHBhdGggZD0iTTM1IDc1IEMgNDAgODAgNjAgODAgNjUgNzUiIHN0cm9rZT0iIzAwMDAwMCIgc3Ryb2tlLXdpZHRoPSIyIiBmaWxsPSJub25lIi8+PC9zdmc+' },
            { name: 'فيل', image: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIj48cGF0aCBkPSJNMjAsMzUgQzUsNTUgMTAsODAgMjUsNzUgTDMwLDc1IEMyNSw5NSw0MCw5NSw0NSw3NSBMNzAsNzUgQzY1LDk1LDgwLDk1LDg1LDc1IEw5MCw3NSBDMTAwLDgwLDExMCw1NSw4MCwzNSBDNzAsMjAsMzAsMjAsMjAsMzVaIiBmaWxsPSIjYmZjNGQ2Ii8+PHBhdGggZD0iTTIwIDM1IEMxMCw1NSA1LDU1IDE1IDM1IEMyNSwyMCwzMCwyMCwyMCwzNVoiIGZpbGw9IiNjY2NkZDIiLz48cGF0aCBkPSJNODAgMzUgQzkwLDU1IDk1LDU1IDg1IDM1IEM3NSwyMCw3MCwyMCw4MCwzNVoiIGZpbGw9IiNjY2NkZDIiLz48cGF0aCBkPSJNNDUsNTUgQzUwLDgwIDcwLDc1IDU1LDU1IiBmaWxsPSIjYWJhZWIzIi8+PGNpcmNsZSBjeD0iNDAiIGN5PSI0NSIgcj0iNSIgZmlsbD0iIzAwMDAwMCIvPjxjaXJjbGUgY3g9IjYwIiBjeT0iNDUiIHI9IjUiIGZpbGw9IiMwMDAwMDAiLz48L3N2Zz4=' },
            { name: 'قطة', image: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIj48Y2lyY2xlIGN4PSI1MCIgY3k9IjYwIiByPSI0MCIgZmlsbD0iIzk5OTk5OSIvPjxwYXRoIGQ9Ik0xNSw0MCBMMzUsMjAgTDMwLDQ1IFoiIGZpbGw9IiM5OTk5OTkiLz48cGF0aCBkPSJNODUsNDAgTDY1LDIwIEw3MCw0NSBaIiBmaWxsPSIjOTk5OTk5Ii8+PGNpcmNsZSBjeD0iMzgiIGN5PSI1NSIgcj0iNSIgZmlsbD0iIzAwMDAwMCIvPjxjaXJjbGUgY3g9IjYyIiBjeT0iNTUiIHI9IjUiIGZpbGw9IiMwMDAwMDAiLz48cG9seWdvbiBwb2ludHM9IjQ3LDcwIDUzLDcwIDUwLDc1IiBmaWxsPSIjZmY4MDgwIi8+PHBhdGggZD0iTTM1IDgwIEwgMjAgODUgTSA2NSA4MCBMIDgwIDg1IiBzdHJva2U9IiMwMDAwMDAiIHN0cm9rZS13aWR0aD0iMiIgZmlsbD0ibm9uZSIvPjwvc3ZnPg==' },
            { name: 'كلب', image: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIj48Y2lyY2xlIGN4PSI1MCIgY3k9IjYwIiByPSI0MCIgZmlsbD0iI2MzOWE2OSIvPjxwYXRoIGQ9Ik0xNSw1NSBDMTAsODAgMjUsODAgMzAsNTUgWiIgZmlsbD0iIzkxNmY0YyIvPjxwYXRoIGQ9Ik04NSw1NSBDOTAsODAgNzUsODAgNzAsNTUgWiIgZmlsbD0iIzkxNmY0YyIvPjxjaXJjbGUgY3g9IjM4IiBjeT0iNTUiIHI9IjUiIGZpbGw9IiMwMDAwMDAiLz48Y2lyY2xlIGN4PSI2MiIgY3k9IjU1IiByPSI1IiBmaWxsPSIjMDAwMDAwIi8+PHBhdGggZD0iTTM1IDc1IEMgNTAgODUgNjUgNzUgWiIgc3Ryb2tlPSIjMDAwMDAwIiBzdHJva2Utd2lkdGg9IjIiIGZpbGw9Im5vbmUiLz48cG9seWdvbiBwb2ludHM9IjQ3LDcwIDUzLDcwIDUwLDc1IiBmaWxsPSIjMDAwMDAwIi8+PC9zdmc+' },
            { name: 'زرافة', image: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIj48cGF0aCBkPSJNNTAsMTAwIEw1MCw0MCBDNTAsMjAgNzAsMjAgNzAsNDAgTDcwLDYwIEM4NSw2MCA5NSw4NSA4MCw5NSBaIiBmaWxsPSIjZjRiYzM2Ii8+PHJlY3QgeD0iNDUiIHk9IjUiIHdpZHRoPSIxMCIgaGVpZ2h0PSIzNSIgZmlsbD0iI2Y0YmMzNiIvPjxjaXJjbGUgY3g9IjUwIiBjeT0iMjUiIHI9IjIwIiBmaWxsPSIjZjRjYzQ2Ii8+PGNpcmNsZSBjeD0iNDUiIGN5PSIxMCIgcj0iNCIgZmlsbD0iIzkxNmY0YyIvPjxjaXJjbGUgY3g9IjU1IiBjeT0iMTAiIHI9IjQiIGZpbGw9IiM5MTZmNGMiLz48Y2lyY2xlIGN4PSI0MiIgY3k9IjI1IiByPSIzIiBmaWxsPSIjMDAwMDAwIi8+PGNpcmNsZSBjeD0iNTgiIGN5PSIyNSIgcj0iMyIgZmlsbD0iIzAwMDAwMCIvPjwvc3ZnPg==' },
            { name: 'قرد', image: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIj48cGF0aCBkPSJNMjUgMzAgQzEwIDUwIDE1IDc1IDMwIDgwIEw3MCA4MCBDODUgNzUgOTAgNTAgNzUgMzAgQzY1IDIwIDM1IDIwIDI1IDMwIFoiIGZpbGw9IiM5NjY5NWUiLz48cGF0aCBkPSJNMzUgNDAgQzMwIDYwIDcwIDYwIDY1IDQwIEM2MCAzNSA0MCAzNSAzNSA0MCBaIiBmaWxsPSIjZWRjOWE1Ii8+PHBhdGggZD0iTTI1IDMwIEMxNSA0NSAxNSA1NSAyNSAzMCBaIiBmaWxsPSIjZWRjOWE1Ii8+PHBhdGggZD0iTTc1IDMwIEM4NSA0NSA4NSA1NSA3NSAzMCBaIiBmaWxsPSIjZWRjOWE1Ii8+PGNpcmNsZSBjeD0iNDUiIGN5PSI1MCIgcj0iNCIgZmlsbD0iIzAwMDAwMCIvPjxjaXJjbGUgY3g9IjU1IiBjeT0iNTAiIHI9IjQiIGZpbGw9IiMwMDAwMDAiLz48cGF0aCBkPSJNNDAgNzAgQzUwIDc1IDYwIDcwIiBzdHJva2U9IiMwMDAwMDAiIHN0cm9rZS13aWR0aD0iMiIgZmlsbD0ibm9uZSIvPjwvc3ZnPg==' },
            { name: 'باندا', image: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIj48Y2lyY2xlIGN4PSI1MCIgY3k9IjUwIiByPSI0MCIgZmlsbD0iI2ZmZmZmZiIvPjxwYXRoIGQ9Ik0yNSAzMCBDMTUgNDUgMTUgNTUgMjUgMzAgWiIgZmlsbD0iIzAwMDAwMCIvPjxwYXRoIGQ9Ik03NSAzMCBDODUgNDUgODUgNTUgNzUgMzAgWiIgZmlsbD0iIzAwMDAwMCIvPjxjaXJjbGUgY3g9IjM1IiBjeT0iNDUiIHI9IjgiIGZpbGw9IiMwMDAwMDAiLz48Y2lyY2xlIGN4PSI2NSIgY3k9IjQ1IiByPSI4IiBmaWxsPSIjMDAwMDAwIi8+PGNpcmNsZSBjeD0iMzUiIGN5PSI0NSIgcj0iMyIgZmlsbD0iI2ZmZmZmZiIvPjxjaXJjbGUgY3g9IjY1IiBjeT0iNDUiIHI9IjMiIGZpbGw9IiNmZmZmZmYiLz48cG9seWdvbiBwb2ludHM9IjQ3LDYwIDUzLDYwIDUwLDY1IiBmaWxsPSIjMDAwMDAwIi8+PHBhdGggZD0iTTQwIDcwIEM1MCA3NSA2MCA3MCIgc3Ryb2tlPSIjMDAwMDAwIiBzdHJva2Utd2lkdGg9IjIiIGZpbGw9Im5vbmUiLz48L3N2Zz4=' },
            { name: 'حمار وحشي', image: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIj48cGF0aCBkPSJNMjUgMjAgTDgwIDI1IEw4NSw4MCBMMjAgNzUgWiIgZmlsbD0iI2ZmZiIvPjxwYXRoIGQ9Ik0zMCAyMSBMMzUgMjIgTDM4IDc2IEwzMiA3NSBaIE00NSAyMiBMNTAgMjMgTDUzIDc3IEw0NyA3NiBaIE02MCAyMyBMNjUgMjQgTDY4IDc4IEw2MiA3NyBaIiBmaWxsPSIjMDAwIi8+PGNpcmNsZSBjeD0iMjUiIGN5PSIyMCIgcj0iMTUiIGZpbGw9IiNmZmYiLz48cGF0aCBkPSJNMjAgMjUgQzE4IDM1IDE1IDM1IDE1IDIwIFoiIGZpbGw9IiMwMDAiLz48Y2lyY2xlIGN4PSIyMiIgY3k9IjE4IiByPSIyIiBmaWxsPSIjMDAwIi8+PC9zdmc+' },
            { name: 'سمكة', image: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIj48cGF0aCBkPSJNMjAgNTUgQzQwIDgwIDgwIDcwIDgwIDUwIEM4MCAzMCA0MCAyMCAyMCA0NSBaIiBmaWxsPSIjNjdjNmUyIi8+PHBhdGggZD0iTTgwIDUwIEw5NSA3MCBMOTUgMzAgWiIgZmlsbD0iIzQzYTJlMyIvPjxjaXJjbGUgY3g9IjMwIiBjeT0iNTAiIHI9IjQiIGZpbGw9IiNmZmYiLz48Y2lyY2xlIGN4PSIzMiIgY3k9IjUwIiByPSIyIiBmaWxsPSIjMDAwIi8+PC9zdmc+' },
            { name: 'طائر', image: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIj48Y2lyY2xlIGN4PSI2MCIgY3k9IjUwIiByPSIyNSIgZmlsbD0iIzU1Y2FlMiIvPjxwYXRoIGQ9Ik02MCA1MCBDNDAgNzAgMjAgNjAgMzAgNDAgQzM1IDMwIDQwIDMwIDYwIDUwIFoiIGZpbGw9IiM1NWNhZTIiLz48cGF0aCBkPSJNNjAgNTAgQzg1IDY1IDg1IDM1IDYwIDUwIFoiIGZpbGw9IiNmOWE2MmYiLz48Y2lyY2xlIGN4PSI3MCIgY3k9IjQ1IiByPSI0IiBmaWxsPSIjMDAwIi8+PC9zdmc+' },
            { name: 'دجاجة', image: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIj48cGF0aCBkPSJNMzAsODAgQzEwLDYwIDI1LDMwIDUwLDQwIEM3NSwzMCA5MCw2MCA3MCw4MCBaIiBmaWxsPSIjZmZmMmQyIi8+PHBhdGggZD0iTTUwLDQwIEM0MCwyNSA2MCwyNSA1MCw0MFoiIGZpbGw9IiNlZjQ0NDQiLz48Y2lyY2xlIGN4PSI2MCIgY3k9IjUwIiByPSI0IiBmaWxsPSIjMDAwIi8+PHBvbHlnb24gcG9pbnRzPSI3MCw1NSw3NSw1MCw4MCw1NSIgZmlsbD0iI2Y5NzMxNiIvPjwvc3ZnPg==' },
            { name: 'بقرة', image: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIj48cGF0aCBkPSJNMjAsODAgQzMwLDkwIDcwLDkwIDgwLDgwIEw4NSw1MCBDODYsMzAgNjAsMjAgNTAsMjAgQzQwLDIwIDE0LDMwIDE1LDUwIFoiIGZpbGw9IiNmZmYiLz48cGF0aCBkPSJNMjUsNzUgQzM1LDgwIDM1LDcwIDI1LDcwIFogTTQ1LDgwIEM1NSw4NSA1NSw3NSA0NSw3NSBaIE02NSw3NSBDNzUsODAgNzUsNzAgNjUsNzAgWiIgZmlsbD0iI2ZmMmQ3ZCIvPjxwYXRoIGQ9Ik0zMCw0MCBDMjAsNTUgNDAsNTUgNDUsNDAgWiIgZmlsbD0iIzAwMCIvPjxwYXRoIGQ9Ik03MCwzNSBDNzUsNTUgNTAsNTUgNTUsMzUgWiIgZmlsbD0iIzAwMCIvPjxwYXRoIGQ9Ik00MCwzMCBDMzUsMjAgNDUsMjAgNDAsMzAgWiBNNjAsMzAgQzU1LDIwIDY1LDIwIDYwLDMwIFoiIGZpbGw9IiM5NjZmNGUiLz48Y2lyY2xlIGN4PSIzNSIgY3k9IjM1IiByPSI0IiBmaWxsPSIjMDAwIi8+PGNpcmNsZSBjeD0iNjUiIGN5PSIzNSIgcj0iNCIgZmlsbD0iIzAwMCIvPjwvc3ZnPg==' },
        ],
        colorFlashcards: [
            { name: 'أحمر', hex: '#ef4444' },
            { name: 'أزرق', hex: '#3b82f6' },
            { name: 'أخضر', hex: '#22c55e' },
            { name: 'أصفر', hex: '#eab308' },
            { name: 'برتقالي', hex: '#f97316' },
            { name: 'بنفسجي', hex: '#8b5cf6' },
            { name: 'وردي', hex: '#ec4899' },
            { name: 'بني', hex: '#78350f' },
            { name: 'أسود', hex: '#1e293b' },
            { name: 'أبيض', hex: '#f8fafc' },
            { name: 'رمادي', hex: '#64748b' },
            { name: 'سماوي', hex: '#06b6d4' },
        ],
        numberFlashcards: [
            { number: 1, word: 'واحد', representation: '🍎' },
            { number: 2, word: 'اثنان', representation: '🚗' },
            { number: 3, word: 'ثلاثة', representation: '⭐' },
            { number: 4, word: 'أربعة', representation: '🎈' },
            { number: 5, word: 'خمسة', representation: '🐟' },
            { number: 6, word: 'ستة', representation: '🏠' },
            { number: 7, word: 'سبعة', representation: '⚽' },
            { number: 8, word: 'ثمانية', representation: '🌸' },
            { number: 9, word: 'تسعة', representation: '🔑' },
            { number: 10, word: 'عشرة', representation: '🍓' },
        ],
        shapeFlashcards: [
            { name: 'دائرة', image: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIj48Y2lyY2xlIGN4PSI1MCIgY3k9IjUwIiByPSI0NSIgZmlsbD0id2hpdGUiLz48L3N2Zz4=', colorClass: 'bg-red-500' },
            { name: 'مربع', image: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIj48cmVjdCB4PSI1IiB5PSI1IiB3aWR0aD0iOTAiIGhlaWdodD0iOTAiIHJ4PSIxMCIgZmlsbD0id2hpdGUiLz48L3N2Zz4=', colorClass: 'bg-blue-500' },
            { name: 'مثلث', image: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIj48cG9seWdvbiBwb2ludHM9IjUwLDcgOTUsOTMgNSw5MyIgZmlsbD0id2hpdGUiLz48L3N2Zz4=', colorClass: 'bg-green-500' },
            { name: 'نجمة', image: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIj48cG9seWdvbiBwb2ludHM9IjUwLDExIDYxLDM5IDkyLDM5IDY4LDYwIDc5LDg5IDUwLDcyIDIxLDg5IDMyLDYwIDgsMzkgMzksMzkgNTEsMTEiIGZpbGw9IndoaXRlIi8+PC9zdmc+', colorClass: 'bg-yellow-500' },
            { name: 'مستطيل', image: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIj48cmVjdCB4PSIxMCIgeT0iMjUiIHdpZHRoPSI4MCIgaGVpZ2h0PSI1MCIgcng9IjEwIiBmaWxsPSJ3aGl0ZSIvPjwvc3ZnPg==', colorClass: 'bg-orange-500' },
            { name: 'قلب', image: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIj48cGF0aCBkPSJNIDUwIDIwIEMgMjUgMCAxMCAzNSwgNTAgOTUgQyA5MCAzNSwgNzUgMCwgNTAgMjAgWiIgZmlsbD0id2hpdGUiLz48L3N2Zz4=', colorClass: 'bg-pink-500' },
            { name: 'خماسي', image: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIj48cG9seWdvbiBwb2ludHM9IjUwLDcgOTUsMzggNzgsOTUgMjIsOTUgNSwzOCIgZmlsbD0id2hpdGUiLz48L3N2Zz4=', colorClass: 'bg-purple-500' },
            { name: 'سداسي', image: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIj48cG9seWdvbiBwb2ludHM9IjI1LDggNzUsOCAxMDAsNTAgNzUsOTIgMjUsOTIgMCw1MCIgZmlsbD0id2hpdGUiLz48L3N2Zz4=', colorClass: 'bg-teal-500' },
        ],
        funnyFlashcards: [
            { name: 'وحش', image: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0iIzQzY2I1MSI+PHBhdGggZD0iTTE2IDRjMS4xMSAwIDIuODMuNzEgNC4xMSAySDExYy0uMzIgMC0uNjIuMDgtLjg5LjIxQzEwLjYxIDQuODggMTIgMy41IDEyIDJIMTZtMy41IDljLjgyIDAgMS41LjY3IDEuNSAxLjVzLS42NyAxLjUtMS41IDEuNS0xLjUtLjY3LTEuNS0xLjNS42Ny0xLjUgMS41LTEuNXptLTggMGMuODIgMCAxLjUuNjcgMS41IDEuNVMxMi4zMyAxNSAxMS41IDE1cy0xLjUtLjY3LTEuNS0xLjUuNjctMS41IDEuNS0xLjV6bTQuNSA0YzMuMzEgMCA2LTIuNjkgNi02cy0yLjY5LTYtNi02aC00Yy0uNjYgMC0xLjI4LjE3LTEuODIuNDVDNC42NyA3LjQ4IDIgOS42NCAyLjAyIDE0YzAgMS4yLjM3IDIuMjggMSAzLjAyVjIwgaDE2di0yLjk4Yy42MS0uNzMuOTgtMS44IDEtMi45MiAwLTMuMzEtMi42OS02LTYtNmgtek0xMiAyMmMtMS4xMSAwLTItLjg5LTItMnM4LTkgOC05YzAgLjE3LS4wMi4zNC0uMDMuNTFDMTcuNjEgOC4xOCAxNi4wOCA3IDE0IDdoLTRjLTEuNTcgMC0yLjg4Ljg2LTMuNTQgMi4xM0M2LjE3IDkuNDYgNiA5LjcyIDYgMTBjMCAyLjQyIDEuNzIgNC40NCA0IDUuNEM5LjM3IDE1LjY2IDguNzEgMTYgOCAxNmMtMS4xMSAwLTItLjg5LTItMnMtMi4yOS0uNTgtMy0uODJWMjBoMWMuMzYgMCAuNjkuMTkuODguNDlsMS40Mi0xLjQxQzYuOTggMTcuMDYgNi41IDE2LjU2IDYgMTZ6Ii8+PC9zdmc+' },
            { name: 'شبح', image: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0iI2FkYjRkMCI+PHBhdGggZD0iTTggNGMtMy4zMSAwLTYgMi42OS02IDZ2OGgxLjc1Yy43MSAwIDEuMzEtLjM4IDEuNjMtMS4wMUwxMiAxMy40MWwxLjYyIDQuNThjLjMyLjYzLjkyIDEuMDEgMS42MyAxLjAxSDE4VjEwYzAtMy4zMS0yLjY5LTYtNi02SDh6bTIuNSA1Yy44MyAwIDEuNS42NyAxLjUgMS41UzExLjMzIDEyIDEwLjUgMTJzLTEuNS0uNjctMS41LTEuNS42Ny0xLjUgMS41LTEuNXptMyAwdjNjMCAuNTUuNDUgMSAxIDFoM2MuNTUgMCAxLS40NSAxLTFWOS41YzAtLjgyLS42Ny0xLjUtMS41LTEuNXMtMS41LjY3LTEuNSAxLjV6Ii8+PC9zdmc+' },
            { name: 'روبوت', image: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0iIzM3NDFsNSI+PHBhdGggZD0iTTE5IDZoLTJWNGgtMmMtMS4xMSAwLTItLjg5LTItMlM5Ljg5IDAgOSAwaC02YzAgMi4yMSAxLjc5IDQgNCA0djJoLTJjLTEuNjYgMC0zIDEuMzQtMyAzbC0xIDVjLS4xNy44My4xOCAxLjY3LjgxIDIuMThWMTljMCAxLjExLjg5IDIgMiAyaDEwYzEuMTEgMCAyLS44OSAyLTJ2LTEuODJjLjYyLS41MS45OC0xLjM1LjgyLTIuMThsLTEtNVY5YzAtMS42Ni0xLjM0LTMtMy0zek03LjUgMTNjLS44MyAwLTEuNS0uNjctMS41LTEuNVM2LjY3IDEwIDcuNSAxMHMxLjUuNjcgMS41IDEuNVM4LjMzIDEzIDcuNSAxM3ptOSA2Yy0uODMgMC0xLjUtLjY3LTEuNS0xLjVzLjY3LTEuNSAxLjUtMS41IDEuNS42NyAxLjUgMS41LS42NyAxLjUtMS41IDEuNXptMC0xMGMtLjgzIDAtMS41LS42Ny0xLjUtMS41UzE1LjY3IDEwIDE2LjUgMTBzMS41LjY7IDEuNSAxLjVzLS42NyAxLjUtMS41IDEuNXoiLz48L3N2Zz4=' },
        ],
        arabicAlphabetData: [
            { letter: "أ", word: "أرنب", image: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIj48cGF0aCBkPSJNNTAsOTEgQzYwLDc1LDcwLDc1LDc1LDkwIEw4MCw5MCBDOTAsNzAsNzAsNTAsNjAsNjAgTDUwLDc1IEw0MCw2MCBDMzAsNTAsMTAsNzAsMjAsOTAgTDI1LDkwIEMzMCw3NSw0MCw3NSw1MCw5MVoiIGZpbGw9IiNmZmYiLz48cGF0aCBkPSJNNjAsNjAgQzgwLDQwLDgwLDIwLDYwLDIwIEM0MCwyMCw0MCw0MCw2MCw2MFoiIGZpbGw9IiNmZmYiLz48cGF0aCBkPSJNNDAsNjAgQzIwLDQwLDIwLDIwLDQwLDIwIEM2MCwyMCw2MCw0MCw0MCw2MFoiIGZpbGw9IiNmZmYiLz48Y2lyY2xlIGN4PSI0NSIgY3k9IjUwIiByPSI1IiBmaWxsPSJibGFjayIvPjxjaXJjbGUgY3g9IjU1IiBjeT0iNTAiIHI9IjUiIGZpbGw9ImJsYWNrIi8+PC9zdmc+', color: 'bg-red-500' },
            { letter: "ب", word: "بطة", image: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIj48cGF0aCBkPSJNMjAsNjAgQzMwLDQwLDcwLDQwLDgwLDYwIEM5NSw3NSw3MCwxMDAsNTAuNSw5OS41IEMzMCwxMDAsNSw3NSwyMCw2MFoiIGZpbGw9IiNGRkQwMDAiLz48Y2lyY2xlIGN4PSI2NSIgY3k9IjU1IiByPSIxNSIgZmlsbD0iI0ZGRDAwMCIvPjxjaXJjbGUgY3g9IjcwIiBjeT0iNTAiIHI9IjMiIGZpbGw9ImJsYWNrIi8+PHBhdGggZD0iTTc1LDQ1IEM4NSw0NSw4NSw1NSw3NSw1NSIgZmlsbD0iI0ZGNzgwMCIvPjwvc3ZnPg==', color: 'bg-orange-500' },
            { letter: "ت", word: "تفاحة", image: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIj48cGF0aCBkPSJNNTAsMjAgQzgwLDIwLDk1LDQwLDk1LDYwIEM5NSw5MCw3NSwxMDAsNTAsMTAwIEMyNSwxMDAsNSw5MCw1LDYwIEM1LDQwLDIwLDIwLDUwLDIwIFoiIGZpbGw9IiNGRjAwMDAiLz48cGF0aCBkPSJNNTAsMjAgQzYwLDEwLDcwLDE1LDcwLDI1IiBzdHJva2U9IiM4QjQ1MTMiIHN0cm9rZS13aWR0aD0iNCIgZmlsbD0ibm9uZSIvPjxwYXRoIGQ9Ik03MCwyNSBMNjAsNDAgQzgwLDQwLDgwLDI1LDcwLDI1IiBmaWxsPSIjMDBGRjAwIi8+PC9zdmc+', color: 'bg-yellow-500' },
            { letter: "ث", word: "ثعلب", image: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIj48cGF0aCBkPSJNMjAsODAgTDMwLDQwIEw3MCw0MCBMODAsODAgWiIgZmlsbD0iI2Y5NzMxNiIvPjxwYXRoIGQ9Ik0yNSw0MCBMMzAsMjAgTDcwLDIwIEw3NSw0MCBaIiBmaWxsPSIjZjliMzU2Ii8+PHBhdGggZD0iTTgwLDgwIEw5NSw2MCBMOTUsODUgWiIgZmlsbD0iI2Y5NzMxNiIvPjxwYXRoIGQ9Ik05NSw4NSBMOTAsMTAwIEw4MCw4MCBaIiBmaWxsPSIjZjliMzU2Ii8+PGNpcmNsZSBjeD0iNDUiIGN5PSIzMCIgcj0iNCIgZmlsbD0iIzAwMCIvPjxjaXJjbGUgY3g9IjU1IiBjeT0iMzAiIHI9IjQiIGZpbGw9IiMwMDAiLz48L3N2Zz4=', color: 'bg-lime-500' },
            { letter: "ج", word: "جمل", image: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIj48cGF0aCBkPSJNNTAsOTAgTDYwLDcwIEw3NSw4MCBDOTAsNzAgOTAsNTUgNzUsNTUgTDcwLDQwIEM2MCwyNSA0MCwyNSA0MCw0MCBMNDAsNzAgTDMwLDcwIEwyMCw5MCBaIiBmaWxsPSIjZTljN2E1Ii8+PHBhdGggZD0iTTcwLDQwIEM3NSwyNSA4NSwyNSA4NSw0MCBDODUsNTAgNzUsNTAgNzAsNDAgWiIgZmlsbD0iI2Q0YmY5YSIvPjxwYXRoIGQ9Ik02MCw3MCBDNTUsNTUgNjUsNTUgNzUsNjAgTDc1LDgwWiIgZmlsbD0iI2Q0YmY5YSIvPjxjaXJjbGUgY3g9Ijc4IiBjeT0iMzUiIHI9IjIiIGZpbGw9IiMwMDAiLz48L3N2Zz4=', color: 'bg-green-500' },
            { letter: "ح", word: "حصان", image: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIj48cGF0aCBkPSJNMzAsOTAgTDM1LDcwIEw3MCw3NSBMODAsNTUgQzg1LDM1IDcwLDIwIDYwLDI1IEw1NSw0MCBMNDAsMzUgQzMwLDI1IDMwLDQwIDQwLDQ1IEw0NSw3MCBaIiBmaWxsPSIjODk1NzM5Ii8+PHBhdGggZD0iTTYwLDI1IEw1NSwyMCBMNTUsNSBMNjUsNSBMNjAsMjVaIiBmaWxsPSIjM2QyYzE5Ii8+PGNpcmNsZSBjeD0iNTAiIGN5PSIzOCIgcj0iMyIgZmlsbD0iIzAwMCIvPjwvc3ZnPg==', color: 'bg-emerald-500' },
            { letter: "خ", word: "خروف", image: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIj48Y2lyY2xlIGN4PSI1MCIgY3k9IjYwIiByPSIzMCIgZmlsbD0iI2YxZjVmOSIvPjxwYXRoIGQ9Ik0zMCwzMCBDMTUsNDUgMTUsNTUgMzAsMzAgWiIgZmlsbD0iI2YxZjVmOSIvPjxwYXRoIGQ9Ik03MCwzMCBDODUsNDUgODUsNTUgNzAsMzAgWiIgZmlsbD0iI2YxZjVmOSIvPjxyZWN0IHg9IjQwIiB5PSI4NSIgd2lkdGg9IjUiIGhlaWdodD0iMTAiIGZpbGw9IiM2YjcwODAiLz48cmVjdCB4PSI1NSIgeT0iODUiIHdpZHRoPSI1IiBoZWlnaHQ9IjEwIiBmaWxsPSIjNmI3MDgwIi8+PHBhdGggZD0iTTM1LDQ1IEMyNSw2NSA3NSw2NSA2NSw0NSBDNjAsMzUgNDAsMzUgMzUsNDUgWiIgZmlsbD0iI2M1YjRhYyIvPjxjaXJjbGUgY3g9IjQ1IiBjeT0iNTAiIHI9IjQiIGZpbGw9IiMwMDAiLz48Y2lyY2xlIGN4PSI1NSIgY3k9IjUwIiByPSI0IiBmaWxsPSIjMDAwIi8+PC9zdmc+', color: 'bg-teal-500' },
            { letter: "د", word: "ديك", image: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIj48cGF0aCBkPSJNNTAsOTAgTDYwLDYwIEM4MCw3MCA5NSw1NSw4MCw0MCBDNjUsMjAgNDUsMjAgNDAsNDAgTDUwLDYwIEwzMCw1MCBDMjAsNjAgMjAsODAgNDAsODAgWiIgZmlsbD0iI2E1MmEyYSIvPjxwYXRoIGQ9Ik00MCw0MCBDMzAsMjUgNTAsMTUgNDAsNDBaIiBmaWxsPSIjZWM0ODk5Ii8+PHBhdGggZD0iTTM1LDM1IEMzMCw0NSw0NSw0NSwzNSwzNVoiIHN0cm9rZT0iI2Y5NzMxNiIgc3Ryb2tlLXdpZHRoPSI0IiBmaWxsPSJub25lIi8+PGNpcmNsZSBjeD0iNTAiIGN5PSIzNSIgcj0iMyIgZmlsbD0iIzAwMCIvPjwvc3ZnPg==', color: 'bg-cyan-500' },
            { letter: "ذ", word: "ذرة", image: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIj48cGF0aCBkPSJNNDAsOTUgQzEwLDgwIDI1LDQwIDQ1LDEwIEw1NSwxMCBDNzUsNDAgOTAsODAgNjAsOTUgWiIgZmlsbD0iI2Y1YzMwMSIvPjxwYXRoIGQ9Ik00MCw5NSBDMTAsODAgMjAsNTUgNDAsOTUgWiIgZmlsbD0iIzZiOTQzOCIvPjxwYXRoIGQ9Ik02MCw5NSBDOTAsODAgODAsNTUgNjAsOTUgWiIgZmlsbD0iIzZiOTQzOCIvPjwvc3ZnPg==', color: 'bg-sky-500' },
            { letter: "ر", word: "رمان", image: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIj48Y2lyY2xlIGN4PSI1MCIgY3k9IjYwIiByPSIzNSIgZmlsbD0iI2RjMjYyNiIvPjxwYXRoIGQ9Ik00NSwyNSBMNTUsMjUgTDYwLDE1IEw0MCwxNSBaIiBmaWxsPSIjYTUzMjMyIi8+PC9zdmc+', color: 'bg-blue-500' },
            { letter: "ز", word: "زرافة", image: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIj48cGF0aCBkPSJNNTAsMTAwIEw1MCw0MCBDNTAsMjAgNzAsMjAgNzAsNDAgTDcwLDYwIEM4NSw2MCA5NSw4NSA4MCw5NSBaIiBmaWxsPSIjZjRiYzM2Ii8+PHJlY3QgeD0iNDUiIHk9IjUiIHdpZHRoPSIxMCIgaGVpZ2h0PSIzNSIgZmlsbD0iI2Y0YmMzNiIvPjxjaXJjbGUgY3g9IjUwIiBjeT0iMjUiIHI9IjIwIiBmaWxsPSIjZjRjYzQ2Ii8+PGNpcmNsZSBjeD0iNDUiIGN5PSIxMCIgcj0iNCIgZmlsbD0iIzkxNmY0YyIvPjxjaXJjbGUgY3g9IjU1IiBjeT0iMTAiIHI9IjQiIGZpbGw9IiM5MTZmNGMiLz48Y2lyY2xlIGN4PSI0MiIgY3k9IjI1IiByPSIzIiBmaWxsPSIjMDAwMDAwIi8+PGNpcmNsZSBjeD0iNTgiIGN5PSIyNSIgcj0iMyIgZmlsbD0iIzAwMDAwMCIvPjwvc3ZnPg==', color: 'bg-indigo-500' },
            { letter: "س", word: "سمكة", image: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIj48cGF0aCBkPSJNMjAgNTUgQzQwIDgwIDgwIDcwIDgwIDUwIEM4MCAzMCA0MCAyMCAyMCA0NSBaIiBmaWxsPSIjNjdjNmUyIi8+PHBhdGggZD0iTTgwIDUwIEw5NSA3MCBMOTUgMzAgWiIgZmlsbD0iIzQzYTJlMyIvPjxjaXJjbGUgY3g9IjMwIiBjeT0iNTAiIHI9IjQiIGZpbGw9IiNmZmYiLz48Y2lyY2xlIGN4PSIzMiIgY3k9IjUwIiByPSIyIiBmaWxsPSIjMDAwIi8+PC9zdmc+', color: 'bg-violet-500' },
            { letter: "ش", word: "شمس", image: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIj48Y2lyY2xlIGN4PSI1MCIgY3k9IjUwIiByPSIzMCIgZmlsbD0iI2Y1YzUwMSIvPjxwYXRoIGQ9Ik01MCA1IEw1NSAxNSBMNDUgMTUgWiBNNSA1MCBMIDE1IDU1IEwgMTUgNDUgWiBNOTUgNTAgTDg1IDU1IEw4NSA0NSBaIE01MCA5NSBMNTUgODUgTDQ1IDg1IFoiIGZpbGw9IiNmNWM1MDEiLz48cGF0aCBkPSJNMjAgMjAgTDI1IDMwIEwxNSAzMCBaIE04MCAyMCBMNzUgMzAgTDg1IDMwIFogTTIwIDgwIEwyNSw3MCBMMTUsNzAgWiBNODAgODAgTDc1LDcwIEw4NSw3MCBaIiBmaWxsPSIjZjVjNTAxIiB0cmFuc2Zvcm09InJvdGF0ZSg0NSw1MCw1MCkiLz48L3N2Zz4=', color: 'bg-purple-500' },
            { letter: "ص", word: "صاروخ", image: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIj48cGF0aCBkPSJNNTAsMTAgTDcwLDQwIEw3MCw4MCBRIDUwIDk1IDMwIDgwIEwgMzAgNDAgWiIgZmlsbD0iI2M2YzZjNiIvPjxwb2x5Z29uIHBvaW50cz0iNTAsMTAgNDAsMjUgNjAsMjUiIGZpbGw9IiNlZjQ0NDQiLz48Y2lyY2xlIGN4PSI1MCIgY3k9IjU1IiByPSIxMCIgZmlsbD0iIzNiODJmNiIvPjxwb2x5Z29uIHBvaW50cz0iMzAsODAgMjAsOTUgNDAsODAiIGZpbGw9IiNmOTczMTYiLz48cG9seWdvbiBwb2ludHM9IjcwLDgwIDYwLDgwIDgwLDk1IiBmaWxsPSIjZjk3MzE2Ii8+PC9zdmc+', color: 'bg-fuchsia-500' },
            { letter: "ض", word: "ضفدع", image: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIj48cGF0aCBkPSJNMjAsNzAgQzQwLDkwIDYwLDkwIDgwLDcwIEM4NSw1NSw2NSw0NSA1MCw0NSBDMzUsNDUgMTUsNTUsMjAsNzBaIiBmaWxsPSIjMjJjNTVlIi8+PGNpcmNsZSBjeD0iNDAiIGN5PSI1NSIgcj0iOCIgZmlsbD0iI2ZmZiIvPjxjaXJjbGUgY3g9IjYwIiBjeT0iNTUiIHI9IjgiIGZpbGw9IiNmZmYiLz48Y2lyY2xlIGN4PSI0MiIgY3k9IjU1IiByPSI0IiBmaWxsPSIjMDAwIi8+PGNpcmNsZSBjeD0iNTgiIGN5PSI1NSIgcj0iNCIgZmlsbD0iIzAwMCIvPjxwYXRoIGQ9Ik00MCA3NSBDNTAgODAgNjAgNzUiIHN0cm9rZT0iIzAwMCIgc3Ryb2tlLXdpZHRoPSIyIiBmaWxsPSJub25lIi8+PC9zdmc+', color: 'bg-pink-500' },
            { letter: "ط", word: "طائرة", image: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIj48cGF0aCBkPSJNNTAsMjAgTDYwLDQwIEw5NSw0NSBMNjAsNTAgTDUwLDcwIEw0MCw1TAgTDUwLDQ1IEw0MCw0MCBaIiBmaWxsPSIjZjFmNWY5Ii8+PHBhdGggZD0iTTQ1LDcwIEw1NSw3MCBMNTUsODUgTDQ1LDg1IFoiIGZpbGw9IiMzYjgyZjYiLz48L3N2Zz4=', color: 'bg-rose-500' },
            { letter: "ظ", word: "ظرف", image: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIj48cmVjdCB4PSIxMCIgeT0iMzAiIHdpZHRoPSI4MCIgaGVpZ2h0PSI0MCIgcng9IjUiIGZpbGw9IiNmZWU4YjUiLz48cGF0aCBkPSJNMTEsMzIgTDkwLDMyIEw1MCw1NSBaIiBmaWxsPSIjZmFkNzRhIi8+PC9zdmc+', color: 'bg-red-400' },
            { letter: "ع", word: "عصفور", image: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIj48Y2lyY2xlIGN4PSI2MCIgY3k9IjUwIiByPSIyNSIgZmlsbD0iIzU1Y2FlMiIvPjxwYXRoIGQ9Ik02MCA1MCBDNDAgNzAgMjAgNjAgMzAgNDAgQzM1IDMwIDQwIDMwIDYwIDUwIFoiIGZpbGw9IiM1NWNhZTIiLz48cGF0aCBkPSJNNjAgNTAgQzg1IDY1IDg1IDM1IDYwIDUwIFoiIGZpbGw9IiNmOWE2MmYiLz48Y2lyY2xlIGN4PSI3MCIgY3k9IjQ1IiByPSI0IiBmaWxsPSIjMDAwIi8+PC9zdmc+', color: 'bg-orange-400' },
            { letter: "غ", word: "غيمة", image: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIj48cGF0aCBkPSJNMjAsNzAgQzAsNzAgNSw0NSA0MCw0NSBDNDUsMzAgNzAsMzAgNzUsNDUgQzEwMCw0NSAxMDAsNzAsODAsNzAgWiIgZmlsbD0iI2Y4ZmFmYyIvPjwvc3ZnPg==', color: 'bg-yellow-400' },
            { letter: "ف", word: "فيل", image: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIj48cGF0aCBkPSJNMjAsMzUgQzUsNTUgMTAsODAgMjUsNzUgTDMwLDc1IEMyNSw5NSw0MCw5NSw0NSw3NSBMNzAsNzUgQzY1LDk1LDgwLDk1LDg1LDc1IEw5MCw3NSBDMTAwLDgwLDExMCw1NSw4MCwzNSBDNzAsMjAsMzAsMjAsMjAsMzVaIiBmaWxsPSIjYmZjNGQ2Ii8+PHBhdGggZD0iTTIwIDM1IEMxMCw1NSA1LDU1IDE1IDM1IEMyNSwyMCwzMCwyMCwyMCwzNVoiIGZpbGw9IiNjY2NkZDIiLz48cGF0aCBkPSJNODAgMzUgQzkwLDU1IDk1LDU1IDg1IDM1IEM3NSwyMCw3MCwyMCw4MCwzNVoiIGZpbGw9IiNjY2NkZDIiLz48cGF0aCBkPSJNNDUsNTUgQzUwLDgwIDcwLDc1IDU1LDU1IiBmaWxsPSIjYWJhZWIzIi8+PGNpcmNsZSBjeD0iNDAiIGN5PSI0NSIgcj0iNSIgZmlsbD0iIzAwMDAwMCIvPjxjaXJjbGUgY3g9IjYwIiBjeT0iNDUiIHI9IjUiIGZpbGw9IiMwMDAwMDAiLz48L3N2Zz4=', color: 'bg-lime-400' },
            { letter: "ق", word: "قمر", image: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIj48cGF0aCBkPSJNNTAsNSBDODAsMjAgODAsODAgNTAsOTUgQzYwLDgwIDYwLDIwIDUwLDUgWiIgZmlsbD0iI2YxZTVhZSIvPjwvc3ZnPg==', color: 'bg-green-400' },
            { letter: "ك", word: "كلب", image: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIj48Y2lyY2xlIGN4PSI1MCIgY3k9IjYwIiByPSI0MCIgZmlsbD0iI2MzOWE2OSIvPjxwYXRoIGQ9Ik0xNSw1NSBDMTAsODAgMjUsODAgMzAsNTUgWiIgZmlsbD0iIzkxNmY0YyIvPjxwYXRoIGQ9Ik04NSw1NSBDOTAsODAgNzUsODAgNzAsNTUgWiIgZmlsbD0iIzkxNmY0YyIvPjxjaXJjbGUgY3g9IjM4IiBjeT0iNTUiIHI9IjUiIGZpbGw9IiMwMDAwMDAiLz48Y2lyY2xlIGN4PSI2MiIgY3k9IjU1IiByPSI1IiBmaWxsPSIjMDAwMDAwIi8+PHBhdGggZD0iTTM1IDc1IEMgNTAgODUgNjUgNzUgWiIgc3Ryb2tlPSIjMDAwMDAwIiBzdHJva2Utd2lkdGg9IjIiIGZpbGw9Im5vbmUiLz48cG9seWdvbiBwb2ludHM9IjQ3LDcwIDUzLDcwIDUwLDc1IiBmaWxsPSIjMDAwMDAwIi8+PC9zdmc+', color: 'bg-emerald-400' },
            { letter: "ل", word: "ليمون", image: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIj48cGF0aCBkPSJNMjAsNTAgQzIwLDgwIDgwLDgwIDgwLDUwIEM4MCwyMCAyMCwyMCAyMCw1MCBaIE04MCw1MCBDOTUsNDAgOTUsNjAgODAsNTBaIiBmaWxsPSIjZmFkNzRhIi8+PC9zdmc+', color: 'bg-teal-400' },
            { letter: "م", word: "موز", image: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIj48cGF0aCBkPSJNMzAsMzAgQzgwLDIwIDgwLDQwIDUwLDcwIEMyMCw1MCw0MCwxMCwzMCwzMFoiIGZpbGw9IiNmZWU4YjUiLz48L3N2Zz4=', color: 'bg-cyan-400' },
            { letter: "ن", word: "نحلة", image: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIj48cGF0aCBkPSJNNTAsNjUgQzMwLDg1IDMwLDQ1IDUwLDY1WiIgZmlsbD0iIzAwMCIvPjxwYXRoIGQ9Ik01MCw2NSBDNzAsODUgNzAsNDUgNTAsNjVaIiBmaWxsPSIjZmFkNzRhIi8+PHBhdGggZD0iTTUwLDY1IEM1NSwzNSw4MCw0MCA3MCwzMCBDNjUsMjAgNTAsMjUgNTAsNDUgWiIgZmlsbD0iI2Y4ZmFmYyIgc3Ryb2tlPSIjMDAwIiBzdHJva2Utd2lkdGg9IjIiLz48Y2lyY2xlIGN4PSI0OCIgY3k9IjU1IiByPSIyIiBmaWxsPSIjMDAwIi8+PC9zdmc+', color: 'bg-sky-400' },
            { letter: "هـ", word: "هلال", image: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIj48cGF0aCBkPSJNNTAsNSBBNDUsNDUgMCAwIDAsIDUwLDk1IEEzNSwzNSAwIDAgMSw1MCw1IFoiIGZpbGw9IiNmYWQ3NGEiLz48L3N2Zz4=', color: 'bg-blue-400' },
            { letter: "و", word: "وردة", image: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIj48cGF0aCBkPSJNNTAsNzAgQzQwLDgwIDYwLDgwIDUwLDcwIFogTTUwLDcwIEMzMCw2MCA3MCw2MCA1MCw3MFoiIGZpbGw9IiMyMmM1NWUiLz48cmVjdCB4PSI0OCIgeT0iNzAiIHdpZHRoPSI0IiBoZWlnaHQ9IjI1IiBmaWxsPSIjMjJjNTVlIi8+PGNpcmNsZSBjeD0iNTAiIGN5PSI1MCIgcj0iMjUiIGZpbGw9IiNlZjQ0NDQiLz48Y2lyY2xlIGN4PSI1MCIgY3k9IjUwIiByPSIxNSIgZmlsbD0iI2Y4NzA3MC статье=', color: 'bg-indigo-400' },
            { letter: "ي", word: "يد", image: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIj48cGF0aCBkPSJNMzAsODAgQzMwLDYwIDYwLDYwIDYwLDgwIEw3MCw4MCBDODAsNTUgNzAsNDAgNjAsNDAgTDYwLDMwIEM2MCwxNSA1MCwxNSA1MCwzMCBMNTAsNDAgQzQwLDQwIDMwLDU1IDMwLDgwIFoiIGZpbGw9IiNmY2QzNDYiLz48L3N2Zz4=', color: 'bg-violet-400' }
        ],
        englishAlphabetData: [
            { letter: "A", word: "Apple", image: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIj48cGF0aCBkPSJNNTAsMjAgQzgwLDIwLDk1LDQwLDk1LDYwIEM5NSw5MCw3NSwxMDAsNTAsMTAwIEMyNSwxMDAsNSw5MCw1LDYwIEM1LDQwLDIwLDIwLDUwLDIwIFoiIGZpbGw9IiNGRjAwMDAiLz48cGF0aCBkPSJNNTAsMjAgQzYwLDEwLDcwLDE1LDcwLDI1IiBzdHJva2U9IiM4QjQ1MTMiIHN0cm9rZS13aWR0aD0iNCIgZmlsbD0ibm9uZSIvPjxwYXRoIGQ9Ik03MCwyNSBMNjAsNDAgQzgwLDQwLDgwLDI1LDcwLDI1IiBmaWxsPSIjMDBGRjAwIi8+PC9zdmc+', color: 'bg-red-500' },
            { letter: "B", word: "Ball", image: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIj48Y2lyY2xlIGN4PSI1MCIgY3k9IjUwIiByPSI0NSIgZmlsbD0id2hpdGUiIHN0cm9rZT0iYmxhY2siIHN0cm9rZS13aWR0aD0iMiIvPjxwYXRoIGQ9Ik0xMC4yLDM1IEMzNSwxMC4yLDY1LDEwLjIsODkuOCwzNSIgc3Ryb2tlPSJyZWQiIHN0cm9rZS13aWR0aD0iOCIgZmlsbD0ibm9uZSIvPjxwYXRoIGQ9Ik0xMC4yLDY1IEMzNSw4OS44LDY1LDg5LjgsODkuOCw2NSIgc3Ryb2tlPSJibHVlIiBzdHJva2Utd2lkdGg9IjgiIGZpbGw9Im5vbmUiLz48L3N2Zz4=', color: 'bg-blue-500' },
            { letter: "C", word: "Cat", image: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIj48Y2lyY2xlIGN4PSI1MCIgY3k9IjYwIiByPSI0MCIgZmlsbD0iIzk5OTk5OSIvPjxwYXRoIGQ9Ik0xNSw0MCBMMzUsMjAgTDMwLDQ1IFoiIGZpbGw9IiM5OTk5OTkiLz48cGF0aCBkPSJNODUsNDAgTDY1LDIwIEw3MCw0NSBaIiBmaWxsPSIjOTk5OTk5Ii8+PGNpcmNsZSBjeD0iMzgiIGN5PSI1NSIgcj0iNSIgZmlsbD0iIzAwMDAwMCIvPjxjaXJjbGUgY3g9IjYyIiBjeT0iNTUiIHI9IjUiIGZpbGw9IiMwMDAwMDAiLz48cG9seWdvbiBwb2ludHM9IjQ3LDcwIDUzLDcwIDUwLDc1IiBmaWxsPSIjZmY4MDgwIi8+PHBhdGggZD0iTTM1IDgwIEwgMjAgODUgTSA2NSA4MCBMIDgwIDg1IiBzdHJva2U9IiMwMDAwMDAiIHN0cm9rZS13aWR0aD0iMiIgZmlsbD0ibm9uZSIvPjwvc3ZnPg==', color: 'bg-gray-400' },
            { letter: "D", word: "Dog", image: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIj48Y2lyY2xlIGN4PSI1MCIgY3k9IjYwIiByPSI0MCIgZmlsbD0iI2MzOWE2OSIvPjxwYXRoIGQ9Ik0xNSw1NSBDMTAsODAgMjUsODAgMzAsNTUgWiIgZmlsbD0iIzkxNmY0YyIvPjxwYXRoIGQ9Ik04NSw1NSBDOTAsODAgNzUsODAgNzAsNTUgWiIgZmlsbD0iIzkxNmY0YyIvPjxjaXJjbGUgY3g9IjM4IiBjeT0iNTUiIHI9IjUiIGZpbGw9IiMwMDAwMDAiLz48Y2lyY2xlIGN4PSI2MiIgY3k9IjU1IiByPSI1IiBmaWxsPSIjMDAwMDAwIi8+PHBhdGggZD0iTTM1IDc1IEMgNTAgODUgNjUgNzUgWiIgc3Ryb2tlPSIjMDAwMDAwIiBzdHJva2Utd2lkdGg9IjIiIGZpbGw9Im5vbmUiLz48cG9seWdvbiBwb2ludHM9IjQ3LDcwIDUzLDcwIDUwLDc1IiBmaWxsPSIjMDAwMDAwIi8+PC9zdmc+', color: 'bg-amber-700' },
            { letter: "E", word: "Elephant", image: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIj48cGF0aCBkPSJNMjAsMzUgQzUsNTUgMTAsODAgMjUsNzUgTDMwLDc1IEMyNSw5NSw0MCw5NSw0NSw3NSBMNzAsNzUgQzY1LDk1LDgwLDk1LDg1LDc1IEw5MCw3NSBDMTAwLDgwLDExMCw1NSw4MCwzNSBDNzAsMjAsMzAsMjAsMjAsMzVaIiBmaWxsPSIjYmZjNGQ2Ii8+PHBhdGggZD0iTTIwIDM1IEMxMCw1NSA1LDU1IDE1IDM1IEMyNSwyMCwzMCwyMCwyMCwzNVoiIGZpbGw9IiNjY2NkZDIiLz48cGF0aCBkPSJNODAgMzUgQzkwLDU1IDk1LDU1IDg1IDM1IEM3NSwyMCw3MCwyMCw4MCwzNVoiIGZpbGw9IiNjY2NkZDIiLz48cGF0aCBkPSJNNDUsNTUgQzUwLDgwIDcwLDc1IDU1LDU1IiBmaWxsPSIjYWJhZWIzIi8+PGNpcmNsZSBjeD0iNDAiIGN5PSI0NSIgcj0iNSIgZmlsbD0iIzAwMDAwMCIvPjxjaXJjbGUgY3g9IjYwIiBjeT0iNDUiIHI9IjUiIGZpbGw9IiMwMDAwMDAiLz48L3N2Zz4=', color: 'bg-slate-500' },
            { letter: "F", word: "Fish", image: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIj48cGF0aCBkPSJNMjAgNTUgQzQwIDgwIDgwIDcwIDgwIDUwIEM4MCAzMCA0MCAyMCAyMCA0NSBaIiBmaWxsPSIjNjdjNmUyIi8+PHBhdGggZD0iTTgwIDUwIEw5NSA3MCBMOTUgMzAgWiIgZmlsbD0iIzQzYTJlMyIvPjxjaXJjbGUgY3g9IjMwIiBjeT0iNTAiIHI9IjQiIGZpbGw9IiNmZmYiLz48Y2lyY2xlIGN4PSIzMiIgY3k9IjUwIiByPSIyIiBmaWxsPSIjMDAwIi8+PC9zdmc+', color: 'bg-cyan-500' },
            { letter: "G", word: "Giraffe", image: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIj48cGF0aCBkPSJNNTAsMTAwIEw1MCw0MCBDNTAsMjAgNzAsMjAgNzAsNDAgTDcwLDYwIEM4NSw2MCA5NSw4NSA4MCw5NSBaIiBmaWxsPSIjZjRiYzM2Ii8+PHJlY3QgeD0iNDUiIHk9IjUiIHdpZHRoPSIxMCIgaGVpZ2h0PSIzNSIgZmlsbD0iI2Y0YmMzNiIvPjxjaXJjbGUgY3g9IjUwIiBjeT0iMjUiIHI9IjIwIiBmaWxsPSIjZjRjYzQ2Ii8+PGNpcmNsZSBjeD0iNDUiIGN5PSIxMCIgcj0iNCIgZmlsbD0iIzkxNmY0YyIvPjxjaXJjbGUgY3g9IjU1IiBjeT0iMTAiIHI9IjQiIGZpbGw9IiM5MTZmNGMiLz48Y2lyY2xlIGN4PSI0MiIgY3k9IjI1IiByPSIzIiBmaWxsPSIjMDAwMDAwIi8+PGNpcmNsZSBjeD0iNTgiIGN5PSIyNSIgcj0iMyIgZmlsbD0iIzAwMDAwMCIvPjwvc3ZnPg==', color: 'bg-yellow-400' },
            { letter: "H", word: "House", image: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIj48cG9seWdvbiBwb2ludHM9IjUsNDUgOTUsNDUgNTAsNSBaIiBmaWxsPSIjZDYyODJkIi8+PHJlY3QgeD0iMTUiIHk9IjQ1IiB3aWR0aD0iNzAiIGhlaWdodD0iNTAiIHJ4PSI1IiBmaWxsPSIjZmVlOGI1Ii8+PHJlY3QgeD0iNDIiIHk9IjcwIiB3aWR0aD0iMTYiIGhlaWdodD0iMjUiIGZpbGw9IiM4OTU3MzkiLz48L3N2Zz4=', color: 'bg-orange-500' },
            { letter: "I", word: "Ice Cream", image: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIj48cG9seWdvbiBwb2ludHM9IjMwLDQwIDcwLDQwIDUwLDk1IiBmaWxsPSIjZjRjYzQ2Ii8+PGNpcmNsZSBjeD0iNTAiIGN5PSIzMCIgcj0iMjUiIGZpbGw9IiNlYzQ4OTkiLz48L3N2Zz4=', color: 'bg-pink-400' },
            { letter: "J", word: "Juice", image: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIj48cGF0aCBkPSJNMjAsOTUgTDI1LDMwIEw3NSwzMCBMODAsOTUgWiIgZmlsbD0iI2Y4ZmFmYyIgc3Ryb2tlPSIjYmZjNGQ2IiBzdHJva2Utd2lkdGg9IjIiLz48cGF0aCBkPSJNMjUsMzAgQzI1LDIwIDc1LDIwIDc1LDMwIiBzdHJva2U9IiNiZmM0ZDYiIHN0cm9rZS13aWR0aD0iMiIgZmlsbD0ibm9uZSIvPjxyZWN0IHg9IjI1IiB5PSI0MCIgd2lkdGg9IjUwIiBoZWlnaHQ9IjUwIiBmaWxsPSIjZjliMzU2Ii8+PHJlY3QgeD0iNzAiIHk9IjQ1IiB3aWR0aD0iNSIgaGVpZ2h0PSIyMCIgZmlsbD0iIzM0ZDMyMyIvPjwvc3ZnPg==', color: 'bg-yellow-300' },
            { letter: "K", word: "Key", image: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIj48Y2lyY2xlIGN4PSI0MCIgY3k9IjQwIiByPSIyNSIgZmlsbD0iI2Y1YzUwMSIvPjxyZWN0IHg9IjQwIiB5PSIzOCIgd2lkdGg9IjUwIiBoZWlnaHQ9IjQiIGZpbGw9IiNmNWM1MDEiLz48cmVjdCB4PSI4MCIgeT0iNTAiIHdpZHRoPSIxMCIgaGVpZ2h0PSI0IiBmaWxsPSIjZjVjNTAxIi8+PC9zdmc+', color: 'bg-yellow-500' },
            { letter: "L", word: "Lion", image: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIj48Y2lyY2xlIGN4PSI1MCIgY3k9IjUwIiByPSI0NSIgZmlsbD0iI2I4NmIwMCIvPjxjaXJjbGUgY3g9IjUwIiBjeT0iNTAiIHI9IjMyIiBmaWxsPSIjZmRhNTIyIi8+PGNpcmNsZSBjeD0iMzgiIGN5PSI0MiIgcj0iNCIgZmlsbD0iIzAwMDAwMCIvPjxjaXJjbGUgY3g9IjYyIiBjeT0iNDIiIHI9IjQiIGZpbGw9IiMwMDAwMDAiLz48cG9seWdvbiBwb2ludHM9IjQ1LDYwIDU1LDYwIDUwLDY4IiBmaWxsPSIjZmY4MDgwIi8+PHBhdGggZD0iTTM1IDc1IEMgNDAgODAgNjAgODAgNjUgNzUiIHN0cm9rZT0iIzAwMDAwMCIgc3Ryb2tlLXdpZHRoPSIyIiBmaWxsPSJub25lIi8+PC9zdmc+', color: 'bg-orange-400' },
            { letter: "M", word: "Moon", image: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIj48cGF0aCBkPSJNNTAsNSBDODAsMjAgODAsODAgNTAsOTUgQzYwLDgwIDYwLDIwIDUwLDUgWiIgZmlsbD0iI2YxZTVhZSIvPjwvc3ZnPg==', color: 'bg-slate-400' },
            { letter: "N", word: "Nest", image: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIj48cGF0aCBkPSJNMjAsODAgQzQwLDEwMCA2MCwxMDAgODAsODAgQzgwLDYwIDIwLDYwIDIwLDgwIFoiIGZpbGw9IiM4OTU3MzkiLz48Y2lyY2xlIGN4PSI0MCIgY3k9IjcwIiByPSI4IiBmaWxsPSIjYWRkOGU2Ii8+PGNpcmNsZSBjeD0iNjAiIGN5PSI3MCIgcj0iOCIgZmlsbD0iI2FkZDhlNiIvPjxjaXJjbGUgY3g9IjUwIiBjeT0iNjIiIHI9IjgiIGZpbGw9IiNhZGQ4ZTYiLz48L3N2Zz4=', color: 'bg-yellow-800' },
            { letter: "O", word: "Orange", image: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIj48Y2lyY2xlIGN4PSI1MCIgY3k9IjYwIiByPSIzNSIgZmlsbD0iI2Y5NzMxNiIvPjxwYXRoIGQ9Ik01NSwyNSBDNjAsMjAgNjUsMjAgNjAsMjUgWiIgZmlsbD0iIzIyYzU1ZSIvPjwvc3ZnPg==', color: 'bg-orange-500' },
            { letter: "P", word: "Panda", image: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIj48Y2lyY2xlIGN4PSI1MCIgY3k9IjUwIiByPSI0MCIgZmlsbD0iI2ZmZmZmZiIvPjxwYXRoIGQ9Ik0yNSAzMCBDMTUgNDUgMTUgNTUgMjUgMzAgWiIgZmlsbD0iIzAwMDAwMCIvPjxwYXRoIGQ9Ik03NSAzMCBDODUgNDUgODUgNTUgNzUgMzAgWiIgZmlsbD0iIzAwMDAwMCIvPjxjaXJjbGUgY3g9IjM1IiBjeT0iNDUiIHI9IjgiIGZpbGw9IiMwMDAwMDAiLz48Y2lyY2xlIGN4PSI2NSIgY3k9IjQ1IiByPSI4IiBmaWxsPSIjMDAwMDAwIi8+PGNpcmNsZSBjeD0iMzUiIGN5PSI0NSIgcj0iMyIgZmlsbD0iI2ZmZmZmZiIvPjxjaXJjbGUgY3g9IjY1IiBjeT0iNDUiIHI9IjMiIGZpbGw9IiNmZmZmZmYiLz48cG9seWdvbiBwb2ludHM9IjQ3LDYwIDUzLDYwIDUwLDY1IiBmaWxsPSIjMDAwMDAwIi8+PHBhdGggZD0iTTQwIDcwIEM1MCA3NSA2MCA3MCIgc3Ryb2tlPSIjMDAwMDAwIiBzdHJva2Utd2lkdGg9IjIiIGZpbGw9Im5vbmUiLz48L3N2Zz4=', color: 'bg-black' },
            { letter: "Q", word: "Queen", image: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIj48cGF0aCBkPSJNMjAsODAgTDgwLDgwIEw4MCw0MCBMODUsMjAgTDY1LDQwIEw1MCwyMCBMMzUsNDAgTDE1LDIwIEwyMCw0MCBaIiBmaWxsPSIjZjVjNTAxIi8+PGNpcmNsZSBjeD0iMjUiIGN5PSI1MCIgcj0iNCIgZmlsbD0iI2VjNDg5OSIvPjxjaXJjbGUgY3g9IjUwIiBjeT0iNDUiIHI9IjQiIGZpbGw9IiMyMmM1NWUiLz48Y2lyY2xlIGN4PSI3NSIgY3k9IjUwIiByPSI0IiBmaWxsPSIjZWM0ODk5Ii8+PC9zdmc+', color: 'bg-yellow-500' },
            { letter: "R", word: "Rabbit", image: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIj48cGF0aCBkPSJNNTAsOTEgQzYwLDc1LDcwLDc1LDc1LDkwIEw4MCw5MCBDOTAsNzAsNzAsNTAsNjAsNjAgTDUwLDc1IEw0MCw2MCBDMzAsNTAsMTAsNzAsMjAsOTAgTDI1LDkwIEMzMCw3NSw0MCw3NSw1MCw5MVoiIGZpbGw9IiNmZmYiLz48cGF0aCBkPSJNNjAsNjAgQzgwLDQwLDgwLDIwLDYwLDIwIEM0MCwyMCw0MCw0MCw2MCw2MFoiIGZpbGw9IiNmZmYiLz48cGF0aCBkPSJNNDAsNjAgQzIwLDQwLDIwLDIwLDQwLDIwIEM2MCwyMCw2MCw0MCw0MCw2MFoiIGZpbGw9IiNmZmYiLz48Y2lyY2xlIGN4PSI0NSIgY3k9IjUwIiByPSI1IiBmaWxsPSJibGFjayIvPjxjaXJjbGUgY3g9IjU1IiBjeT0iNTAiIHI9IjUiIGZpbGw9ImJsYWNrIi8+PC9zdmc+', color: 'bg-gray-200' },
            { letter: "S", word: "Sun", image: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIj48Y2lyY2xlIGN4PSI1MCIgY3k9IjUwIiByPSIzMCIgZmlsbD0iI2Y1YzUwMSIvPjxwYXRoIGQ9Ik01MCA1IEw1NSAxNSBMNDUgMTUgWiBNNSA1MCBMIDE1IDU1IEwgMTUgNDUgWiBNOTUgNTAgTDg1IDU1IEw4NSA0NSBaIE01MCA5NSBMNTUgODUgTDQ1IDg1IFoiIGZpbGw9IiNmNWM1MDEiLz48cGF0aCBkPSJNMjAgMjAgTDI1IDMwIEwxNSAzMCBaIE04MCAyMCBMNzUgMzAgTDg1IDMwIFogTTIwIDgwIEwyNSw3MCBMMTUsNzAgWiBNODAgODAgTDc1LDcwIEw4NSw3MCBaIiBmaWxsPSIjZjVjNTAxIiB0cmFuc2Zvcm09InJvdGF0ZSg0NSw1MCw1MCkiLz48L3N2Zz4=', color: 'bg-yellow-400' },
            { letter: "T", word: "Tree", image: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIj48cmVjdCB4PSI0MiIgeT0iNzAiIHdpZHRoPSIxNiIgaGVpZ2h0PSIzMCIgcng9IjMiIGZpbGw9IiM4OTU3MzkiLz48Y2lyY2xlIGN4PSI1MCIgY3k9IjUwIiByPSIzMCIgZmlsbD0iIzIyYzU1ZSIvPjxjaXJjbGUgY3g9IjMwIiBjeT0iNjAiIHI9IjIwIiBmaWxsPSIjMjJjNTVlIi8+PGNpcmNsZSBjeD0iNzAiIGN5PSI2MCIgcj0iMjAiIGZpbGw9IiMyMmM1NWUiLz48L3N2Zz4=', color: 'bg-green-600' },
            { letter: "U", word: "Umbrella", image: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIj48cGF0aCBkPSJNMTAgNTUgQzMwIDMwIDcwIDMwIDkwIDU1IEwxMCA1NSBaIiBmaWxsPSIjNGFhNWYxIi8+PHBhdGggZD0iTTUwIDU1IEw1MCA5MCBDNTAgOTUgNjAgOTUgNjAgOTAgWiIgc3Ryb2tlPSIjY2M5ODgwIiBzdHJva2Utd2lkdGg9IjUiIGZpbGw9Im5vbmUiLz48L3N2Zz4=', color: 'bg-blue-400' },
            { letter: "V", word: "Volcano", image: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIj48cG9seWdvbiBwb2ludHM9IjIwLDkwIDgwLDkwIDY1LDQwIDM1LDQwIiBmaWxsPSIjODk1NzM5Ii8+PHBhdGggZD0iTTQ1LDQwIEMzNSwyNSA2NSwyNSA1NSw0MFoiIGZpbGw9IiNlZjQ0NDQiLz48L3N2Zz4=', color: 'bg-red-700' },
            { letter: "W", word: "Whale", image: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIj48cGF0aCBkPSJNMTAgNTUgQzMwIDgwIDcwIDgwIDkwIDU1IEMxMTAsMzAgNDAsMjAgMTAgNTVaIiBmaWxsPSIjNjc4ZTg3Ii8+PHBhdGggZD0iTTMwIDU1IEw3MCA1NSBMNzAsODUgQzYwLDg1IDQwLDg1IDMwLDg1IFoiIGZpbGw9IiNmZmYiLz48Y2lyY2xlIGN4PSIyNSIgY3k9IjUwIiByPSI0IiBmaWxsPSIjMDAwIi8+PC9zdmc+', color: 'bg-blue-600' },
            { letter: "X", word: "Xylophone", image: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIj48cGF0aCBkPSJNMjAsMjAgTDgwLDUwIEw4MCw2MCBMMjAsMzAgWiIgZmlsbD0iI2VjNDg5OSIvPjxwYXRoIGQ9Ik0yMCw0MCBMNjAsNjAgTDYwLDcwIEwyMCw1MCBaIiBmaWxsPSIjZjVjNTAxIi8+PHBhdGggZD0iTTIwLDYwIEw0MCw3MCBMNDAsODAgTDIwLDcwIFoiIGZpbGw9IiMyMmM1NWUiLz48cGF0aCBkPSJNMjAsODAgTDI1LDg1IEwyNSw5NSBMMjAsODUgWiIgZmlsbD0iIzNiODJmNiIvPjwvc3ZnPg==', color: 'bg-purple-500' },
            { letter: "Y", word: "Yarn", image: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIj48Y2lyY2xlIGN4PSI1MCIgY3k9IjUwIiByPSIzNSIgZmlsbD0iI2VjNDg5OSIvPjxwYXRoIGQ9Ik0zMCA0MCBDNzAgNjAgMzAgODAgNzAgMjAiIHN0cm9rZT0iI2Y4NzA3MCIgc3Ryb2tlLXdpZHRoPSI0IiBmaWxsPSJub25lIi8+PC9zdmc+', color: 'bg-pink-500' },
            { letter: "Z", word: "Zebra", image: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIj48cGF0aCBkPSJNMjUgMjAgTDgwIDI1IEw4NSw4MCBMMjAgNzUgWiIgZmlsbD0iI2ZmZiIvPjxwYXRoIGQ9Ik0zMCAyMSBMMzUgMjIgTDM4IDc2IEwzMiA3NSBaIE00NSAyMiBMNTAgMjMgTDUzIDc3IEw0NyA3NiBaIE02MCAyMyBMNjUgMjQgTDY4IDc4IEw2MiA3NyBaIiBmaWxsPSIjMDAwIi8+PGNpcmNsZSBjeD0iMjUiIGN5PSIyMCIgcj0iMTUiIGZpbGw9IiNmZmYiLz48cGF0aCBkPSJNMjAgMjUgQzE4IDM1IDE1IDM1IDE1IDIwIFoiIGZpbGw9IiMwMDAiLz48Y2lyY2xlIGN4PSIyMiIgY3k9IjE4IiByPSIyIiBmaWxsPSIjMDAwIi8+PC9zdmc+', color: 'bg-slate-400' },
        ],
        englishWordFlashcards: [],
    },
    stories: [],
    advertisements: [],
    gist: { rawUrl: '', accessToken: '' }
};


const App: React.FC = () => {
    const [appData, setAppData] = useLocalStorage<AppData>('stories-app-data', DEFAULT_APP_DATA);
    const [isLoading, setIsLoading] = useState(!!GIST_RAW_URL);
    const [error, setError] = useState<string | null>(null);
    const [selectedStory, setSelectedStory] = useState<Story | null>(null);
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [settingsTab, setSettingsTab] = useState<Tab>('general');
    const [view, setView] = useState<View>('home');
    const [currentAd, setCurrentAd] = useState<Advertisement | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeMainTab, setActiveMainTab] = useState<MainTab>('stories');

    const backgroundMusicRef = useRef<HTMLAudioElement>(null);
    const [isMuted, setIsMuted] = useState(true);

    useEffect(() => {
        if (GIST_RAW_URL) {
            const fetchInitialData = async () => {
                try {
                    const url = new URL(GIST_RAW_URL);
                    const pathParts = url.pathname.split('/');
                    const gistId = pathParts[2];
                    const filename = pathParts[pathParts.length - 1];

                    if (!gistId) throw new Error("Invalid Gist URL");

                    const apiResponse = await fetch(`https://api.github.com/gists/${gistId}`);
                    if (!apiResponse.ok) throw new Error(`فشل تحميل البيانات من واجهة GitHub: ${apiResponse.statusText}`);
                    
                    const gistData = await apiResponse.json();
                    
                    const file = gistData.files[filename];
                    if (!file) {
                        throw new Error(`File '${filename}' not found in the Gist. Available files: ${Object.keys(gistData.files).join(', ')}`);
                    }
    
                    let content: string;
                    if (file.truncated) {
                        const rawResponse = await fetch(file.raw_url);
                        if (!rawResponse.ok) {
                            throw new Error(`Failed to fetch full content from raw_url: ${rawResponse.statusText}`);
                        }
                        content = await rawResponse.text();
                    } else {
                        content = file.content;
                    }
    
                    const data: AppData = JSON.parse(content);
                    
                    setAppData(prevData => ({
                        ...data,
                        gist: {
                            ...data.gist,
                            rawUrl: GIST_RAW_URL, // Enforce the constant as the source of truth
                            accessToken: prevData.gist.accessToken, // Preserve local token
                        }
                    }));
                } catch (e: any) {
                    console.error("Gist fetch error:", e);
                    setError("عذراً، لم نتمكن من تحميل القصص والمحتويات. الرجاء المحاولة مرة أخرى لاحقاً.");
                } finally {
                    setIsLoading(false);
                }
            };
            fetchInitialData();
        }
    }, []);

    useEffect(() => {
        if (backgroundMusicRef.current) {
            backgroundMusicRef.current.muted = isMuted;
            if(!isMuted) {
                backgroundMusicRef.current.play().catch(e => console.error("BG Music play failed:", e));
            }
        }
    }, [isMuted]);

    const handleStorySelect = (story: Story) => {
        const activeAds = appData.advertisements?.filter(ad => ad.enabled && ad.imageUrl);
        if (activeAds && activeAds.length > 0) {
            const randomAd = activeAds[Math.floor(Math.random() * activeAds.length)];
            setCurrentAd(randomAd);
            setSelectedStory(story);
            setView('ad');
        } else {
            setSelectedStory(story);
            setView('story');
        }
    };

    const handleAdContinue = () => {
        setView('story');
        setCurrentAd(null);
    };

    const handleCloseStory = () => {
        setSelectedStory(null);
        setView('home');
    };

    const handleOpenSettings = (tab: Tab = 'general') => {
        setSettingsTab(tab);
        setIsSettingsOpen(true);
    };

    const filteredStories = useMemo(() => {
        if (!searchTerm) return appData.stories;
        return appData.stories.filter(story =>
            story.title.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [searchTerm, appData.stories]);

    if (isLoading) {
        return (
            <div dir="rtl" className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center">
                <svg className="animate-spin h-12 w-12 text-yellow-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <p className="mt-4 text-xl font-bold">جاري تحميل القصص والمحتويات...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div dir="rtl" className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center p-4 text-center">
                 <div className="text-5xl mb-4">😢</div>
                <h2 className="text-2xl font-bold text-red-400">حدث خطأ</h2>
                <p className="mt-2 text-slate-300 max-w-md">{error}</p>
            </div>
        );
    }

    const MainTabButton: React.FC<{tab: MainTab, label: string, icon: React.ReactNode}> = ({tab, label, icon}) => (
         <button onClick={() => setActiveMainTab(tab)} className={`flex-1 flex items-center justify-center space-x-2 space-x-reverse py-3 px-2 sm:px-4 font-bold text-lg rounded-t-2xl transition-all border-b-4 ${activeMainTab === tab ? 'bg-slate-800/50 text-yellow-300 border-yellow-300' : 'bg-slate-900/50 text-white/70 hover:bg-slate-900/80 border-transparent'}`}>
            {icon}
            <span className="hidden sm:inline">{label}</span>
        </button>
    );
    
    const renderMainContent = () => {
        switch(activeMainTab) {
            case 'stories':
                return (
                     <div id="stories-content" className="animate-fade-in">
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                            {filteredStories.map(story => (
                                <StoryCard key={story.id} story={story} onStorySelect={handleStorySelect} />
                            ))}
                        </div>
                        {filteredStories.length === 0 && (
                             <div className="text-center text-white/80 p-8">
                                <p className="font-bold text-lg">{searchTerm ? 'لا توجد نتائج بحث!' : 'لا توجد قصص حالياً.'}</p>
                                <p className="text-sm mt-2">{searchTerm ? 'جرّب كلمة بحث أخرى.' : 'لإضافة قصص، اذهب إلى لوحة التحكم ⚙️.'}</p>
                            </div>
                        )}
                    </div>
                );
            case 'games':
                return <InteractiveGames />;
            case 'fun':
                return (
                    <div className="space-y-6">
                        <SectionCard title="أغاني أطفال" count={(appData.settings.songUrls || []).length} icon={<MusicIcon className="w-8 h-8"/>} colorClasses="from-pink-500 to-rose-600" defaultOpen={true}>
                           <KidsSongsSection />
                        </SectionCard>
                        <SectionCard title="شاهد على يوتيوب" count={(appData.settings.youtubeUrls || []).length} icon={<YoutubeIcon className="w-8 h-8"/>} colorClasses="from-red-500 to-orange-600" defaultOpen={true}>
                           <YoutubeSection />
                        </SectionCard>
                         <SectionCard title="ألغاز ومسابقات" count={(appData.settings.quizzes || []).length} icon={<QuestionIcon className="w-8 h-8"/>} colorClasses="from-violet-500 to-purple-600">
                            <QuizSection />
                        </SectionCard>
                        <SectionCard title="تلوين ومرح" count={(appData.settings.coloringPages || []).length} icon={<PaletteIcon className="w-8 h-8"/>} colorClasses="from-cyan-500 to-sky-600">
                           <ColoringBook />
                        </SectionCard>
                         <SectionCard title="ألعاب الألغاز (Puzzle)" count={(appData.settings.puzzleImages || []).length} icon={<PuzzleIcon className="w-8 h-8"/>} colorClasses="from-lime-500 to-green-600">
                           <PuzzleGame />
                        </SectionCard>
                         <SectionCard title="هل تعلم؟" count={(appData.settings.funFacts || []).length} icon={<LightbulbIcon className="w-8 h-8"/>} colorClasses="from-amber-500 to-yellow-600">
                           <DidYouKnow />
                        </SectionCard>
                        <SectionCard title="معرض الرسومات" count={(appData.settings.drawings || []).length} icon={<PaletteIcon className="w-8 h-8"/>} colorClasses="from-fuchsia-500 to-pink-600">
                           <DrawingGallery />
                        </SectionCard>
                    </div>
                );
            case 'flashcards':
                return <Flashcards />;
            default:
                return null;
        }
    };

    return (
        <AppContext.Provider value={{ appData, setAppData }}>
            <div dir="rtl" className="min-h-screen bg-slate-900 text-white font-sans transition-colors duration-500" style={{backgroundImage: appData.settings.backgroundImageUrl ? `url(${appData.settings.backgroundImageUrl})` : 'none', backgroundSize: 'cover', backgroundPosition: 'center', backgroundAttachment: 'fixed'}}>
                <div className="min-h-screen bg-black/50 backdrop-blur-sm">
                    <header className="sticky top-0 z-40 bg-slate-900/80 backdrop-blur-lg shadow-lg">
                        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
                            <div className="flex items-center space-x-3 space-x-reverse">
                                <img src={appData.settings.logoUrl} alt="Logo" className="h-12 w-12 rounded-full object-cover" />
                                <h1 className="text-xl sm:text-2xl font-bold">{appData.settings.siteTitle}</h1>
                            </div>
                            
                            <div className="flex-1 max-w-sm mx-4 relative">
                               <input
                                    type="search"
                                    placeholder="ابحث عن قصة..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full bg-slate-800/50 placeholder-gray-400 rounded-full py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-yellow-400 border border-transparent focus:border-yellow-400"
                                />
                                <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"/>
                            </div>

                            <div className="flex items-center space-x-2 space-x-reverse">
                                 {appData.settings.backgroundMusicUrl && (
                                     <button onClick={() => setIsMuted(!isMuted)} className="p-2 bg-slate-800 rounded-full hover:bg-slate-700 transition-colors">
                                        {isMuted ? <SpeakerOffIcon className="w-6 h-6"/> : <SpeakerOnIcon className="w-6 h-6"/>}
                                    </button>
                                 )}
                                <button onClick={() => handleOpenSettings()} className="p-2 bg-slate-800 rounded-full hover:bg-slate-700 transition-colors">
                                    <SettingsIcon className="w-6 h-6" />
                                </button>
                            </div>
                        </div>
                    </header>

                    <main className="container mx-auto p-4 sm:p-6">
                        {appData.settings.siteNotice && (
                            <CartoonBox color="yellow" className="mb-8" title="تنويه" icon={<SparkleIcon className="w-6 h-6 text-yellow-700"/>}>
                                {appData.settings.siteNotice}
                            </CartoonBox>
                        )}
                        
                        <div className="flex border-b-4 border-slate-700 mb-6">
                           <MainTabButton tab="stories" label="القصص" icon={<BookIcon className="w-6 h-6"/>} />
                           <MainTabButton tab="games" label="ألعاب تفاعلية" icon={<SparkleIcon className="w-6 h-6"/>} />
                           <MainTabButton tab="flashcards" label="بطاقات تعليمية" icon={<AbcIcon className="w-6 h-6"/>} />
                           <MainTabButton tab="fun" label="تسلية ومنوعات" icon={<GiftIcon className="w-6 h-6"/>} />
                        </div>
                        
                        {activeMainTab === 'flashcards' && (
                             <SectionCard title="كلمات إنجليزية" count={(appData.settings.englishWordFlashcards || []).length} icon={<AbcEnIcon className="w-8 h-8"/>} colorClasses="from-rose-500 to-pink-600" defaultOpen={true}>
                                <EnglishWordsSection />
                            </SectionCard>
                        )}

                        {renderMainContent()}
                        
                         {appData.settings.aboutSectionText && (
                            <div className="mt-12">
                                <CartoonBox color="blue" title="عن الموقع" icon={<LightbulbIcon className="w-6 h-6"/>}>
                                    {appData.settings.aboutSectionText}
                                </CartoonBox>
                            </div>
                        )}
                    </main>

                     <footer className="mt-12 py-6 bg-slate-900/80 text-center text-slate-400">
                        <div className="container mx-auto px-4">
                           <p>جميع الحقوق محفوظة &copy; {new Date().getFullYear()}</p>
                           {(appData.settings.developerName || appData.settings.developerLink) && (
                               <p className="mt-2 text-sm">
                                   تصميم وتطوير: <a href={appData.settings.developerLink || '#'} target="_blank" rel="noopener noreferrer" className="text-yellow-400 hover:underline">{appData.settings.developerName || 'المطور'}</a>
                               </p>
                           )}
                           <a href={appData.settings.externalLink} target="_blank" rel="noopener noreferrer" className="mt-4 inline-block text-xs text-slate-500 hover:text-slate-300 transition-colors">
                            (موافقة الوالدين)
                           </a>
                        </div>
                    </footer>

                </div>
            </div>

            {view === 'story' && selectedStory && <StoryViewer story={selectedStory} onClose={handleCloseStory} />}
            {isSettingsOpen && <SettingsModal onClose={() => setIsSettingsOpen(false)} initialTab={settingsTab} />}
            {view === 'ad' && currentAd && <AdModal ad={currentAd} onContinue={handleAdContinue} />}
            {appData.settings.backgroundMusicUrl && (
                <audio ref={backgroundMusicRef} src={appData.settings.backgroundMusicUrl} loop preload="auto" />
            )}
        </AppContext.Provider>
    );
};

export default App;