import { useState, useEffect, useMemo } from 'react';
import confetti from 'canvas-confetti';
import type { GameSet, BirdOption } from '../types';
import { audioManager } from '../utils/audio';
import { getActiveValentineEvent } from '../config/events';
import { generateHearts, type Heart } from '../utils/hearts';

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
  const [mobileCurrentBird, setMobileCurrentBird] = useState(0);
  const [animatingHearts, setAnimatingHearts] = useState<Heart[]>([]);
  const set = sets[currentSet];
  const valentineEvent = getActiveValentineEvent();

  // Get Valentine's fact from a random correct bird in this set
  const valentineFactForRound = useMemo(() => {
    if (!set.revealed || !valentineEvent) return null;

    const correctBirds = set.birds.filter((bird) => {
      const userAnswer = set.userAnswers.get(bird.id);
      return userAnswer === bird.name && bird.valentinesFact;
    });

    if (correctBirds.length === 0) return null;

    const randomBird = correctBirds[Math.floor(Math.random() * correctBirds.length)];
    return { bird: randomBird, fact: randomBird.valentinesFact };
  }, [set.revealed, set.birds, set.userAnswers, valentineEvent]);

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

  // Reset mobile bird index when set changes
  useEffect(() => {
    setMobileCurrentBird(0);
  }, [currentSet]);

  useEffect(() => {
    audioManager.setMuted(isMuted);
  }, [isMuted]);

  // Start ambient background sounds when game loads
  useEffect(() => {
    if (!isMuted) {
      audioManager.playAmbient();
    }
    return () => {
      audioManager.stopAmbient();
    };
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

      // Show hearts if Valentine's event is active, otherwise show flying birds
      if (valentineEvent) {
        // Generate hearts for each correct bird
        const hearts = generateHearts(correctBirds.length);
        setAnimatingHearts(hearts);

        // Clear hearts after animation completes
        setTimeout(() => {
          setAnimatingHearts([]);
        }, 2000);
      } else {
        setTimeout(() => {
          setFlyingBirds(new Set(correctBirds));
        }, 100);
      }
    } else {
      setFlyingBirds(new Set());
      setAnimatingHearts([]);
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
      {/* Heart animation overlay for Valentine's event */}
      {valentineEvent && animatingHearts.length > 0 && (
        <div className="heart-animation-container">
          {animatingHearts.map((heart) => (
            <div
              key={heart.id}
              className="floating-heart"
              style={{
                left: `${heart.x}%`,
                top: `${heart.y}%`,
              }}
            >
              ❤️
            </div>
          ))}
        </div>
      )}

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
          {set.birds.map((bird, index) => (
            <div
              key={bird.id}
              className={`bird-container ${index === mobileCurrentBird ? 'mobile-visible' : 'mobile-hidden'}`}
            >
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
          <>
            <div className="mobile-controls">
              <button
                className="nav-arrow prev-arrow"
                onClick={() => setMobileCurrentBird(Math.max(0, mobileCurrentBird - 1))}
                disabled={mobileCurrentBird === 0}
                aria-label="Previous bird"
              >
                ← PREV
              </button>
              <div className="bird-counter">
                Bird {mobileCurrentBird + 1} of {set.birds.length}
              </div>
              <button
                className="nav-arrow next-arrow"
                onClick={() => setMobileCurrentBird(Math.min(set.birds.length - 1, mobileCurrentBird + 1))}
                disabled={mobileCurrentBird === set.birds.length - 1}
                aria-label="Next bird"
              >
                NEXT →
              </button>
            </div>
            <button
              className="submit-button"
              onClick={onSubmit}
              disabled={!isAllAnswered}
            >
              SUBMIT
            </button>
            <div className="mobile-bird-nav revealed">
              {set.birds.map((_, index) => (
                <button
                  key={index}
                  className={`bird-nav-dot ${index === mobileCurrentBird ? 'active' : ''}`}
                  onClick={() => setMobileCurrentBird(index)}
                  aria-label={`Bird ${index + 1}`}
                />
              ))}
            </div>
          </>
        ) : (
          <>
            <button className="next-button" onClick={onNext}>
              {currentSet < sets.length - 1 ? 'NEXT SET' : 'SEE RESULTS'}
            </button>
            {valentineFactForRound && valentineEvent && (
              <div className="between-rounds-valentine">
                <div className="valentine-heart-icon">💕</div>
                <h3>{valentineFactForRound.bird.name}</h3>
                <p>{valentineFactForRound.fact}</p>
              </div>
            )}
            <div className="mobile-bird-nav revealed">
              {set.birds.map((_, index) => (
                <button
                  key={index}
                  className={`bird-nav-dot ${index === mobileCurrentBird ? 'active' : ''}`}
                  onClick={() => setMobileCurrentBird(index)}
                  aria-label={`Bird ${index + 1}`}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Game;
