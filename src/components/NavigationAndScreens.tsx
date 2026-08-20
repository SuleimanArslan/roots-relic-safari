import { motion, AnimatePresence } from 'framer-motion'
import { Star, Play, Trophy, Book, HelpCircle, ChevronLeft, Crown, Sparkles, MapPin, Lock, Volume2, VolumeX } from 'lucide-react'
import type { LevelConfig, ChapterConfig, HeritageCard, GameProgress } from '../types'

interface StartScreenProps {
  onStart: () => void
  onHowToPlay: () => void
  onHeritageGallery: () => void
  audioEnabled: boolean
  onToggleAudio: () => void
  totalStars: number
}

export function StartScreen({ onStart, onHowToPlay, onHeritageGallery, audioEnabled, onToggleAudio, totalStars }: StartScreenProps) {
  return (
    <div className="relative min-h-[100dvh] flex flex-col items-center justify-center overflow-hidden bg-gradient-to-b from-[#1A0A00] via-[#2D1810] to-[#1A0A00] px-4">
      {/* Animated background particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 rounded-full"
            style={{
              background: ['#D4A017', '#C75B39', '#7B3FAF', '#1ABC9C', '#D4782B', '#F1C40F'][i % 6],
              left: `${10 + (i * 8) % 80}%`,
              top: `${5 + (i * 13) % 90}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.2, 0.6, 0.2],
              scale: [1, 1.5, 1],
            }}
            transition={{ duration: 3 + i * 0.5, repeat: Infinity, ease: 'easeInOut' }}
          />
        ))}
      </div>

      {/* Decorative top border */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#D4A017] via-[#C75B39] to-[#D4A017]" />

      <div className="relative z-10 flex flex-col items-center text-center max-w-md mx-auto">
        {/* Logo / Title */}
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="mb-2"
        >
          <div className="text-6xl mb-4">🏛️</div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-[#F1C40F] drop-shadow-lg">
            ROOTS &amp; RELICS
          </h1>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-lg text-[#D4A017] mb-2 font-light tracking-wider"
        >
          Match. Discover. Remember.
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.35 }}
          className="text-sm text-[#B8860B]/70 mb-8 max-w-xs"
        >
          Journey through Africa's heritage in this match-3 puzzle adventure
        </motion.p>

        {/* Play Button */}
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onStart}
          className="group relative px-10 py-4 bg-gradient-to-r from-[#D4A017] to-[#F1C40F] text-[#1A0A00] font-bold text-lg rounded-xl shadow-2xl shadow-[#D4A017]/30 overflow-hidden mb-4"
        >
          <span className="relative z-10 flex items-center gap-3">
            <Play className="w-5 h-5 fill-current" />
            START JOURNEY
          </span>
          <div className="absolute inset-0 bg-gradient-to-r from-[#C75B39] to-[#D4A017] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </motion.button>

        {/* Secondary buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.65 }}
          className="flex gap-3"
        >
          <button
            onClick={onHowToPlay}
            className="flex items-center gap-2 px-4 py-2.5 bg-white/5 hover:bg-white/10 border border-[#D4A017]/30 rounded-lg text-[#D4A017] text-sm transition-all"
          >
            <HelpCircle className="w-4 h-4" />
            How to Play
          </button>
          <button
            onClick={onHeritageGallery}
            className="flex items-center gap-2 px-4 py-2.5 bg-white/5 hover:bg-white/10 border border-[#D4A017]/30 rounded-lg text-[#D4A017] text-sm transition-all"
          >
            <Book className="w-4 h-4" />
            Heritage
          </button>
          <button
            onClick={onToggleAudio}
            className="flex items-center justify-center w-10 h-10 bg-white/5 hover:bg-white/10 border border-[#D4A017]/30 rounded-lg text-[#D4A017] text-sm transition-all"
          >
            {audioEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>
        </motion.div>

        {/* Stars display */}
        {totalStars > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="mt-6 flex items-center gap-2 text-[#F1C40F]/60 text-sm"
          >
            <Trophy className="w-4 h-4" />
            <span>{totalStars} stars collected</span>
          </motion.div>
        )}
      </div>

      {/* Bottom decorative border */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[#D4A017] via-[#C75B39] to-[#D4A017]" />
    </div>
  )
}

interface LevelSelectProps {
  levels: LevelConfig[]
  chapters: ChapterConfig[]
  progress: GameProgress
  onSelectLevel: (level: LevelConfig) => void
  onBack: () => void
}

export function LevelSelectScreen({ levels, chapters, progress, onSelectLevel, onBack }: LevelSelectProps) {
  const chapterLevels = (chapterId: number) => levels.filter(l => l.chapter === chapterId)
  const chapterProgress = (chapterId: number) => {
    const chLevels = chapterLevels(chapterId)
    const completed = chLevels.filter(l => progress.starRatings[l.id] > 0).length
    const stars = chLevels.reduce((sum, l) => sum + (progress.starRatings[l.id] || 0), 0)
    return { completed, total: chLevels.length, stars }
  }

  return (
    <div className="min-h-[100dvh] bg-gradient-to-b from-[#1A0A00] via-[#2D1810] to-[#1A0A00] px-4 py-6">
      {/* Header */}
      <div className="flex items-center mb-6">
        <button onClick={onBack} className="flex items-center gap-2 text-[#D4A017] hover:text-[#F1C40F] transition-colors">
          <ChevronLeft className="w-5 h-5" />
          <span className="text-sm">Back</span>
        </button>
        <h2 className="flex-1 text-center text-xl font-bold text-[#F1C40F]">Select Level</h2>
        <div className="w-16" />
      </div>

      {/* Chapters */}
      {chapters.map(chapter => {
        const chLvls = chapterLevels(chapter.id)
        const prog = chapterProgress(chapter.id)
        return (
          <div key={chapter.id} className="mb-8">
            <div className="flex items-center gap-3 mb-3">
              <span className="text-2xl">{chapter.symbol}</span>
              <div>
                <h3 className="text-lg font-bold text-[#F1C40F]">{chapter.name}</h3>
                <p className="text-xs text-[#B8860B]/70">{chapter.subtitle}</p>
              </div>
              <div className="ml-auto text-right">
                <div className="flex items-center gap-1 text-[#D4A017] text-sm">
                  <Star className="w-3 h-3 fill-current" />
                  <span>{prog.stars}/{chLvls.length * 3}</span>
                </div>
                <p className="text-xs text-[#B8860B]/60">{prog.completed}/{prog.total}</p>
              </div>
            </div>

            {/* Level grid */}
            <div className="grid grid-cols-5 gap-2">
              {chLvls.map(level => {
                const stars = progress.starRatings[level.id] || 0
                const unlocked = progress.unlockedLevels.includes(level.id)
                const highScore = progress.highScores[level.id] || 0
                return (
                  <motion.button
                    key={level.id}
                    whileHover={unlocked ? { scale: 1.08 } : {}}
                    whileTap={unlocked ? { scale: 0.95 } : {}}
                    onClick={() => unlocked && onSelectLevel(level)}
                    className={`relative aspect-square rounded-xl flex flex-col items-center justify-center text-sm font-bold transition-all ${
                      unlocked
                        ? stars > 0
                          ? 'bg-gradient-to-b from-[#D4A017]/20 to-[#2D1810] border border-[#D4A017]/40 text-[#F1C40F] cursor-pointer hover:border-[#D4A017]'
                          : 'bg-white/5 border border-white/10 text-[#D4A017] cursor-pointer hover:border-[#D4A017]/50'
                        : 'bg-[#1A0A00] border border-[#2D1810] text-[#4A3A2A] cursor-not-allowed'
                    }`}
                  >
                    {unlocked ? (
                      <>
                        <span className="text-lg">{level.id}</span>
                        {stars > 0 && (
                          <div className="flex gap-0.5 mt-1">
                            {[1, 2, 3].map(s => (
                              <Star
                                key={s}
                                className={`w-2.5 h-2.5 ${s <= stars ? 'fill-[#F1C40F] text-[#F1C40F]' : 'text-[#4A3A2A]'}`}
                              />
                            ))}
                          </div>
                        )}
                        {highScore > 0 && (
                          <span className="text-[8px] text-[#B8860B]/60 mt-0.5">{highScore}</span>
                        )}
                      </>
                    ) : (
                      <Lock className="w-4 h-4 text-[#4A3A2A]" />
                    )}
                  </motion.button>
                )
              })}
            </div>
          </div>
        )
      })}
    </div>
  )
}

interface HowToPlayProps {
  onClose: () => void
}

export function HowToPlayModal({ onClose }: HowToPlayProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        onClick={e => e.stopPropagation()}
        className="bg-gradient-to-b from-[#2D1810] to-[#1A0A00] border border-[#D4A017]/30 rounded-2xl p-6 max-w-sm w-full max-h-[80vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-[#F1C40F] flex items-center gap-2">
            <HelpCircle className="w-5 h-5" />
            How to Play
          </h2>
          <button onClick={onClose} className="text-[#B8860B] hover:text-[#D4A017]">
            ✕
          </button>
        </div>

        <div className="space-y-4 text-sm">
          <div className="bg-white/5 rounded-xl p-4">
            <h3 className="font-bold text-[#D4A017] mb-2">🎯 Goal</h3>
            <p className="text-[#B8860B] leading-relaxed">
              Match 3 or more identical symbols by swapping adjacent tiles. Reach the target score to advance!
            </p>
          </div>

          <div className="bg-white/5 rounded-xl p-4">
            <h3 className="font-bold text-[#D4A017] mb-2">🔄 Swapping</h3>
            <p className="text-[#B8860B] leading-relaxed">
              Click or drag a tile to swap it with an adjacent tile. If you create a match of 3+, the tiles disappear and you earn points.
            </p>
          </div>

          <div className="bg-white/5 rounded-xl p-4">
            <h3 className="font-bold text-[#D4A017] mb-2">⭐ Special Tiles</h3>
            <ul className="text-[#B8860B] space-y-1 leading-relaxed">
              <li><strong className="text-[#D4A017]">Match 4:</strong> Creates a line-clearing relic</li>
              <li><strong className="text-[#D4A017]">Match 5+:</strong> Creates a bomb relic</li>
              <li>These activate when matched with other tiles!</li>
            </ul>
          </div>

          <div className="bg-white/5 rounded-xl p-4">
            <h3 className="font-bold text-[#D4A017] mb-2">💎 Cascades</h3>
            <p className="text-[#B8860B] leading-relaxed">
              After a match, new tiles fall in. Chain reactions earn bonus multiplier points!
            </p>
          </div>

          <div className="bg-white/5 rounded-xl p-4">
            <h3 className="font-bold text-[#D4A017] mb-2">🏆 Heritage Cards</h3>
            <p className="text-[#B8860B] leading-relaxed">
              Complete certain levels to unlock Heritage Discovery Cards with fascinating facts about African culture and history.
            </p>
          </div>

          <div className="bg-white/5 rounded-xl p-4">
            <h3 className="font-bold text-[#D4A017] mb-2">⭐ Stars</h3>
            <p className="text-[#B8860B] leading-relaxed">
              Earn 1-3 stars per level based on your score. Collect stars to track your overall progress!
            </p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="mt-5 w-full py-3 bg-gradient-to-r from-[#D4A017] to-[#F1C40F] text-[#1A0A00] font-bold rounded-xl"
        >
          Got it!
        </button>
      </motion.div>
    </motion.div>
  )
}

