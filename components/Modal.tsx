
import React from 'react';
import { X } from 'lucide-react';
import { Statistics } from '../types';
import { formatTime } from '../utils';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children, footer }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200 border border-gray-100">
        <div className="flex justify-between items-center p-6 border-b border-gray-100">
          <h2 className="text-xl font-bold text-[#002D72]">{title}</h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-full transition-colors">
            <X size={24} className="text-gray-500" />
          </button>
        </div>
        <div className="p-6">
          {children}
        </div>
        {footer && (
          <div className="p-6 border-t border-gray-100 bg-gray-50">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};

interface StatsContentProps {
  stats: Statistics;
  rank?: number | null;
}

export const StatsContent: React.FC<StatsContentProps> = ({ stats, rank }) => {
  const statItems = [
    { label: 'Played', value: stats.gamesPlayed },
    { label: 'Win %', value: stats.gamesPlayed ? Math.round((stats.gamesWon / stats.gamesPlayed) * 100) : 0 },
    { label: 'Streak', value: stats.currentStreak },
  ];

  return (
    <div>
      <div className="grid grid-cols-3 gap-4 mb-8">
        {statItems.map((item, i) => (
          <div key={i} className="text-center">
            <div className="text-3xl font-black text-[#002D72]">{item.value}</div>
            <div className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">{item.label}</div>
          </div>
        ))}
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        {stats.bestTime !== null && (
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Best Time</div>
            <div className="text-2xl font-black text-[#002D72]">{formatTime(stats.bestTime)}</div>
          </div>
        )}
        {rank !== undefined && rank !== null && (
          <div className="text-center p-4 bg-[#002D72] rounded-lg">
            <div className="text-[10px] font-bold text-gray-300 uppercase tracking-widest mb-1">Current Rank</div>
            <div className="text-2xl font-black text-white">#{rank}</div>
          </div>
        )}
      </div>
    </div>
  );
};
