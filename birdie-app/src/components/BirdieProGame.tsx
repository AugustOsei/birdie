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
    <div className="birdie-pro-game-container">
      <div className="pro-game-header">
        <h2>🔥 BIRDIE PRO 🔥</h2>
        <p className="pro-progress-text">
          Bird {gameState.currentBirdIndex + 1} of {birds.length}
        </p>
        <div className="pro-progress-bar-container">
          <div
            className="pro-progress-bar-fill"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="pro-game-content">
        <div className="pro-bird-container">
          <img
            src={currentBird.image}
            alt="Mystery bird"
            className="pro-bird-image"
          />
        </div>

        <div className="pro-options-container">
          {currentOptions.map((option, idx) => {
            const isSelected = userAnswer === option.bird.name;
            return (
              <button
                key={idx}
                className={`pro-option-button ${isSelected ? 'selected' : ''}`}
                onClick={() => handleSelectAnswer(option.bird.name)}
                disabled={gameState.revealed}
              >
                {option.bird.name}
              </button>
            );
          })}
        </div>
      </div>

      <div className="pro-game-actions">
        <button
          className="pro-nav-button prev-btn"
          onClick={handlePrevious}
          disabled={gameState.currentBirdIndex === 0}
          aria-label="Previous bird"
        >
          ← PREV
        </button>

        <div className="pro-answer-indicator">
          {userAnswer ? (
            <span className="answer-selected">✓ Selected</span>
          ) : (
            <span className="answer-needed">⚠ Need Answer</span>
          )}
        </div>

        <button
          className="pro-nav-button next-btn"
          onClick={handleNext}
          disabled={gameState.currentBirdIndex === birds.length - 1}
          aria-label="Next bird"
        >
          NEXT →
        </button>
      </div>

      <div className="pro-submit-section">
        {!gameState.revealed ? (
          <button
            className="pro-submit-button"
            onClick={handleSubmit}
            disabled={!allAnswered}
          >
            {allAnswered ? 'SUBMIT ALL ANSWERS' : `Answer ${gameState.userAnswers.size}/${birds.length}`}
          </button>
        ) : (
          <div className="pro-submitting">
            Calculating your score...
          </div>
        )}
      </div>
    </div>
  );
};

export default BirdieProGame;
