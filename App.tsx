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
            { name: 'وحش', image: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0iIzQzY2I1MSI+PHBhdGggZD0iTTE2IDRjMS4xMSAwIDIuODMuNzEgNC4xMSAySDExYy0uMzIgMC0uNjIuMDgtLjg5LjIxQzEwLjYxIDQuODggMTIgMy41IDEyIDJIMTZtMy41IDljLjgyIDAgMS41LjY3IDEuNSAxLjVzLS42NyAxLjUtMS41IDEuNS0xLjUtLjY3LTEuNS0xLjNS42Ny0xLjUgMS41LTEuNXptLTggMGMuODIgMCAxLjUuNjcgMS41IDEuNVMxMi4zMyAxNSAxMS41IDE1cy0xLjUtLjY3LTEuNS0xLjUuNjctMS41IDEuNS0xLjV6bTQuNSA0YzMuMzEgMCA2LTIuNjkgNi02cy0yLjY5LTYtNi02aC00Yy0uNjYgMC0xLjI4LjE3LTEuODIuNDVDNC42NyA3LjQ4IDIgOS42NCAyLjAyIDE0YzAgMS4yLjM3IDIuMjggMSAzLjAyVjIwgaDE2di0yLjk4Yy42MS0uNzMuOTgtMS44IDEtMi45MiAwLTMuMzEtMi42OS02LTYtNmgtek0xMiAyMmMtMS4xMSAwLTItLjg5LTItMnMtLjg5LTItMi0yIDAtLjg5IDAtMi0uODktMi0yLTJjLS40MSAwLS43OS4xMy0xLjEuMzVWMjJMMTIgMjJ6bTQtMWMwIC41NS0uNDUgMS0xIDEuNDUtLjAzLjAyLS4wNS4wNC0uMDguMDVoLTUuODNjLS4wMyAwLS4wNi0uMDMtLjA4LS4wNUM3LjUxIDE5LjE0IDYgMTcuNzMgNiAxNmgyYzAgMS4zMy42NyAyLjUgMS45MSAzLjExbDEuMjEtMS4yMmMuMjctLjI3LjcxLS4yNy45OCAwbDEuMjEgMS4yMmMxLjI0LS42MSAxLjg5LTEuNzggMS44OS0zLjExaDJjMCAxLjczLTEuNTEgMy4xNC0zLjQxIDMuNDV6Ii8+PC9zdmc+' },
            { name: 'بيتزا', image: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0iI2Y5NzMxNiI+PHBhdGggZD0iTTEyIDJDNi41IDEyLjUgNCAyMiA0IDIyaDE2cy0yLjUtOS41LTgtMjB6bS0yLjE0IDhjLjY3IDEuMDkgMS4zNCAyLjQ0IDIuMTQgNC4wMUMxMi4zNCAxNC40NCAxMi42NyAxMy4wOSAxMy4zNCAxMkgxMi41bDItNGgtMy42bDIuMjYgNGgtMS4zMnptLTMuOTItLjQ1Yy4xNS4xOC4zMS4zNS40OC41MmwxLjYxLTIuNzljLS4zMS0uMTgtLjY0LS4zNC0uOTgtLjQ2bC0xLjExIDIuNzN6bTIuNDEgNS4xN2MuMzYtLjU0LjY1LTEuMDQuNzEtMS40OEw5IDIxLjU2Yy0uMTcuMjItLjM0LjQ0LS41Mi42NmwxLjQ1LTQuMDh6TTIyIDIyaC03Ljg5bDMuMTYtNS40N2MuNy40MyAxLjMyLjk0IDEuODIgMS40OUwyMiAyMnpNMTYgNGEyIDIgMCAxIDEtNCAwIDIgMiAwIDEgMSA0IDB6bS0zIDJhMSAxIDAgMSAwLTIgMCAxIDEgMCAxIDAgMiAweiIvPjwvc3ZnPg==' },
            { name: 'روبوت', image: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0iIzZkYmNmNCI+PHBhdGggZD0iTTQgNmMtMS4xIDAtMiAuOS0yIDJ2OGMwIDEuMS45IDIgMiAyaDJ2NGgyVjZoLTJWM0g5djNoOVY2aC00di0xYzAtMS4xLS45LTItMi0ySDljLTEuMSAwLTIgLjktMiAydjFoLTR6bTEyIDhjLTEuMSAwLTIgLjktMiAydjJoNnYtMmMwLTEuMS0uOS0yLTItMmgtem0tOS00YzAtMS4xLS45LTItMi0ySDVjLTEuMSAwLTIgLjktMiAydjRoMmMwLTEuMS45LTItMi0yaDRjMS4xIDAgMi0uOSAyLTJ2LTR6bTEwIDBjLTEuNjYgMC0zIDEuMzQtMyAzczEuMzQgMyAzIDMgMy0xLjM0IDMtMy0xLjM0LTMtMy0zek04IDExYzEuNjYgMCAzLTEuMzQgMy0zczAtMy0zLTMtMyAxLjM0LTMgMyAxLjM0IDMgMyAzek02IDZjMS4xIDAgMi0uOSAyLTJWMmgydjJjMCAxLjEuOSAyIDIgMmgxdi0yaC0xYy0xLjEgMC0yLS45LTItMlYyaC0ydjJjMCAxLjEuOSAyIDIgMmgydjJoLTZWNnpNNiAxOHYyaDJ2LTJoLTJ6Ii8+PC9zdmc+' },
            { name: 'شبح', image: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0iI2Y4ZmFmYyI+PHBhdGggZD0iTTEyIDJDNi40OCAyIDIgNi40OCAyIDEyczQuNDggMTAgMTAgMTAgMTAtNC40OCAxMC0xMFMyNy41MiAyIDEyIDJ6bS0zLjUgNGMuODMgMCAxLjUuNjcgMS41IDEuNVM5LjMzIDkgOC41IDkgNyA4LjMzIDcgNy41IDcuNjcgNiA4LjUgNnptNyAwYy44MyAwIDEuNS42NyAxLjUgMS41UzE2LjMzIDkgMTUuNSA5IDE0IDguMzMgMTQgNy41IDE0LjY3IDYgMTUuNSA2em0tMy41IDEyLjVjLTIuMzMgMC00LjMxLTEuNDYtNS4xMS0zLjVoMTAuMjJjLS44IDIuMDQtMi43OCAzLjUtNS4xMSAzLjV6Ii8+PC9zdmc+' },
            { name: 'برجر', image: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0iIzk5NTgyYSI+PHBhdGggZD0iTTIgOGg1djJIMnYtNXptMTUtNWg1djVoLTVWN3pNNCA4aDE2djEuNUg0Vjh6bTEgNGMtLjU1IDAtMSAuNDUtMSAxcy40NSAxIDEgMSA1IC40NSAxIDEtLjQ1IDEtMS0xem0yIDBjLjU1IDAgMS0uNDUgMS0xcy0uNDUtMS0xLTEtMSAuNDUtMSAxIC40NSAxIDEgMXptMy0yYy0uNTUgMC0xIC40NS0xIDEgMCAuMTYuMDQuMy4xMS40M2wxLjM4IDIuNDFjLjM4LjY2IDEuMSAxLjA4IDEuOTEgMS4wOGMuODEgMCAxLjUzLS40MiAxLjkxLTEuMDhsMS4zOC0yLjQxYy4wNy0uMTMuMTItLjI3LjEyLS40MyAwLS41NS0uNDUtMS0xLTFzLTUuMzEgMC01LjMxIDB6IiBmaWxsPSIjN2MzNTBmIi8+PHBhdGggZmlsbD0iI2Y5YTgwNSIgZD0iTTYuNSA4SDE3djVoLTEwLjQ2Yy44NS0xLjI4IDEuMTctMy4wNCAxLjQ2LTV6Ii8+PHBhdGggZD0iTTE4LjM2IDE3Yy0uNDEgMC0uNzktLjE0LTEuMS0uMzljLS4zLS4yNi0uNi0uNTgtLjgyLS45NmwtMS4zOS0yLjQyYy0uNTEtLjg5LTEuNDktMS41LTIuNTYtMS42MXYtMS42Mmg4VjEwSDZ2MS4wMmMtMS4wNi4xMS0yLjA1LjcyLTIuNTYgMS42MWwtMS4zOSAyLjQyYy0uMjIuMzgtLjUyLjctLjgyLjk2LS4zMS4yNS0uNjkuMzktMS4xLjM5Ljc1LTEuNTEgMi4zMy0yLjggNC4yNi0zLjE5VjEzSDYuNVY4aDEwLjM2bC0uMTEuMDFIMTd2NWgtLjQ2di0xLjYyYy4wMS0uNDQtLjE5LS44NS0uNTItMS4xMmMtLjMyLS4yNy0uNzUtLjQtMS4xOC0uMjd6IiBmaWxsPSIjZGQ5YTM4Ii8+PC9zdmc+' },
            { name: 'آيس كريم', image: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0iI2ZjYWYzZSI+PHBhdGggZD0iTTE5IDVjLTEuNjYgMC0zIDEuMzQtMyAzIDAgMS4wOS41OSAxLjk5IDEuNDIgMi41M0wxMiAxMy40NyA2LjU4IDEwLjUzQzcuNDEgOS45OSA4IDkuMDkgOCA4YzAtMS42Ni0xLjM0LTMtMy0zczAgMyAwIDNjMCAxLjMuNzUgMi40MiAxLjg0IDIuODFsNC40MiA2LjE4Yy4zOS41NCAxLjIyLjc1IDEuODEuMzZsMS4wNS0uNzVjLjAzLS4wMi4wNi0uMDUuMDktLjA3bDEuMDQuNzVjLjU5LjM5IDEuNDMuMTggMS44MS0uMzZsLS4wNS4wNyA0LjQyLTYuMThDMjAuMjUgOC40MiAyMSA3LjMgMjEgOGMwLTEuNjYtMS4zNC0zLTMtM3oiIGZpbGw9IiNmNDgxYWEiLz48cGF0aCBkPSJNMTEuMTYgMjIuMTlMMTIgMjEuNzNsLjI3LjE4IDEuMDQuNzVjLjU5LjM5IDEuNDMuMTggMS44MS0uMzZsLS4wNS4wNyA0LjQyLTYuMThjMS4wOS0uMzkgMS44NC0xLjUxIDEuODQtMi44MSAwLTEuNjYtMS4zNC0zLTMtM3MtMyAxLjM0LTMgM2MwIDEuMDkuNTkgMS45OSAxLjQyIDIuNTNMMTIgMTMuNDcgNi41OCAxMC41M0M3LjQxIDkuOTkgOCA5LjA5IDggOGMwLTEuNjYtMS4zNC0zLTMtM3MwIDMgMCAzYzAgMS4zLjc1IDIuNDIgMS44NCAyLjgxbDQuNDIgNi4xOGMuMzkuNTQgMS4yMi43NSAxLjgxLjM2bDEuMDUtLjc1Yy4wMy0uMDIuMDYtLjA1LjA5LS4wN2wtLjI3LS4xOCIgZmlsbD0iI2Y4YmVkZCIvPjxwYXRoIGQ9Ik0xMS4xNiAyMi4xOUwxMiAyMS43M2wuMjcuMTggMS4wNC43NWMtLjI4LS40Ny0uMi0xLjA2LjE4LTEuNDRsNC40Mi02LjE4YzEuMDktLjM5IDEuODQtMS41MSAxLjg0LTIuODFjMC0xLjY2LTEuMzQtMy0zLTMtLjM5IDAtLjc2LjA4LTEuMDguMjFDMTUuMzMgMy41OSAxMy44MSA0IDEyIDQgOC43IDQgNi41NSA1LjQ1IDYuNTUgNy41YzAgMS4wOS41OSAxLjk5IDEuNDIgMi41M0wxMSAxMy40N2wtMy4yMyA0LjQ5Yy0uMzguMzgtLjQ2Ljk3LS4xOCAxLjQ0bDEuMDUtLjc1Yy4wMy0uMDIuMDYtLjA1LjA5LS4wN2wtLjI3LS4xOCIgZmlsbD0iI2Y5ZTNmYiIvPjwvc3ZnPg==' },
        ],
        arabicAlphabetData: [
            { letter: 'أ', word: 'أرنب', image: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0iI2ZmZmZmZiI+PHBhdGggZD0iTTE4LjUgMTdjLS41MiAwLTEgLjIyLTEgLjVzLjI4IDEgLjUgMUgxOWwuMDktLjA4Yy4xOS0uMTguNDYtLjMxLjY3LS40MmgtLjI2Yy0uNDYgMC0uOS0uMy0uOTYtLjdjMC0uMDEgMC0uMDIgMC0uMDMtLjA5LS4zOS0uMzQtLjgyLS42Ni0xLjE3bC0uMTgtLjE5Yy0uMy0uMzItLjY1L4xNy0uNDIuNDJsLjE4LjE5YzIuNTMgMi45IDEuMDYgNS44OS0uNjUgNy4yN2MtMS4xLjktMi40LjktMy40LjVjLTMuNDgtMS4zNy0zLjM1LTcuODgtLjA4LTEwLjM4bDEuNjgtMS4yOGMyLjM0IDEuODkgNS4xNiAyLjU5IDcuNTIgMS43M2MuMy0uMTEuNDYtLjQzLjM1LS43M2MtLjExLS4zLS40My0uNDYtLjczLS4zNWMtMi4wMS43My00LjQ4LjEtNi41NC0xLjM0bC0uMS0uMDhjLS41Mi0uMzUtMS4yMy0uMTUtMS41LjQyYy0uMTIuMjYtLjA3LjU3LjExLjc4YzEuMDMgMS4xOCAyLjQ0IDEuNzggMy45MiAxLjgyYzEuMDQuMDMgMi4xMS0uMjEgMy4xMy0uNzVsLTEuODItMS45MmMtMS4zNy0xLjQ0LTEuNi0zLjY2LS41Mi01LjQ1bDEuOTgtMy4yMmMtMi4xNy0uNDktNC40Ny0uMi02LjUuN2MtLjUuMjMtMS4wOC0uMDktMS4zMS0uNTljLS4yMy0uNS4wOS0xLjA4LjU5LTEuMzFjMi4zNi0uOTYgNS4wNS0xLjIgNy42Ny0uNmMuMzMuMDguNTYuMzkuNDguNzJjLS4wNy4zNC0uMzguNTgtLjcyLjUxYy0yLjMxLS40My00LjY2LS4yNC02LjczLjU3bC0xLjEzIDEuODRjLS44NCAxLjM2LS42MyAzLjIuNTIgNC4yNWwyLjEgMS41NmMtLjgyLjM2LTEuNzIuNTUtMi42Ni41NWMtNC4xNSAwLTYuNTMtMy42Ny02LjUtNy41YzAtMS43My42My0zLjM2IDEuNzItNC42MmMuMy0uMzIuMy0uODIuMDItMS4xMmMtLjMxLS4zMS0uODItLjMxLTEuMTMtLjAyYy0xLjM1IDEuNTYtMi4xIDMuNTktMi4xIDUuNzdjMCA0LjQxIDIuOSA4LjUgNy41IDguNWMxLjIgMCAyLjM0LS4yNiAzLjM5LS43NmMxLjkyIDEuNjcgMy41NyAxLjQ4IDQuOTUtLjQ5YzIuMDUtMi45MiAxLjE4LTYuNzctMi4xNS05LjNsLS4yLS4xNmMyLjU4LS4wOCA0Ljg5IDEuMiA2LjQgMy4xMWMuMjcuMzUuNzYuNDIgMS4xMS4xNWMuMzUtLjI3LjQyLS43Ni4xNS0xLjExYy0xLjgyLTIuMzYtNC42OS0zLjg2LTcuNzUtMy44NmMtLjM1IDAtLjctLjAzLTEuMDUtLjA5Yy0uNTktLjA5LTEuMDUtLjU4LTEuMDUtMS4xN2MwLS42Ni41My0xLjIgMS4yLTEuMmMuMzUgMCAuNjguMTQuOTMuNDJjLjQyLS4xMy44NS0uMiAxLjI4LS4yYzEuMzEgMCAyLjU2LjMxIDMuNjggLjg4bDEuMDMtLjYyYy40LS4yNC44OS0uMDggMS4xMy4zMmMuMjQuNC4wOC44OS0uMzIgMS4xM2wtMS4wMy42MmMxLjQyIDEuMzMgMi4xNyAzLjI2IDIuMTcgNS4yN2MwIC40LS4wMy44LS4xIDEuMTljLS4wNC4yOC0uMDIuNTcgLjA3Ljg0Yy4yNy43OC43NSAxLjQyIDEuMzcgMS44N2MuMzYuMjYuNDUuNzUuMTggMS4xMmMtLjE5LjI2LS41LjM4LS44MS4zMmMtLjcyLS4xNS0xLjI4LS42Ni0xLjYtMS4zMmMtLjE1LS4zLS4xNy0uNjMtLjA3LS45NmMuMDYtLjIuMDgtLjQxLjA4LS42MmMwLTEuNjUtLjYyLTMuMTctMS43Mi00LjI5Yy0uMzEtLjMxLS44Mi0uMy0xLjEzLjAyYy0uMzEuMy0uMy44MS4wMiAxLjEyYzEuMzUgMS4zNiAyLjEyIDMuMjQgMi4xMiA1LjI5YzAgLjAxIDAgLjAyIDAgLjAyIi8+PC9zdmc+', color: colors[0] },
            { letter: 'ب', word: 'بطة', image: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0iI2ZmZmZmZiI+PHBhdGggZD0iTTcgNy41Yy0xLjM4IDAtMi41IDEuMTItMi41IDIuNWMwIDEuMzYuNSAyLjIgMS4xMyAzLjE3Yy40MS42LjU5IDEuMjkuNTIgMS45N2wtLjQxIDQuMDVjLS4wOS44OC42IDEuNjQgMS41IDEuNjRsMi41LjA3Yy44NCAwIDEuNDctLjU0IDEuNjEtMS4zM2wxLjE2LTYuNGMtLjA5LjAxLS4xOS4wMi0uMjguMDJjLTEuOTEgMC0zLjUtMS41Ny0zLjUtMy41UzUuMDkgNy41IDcgNy41em0yIDEuNWMuODMgMCAxLjUuNjcgMS41IDEuNVM5LjgzIDEyIDkgMTJzLS42Ny0xLjUtMS41LTEuNS0xLjUtLjY3LTEuNS0xLjNS42Ny0xLjUgMS41LTEuNXptLTQgMWMxLjY2IDAgMyAxLjM0IDMgM3MtMS4zNCAzLTMgMy0zLTEuMzQtMy0zIDEuMzQtMyAzLTN6bTcgMS41YzAtLjg1LS4zLTEuNjEtLjc5LTIuMjFjMi4zNyAxLjUgMy43OSAzLjI3IDMuNzkgNS43MWgtMXYtLjVMOS4zMiAxMy40M2MuMDQtLjE0LjA2LS4yOS4wNi0uNDNjMC0xLjM4IDEuMTItMi41IDIuNS0yLjVoLjExek0yMSAxOGgtOS4zOGwxLjM5IDcuNzNjLjI0IDEuMzUgMS40NiAyLjI3IDIuODMgMi4yN2g0LjI5Yy44MiAwIDEuNTctLjUgMS44Ny0xLjI2bDEuMzktMi44N0MyNCAyMSAyMi44NCAxOCAyMSAxOHoiLz48L3N2Zz4=', color: colors[1] },
            { letter: 'ت', word: 'تفاحة', image: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0iI2ZmZmZmZiI+PHBhdGggZD0iTTE5IDExYy0xLjY2IDAtMyAxLjM0LTMgM3YxYy0xLjUgMS42Ny0zLjcxIDIuNjctNS45MiAyLjkzYy0uMzEtMi4xOC0xLjY0LTMuOTYtMy4zMy01LjEyYy0xLjQ0LS45OC0zLjE5LTEuMzItNC43NS0xLjA3QzEuMiAxMi4yNy4yIDEzLjc5LjIgMTUuNUMuMiAxNy40MyAxLjcyIDE5IDMuNjUgMTloMTQuN2MxLjktMCAzLjUtMS41NyAzLjUtMy41YzAtMS43My0xLjI3LTMuMTYtMi45Mi0zLjQxQzE4LjUgMTIuMDEgMTggMTEuNTMgMTggMTFjMC0xLjY2LTEuMzQtMy0zLTNzLTMgMS4zNC0zIDNoM2MxLjEgMCAyIC45IDIgMnYxLjVjMCAuMjgtLjIyLjUtLjUuNVMxNyAxNi4yOCAxNyAxNnYtMWMwLTEuMS0uOS0yLTItMnpNMTIuMDcgMy44OWMyLjA1Ljg3IDIuMzEgMy4zNS43MyA0LjkzYy0xLjU4IDEuNTgtNC4wNiAxLjMyLTQuOTMtLjczUzUuNTYgNC4wMyA3LjE0IDIuNDVzNC4wNS0uNzMgNC45MyAxLjQ0eiIvPjwvc3ZnPg==', color: colors[2] },
            { letter: 'ث', word: 'ثعلب', image: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0iI2ZmZmZmZiI+PHBhdGggZD0iTTE5LjYgMTAuNEwxMy45MyAxOEgyLjYxYy0uMzggMC0uNzIuMjItLjg5LjU3bC0xLjMxIDMuMTRjLS4xOC40My0uMDQuOTUuMzMgMS4yOGMuMzYuMzIgLjg5LjMyIDEuMjQgMGwzLjItMy4wNGgxNS4xMmMuNDEgMCAuNzctLjI3LjktLjY2bDEuNDItOC4yNmMuMDQtLjIzLS4wNi0uNDctLjI4LS41OWwtMy45Mi0yLjE5Yy4xMy0uNDIuMi0uOC4yLTEuMjF2LS4wMWMwLS4yMy0uMDMtLjQ1LS4wOC0uNjZsMy4wMy0zLjQzYy4yMi0uMjUuMjgtLjYxLjE1LS45MmwtMy4yNC04LjAzYy0uMTItLjMyLS40Mi0uNTQtLjc2LS41NEgxMGMtLjQxIDAtLjc3LjI3LS45LjY2TDcuNjggOWgyLjU1bDIuOC01aDQuMDVMOS42IDE0SDIuNVY5aDEwLjIzbDUuNTUtNS44NmwxLjMyIDMuMTRjLjE4LjQzLjA0Ljk1LS4zMyAxLjI4eiIvPjwvc3ZnPg==', color: colors[3] },
            { letter: 'ج', word: 'جمل', image: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0iI2ZmZmZmZiI+PHBhdGggZD0iTTUgMTVoMXYtNGgtMVY5aDFWN2gtMXYtMmgydjJoMVY3aDFWNmgxLjVWNWgxLjVWNEg5LjVWNWgtMS41VjRoMVYySDl2Mkg3djJoMVY5aDF2Mkg3djRoMVY5aDF2NEg3djJINHptNCAxLjJWNEg3djJoMVY3aDFWN2gxLjVWNmgyVjdoMVY5aDF2Mi4yTDE3IDEzLjVWOWgtMnYySDFWN2gydjRoMnYySDFWMTRoMTB2MWgtM3YxaDF2LTFoMnYtMWgydjEuNzVsMS4yNSAyLjVIMjF2Mmgxdi0yaDF2LTJ6bS0yLTIuNThsLTIuOC0zLjM2VjhoMXYyLjYybDIuMiAyLjY0TDE3IDExLjVoMVYxM2gtMXYtMi4yNkwxMyAxMy41eiIvPjwvc3ZnPg==', color: colors[4] },
            { letter: 'ح', word: 'حصان', image: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0iI2ZmZmZmZiI+PHBhdGggZD0iTTEzIDNoMnY1aDJWN2gyVjVoMnY3aC0ydjJoLTRWMTRoLTF2LTZoLTF2MWgtMXYySDEzdi0xaC0xdi0yaC0xdi0yaDJ6bS04IDNoNHYySDVWNmEzIDMgMCAwIDAgMy0zaDN2Mkg4YTMgMyAwIDAgMCAwIDZ6bTIgOXYtMmgxdjJIMTB2LTFoLTF2LTFoLTFWOWgxdjFoMVY5aDF2NWgtMXYxaC0xdjFoMXYySDh2LTFoMVY5SDd2MWgxdjVoMXYxaDF2LTJoMXYtMWgtMXYtMmgxdjJIMTJ6bS01IDRoNnYtMkg1djJ6Ii8+PC9zdmc+', color: colors[5] },
            { letter: 'خ', word: 'خروف', image: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0iI2ZmZmZmZiI+PHBhdGggZD0iTTIgN2gxOHYyaDJWN2MwLTEuMS0uOS0yLTItMkg0Yy0xLjEgMC0yIC45LTIgMnYxNGgyVjd6bTEgN2gxNnYtMmgtNnYtMmg1djJoNnYyaC02djJoLTUtMi0yLTJWMTVoMnYtMmgxMHYtMkg0di0yaDJ2MmgydjJoMnYtMmg1di0yaDJ2MmgtMnYyaDF2MmgtMnYtMmgxdi0yaC0xdjJoLTR2LTJoLTR2M2gyem0xMSAyaDF2LTJoLTF2MnptLTIgMGgxdjJoLTF2LTJ6bS0yIDBoMnYtMmgtMnYyek04IDE4aDF2MmgtMXYtMnptMyAwaDF2LTJoLTF2MnptLTYgMGgxdjJoLTF2LTJ6bTEuNS0zLjVjMC0uNTUtLjQ1LTEtMS0xcy0xIC40NS0xIDEgLjQ1IDEgMSAxIDEgLjQ1IDEtMXoiLz48L3N2Zz4=', color: colors[6] },
            { letter: 'د', word: 'ديك', image: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0iI2ZmZmZmZiI+PHBhdGggZD0iTTIgOGg0djJIMnYyaDJ2MmgyVjZoLTJ2LTJoLTJ2Mkg0djJoMnYtMkg0djJ6bTYgMmgydjJoLTJ2LTJ6bTktMTBoLTN2M2gtMnYySDl2Mkg4djJIMTB2Mmgxdi0yaDF2MmgxdjJIMTV2MmgxdjJIMTh2Mmgzdi00aC0yVjBoLTJ2MmgxVjB6bS0yIDRoLTFWM2gxVjRIMTN2MWgtMVYzaDFWMmgtMXYxaDFWMGgtMnYxMGgydi0yaDFWOGgxdjJIMTV2MmgxdjJoMXYtMmgtMVY4aDFWNmgxVjRoLTF6bS0yIDNoLTFWMWgxdjZ6Ii8+PC9zdmc+', color: colors[7] },
            { letter: 'ذ', word: 'ذئب', image: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0iI2ZmZmZmZiI+PHBhdGggZD0iTTE2LjA5IDEzLjA5TDkuMjIgNi4yMmMtLjM5LS4zOS0xLjAyLS4zOS0xLjQxIDBsLTUuNjYgNS42NmMtLjM5LjM5LS4zOSAxLjAyIDAgMS40MWw1LjY2IDUuNjZjLjM5LjM5IDEuMDIuMzkgMS40MSAwbDMuODktMy44OSAxLjA2IDEuMDZMMjIgMy4xNCAxNi4wOSAxMy4wOXpNNi41IDEzYy0uODMgMC0xLjUtLjY3LTEuNS0xLjVzLjY3LTEuNSAxLjUtMS41IDEuNS42NyAxLjUgMS41LS42NyAxLjUtMS41IDEuNXoiLz48L3N2Zz4=', color: colors[8] },
            { letter: 'ر', word: 'رمان', image: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0iI2ZmZmZmZiI+PHBhdGggZD0iTTEyIDJDNi40OCAyIDIgNi40OCAyIDEyczQuNDggMTAgMTAgMTAgMTAtNC40OCAxMC0xMFMyNy41MiAyIDEyIDJ6bTAgMThjLTQuNDIgMC04LTMuNTgtOC04czMuNTgtOCA4LTggOCAzLjU4IDggOC0zLjU4IDgtOCA4em0tMS00aDIvMS41SDk2Ljg5QzcuNzMgMTQuOTMgOC4zIDEzLjU4IDguMyAxMmMwLTEuMzQtLjQ0LTIuNTUtMS4xNy0zLjUuNDUtLjMtLjk3LS41IDEuNDItLjVoM2MuNTYgMCAxLjA4LjI0IDEuNDQuNjRsLjM3LS4xOWMuMzgtLjE5LjgxLS4xNSAxLjE0LjA5bC4zNC4yN2MuMi4xNi4zMi4zOC4zNC42M3Y0LjA2eiIvPjwvc3ZnPg==', color: colors[9] },
            { letter: 'ز', word: 'زرافة', image: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0iI2ZmZmZmZiI+PHBhdGggZD0iTTIyIDN2MmgtdjJoLTF2Mkg2VjdoLTJ2MkgzVjZoLTJWM2gydjJoMVYzaDJ2MmgzVjVIMTBWNEgxMVYzaDFWMkg5djJoM3YxaDFWMmgxVjBoMnYxMGgyVjhoMlY1aDFWM2gyem0tOCAwaC0xVjJoMXYxem0tNiAwaC0xVjFoMXYyem0xMyAxMHYtMmgxdjJoLTF6bS0yIDBoLTF2LTJoMXYyem0tMiAwaC0xdjJoMXYtMnptLTIgMGgtMXYtMmgydjJoLTF6bS0xIDNoLTF2LTFoMXYxem0tMiAwaC0xdjJoMXYtMnptMyAwaDF2LTJoLTF2MnptLTYgMGgtMXYtMmgydjJoLTF6bS0yIDBoLTF2LTJoMXYyeiIvPjwvc3ZnPg==', color: colors[10] },
            { letter: 'س', word: 'سمكة', image: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0iI2ZmZmZmZiI+PHBhdGggZD0iTTMgMTNoMmMwIDEuNjYgMS4zNCAzIDMgM2gtMWMtMS4xMSAwLTItLjg5LTItMmMwLS41NS0uNDUtMS0xLTFoLTF2LTJoMXptNC04YzEuNDIgMCAyLjcgMS4wMyAzLjQyIDIuNDJDNy40MSAxMC40MSA0IDcgMyA3SDJjMC0yLjc2IDIuMjQtNSA1LTNoMXYxYzAgLjU1LjQ1IDEgMSAxczEtLjQ1IDEtMVY2aDF2MWgxVjZoMXYxYzAgLjU1LjQ1IDEgMSAxczEtLjQ1IDEtMVY1aDFjMS42NiAwIDMgMS4zNCAzIDNzLTEuMzQgMy0zIDNoLTljLTEuMTYgMC0yLjItLjY1LTIuNzQtMS41OEwzIDEwLjAzVjEzSDJ2LTQuMzdMMi4zMiA4bC4xOC0uNDJjLjQ0LS45OCAxLjQxLTEuNTggMi41LTEuNThoMXYtMmgxdi0xaDJ2MWgxdjJoLTN6bTE1LTEuNWgxLjVjLjgyIDAgMS41LjY3IDEuNSAxLjVzLS42OCAxLjUtMS41IDEuNUgxN3YtM3ptLTItM2gxLjVjLjgyIDAgMS41LjY3IDEuNSAxLjVzLS42OCAxLjUtMS41IDEuNUgxNXYtM3ptMiAxMGgtLjVjLS4yOCAwLS41LjIyLS41LjVzLjIyLjUuNS41aDEuNWMxLjM4IDAgMi41LTEuMTIgMi41LTIuNVMyMC4zOCAxNiAxOSAxNmgtejIiLz48L3N2Zz4=', color: colors[11] },
            { letter: 'ش', word: 'شمس', image: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0iI2ZmZmZmZiI+PHBhdGggZD0iTTEyIDdjLTIuNzYgMC01IDIuMjQtNSA1czIuMjQgNSA1IDUgNS0yLjI0IDUtNS0yLjI0LTUtNS01em0wIDhjLTEuNjYgMC0zLTEuMzQtMy0zczEuMzQtMyAzLTMgMyAxLjM0IDMgMy0xLjM0IDMtMyAzem0tMSA5aDJ2M2gtMnYtM3ptLTguODMtMS4xN2wxLjQxLTEuNDEgMS40MSAxLjQxLTEuNDEgMS40MS0xLjQxLTEuNDF6TTQgMTFoM3YySDR2LTJ6bTEuMTctOC44M2wxLjQxIDEuNDEgMS40MS0xLjQxLTEuNDEtMS40MS0xLjQxIDEuNDF6bTcuNjYtMi4xN2gxLjA2djMuNTJoLTMuMDZ2LTEuNTNoMi41OHYtMi42NWgtLjU4VjQuOTlsLS40Mi4wMnoiLz48L3N2Zz4=', color: colors[12] },
            { letter: 'ص', word: 'صاروخ', image: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0iI2ZmZmZmZiI+PHBhdGggZD0iTTExLjM4IDEyLjYzTDEwIDEyLjIyVjEwLjVsNi01LTQgOWgtMS43M2wtMS4zNy0zLjQ1TDEzIDEyLjA1bC0yLjA3LS4xOWMuMTcgMS4xNi4zNSAyLjMxLjU0IDMuNDRsMS41OS0uNjMgMi4wNCA1LjExLTYuMy0xLjg5LjU4LTEuOTEtMy41MS0uNTktLjY4IDEuNzFMMi4wNCAxNmwxLjgyLTYuMDMgNC44NiAyLjAzLTEuNTIgMS41MnptLTUuMzYgNC4zNWMyLjggMCA1LjA4LTEuMTQgNi43NS0yLjk4bDEuMDYtMS4wNi0xLjQxLTEuNDFMMTEuMyAxMy42NGMtMS41MyAxLjU0LTMuNDMgMi41OC01LjU4IDIuNzNsLS4wMyAwek0yMiAybC0zIDNoLTJsMi0yLTIgMi0yLTItMiAyLTIgMmMwIDEuMS45IDIgMiAyaDJ2Mmgzdi00aDJWMnpNMTAuNSAxOGMtLjgyIDAtMS41LS42Ny0xLjUtMS41cy42OC0xLjUgMS41LTEuNSAxLjUuNjcgMS41IDEuNS0uNjcgMS41LTEuNSAxLjV6Ii8+PC9zdmc+', color: colors[13] },
            { letter: 'ض', word: 'ضفدع', image: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0iI2ZmZmZmZiI+PHBhdGggZD0iTTEyIDJDNi40OCAyIDIgNi40OCAyIDEyczQuNDggMTAgMTAgMTAgMTAtNC40OCAxMC0xMFMyNy41MiAyIDEyIDJ6bTQtNmMyLjIyIDAgNCAxLjc4IDQgNHMtMS43OCA0LTQgNC00LTEuNzgtNC00IDEuNzgtNCA0LTR6bS04IDBjMi4yMiAwIDQgMS43OCA0IDRzLTEuNzggNC00IDQtNC0xLjc4LTQtNCAxLjc4LTQgNC00em00IDE0Yy0yLjM5IDAtNC40NS0xLjYyLTUuMTYtMy44M0wxMiAxMy40bDEuNDEgMS40MWMuMzkuMzkgMS4wMS4zOSAxLjQgMGwyLjEzLTIuMTNjLjM5LS4zOS4zOS0xLjAxIDAtMS40bC0yLjEzLTIuMTNjLS4yLS4yLS40NS0uMy0uNzEtLjNsLTEuNDEgMS40MUw2Ljg0IDguMTdDNC41NSAxMC40NSA0LjU1IDIzLjEgNi44NCAxNS40NWMxLjQxIDEuNDEgMy4zIDEuNTkgNC45Ni40NUwxMC40IDE0bDIuNTUgMi41NWMxLjE3IDEuMTcgMy4wNyAxLjE3IDQuMjQgMGwxLjQxLTEuNDFDMTMuOTcgMTYuMTMgMTMuMDYgMTggMTIgMTh6Ii8+PC9zdmc+', color: colors[0] },
            { letter: 'ط', word: 'طائرة', image: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0iI2ZmZmZmZiI+PHBhdGggZD0iTTIxIDE2djRoLTd2LTRoN3ptLTIgMmgtM3YtMmgydjFjMCAuNTUuNDUgMSAxIDEgMCAuNTUtLjQ1IDEtMS0xaDF2LTFoMnYyem0xLTEyaC0xdjJIMjB2LTJ6bS04LTJoLTF2LTJoMnYyaC0xek0xMSAySDEwVjBoMnYyaC0xem02IDBoLTFWMGgydjJoLTF6bS0yIDJoLTJ2Mmgydi0yem0tNCAwSDl2Mmgydi0yem0tNCAwSDV2Mmgydi0yem0zIDRoMnYyaC0ydjZIMTBWMTBoMXptLTQgNkg1VjhoMlY3SDZWNWgyVjRIN1YyaDJ2Nkg4djFoMXptNCA2aDJ2MmgtMlY4aDF2MmgtMXY2eiIvPjwvc3ZnPg==', color: colors[1] },
            { letter: 'ظ', word: 'ظرف', image: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0iI2ZmZmZmZiI+PHBhdGggZD0iTTIwIDRIMkMuOSAxIDQgMS45IDQgM3YxNGMwIDEuMS45IDIgMiAyaDE2YzEuMSAwIDItLjkgMi0yVjZjMC0xLjEtLjktMi0yLTJ6bTAgMTZIMlY4bDEwIDcgMTAgNy0xMC03VjZoMTAgNi4wMWwxMC02VjIwTDEyIDEzIDIgMjB6TTQgNmgydjJIMjBsLTggNC45OUwyMCA2aC0xNnYxMmg4LjVsOC01LjQ5VjhIMjB6Ii8+PC9zdmc+', color: colors[2] },
            { letter: 'ع', word: 'عصفور', image: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0iI2ZmZmZmZiI+PHBhdGggZD0iTTE2LjgzIDEyLjE3bC0uNDIuNDItNC4xMy00LjE0IDIuNDctMi40N2MtLjY5LS4yMS0xLjQyLS4zMy0yLjE4LS4zMy0zLjAzIDAtNS41MyAyLjA1LTUuNTYgNC41OS0uMDMgMy4wOSA0LjQzIDUuNzggNi44NyA3LjgybDEuNDYgMS40NmMuMzMuMzMgLjg3LjMzIDEuMiAwbDEuNDYtMS40NmMxLjU3LTEuNTcgMy4yMS0zLjIgMy4yMS00LjkyIDAtLjc2LS4xMi0xLjQ5LS4zMy0yLjE4bC0yLjQ3IDIuNDd6TTIgMTJoMi4yNWMtLjE2LjQ4LS4yNiAxLS4yNiAxLjU0IDAgMi4zNCAxLjgxIDQuMjggNC4xIDQuNTdsLTEuMzYgMS4zNmMtLjM5LjM5LS4zOSAxLjAyIDAgMS40MWwxLjQxIDEuNDFjLjM5LjM5IDEuMDIuMzkgMS40MSAwbDEuMzYtMS4zNmMuMy4yOC42My41NCAxIC43N1YyMmgydi0yLjAzYzEuNTktLjU0IDIuNzUtMi4xMyAyLjc1LTMuOTcgMC0uNDYtLjA2LS45LS4xNy0xLjMxbDIuNDItMi40MmMuNjIuNDYgMS4zNC43NSAyLjEzLjc1IDIuNzUgMCA1LTIuMjUgNS01czAtNSAwLTUgNSAyLjI1IDUgNS0yLjI1IDUtNSA1eiIvPjwvc3ZnPg==', color: colors[3] },
            { letter: 'غ', word: 'غزال', image: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0iI2ZmZmZmZiI+PHBhdGggZD0iTTEyIDJjLTEuMSAwLTIgLjktMiAyaDF2MmgxVjRIMTR2MmgxVjRoMVYySDEyek01IDRsMiAyaDJ2NEg3djJoMnYySDdWMTJINHptMi0xYzAtLjU1LS40NS0xLTEtMXMtMSAuNDUtMSAxIC40NSAxIDEgMSAxLS40NSAxLTF6bTEwIDBjLTEuMSAwLTIgLjktMiAyaDF2MmgtMXYyYzAgMS4xLS45IDItMiAyaC0xdi0yaDF2LTJoLTF2LTJjMC0xLjEtLjktMi0yLTJoLTN2MmMwIDEuMS45IDIgMiAyaDF2M2gtMnYtM2gtMXYzaDF2MmgtMXYtMmgxdi0yaDF2Mmgydi0yaDF2LTJjMS4xIDAgMi0uOSAyLTJoLTJjMC0xLjEtLjktMi0yLTJ6Ii8+PC9zdmc+', color: colors[4] },
            { letter: 'ف', word: 'فيل', image: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0iI2ZmZmZmZiI+PHBhdGggZD0iTTIgNmgxOHYyaDFWNmMwLTEuMS0uOS0yLTItMkg0Yy0xLjEgMC0yIC45LTIgMnYxNGgyVjZ6bTEgOWgxNnYtMmgtNnYtMmg1djJoNnYyaC02djJoLTUtMi0yLTJWMTVoMnYtMmgxMHYtMkg0di0yaDJ2MmgydjJoMnYtMmg1di0yaDJ2MmgtMnYyaDF2MmgtMnYtMmgxdi0yaC0xdjJoLTR2LTJoLTR2M2gyem0xMSAyaDF2LTJoLTF2MnptLTIgMGgxdjJoLTF2LTJ6bS0yIDBoMnYtMmgtMnYyek04IDE4aDF2MmgtMXYtMnptMyAwaDF2LTJoLTF2MnptLTYgMGgxdjJoLTF2LTJ6bTEuNS0zLjVjMC0uNTUtLjQ1LTEtMS0xcy0xIC40NS0xIDEgLjQ1IDEgMSAxIDEgLjQ1IDEtMXoiLz48L3N2Zz4=', color: colors[5] },
            { letter: 'ق', word: 'قمر', image: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0iI2ZmZmZmZiI+PHBhdGggZD0iTTMgMTJoMmMwIDEuNjYgMS4zNCAzIDMgM2gtMWMtMS4xMSAwLTItLjg5LTItMmMwLS41NS0uNDUtMS0xLTFoLTF2LTJoMXptNC04YzEuNDIgMCAyLjcgMS4wMyAzLjQyIDIuNDJDNy40MSAxMC40MSA0IDcgMyA3SDJjMC0yLjc2IDIuMjQtNSA1LTNoMXYxYzAgLjU1LjQ1IDEgMSAxczEtLjQ1IDEtMVY2aDF2MWgxVjZoMXYxYzAgLjU1LjQ1IDEgMSAxczEtLjQ1IDEtMVY1aDFjMS42NiAwIDMgMS4zNCAzIDNzLTEuMzQgMy0zIDNoLTljLTEuMTYgMC0yLjItLjY1LTIuNzQtMS41OEwzIDEwLjAzVjEzSDJ2LTQuMzdMMi4zMiA4bC4xOC0uNDJjLjQ0LS45OCAxLjQxLTEuNTggMi41LTEuNThoMXYtMmgxdi0xaDJ2MWgxdjJoLTN6bTE1LTEuNWgxLjVjLjgyIDAgMS41LjY3IDEuNSAxLjVzLS42OCAxLjUtMS41IDEuNUgxN3YtM3ptLTItM2gxLjVjLjgyIDAgMS41LjY3IDEuNSAxLjVzLS42OCAxLjUtMS41IDEuNUgxNXYtM3ptMiAxMGgtLjVjLS4yOCAwLS41LjIyLS41LjVzLjIyLjUuNS41aDEuNWMxLjM4IDAgMi41LTEuMTIgMi41LTIuNVMyMC4zOCAxNiAxOSAxNmgtejIiLz48L3N2Zz4=', color: colors[6] },
            { letter: 'ك', word: 'كلب', image: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0iI2ZmZmZmZiI+PHBhdGggZD0iTTUgNWgxMmwtMSAyaC0xLjY3QzE1LjIgOC4xMiAxNi4xNiA5IDE3LjMzIDEwLjMzbDIuNDItMi40MiAxLjQxIDEuNDFMMTkgMTAuNzV2MTEuNWgtMnYtNmgtNnY2SDl2LTZIN3Y2SDVWMTAuNzVsLTEuNjUtMS42NSAxLjQxLTEuNDFMMjIgMTJ2LTEuNWwtMS0ySDlWNUg1em0xMyA3YzAtMi43Ni0yLjI0LTUtNS01cy01IDIuMjQtNSA1aDEwek0xMCAxMmMxLjY2IDAgMy0xLjM0IDMtM2gtNmMwIDEuNjYgMS4zNCAzIDMgM3oiLz48L3N2Zz4=', color: colors[7] },
            { letter: 'ل', word: 'ليمون', image: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0iI2ZmZmZmZiI+PHBhdGggZD0iTTExLjkyIDIyYy01LjQ4IDAtOS45Mi00LjQ0LTkuOTItOS45MiAwLTUuNDcgNC40NC05LjkyIDkuOTItOS45MiA1LjQ3IDAgOS45MiA0LjQ0IDkuOTIgOS45MiAwIDUuNDctNC40NSA5LjkyLTkuOTIgOS45MnptMC0xOGMtNC4zNyAwLTcuOTIgMy41NS03LjkyIDcuOTJzMy41NSA3LjkyIDcuOTIgNy45MiA3LjkyLTMuNTUgNy45Mi03LjkyLTMuNTUtNy45Mi03LjkyLTcuOTJ6bS0uNDcgMS45NWMtLjIgMC0uMzguMS0uNDkuMjlsLTQuMDYgNS40MWMtLjI3LjM2LS4yMy44OC4wOSAxLjE4bDIuMiAyLjI3Yy4xNS4xNS4zNS4yMy41NS4yM2MuMjcgMCAuNTMtLjE0LjY5LS4zOWwxLjc5LTMuMzZjLjEyLS4yMy4zNy0uMzUuNjEtLjI4bDIuMTIuNWMuMjYuMDYuNDQuMjguNDQuNTV2Mi4zMmMwIC4yOS4yNC41My41My41M2gxLjA2YzIuNzQtMi4xNCA0LjQyLTUuNCA0LjQyLTkuMDYgMC0uNDQtLjE1LS44NC0uNDEtMS4xN3oiLz48L3N2Zz4=', color: colors[8] },
            { letter: 'م', word: 'موز', image: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0iI2ZmZmZmZiI+PHBhdGggZD0iTTE2IDRjMS4xMSAwIDIuODMuNzEgNC4xMSAySDExYy0uMzIgMC0uNjIuMDgtLjg5LjIxQzEwLjYxIDQuODggMTIgMy41IDEyIDJIMTZtMy41IDljLjgyIDAgMS41LjY3IDEuNSAxLjVzLS42NyAxLjUtMS41IDEuNS0xLjUtLjY3LTEuNS0xLjNS42Ny0xLjUgMS41LTEuNXptLTggMGMuODIgMCAxLjUuNjcgMS41IDEuNVMxMi4zMyAxNSAxMS41IDE1cy0xLjUtLjY3LTEuNS0xLjUuNjctMS41IDEuNS0xLjV6bTQuNSA0YzMuMzEgMCA2LTIuNjkgNi02cy0yLjY5LTYtNi02aC00Yy0uNjYgMC0xLjI4LjE3LTEuODIuNDVDNC42NyA3LjQ4IDIgOS42NCAyLjAyIDE0YzAgMS4yLjM3IDIuMjggMSAzLjAyVjIwgaDE2di0yLjk4Yy42MS0uNzMuOTgtMS44IDEtMi45MiAwLTMuMzEtMi42OS02LTYtNmgtek0xMiAyMmMtMS4xMSAwLTItLjg5LTItMnMtLjg5LTItMi0yIDAtLjg5IDAtMi0uODktMi0yLTJjLS40MSAwLS43OS4xMy0xLjEuMzVWMjJMMTIgMjJ6bTQtMWMwIC41NS0uNDUgMS0xIDEuNDUtLjAzLjAyLS4wNS4wNC0uMDguMDVoLTUuODNjLS4wMyAwLS4wNi0uMDMtLjA4LS4wNUM3LjUxIDE5LjE0IDYgMTcuNzMgNiAxNmgyYzAgMS4zMy42NyAyLjUgMS45MSAzLjExbDEuMjEtMS4yMmMuMjctLjI3LjcxLS4yNy45OCAwbDEuMjEgMS4yMmMxLjI0LS42MSAxLjg5LTEuNzggMS44OS0zLjExaDJjMCAxLjczLTEuNTEgMy4xNC0zLjQxIDMuNDV6Ii8+PC9zdmc+', color: colors[9] },
            { letter: 'ن', word: 'نجمة', image: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0iI2ZmZmZmZiI+PHBhdGggZD0iTTEyIDE3LjI3TDE4LjE4IDIxbC0xLjY0LTcuMDNMMjIgOS4yNGwtNy4xOS0uNjFMMTIgMiA5LjE5IDguNjMgMiA5LjI0bDUuNDYgNC43M0w1LjgyIDIxeiIvPjwvc3ZnPg==', color: colors[10] },
            { letter: 'هـ', word: 'هدهد', image: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0iI2ZmZmZmZiI+PHBhdGggZD0iTTEzIDNoMnY1aDJWN2gyVjVoMnY3aC0ydjJoLTRWMTRoLTF2LTZoLTF2MWgtMXYySDEzdi0xaC0xdi0yaC0xdi0yaDJ6bS04IDNoNHYySDVWNmE0IDQgMCAwIDEgNC00aDR2Mkg5YTQgNCAwIDAgMCAwIDh6bTIgOXYtMmgxdjJIMTB2LTFoLTF2LTFoLTFWOWgxdjFoMVY5aDF2NWgtMXYxaC0xdjFoMXYySDh2LTFoMVY5SDd2MWgxdjVoMXYxaDF2LTJoMXYtMWgtMXYtMmgxdjJIMTJ6bS01IDRoNnYtMkg1djJ6Ii8+PC9zdmc+', color: colors[11] },
            { letter: 'و', word: 'وردة', image: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0iI2ZmZmZmZiI+PHBhdGggZD0iTTggN2MxLjU5IDAgMy4wMS44MSA0IDNsMSA0LjUgMS00LjVjLjk5LTIuMTkgMy40MS0zIDQtMyAxLjg5IDAgMy40MiAxLjU4IDMuNDIgMy41IDAgMy4yNy0zLjA0IDYuMTUtNy40MiAxMGwtNi41OC02LjU4QzMgMTMuMDQgMiAxMC4yNyAyIDguNCAyIDYuNjMgMy41OCA1IDUuNDUgNWMxLjA3IDAgMi4wOC41IDMuMTIgMS4yNy4yLS4xNy40My0uMy42Ny0uMzd6Ii8+PC9zdmc+', color: colors[12] },
            { letter: 'ي', word: 'يد', image: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0iI2ZmZmZmZiI+PHBhdGggZD0iTTEwLjUgOGgtMmMtMS4zOSAwLTIuNSAxLjExLTIuNSAyLjVWMjFoMy41di03aDF2N2gydi04YzAtMS4zOS0xLjExLTIuNS0yLjUtMi41ek0yMiAxMS41YzAgMi4xNS0xLjI1IDQtMy4yNCA0Ljc5bDEuNDYgMS40NmMuMjkuMjkuMjkgLjc3IDAgMS4wNmwtMS40MSAxLjQxYy0uMjkuMjktLjc3LjI5LTEuMDYgMGwtMS40Ni0xLjQ2QzE1LjUgMTkuNzUgMTMuNjUgMjEgMTEuNSAyMWgtNmMtMy4wMyAwLTUuNS0yLjQ3LTUuNS01LjVTMy40NyAxMC41IDYuNSAxMC41aDQuNThjLjYxLS42MSAxLjQtMS4wOCAyLjMyLTEuNDJWN2MwLTEuMS45LTItMi0yaDFWM2gtMVYySDl2MWgtMXYzaDJ2MWgtMmMtMS4xIDAtMiAuOS0yIDJoMXYxaDFWMTEuNThjLjY4LS4yNyAxLjQ0LS40MiAyLjItLjQyaC4zMnptLTYuNDMgMTBjLS4wNC4wMy0uMDkuMDUtLjE0LjA1TDkuNTIgMTMuNDFjLjM1LS4zNS44Mi0uNTYgMS4zMy0uNTZoLjQ4Yy4xMy0uMjYuMjktLjQ5LjQ2LS43MmgxLjQ1bC4wMS0uMDFjLjM1LS41LjgzLS45IDEuMzQtMS4xN3oiLz48L3N2Zz4=', color: colors[13] },
        ],
        englishAlphabetData: [
            { letter: 'A', word: 'Apple', image: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0iI2ZmZmZmZiI+PHBhdGggZD0iTTE5IDExYy0xLjY2IDAtMyAxLjM0LTMgM3YxYy0xLjUgMS42Ny0zLjcxIDIuNjctNS45MiAyLjkzYy0uMzEtMi4xOC0xLjY0LTMuOTYtMy4zMy01LjEyYy0xLjQ0LS45OC0zLjE5LTEuMzItNC43NS0xLjA3QzEuMiAxMi4yNy4yIDEzLjc5LjIgMTUuNUMuMiAxNy40MyAxLjcyIDE5IDMuNjUgMTloMTQuN2MxLjktMCAzLjUtMS41NyAzLjUtMy41YzAtMS43My0xLjI3LTMuMTYtMi45Mi0zLjQxQzE4LjUgMTIuMDEgMTggMTEuNTMgMTggMTFjMC0xLjY2LTEuMzQtMy0zLTNzLTMgMS4zNC0zIDNoM2MxLjEgMCAyIC45IDIgMnYxLjVjMCAuMjgtLjIyLjUtLjUuNVMxNyAxNi4yOCAxNyAxNnYtMWMwLTEuMS0uOS0yLTItMnpNMTIuMDcgMy44OWMyLjA1Ljg3IDIuMzEgMy4zNS43MyA0LjkzYy0xLjU4IDEuNTgtNC4wNiAxLjMyLTQuOTMtLjczUzUuNTYgNC4wMyA3LjE0IDIuNDVzNC4wNS0uNzMgNC45MyAxLjQ0eiIvPjwvc3ZnPg==', color: colors[0] },
            { letter: 'B', word: 'Ball', image: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0iI2ZmZmZmZiI+PHBhdGggZD0iTTIwLjI3IDEwLjI2Yy0uMTItLjM1LS40My0uNTktLjc5LS41OWgtMS45NWMtLjAxLTQuNDMtMy42OC03Ljk5LTguMTctNy45OUgzLjY1Yy0uNDEgMC0uNzcuMjctLjkuNjZsLTEuNDIgOC4yNmMtLjA0LjIzLjA2LjQ3LjI4LjU5bDMuOTIgMi4xOWMtLjEzLjQyLS4yLjguMiAxLjIxdi4wMWMwIC4yMy4wMy40NS4wOC42NmwtMy4wMyAzLjQzYy0uMjIuMjUtLjI4LjYxLS4xNS45MmwzLjI0IDguMDNjLjEyLjMyLjQyLjU0Ljc2LjU0aDEuNzVjLjM0IDAgLjY0LS4yMi43Ni0uNTRsMy4yNC04LjAzYy4xMy0uMzEuMDctLjY3LS4xNS0uOTJsLTMuMDMtMy40M2MuMDUtLjIxLjA4LS40My4wOC0uNjZ2LS4wMWMwLS40MS0uMDctLjgxLS4yLTEuMjFsMy45Mi0yLjE5Yy4yMi0uMTIuMzItLjM2LjI4LS41OWwtLjUtMi45OGMxLjU2LjQ5IDMuMjMuNzggNS4wMS44NGMxLjU3LjA1IDMuMDktLjIgNC40Ny0uNzJsLjc0IDQuMzRjLjA0LjIzLjIyLjQxLjQ1LjQxaDEuOTVjLjM2IDAgLjY3LS4yNC43OS0uNTlsMS4xNy0zLjM4Yy4xLS4zLjA2LS42NS0uMS0uOTJ6Ii8+PC9zdmc+', color: colors[1] },
            { letter: 'C', word: 'Cat', image: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0iI2ZmZmZmZiI+PHBhdGggZD0iTTEyIDJjLTEuMSAwLTIgLjktMiAyaDMuNUwyMCA5LjI1VjZhMiAyIDAgMCAwLTIuMDMtMS44N0wxMy41IDJINnpNNy4yNSAySDQuNUMzLjEyIDIgMiAzLjEyIDIgNC41VjUuNUMxMC42NyA1LjUgMTAgMTEgNi41IDEzLjVDNi4yMiAxMy41IDYgMTMuNzIgNiAxNFYxNWMwIC4yOC4yMi41LjUuNWgyLjM1Yy4yMSAwIC40MS0uMTIuNDgtLjMybDEuNTQtMy44NGMuMDYtLjE2LS4wNy0uMzQtLjI0LS4zNGgtMS4wN2MyLjUtMS43NCAxLjYtNS4xNSAxLjA4LTcuMzdsLS4wOS0uMzljLS4xLS4yOS0uNDgtLjM5LS43Mi0uMmwtMS4xMS44My0xLjEyLTQuMDZ6bS0xLjUgMTJjLTEuMSAwLTIgLjktMiAydjQuNWgyVjE2aDQuNXYtMkg1LjM5bC4zNC0uNzVDNi40MSAxNC4yMSA3LjUgMTQgOC43NSAxNGgtMy41ek0xMiAxMmMtMS45MyAwLTMuNSAxLjU3LTMuNSAzLjVTMTAuMDcgMTkgMTIgMTlzMy41LTEuNTcgMy41LTMuNVMxMy45MyAxMiAxMiAxMnptOCA4djJoMnYtMmMwLTEuMS0uOS0yLTItMmgtdjJoMXptMC00di0yaC0xYzAgMS4xLS45IDItMiAyaC0ydi0yaC0yYzAgMS4xLS45IDItMiAyaC0xdi0yaC0xYzAgMS4xLS45IDItMiAyaC0ydi0yaC0yYzAtMS4zOCAxLjEyLTIuNSAyLjUtMi41aDFjLjM1IDAgLjY4LS4wOC45Ny0uMjJjLS4zNS0uOC0uNTQtMS42OC0uNTQtMi42M0MxMi45MyAxMS4yMyAxNCA4LjM0IDE0IDQuNUwxMi41IDZsMyA3LjVjLjIzLjU4Ljc5LjkyIDEuNC45MmgxLjZjLjU1IDAgMS0uNDUgMS0xaC0zLjVsMS41LTMuNzUgMiA1LjAxVjE2eiIvPjwvc3ZnPg==', color: colors[2] },
            { letter: 'D', word: 'Dog', image: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0iI2ZmZmZmZiI+PHBhdGggZD0iTTUgNWgxMmwtMSAyaC0xLjY3QzE1LjIgOC4xMiAxNi4xNiA5IDE3LjMzIDEwLjMzbDIuNDItMi40MiAxLjQxIDEuNDFMMTkgMTAuNzV2MTEuNWgtMnYtNmgtNnY2SDl2LTZIN3Y2SDVWMTAuNzVsLTEuNjUtMS42NSAxLjQxLTEuNDFMMjIgMTJ2LTEuNWwtMS0ySDlWNUg1em0xMyA3YzAtMi43Ni0yLjI0LTUtNS01cy01IDIuMjQtNSA1aDEwek0xMCAxMmMxLjY2IDAgMy0xLjM0IDMtM2gtNmMwIDEuNjYgMS4zNCAzIDMgM3oiLz48L3N2Zz4=', color: colors[3] },
            { letter: 'E', word: 'Elephant', image: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0iI2ZmZmZmZiI+PHBhdGggZD0iTTIgNmgxOHYyaDFWNmMwLTEuMS0uOS0yLTItMkg0Yy0xLjEgMC0yIC45LTIgMnYxNGgyVjZ6bTEgOWgxNnYtMmgtNnYtMmg1djJoNnYyaC02djJoLTUtMi0yLTJWMTVoMnYtMmgxMHYtMkg0di0yaDJ2MmgydjJoMnYtMmg1di0yaDJ2MmgtMnYyaDF2MmgtMnYtMmgxdi0yaC0xdjJoLTR2LTJoLTR2M2gyem0xMSAyaDF2LTJoLTF2MnptLTIgMGgxdjJoLTF2LTJ6bS0yIDBoMnYtMmgtMnYyek04IDE4aDF2MmgtMXYtMnptMyAwaDF2LTJoLTF2MnptLTYgMGgxdjJoLTF2LTJ6bTEuNS0zLjVjMC0uNTUtLjQ1LTEtMS0xcy0xIC40NS0xIDEgLjQ1IDEgMSAxIDEgLjQ1IDEtMXoiLz48L3N2Zz4=', color: colors[4] },
            { letter: 'F', word: 'Fish', image: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0iI2ZmZmZmZiI+PHBhdGggZD0iTTMgMTNoMmMwIDEuNjYgMS4zNCAzIDMgM2gtMWMtMS4xMSAwLTItLjg5LTItMmMwLS41NS0uNDUtMS0xLTFoLTF2LTJoMXptNC04YzEuNDIgMCAyLjcgMS4wMyAzLjQyIDIuNDJDNy40MSAxMC40MSA0IDcgMyA3SDJjMC0yLjc2IDIuMjQtNSA1LTNoMXYxYzAgLjU1LjQ1IDEgMSAxczEtLjQ1IDEtMVY2aDF2MWgxVjZoMXYxYzAgLjU1LjQ1IDEgMSAxczEtLjQ1IDEtMVY1aDFjMS42NiAwIDMgMS4zNCAzIDNzLTEuMzQgMy0zIDNoLTljLTEuMTYgMC0yLjItLjY1LTIuNzQtMS41OEwzIDEwLjAzVjEzSDJ2LTQuMzdMMi4zMiA4bC4xOC0uNDJjLjQ0LS45OCAxLjQxLTEuNTggMi41LTEuNThoMXYtMmgxdi0xaDJ2MWgxdjJoLTN6bTE1LTEuNWgxLjVjLjgyIDAgMS41LjY3IDEuNSAxLjVzLS42OCAxLjUtMS41IDEuNUgxN3YtM3ptLTItM2gxLjVjLjgyIDAgMS41LjY3IDEuNSAxLjVzLS42OCAxLjUtMS41IDEuNUgxNXYtM3ptMiAxMGgtLjVjLS4yOCAwLS41LjIyLS41LjVzLjIyLjUuNS41aDEuNWMxLjM4IDAgMi41LTEuMTIgMi41LTIuNVMyMC4zOCAxNiAxOSAxNmgtejIiLz48L3N2Zz4=', color: colors[5] },
            { letter: 'G', word: 'Grapes', image: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0iI2ZmZmZmZiI+PHBhdGggZD0iTTIgMTJoMi4yNWMtLjE2LjQ4LS4yNiAxLS4yNiAxLjU0IDAgMi4zNCAxLjgxIDQuMjggNC4xIDQuNTdsLTEuMzYgMS4zNmMtLjM5LjM5LS4zOSAxLjAyIDAgMS40MWwxLjQxIDEuNDFjLjM5LjM5IDEuMDIuMzkgMS40MSAwbDEuMzYtMS4zNmMuMy4yOC42My41NCAxIC43N1YyMmgydi0yLjAzYzEuNTktLjU0IDIuNzUtMi4xMyAyLjc1LTMuOTcgMC0uNDYtLjA2LS45LS4xNy0xLjMxbDIuNDItMi40MmMuNjIuNDYgMS4zNC43NSAyLjEzLjc1IDIuNzUgMCA1LTIuMjUgNS01czAtNSAwLTUgNSAyLjI1IDUgNS0yLjI1IDUtNSA1eiIvPjwvc3ZnPg==', color: colors[6] },
            { letter: 'H', word: 'Hat', image: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0iI2ZmZmZmZiI+PHBhdGggZD0iTTEzIDNoMnY1aDJWN2gyVjVoMnY3aC0ydjJoLTRWMTRoLTF2LTZoLTF2MWgtMXYySDEzdi0xaC0xdi0yaC0xdi0yaDJ6bS04IDNoNHYySDVWNmE0IDQgMCAwIDEgNC00aDR2Mkg5YTQgNCAwIDAgMCAwIDh6bTIgOXYtMmgxdjJIMTB2LTFoLTF2LTFoLTFWOWgxdjFoMVY5aDF2NWgtMXYxaC0xdjFoMXYySDh2LTFoMVY5SDd2MWgxdjVoMXYxaDF2LTJoMXYtMWgtMXYtMmgxdjJIMTJ6bS01IDRoNnYtMkg1djJ6Ii8+PC9zdmc+', color: colors[7] },
            { letter: 'I', word: 'Igloo', image: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0iI2ZmZmZmZiI+PHBhdGggZD0iTTEyIDJDNi40OCAyIDIgNi40OCAyIDEyczQuNDggMTAgMTAgMTAgMTAtNC40OCAxMC0xMFMyNy41MiAyIDEyIDJ6bTAgMThjLTQuNDIgMC04LTMuNTgtOC04czMuNTgtOCA4LTggOCAzLjU4IDggOC0zLjU4IDgtOCA4em0tMS00aDIvMS41SDk2Ljg5QzcuNzMgMTQuOTMgOC4zIDEzLjU4IDguMyAxMmMwLTEuMzQtLjQ0LTIuNTUtMS4xNy0zLjUuNDUtLjMtLjk3LS41IDEuNDItLjVoM2MuNTYgMCAxLjA4LjI0IDEuNDQuNjRsLjM3LS4xOWMuMzgtLjE5LjgxLS4xNSAxLjE0LjA5bC4zNC4yN2MuMi4xNi4zMi4zOC4zNC42M3Y0LjA2eiIvPjwvc3ZnPg==', color: colors[8] },
            { letter: 'J', word: 'Juice', image: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0iI2ZmZmZmZiI+PHBhdGggZD0iTTIgNmgxOHYyaDFWNmMwLTEuMS0uOS0yLTItMkg0Yy0xLjEgMC0yIC45LTIgMnYxNGgyVjZ6bTEgOWgxNnYtMmgtNnYtMmg1djJoNnYyaC02djJoLTUtMi0yLTJWMTVoMnYtMmgxMHYtMkg0di0yaDJ2MmgydjJoMnYtMmg1di0yaDJ2MmgtMnYyaDF2MmgtMnYtMmgxdi0yaC0xdjJoLTR2LTJoLTR2M2gyem0xMSAyaDF2LTJoLTF2MnptLTIgMGgxdjJoLTF2LTJ6bS0yIDBoMnYtMmgtMnYyek04IDE4aDF2MmgtMXYtMnptMyAwaDF2LTJoLTF2MnptLTYgMGgxdjJoLTF2LTJ6bTEuNS0zLjVjMC0uNTUtLjQ1LTEtMS0xcy0xIC40NS0xIDEgLjQ1IDEgMSAxIDEgLjQ1IDEtMXoiLz48L3N2Zz4=', color: colors[9] },
            { letter: 'K', word: 'Kite', image: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0iI2ZmZmZmZiI+PHBhdGggZD0iTTUgMTRoMnYtMkg1djJoM3YtMkg1djJoMnYtMmgtMnYtMmgydjJoMnYtMmgydjJoMnYtMmgydjJoMnYtMmgydjJoMnYtMmgydjJoMnYtMmgydjJoMnYtMmgydjJoMnYtMmgydjJoMnYtMmgydjJoMnYtMmgydjJoMnYtMmgydjJoMnYtMmgydjJoMnYtMmgydjJoMnYtMmgydjJoMnYtMmgydjJoMnYtMmg1VjR6Ii8+PC9zdmc+', color: colors[10] },
            { letter: 'L', word: 'Lion', image: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0iI2ZmZmZmZiI+PHBhdGggZD0iTTE2LjA5IDEzLjA5TDkuMjIgNi4yMmMtLjM5LS4zOS0xLjAyLS4zOS0xLjQxIDBsLTUuNjYgNS42NmMtLjM5LjM5LS4zOSAxLjAyIDAgMS40MWw1LjY2IDUuNjZjLjM5LjM5IDEuMDIuMzkgMS40MSAwbDMuODktMy44OSAxLjA2IDEuMDZMMjIgMy4xNCAxNi4wOSAxMy4wOXpNNi41IDEzYy0uODMgMC0xLjUtLjY3LTEuNS0xLjVzLjY3LTEuNSAxLjUtMS41IDEuNS42NyAxLjUgMS41LS42NyAxLjUtMS41IDEuNXoiLz48L3N2Zz4=', color: colors[11] },
            { letter: 'M', word: 'Moon', image: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0iI2ZmZmZmZiI+PHBhdGggZD0iTTcgN2MxLjQyIDAgMi43IDEuMDMgMy40MiAyLjQyQzcuNDEgMTAuNDEgNCA3IDMgN0gyYzAtMi43NiAyLjI0LTUgNS0zaDF2MWMwIC41NS40NSAxIDEgMXMxLS40NSAxLTFWNmgxdjFoMVY2aDF2MWMwIC41NS40NSAxIDEgMXMxLS40NSAxLTFWNWgxYzEuNjYgMCAzIDEuMzQgMyAzcy0xLjM0IDMtMyAzaC05Yy0xLjE2IDAtMi4yLS42NS0yLjc0LTEuNThMMyAxMC4wM1YxM0gydi00LjM3TDIuMzIgOGwuMTgtLjQyYy40NC0uOTggMS40MS0xLjU4IDIuNS0xLjU4aDF2LTJoMXYtMWgydjFoMXYyaC0zek0yMCA1LjVoMS41Yy44MiAwIDEuNS42NyAxLjUgMS41cy0uNjggMS41LTEuNSAxLjVIMjB2LTN6bS0yIDNoMS41Yy44MiAwIDEuNS42NyAxLjUgMS41cy0uNjggMS41LTEuNSAxLjVIMTh2LTN6bTIgMTBoLS41Yy0uMjggMC0uNS4yMi0uNS41cy4yMi41LjUuNWgxLjVjMS4zOCAwIDIuNS0xLjEyIDIuNS0yLjVTMTkuMzggMTYgMTggMTZoLTEuNXoiLz48L3N2Zz4=', color: colors[12] },
            { letter: 'N', word: 'Nest', image: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0iI2ZmZmZmZiI+PHBhdGggZD0iTTEyIDJDNi40OCAyIDIgNi40OCAyIDEyczQuNDggMTAgMTAgMTAgMTAtNC40OCAxMC0xMFMyNy41MiAyIDEyIDJ6bTAgMThjLTQuNDIgMC04LTMuNTgtOC04czMuNTgtOCA4LTggOCAzLjU4IDggOC0zLjU4IDgtOCA4em0tMS00aDIvMS41SDk2Ljg5QzcuNzMgMTQuOTMgOC4zIDEzLjU4IDguMyAxMmMwLTEuMzQtLjQ0LTIuNTUtMS4xNy0zLjUuNDUtLjMtLjk3LS41IDEuNDItLjVoM2MuNTYgMCAxLjA4LjI0IDEuNDQuNjRsLjM3LS4xOWMuMzgtLjE5LjgxLS4xNSAxLjE0LjA5bC4zNC4yN2MuMi4xNi4zMi4zOC4zNC42M3Y0LjA2eiIvPjwvc3ZnPg==', color: colors[13] },
            { letter: 'O', word: 'Orange', image: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0iI2ZmZmZmZiI+PHBhdGggZD0iTTExLjkyIDIyYy01LjQ4IDAtOS45Mi00LjQ0LTkuOTItOS45MiAwLTUuNDcgNC40NC05LjkyIDkuOTItOS45MiA1LjQ3IDAgOS45MiA0LjQ0IDkuOTIgOS45MiAwIDUuNDctNC40NSA5LjkyLTkuOTIgOS45MnptMC0xOGMtNC4zNyAwLTcuOTIgMy41NS03LjkyIDcuOTJzMy41NSA3LjkyIDcuOTIgNy45MiA3LjkyLTMuNTUgNy45Mi03LjkyLTMuNTUtNy45Mi03LjkyLTcuOTJ6bS0uNDcgMS45NWMtLjIgMC0uMzguMS0uNDkuMjlsLTQuMDYgNS40MWMtLjI3LjM2LS4yMy44OC4wOSAxLjE4bDIuMiAyLjI3Yy4xNS4xNS4zNS4yMy41NS4yM2MuMjcgMCAuNTMtLjE0LjY5LS4zOWwxLjc5LTMuMzZjLjEyLS4yMy4zNy0uMzUuNjEtLjI4bDIuMTIuNWMuMjYuMDYuNDQuMjguNDQuNTV2Mi4zMmMwIC4yOS4yNC41My41My41M2gxLjA2YzIuNzQtMi4xNCA0LjQyLTUuNCA0LjQyLTkuMDYgMC0uNDQtLjE1LS44NC0uNDEtMS4xN3oiLz48L3N2Zz4=', color: colors[0] },
            { letter: 'P', word: 'Penguin', image: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0iI2ZmZmZmZiI+PHBhdGggZD0iTTUgMTRoMnYtMkg1djJoM3YtMkg1djJoMnYtMmgtMnYtMmgydjJoMnYtMmgydjJoMnYtMmgydjJoMnYtMmgydjJoMnYtMmgydjJoMnYtMmgydjJoMnYtMmgydjJoMnYtMmgydjJoMnYtMmgydjJoMnYtMmgydjJoMnYtMmg1VjR6Ii8+PC9zdmc+', color: colors[1] },
            { letter: 'Q', word: 'Queen', image: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0iI2ZmZmZmZiI+PHBhdGggZD0iTTEyIDJDNi40OCAyIDIgNi40OCAyIDEyczQuNDggMTAgMTAgMTAgMTAtNC40OCAxMC0xMFMyNy41MiAyIDEyIDJ6bTAgMThjLTQuNDIgMC04LTMuNTgtOC04czMuNTgtOCA4LTggOCAzLjU4IDggOC0zLjU4IDgtOCA4em0tMS00aDIvMS41SDk2Ljg5QzcuNzMgMTQuOTMgOC4zIDEzLjU4IDguMyAxMmMwLTEuMzQtLjQ0LTIuNTUtMS4xNy0zLjUuNDUtLjMtLjk3LS41IDEuNDItLjVoM2MuNTYgMCAxLjA4LjI0IDEuNDQuNjRsLjM3LS4xOWMuMzgtLjE5LjgxLS4xNSAxLjE0LjA5bC4zNC4yN2MuMi4xNi4zMi4zOC4zNC42M3Y0LjA2eiIvPjwvc3ZnPg==', color: colors[2] },
            { letter: 'R', word: 'Rocket', image: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0iI2ZmZmZmZiI+PHBhdGggZD0iTTExLjM4IDEyLjYzTDEwIDEyLjIyVjEwLjVsNi01LTQgOWgtMS43M2wtMS4zNy0zLjQ1TDEzIDEyLjA1bC0yLjA3LS4xOWMuMTcgMS4xNi4zNSAyLjMxLjU0IDMuNDRsMS41OS0uNjMgMi4wNCA1LjExLTYuMy0xLjg5LjU4LTEuOTEtMy41MS0uNTktLjY4IDEuNzFMMi4wNCAxNmwxLjgyLTYuMDMgNC44NiAyLjAzLTEuNTIgMS41MnptLTUuMzYgNC4zNWMyLjggMCA1LjA4LTEuMTQgNi43NS0yLjk4bDEuMDYtMS4wNi0xLjQxLTEuNDFMMTEuMyAxMy42NGMtMS41MyAxLjU0LTMuNDMgMi41OC01LjU4IDIuNzNsLS4wMyAwek0yMiAybC0zIDNoLTJsMi0yLTIgMi0yLTItMiAyLTIgMmMwIDEuMS45IDIgMiAyaDJ2Mmgzdi00aDJWMnpNMTAuNSAxOGMtLjgyIDAtMS41LS42Ny0xLjUtMS41cy42OC0xLjUgMS41LTEuNSAxLjUuNjcgMS41IDEuNS0uNjcgMS41LTEuNSAxLjV6Ii8+PC9zdmc+', color: colors[3] },
            { letter: 'S', word: 'Sun', image: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0iI2ZmZmZmZiI+PHBhdGggZD0iTTEyIDdjLTIuNzYgMC01IDIuMjQtNSA1czIuMjQgNSA1IDUgNS0yLjI0IDUtNS0yLjI0LTUtNS01em0wIDhjLTEuNjYgMC0zLTEuMzQtMy0zczEuMzQtMyAzLTMgMyAxLjM0IDMgMy0xLjM0IDMtMyAzem0tMSA5aDJ2M2gtMnYtM3ptLTguODMtMS4xN2wxLjQxLTEuNDEgMS40MSAxLjQxLTEuNDEgMS40MS0xLjQxLTEuNDF6TTQgMTFoM3YySDR2LTJ6bTEuMTctOC44M2wxLjQxIDEuNDEgMS40MS0xLjQxLTEuNDEtMS40MS0xLjQxIDEuNDF6bTcuNjYtMi4xN2gxLjA2djMuNTJoLTMuMDZ2LTEuNTNoMi41OHYtMi42NWgtLjU4VjQuOTlsLS40Mi4wMnoiLz48L3N2Zz4=', color: colors[4] },
            { letter: 'T', word: 'Tree', image: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0iI2ZmZmZmZiI+PHBhdGggZD0iTTIgN2gxOHYyaDJWN2MwLTEuMS0uOS0yLTItMkg0Yy0xLjEgMC0yIC45LTIgMnYxNGgyVjd6bTEgN2gxNnYtMmgtNnYtMmg1djJoNnYyaC02djJoLTUtMi0yLTJWMTVoMnYtMmgxMHYtMkg0di0yaDJ2MmgydjJoMnYtMmg1di0yaDJ2MmgtMnYyaDF2MmgtMnYtMmgxdi0yaC0xdjJoLTR2LTJoLTR2M2gyem0xMSAyaDF2LTJoLTF2MnptLTIgMGgxdjJoLTF2LTJ6bS0yIDBoMnYtMmgtMnYyek04IDE4aDF2MmgtMXYtMnptMyAwaDF2LTJoLTF2MnptLTYgMGgxdjJoLTF2LTJ6bTEuNS0zLjVjMC0uNTUtLjQ1LTEtMS0xcy0xIC40NS0xIDEgLjQ1IDEgMSAxIDEgLjQ1IDEtMXoiLz48L3N2Zz4=', color: colors[5] },
            { letter: 'U', word: 'Umbrella', image: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0iI2ZmZmZmZiI+PHBhdGggZD0iTTMgMTJoMmMwIDEuNjYgMS4zNCAzIDMgM2gtMWMtMS4xMSAwLTItLjg5LTItMmMwLS41NS0uNDUtMS0xLTFoLTF2LTJoMXptNC04YzEuNDIgMCAyLjcgMS4wMyAzLjQyIDIuNDJDNy40MSAxMC40MSA0IDcgMyA3SDJjMC0yLjc2IDIuMjQtNSA1LTNoMXYxYzAgLjU1LjQ1IDEgMSAxczEtLjQ1IDEtMVY2aDF2MWgxVjZoMXYxYzAgLjU1LjQ1IDEgMSAxczEtLjQ1IDEtMVY1aDFjMS42NiAwIDMgMS4zNCAzIDNzLTEuMzQgMy0zIDNoLTljLTEuMTYgMC0yLjItLjY1LTIuNzQtMS41OEwzIDEwLjAzVjEzSDJ2LTQuMzdMMi4zMiA4bC4xOC0uNDJjLjQ0LS45OCAxLjQxLTEuNTggMi41LTEuNThoMXYtMmgxdi0xaDJ2MWgxdjJoLTN6bTE1LTEuNWgxLjVjLjgyIDAgMS41LjY3IDEuNSAxLjVzLS42OCAxLjUtMS41IDEuNUgxN3YtM3ptLTItM2gxLjVjLjgyIDAgMS41LjY3IDEuNSAxLjVzLS42OCAxLjUtMS41IDEuNUgxNXYtM3ptMiAxMGgtLjVjLS4yOCAwLS41LjIyLS41LjVzLjIyLjUuNS41aDEuNWMxLjM4IDAgMi41LTEuMTIgMi41LTIuNVMyMC4zOCAxNiAxOSAxNmgtejIiLz48L3N2Zz4=', color: colors[6] },
            { letter: 'V', word: 'Violin', image: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0iI2ZmZmZmZiI+PHBhdGggZD0iTTE2LjA5IDEzLjA5TDkuMjIgNi4yMmMtLjM5LS4zOS0xLjAyLS4zOS0xLjQxIDBsLTUuNjYgNS42NmMtLjM5LjM5LS4zOSAxLjAyIDAgMS40MWw1LjY2IDUuNjZjLjM5LjM5IDEuMDIuMzkgMS40MSAwbDMuODktMy44OSAxLjA2IDEuMDZMMjIgMy4xNCAxNi4wOSAxMy4wOXpNNi41IDEzYy0uODMgMC0xLjUtLjY3LTEuNS0xLjVzLjY3LTEuNSAxLjUtMS41IDEuNS42NyAxLjUgMS41LS42NyAxLjUtMS41IDEuNXoiLz48L3N2Zz4=', color: colors[7] },
            { letter: 'W', word: 'Watch', image: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0iI2ZmZmZmZiI+PHBhdGggZD0iTTExLjkyIDIyYy01LjQ4IDAtOS45Mi00LjQ0LTkuOTItOS45MiAwLTUuNDcgNC40NC05LjkyIDkuOTItOS45MiA1LjQ3IDAgOS45MiA0LjQ0IDkuOTIgOS45MiAwIDUuNDctNC40NSA5LjkyLTkuOTIgOS45MnptMC0xOGMtNC4zNyAwLTcuOTIgMy41NS03LjkyIDcuOTJzMy41NSA3LjkyIDcuOTIgNy45MiA3LjkyLTMuNTUgNy45Mi03LjkyLTMuNTUtNy45Mi03LjkyLTcuOTJ6bS0uNDcgMS45NWMtLjIgMC0uMzguMS0uNDkuMjlsLTQuMDYgNS40MWMtLjI3LjM2LS4yMy44OC4wOSAxLjE4bDIuMiAyLjI3Yy4xNS4xNS4zNS4yMy41NS4yM2MuMjcgMCAuNTMtLjE0LjY5LS4zOWwxLjc5LTMuMzZjLjEyLS4yMy4zNy0uMzUuNjEtLjI4bDIuMTIuNWMuMjYuMDYuNDQuMjguNDQuNTV2Mi4zMmMwIC4yOS4yNC41My41My41M2gxLjA2YzIuNzQtMi4xNCA0LjQyLTUuNCA0LjQyLTkuMDYgMC0uNDQtLjE1LS44NC0uNDEtMS4xN3oiLz48L3N2Zz4=', color: colors[8] },
            { letter: 'X', word: 'Xylophone', image: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0iI2ZmZmZmZiI+PHBhdGggZD0iTTUgMTRoMnYtMkg1djJoM3YtMkg1djJoMnYtMmgtMnYtMmgydjJoMnYtMmgydjJoMnYtMmgydjJoMnYtMmgydjJoMnYtMmgydjJoMnYtMmgydjJoMnYtMmgydjJoMnYtMmgydjJoMnYtMmgydjJoMnYtMmgydjJoMnYtMmgydjJoMnYtMmg1VjR6Ii8+PC9zdmc+', color: colors[9] },
            { letter: 'Y', word: 'Yo-yo', image: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0iI2ZmZmZmZiI+PHBhdGggZD0iTTExLjkyIDIyYy01LjQ4IDAtOS45Mi00LjQ0LTkuOTItOS45MiAwLTUuNDcgNC40NC05LjkyIDkuOTItOS45MiA1LjQ3IDAgOS45MiA0LjQ0IDkuOTIgOS45MiAwIDUuNDctNC40NSA5LjkyLTkuOTIgOS45MnptMC0xOGMtNC4zNyAwLTcuOTIgMy41NS03LjkyIDcuOTJzMy41NSA3LjkyIDcuOTIgNy45MiA3LjkyLTMuNTUgNy45Mi03LjkyLTMuNTUtNy45Mi03LjkyLTcuOTJ6bS0uNDcgMS45NWMtLjIgMC0uMzguMS0uNDkuMjlsLTQuMDYgNS40MWMtLjI3LjM2LS4yMy44OC4wOSAxLjE4bDIuMiAyLjI3Yy4xNS4xNS4zNS4yMy41NS4yM2MuMjcgMCAuNTMtLjE0LjY5LS4zOWwxLjc5LTMuMzZjLjEyLS4yMy4zNy0uMzUuNjEtLjI4bDIuMTIuNWMuMjYuMDYuNDQuMjguNDQuNTV2Mi4zMmMwIC4yOS4yNC41My41My41M2gxLjA2YzIuNzQtMi4xNCA0LjQyLTUuNCA0LjQyLTkuMDYgMC0uNDQtLjE1LS44NC0uNDEtMS4xN3oiLz48L3N2Zz4=', color: colors[10] },
            { letter: 'Z', word: 'Zebra', image: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0iI2ZmZmZmZiI+PHBhdGggZD0iTTIyIDN2MmgtdjJoLTF2Mkg2VjdoLTJ2MkgzVjZoLTJWM2gydjJoMVYzaDJ2MmgzVjVIMTBWNEgxMVYzaDFWMkg5djJoM3YxaDFWMmgxVjBoMnYxMGgyVjhoMlY1aDFWM2gyem0tOCAwaC0xVjJoMXYxem0tNiAwaC0xVjFoMXYyem0xMyAxMHYtMmgxdjJoLTF6bS0yIDBoLTF2LTJoMXYyem0tMiAwaC0xdjJoMXYtMnptLTIgMGgtMXYtMmgydjJoLTF6bS0xIDNoLTF2LTFoMXYxem0tMiAwaC0xdjJoMXYtMnptMyAwaDF2LTJoLTF2MnptLTYgMGgtMXYtMmgydjJoLTF6bS0yIDBoLTF2LTJoMXYyeiIvPjwvc3ZnPg==', color: colors[11] },
        ],
    },
    stories: [
      { id: 'animal-1', title: 'الثعلب الشجاع', thumbnailUrl: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIj48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iIzdGQkEyRiI+PC9yZWN0PjxwYXRoIGQ9Ik01MCAxMCBDMzAgMTAsIDI1IDMwLCAyNSAzMCBDMjUgNDAsIDQwIDQ1LCA0MCA0NSBMNjAgNDUgQzYwIDQ1LCA3NSA0MCwgNzUgMzAgQzc1IDMwLCA3MCAxMCwgNTAgMTBaIiBmaWxsPSIjRkY3QjAwIj48L3BhdGg+PHBhdGggZD0iTTUwIDYwIEw1MCA5MCBDMzAgOTAsIDI1IDcwLCAyNSA3MCBMNzUgNzAgQzc1IDcwLCA3MCA5MCwgNTAgOTBaIiBmaWxsPSIjRkY3QjAwIj48L3BhdGg+PHBhdGggZD0iTTM1IDM1IEw0NSAzNSBMNDAgMjUgWiIgZmlsbD0iI0ZGRiI+PC9wYXRoPjxwYXRoIGQ9Ik01NSAzNSBMNjUgMzUgTDYwIDI1IFoiIGZpbGw9IiNGRkYiPjwvcGF0aD48Y2lyY2xlIGN4PSIzOCIgY3k9IjM4IiByPSIyIiBmaWxsPSIjMDAwIj48L2NpcmNsZT48Y2lyY2xlIGN4PSI2MiIgY3k9IjM4IiByPSIyIiBmaWxsPSIjMDAwIj48L2NpcmNsZT48cGF0aCBkPSJNNCAyMCBDMjAgLTUsIDgwIC01LCA5NiAyMCBMOTAgMjUgQzgwIDAsIDIwIDAsIDEwIDI1IFoiIGZpbGw9IiNGRjdCMDAiPjwvcGF0aD48L3N2Zz4=', pages: [ { imageUrl: 'https://picsum.photos/seed/a1-1/800/600' } ]},
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

  // One-time effect to migrate old data structures to include flashcards
  useEffect(() => {
    if (appData && appData.settings && appData.settings.animalFlashcards === undefined) {
      // FIX: The useLocalStorage hook's setter does not support functional updates based on its type.
      // Pass the new state object directly using the current state `appData`.
      const newAppData = {
        ...appData,
        settings: {
          ...appData.settings,
          animalFlashcards: DEFAULT_APP_DATA.settings.animalFlashcards,
          colorFlashcards: DEFAULT_APP_DATA.settings.colorFlashcards,
          numberFlashcards: DEFAULT_APP_DATA.settings.numberFlashcards,
          shapeFlashcards: DEFAULT_APP_DATA.settings.shapeFlashcards,
          funnyFlashcards: DEFAULT_APP_DATA.settings.funnyFlashcards,
          arabicAlphabetData: DEFAULT_APP_DATA.settings.arabicAlphabetData,
          englishAlphabetData: DEFAULT_APP_DATA.settings.englishAlphabetData,
        }
      };
      setAppData(newAppData);
    }
  }, [appData, setAppData]);


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
                <div className="mb-8 flex justify-center space-x-1 space-x-reverse bg-slate-900/50 p-1 rounded-full max-w-lg mx-auto text-sm">
                    <button 
                        onClick={() => setActiveMainTab('stories')}
                        className={`flex-1 flex items-center justify-center space-x-1.5 space-x-reverse px-3 py-1.5 rounded-full font-bold transition-all duration-300 ${activeMainTab === 'stories' ? 'bg-yellow-400 text-slate-800 shadow-md' : 'text-white hover:bg-white/10'}`}
                    >
                        <BookIcon className="w-5 h-5" />
                        <span>القصص</span>
                    </button>
                    <button 
                        onClick={() => setActiveMainTab('flashcards')}
                        className={`flex-1 flex items-center justify-center space-x-1.5 space-x-reverse px-3 py-1.5 rounded-full font-bold transition-all duration-300 ${activeMainTab === 'flashcards' ? 'bg-yellow-400 text-slate-800 shadow-md' : 'text-white hover:bg-white/10'}`}
                    >
                        <AbcIcon className="w-5 h-5" />
                        <span>بطاقات تعليمية</span>
                    </button>
                    <button 
                        onClick={() => setActiveMainTab('games')}
                        className={`flex-1 flex items-center justify-center space-x-1.5 space-x-reverse px-3 py-1.5 rounded-full font-bold transition-all duration-300 ${activeMainTab === 'games' ? 'bg-yellow-400 text-slate-800 shadow-md' : 'text-white hover:bg-white/10'}`}
                    >
                        <PuzzleIcon className="w-5 h-5" />
                        <span>الألعاب</span>
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
                    
                    {activeMainTab === 'flashcards' && (
                         <div className="animate-fade-in">
                            <Flashcards />
                        </div>
                    )}

                    {activeMainTab === 'games' && (
                         <div className="animate-fade-in">
                             <SectionCard
                                title="ألعاب تعليمية"
                                count={18}
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
