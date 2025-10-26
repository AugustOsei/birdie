import { useState } from 'react';
import type { Screen } from '../types';

interface ModalProps {
  screen: Screen;
  onClose: () => void;
}

const Modal = ({ screen, onClose }: ModalProps) => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      try {
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';
        const response = await fetch(`${apiUrl}/api/subscribe`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email }),
        });

        const data = await response.json();

        if (data.success) {
          setSubmitted(true);
          setTimeout(() => {
            setEmail('');
            setSubmitted(false);
          }, 3000);
        } else {
          alert(data.error || 'Failed to subscribe. Please try again.');
        }
      } catch (error) {
        console.error('Subscription error:', error);
        alert('Failed to subscribe. Please try again later.');
      }
    }
  };

  const renderContent = () => {
    switch (screen) {
      case 'about-game':
        return (
          <>
            <h2>How to Play Birdie</h2>
            <p>
              Birdie is a bird identification game where you collect badges by demonstrating
              your birding skills. Identify birds correctly and work towards becoming a
              certified birder!
            </p>
            <p>
              <strong>Game Rules:</strong>
            </p>
            <ul style={{ textAlign: 'left', paddingLeft: '1.5rem', lineHeight: '1.8' }}>
              <li>Play as many times as you want - no daily limits!</li>
              <li>Each game shows 9 birds divided into 3 sets of 3 birds</li>
              <li>Select the correct name for each bird from 3 options</li>
              <li>Submit your answers to see which ones are correct</li>
              <li>Correct birds will fly away with beautiful animations!</li>
              <li>Get all 9 birds correct for a perfect score</li>
            </ul>
            <p>
              <strong>Badge Collection:</strong>
            </p>
            <ul style={{ textAlign: 'left', paddingLeft: '1.5rem', lineHeight: '1.8' }}>
              <li>Earn badges by achieving milestones</li>
              <li>Get 3 perfect scores in a row to become a "Certified Level 1 Birder"</li>
              <li>Continue your streak for higher level badges</li>
              <li>Collect special badges for dedication and perfect games</li>
              <li>Track your progress in the "My Badges" section</li>
            </ul>
            <p>
              <strong>Pro Tip:</strong> Practice makes perfect! The more you play, the better
              you'll get at identifying birds and earning those prestigious badges.
            </p>

            <p>
              <strong>Progress & Data:</strong>
            </p>
            <ul style={{ textAlign: 'left', paddingLeft: '1.5rem', lineHeight: '1.8' }}>
              <li>Your progress is saved locally on your device using browser storage</li>
              <li>Clearing your browser data will reset your progress</li>
              <li>Currently, progress is device-specific and won't sync across devices</li>
              <li>Account features with cloud sync are coming soon!</li>
            </ul>

            <div className="email-signup">
              <h3>Get Updates</h3>
              <p>Sign up for new features and game updates:</p>
              {!submitted ? (
                <form onSubmit={handleEmailSubmit}>
                  <input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                  <button type="submit" className="primary-button">
                    SIGN UP
                  </button>
                </form>
              ) : (
                <p style={{ color: '#4CAF50', fontWeight: 'bold' }}>
                  Thanks for signing up!
                </p>
              )}
            </div>
          </>
        );

      case 'about-us':
        return (
          <>
            <h2>About Birdie</h2>
            <p>
              Birdie is a bird identification game designed to help people learn about
              and appreciate the beautiful birds around us through skill-based progression
              and badge collection.
            </p>
            <p>
              Created with love for nature and birds, Birdie combines fun gameplay with
              education. Each game features interesting facts about the birds you
              encounter, helping you become a better birder with every play.
            </p>
            <p>
              <strong>Our Mission:</strong> To make bird identification fun, accessible,
              and rewarding for everyone through meaningful achievements and continuous learning.
            </p>
            <p>
              <strong>What Makes Birdie Special:</strong>
            </p>
            <ul style={{ textAlign: 'left', paddingLeft: '1.5rem', lineHeight: '1.8' }}>
              <li>No daily limits - play and practice as much as you want</li>
              <li>Beautiful animations and sound effects</li>
              <li>Collectible badges that showcase your birding expertise</li>
              <li>Educational bird facts with every game</li>
              <li>Skill-based progression that rewards dedication</li>
            </ul>
            <p>
              We hope you enjoy playing Birdie and collecting all the badges!
            </p>

            <div className="email-signup">
              <h3>Stay Connected</h3>
              <p>Sign up to receive updates about new features:</p>
              {!submitted ? (
                <form onSubmit={handleEmailSubmit}>
                  <input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                  <button type="submit" className="primary-button">
                    SIGN UP
                  </button>
                </form>
              ) : (
                <p style={{ color: '#4CAF50', fontWeight: 'bold' }}>
                  Thanks for signing up!
                </p>
              )}
            </div>
          </>
        );

      default:
        return null;
    }
  };

  if (screen !== 'about-game' && screen !== 'about-us') {
    return null;
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          &times;
        </button>
        {renderContent()}
      </div>
    </div>
  );
};

export default Modal;
