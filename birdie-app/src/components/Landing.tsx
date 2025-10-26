import type { Screen, UserProgress } from '../types';

interface LandingProps {
  onNavigate: (screen: Screen) => void;
  progress: UserProgress;
}

const Landing = ({ onNavigate, progress }: LandingProps) => {
  return (
    <div className="landing">
      <div className="landing-content">
        <div className="local-storage-notice">
          ℹ️ Progress is saved locally on this device. Account features coming soon!
        </div>

        <h1>A fun way to learn about birds</h1>
        <p>Identify birds. Earn badges. Become a certified birder!</p>

        <img src="/birdie_bk1.png" alt="Birds" className="landing-image-mobile" />

        {progress.consecutivePerfectScores > 0 && (
          <div className="streak-display" style={{ marginBottom: '1rem' }}>
            🔥 {progress.consecutivePerfectScores} consecutive perfect score{progress.consecutivePerfectScores > 1 ? 's' : ''}!
          </div>
        )}

        {progress.earnedBadges.length > 0 && (
          <div style={{ marginBottom: '1rem', fontSize: '0.9rem', color: '#666' }}>
            <strong>{progress.earnedBadges.length}</strong> badge{progress.earnedBadges.length > 1 ? 's' : ''} earned
          </div>
        )}

        <div className="landing-buttons">
          <button
            className="primary-button"
            onClick={() => onNavigate('game')}
          >
            START PLAYING
          </button>
          <button className="secondary-button" onClick={() => onNavigate('badges')}>
            MY BADGES
          </button>
          <button className="secondary-button" onClick={() => onNavigate('about-game')}>
            ABOUT GAME
          </button>
        </div>

        <div style={{ marginTop: '1.5rem', fontSize: '0.85rem', color: '#999' }}>
          {progress.totalGamesPlayed} game{progress.totalGamesPlayed !== 1 ? 's' : ''} played
        </div>

        <footer className="landing-footer">
          <a href="https://www.augustwheel.com" target="_blank" rel="noopener noreferrer" className="footer-link">
            Made by August Wheel
          </a>
        </footer>
      </div>
      <img src="/birdie_bk1.png" alt="Birds" className="landing-image" />
    </div>
  );
};

export default Landing;
