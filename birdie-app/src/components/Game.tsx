import { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import type { GameSet, BirdOption } from '../types';
import { audioManager } from '../utils/audio';

interface GameProps {
  sets: GameSet[];
  currentSet: number;
  onSubmit: () => void;
  onNext: () => void;
  onSelectAnswer: (birdId: number, answer: string) => void;
  isMuted: boolean;
}

const Game = ({
  sets,
  currentSet,
  onSubmit,
  onNext,
  onSelectAnswer,
  isMuted,
}: GameProps) => {
  const [flyingBirds, setFlyingBirds] = useState<Set<number>>(new Set());
  const [birdAnimations, setBirdAnimations] = useState<Map<number, string>>(new Map());
  const set = sets[currentSet];

  // Assign random fly-away animations to each bird
  useEffect(() => {
    const animations = new Map<number, string>();
    const animationTypes = ['flying-up', 'flying-diagonal', 'flying-spiral'];

    set.birds.forEach((bird) => {
      const randomAnimation = animationTypes[Math.floor(Math.random() * animationTypes.length)];
      animations.set(bird.id, randomAnimation);
    });

    setBirdAnimations(animations);
  }, [set.birds]);

  useEffect(() => {
    audioManager.setMuted(isMuted);
  }, [isMuted]);

  useEffect(() => {
    if (set.revealed) {
      const correctBirds: number[] = [];
      const wrongBirds: number[] = [];

      set.birds.forEach((bird) => {
        const userAnswer = set.userAnswers.get(bird.id);
        if (userAnswer === bird.name) {
          correctBirds.push(bird.id);
        } else {
          wrongBirds.push(bird.id);
        }
      });

      // Play sounds based on results
      if (correctBirds.length === set.birds.length) {
        // Perfect set! Play celebration sound and confetti
        audioManager.playPerfect();
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#58CC02', '#4A90E2', '#FFD700', '#FF6B6B'],
        });
      } else if (correctBirds.length > 0) {
        // Some correct
        audioManager.playCorrect();
        audioManager.playWhoosh();
      }

      if (wrongBirds.length > 0) {
        // Some wrong
        setTimeout(() => audioManager.playWrong(), 400);
      }

      setTimeout(() => {
        setFlyingBirds(new Set(correctBirds));
      }, 100);
    } else {
      setFlyingBirds(new Set());
    }
  }, [set.revealed, set.birds, set.userAnswers]);

  const isAllAnswered = set.birds.every((bird) => set.userAnswers.has(bird.id));

  const getOptionClass = (bird: { id: number; name: string }, option: BirdOption): string => {
    const userAnswer = set.userAnswers.get(bird.id);
    const isSelected = userAnswer === option.bird.name;

    if (!set.revealed) {
      return isSelected ? 'selected' : '';
    }

    if (option.isCorrect) {
      return 'correct';
    }

    if (isSelected && !option.isCorrect) {
      return 'incorrect';
    }

    return '';
  };

  return (
    <div className="game-container">
      <div className="game-header">
        <h2>Identify the Birds</h2>
        <p className="progress-indicator">
          Set {currentSet + 1} of {sets.length}
        </p>
        <div className="progress-bar-container">
          <div
            className="progress-bar-fill"
            style={{ width: `${((currentSet + 1) / sets.length) * 100}%` }}
          />
        </div>
      </div>

      <div className="bird-wire">
        <div className="wire"></div>
        <div className="birds-on-wire">
          {set.birds.map((bird) => (
            <div key={bird.id} className="bird-container">
              <div className="bird-image-wrapper">
                <img
                  src={bird.image}
                  alt="Mystery bird"
                  className={`bird-image ${
                    flyingBirds.has(bird.id) ? birdAnimations.get(bird.id) || 'flying-up' : ''
                  }`}
                />
              </div>
              <div className="bird-options">
                {set.options.get(bird.id)?.map((option, idx) => (
                  <button
                    key={idx}
                    className={`option-button ${getOptionClass(bird, option)}`}
                    onClick={() => onSelectAnswer(bird.id, option.bird.name)}
                    disabled={set.revealed}
                  >
                    {option.bird.name}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="game-actions">
        {!set.revealed ? (
          <button
            className="submit-button"
            onClick={onSubmit}
            disabled={!isAllAnswered}
          >
            SUBMIT
          </button>
        ) : (
          <button className="next-button" onClick={onNext}>
            {currentSet < sets.length - 1 ? 'NEXT SET' : 'SEE RESULTS'}
          </button>
        )}
      </div>
    </div>
  );
};

export default Game;
