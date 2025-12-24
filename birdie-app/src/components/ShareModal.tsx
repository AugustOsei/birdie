import { useEffect } from 'react';

interface ShareModalProps {
  score: number;
  totalBirds: number;
  consecutivePerfectScores: number;
  onClose: () => void;
}

const ShareModal = ({
  score,
  totalBirds,
  consecutivePerfectScores,
  onClose,
}: ShareModalProps) => {
  // Generate shareable URL
  const baseUrl = window.location.origin;
  const shareUrl = `${baseUrl}?score=${score}/${totalBirds}${consecutivePerfectScores > 0 ? `&streak=${consecutivePerfectScores}` : ''}`;

  // Generate platform-specific messages
  const messages = {
    twitter: `I got ${score}/${totalBirds} birds correct in Birdie! 🐦${consecutivePerfectScores > 0 ? ` 🔥 ${consecutivePerfectScores} perfect score${consecutivePerfectScores > 1 ? 's' : ''} in a row!` : ''} Can you beat my score?`,
    facebook: `Just scored ${score}/${totalBirds} on Birdie! 🐦 I identified the birds correctly. Can you beat my score?${consecutivePerfectScores > 0 ? ` 🔥 ${consecutivePerfectScores} perfect scores in a row!` : ''}`,
    instagram: `🐦 I scored ${score}/${totalBirds} on Birdie!${consecutivePerfectScores > 0 ? ` 🔥 ${consecutivePerfectScores} perfect scores in a row!` : ''} Can you beat my score?`,
    whatsapp: `I got ${score}/${totalBirds} birds correct in Birdie! 🐦${consecutivePerfectScores > 0 ? ` 🔥 ${consecutivePerfectScores} perfect score${consecutivePerfectScores > 1 ? 's' : ''} in a row!` : ''} Can you beat my score?`,
    generic: `I got ${score}/${totalBirds} birds correct in Birdie! 🐦${consecutivePerfectScores > 0 ? ` 🔥 ${consecutivePerfectScores} perfect score${consecutivePerfectScores > 1 ? 's' : ''} in a row!` : ''} Can you beat my score?`,
  };

  // Close modal on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      alert('Copied to clipboard!');
    });
  };

  const handleSharePlatform = (platform: string) => {
    const text = messages[platform as keyof typeof messages];
    const urlToShare = `${text} ${shareUrl}`;

    switch (platform) {
      case 'twitter':
        window.open(
          `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(shareUrl)}`,
          'twitter-share',
          'width=550,height=420'
        );
        break;
      case 'facebook':
        window.open(
          `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(text)}`,
          'facebook-share',
          'width=550,height=420'
        );
        break;
      case 'instagram':
        // Instagram doesn't have a direct share API, so copy to clipboard
        copyToClipboard(`${text}\n\n${shareUrl}`);
        break;
      case 'whatsapp':
        window.open(
          `https://wa.me/?text=${encodeURIComponent(urlToShare)}`,
          'whatsapp-share',
          'width=550,height=420'
        );
        break;
      case 'link':
        copyToClipboard(shareUrl);
        break;
      case 'text':
        copyToClipboard(`${text}\n\n${shareUrl}`);
        break;
    }
  };

  return (
    <div className="share-modal-overlay" onClick={onClose}>
      <div className="share-modal" onClick={(e) => e.stopPropagation()}>
        <div className="share-modal-header">
          <h3>Share Your Score</h3>
          <button
            className="share-modal-close"
            onClick={onClose}
            aria-label="Close share modal"
          >
            ✕
          </button>
        </div>

        <div className="share-modal-content">
          <div className="score-preview">
            {score}/{totalBirds} Birds Correct
            {consecutivePerfectScores > 0 && (
              <div className="streak-info">
                🔥 {consecutivePerfectScores} Perfect Score{consecutivePerfectScores > 1 ? 's' : ''}
              </div>
            )}
          </div>

          <div className="share-platforms">
            <button
              className="share-button twitter"
              onClick={() => handleSharePlatform('twitter')}
              aria-label="Share on Twitter"
            >
              <span className="platform-icon">𝕏</span>
              <span className="platform-name">Twitter</span>
            </button>

            <button
              className="share-button facebook"
              onClick={() => handleSharePlatform('facebook')}
              aria-label="Share on Facebook"
            >
              <span className="platform-icon">f</span>
              <span className="platform-name">Facebook</span>
            </button>

            <button
              className="share-button instagram"
              onClick={() => handleSharePlatform('instagram')}
              aria-label="Share on Instagram"
            >
              <span className="platform-icon">📷</span>
              <span className="platform-name">Instagram</span>
            </button>

            <button
              className="share-button whatsapp"
              onClick={() => handleSharePlatform('whatsapp')}
              aria-label="Share on WhatsApp"
            >
              <span className="platform-icon">💬</span>
              <span className="platform-name">WhatsApp</span>
            </button>

            <button
              className="share-button link"
              onClick={() => handleSharePlatform('link')}
              aria-label="Copy link"
            >
              <span className="platform-icon">🔗</span>
              <span className="platform-name">Copy Link</span>
            </button>

            <button
              className="share-button text"
              onClick={() => handleSharePlatform('text')}
              aria-label="Copy text"
            >
              <span className="platform-icon">📋</span>
              <span className="platform-name">Copy Text</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShareModal;
