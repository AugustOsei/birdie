import type { Screen, UserProgress } from '../types';
import { AVAILABLE_BADGES } from '../data/badges';

interface BadgesProps {
  progress: UserProgress;
  onNavigate: (screen: Screen) => void;
  onBack: () => void;
}

const Badges = ({ progress, onNavigate, onBack }: BadgesProps) => {
  const earnedBadgeIds = new Set(progress.earnedBadges.map(b => b.id));

  return (
    <div className="badges-screen">
      <div className="badges-container">
        <h1>My Badges</h1>
        <p className="badges-subtitle">
          Collect badges by achieving milestones!
        </p>

        <div className="badges-stats">
          <div className="stat-item">
            <div className="stat-value">{progress.earnedBadges.length}</div>
            <div className="stat-label">Badges Earned</div>
          </div>
          <div className="stat-item">
            <div className="stat-value">{progress.consecutivePerfectScores}</div>
            <div className="stat-label">Consecutive Perfect Scores</div>
          </div>
          <div className="stat-item">
            <div className="stat-value">{progress.allTimePerfectScores}</div>
            <div className="stat-label">Total Perfect Scores</div>
          </div>
        </div>

        <div className="badges-grid">
          {AVAILABLE_BADGES.map((badge) => {
            const isEarned = earnedBadgeIds.has(badge.id);
            const earnedBadge = progress.earnedBadges.find(b => b.id === badge.id);

            return (
              <div
                key={badge.id}
                className={`badge-card ${isEarned ? 'earned' : 'locked'}`}
              >
                <div className="badge-icon">{badge.icon}</div>
                <h3 className="badge-name">{badge.name}</h3>
                <p className="badge-description">{badge.description}</p>
                <p className="badge-requirement">{badge.requirement}</p>
                {isEarned && earnedBadge?.earnedDate && (
                  <p className="badge-earned-date">
                    Earned {new Date(earnedBadge.earnedDate).toLocaleDateString()}
                  </p>
                )}
                {!isEarned && (
                  <div className="badge-locked-overlay">
                    <span>🔒</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <button className="primary-button" onClick={onBack} style={{ marginTop: '2rem' }}>
          BACK
        </button>
      </div>
    </div>
  );
};

export default Badges;
