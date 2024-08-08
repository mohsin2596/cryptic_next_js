"use client";
import anime from 'animejs/lib/anime.es.js';
import { useEffect, useState } from "react";
import { dummyTriviaQuestions, TriviaQuestion } from "@/models/trivia-question.model";
import { obfuscateText, deobfuscateText } from '@/utilities/cryptic-utility';
import NoCopyText from '@/components/no-copy-text.component';

const Home: React.FC = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(10);
  const [isPaused, setIsPaused] = useState(false);
  const [answers, setAnswers] = useState<boolean[] | null[]>(Array(dummyTriviaQuestions.length).fill(null));
  const [isGameOver, setIsGameOver] = useState(false);

  const obfuscatedTriviaQuestions: TriviaQuestion[] = dummyTriviaQuestions.map(question => ({
    question: obfuscateText(question.question),
    answers: question.answers.map(obfuscateText),
    correctAnswerIndex: question.correctAnswerIndex
  }));

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (!isPaused && !isGameOver) {
      timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev > 0) return prev - 1;
          return 0;
        });
      }, 1000);
    }

    if (timeLeft === 0 && !isPaused && !isGameOver) {
      handleAnswerClick(-1); // Consider unanswered questions as wrong
    }

    return () => clearInterval(timer);
  }, [timeLeft, isPaused, isGameOver]);

  useEffect(() => {
    const circumference = 2 * Math.PI * 45; // 2 * PI * r, where r is 45% of the width/height

    const animation = anime({
      targets: '#timer-circle',
      strokeDashoffset: [0, circumference],
      easing: 'linear',
      duration: 10000,
      direction: 'reverse',
      autoplay: !isPaused,
    });

    return () => animation.pause();
  }, [currentQuestionIndex, isPaused]);

  const handleAnswerClick = (index: number) => {
    setIsPaused(true);

    if (index === obfuscatedTriviaQuestions[currentQuestionIndex].correctAnswerIndex) {
      setAnswers((prev:any) => {
        const newAnswers = [...prev];
        newAnswers[currentQuestionIndex] = true;
        return newAnswers;
      });
      anime({
        targets: `#answer-button-${index}`,
        backgroundColor: ['#1E3A8A', '#00FF00'],
        duration: 400,
        easing: 'easeInOutQuad',
      });
    } else {
      setAnswers((prev:any) => {
        const newAnswers = [...prev];
        newAnswers[currentQuestionIndex] = false;
        return newAnswers;
      });
      anime({
        targets: `#answer-button-${index}`,
        backgroundColor: ['#1E3A8A', '#FF0000'],
        duration: 400,
        easing: 'easeInOutQuad',
        complete: () => {
          anime({
            targets: `#answer-button-${index}`,
            translateX: [
              { value: -10, duration: 100, easing: 'easeInOutQuad' },
              { value: 10, duration: 100, easing: 'easeInOutQuad' },
              { value: -10, duration: 100, easing: 'easeInOutQuad' },
              { value: 10, duration: 100, easing: 'easeInOutQuad' },
              { value: 0, duration: 100, easing: 'easeInOutQuad' },
            ],
          });
        },
      });
    }

    setTimeout(() => {
      if (currentQuestionIndex < obfuscatedTriviaQuestions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        setTimeLeft(10);
      } else {
        setIsGameOver(true);
      }
      setIsPaused(false);
      resetButtonColors();
    }, 4000);
  };

  const resetButtonColors = () => {
    obfuscatedTriviaQuestions[currentQuestionIndex].answers.forEach((_, index) => {
      anime({
        targets: `#answer-button-${index}`,
        backgroundColor: '#1E3A8A',
        duration: 0,
      });
    });
  };

  const handleRestartGame = () => {
    setCurrentQuestionIndex(0);
    setTimeLeft(10);
    setIsPaused(false);
    setAnswers(Array(obfuscatedTriviaQuestions.length).fill(null));
    setIsGameOver(false);
    resetButtonColors();
  };

  useEffect(() => {
    document.addEventListener('keydown', function(event) {
      if (event.key === 'PrintScreen') {
        event.preventDefault();
        alert('Screenshots are disabled!');
      }
    });

    document.addEventListener('keyup', function(event) {
      if (event.key === 'PrintScreen') {
        navigator.clipboard.writeText('');
        alert('Screenshots are disabled!');
      }
    });

    document.addEventListener('contextmenu', function(event) {
      event.preventDefault();
    });

    return () => {
      document.removeEventListener('keydown', () => {});
      document.removeEventListener('keyup', () => {});
      document.removeEventListener('contextmenu', () => {});
    };
  }, []);

  if (obfuscatedTriviaQuestions.length === 0) {
    return <div>Loading...</div>;
  }

  return (
    <main className="flex min-h-screen w-screen flex-col items-center justify-center bg-black text-white">
      {isGameOver ? (
        <div className="flex flex-col items-center">
          <h1 className="text-2xl mb-4">Game Over!</h1>
          <button
            onClick={handleRestartGame}
            className="py-2 px-4 bg-blue-500 rounded hover:bg-blue-700 focus:outline-none"
          >
            Restart Game
          </button>
        </div>
      ) : (
        <>
          <h1 className="text-2xl mb-4">
            <NoCopyText text={deobfuscateText(obfuscatedTriviaQuestions[currentQuestionIndex].question)} />
          </h1>
          <div className="relative flex items-center justify-center w-full h-64 mb-4">
            <div className="absolute flex items-center justify-center z-[50]">
              <div className="relative w-24 h-24">
                <svg className="absolute inset-0 w-full h-full -rotate-90">
                  <circle
                    id="timer-circle"
                    cx="50%"
                    cy="50%"
                    r="45%"
                    stroke="white"
                    strokeWidth="8"
                    fill="black"
                    strokeDasharray="283"
                    strokeDashoffset="0"
                  />
                </svg>
                <div className="flex absolute z-[20] items-center justify-center w-full h-full">
                  <span className="text-2xl text-white">{timeLeft}</span>
                </div>
              </div>
            </div>
            <div className="absolute flex items-center justify-center w-full h-full">
              <div className="grid gap-4 grid-cols-2">
                {obfuscatedTriviaQuestions[currentQuestionIndex].answers.map((answer, index) => (
                  <button
                    key={index}
                    id={`answer-button-${index}`}
                    onClick={() => handleAnswerClick(index)}
                    className={`py-2 px-4 rounded hover:bg-blue-700 focus:outline-none w-[300px] ${
                      isPaused ? 'bg-gray-500 cursor-not-allowed' : 'bg-blue-500'
                    }`}
                    disabled={isPaused}
                  >
                    <NoCopyText text={deobfuscateText(answer)} />
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div className="flex justify-center space-x-2 mt-4">
            {obfuscatedTriviaQuestions.map((_, index) => (
              <div
                key={index}
                className={`w-6 h-6 rounded-full ${
                  answers[index] === null
                    ? 'bg-gray-500'
                    : answers[index]
                    ? 'bg-green-500'
                    : 'bg-red-500'
                }`}
              ></div>
            ))}
          </div>
        </>
      )}
    </main>
  );
};

export default Home;
