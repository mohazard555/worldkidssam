import React, { useState, useContext, useRef } from 'react';
import { AppContext } from '../App';
import { RedoIcon } from './Icons';
import { QuizQuestion } from '../types';

interface AnswerState {
  [questionId: string]: number | null;
}

const QuizSection: React.FC = () => {
    const { appData } = useContext(AppContext)!;
    const [selectedAnswers, setSelectedAnswers] = useState<AnswerState>({});
    const successAudioRef = useRef<HTMLAudioElement>(null);
    const failureAudioRef = useRef<HTMLAudioElement>(null);

    const quizzes = appData.settings.quizzes || [];

    if (quizzes.length === 0) {
        return (
             <div className="text-center text-white/80 p-8 bg-slate-800/50 rounded-xl">
                <p className="font-bold text-lg">لا توجد ألغاز حالياً.</p>
                <p className="text-sm mt-2">لإضافة ألغاز، اذهب إلى لوحة التحكم ⚙️ ثم قسم "ألغاز".</p>
            </div>
        );
    }
    
    const handleAnswerSelect = (questionId: string, optionIndex: number) => {
        if (selectedAnswers[questionId] === null || selectedAnswers[questionId] === undefined) {
            setSelectedAnswers(prev => ({ ...prev, [questionId]: optionIndex }));
            const question = quizzes.find(q => q.id === questionId);
            if (question) {
                if (optionIndex === question.correctAnswerIndex) {
                    successAudioRef.current?.play();
                } else {
                    failureAudioRef.current?.play();
                }
            }
        }
    };

    const resetQuiz = () => {
        setSelectedAnswers({});
    };

    const getButtonClass = (question: QuizQuestion, optionIndex: number): string => {
        const selectedAnswer = selectedAnswers[question.id];
        const isSelected = selectedAnswer !== null && selectedAnswer !== undefined;

        if (!isSelected) {
            return "bg-slate-700 hover:bg-blue-600";
        }

        const isCorrect = optionIndex === question.correctAnswerIndex;
        const isThisOptionSelected = selectedAnswer === optionIndex;

        if (isCorrect) {
            return "bg-green-600 cursor-default";
        }
        if (isThisOptionSelected && !isCorrect) {
            return "bg-red-600 cursor-default";
        }
        
        return "bg-slate-700 opacity-50 cursor-default";
    };

    return (
        <div id="quiz-section-content" className="animate-fade-in space-y-6">
            {quizzes.map((quiz) => (
                <div key={quiz.id} className="bg-slate-800/50 p-4 rounded-lg">
                    <p className="text-white text-lg font-semibold mb-4 text-center">{quiz.questionText}</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {quiz.options.map((option, index) => (
                            <button
                                key={index}
                                onClick={() => handleAnswerSelect(quiz.id, index)}
                                disabled={selectedAnswers[quiz.id] !== null && selectedAnswers[quiz.id] !== undefined}
                                className={`w-full p-3 text-white font-bold rounded-lg transition-colors duration-300 ${getButtonClass(quiz, index)}`}
                            >
                                {option}
                            </button>
                        ))}
                    </div>
                </div>
            ))}
            <div className="text-center mt-6">
                <button onClick={resetQuiz} className="bg-yellow-500 text-slate-800 font-bold py-2 px-6 rounded-full hover:bg-yellow-400 transition-all flex items-center mx-auto space-x-2 space-x-reverse shadow-lg border-b-4 border-yellow-700 active:border-b-0 active:translate-y-1 transform">
                    <RedoIcon className="w-5 h-5"/>
                    <span>المحاولة مرة أخرى</span>
                </button>
            </div>
            <audio ref={successAudioRef} src="https://actions.google.com/sounds/v1/positive/bell_notification.ogg" preload="auto" />
            <audio ref={failureAudioRef} src="https://actions.google.com/sounds/v1/errors/error_swoosh.ogg" preload="auto" />
        </div>
    );
};

export default QuizSection;