
import React from 'react';
import { getLetterStatus } from '../utils';
import { COLORS } from '../constants';

interface BoardProps {
  guesses: string[];
  currentGuess: string;
  solution: string;
  isInvalidWord: boolean;
}

const Board: React.FC<BoardProps> = ({ guesses, currentGuess, solution, isInvalidWord }) => {
  const rows = Array(6).fill(null);

  return (
    <div className="flex-none flex flex-col items-center justify-center gap-2 p-4">
      {rows.map((_, rowIndex) => {
        const guess = guesses[rowIndex];
        const isCurrent = rowIndex === guesses.length;
        const displayWord = isCurrent ? currentGuess.padEnd(5, ' ') : (guess || '     ');
        const status = guess ? getLetterStatus(guess, solution) : Array(5).fill('empty');

        return (
          <div 
            key={rowIndex} 
            className={`flex gap-2 ${isCurrent && isInvalidWord ? 'animate-shake' : ''}`}
          >
            {displayWord.split('').map((char, colIndex) => {
              let bgColor = 'bg-white border-2 border-gray-300';
              let textColor = 'text-gray-800';
              let borderColor = 'border-gray-300';

              if (!isCurrent && guess) {
                const s = status[colIndex];
                if (s === 'correct') {
                  bgColor = 'bg-[#007A33] border-[#007A33]'; // Hyatt Green
                  textColor = 'text-white';
                  borderColor = 'border-[#007A33]';
                } else if (s === 'present') {
                  bgColor = 'bg-[#F47920] border-[#F47920]'; // Hyatt Orange
                  textColor = 'text-white';
                  borderColor = 'border-[#F47920]';
                } else if (s === 'absent') {
                  bgColor = 'bg-[#94A3B8] border-[#94A3B8]';
                  textColor = 'text-white';
                  borderColor = 'border-[#94A3B8]';
                }
              } else if (isCurrent && char !== ' ') {
                borderColor = 'border-[#002D72]';
              }

              return (
                <div
                  key={`${rowIndex}-${colIndex}`}
                  className={`
                    w-12 h-12 md:w-16 md:h-16 flex items-center justify-center 
                    text-xl md:text-3xl font-bold uppercase rounded-sm transition-all duration-300
                    ${bgColor} ${textColor} ${borderColor}
                    ${!isCurrent && guess ? 'animate-flip' : ''}
                  `}
                  style={{ animationDelay: `${colIndex * 100}ms` }}
                >
                  {char === ' ' ? '' : char}
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
};

export default Board;
