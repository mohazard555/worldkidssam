import React, { useState, useEffect, useRef } from 'react';
import { ArrowRightIcon } from './Icons';

interface GameData {
  sentence: string; // Use {word} as placeholder
  correctWord: string;
  options: string[];
}

const GAME_LEVELS: GameData[] = [
  { sentence: 'القطة تشرب {word}.', correctWord: 'الحليب', options: ['العصير', 'الماء', 'الحليب', 'الشاي'] },
  { sentence: 'الشمس تشرق في {word}.', correctWord: 'الصباح', options: ['الصباح', 'الليل', 'المساء', 'العصر'] },
  { sentence: 'السمكة تعيش في {word}.', correctWord: 'الماء', options: ['الهواء', 'التراب', 'النار', 'الماء'] },
  { sentence: 'نذهب إلى {word} لنتعلم.', correctWord: 'المدرسة', options: ['السوق', 'المدرسة', 'الملعب', 'البيت'] },
  { sentence: 'الفيل حيوان {word}.', correctWord: 'ضخم', options: ['صغير', 'سريع', 'ضخم', 'ملون'] },
];

const shuffleArray = <T,>(array: T[]): T[] => {
  return [...array].sort(() => Math.random() - 0.5);
};

const CompleteWordGame: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [currentLevel, setCurrentLevel] = useState(0);
  const [problem, setProblem] = useState<GameData>({ ...GAME_LEVELS[0], options: shuffleArray(GAME_LEVELS[0].options) });
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);
  const successAudioRef = useRef<HTMLAudioElement>(null);
  const failureAudioRef = useRef<HTMLAudioElement>(null);

  const setupLevel = (levelIndex: number) => {
    setFeedback(null);
    const newProblem = GAME_LEVELS[levelIndex];
    setProblem({ ...newProblem, options: shuffleArray(newProblem.options) });
    setCurrentLevel(levelIndex);
  };

  useEffect(() => {
    setupLevel(0);
  }, []);

  const handleOptionClick = (word: string) => {
    if (feedback) return;

    if (word === problem.correctWord) {
      setFeedback('correct');
      successAudioRef.current?.play();
      setTimeout(() => {
        const nextLevel = (currentLevel + 1) % GAME_LEVELS.length;
        setupLevel(nextLevel);
      }, 1500);
    } else {
      setFeedback('incorrect');
      failureAudioRef.current?.play();
      setTimeout(() => {
        setFeedback(null);
      }, 1000);
    }
  };

  const getButtonClass = (word: string): string => {
    const isCorrectAnswer = word === problem.correctWord;

    if (!feedback) {
      return "bg-slate-700 hover:bg-slate-600";
    }
    if (feedback === 'correct' && isCorrectAnswer) {
      return "bg-green-600 animate-pulse";
    }
    if (feedback === 'incorrect' && isCorrectAnswer) {
      return "bg-green-600";
    }
    if (feedback === 'incorrect' && !isCorrectAnswer) {
      return "bg-red-600";
    }
    return "bg-slate-700 opacity-50";
  };

  const formattedSentence = problem.sentence.split('{word}').map((part, index) => (
    <React.Fragment key={index}>
      {part}
      {index < problem.sentence.split('{word}').length - 1 && (
        <span className="inline-block bg-slate-900/50 text-yellow-300 border-2 border-dashed border-slate-500 rounded-lg px-6 py-1 mx-2">
          {feedback === 'correct' ? problem.correctWord : '...'}
        </span>
      )}
    </React.Fragment>
  ));

  return (
    <div className="bg-slate-800/50 p-4 rounded-lg text-center relative animate-fade-in">
      <button onClick={onBack} className="absolute top-3 left-3 text-white/70 hover:text-white bg-black/20 p-2 rounded-full transition-colors z-10">
        <ArrowRightIcon className="w-6 h-6" />
        <span className="sr-only">رجوع</span>
      </button>
      <h3 className="text-2xl font-bold mb-4">أكمل الكلمة الناقصة</h3>
      <div className="mb-6 flex items-center justify-center bg-slate-700/50 rounded-lg p-6 min-h-[100px]">
        <p className="text-3xl font-bold text-white">{formattedSentence}</p>
      </div>
      <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
        {problem.options.map((option) => (
          <button
            key={option}
            onClick={() => handleOptionClick(option)}
            disabled={!!feedback}
            className={`p-4 text-white font-bold rounded-lg transition-colors duration-300 text-xl ${getButtonClass(option)}`}
          >
            {option}
          </button>
        ))}
      </div>
      <audio ref={successAudioRef} src="https://actions.google.com/sounds/v1/positive/success.ogg" preload="auto" />
      <audio ref={failureAudioRef} src="https://actions.google.com/sounds/v1/errors/error_swoosh.ogg" preload="auto" />
    </div>
  );
};

export default CompleteWordGame;
