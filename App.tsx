import React, { useState, createContext, useMemo, useEffect, useRef } from 'react';
import { AppData, Story, Advertisement } from './types';
import StoryCard from './components/StoryCard';
import StoryViewer from './components/StoryViewer';
import SettingsModal, { Tab } from './components/SettingsModal';
import AdModal from './components/AdModal';
import useLocalStorage from './hooks/useLocalStorage';
import { SettingsIcon, ArrowLeftIcon, ArrowRightIcon, SearchIcon, BookIcon, SparkleIcon, YoutubeIcon, QuestionIcon, PaletteIcon, SpeakerOnIcon, SpeakerOffIcon, GiftIcon, PuzzleIcon, LightbulbIcon, PawIcon, AbcIcon } from './components/Icons';
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

type View = 'home' | 'ad' | 'youtube' | 'story';
type MainTab = 'stories' | 'games' | 'fun' | 'flashcards';

interface IAppContext {
    appData: AppData;
    setAppData: (data: AppData) => void;
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
        externalLink: "https://www.google.com/search?q=parental+consent+form",
        backgroundImageUrl: '',
        developerName: '',
        developerLink: '',
        siteNotice: "مرحباً يا أصدقاء! لا تنسوا تفقد قسم الألعاب التفاعلية الممتعة!",
        aboutSectionText: "أهلاً بكم في عالم قصص الأطفال! هنا يمكنكم قراءة القصص الجميلة، اللعب بالألعاب المسلية، تلوين الصور الرائعة، ومشاهدة الفيديوهات الممتعة. نتمنى لكم وقتاً سعيداً!",
        coloringPages: [
            { id: 'coloring-dino', imageUrl: 'data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PSIwIDAgMTAwIDEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBzdHJva2U9ImJsYWNrIiBzdHJva2Utd2lkdGg9IjIiIGZpbGw9IndoaXRlIj48cGF0aCBkPSJNIDUwLDgwIEMgNDAsOTUgMjAsOTUgMTAsODAgUSA1LDcwIDE1LDYwIEMgMjAsNTAgMzAsNTAgMzUsNjAgQyA0MCw2NSA0NSw3MCA1MCw4MCBaIiAvPjxwYXRoIGQ9Ik0gMzUsNjAgQyAzMCw0MCA0MCwyMCA2MCwyMCBDIDgwLDIwIDkwLDQwIDg1LDYwIFEgODAsNzAgNzAsNzAgTCA1MCw4MCBaIiAvPjxjaXJjbGUgY3g9Ijc1IiBjeT0iMzUiIHI9IjMiIGZpbGw9ImJsYWNrIi8+PHBhdGggZD0iTSA3MCA0NSBRIDc1IDUwIDgwIDQ1IiBzdHJva2U9ImJsYWNrIiBzdHJva2Utd2lkdGg9IjEuNSIgZmlsbD0ibm9uZSIvPjwvZz48L3N2Zz4=' },
            { id: 'coloring-robot', imageUrl: 'data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PSIwIDAgMTAwIDEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBzdHJva2U9ImJsYWNrIiBzdHJva2Utd2lkdGg9IjIiIGZpbGw9IndoaXRlIj48cmVjdCB4PSIzMCIgeT0iMjAiIHdpZHRoPSI0MCIgaGVpZ2h0PSIzMCIgcng9IjUiIC8+PHJlY3QgeD0iMjUiIHk9IjUwIiB3aWR0aD0iNTAiIGhlaWdodD0iNDAiIHJ4PSI1IiAvPjxjaXJjbGUgY3g9IjQwIiBjeT0iMzUiIHI9IjQiIGZpbGw9ImJsYWNrIiAvPjxjaXJjbGUgY3g9IjYwIiBjeT0iMzUiIHI9IjQiIGZpbGw9ImJsYWNrIiAvPjxyZWN0IHg9IjQwIiB5PSI0MiIgd2lkdGg9IjIwIiBoZWlnaHQ9IjMiIGZpbGw9ImJsYWNrIiAvPjxyZWN0IHg9IjE1IiB5PSI1NSIgd2lkdGg9IjEwIiBoZWlnaHQ9IjI1IiAvPjxyZWN0IHg9Ijc1IiB5PSI1NSIgd2lkdGg9IjEwIiBoZWlnaHQ9IjI1IiAvPjxyZWN0IHg9IjM1IiB5PSI5MCIgd2lkdGg9IjEwIiBoZWlnaHQ9IjEwIiAvPjxyZWN0IHg9IjU1IiB5PSI5MCIgd2lkdGg9IjEwIiBoZWlnaHQ9IjEwIiAvPjwvZz48L3N2Zz4=' },
            { id: 'coloring-butterfly', imageUrl: 'data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PSIwIDAgMTAwIDEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBzdHJva2U9ImJsYWNrIiBzdHJva2Utd2lkdGg9IjIiIGZpbGw9IndoaXRlIj48cGF0aCBkPSJNIDUwLDIwIEMgMjAsMTAgMTAsNTAgNTAsNTAgQyA5MCw1MCA4MCwxMCA1MCwyMCBaIiAvPjxwYXRoIGQ9Ik0gNTAsODAgQyAyMCw5MCAxMCw1MCA1MCw1MCBDIDkwLDUwIDgwLDkwIDUwLDgwIFoiIC8+PHBhdGggZD0iTSA0OCAyMCBMIDQ4IDgwIE0gNTIgMjAgTCA1MiA4MCIgc3Ryb2tlLXdpZHRoPSIxIi8+PGNpcmNsZSBjeD0iNTAiIGN5PSIxNSIgcj0iNCIvPjxsaW5lIHgxPSI0NSIgeTE9IjEwIiB4Mj0iNDAiIHkyPSI1Ii8+PGxpbmUgeDE9IjU1IiB5MT0iMTAiIHgyPSI2MCIgeTI9IjUiLz48L2c+PC9zdmc+' },
            { id: 'coloring-rocket', imageUrl: 'data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PSIwIDAgMTAwIDEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBzdHJva2U9ImJsYWNrIiBzdHJva2Utd2lkdGg9IjIiIGZpbGw9IndoaXRlIj48cGF0aCBkPSJNIDUwIDEwIEwgNzAgNDAgTCA3MCA4MCBRIDUwIDk1IDMwIDgwIEwgMzAgNDAgWiIgLz48cG9seWdvbiBwb2ludHM9IjUwLDEwIDQwLDI1IDYwLDI1IiBmaWxsPSJ3aGl0ZSIgc3Ryb2tlPSJibGFjayIgc3Ryb2tlLXdpZHRoPSIyIiAvPjxjaXJjbGUgY3g9IjUwIiBjeT0iNTUiIHI9IjEwIiAvPjxwb2x5Z29uIHBvaW50cz0iMzAsODAgMjAsOTUgNDAsODAiIC8+PHBvbHlnb24gcG9pbnRzPSI3MCw4MCA2MCw4MCA4MCw5NSIgLz48L2c+PC9zdmc+' },
            { id: 'coloring-cupcake', imageUrl: 'data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PSIwIDAgMTAwIDEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBzdHJva2U9ImJsYWNrIiBzdHJva2Utd2lkdGg9IjIiIGZpbGw9IndoaXRlIj48cGF0aCBkPSJNIDI1IDcwIEwgMzAgOTUgSCA3MCBMIDc1IDcwIFoiIC8+PHBhdGggZD0iTSAyMCA3MCBDIDIwIDQwLCA4MCA0MCwgODAgNzAgWiIgLz48Y2lyY2xlIGN4PSI1MCIgY3k9IjM1IiByPSI1IiBmaWxsPSJ3aGl0ZSIgc3Ryb2tlPSJibGFjayIgc3Ryb2tlLXdpZHRoPSIyIiAvPjxwYXRoIGQ9Ik0gMzUgNjAgUSA1MCA1MCA2NSA2MCIgZmlsbD0ibm9uZSIvPjxwYXRoIGQ9Ik0gMzAgNTAgUSA1MCA0MCA3MCA1MCIgZmlsbD0ibm9uZSIvPjwvZz48L3N2Zz4=' },
        ],
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
        funFacts: [
            {
                id: 'fact-1',
                text: 'هل تعلم أن قلب الحوت الأزرق كبير جدًا لدرجة أن طفلًا يمكنه السباحة في شرايينه؟',
                imageUrl: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIj48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iIzc0Q0RFOCI+PC9yZWN0PjxwYXRoIGQ9Ik0xMCA1MCBDMzAgMjAsIDcwIDIwLCA5MCA1MCBDNzAgODAsIDMwIDgwLCAxMCA1MFoiIGZpbGw9IiMwMDZBQ0QiPjwvcGF0aD48Y2lyY2xlIGN4PSIyMCIgY3k9IjQ1IiByPSI1IiBmaWxsPSIjRkZGIj48L2NpcmNsZT48L3N2Zz4=',
            },
            {
                id: 'fact-2',
                text: 'النمل لا ينام أبدًا!',
                imageUrl: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIj48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iI0E2NzY1OCI+PC9yZWN0PjxyZWN0IHg9IjQwIiB5PSI0MCIgd2lkdGg9IjIwIiBoZWlnaHQ9IjMwIiByeD0iMTAiIGZpbGw9IiMzNzE5MEUiPjwvcmVjdD48cmVjdCB4PSIyMCIgeT0iNTAiIHdpZHRoPSI2MCIgaGVpZHRoPSIyMCIgcng9IjEwIiBmaWxsPSIjNTk0MDA4Ij48L3JlY3Q+PGNpcmNsZSBjeD0iNTAiIGN5PSIzMCIgcj0iMTAiIGZpbGw9IiMzNzE5MEUiPjwvY2lyY2xlPjwvc3ZnPg==',
            },
        ],
        animalFlashcards: [],
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
            { name: 'روبوت', image: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0iIzM3NDFsNSI+PHBhdGggZD0iTTQgNGMtMS4xMSAwLTIgLjg5LTIgMnYxMmg1LjV2NEgyMXYtNEgyNHYtMmgtMy41di0xSDI0VjZoLTJWNGgtM3YySDdWNEM1LjM0IDQgNCA1LjM0IDQgNHptMy41IDZjLjgyIDAgMS41LjY3IDEuNSAxLjVTLOC4zMyAxMyA3LjUgMTNzLTEuNS0uNjctMS41LTEuNS42Ny0xLjUgMS41LTEuNXptOSA2Yy44MyAwIDEuNS42NyAxLjUgMS41UzE3LjMzIDE5IDE2LjUgMTlzLTEuNS0uNjctMS41LTEuNS42Ny0xLjUgMS41LTEuNXptMC0xMGMuODMgMCAxLjUuNjcgMS41IDEuNVMxNy4zMyA4IDE2LjUgOHMtMS41LS42Ny0xLjUtMS41LjY3LTEuNSAxLjUtMS41ek03IDJoMnYySDdWMnptOCAwaDJ2MmgLTJWMnoiLz48L3N2Zz4=' },
        ],
        arabicAlphabetData: [],
        englishAlphabetData: [],
    },
    stories: [],
    advertisements: [],
    gist: {
        rawUrl: '',
        accessToken: ''
    }
};

