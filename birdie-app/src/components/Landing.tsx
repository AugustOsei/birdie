import { useState } from 'react';
import { motion } from 'framer-motion';
import type { Screen, UserProgress } from '../types';
import ProInviteModal from './ProInviteModal';
import BadgeShowcase from './landing/BadgeShowcase';
import { canPlayBirdieProNow } from '../utils/storage';
import './Landing.css';

interface LandingProps {
  onNavigate: (screen: Screen) => void;
  progress: UserProgress;
}

// Animation variants
const heroImageVariant = {
  hidden: { opacity: 0, scale: 0.8, rotate: -5 },
  visible: {
    opacity: 1,
    scale: 1,
    rotate: 0,
    transition: { duration: 0.8, ease: 'easeOut' as any },
  },
  float: {
    y: [0, -20, 0],
    transition: {
      duration: 5,
      repeat: Infinity,
      ease: 'easeInOut' as any,
    },
  },
};

const ctaVariant = {
  hidden: { opacity: 0, x: -50, rotateZ: -2 },
  visible: (index: number) => ({
    opacity: 1,
    x: 0,
    rotateZ: 0,
    transition: { delay: 0.2 + index * 0.15, duration: 0.6, ease: 'easeOut' as any },
  }),
};

const headlineVariant = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: 'easeOut' as any },
  },
};

const teaserVariant = {
  hidden: { opacity: 0, y: 40 },
  visible: (index: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 1.2 + index * 0.15, duration: 0.6, ease: 'easeOut' as any },
  }),
};

const buttonHoverVariant = {
  scale: 1.08,
  transition: { duration: 0.3 },
};

const Landing = ({ onNavigate, progress }: LandingProps) => {
  const [showProModal, setShowProModal] = useState(false);
  const canPlayPro = canPlayBirdieProNow(progress);

  return (
    <>
      {/* Main Hero Section */}
      <div className="landing-hero-section">
        {/* Left Column: Content & CTAs */}
        <div className="landing-left-column">
          {/* Main Headline */}
          <motion.h1
            className="landing-headline"
            variants={headlineVariant}
            initial="hidden"
            animate="visible"
          >
            A fun way to learn about birds
          </motion.h1>

          <motion.p
            className="landing-tagline"
            variants={headlineVariant}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.1 }}
          >
            Identify birds. Earn badges. Become a certified birder!
          </motion.p>

          {/* Streak Display */}
          {progress.consecutivePerfectScores > 0 && (
            <motion.div
              className="landing-streak"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              🔥 {progress.consecutivePerfectScores} consecutive perfect score
              {progress.consecutivePerfectScores > 1 ? 's' : ''}!
            </motion.div>
          )}

          {/* Three Main CTAs */}
          <div className="landing-cta-group">
            <motion.button
              className="landing-cta landing-cta-primary"
              onClick={() => onNavigate('game')}
              custom={0}
              variants={ctaVariant}
              initial="hidden"
              animate="visible"
              whileHover={buttonHoverVariant}
              whileTap={{ scale: 0.96 }}
            >
              <span className="cta-icon">🎮</span>
              <span className="cta-text">START PLAYING</span>
            </motion.button>

            <motion.button
              className="landing-cta landing-cta-pro"
              onClick={() => setShowProModal(true)}
              disabled={!canPlayPro}
              custom={1}
              variants={ctaVariant}
              initial="hidden"
              animate="visible"
              whileHover={canPlayPro ? buttonHoverVariant : {}}
              whileTap={canPlayPro ? { scale: 0.96 } : {}}
              title={!canPlayPro ? 'Come back in 24 hours' : 'Try the ultimate challenge!'}
            >
              <span className="cta-icon">🔥</span>
              <span className="cta-text">BIRDIE PRO</span>
            </motion.button>

            <motion.button
              className="landing-cta landing-cta-love"
              onClick={() => onNavigate('love-birds')}
              custom={2}
              variants={ctaVariant}
              initial="hidden"
              animate="visible"
              whileHover={buttonHoverVariant}
              whileTap={{ scale: 0.96 }}
            >
              <span className="cta-icon">💕</span>
              <span className="cta-text">LOVE BIRDS</span>
            </motion.button>
          </div>

          {/* Progress Info */}
          <motion.div
            className="landing-progress"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.5 }}
          >
            {progress.earnedBadges.length > 0 && (
              <p className="landing-badges-count">
                <strong>{progress.earnedBadges.length}</strong> badge
                {progress.earnedBadges.length > 1 ? 's' : ''} earned
              </p>
            )}
            <p className="landing-games-played">
              {progress.totalGamesPlayed} game{progress.totalGamesPlayed !== 1 ? 's' : ''} played
            </p>
          </motion.div>
        </div>

        {/* Right Column: Hero Image */}
        <div className="landing-right-column">
          <motion.div
            className="landing-hero-image-wrapper"
            variants={heroImageVariant}
            initial="hidden"
            animate="visible"
          >
            <motion.img
              src="/birdland4.png"
              alt="Birdland - Love Birds"
              className="landing-hero-image"
              animate="float"
              variants={heroImageVariant}
              loading="eager"
            />
            <div className="landing-image-glow" />
          </motion.div>
        </div>
      </div>

      {/* Feature Teasers Section */}
      <section className="landing-teasers">
        <motion.h2
          className="landing-teasers-title"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          What's New in Birdie
        </motion.h2>

        <div className="landing-teasers-grid">
          {/* Heart Multiplier Teaser */}
          <motion.div
            className="landing-teaser"
            custom={0}
            variants={teaserVariant}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <div className="teaser-icon">❤️</div>
            <h3 className="teaser-title">Heart Multiplier</h3>
            <p className="teaser-description">
              Watch hearts appear when you make perfect choices! Visual feedback that celebrates your accuracy.
            </p>
          </motion.div>

          {/* Romantic Bird Facts Teaser */}
          <motion.div
            className="landing-teaser"
            custom={1}
            variants={teaserVariant}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <div className="teaser-icon">🌹</div>
            <h3 className="teaser-title">Romantic Bird Facts</h3>
            <p className="teaser-description">
              Discover love stories from nature. Each bird has heartwarming facts about how they bond.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Badge Showcase */}
      <section className="landing-badge-section">
        <BadgeShowcase progress={progress} />
      </section>

      {/* Stats Bar */}
      <motion.div
        className="landing-stats"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <div className="stats-item">
          <span className="stats-number">48</span>
          <span className="stats-label">Birds</span>
        </div>
        <div className="stats-divider" />
        <div className="stats-item">
          <span className="stats-number">3</span>
          <span className="stats-label">Challenges</span>
        </div>
        <div className="stats-divider" />
        <div className="stats-item">
          <span className="stats-number">∞</span>
          <span className="stats-label">Fun</span>
        </div>
      </motion.div>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="landing-footer-notice">
          ℹ️ Progress is saved locally on this device. Account features coming soon!
        </div>
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
