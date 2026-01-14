
import { LetterStatus } from './types';
import { WORD_LIST } from './constants';

export const getDailyWord = (): string => {
  // Use a fixed epoch to calculate the day index
  const epoch = new Date('2024-01-01T00:00:00').getTime();
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const dayIndex = Math.floor((today - epoch) / (1000 * 60 * 60 * 24));
  
  const index = dayIndex % WORD_LIST.length;
  return WORD_LIST[index].toUpperCase();
};

export const getDayKey = (): string => {
  const now = new Date();
  return `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`;
};

export const getNextWordCountdown = (): string => {
  const now = new Date();
  const tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
  const diff = tomorrow.getTime() - now.getTime();
  
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const secs = Math.floor((diff % (1000 * 60)) / 1000);
  
  return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

export const getLetterStatus = (guess: string, solution: string): LetterStatus[] => {
  const status: LetterStatus[] = Array(5).fill('absent');
  const solutionArr = solution.split('');
  const guessArr = guess.split('');

  // First pass: find correct letters
  guessArr.forEach((letter, i) => {
    if (letter === solutionArr[i]) {
      status[i] = 'correct';
      solutionArr[i] = ''; // Mark as used
    }
  });

  // Second pass: find present letters
  guessArr.forEach((letter, i) => {
    if (status[i] !== 'correct') {
      const solutionIndex = solutionArr.indexOf(letter);
      if (solutionIndex !== -1) {
        status[i] = 'present';
        solutionArr[solutionIndex] = ''; // Mark as used
      }
    }
  });

  return status;
};

export const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};
