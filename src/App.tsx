import { useState, useCallback, useEffect } from 'react'
import type { LevelConfig, GameProgress, GameScreen, HeritageCard } from './types'
import { LEVELS, CHAPTERS, HERITAGE_CARDS, STORAGE_KEY, getDefaultProgress } from './constants'
import { StartScreen, LevelSelectScreen, HowToPlayModal, HeritageGallery } from './components/NavigationAndScreens'
import GameBoard from './components/GameBoard'
import { gameAudio } from './utils/audio'

function loadProgress(): GameProgress {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) return JSON.parse(saved)
  } catch {}
  return getDefaultProgress()
}

function saveProgress(progress: GameProgress) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress))
  } catch {}
}

export default function App() {
  const [screen, setScreen] = useState<GameScreen>('start')
  const [currentLevel, setCurrentLevel] = useState<LevelConfig | null>(null)
  const [progress, setProgress] = useState<GameProgress>(loadProgress)
  const [showHowToPlay, setShowHowToPlay] = useState(false)
  const [showHeritageGallery, setShowHeritageGallery] = useState(false)
  const [audioEnabled, setAudioEnabled] = useState(true)

  useEffect(() => {
    gameAudio.init()
  }, [])

  const handleStart = useCallback(() => {
    gameAudio.playClick()
    setScreen('levelSelect')
  }, [])

  const handleSelectLevel = useCallback((level: LevelConfig) => {
    gameAudio.playClick()
    setCurrentLevel(level)
    setScreen('playing')
  }, [])

  const handleLevelComplete = useCallback((score: number, stars: number, newCards: number[]) => {
    gameAudio.playClick()
    const updated = { ...progress }

    // Update stars
    if (!updated.starRatings[currentLevel!.id] || stars > updated.starRatings[currentLevel!.id]) {
      updated.starRatings[currentLevel!.id] = stars
    }

    // Update high score
    if (!updated.highScores[currentLevel!.id] || score > updated.highScores[currentLevel!.id]) {
      updated.highScores[currentLevel!.id] = score
    }

    // Unlock next level
    if (currentLevel!.id < 30) {
      const nextId = currentLevel!.id + 1
      if (!updated.unlockedLevels.includes(nextId)) {
        updated.unlockedLevels.push(nextId)
      }
    }

    // Collect heritage cards
    for (const cardId of newCards) {
      if (!updated.collectedCards.includes(cardId)) {
        updated.collectedCards.push(cardId)
      }
    }

    // Recalculate total stars
    updated.totalStars = Object.values(updated.starRatings).reduce((sum, s) => sum + s, 0)

    setProgress(updated)
    saveProgress(updated)
    setCurrentLevel(null)
    setScreen('levelSelect')
  }, [progress, currentLevel])

  const handleLevelLose = useCallback((_score: number) => {
    gameAudio.playClick()
    setCurrentLevel(null)
    setScreen('levelSelect')
  }, [])

  const handleBack = useCallback(() => {
    gameAudio.playClick()
    setCurrentLevel(null)
    setScreen('levelSelect')
  }, [])

  const handleToggleAudio = useCallback(() => {
    const next = !audioEnabled
    setAudioEnabled(next)
    gameAudio.setEnabled(next)
  }, [audioEnabled])

  if (screen === 'playing' && currentLevel) {
    return (
      <GameBoard
        level={currentLevel}
        onBack={handleBack}
        onLevelComplete={handleLevelComplete}
        onLevelLose={handleLevelLose}
      />
    )
  }

  if (screen === 'levelSelect') {
    return (
      <LevelSelectScreen
        levels={LEVELS}
        chapters={CHAPTERS}
        progress={progress}
        onSelectLevel={handleSelectLevel}
        onBack={() => { gameAudio.playClick(); setScreen('start') }}
      />
    )
  }

  return (
    <>
      <StartScreen
        onStart={handleStart}
        onHowToPlay={() => { gameAudio.playClick(); setShowHowToPlay(true) }}
        onHeritageGallery={() => { gameAudio.playClick(); setShowHeritageGallery(true) }}
        audioEnabled={audioEnabled}
        onToggleAudio={handleToggleAudio}
        totalStars={progress.totalStars}
      />

      {showHowToPlay && (
        <HowToPlayModal onClose={() => { gameAudio.playClick(); setShowHowToPlay(false) }} />
      )}

      {showHeritageGallery && (
        <HeritageGallery
          cards={HERITAGE_CARDS}
          collected={progress.collectedCards}
          onBack={() => { gameAudio.playClick(); setShowHeritageGallery(false) }}
        />
      )}
    </>
  )
}