import type { Screen } from '../types';

interface HeaderProps {
  onNavigate: (screen: Screen) => void;
  onToggleMute: () => void;
  isMuted: boolean;
  showNav: boolean;
}

const Header = ({ onNavigate, onToggleMute, isMuted, showNav }: HeaderProps) => {
  return (
    <header className="header">
      <div className="header-logo" onClick={() => onNavigate('landing')}>
        <img src="/birdie1.png" alt="Birdie" className="logo-image" />
      </div>
      {showNav && (
        <nav className="header-nav">
          <button className="header-button" onClick={() => onNavigate('badges')}>
            My Badges
          </button>
          <button className="header-button" onClick={() => onNavigate('about-game')}>
            About Game
          </button>
          <button className="mute-button" onClick={onToggleMute}>
            {isMuted ? '🔇' : '🔊'}
          </button>
        </nav>
      )}
    </header>
  );
};

export default Header;
