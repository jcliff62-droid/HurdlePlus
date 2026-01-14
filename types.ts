
export type LetterStatus = 'correct' | 'present' | 'absent' | 'empty';

export interface GameState {
  guesses: string[];
  currentGuess: string;
  solution: string;
  gameStatus: 'playing' | 'won' | 'lost';
  isInvalidWord: boolean;
}

export interface Statistics {
  gamesPlayed: number;
  gamesWon: number;
  currentStreak: number;
  maxStreak: number;
  bestTime: number | null;
}

export interface LeaderboardEntry {
  name: string;
  guesses: number;
  time: number;
  guessesList: string[];
  solution: string;
}
