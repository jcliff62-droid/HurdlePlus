
import React, { useState } from 'react';
import { LeaderboardEntry } from '../types';
import { formatTime, getLetterStatus } from '../utils';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface LeaderboardProps {
  entries: LeaderboardEntry[];
  onClear: () => void;
  isUnlocked: boolean;
}

const Leaderboard: React.FC<LeaderboardProps> = ({ entries, isUnlocked }) => {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const sorted = [...entries].sort((a, b) => {
    if (a.guesses !== b.guesses) return a.guesses - b.guesses;
    return a.time - b.time;
  });

  const toggleExpand = (idx: number) => {
    if (!isUnlocked) return;
    setExpandedIndex(expandedIndex === idx ? null : idx);
  };

  return (
    <div className="w-full max-w-2xl mx-auto mt-12 bg-white rounded border border-gray-200 shadow-sm overflow-hidden mb-24">
      <div className="bg-[#002D72] px-6 py-4 flex justify-between items-center">
        <h3 className="font-bold text-white uppercase tracking-widest text-xs">Hall of Fame</h3>
        <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{entries.length} Completed Runs</span>
      </div>
      
      <div className="overflow-hidden">
        {sorted.length === 0 ? (
          <div className="px-6 py-12 text-center text-gray-400 text-sm font-medium">
            The leaderboard is currently empty.
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {sorted.map((entry, idx) => (
              <div key={`${entry.name}-${idx}`} className="flex flex-col">
                {/* Row Header - Entirely Clickable */}
                <button 
                  onClick={() => toggleExpand(idx)}
                  disabled={!isUnlocked}
                  className={`w-full flex items-center px-6 py-4 text-sm transition-colors text-left
                    ${isUnlocked ? 'hover:bg-gray-50 cursor-pointer' : 'cursor-default'}
                    ${expandedIndex === idx ? 'bg-gray-50' : ''}
                  `}
                >
                  <div className="flex-1 font-bold text-[#002D72] flex items-center gap-3">
                    <span className="text-[10px] text-gray-400 w-4">{idx + 1}.</span>
                    {entry.name}
                    {isUnlocked && (
                      <span className="text-gray-300">
                        {expandedIndex === idx ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-8">
                    <div className="text-center">
                      <div className="text-[10px] uppercase font-bold text-gray-400 leading-none mb-1">Guesses</div>
                      <div className="font-black text-gray-700">{entry.guesses}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-[10px] uppercase font-bold text-gray-400 leading-none mb-1">Time</div>
                      <div className="font-mono font-bold text-gray-700">{formatTime(entry.time)}</div>
                    </div>
                  </div>
                </button>

                {/* Expanded Content */}
                {expandedIndex === idx && (
                  <div className="bg-gray-50/50 border-t border-gray-100 p-6 flex flex-col items-center animate-in slide-in-from-top-2 duration-300">
                    <div className="flex flex-col gap-1.5">
                      {entry.guessesList.map((guess, rowIndex) => {
                        const statuses = getLetterStatus(guess, entry.solution);
                        return (
                          <div key={rowIndex} className="flex gap-1.5">
                            {guess.split('').map((char, colIndex) => {
                              const s = statuses[colIndex];
                              let bgColor = 'bg-slate-300';
                              if (s === 'correct') bgColor = 'bg-[#007A33]';
                              if (s === 'present') bgColor = 'bg-[#F47920]';

                              return (
                                <div
                                  key={colIndex}
                                  className={`w-8 h-8 md:w-10 md:h-10 flex items-center justify-center text-white font-black text-sm md:text-base rounded-sm shadow-sm ${bgColor}`}
                                >
                                  {char}
                                </div>
                              );
                            })}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {!isUnlocked && entries.length > 0 && (
        <div className="bg-orange-50/50 px-6 py-3 text-[10px] text-center font-bold text-orange-700 uppercase border-t border-orange-100 tracking-widest">
          Solve the daily puzzle to inspect player strategies
        </div>
      )}
    </div>
  );
};

export default Leaderboard;
