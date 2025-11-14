import React, { useState, useRef } from 'react';
import { RedoIcon, ChevronLeftIcon, ChevronRightIcon } from './Icons';
import { QuizQuestion } from '../types';

interface AnswerState {
  [questionId: string]: number | null;
}

interface PuzzlesCarouselProps {
    quizzes: QuizQuestion[];
}

const PuzzlesCarousel: React.FC<PuzzlesCarouselProps> = ({ quizzes }) => {
    const [selectedAnswers, setSelectedAnswers] = useState<AnswerState>({});
    const [currentIndex, setCurrentIndex] = useState(0);
    const successAudioRef = useRef<HTMLAudioElement>(null);
    const failureAudioRef = useRef<HTMLAudioElement>(null);

    const quiz = quizzes[currentIndex];

    const handleAnswerSelect = (questionId: string, optionIndex: number) => {
        if (selectedAnswers[questionId] === null || selectedAnswers[questionId] === undefined) {
            setSelectedAnswers(prev => ({ ...prev, [questionId]: optionIndex }));
            if (optionIndex === quiz.correctAnswerIndex) {
                successAudioRef.current?.play();
            } else {
                failureAudioRef.current?.play();
            }
        }
    };

    const resetAllQuizzes = () => {
        setSelectedAnswers({});
    };

    const goToPrevious = () => {
        const isFirstSlide = currentIndex === 0;
        const newIndex = isFirstSlide ? quizzes.length - 1 : currentIndex - 1;
        setCurrentIndex(newIndex);
    };

    const goToNext = () => {
        const isLastSlide = currentIndex === quizzes.length - 1;
        const newIndex = isLastSlide ? 0 : currentIndex + 1;
        setCurrentIndex(newIndex);
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
        <div className="space-y-4">
            <div className="relative bg-slate-800 p-4 rounded-lg min-h-[300px] flex flex-col justify-center">
                <p className="text-white text-xl font-semibold mb-4 text-center">{quiz.questionText}</p>
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
                 <button onClick={goToPrevious} className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 p-2 rounded-full"><ChevronLeftIcon className="w-6 h-6"/></button>
                 <button onClick={goToNext} className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 p-2 rounded-full"><ChevronRightIcon className="w-6 h-6"/></button>
                 <div className="absolute bottom-2 left-2 text-sm text-slate-400">{quizzes.length} / {currentIndex + 1}</div>
            </div>
            <div className="text-center">
                <button onClick={resetAllQuizzes} className="bg-yellow-500 text-slate-800 font-bold py-2 px-6 rounded-full hover:bg-yellow-400 transition-all flex items-center mx-auto space-x-2 space-x-reverse shadow-lg border-b-4 border-yellow-700 active:border-b-0 active:translate-y-1 transform">
                    <RedoIcon className="w-5 h-5"/>
                    <span>إعادة كل الألغاز</span>
                </button>
            </div>
            <audio ref={successAudioRef} src="https://actions.google.com/sounds/v1/positive/bell_notification.ogg" preload="auto" />
            <audio ref={failureAudioRef} src="https://actions.google.com/sounds/v1/errors/error_swoosh.ogg" preload="auto" />
        </div>
    );
};

export default PuzzlesCarousel;
