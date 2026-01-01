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
  birdiePro: {
    lastAttempt: null,
    bestScore: 0,
    totalAttempts: 0,
  },
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

export const canPlayBirdieProNow = (progress: UserProgress): boolean => {
  if (!progress.birdiePro.lastAttempt) {
    return true; // First time
  }

  const lastAttempt = new Date(progress.birdiePro.lastAttempt);
  const now = new Date();
  const hoursDiff = (now.getTime() - lastAttempt.getTime()) / (1000 * 60 * 60);

  return hoursDiff >= 24;
};

export const getTimeUntilNextBirdieProAttempt = (progress: UserProgress): number => {
  if (!progress.birdiePro.lastAttempt) {
    return 0;
  }

  const lastAttempt = new Date(progress.birdiePro.lastAttempt);
  const nextAttempt = new Date(lastAttempt.getTime() + 24 * 60 * 60 * 1000);
  const now = new Date();

  const msUntil = nextAttempt.getTime() - now.getTime();
  return msUntil > 0 ? msUntil : 0;
};

export const updateBirdieProScore = (
  progress: UserProgress,
  score: number
): UserProgress => {
  return {
    ...progress,
    birdiePro: {
      lastAttempt: new Date().toISOString(),
      bestScore: Math.max(progress.birdiePro.bestScore, score),
      totalAttempts: progress.birdiePro.totalAttempts + 1,
    },
  };
};
