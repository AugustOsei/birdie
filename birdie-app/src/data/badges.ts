import type { Badge } from '../types';

export const AVAILABLE_BADGES: Omit<Badge, 'earnedDate'>[] = [
  {
    id: 'level-1-birder',
    name: 'Certified Level 1 Birder',
    description: 'Achieved 3 perfect scores in a row',
    icon: '🏅',
    requirement: '3 consecutive perfect scores',
    level: 1,
  },
  {
    id: 'level-2-birder',
    name: 'Certified Level 2 Birder',
    description: 'Achieved 5 perfect scores in a row',
    icon: '🥈',
    requirement: '5 consecutive perfect scores',
    level: 2,
  },
  {
    id: 'level-3-birder',
    name: 'Certified Level 3 Birder',
    description: 'Achieved 10 perfect scores in a row',
    icon: '🥇',
    requirement: '10 consecutive perfect scores',
    level: 3,
  },
  {
    id: 'beginners-luck',
    name: "Beginner's Luck",
    description: 'Got a perfect score on your first try',
    icon: '🍀',
    requirement: 'Perfect score on first game',
  },
  {
    id: 'dedicated-player',
    name: 'Dedicated Player',
    description: 'Played 50 games',
    icon: '🎮',
    requirement: 'Play 50 games',
  },
  {
    id: 'perfectionist',
    name: 'Perfectionist',
    description: 'Achieved 10 perfect scores total',
    icon: '💎',
    requirement: '10 perfect scores (total)',
  },
  {
    id: 'love-birds',
    name: 'Love Birds',
    description: 'Achieved a perfect score in Love Birds Challenge',
    icon: '💕',
    requirement: 'Get 14/14 correct in Love Birds Challenge',
  },
];

export const checkBadgeEarned = (
  badgeId: string,
  progress: any
): boolean => {
  switch (badgeId) {
    case 'level-1-birder':
      return progress.consecutivePerfectScores >= 3;
    case 'level-2-birder':
      return progress.consecutivePerfectScores >= 5;
    case 'level-3-birder':
      return progress.consecutivePerfectScores >= 10;
    case 'beginners-luck':
      return progress.totalGamesPlayed === 1 && progress.allTimePerfectScores === 1;
    case 'dedicated-player':
      return progress.totalGamesPlayed >= 50;
    case 'perfectionist':
      return progress.allTimePerfectScores >= 10;
    case 'love-birds':
      return progress.loveBirds?.perfectScores > 0;
    default:
      return false;
  }
};
