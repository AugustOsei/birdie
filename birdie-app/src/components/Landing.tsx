import { useState } from 'react';
import { motion } from 'framer-motion';
import type { Screen, UserProgress } from '../types';
import ProInviteModal from './ProInviteModal';
import FeatureCard from './landing/FeatureCard';
import StatsBar from './landing/StatsBar';
import BadgeShowcase from './landing/BadgeShowcase';
import { canPlayBirdieProNow } from '../utils/storage';
import './Landing.css';

interface LandingProps {
  onNavigate: (screen: Screen) => void;
  progress: UserProgress;
}

// Animation variants
const floatVariant = {
  animate: {
    y: [0, -15, 0],
    transition: {
      duration: 4,
      repeat: Infinity,
      ease: 'easeInOut' as any,
    },
  },
};

const buttonHoverVariant = {
  scale: 1.05,
  transition: { duration: 0.2 },
};

const streakVariant = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5 },
  },
};

const Landing = ({ onNavigate, progress }: LandingProps) => {
  const [showProModal, setShowProModal] = useState(false);
  const canPlayPro = canPlayBirdieProNow(progress);

  return (
    <>
      {/* Hero Section */}
      <div className="landing-hero">
        <div className="landing-hero-content">
          {/* Account Notice */}
          <div className="landing-account-notice">
            ℹ️ Progress is saved locally on this device. Account features coming soon!
          </div>

          {/* Headline */}
          <h1 className="landing-headline">A fun way to learn about birds</h1>
          <p className="landing-tagline">Identify birds. Earn badges. Become a certified birder!</p>

          {/* Streak Display (if applicable) */}
          {progress.consecutivePerfectScores > 0 && (
            <motion.div
              className="landing-streak"
              variants={streakVariant}
              initial="hidden"
              animate="visible"
            >
              🔥 {progress.consecutivePerfectScores} consecutive perfect score
              {progress.consecutivePerfectScores > 1 ? 's' : ''}!
            </motion.div>
          )}

          {/* CTA Buttons */}
          <div className="landing-cta-buttons">
            <motion.button
              className="landing-cta-primary"
              onClick={() => onNavigate('game')}
              whileHover={buttonHoverVariant}
              whileTap={{ scale: 0.98 }}
            >
              START PLAYING
            </motion.button>

            <motion.button
              className="landing-cta-secondary"
              onClick={() => setShowProModal(true)}
              disabled={!canPlayPro}
              whileHover={canPlayPro ? buttonHoverVariant : {}}
              whileTap={canPlayPro ? { scale: 0.98 } : {}}
              title={!canPlayPro ? 'Come back in 24 hours' : 'Try the ultimate challenge!'}
            >
              🔥 BIRDIE PRO 🔥
            </motion.button>
          </div>

          {/* Progress Info */}
          <div className="landing-progress">
            {progress.earnedBadges.length > 0 && (
              <p className="landing-badges-count">
                <strong>{progress.earnedBadges.length}</strong> badge
                {progress.earnedBadges.length > 1 ? 's' : ''} earned
              </p>
            )}

            <p className="landing-games-played">
              {progress.totalGamesPlayed} game{progress.totalGamesPlayed !== 1 ? 's' : ''} played
            </p>
          </div>
        </div>

        {/* Hero Image */}
        <div className="landing-hero-image-container">
          <motion.img
            src="/birdland2.png"
            alt="Love Birds"
            className="landing-hero-image"
            variants={floatVariant}
            animate="animate"
          />
        </div>
      </div>

      {/* Feature Cards Section */}
      <section className="landing-features">
        <h2 className="landing-features-title">Explore Bird Challenges</h2>
        <div className="landing-features-grid">
          <FeatureCard
            icon="💕"
            title="Love Birds Challenge"
            description="Find birds that mate for life!"
            badge="new"
            delay={0}
            onClick={() => onNavigate('love-birds')}
          />
          <FeatureCard
            icon="❤️"
            title="Heart Multiplier Event"
            description="Collect hearts with perfect scores!"
            badge="active"
            delay={1}
            onClick={() => onNavigate('game')}
          />
          <FeatureCard
            icon="🌹"
            title="Romantic Bird Facts"
            description="Learn love stories from nature!"
            badge={null}
            delay={2}
            onClick={() => onNavigate('game')}
          />
        </div>
      </section>

      {/* Stats Bar */}
      <StatsBar birdCount={48} challengeCount={3} showBadgePrompt={true} />

      {/* Badge Showcase */}
      <BadgeShowcase progress={progress} />

      {/* Footer */}
      <footer className="landing-footer">
        <a
          href="https://www.augustwheel.com"
          target="_blank"
          rel="noopener noreferrer"
          className="landing-footer-link"
        >
          Made by August Wheel
        </a>
      </footer>

      {/* Pro Invite Modal */}
      {showProModal && (
        <ProInviteModal
          progress={progress}
          onTryIt={() => {
            setShowProModal(false);
            onNavigate('birdie-pro');
          }}
          onDismiss={() => setShowProModal(false)}
        />
      )}
    </>
  );
};

export default Landing;