const App: React.FC = () => {
    const [appData, setAppData] = useLocalStorage<AppData>('stories-app-data', DEFAULT_APP_DATA);
    const [selectedStory, setSelectedStory] = useState<Story | null>(null);
    const [currentView, setCurrentView] = useState<View>('home');
    const [activeAd, setActiveAd] = useState<Advertisement | null>(null);
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [settingsTab, setSettingsTab] = useState<Tab>('general');
    const [activeTab, setActiveTab] = useState<MainTab>('stories');
    const [isMuted, setIsMuted] = useState(true);
    const musicRef = useRef<HTMLAudioElement>(null);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        document.title = appData.settings.siteTitle;
    }, [appData.settings.siteTitle]);

    useEffect(() => {
        const musicElement = musicRef.current;
        if (musicElement) {
            musicElement.muted = isMuted;
            if (!isMuted) {
                musicElement.play().catch(e => console.error("Music play failed:", e));
            } else {
                musicElement.pause();
            }
        }
    }, [isMuted]);

    const handleStorySelect = (story: Story) => {
        const enabledAds = (appData.advertisements || []).filter(ad => ad.enabled);
        if (enabledAds.length > 0) {
            const randomAd = enabledAds[Math.floor(Math.random() * enabledAds.length)];
            setActiveAd(randomAd);
        }
        setSelectedStory(story);
        setCurrentView('ad');
    };

    const handleContinueFromAd = () => {
        setCurrentView('story');
        setActiveAd(null);
    };

    const handleShowYoutube = () => {
        const enabledAds = (appData.advertisements || []).filter(ad => ad.enabled && ad.linkUrl.includes('youtube'));
        if (enabledAds.length > 0) {
            const randomAd = enabledAds[Math.floor(Math.random() * enabledAds.length)];
            setActiveAd(randomAd);
            setCurrentView('ad');
        } else {
            setCurrentView('youtube');
        }
    }

    const openSettings = (tab: Tab = 'general') => {
        setSettingsTab(tab);
        setIsSettingsOpen(true);
    };

    const filteredStories = useMemo(() => {
        if (!searchTerm) return appData.stories;
        return appData.stories.filter(story => story.title.toLowerCase().includes(searchTerm.toLowerCase()));
    }, [searchTerm, appData.stories]);

    const renderContent = () => {
        switch (activeTab) {
            case 'stories': return (
                <>
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
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 animate-fade-in">
                            {filteredStories.map(story => (
                                <StoryCard key={story.id} story={story} onStorySelect={handleStorySelect} />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center text-white/80 p-8 bg-slate-800/50 rounded-xl">
                           <p className="font-bold text-lg">{searchTerm ? 'لا توجد نتائج بحث!' : 'لا توجد قصص حالياً.'}</p>
                           <p className="text-sm mt-2">{searchTerm ? 'جرّب كلمة بحث أخرى.' : 'لإضافة قصص، اذهب إلى لوحة التحكم ⚙️'}</p>
                        </div>
                    )}
                </>
            );
            case 'games': return (
                <>
                    <SectionCard
                        title="ألعاب تفاعلية"
                        count={18}
                        icon={<SparkleIcon className="w-8 h-8" />}
                        colorClasses="from-rose-500 to-red-600"
                    >
                        <InteractiveGames />
                    </SectionCard>
                    <SectionCard
                        title="ألعاب الألغاز (Puzzle)"
                        count={(appData.settings.puzzleImages || []).length}
                        icon={<PuzzleIcon className="w-8 h-8" />}
                        colorClasses="from-sky-500 to-indigo-600"
                    >
                       <PuzzleGame />
                    </SectionCard>
                    <SectionCard
                        title="الألغاز والمسابقات"
                        count={(appData.settings.quizzes || []).length}
                        icon={<QuestionIcon className="w-8 h-8" />}
                        colorClasses="from-lime-500 to-green-600"
                    >
                        <QuizSection />
                    </SectionCard>
                </>
            );
            case 'fun': return (
                 <>
                    <SectionCard
                        title="تلوين ومرح"
                        count={(appData.settings.coloringPages || []).length}
                        icon={<PaletteIcon className="w-8 h-8" />}
                        colorClasses="from-pink-500 to-purple-600"
                    >
                        <ColoringBook />
                    </SectionCard>
                    <SectionCard
                        title="معرض الرسومات"
                        count={(appData.settings.drawings || []).length}
                        icon={<PaletteIcon className="w-8 h-8" />}
                        colorClasses="from-amber-500 to-orange-600"
                    >
                        <DrawingGallery />
                    </SectionCard>
                    <SectionCard
                        title="هل تعلم؟"
                        count={(appData.settings.funFacts || []).length}
                        icon={<LightbulbIcon className="w-8 h-8" />}
                        colorClasses="from-yellow-400 to-amber-500"
                    >
                       <DidYouKnow />
                    </SectionCard>
                     <SectionCard
                        title="شاهد على يوتيوب"
                        count={(appData.settings.youtubeUrls || []).filter(u => u.trim() !== '').length}
                        icon={<YoutubeIcon className="w-8 h-8" />}
                        colorClasses="from-red-500 to-rose-600"
                    >
                        <YoutubeSection />
                    </SectionCard>
                </>
            );
            case 'flashcards': return <Flashcards />;
        }
    };
    
    const TabButton: React.FC<{ tab: MainTab; icon: React.ReactNode; label: string }> = ({ tab, icon, label }) => (
        <button
            onClick={() => setActiveTab(tab)}
            className={`flex-1 flex flex-col sm:flex-row items-center justify-center space-x-2 space-x-reverse rounded-t-2xl px-4 py-3 font-bold text-lg transition-all duration-300 transform
            ${activeTab === tab ? 'bg-slate-800/70 text-yellow-300 scale-105 shadow-lg' : 'bg-black/30 text-white/80 hover:bg-black/50 hover:text-white'}`}
        >
            {icon}
            <span>{label}</span>
        </button>
    );

    if (currentView === 'story' && selectedStory) {
        return <StoryViewer story={selectedStory} onClose={() => { setSelectedStory(null); setCurrentView('home'); }} />;
    }
    if (currentView === 'ad' && activeAd && selectedStory) {
        return <AdModal ad={activeAd} onContinue={handleContinueFromAd} />;
    }

    return (
        <AppContext.Provider value={{ appData, setAppData }}>
            <div className="min-h-screen bg-slate-900 text-white font-sans" dir="rtl" style={{
                backgroundImage: appData.settings.backgroundImageUrl ? `url(${appData.settings.backgroundImageUrl})` : 'none',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundAttachment: 'fixed',
            }}>
                <div className="min-h-screen bg-black/50 backdrop-blur-sm">
                    <div className="container mx-auto px-4 py-6">
                        <header className="flex justify-between items-center mb-6">
                             <div className="flex items-center space-x-4 space-x-reverse">
                                {appData.settings.logoUrl && <img src={appData.settings.logoUrl} alt="Logo" className="h-14 w-14 rounded-full shadow-lg border-2 border-yellow-400" />}
                                <h1 className="text-3xl sm:text-4xl font-black text-yellow-300" style={{ textShadow: "2px 2px 4px rgba(0,0,0,0.5)" }}>{appData.settings.siteTitle}</h1>
                            </div>
                            <div className="flex items-center space-x-2 space-x-reverse">
                                {appData.settings.backgroundMusicUrl && (
                                <button onClick={() => setIsMuted(!isMuted)} className="p-3 bg-slate-800/50 rounded-full hover:bg-slate-700/70 transition-colors shadow-md">
                                    {isMuted ? <SpeakerOffIcon className="w-6 h-6" /> : <SpeakerOnIcon className="w-6 h-6" />}
                                </button>
                                )}
                                <button onClick={() => openSettings()} className="p-3 bg-slate-800/50 rounded-full hover:bg-slate-700/70 transition-colors shadow-md">
                                    <SettingsIcon className="w-6 h-6" />
                                </button>
                            </div>
                        </header>

                        {appData.settings.siteNotice && (
                            <div className="mb-6 animate-fade-in">
                                <CartoonBox color="yellow" title="تنويه!" icon={<LightbulbIcon className="w-6 h-6" />}>
                                    {appData.settings.siteNotice}
                                </CartoonBox>
                            </div>
                        )}
                        
                        <nav className="flex justify-center bg-black/20 p-1 rounded-t-2xl shadow-lg">
                           <TabButton tab="stories" icon={<BookIcon className="w-6 h-6"/>} label="القصص" />
                           <TabButton tab="games" icon={<PuzzleIcon className="w-6 h-6"/>} label="الألعاب" />
                           <TabButton tab="flashcards" icon={<AbcIcon className="w-6 h-6"/>} label="بطاقات" />
                           <TabButton tab="fun" icon={<SparkleIcon className="w-6 h-6"/>} label="تسلية" />
                        </nav>

                        <main className="bg-slate-800/70 p-4 sm:p-6 rounded-b-2xl shadow-inner">
                            {renderContent()}
                        </main>
                        
                        {appData.settings.aboutSectionText && (
                            <div className="mt-8 animate-fade-in">
                                <CartoonBox color="blue" title={`حول ${appData.settings.siteTitle}`} icon={<PawIcon className="w-6 h-6" />}>
                                    {appData.settings.aboutSectionText}
                                </CartoonBox>
                            </div>
                        )}

                        <footer className="text-center mt-8 text-slate-400 text-sm">
                            <p>
                                صنع بحب ❤️ بواسطة <a href={appData.settings.developerLink} target="_blank" rel="noopener noreferrer" className="text-yellow-400 hover:underline">{appData.settings.developerName || 'مطور التطبيق'}</a>
                            </p>
                        </footer>
                    </div>
                </div>

                {isSettingsOpen && <SettingsModal onClose={() => setIsSettingsOpen(false)} initialTab={settingsTab} />}
                
                {appData.settings.backgroundMusicUrl && (
                    <audio ref={musicRef} src={appData.settings.backgroundMusicUrl} loop preload="auto" />
                )}
            </div>
        </AppContext.Provider>
    );
}

export default App;