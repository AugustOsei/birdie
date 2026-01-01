import { useEffect, useState } from 'react';
import type { UserProgress } from '../types';
import { canPlayBirdieProNow, getTimeUntilNextBirdieProAttempt } from '../utils/storage';

interface ProInviteModalProps {
  progress: UserProgress;
  onTryIt: () => void;
  onDismiss: () => void;
}

const ProInviteModal = ({ progress, onTryIt, onDismiss }: ProInviteModalProps) => {
  const [visible, setVisible] = useState(false);
  const canPlay = canPlayBirdieProNow(progress);
  const timeRemaining = getTimeUntilNextBirdieProAttempt(progress);

  useEffect(() => {
    // Show modal after 2 seconds
    const timer = setTimeout(() => {
      setVisible(true);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const formatTimeRemaining = (ms: number): string => {
    if (ms === 0) return '';
    const hours = Math.floor(ms / (1000 * 60 * 60));
    const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
  };

  if (!visible) return null;

  return (
    <div className="pro-invite-overlay" onClick={onDismiss}>
      <div className="pro-invite-modal" onClick={(e) => e.stopPropagation()}>
        <div className="pro-invite-header">
          <h2>🔥 BIRDIE PRO 🔥</h2>
          <button
            className="pro-invite-close"
            onClick={onDismiss}
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        <div className="pro-invite-content">
          <p className="pro-invite-tagline">The Ultimate Bird Challenge</p>

          <div className="pro-invite-description">
            <p>
              Identify <strong>all 28 birds</strong> in one epic challenge!
            </p>
            <p>
              Think you're ready to become a true birding expert? Prove it!
            </p>
          </div>

          <div className="pro-invite-features">
            <div className="feature">
              <span className="feature-icon">🐦</span>
              <span>All 28 Birds</span>
            </div>
            <div className="feature">
              <span className="feature-icon">⏱️</span>
              <span>One Challenge</span>
            </div>
            <div className="feature">
              <span className="feature-icon">🔄</span>
              <span>Daily Attempt</span>
            </div>
          </div>

          {!canPlay && (
            <div className="pro-invite-cooldown">
              Come back in {formatTimeRemaining(timeRemaining)} to try again!
            </div>
          )}

          <div className="pro-invite-actions">
            <button
              className="pro-invite-try-btn"
              onClick={onTryIt}
              disabled={!canPlay}
            >
              {canPlay ? 'TRY IT NOW! 🚀' : 'COME BACK LATER ⏳'}
            </button>
            <button
              className="pro-invite-not-now-btn"
              onClick={onDismiss}
            >
              Not Now
            </button>
          </div>

          {progress.birdiePro.totalAttempts > 0 && (
            <div className="pro-invite-stats">
              <p>
                Best Score: <strong>{progress.birdiePro.bestScore}/28</strong>
              </p>
              <p>
                Attempts: <strong>{progress.birdiePro.totalAttempts}</strong>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProInviteModal;
