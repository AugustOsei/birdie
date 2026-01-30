import { motion } from 'framer-motion';

interface StatsBarProps {
  birdCount: number;
  challengeCount: number;
  showBadgePrompt: boolean;
}

const statsSlideVariant = {
  hidden: { opacity: 0, x: -50 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.6, delay: 0.3, ease: 'easeOut' as any },
  },
};

const StatsBar = ({ birdCount, challengeCount }: StatsBarProps) => {
  return (
    <>
      <motion.div
        className="stats-bar"
        variants={statsSlideVariant}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <div className="stats-bar-item">
          <span className="stats-bar-icon">🐦</span>
          <span>{birdCount} Birds</span>
        </div>
        <div className="stats-bar-item">
          <span className="stats-bar-icon">🎮</span>
          <span>{challengeCount} Challenges</span>
        </div>
        <div className="stats-bar-item">
          <span className="stats-bar-icon">🏆</span>
          <span>Earn Badges</span>
        </div>
      </motion.div>

      <motion.div
        className="stats-bar-mobile"
        variants={statsSlideVariant}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <div className="stats-bar-item">
          <span className="stats-bar-icon">🐦</span>
          <span>{birdCount} Birds</span>
        </div>
        <div className="stats-bar-item">
          <span className="stats-bar-icon">🎮</span>
          <span>{challengeCount} Challenges</span>
        </div>
        <div className="stats-bar-item">
          <span className="stats-bar-icon">🏆</span>
          <span>Earn Badges</span>
        </div>
      </motion.div>
    </>
  );
};

export default StatsBar;
