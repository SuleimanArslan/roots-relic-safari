import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight, Star, Crown } from 'lucide-react'
import { HERITAGE_CARDS } from '../constants'
import type { HeritageCard } from '../types'

interface WinModalProps {
  score: number
  finalStars: number
  levelId: number
  levelName: string
  newCards: number[]
  onNextLevel: () => void
  onLevelSelect: () => void
}

export function WinModal({ score, finalStars, levelId, levelName, newCards, onNextLevel, onLevelSelect }: WinModalProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
    >
      <motion.div
        initial={{ scale: 0.8, y: 40 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.8, y: 40 }}
        className="bg-gradient-to-b from-[#2D1810] to-[#1A0A00] border border-[#D4A017]/30 rounded-2xl p-6 w-full max-w-sm text-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1, rotate: [0, 10, -10, 0] }}
          transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
        >
          <Crown className="w-16 h-16 text-[#F1C40F] mx-auto mb-2" />
        </motion.div>
        <h2 className="text-2xl font-bold text-[#F1C40F] mb-1">Victory!</h2>
        <p className="text-[#B8860B] text-sm mb-4">{levelName} completed</p>

        {/* Stars */}
        <div className="flex justify-center gap-2 mb-4">
          {[1, 2, 3].map(s => (
            <motion.div
              key={s}
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', stiffness: 200, delay: 0.3 + s * 0.2 }}
            >
              <Star
                className={`w-10 h-10 ${s <= finalStars ? 'fill-[#F1C40F] text-[#F1C40F]' : 'text-[#4A3A2A]'}`}
              />
            </motion.div>
          ))}
        </div>

        <div className="bg-[#1A0A00]/60 rounded-xl p-3 mb-4">
          <p className="text-[#D4A017] text-sm">Score</p>
          <p className="text-[#F1C40F] text-2xl font-bold">{score}</p>
        </div>

        {/* Heritage Card Unlock */}
        <AnimatePresence>
          {newCards.map(cardId => {
            const card = HERITAGE_CARDS.find(c => c.id === cardId)
            if (!card) return null
            return (
              <motion.div
                key={cardId}
                initial={{ opacity: 0, y: 20, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ delay: 0.8 }}
                className="bg-gradient-to-r from-[#D4A017]/10 to-[#1ABC9C]/10 border border-[#D4A017]/30 rounded-xl p-3 mb-4"
              >
                <div className="flex items-center gap-2 mb-1">
                  <BookIcon className="w-3.5 h-3.5 text-[#1ABC9C]" />
                  <span className="text-xs font-bold text-[#1ABC9C] uppercase tracking-wider">Discovery Unlocked!</span>
                </div>
                <p className="text-[#F1C40F] text-sm font-bold">{card.icon} {card.title}</p>
                <p className="text-[#B8860B] text-xs mt-1">{card.fact}</p>
              </motion.div>
            )
          })}
        </AnimatePresence>

        <div className="flex gap-2">
          {levelId < 30 && (
            <button onClick={onNextLevel} className="flex-1 py-3 bg-gradient-to-r from-[#D4A017] to-[#F1C40F] text-[#1A0A00] font-bold rounded-xl flex items-center justify-center gap-2">
              Next Level
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
          <button onClick={onLevelSelect} className="flex-1 py-3 bg-white/10 text-[#D4A017] border border-[#D4A017]/30 rounded-xl font-bold">
            Level Select
          </button>
        </div>
      </motion.div>
    </motion.div>
  )
}

interface LoseModalProps {
  score: number
  targetScore: number
  onRetry: () => void
  onLevelSelect: () => void
}

export function LoseModal({ score, targetScore, onRetry, onLevelSelect }: LoseModalProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
    >
      <motion.div
        initial={{ scale: 0.8, y: 40 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.8, y: 40 }}
        className="bg-gradient-to-b from-[#2D1810] to-[#1A0A00] border border-[#C0392B]/30 rounded-2xl p-6 w-full max-w-sm text-center"
      >
        <div className="text-6xl mb-2">😔</div>
        <h2 className="text-2xl font-bold text-[#C0392B] mb-1">Out of Moves</h2>
        <p className="text-[#B8860B] text-sm mb-4">Keep practicing!</p>

        <div className="bg-[#1A0A00]/60 rounded-xl p-3 mb-4">
          <p className="text-[#D4A017] text-sm">Score</p>
          <p className="text-[#F1C40F] text-2xl font-bold">{score}</p>
          <p className="text-[#B8860B] text-xs mt-1">Target: {targetScore}</p>
        </div>

        <div className="flex gap-2">
          <button onClick={onRetry} className="flex-1 py-3 bg-gradient-to-r from-[#D4A017] to-[#F1C40F] text-[#1A0A00] font-bold rounded-xl">
            Try Again
          </button>
          <button onClick={onLevelSelect} className="flex-1 py-3 bg-white/10 text-[#D4A017] border border-[#D4A017]/30 rounded-xl font-bold">
            Level Select
          </button>
        </div>
      </motion.div>
    </motion.div>
  )
}

interface PauseMenuProps {
  onResume: () => void
  onRestart: () => void
  onQuit: () => void
}

export function PauseMenu({ onResume, onRestart, onQuit }: PauseMenuProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
    >
      <motion.div
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.9 }}
        className="bg-gradient-to-b from-[#2D1810] to-[#1A0A00] border border-[#D4A017]/30 rounded-2xl p-6 w-64 text-center"
      >
        <h3 className="text-xl font-bold text-[#F1C40F] mb-6">Paused</h3>
        <div className="space-y-3">
          <button onClick={onResume} className="w-full py-3 bg-gradient-to-r from-[#D4A017] to-[#F1C40F] text-[#1A0A00] font-bold rounded-xl">
            Resume
          </button>
          <button onClick={onRestart} className="w-full py-3 bg-white/10 text-[#D4A017] border border-[#D4A017]/30 rounded-xl font-bold">
            Restart
          </button>
          <button onClick={onQuit} className="w-full py-3 bg-white/5 text-[#B8860B] border border-white/10 rounded-xl font-bold">
            Quit
          </button>
        </div>
      </motion.div>
    </motion.div>
  )
}

function BookIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
      <path d="M8 7h8" /><path d="M8 11h6" />
    </svg>
  )
}