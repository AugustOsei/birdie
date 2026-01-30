import { useMemo, useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import type { Bird, GameSet, UserProgress, Screen } from '../types';
import { getRandomFacts } from '../utils/gameLogic';
import { useCountUp } from '../hooks/useCountUp';
import ShareModal from './ShareModal';
import { getActiveValentineEvent } from '../config/events';

interface ScoreDisplayProps {
  sets: GameSet[];
  score: number;
  progress: UserProgress;
  onNavigate: (screen: Screen) => void;
}

const ScoreDisplay = ({ sets, score, progress, onNavigate }: ScoreDisplayProps) => {
  const [showShareModal, setShowShareModal] = useState(false);
  const totalBirds = sets.reduce((acc, set) => acc + set.birds.length, 0);
  const allBirds = useMemo(() => sets.flatMap((set) => set.birds), [sets]);
  const randomFacts = useMemo(() => getRandomFacts(allBirds, 3), [allBirds]);
  const animatedScore = useCountUp(score, 1500);
  const valentineEvent = getActiveValentineEvent();

  const isPerfectScore = score === totalBirds;

  // Calculate next milestone for perfect scores
  const nextMilestone = useMemo(() => {
    if (progress.consecutivePerfectScores < 3) {
      return { name: 'Certified Level 1 Birder', needed: 3 - progress.consecutivePerfectScores };
    } else if (progress.consecutivePerfectScores < 5) {
      return { name: 'Certified Level 2 Birder', needed: 5 - progress.consecutivePerfectScores };
    } else if (progress.consecutivePerfectScores < 10) {
      return { name: 'Certified Level 3 Birder', needed: 10 - progress.consecutivePerfectScores };
    }
    return null;
  }, [progress.consecutivePerfectScores]);

  useEffect(() => {
    // Trigger confetti for perfect score
    if (isPerfectScore) {
      const duration = 3000;
      const end = Date.now() + duration;

      const frame = () => {
        confetti({
          particleCount: 3,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: ['#58CC02', '#FFD700', '#FF6B6B'],
        });
        confetti({
          particleCount: 3,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: ['#58CC02', '#FFD700', '#FF6B6B'],
        });

        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      };

      frame();
    }
  }, [isPerfectScore]);

  const handleShare = () => {
    setShowShareModal(true);
  };

  const getBirdResult = (bird: Bird, set: GameSet): boolean => {
    const userAnswer = set.userAnswers.get(bird.id);
    return userAnswer === bird.name;
  };

  const getUserAnswer = (bird: Bird, set: GameSet): string | undefined => {
    return set.userAnswers.get(bird.id);
  };

  return (
    <div className="score-display">
      <div className="score-card">
        <h2>{isPerfectScore ? 'Perfect! 🎉' : 'Great Job!'}</h2>
        {valentineEvent ? (
          <div className="score-with-hearts">
            <div className="hearts-count">
              {animatedScore} ❤️
            </div>
            <div className="score-fraction">
              {animatedScore}/{totalBirds}
            </div>
          </div>
        ) : (
          <div className="final-score">
            {animatedScore}/{totalBirds} Birds Correct!
          </div>
        )}

        {isPerfectScore && progress.consecutivePerfectScores > 0 && (
          <div className="achievement-badges">
            <div className="achievement-badge">
              <span className="badge-emoji">🔥</span>
              <span className="badge-text">{progress.consecutivePerfectScores} Perfect Score{progress.consecutivePerfectScores > 1 ? 's' : ''} in a Row!</span>
            </div>
          </div>
        )}

        {!isPerfectScore && progress.consecutivePerfectScores > 0 && (
          <div style={{ color: '#E74C3C', marginTop: '1rem', fontSize: '0.95rem' }}>
            Streak broken! You had {progress.consecutivePerfectScores} consecutive perfect score{progress.consecutivePerfectScores > 1 ? 's' : ''}.
          </div>
        )}

        {nextMilestone && isPerfectScore && (
          <div style={{
            background: '#E3F2FD',
            padding: '1rem',
            borderRadius: '15px',
            margin: '1.5rem 0',
            color: '#1976D2',
            fontWeight: '600'
          }}>
            🎯 {nextMilestone.needed} more perfect score{nextMilestone.needed > 1 ? 's' : ''} to earn "{nextMilestone.name}"!
          </div>
        )}

        <div className="birds-grid">
          {sets.map((set) =>
            set.birds.map((bird) => {
              const isCorrect = getBirdResult(bird, set);
              const userAnswer = getUserAnswer(bird, set);
              return (
                <div key={bird.id} className={`bird-result ${isCorrect ? 'correct' : 'incorrect'}`}>
                  <span className="result-indicator">
                    {isCorrect ? '✅' : '❌'}
                  </span>
                  <img src={bird.image} alt={bird.name} />
                  {isCorrect ? (
                    <div className="bird-result-name correct-answer">{bird.name}</div>
                  ) : (
                    <div className="answer-feedback">
                      <div className="user-answer">
                        Your answer: <span className="wrong-text">{userAnswer}</span>
                      </div>
                      <div className="correct-answer">
                        Correct: <span className="right-text">{bird.name}</span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        <div className="fun-facts">
          <h3>Did you know?</h3>
          {randomFacts.map((item, idx) => (
            <div key={idx} className="fact-item">
              <strong>{item.bird.name}:</strong> {item.fact}
            </div>
          ))}
        </div>

        <div className="score-actions">
          <button className="primary-button" onClick={() => onNavigate('game')}>
            PLAY AGAIN
          </button>
          <button className="secondary-button" onClick={() => onNavigate('badges')}>
            VIEW BADGES
          </button>
          <button className="secondary-button" onClick={handleShare}>
            SHARE SCORE
          </button>
          <button className="secondary-button" onClick={() => onNavigate('landing')}>
            BACK HOME
          </button>
        </div>

        {showShareModal && (
          <ShareModal
            score={score}
            totalBirds={totalBirds}
            consecutivePerfectScores={progress.consecutivePerfectScores}
            onClose={() => setShowShareModal(false)}
          />
        )}
      </div>
    </div>
  );
};

export default ScoreDisplay;
