import type { UserProgress, GameHistory, Badge } from '../types';
import { AVAILABLE_BADGES, checkBadgeEarned } from '../data/badges';

const STORAGE_KEY = 'birdie_user_progress';

export const getDefaultProgress = (): UserProgress => ({
  totalGamesPlayed: 0,
  history: [],
  muteSounds: false,
  consecutivePerfectScores: 0,
  earnedBadges: [],
  allTimePerfectScores: 0,
});

export const loadProgress = (): UserProgress => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return getDefaultProgress();

    const parsed = JSON.parse(stored);

    // Migration: handle old format
    if ('lastPlayDate' in parsed || 'streak' in parsed) {
      return {
        ...getDefaultProgress(),
        totalGamesPlayed: parsed.totalGamesPlayed || 0,
        history: parsed.history || [],
        muteSounds: parsed.muteSounds || false,
      };
    }

    return parsed;
  } catch (error) {
    console.error('Failed to load progress:', error);
    return getDefaultProgress();
  }
};

export const saveProgress = (progress: UserProgress): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch (error) {
    console.error('Failed to save progress:', error);
  }
};

export const addGameToHistory = (
  progress: UserProgress,
  history: GameHistory,
  isPerfectScore: boolean
): UserProgress => {
  const updatedHistory = [...progress.history, history];

  // Update consecutive perfect scores
  const newConsecutive = isPerfectScore
    ? progress.consecutivePerfectScores + 1
    : 0;

  // Update all-time perfect scores
  const newAllTimePerfect = isPerfectScore
    ? progress.allTimePerfectScores + 1
    : progress.allTimePerfectScores;

  const updatedProgress = {
    ...progress,
    totalGamesPlayed: progress.totalGamesPlayed + 1,
    history: updatedHistory,
    consecutivePerfectScores: newConsecutive,
    allTimePerfectScores: newAllTimePerfect,
  };

  // Check for newly earned badges
  const newlyEarnedBadges = checkForNewBadges(updatedProgress);

  return {
    ...updatedProgress,
    earnedBadges: [...progress.earnedBadges, ...newlyEarnedBadges],
  };
};

export const checkForNewBadges = (progress: UserProgress): Badge[] => {
  const newBadges: Badge[] = [];
  const earnedBadgeIds = new Set(progress.earnedBadges.map(b => b.id));

  AVAILABLE_BADGES.forEach((badge) => {
    if (!earnedBadgeIds.has(badge.id) && checkBadgeEarned(badge.id, progress)) {
      newBadges.push({
        ...badge,
        earnedDate: new Date().toISOString(),
      });
    }
  });

  return newBadges;
};

export const getDateString = (): string => {
  const now = new Date();
  return now.toISOString().split('T')[0];
};

export const toggleMute = (progress: UserProgress): UserProgress => {
  return {
    ...progress,
    muteSounds: !progress.muteSounds,
  };
};
