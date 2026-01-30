import { motion } from 'framer-motion';
import type { UserProgress } from '../../types';

interface BadgeShowcaseProps {
  progress: UserProgress;
}

const fadeInVariant = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5, delay: 0.4, ease: 'easeOut' as any },
  },
};

// Badge emoji mapping - using a simple mapping based on badge name
const badgeEmojis: { [key: string]: string } = {
  'Level 1 Birder': '🐥',
  'Bird Enthusiast': '🐦',
  'Ornithology Expert': '🦅',
  'Perfect Scorer': '⭐',
  'Challenge Master': '🏆',
  'Certified Level 1 Birder': '🎖️',
};

const BadgeShowcase = ({ progress }: BadgeShowcaseProps) => {
  const earnedBadge = progress.earnedBadges?.[0];
  const badgeEmoji = earnedBadge ? badgeEmojis[earnedBadge.name] || '🏅' : null;

  return (
    <motion.div
      className={`badge-showcase ${!earnedBadge ? 'badge-showcase-placeholder' : ''}`}
      variants={fadeInVariant}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
    >
      <div className="badge-showcase-icon">{badgeEmoji || '🔓'}</div>
      <div className="badge-showcase-text">
        <div className="badge-showcase-name">{earnedBadge ? earnedBadge.name : 'Earn Your First Badge'}</div>
        <div className="badge-showcase-description">
          {earnedBadge ? earnedBadge.description : 'Complete challenges to unlock badges'}
        </div>
      </div>
    </motion.div>
  );
};

export default BadgeShowcase;
