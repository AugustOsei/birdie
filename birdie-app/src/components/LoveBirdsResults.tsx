import { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import type { LoveBirdsGameState, UserProgress, Screen } from '../types';
import { useCountUp } from '../hooks/useCountUp';

interface LoveBirdsResultsProps {
  gameState: LoveBirdsGameState;
  progress: UserProgress;
  onNavigate: (screen: Screen) => void;
  onPlayAgain: () => void;
}

const LoveBirdsResults = ({
  gameState,
  progress,
  onNavigate,
  onPlayAgain,
}: LoveBirdsResultsProps) => {
  const isPerfectScore = gameState.score === 14;
  const animatedScore = useCountUp(gameState.score, 1500);
  const [showBadgeAnimation, setShowBadgeAnimation] = useState(false);

  useEffect(() => {
    if (isPerfectScore) {
      setShowBadgeAnimation(true);
      const duration = 3000;
      const end = Date.now() + duration;

      const frame = () => {
        confetti({
          particleCount: 3,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: ['#FF69B4', '#FF1493', '#FFB6D9'],
        });
        confetti({
          particleCount: 3,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: ['#FF69B4', '#FF1493', '#FFB6D9'],
        });

        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      };

      frame();
    }
  }, [isPerfectScore]);

  return (
    <div className="love-birds-results">
      <div className="love-birds-score-card">
        <h2>{isPerfectScore ? '💕 Perfect! 💕' : '💕 Great Job! 💕'}</h2>
        <div className="love-birds-final-score">{animatedScore}/14</div>
        <p className="love-birds-score-text">Love Birds Correct!</p>

        {isPerfectScore && (
          <div className={`badge-celebration ${showBadgeAnimation ? 'show' : ''}`}>
            <div className="badge-earned">
              🏆 Love Birds Badge Earned! 🏆
            </div>
          </div>
        )}

        <div className="love-birds-stats">
          <p>Best Score: {progress.loveBirds.bestScore}/14</p>
          <p>Games Played: {progress.loveBirds.totalAttempts}</p>
        </div>
      </div>

      <div className="love-birds-breakdown">
        <h3>Your Results</h3>
        <div className="questions-grid">
          {gameState.questions.map((question) => {
            const isCorrect = question.isCorrect === true;
            const userSelectedBird = gameState.questions[
              gameState.questions.indexOf(question)
            ].userAnswer
              ? gameState.questions[gameState.questions.indexOf(question)].options.find(
                  (b) =>
                    b.id ===
                    gameState.questions[gameState.questions.indexOf(question)].userAnswer
                )
              : null;

            return (
              <div
                key={question.questionNumber}
                className={`question-result ${isCorrect ? 'correct' : 'incorrect'}`}
              >
                <div className="result-number">Q{question.questionNumber}</div>
                <img
                  src={question.correctBird.image}
                  alt={question.correctBird.name}
                  className="result-bird-image"
                />
                <div className="result-info">
                  <div className="result-name">{question.correctBird.name}</div>
                  <div className="result-status">
                    {isCorrect ? '✅ Correct' : `❌ You picked: ${userSelectedBird?.name}`}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="love-birds-actions">
        <button className="primary-button" onClick={onPlayAgain}>
          PLAY AGAIN
        </button>
        <button className="secondary-button" onClick={() => onNavigate('badges')}>
          VIEW BADGES
        </button>
        <button className="secondary-button" onClick={() => onNavigate('landing')}>
          BACK HOME
        </button>
      </div>
    </div>
  );
};

export default LoveBirdsResults;