interface HeritageGalleryProps {
  cards: HeritageCard[]
  collected: number[]
  onBack: () => void
}

export function HeritageGallery({ cards, collected, onBack }: HeritageGalleryProps) {
  return (
    <div className="min-h-[100dvh] bg-gradient-to-b from-[#1A0A00] via-[#2D1810] to-[#1A0A00] px-4 py-6">
      <div className="flex items-center mb-6">
        <button onClick={onBack} className="flex items-center gap-2 text-[#D4A017] hover:text-[#F1C40F] transition-colors">
          <ChevronLeft className="w-5 h-5" />
          <span className="text-sm">Back</span>
        </button>
        <h2 className="flex-1 text-center text-xl font-bold text-[#F1C40F] flex items-center justify-center gap-2">
          <Book className="w-5 h-5" />
          Heritage Gallery
        </h2>
        <div className="w-16" />
      </div>

      <p className="text-center text-[#B8860B]/70 text-sm mb-6">
        Discovered {collected.length} of {cards.length} cards
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-lg mx-auto">
        {cards.map(card => {
          const discovered = collected.includes(card.id)
          return (
            <motion.div
              key={card.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`relative rounded-xl p-4 border ${
                discovered
                  ? 'bg-gradient-to-b from-[#D4A017]/10 to-[#2D1810] border-[#D4A017]/40'
                  : 'bg-[#1A0A00]/50 border-[#2D1810] opacity-50'
              }`}
            >
              {discovered ? (
                <>
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">{card.icon}</span>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-bold text-[#F1C40F]">{card.title}</h3>
                      <p className="text-xs text-[#B8860B]/70 mt-1 leading-relaxed">{card.fact}</p>
                      <span className="inline-block mt-2 text-[10px] text-[#D4A017]/60 bg-[#D4A017]/10 px-2 py-0.5 rounded-full">
                        {card.region}
                      </span>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex items-center gap-3">
                  <span className="text-2xl opacity-30">❓</span>
                  <div>
                    <h3 className="text-sm font-bold text-[#4A3A2A]">???</h3>
                    <p className="text-xs text-[#4A3A2A]/60">Discover at level {card.unlockedAtLevel}</p>
                  </div>
                </div>
              )}
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}