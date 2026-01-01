import { useState, useEffect, useMemo } from 'react';
import type { Bird, BirdOption } from '../types';
import { audioManager } from '../utils/audio';

interface BirdieProGameProps {
  birds: Bird[];
  onSubmit: (score: number) => void;
  isMuted: boolean;
}

interface ProGameState {
  currentBirdIndex: number;
  userAnswers: Map<number, string>;
  revealed: boolean;
}

const BirdieProGame = ({ birds, onSubmit, isMuted }: BirdieProGameProps) => {
  const [gameState, setGameState] = useState<ProGameState>({
    currentBirdIndex: 0,
    userAnswers: new Map(),
    revealed: false,
  });

  const currentBird = birds[gameState.currentBirdIndex];
  const allAnswered = gameState.userAnswers.size === birds.length;

  // Generate options for current bird
  const currentOptions = useMemo(() => {
    if (!currentBird) return [];

    const correctBird = currentBird;
    const wrongBirds = birds.filter(b => b.id !== correctBird.id).sort(() => Math.random() - 0.5).slice(0, 2);
    const allOptions = [correctBird, ...wrongBirds].sort(() => Math.random() - 0.5);

    return allOptions.map((bird): BirdOption => ({
      bird,
      isCorrect: bird.id === correctBird.id,
    }));
  }, [currentBird, birds]);

  useEffect(() => {
    audioManager.setMuted(isMuted);
  }, [isMuted]);

  // Start ambient when component mounts
  useEffect(() => {
    if (!isMuted) {
      audioManager.playAmbient();
    }
    return () => {
      audioManager.stopAmbient();
    };
  }, [isMuted]);

  const handleSelectAnswer = (birdName: string) => {
    setGameState(prev => {
      const newAnswers = new Map(prev.userAnswers);
      newAnswers.set(currentBird.id, birdName);
      return {
        ...prev,
        userAnswers: newAnswers,
      };
    });
  };

  const handleNext = () => {
    if (gameState.currentBirdIndex < birds.length - 1) {
      setGameState(prev => ({
        ...prev,
        currentBirdIndex: prev.currentBirdIndex + 1,
      }));
    }
  };

  const handlePrevious = () => {
    if (gameState.currentBirdIndex > 0) {
      setGameState(prev => ({
        ...prev,
        currentBirdIndex: prev.currentBirdIndex - 1,
      }));
    }
  };

  const handleSubmit = () => {
    setGameState(prev => ({
      ...prev,
      revealed: true,
    }));

    // Calculate score
    let score = 0;
    birds.forEach(bird => {
      const userAnswer = gameState.userAnswers.get(bird.id);
      if (userAnswer === bird.name) {
        score++;
      }
    });

    // Play sounds
    if (score === birds.length) {
      audioManager.playPerfect();
    } else if (score > birds.length * 0.7) {
      audioManager.playCorrect();
    } else {
      audioManager.playWrong();
    }

    // Call onSubmit after a delay
    setTimeout(() => {
      onSubmit(score);
    }, 1500);
  };

  const userAnswer = gameState.userAnswers.get(currentBird.id);
  const progress = ((gameState.currentBirdIndex + 1) / birds.length) * 100;

  return (
    <div className="game-container">
      <div className="game-header">
        <h2 style={{ color: '#FFD700' }}>🔥 BIRDIE PRO 🔥</h2>
        <p className="progress-indicator">
          Bird {gameState.currentBirdIndex + 1} of {birds.length}
        </p>
        <div className="progress-bar-container">
          <div
            className="progress-bar-fill pro-gradient"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="bird-wire">
        <div className="wire"></div>
        <div className="birds-on-wire">
          {birds.map((bird, index) => {
            const options = currentOptions;
            const isCurrentBird = index === gameState.currentBirdIndex;
            return (
              <div
                key={bird.id}
                className={`bird-container ${isCurrentBird ? 'mobile-visible' : 'mobile-hidden'}`}
              >
                <div className="bird-image-wrapper">
                  <img
                    src={bird.image}
                    alt="Mystery bird"
                    className="bird-image"
                  />
                </div>
                <div className="bird-options">
                  {options.map((option, idx) => {
                    const isSelected = userAnswer === option.bird.name;
                    return (
                      <button
                        key={idx}
                        className={`option-button ${isSelected ? 'selected' : ''}`}
                        onClick={() => handleSelectAnswer(option.bird.name)}
                        disabled={gameState.revealed}
                      >
                        {option.bird.name}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="game-actions">
        {!gameState.revealed ? (
          <>
            <div className="mobile-controls">
              <button
                className="nav-arrow prev-arrow"
                onClick={handlePrevious}
                disabled={gameState.currentBirdIndex === 0}
                aria-label="Previous bird"
              >
                ← PREV
              </button>
              <div className="bird-counter">
                Bird {gameState.currentBirdIndex + 1} of {birds.length}
              </div>
              <button
                className="nav-arrow next-arrow"
                onClick={handleNext}
                disabled={gameState.currentBirdIndex === birds.length - 1}
                aria-label="Next bird"
              >
                NEXT →
              </button>
            </div>
            <button
              className="submit-button pro-button"
              onClick={handleSubmit}
              disabled={!allAnswered}
            >
              {allAnswered ? 'SUBMIT ALL ANSWERS' : `Answer ${gameState.userAnswers.size}/${birds.length}`}
            </button>
            <div className="mobile-bird-nav">
              {birds.map((_, index) => (
                <button
                  key={index}
                  className={`bird-nav-dot ${index === gameState.currentBirdIndex ? 'active' : ''}`}
                  onClick={() => {
                    setGameState(prev => ({
                      ...prev,
                      currentBirdIndex: index,
                    }));
                  }}
                  aria-label={`Bird ${index + 1}`}
                />
              ))}
            </div>
          </>
        ) : (
          <>
            <div className="pro-submitting" style={{ padding: '1rem', textAlign: 'center' }}>
              Calculating your score...
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default BirdieProGame;
