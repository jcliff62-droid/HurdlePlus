
import React from 'react';
import { Clock, BarChart2, Info } from 'lucide-react';
import { formatTime } from '../utils';

interface HeaderProps {
  time: number;
  onShowStats: () => void;
  onShowInfo: () => void;
}

const Header: React.FC<HeaderProps> = ({ time, onShowStats, onShowInfo }) => {
  return (
    <nav className="sticky top-0 z-40 w-full bg-[#002D72] text-white shadow-md border-b border-[#001D4A]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo Section */}
          <div className="flex items-center gap-4">
            <div className="flex flex-col">
              <h1 className="text-xl md:text-2xl font-black tracking-tighter">
                Hurdle<span className="text-gray-300">Plus</span>
              </h1>
              <span className="text-[7px] uppercase tracking-[0.3em] font-bold text-gray-400">Premium Daily Word Game</span>
            </div>
          </div>

          {/* Center Timer */}
          <div className="hidden md:flex items-center gap-3 bg-black/20 px-4 py-1.5 rounded border border-white/10">
            <Clock size={14} className="text-gray-400" />
            <span className="font-mono text-base font-bold tracking-widest">{formatTime(time)}</span>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <div className="md:hidden flex items-center gap-2 mr-4 bg-black/20 px-2 py-1 rounded">
              <Clock size={12} className="text-gray-400" />
              <span className="text-xs font-bold font-mono">{formatTime(time)}</span>
            </div>
            
            <button 
              onClick={onShowInfo} 
              className="p-2 hover:bg-white/10 rounded transition-all flex items-center gap-2"
            >
              <Info size={18} />
              <span className="hidden lg:inline text-[10px] font-bold uppercase tracking-widest">Rules</span>
            </button>
            
            <button 
              onClick={onShowStats} 
              className="p-2 hover:bg-white/10 rounded transition-all flex items-center gap-2"
            >
              <BarChart2 size={18} />
              <span className="hidden lg:inline text-[10px] font-bold uppercase tracking-widest">Stats</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Header;
