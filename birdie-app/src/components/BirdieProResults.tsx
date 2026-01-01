import { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import type { Screen } from '../types';
import { useCountUp } from '../hooks/useCountUp';
import ShareModal from './ShareModal';

interface BirdieProResultsProps {
  score: number;
  bestScore: number;
  totalAttempts: number;
  onNavigate: (screen: Screen) => void;
}

const BirdieProResults = ({
  score,
  bestScore,
  totalAttempts,
  onNavigate,
}: BirdieProResultsProps) => {
  const totalBirds = 28;
  const animatedScore = useCountUp(score, 1500);
  const [shareMessage, setShareMessage] = useState('');
  const [showShareModal, setShowShareModal] = useState(false);

  // Determine message based on score
  useEffect(() => {
    if (score === totalBirds) {
      setShareMessage('Perfect birder! I\'m unstoppable! 🔥');
      const duration = 3000;
      const end = Date.now() + duration;
      const frame = () => {
        confetti({
          particleCount: 4,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: ['#FFD700', '#FFA500', '#FF6B6B'],
        });
        confetti({
          particleCount: 4,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: ['#FFD700', '#FFA500', '#FF6B6B'],
        });
        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      };
      frame();
    } else if (score >= 24) {
      setShareMessage('Almost had it! Just a few away from perfection 🎯');
    } else if (score >= 20) {
      setShareMessage('Pretty solid! Give me another 24 hours 💪');
    } else if (score >= 15) {
      setShareMessage('Not bad for my attempt! I\'ll be back 🐦');
    } else if (score >= 10) {
      setShareMessage('Just getting started... Challenge accepted! 🚀');
    } else {
      setShareMessage('Every expert was once a beginner! Let\'s try again 💙');
    }
  }, [score]);

  const getResultTitle = () => {
    if (score === totalBirds) return 'PERFECT! 🎉';
    if (score >= 24) return 'Excellent! 🌟';
    if (score >= 20) return 'Great Job! 👏';
    if (score >= 15) return 'Not Bad! 🐦';
    return 'Keep Trying! 💪';
  };

  const isNewBest = score > bestScore;

  return (
    <div className="birdie-pro-results-container">
      <div className="pro-results-card">
        <h2>{getResultTitle()}</h2>

        <div className="pro-final-score">
          {animatedScore}/{totalBirds}
        </div>

        {isNewBest && (
          <div className="pro-new-best">
            🎉 NEW BEST SCORE! 🎉
          </div>
        )}

        <div className="pro-score-message">
          {shareMessage}
        </div>

        <div className="pro-stats-box">
          <div className="stat-row">
            <span className="stat-label">Best Score:</span>
            <span className="stat-value">{Math.max(score, bestScore)}/28</span>
          </div>
          <div className="stat-row">
            <span className="stat-label">Total Attempts:</span>
            <span className="stat-value">{totalAttempts}</span>
          </div>
          {totalAttempts > 1 && (
            <div className="stat-row">
              <span className="stat-label">Average Score:</span>
              <span className="stat-value">
                {(Math.max(score, bestScore) / totalAttempts).toFixed(1)}/28
              </span>
            </div>
          )}
        </div>

        <div className="pro-results-actions">
          <button
            className="pro-primary-button"
            onClick={() => onNavigate('landing')}
          >
            BACK HOME
          </button>
          <button
            className="pro-secondary-button"
            onClick={() => setShowShareModal(true)}
          >
            SHARE & CHALLENGE
          </button>
        </div>

        <div className="pro-cooldown-info">
          ⏳ Come back in 24 hours to try again!
        </div>
      </div>

      {showShareModal && (
        <ShareModal
          score={score}
          totalBirds={totalBirds}
          consecutivePerfectScores={0}
          onClose={() => setShowShareModal(false)}
        />
      )}
    </div>
  );
};

export default BirdieProResults;
