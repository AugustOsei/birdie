import type { Bird, GameSet, BirdOption } from '../types';

export const shuffleArray = <T,>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

export const getRandomBirds = (allBirds: Bird[], count: number): Bird[] => {
  const shuffled = shuffleArray(allBirds);
  return shuffled.slice(0, count);
};

export const generateWrongOptions = (
  correctBird: Bird,
  allBirds: Bird[],
  count: number = 2
): Bird[] => {
  const otherBirds = allBirds.filter((b) => b.id !== correctBird.id);
  const shuffled = shuffleArray(otherBirds);
  return shuffled.slice(0, count);
};

export const createGameSet = (birds: Bird[], allBirds: Bird[]): GameSet => {
  const options = new Map<number, BirdOption[]>();

  birds.forEach((bird) => {
    const wrongOptions = generateWrongOptions(bird, allBirds, 2);
    const birdOptions: BirdOption[] = [
      { bird, isCorrect: true },
      { bird: wrongOptions[0], isCorrect: false },
      { bird: wrongOptions[1], isCorrect: false },
    ];
    options.set(bird.id, shuffleArray(birdOptions));
  });

  return {
    birds,
    options,
    userAnswers: new Map(),
    revealed: false,
  };
};

export const generateDailyGame = (allBirds: Bird[]): GameSet[] => {
  const totalBirds = 9;
  const birdsPerSet = 3;
  const numSets = totalBirds / birdsPerSet;

  const selectedBirds = getRandomBirds(allBirds, totalBirds);
  const sets: GameSet[] = [];

  for (let i = 0; i < numSets; i++) {
    const startIdx = i * birdsPerSet;
    const setBirds = selectedBirds.slice(startIdx, startIdx + birdsPerSet);
    sets.push(createGameSet(setBirds, allBirds));
  }

  return sets;
};

export const calculateScore = (sets: GameSet[]): number => {
  let correct = 0;

  sets.forEach((set) => {
    set.birds.forEach((bird) => {
      const userAnswer = set.userAnswers.get(bird.id);
      if (userAnswer === bird.name) {
        correct++;
      }
    });
  });

  return correct;
};

export const getRandomFacts = (birds: Bird[], count: number = 3): { bird: Bird; fact: string }[] => {
  const shuffledBirds = shuffleArray(birds).slice(0, count);
  return shuffledBirds.map((bird) => ({
    bird,
    fact: bird.facts[Math.floor(Math.random() * bird.facts.length)],
  }));
};

export const generateShareText = (score: number, total: number, streak: number): string => {
  return `I got ${score}/${total} birds correct in Birdie! ${streak > 1 ? `Day ${streak} streak!` : ''}\n\nCan you beat my score? Play now at [your-url]`;
};
