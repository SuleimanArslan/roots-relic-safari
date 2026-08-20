import { useState, useCallback, useRef } from 'react'
import { motion, AnimatePresence, type PanInfo } from 'framer-motion'
import { ArrowLeft, Star, Trophy, Clock, Sparkles } from 'lucide-react'
import type { Tile, LevelConfig, Position } from '../types'
import { createBoard, trySwap, hasValidMoves, shuffleBoard, checkWinCondition, calculateStars, resetTileCounter } from '../utils/matchEngine'
import { gameAudio } from '../utils/audio'
import { SYMBOLS, HERITAGE_CARDS, SCORE_VALUES } from '../constants'
import { WinModal, LoseModal, PauseMenu } from './GameModals'

interface GameBoardProps {
  level: LevelConfig
  onBack: () => void
  onLevelComplete: (score: number, stars: number, newCards: number[]) => void
  onLevelLose: (score: number) => void
}

interface ScorePopup {
  id: number
  value: number
  x: number
  y: number
}

export default function GameBoard({ level, onBack, onLevelComplete, onLevelLose }: GameBoardProps) {
  const [board, setBoard] = useState<(Tile | null)[][]>(() => {
    resetTileCounter()
    return createBoard(level)
  })
  const [selectedTile, setSelectedTile] = useState<Position | null>(null)
  const [score, setScore] = useState(0)
  const [movesLeft, setMovesLeft] = useState(level.maxMoves)
  const [collected, setCollected] = useState<Record<string, number>>({})
  const [scorePopups, setScorePopups] = useState<ScorePopup[]>([])
  const [animatingTiles, setAnimatingTiles] = useState<Set<string>>(new Set())
  const [gameOver, setGameOver] = useState<'win' | 'lose' | null>(null)
  const [finalStars, setFinalStars] = useState(0)
  const [newCards, setNewCards] = useState<number[]>([])
  const [showPauseMenu, setShowPauseMenu] = useState(false)
  const [shuffling, setShuffling] = useState(false)
  const popupIdRef = useRef(0)
  const boardRef = useRef<HTMLDivElement>(null)
  const dragStartRef = useRef<Position | null>(null)

  const addScorePopup = useCallback((value: number, row: number, col: number) => {
    const id = ++popupIdRef.current
    const el = boardRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const tileSize = Math.min(rect.width / level.cols, rect.height / level.rows)
    const x = (col + 0.5) * tileSize
    const y = (row + 0.5) * tileSize
    setScorePopups(prev => [...prev, { id, value, x, y }])
    setTimeout(() => {
      setScorePopups(prev => prev.filter(p => p.id !== id))
    }, 1000)
  }, [level.cols, level.rows])

  const handleSwap = useCallback((from: Position, to: Position) => {
    if (gameOver || shuffling) return
    const boardCopy = board.map(row => row.map(t => t ? { ...t } : null))
    const result = trySwap(boardCopy, from, to, level.rows, level.cols)
    if (!result || !result.valid) {
      gameAudio.playClick()
      return
    }
    gameAudio.playSwap()
    setMovesLeft(prev => prev - 1)
    setScore(prev => prev + result.scoreGained)
    setBoard(boardCopy)

    const animSet = new Set<string>()
    for (const match of result.matches) {
      for (const pos of match.positions) {
        animSet.add(`${pos.row},${pos.col}`)
        addScorePopup(SCORE_VALUES[match.length] || 50, pos.row, pos.col)
      }
    }
    setAnimatingTiles(animSet)

    const newCollected = { ...collected }
    for (const match of result.matches) {
      const tile = board[match.positions[0].row][match.positions[0].col]
      if (tile) {
        newCollected[tile.type] = (newCollected[tile.type] || 0) + match.length
      }
    }
    setCollected(newCollected)

    if (result.cascadeCount > 1) {
      gameAudio.playCascade(result.cascadeCount)
    } else {
      gameAudio.playMatch(result.matches[0].length)
    }
    if (result.specialsActivated) gameAudio.playSpecial()

    setTimeout(() => setAnimatingTiles(new Set()), 500)
    setTimeout(() => {
      if (!hasValidMoves(boardCopy, level.rows, level.cols)) {
        setShuffling(true)
        shuffleBoard(boardCopy, level.rows, level.cols, level.symbols)
        setBoard([...boardCopy])
        setTimeout(() => setShuffling(false), 600)
      }
    }, 600)

    const newScore = score + result.scoreGained
    const newMoves = movesLeft - 1
    if (checkWinCondition(level, newScore, { ...newCollected, ...collected })) {
      const stars = calculateStars(newScore, level.starThresholds)
      setTimeout(() => {
        setFinalStars(stars)
        setGameOver('win')
        gameAudio.playWin()
        const cards = HERITAGE_CARDS.filter(c => c.unlockedAtLevel === level.id).map(c => c.id)
        if (cards.length > 0) {
          setNewCards(cards)
          gameAudio.playHeritage()
        }
      }, 800)
    } else if (newMoves <= 0) {
      setTimeout(() => {
        setGameOver('lose')
        gameAudio.playLose()
      }, 800)
    }
  }, [board, score, movesLeft, collected, gameOver, shuffling, level, addScorePopup])

  const handleTileClick = useCallback((row: number, col: number) => {
    if (gameOver || shuffling) return
    const tile = board[row][col]
    if (!tile || tile.frozen) return
    if (!selectedTile) {
      setSelectedTile({ row, col })
      gameAudio.playClick()
      return
    }
    if (selectedTile.row === row && selectedTile.col === col) {
      setSelectedTile(null)
      return
    }
    handleSwap(selectedTile, { row, col })
    setSelectedTile(null)
  }, [board, selectedTile, gameOver, shuffling, handleSwap])

  const handleDragStart = useCallback((row: number, col: number) => {
    if (gameOver || shuffling) return
    dragStartRef.current = { row, col }
    setSelectedTile({ row, col })
  }, [gameOver, shuffling])

  const handleDragEnd = useCallback((_event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (!dragStartRef.current || gameOver || shuffling) return
    const { row, col } = dragStartRef.current
    const { offsetX, offsetY } = { offsetX: info.offset.x, offsetY: info.offset.y }
    let targetRow = row, targetCol = col
    if (Math.abs(offsetX) > Math.abs(offsetY)) {
      targetCol = offsetX > 0 ? col + 1 : col - 1
    } else {
      targetRow = offsetY > 0 ? row + 1 : row - 1
    }
    if (targetRow >= 0 && targetRow < level.rows && targetCol >= 0 && targetCol < level.cols) {
      handleSwap({ row, col }, { row: targetRow, col: targetCol })
    }
    dragStartRef.current = null
    setSelectedTile(null)
  }, [gameOver, shuffling, level.rows, level.cols, handleSwap])

  const handleRestart = () => {
    gameAudio.playClick()
    resetTileCounter()
    setBoard(createBoard(level))
    setScore(0)
    setMovesLeft(level.maxMoves)
    setCollected({})
    setSelectedTile(null)
    setGameOver(null)
    setFinalStars(0)
    setNewCards([])
    setShowPauseMenu(false)
  }

  const getTileEmoji = (type: string, special: string): string => {
    const base = SYMBOLS.find(s => s.type === type)?.emoji || '🟦'
    if (special === 'bomb') return '💥'
    if (special === 'row' || special === 'col') return '✨'
    return base
  }

  const getTileBg = (type: string): string => {
    const colors: Record<string, string> = {
      drum: 'bg-[#D4782B]', pottery: 'bg-[#C75B39]', kente: 'bg-[#7B3FAF]',
      mask: 'bg-[#C0392B]', leaf: 'bg-[#2E7D32]', baobab: 'bg-[#D4A017]',
      gazelle: 'bg-[#D4956A]', granary: 'bg-[#8D6E63]', crown: 'bg-[#F1C40F]',
      relic: 'bg-[#1ABC9C]',
    }
    return colors[type] || 'bg-gray-500'
  }

  const tileSize = `calc((min(85vw, 450px) - ${(level.cols - 1) * 3}px) / ${level.cols}`

  return (
    <div className="min-h-[100dvh] bg-gradient-to-b from-[#1A0A00] via-[#2D1810] to-[#1A0A00] flex flex-col">
      {/* Game Header */}
      <div className="px-3 py-3 flex items-center justify-between bg-[#1A0A00]/80 border-b border-[#D4A017]/20">
        <button onClick={() => { gameAudio.playClick(); setShowPauseMenu(true) }} className="p-2 text-[#D4A017] hover:text-[#F1C40F] transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex-1 text-center">
          <h2 className="text-sm font-bold text-[#F1C40F]">{level.name}</h2>
          <p className="text-[10px] text-[#B8860B]/70">Level {level.id}</p>
        </div>
        <div className="flex items-center gap-1 text-[#D4A017]">
          <Trophy className="w-4 h-4" />
          <span className="text-sm font-bold">{score}</span>
        </div>
      </div>

      {/* Stats bar */}
      <div className="px-4 py-2 flex items-center justify-between bg-[#1A0A00]/40">
        <div className="flex items-center gap-1 text-[#D4A017] text-sm">
          <Clock className="w-3.5 h-3.5" />
          <span className={movesLeft <= 5 ? 'text-red-400 font-bold' : ''}>{movesLeft}</span>
        </div>
        <div className="flex items-center gap-1 text-[#D4A017] text-sm">
          <Star className="w-3.5 h-3.5" />
          <span>Target: {level.targetScore}</span>
        </div>
        <div className="flex-1 max-w-[120px] mx-2">
          <div className="h-1.5 bg-[#2D1810] rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-[#D4A017] to-[#F1C40F] rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(100, (score / level.targetScore) * 100)}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>
        {level.objectives.filter(o => o.type === 'collect').map((obj, i) => (
          <div key={i} className="text-xs text-[#B8860B] flex items-center gap-1">
            <span>{SYMBOLS.find(s => s.type === obj.symbol)?.emoji}</span>
            <span>{collected[obj.symbol!] || 0}/{obj.target}</span>
          </div>
        ))}
      </div>

      {/* Game Board */}
      <div className="flex-1 flex items-center justify-center p-2">
        <div ref={boardRef} className="relative bg-[#1A0A00]/60 border border-[#D4A017]/20 rounded-2xl p-2 shadow-2xl" style={{ maxWidth: '85vw', width: 450 }}>
          <div className="grid gap-[3px]" style={{ gridTemplateColumns: `repeat(${level.cols}, ${tileSize})`, gridTemplateRows: `repeat(${level.rows}, ${tileSize})` }}>
            {board.map((row, r) =>
              row.map((tile, c) => {
                if (!tile) return <div key={`e${r}-${c}`} className="rounded-lg bg-[#0D0500]" />
                const isSelected = selectedTile?.row === r && selectedTile?.col === c
                const isAnimating = animatingTiles.has(`${r},${c}`)
                const isFrozen = tile.frozen
                return (
                  <motion.button
                    key={tile.id}
                    layoutId={tile.id}
                    initial={{ scale: 0, y: -20 }}
                    animate={{ scale: 1, y: 0, opacity: isAnimating ? 0 : 1, rotate: isAnimating ? [0, 10, -10, 0] : 0 }}
                    exit={{ scale: 0, opacity: 0 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 25, duration: isAnimating ? 0.4 : 0.3 }}
                    onClick={() => handleTileClick(r, c)}
                    onPanStart={() => handleDragStart(r, c)}
                    onPanEnd={handleDragEnd}
                    className={`rounded-lg flex items-center justify-center text-xl sm:text-2xl select-none touch-none cursor-pointer
                      ${isFrozen ? 'bg-[#2A2A2A] border border-[#4A4A4A]' : getTileBg(tile.type)}
                      ${isSelected ? 'ring-2 ring-[#F1C40F] ring-offset-2 ring-offset-[#1A0A00] scale-110 z-10' : ''}
                      ${tile.special !== 'none' ? 'ring-1 ring-white/40 shadow-lg shadow-white/10' : ''}
                      ${isFrozen ? 'cursor-not-allowed' : 'hover:brightness-110 active:scale-95'}
                      transition-all duration-150`}
                  >
                    <AnimatePresence>
                      {isAnimating && (
                        <motion.div initial={{ scale: 1, opacity: 1 }} exit={{ scale: 2, opacity: 0 }} className="absolute inset-0 flex items-center justify-center">
                          <Sparkles className="w-6 h-6 text-white" />
                        </motion.div>
                      )}
                    </AnimatePresence>
                    {isFrozen ? '🧊' : getTileEmoji(tile.type, tile.special)}
                    {tile.special !== 'none' && !isFrozen && (
                      <motion.div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-[#F1C40F] flex items-center justify-center" animate={{ scale: [1, 1.3, 1] }} transition={{ duration: 1.5, repeat: Infinity }}>
                        <span className="text-[6px] text-[#1A0A00] font-bold">✦</span>
                      </motion.div>
                    )}
                  </motion.button>
                )
              })
            )}
          </div>

          {/* Score Popups */}
          <AnimatePresence>
            {scorePopups.map(popup => (
              <motion.div
                key={popup.id}
                initial={{ opacity: 1, y: 0, scale: 0.5 }}
                animate={{ opacity: 0, y: -60, scale: 1.2 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
                className="absolute pointer-events-none text-[#F1C40F] font-bold text-lg drop-shadow-lg"
                style={{ left: popup.x, top: popup.y }}
              >
                +{popup.value}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* Modals */}
      <AnimatePresence>
        {showPauseMenu && (
          <PauseMenu
            onResume={() => { gameAudio.playClick(); setShowPauseMenu(false) }}
            onRestart={handleRestart}
            onQuit={() => { gameAudio.playClick(); onBack() }}
          />
        )}
        {gameOver === 'win' && (
          <WinModal
            score={score}
            finalStars={finalStars}
            levelId={level.id}
            levelName={level.name}
            newCards={newCards}
            onNextLevel={() => onLevelComplete(score, finalStars, newCards)}
            onLevelSelect={() => onLevelComplete(score, finalStars, newCards)}
          />
        )}
        {gameOver === 'lose' && (
          <LoseModal
            score={score}
            targetScore={level.targetScore}
            onRetry={handleRestart}
            onLevelSelect={() => onLevelLose(score)}
          />
        )}
      </AnimatePresence>
    </div>
  )
}