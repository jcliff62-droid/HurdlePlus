
import React, { useState, useEffect, useCallback } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import Board from './components/Board';
import Keyboard from './components/Keyboard';
import Leaderboard from './components/Leaderboard';
import { Modal, StatsContent } from './components/Modal';
import { GameState, Statistics, LeaderboardEntry } from './types';
import { getDailyWord, getDayKey, getNextWordCountdown } from './utils';
import { User, Clock } from 'lucide-react';
import confetti from 'canvas-confetti';

const INITIAL_STATS: Statistics = {
  gamesPlayed: 0,
  gamesWon: 0,
  currentStreak: 0,
  maxStreak: 0,
  bestTime: null,
};

const App: React.FC = () => {
  const dayKey = getDayKey();
  
  const [userName, setUserName] = useState<string>(() => localStorage.getItem('hurdleplus_user') || '');
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>(() => {
    const saved = localStorage.getItem('hurdleplus_leaderboard');
    return saved ? JSON.parse(saved) : [];
  });

  const [gameState, setGameState] = useState<GameState>(() => {
    const saved = localStorage.getItem(`hurdleplus_game_${dayKey}`);
    if (saved) return JSON.parse(saved);
    
    return {
      guesses: [],
      currentGuess: '',
      solution: getDailyWord(),
      gameStatus: 'playing',
      isInvalidWord: false,
    };
  });

  const [timer, setTimer] = useState(() => {
    const saved = localStorage.getItem(`hurdleplus_timer_${dayKey}`);
    return saved ? parseInt(saved, 10) : 0;
  });

  const [isTimerActive, setIsTimerActive] = useState(() => gameState.guesses.length > 0 && gameState.gameStatus === 'playing');
  const [showStats, setShowStats] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [showNamePrompt, setShowNamePrompt] = useState(!localStorage.getItem('hurdleplus_user'));
  const [tempName, setTempName] = useState('');
  const [nameError, setNameError] = useState('');
  const [countdown, setCountdown] = useState(getNextWordCountdown());

  const [stats, setStats] = useState<Statistics>(() => {
    const saved = localStorage.getItem('hurdleplus_stats');
    return saved ? JSON.parse(saved) : INITIAL_STATS;
  });

  useEffect(() => {
    localStorage.setItem(`hurdleplus_game_${dayKey}`, JSON.stringify(gameState));
    localStorage.setItem(`hurdleplus_timer_${dayKey}`, timer.toString());
  }, [gameState, timer, dayKey]);

  useEffect(() => {
    localStorage.setItem('hurdleplus_stats', JSON.stringify(stats));
  }, [stats]);

  useEffect(() => {
    localStorage.setItem('hurdleplus_leaderboard', JSON.stringify(leaderboard));
  }, [leaderboard]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown(getNextWordCountdown());
      const currentDay = getDayKey();
      if (currentDay !== dayKey) {
        window.location.reload();
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [dayKey]);

  useEffect(() => {
    let interval: number;
    if (isTimerActive && gameState.gameStatus === 'playing') {
      interval = window.setInterval(() => {
        setTimer((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerActive, gameState.gameStatus]);

  const handleNameSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanName = tempName.trim();
    if (!cleanName) return;
    
    const isTaken = leaderboard.some(entry => entry.name.toLowerCase() === cleanName.toLowerCase());
    if (isTaken) {
      setNameError('This handle is already registered.');
      return;
    }

    setUserName(cleanName);
    localStorage.setItem('hurdleplus_user', cleanName);
    setShowNamePrompt(false);
  };

  const handleClearLeaderboard = () => {
    const password = window.prompt('Enter admin code:');
    if (password?.toLowerCase() === 'hyatt') {
      setLeaderboard([]);
    }
  };

  const triggerFireworks = () => {
    const duration = 4 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };
    function randomInRange(min: number, max: number) {
      return Math.random() * (max - min) + min;
    }
    const interval: any = setInterval(function() {
      const timeLeft = animationEnd - Date.now();
      if (timeLeft <= 0) return clearInterval(interval);
      const particleCount = 40 * (timeLeft / duration);
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }, colors: ['#007A33', '#F47920'] });
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }, colors: ['#007A33', '#F47920'] });
    }, 250);
  };

  const onKeyPress = useCallback((key: string) => {
    if (gameState.gameStatus !== 'playing' || showNamePrompt) return;

    if (key === 'ENTER') {
      if (gameState.currentGuess.length !== 5) {
        setGameState(prev => ({ ...prev, isInvalidWord: true }));
        setTimeout(() => setGameState(prev => ({ ...prev, isInvalidWord: false })), 500);
        return;
      }

      const guess = gameState.currentGuess.toUpperCase();
      const newGuesses = [...gameState.guesses, guess];
      const hasWon = guess === gameState.solution;
      const hasLost = !hasWon && newGuesses.length === 6;

      if (!isTimerActive) setIsTimerActive(true);

      setGameState(prev => ({
        ...prev,
        guesses: newGuesses,
        currentGuess: '',
        gameStatus: hasWon ? 'won' : (hasLost ? 'lost' : 'playing'),
      }));

      if (hasWon) {
        triggerFireworks();
        setLeaderboard(prev => [
          ...prev, 
          { 
            name: userName, 
            guesses: newGuesses.length, 
            time: timer,
            guessesList: newGuesses,
            solution: gameState.solution
          }
        ]);
        setStats(prev => {
          const newCurrentStreak = prev.currentStreak + 1;
          return {
            ...prev,
            gamesPlayed: prev.gamesPlayed + 1,
            gamesWon: prev.gamesWon + 1,
            currentStreak: newCurrentStreak,
            maxStreak: Math.max(prev.maxStreak, newCurrentStreak),
            bestTime: prev.bestTime === null ? timer : Math.min(prev.bestTime, timer),
          };
        });
        setTimeout(() => setShowStats(true), 2000);
      } else if (hasLost) {
        setStats(prev => ({
          ...prev,
          gamesPlayed: prev.gamesPlayed + 1,
          currentStreak: 0,
        }));
        setTimeout(() => setShowStats(true), 2000);
      }
    } else if (key === 'BACKSPACE') {
      setGameState(prev => ({ ...prev, currentGuess: prev.currentGuess.slice(0, -1) }));
    } else if (key.length === 1 && /^[a-zA-Z]$/.test(key)) {
      if (gameState.currentGuess.length < 5) {
        setGameState(prev => ({ ...prev, currentGuess: prev.currentGuess + key.toUpperCase() }));
      }
    }
  }, [gameState, isTimerActive, timer, userName, leaderboard, showNamePrompt]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toUpperCase();
      if (key === 'ENTER' || key === 'BACKSPACE' || (key.length === 1 && /^[A-Z]$/.test(key))) {
        onKeyPress(key);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onKeyPress]);

  // Calculate current user's rank if they've won
  const sortedLeaderboard = [...leaderboard].sort((a, b) => {
    if (a.guesses !== b.guesses) return a.guesses - b.guesses;
    return a.time - b.time;
  });
  const currentUserRank = gameState.gameStatus === 'won' 
    ? sortedLeaderboard.findIndex(e => e.name === userName) + 1 
    : null;

  return (
    <div className="flex flex-col min-h-screen bg-[#F8F9FA] overflow-x-hidden">
      <Header 
        time={timer} 
        onShowStats={() => setShowStats(true)} 
        onShowInfo={() => setShowInfo(true)} 
      />

      <section className="bg-[#f0f2f5] py-12 md:py-24 border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-black text-[#002D72] mb-4 tracking-tight">Today's Hurdle.</h2>
        </div>

        <div className="flex flex-col items-center">
          <Board 
            guesses={gameState.guesses} 
            currentGuess={gameState.currentGuess} 
            solution={gameState.solution} 
            isInvalidWord={gameState.isInvalidWord}
          />
          
          <div className="mt-12 w-full max-w-lg px-4">
            <Keyboard 
              onKeyPress={onKeyPress} 
              guesses={gameState.guesses} 
              solution={gameState.solution} 
            />
          </div>
        </div>
      </section>

      <section className="py-24 bg-[#F8F9FA]">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-black text-[#002D72] uppercase tracking-widest">Scores</h2>
            <div className="h-1 w-12 bg-[#F47920] mx-auto mt-4"></div>
          </div>
          
          <Leaderboard 
            entries={leaderboard} 
            onClear={handleClearLeaderboard} 
            isUnlocked={gameState.gameStatus === 'won' || stats.gamesWon > 0}
          />
        </div>
      </section>

      <Footer />

      <Modal isOpen={showNamePrompt} onClose={() => {}} title="Profile Required">
        <form onSubmit={handleNameSubmit} className="space-y-6">
          <div className="text-center">
            <User className="mx-auto text-[#002D72] mb-4" size={40} />
            <p className="text-slate-600 text-sm leading-relaxed">Enter a player name to save your progress and compete in today's standings.</p>
          </div>
          <input
            autoFocus
            type="text"
            maxLength={15}
            value={tempName}
            onChange={(e) => {
              setTempName(e.target.value);
              setNameError('');
            }}
            placeholder="Username"
            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#002D72] focus:border-transparent outline-none text-center font-bold text-lg"
            required
          />
          {nameError && <p className="text-red-600 text-xs font-bold text-center">{nameError}</p>}
          <button 
            type="submit"
            className="w-full py-4 bg-[#002D72] hover:bg-[#001D4A] text-white font-black rounded-lg transition-all uppercase tracking-[0.2em] text-xs"
          >
            Join Challenge
          </button>
        </form>
      </Modal>

      <Modal 
        isOpen={showStats} 
        onClose={() => setShowStats(false)} 
        title="Your Performance"
        footer={
          <div className="flex flex-col items-center gap-4">
            {gameState.gameStatus !== 'playing' && (
              <div className="text-center mb-2">
                <div className="text-[10px] text-slate-400 uppercase font-black tracking-widest mb-1">Daily Solution</div>
                <div className="text-2xl font-black text-[#002D72] tracking-[0.4em]">{gameState.solution}</div>
              </div>
            )}
            
            {gameState.gameStatus !== 'playing' && (
              <div className="w-full flex flex-col items-center border-t border-gray-200 pt-4 mt-2">
                <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 flex items-center gap-2">
                  <Clock size={12} /> Refresh In
                </div>
                <div className="text-3xl font-black text-[#002D72] tabular-nums tracking-tighter">{countdown}</div>
              </div>
            )}
          </div>
        }
      >
        <StatsContent stats={stats} rank={currentUserRank} />
      </Modal>

      <Modal isOpen={showInfo} onClose={() => setShowInfo(false)} title="Game Mechanics">
        <div className="space-y-6 text-slate-600 text-sm leading-relaxed">
          <p>HurdlePlus is a daily word optimization protocol. You have <strong>6 attempts</strong> to identify the target string.</p>
          
          <div className="space-y-4">
            <h4 className="font-black text-[#002D72] uppercase text-[10px] tracking-widest">Logic Visualization</h4>
            <div className="space-y-3">
              <div className="flex items-center gap-4">
                <div className="w-8 h-8 flex-none flex items-center justify-center bg-[#007A33] text-white font-black rounded-sm">P</div>
                <span className="text-xs">Correct placement. Character is in the target word and correct position.</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-8 h-8 flex-none flex items-center justify-center bg-[#F47920] text-white font-black rounded-sm">L</div>
                <span className="text-xs">Partial match. Character exists in target but is currently misaligned.</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-8 h-8 flex-none flex items-center justify-center bg-slate-400 text-white font-black rounded-sm">A</div>
                <span className="text-xs">Zero match. Character is not present in today's solution.</span>
              </div>
            </div>
          </div>
          
          <div className="p-4 bg-slate-50 rounded border border-slate-100">
            <p className="font-bold text-[#002D72] text-[11px] uppercase tracking-widest mb-1">Time Protocol</p>
            <p className="text-[11px]">The solve clock initiates upon your first submitted guess. Completion times are indexed globally at midnight.</p>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default App;
