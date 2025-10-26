export interface Bird {
  id: number;
  name: string;
  scientificName: string;
  image: string;
  facts: string[];
}

export interface BirdOption {
  bird: Bird;
  isCorrect: boolean;
}

export interface GameState {
  currentSet: number;
  totalSets: number;
  birdsPerSet: number;
  sets: GameSet[];
  score: number;
  completed: boolean;
}

export interface GameSet {
  birds: Bird[];
  options: Map<number, BirdOption[]>;
  userAnswers: Map<number, string>;
  revealed: boolean;
}

export interface GameHistory {
  date: string;
  score: number;
  totalBirds: number;
  playedBirds: Bird[];
  correctBirds: number[];
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  requirement: string;
  earnedDate?: string;
  level?: number;
}

export interface UserProgress {
  totalGamesPlayed: number;
  history: GameHistory[];
  muteSounds: boolean;
  consecutivePerfectScores: number;
  earnedBadges: Badge[];
  allTimePerfectScores: number;
}

export type Screen = 'landing' | 'game' | 'score' | 'about-game' | 'about-us' | 'badges';
