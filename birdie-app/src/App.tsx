import { useState, useEffect } from 'react';
import './App.css';
import SkyBackground from './components/SkyBackground';
import Header from './components/Header';
import Landing from './components/Landing';
import Game from './components/Game';
import ScoreDisplay from './components/ScoreDisplay';
import Modal from './components/Modal';
import Badges from './components/Badges';
import type { Bird, Screen, GameSet, UserProgress, GameHistory } from './types';
import {
  loadProgress,
  saveProgress,
  addGameToHistory,
  toggleMute,
  getDateString,
} from './utils/storage';
import { generateDailyGame, calculateScore } from './utils/gameLogic';

function App() {
  const [screen, setScreen] = useState<Screen>('landing');
  const [previousScreen, setPreviousScreen] = useState<Screen>('landing');
  const [progress, setProgress] = useState<UserProgress>(loadProgress());
  const [gameSets, setGameSets] = useState<GameSet[]>([]);
  const [currentSet, setCurrentSet] = useState(0);
  const [allBirds, setAllBirds] = useState<Bird[]>([]);
  const [score, setScore] = useState(0);
  const [_newlyEarnedBadges, setNewlyEarnedBadges] = useState<typeof progress.earnedBadges>([]);

  useEffect(() => {
    fetch('/data/birds.json')
      .then((res) => res.json())
      .then((data) => {
        setAllBirds(data.birds);
      })
      .catch((err) => console.error('Failed to load birds:', err));
  }, []);

  const startGame = () => {
    if (allBirds.length > 0) {
      const sets = generateDailyGame(allBirds);
      setGameSets(sets);
      setCurrentSet(0);
      setScore(0);
      setNewlyEarnedBadges([]);
      setScreen('game');
    }
  };

  const handleSelectAnswer = (birdId: number, answer: string) => {
    setGameSets((prevSets) => {
      const newSets = [...prevSets];
      const set = newSets[currentSet];
      set.userAnswers.set(birdId, answer);
      return newSets;
    });
  };

  const handleSubmit = () => {
    setGameSets((prevSets) => {
      const newSets = [...prevSets];
      newSets[currentSet].revealed = true;
      return newSets;
    });
  };

  const handleNext = () => {
    if (currentSet < gameSets.length - 1) {
      setCurrentSet(currentSet + 1);
    } else {
      const finalScore = calculateScore(gameSets);
      setScore(finalScore);

      const totalBirds = gameSets.reduce((acc, set) => acc + set.birds.length, 0);
      const isPerfectScore = finalScore === totalBirds;

      const gameHistory: GameHistory = {
        date: getDateString(),
        score: finalScore,
        totalBirds,
        playedBirds: gameSets.flatMap((set) => set.birds),
        correctBirds: gameSets.flatMap((set) =>
          set.birds
            .filter((bird) => set.userAnswers.get(bird.id) === bird.name)
            .map((bird) => bird.id)
        ),
      };

      const updatedProgress = addGameToHistory(progress, gameHistory, isPerfectScore);
      setProgress(updatedProgress);
      saveProgress(updatedProgress);

      setScreen('score');
    }
  };

  const handleNavigate = (newScreen: Screen) => {
    if (newScreen === 'about-game' || newScreen === 'about-us') {
      // Store current screen before opening modal
      setPreviousScreen(screen);
      setScreen(newScreen);
    } else if (newScreen === 'badges') {
      // Store current screen before going to badges
      setPreviousScreen(screen);
      setScreen(newScreen);
    } else if (newScreen === 'game') {
      startGame();
    } else {
      setScreen(newScreen);
    }
  };

  const handleBackFromBadges = () => {
    // Return to the screen we were on before opening badges
    setScreen(previousScreen);
  };

  const handleCloseModal = () => {
    // Return to the screen we were on before opening the modal
    setScreen(previousScreen);
  };

  const handleToggleMute = () => {
    const updatedProgress = toggleMute(progress);
    setProgress(updatedProgress);
    saveProgress(updatedProgress);
  };

  const renderScreen = () => {
    // If modal is open, render the previous screen in background
    const screenToRender = (screen === 'about-game' || screen === 'about-us')
      ? previousScreen
      : screen;

    switch (screenToRender) {
      case 'landing':
        return (
          <Landing
            onNavigate={handleNavigate}
            progress={progress}
          />
        );
      case 'game':
        return (
          <Game
            sets={gameSets}
            currentSet={currentSet}
            onSubmit={handleSubmit}
            onNext={handleNext}
            onSelectAnswer={handleSelectAnswer}
            isMuted={progress.muteSounds}
          />
        );
      case 'score':
        return (
          <ScoreDisplay
            sets={gameSets}
            score={score}
            progress={progress}
            onNavigate={handleNavigate}
          />
        );
      case 'badges':
        return (
          <Badges
            progress={progress}
            onNavigate={handleNavigate}
            onBack={handleBackFromBadges}
          />
        );
      default:
        return (
          <Landing
            onNavigate={handleNavigate}
            progress={progress}
          />
        );
    }
  };

  return (
    <div className="app">
      <SkyBackground />
      <Header
        onNavigate={handleNavigate}
        onToggleMute={handleToggleMute}
        isMuted={progress.muteSounds}
        showNav={screen !== 'landing'}
      />
      {renderScreen()}
      {(screen === 'about-game' || screen === 'about-us') && (
        <Modal screen={screen} onClose={handleCloseModal} />
      )}
    </div>
  );
}

export default App;
