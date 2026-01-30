import { motion } from 'framer-motion';

interface FeatureCardProps {
  icon: string;
  title: string;
  description: string;
  badge?: 'new' | 'active' | null;
  delay: number;
  onClick: () => void;
}

const cardVariant = {
  hidden: { opacity: 0, y: 30 },
  visible: (delay: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: delay * 0.1,
      duration: 0.5,
      ease: 'easeOut' as any,
    },
  }),
};

const hoverVariant = {
  scale: 1.03,
  y: -5,
  transition: { duration: 0.3 },
};

const FeatureCard = ({ icon, title, description, badge, delay, onClick }: FeatureCardProps) => {
  return (
    <motion.div
      className="feature-card"
      custom={delay}
      variants={cardVariant}
      initial="hidden"
      whileInView="visible"
      whileHover={hoverVariant}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      viewport={{ once: true }}
    >
      <div className="feature-card-icon">{icon}</div>
      <h3 className="feature-card-title">{title}</h3>
      <p className="feature-card-description">{description}</p>
      {badge && <div className={`feature-card-badge ${badge}`}>{badge === 'new' ? 'NEW' : 'ACTIVE'}</div>}
    </motion.div>
  );
};

export default FeatureCard;
