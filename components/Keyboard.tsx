
import React from 'react';
import { Delete } from 'lucide-react';
import { LetterStatus } from '../types';
import { getLetterStatus } from '../utils';

interface KeyboardProps {
  onKeyPress: (key: string) => void;
  guesses: string[];
  solution: string;
}

const Keyboard: React.FC<KeyboardProps> = ({ onKeyPress, guesses, solution }) => {
  const rows = [
    ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
    ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
    ['ENTER', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', 'BACKSPACE'],
  ];

  const getUsedLetterStatus = (): Record<string, LetterStatus> => {
    const used: Record<string, LetterStatus> = {};
    guesses.forEach(guess => {
      const statuses = getLetterStatus(guess, solution);
      guess.split('').forEach((char, i) => {
        const currentStatus = used[char];
        const newStatus = statuses[i];

        if (!currentStatus || newStatus === 'correct' || (newStatus === 'present' && currentStatus !== 'correct')) {
          used[char] = newStatus;
        }
      });
    });
    return used;
  };

  const usedLetters = getUsedLetterStatus();

  return (
    <div className="w-full max-w-2xl mx-auto p-2">
      {rows.map((row, i) => (
        <div key={i} className="flex justify-center gap-1 mb-2">
          {row.map((key) => {
            const status = usedLetters[key];
            let bgColor = 'bg-gray-200 hover:bg-gray-300 text-gray-800';
            
            if (status === 'correct') {
              bgColor = 'bg-[#007A33] text-white';
            } else if (status === 'present') {
              bgColor = 'bg-[#F47920] text-white';
            } else if (status === 'absent') {
              bgColor = 'bg-[#94A3B8] text-white';
            }

            const isWide = key === 'ENTER' || key === 'BACKSPACE';

            return (
              <button
                key={key}
                onClick={() => onKeyPress(key)}
                className={`
                  ${isWide ? 'px-2 md:px-4 text-[10px] md:text-sm' : 'w-8 md:w-10'} 
                  h-12 md:h-14 rounded font-bold transition-colors flex items-center justify-center
                  ${bgColor}
                `}
              >
                {key === 'BACKSPACE' ? <Delete size={18} /> : key}
              </button>
            );
          })}
        </div>
      ))}
    </div>
  );
};

export default Keyboard;
