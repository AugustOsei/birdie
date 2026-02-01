import { useState, useEffect } from 'react';
import type { LoveBirdsGameState } from '../types';
import { audioManager } from '../utils/audio';

interface LoveBirdsGameProps {
  gameState: LoveBirdsGameState;
  onSelectBird: (questionIndex: number, birdId: number) => void;
  isMuted: boolean;
}

const LoveBirdsGame = ({
  gameState,
  onSelectBird,
  isMuted,
}: LoveBirdsGameProps) => {
  const [feedbackBirdId, setFeedbackBirdId] = useState<number | null>(null);
  const [feedbackCorrect, setFeedbackCorrect] = useState<boolean | null>(null);

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

  const currentQuestion = gameState.questions[gameState.currentQuestion];

  const handleSelectBird = (birdId: number) => {
    const isCorrect = birdId === currentQuestion.correctBird.id;
    setFeedbackBirdId(birdId);
    setFeedbackCorrect(isCorrect);

    // Play sound
    if (isCorrect) {
      audioManager.playCorrect();
    } else {
      audioManager.playWrong();
    }

    // Auto-advance after 1.5 seconds
    setTimeout(() => {
      onSelectBird(gameState.currentQuestion, birdId);
      setFeedbackBirdId(null);
      setFeedbackCorrect(null);
    }, 1500);
  };

  const isAnswered = currentQuestion.userAnswer !== null;

  return (
    <div className="love-birds-game">
      <div className="love-birds-header">
        <h1>💕 Love Birds Challenge 💕</h1>
        <p className="love-birds-progress">
          Question {currentQuestion.questionNumber} of 14
        </p>
        <div className="progress-bar-container">
          <div
            className="progress-bar-fill"
            style={{ width: `${(currentQuestion.questionNumber / 14) * 100}%` }}
          />
        </div>
      </div>

      <div className="love-birds-question">
        <h2>Which one bird mates for life?</h2>
        <div className="birds-grid">
          {currentQuestion.options.map((bird) => {
            const isSelected = feedbackBirdId === bird.id;
            const showFeedback = isSelected && feedbackCorrect !== null;

            let optionClass = 'bird-option';
            if (isAnswered) {
              optionClass += ' disabled';
            }
            if (showFeedback) {
              optionClass += feedbackCorrect ? ' selected correct' : ' selected incorrect';
            }

            return (
              <div
                key={bird.id}
                className={optionClass}
                onClick={() => !isAnswered && handleSelectBird(bird.id)}
              >
                <img src={bird.image} alt={bird.name} />
                <div className="bird-option-name">{bird.name}</div>
                {showFeedback && (
                  <div className="feedback-icon">
                    {feedbackCorrect ? '✅' : '❌'}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default LoveBirdsGame;
