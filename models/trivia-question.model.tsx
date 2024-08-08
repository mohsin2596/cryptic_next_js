export interface TriviaQuestion {
    question: string; // The trivia question itself
    answers: string[]; // An array of possible answers
    correctAnswerIndex: number; // The index of the correct answer in the 'answers' array
}


export const dummyTriviaQuestions: TriviaQuestion[] = [
    {
        question: 'What is the capital of France?',
        answers: ['Paris', 'London', 'Berlin', 'Madrid'],
        correctAnswerIndex: 0
    },
    {
        question: 'What is the largest planet in our solar system?',
        answers: ['Earth', 'Jupiter', 'Mars', 'Saturn'],
        correctAnswerIndex: 1
    },
    {
        question: 'Who wrote the play "Romeo and Juliet"?',
        answers: ['William Shakespeare', 'Charles Dickens', 'Jane Austen', 'Mark Twain'],
        correctAnswerIndex: 0
    },
    {
        question: 'What is the chemical symbol for gold?',
        answers: ['Au', 'Ag', 'Fe', 'Cu'],
        correctAnswerIndex: 0
    },
    {
        question: 'What is the largest mammal in the world?',
        answers: ['Elephant', 'Blue whale', 'Giraffe', 'Hippopotamus'],
        correctAnswerIndex: 1
    }
];