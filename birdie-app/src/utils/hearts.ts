/**
 * Heart animation utilities for Valentine's Heart Event
 */

export interface Heart {
  id: string;
  x: number; // Starting X position
  y: number; // Starting Y position
}

/**
 * Generate random hearts for animation
 * @param count - Number of hearts to generate
 * @returns Array of heart objects with random positions
 */
export const generateHearts = (count: number): Heart[] => {
  const hearts: Heart[] = [];

  for (let i = 0; i < count; i++) {
    hearts.push({
      id: `heart-${Date.now()}-${i}`,
      x: Math.random() * 100, // Random X percentage (0-100)
      y: 50 + Math.random() * 20, // Random Y around center
    });
  }

  return hearts;
};

/**
 * Format hearts display string
 * @param hearts - Number of hearts
 * @returns Formatted string like "7 ❤️"
 */
export const formatHearts = (hearts: number): string => {
  return `${hearts} ❤️`;
};

/**
 * Format combined display (hearts and original fraction)
 * @param hearts - Number of hearts
 * @param correct - Number correct
 * @param total - Total birds
 * @returns Formatted string like "7 ❤️ / 7/9"
 */
export const formatHeartsWithScore = (hearts: number, correct: number, total: number): string => {
  return `${formatHearts(hearts)} / ${correct}/${total}`;
};
