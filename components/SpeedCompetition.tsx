import React, { useState, useEffect, useRef } from 'react';
import { RedoIcon, SparkleIcon } from './Icons';

type QuestionType = 'color' | 'animal' | 'math';
interface Question {
    type: QuestionType;
    prompt: string;
    subject: string; // hex code, emoji, or math expression
    options: string[];
    answer: string;
}

const QUESTIONS_POOL: Omit<Question, 'options'>[] = [
    { type: 'color', prompt: 'ما هو هذا اللون؟', subject: '#ef4444', answer: 'أحمر' },
    { type: 'color', prompt: 'ما هو هذا اللون؟', subject: '#3b82f6', answer: 'أزرق' },
    { type: 'color', prompt: 'ما هو هذا اللون؟', subject: '#22c55e', answer: 'أخضر' },
    { type: 'animal', prompt: 'ما هو هذا الحيوان؟', subject: '🐘', answer: 'فيل' },
    { type: 'animal', prompt: 'ما هو هذا الحيوان؟', subject: '🦁', answer: 'أسد' },
    { type: 'animal', prompt: 'ما هو هذا الحيوان؟', subject: '🍌', answer: 'موز' }, // It's a fruit but good for kids
    { type: 'math', prompt: 'ما هو المجموع؟', subject: '2 + 2', answer: '4' },
    { type: 'math', prompt: 'ما هو المجموع؟', subject: '3 + 1', answer: '4' },
    { type: 'math', prompt: 'ما هو المجموع؟', subject: '1 + 1', answer: '2' },
];

const ALL_ANSWERS = ['أحمر', 'أزرق', 'أخضر', 'فيل', 'أسد', 'موز', '4', '2', '3'];

const generateQuestion = (): Question => {
    const questionTemplate = QUESTIONS_POOL[Math.floor(Math.random() * QUESTIONS_POOL.length)];
    const options = new Set<string>([questionTemplate.answer]);
    while(options.size < 4) {
        const randomAnswer = ALL_ANSWERS[Math.floor(Math.random() * ALL_ANSWERS.length)];
        options.add(randomAnswer);
    }
    return {...questionTemplate, options: Array.from(options).sort(() => Math.random() - 0.5)};
};

const GAME_DURATION = 60;

const SpeedCompetition: React.FC = () => {
    const [gameState, setGameState] = useState<'idle' | 'playing' | 'finished'>('idle');
    const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
    const [score, setScore] = useState(0);
    const [currentQuestion, setCurrentQuestion] = useState<Question>(generateQuestion());
    const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);

    const timerRef = useRef<number | null>(null);
    const successAudioRef = useRef<HTMLAudioElement>(null);
    const failureAudioRef = useRef<HTMLAudioElement>(null);

    useEffect(() => {
        if (gameState === 'playing' && timeLeft > 0) {
            timerRef.current = window.setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
        } else if (timeLeft === 0) {
            setGameState('finished');
        }
        return () => {
            if (timerRef.current) window.clearTimeout(timerRef.current);
        };
    }, [gameState, timeLeft]);

    const startGame = () => {
        setScore(0);
        setTimeLeft(GAME_DURATION);
        setCurrentQuestion(generateQuestion());
        setGameState('playing');
    };

    const handleAnswer = (option: string) => {
        if(feedback) return;
        
        if (option === currentQuestion.answer) {
            setScore(prev => prev + 1);
            setFeedback('correct');
            successAudioRef.current?.play();
        } else {
            setFeedback('incorrect');
            failureAudioRef.current?.play();
        }

        setTimeout(() => {
            setCurrentQuestion(generateQuestion());
            setFeedback(null);
        }, 300);
    };
    
    const renderQuestionSubject = () => {
        switch(currentQuestion.type) {
            case 'color':
                return <div className="w-32 h-32 rounded-lg" style={{backgroundColor: currentQuestion.subject}}></div>
            case 'animal':
                return <div className="text-8xl">{currentQuestion.subject}</div>
            case 'math':
                return <div className="text-6xl font-bold text-yellow-300">{currentQuestion.subject}</div>
        }
    }

    if (gameState === 'idle') {
        return (
            <div className="text-center p-8 flex flex-col items-center">
                <SparkleIcon className="w-16 h-16 text-yellow-300 mb-4"/>
                <h3 className="text-3xl font-bold">مسابقة السرعة!</h3>
                <p className="text-lg text-slate-300 mt-2 mb-6">أجب على أكبر عدد من الأسئلة في {GAME_DURATION} ثانية!</p>
                <button onClick={startGame} className="bg-green-500 text-white font-bold py-3 px-8 rounded-full hover:bg-green-600 text-xl shadow-lg border-b-4 border-green-700 active:border-b-0 active:translate-y-1 transform">
                    ابدأ التحدي!
                </button>
            </div>
        );
    }
    
    if (gameState === 'finished') {
        return (
            <div className="text-center p-8 flex flex-col items-center">
                <h3 className="text-3xl font-bold">انتهى الوقت!</h3>
                <p className="text-5xl font-black text-yellow-300 my-4">{score}</p>
                <p className="text-lg text-slate-300 mb-6">إجابة صحيحة</p>
                <button onClick={startGame} className="bg-blue-500 text-white font-bold py-2 px-6 rounded-full hover:bg-blue-600 flex items-center space-x-2 space-x-reverse">
                    <RedoIcon className="w-5 h-5"/>
                    <span>العب مرة أخرى</span>
                </button>
            </div>
        )
    }

    return (
        <div className="relative">
            <div className="flex justify-between items-center mb-4">
                <div className="text-2xl font-bold">النتيجة: <span className="text-green-400">{score}</span></div>
                <div className="text-2xl font-bold">الوقت: <span className="text-red-400">{timeLeft}</span></div>
            </div>

            <div className={`p-4 rounded-lg text-center transition-colors duration-200 ${feedback === 'correct' ? 'bg-green-500/20' : feedback === 'incorrect' ? 'bg-red-500/20' : ''}`}>
                <p className="text-xl font-semibold mb-4 text-slate-200 h-7">{currentQuestion.prompt}</p>
                <div className="flex justify-center items-center h-36 mb-4">
                    {renderQuestionSubject()}
                </div>
                <div className="grid grid-cols-2 gap-3 max-w-md mx-auto">
                    {currentQuestion.options.map(opt => (
                        <button key={opt} onClick={() => handleAnswer(opt)} className="bg-slate-700 hover:bg-slate-600 p-3 rounded-lg text-white font-bold text-xl">
                            {opt}
                        </button>
                    ))}
                </div>
            </div>
            <audio ref={successAudioRef} src="https://actions.google.com/sounds/v1/correct/bell_correct.ogg" preload="auto" />
            <audio ref={failureAudioRef} src="https://actions.google.com/sounds/v1/errors/error_swoosh.ogg" preload="auto" />
        </div>
    );
};

export default SpeedCompetition;
