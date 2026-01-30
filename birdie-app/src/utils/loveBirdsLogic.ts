import type { Bird, LoveBirdsQuestion, LoveBirdsGameState } from '../types';
import { shuffleArray } from './gameLogic';

// IDs of birds that mate for life (Love Birds)
export const LOVE_BIRD_IDS = [3, 4, 9, 10, 2, 13, 15, 17, 21, 23, 24, 25, 45, 36, 26, 38];

export const isLoveBird = (birdId: number): boolean => {
  return LOVE_BIRD_IDS.includes(birdId);
};

export const getLoveBirds = (allBirds: Bird[]): Bird[] => {
  return allBirds.filter(bird => LOVE_BIRD_IDS.includes(bird.id));
};

export const getNonLoveBirds = (allBirds: Bird[]): Bird[] => {
  return allBirds.filter(bird => !LOVE_BIRD_IDS.includes(bird.id));
};

export const generateLoveBirdsGame = (allBirds: Bird[]): LoveBirdsGameState => {
  const loveBirds = getLoveBirds(allBirds);
  const nonLoveBirds = getNonLoveBirds(allBirds);

  // Select 14 random Love Birds for questions
  const selectedLoveBirds = shuffleArray(loveBirds).slice(0, 14);

  const questions: LoveBirdsQuestion[] = selectedLoveBirds.map((loveBird, index) => {
    // Select 2 random Non-Love Birds for wrong answers
    const wrongBirds = shuffleArray(nonLoveBirds).slice(0, 2);

    // Combine and shuffle all 3 options
    const options = shuffleArray([loveBird, ...wrongBirds]);

    return {
      questionNumber: index + 1,
      correctBird: loveBird,
      wrongBirds,
      options,
      userAnswer: null,
      isCorrect: null,
    };
  });

  return {
    questions,
    currentQuestion: 0,
    score: 0,
    completed: false,
  };
};

export const calculateLoveBirdsScore = (questions: LoveBirdsQuestion[]): number => {
  return questions.filter(q => q.isCorrect === true).length;
};
