export type SymbolType =
  | 'drum' | 'pottery' | 'kente' | 'mask' | 'leaf'
  | 'baobab' | 'gazelle' | 'granary' | 'crown' | 'relic'

export type SpecialType = 'none' | 'row' | 'col' | 'bomb' | 'rainbow'

export interface Tile {
  id: string
  type: SymbolType
  special: SpecialType
  frozen: boolean
  row: number
  col: number
}

export interface Position {
  row: number
  col: number
}

export interface MatchResult {
  positions: Position[]
  length: number
  specialCreated?: SpecialType
  specialActivated?: { type: SpecialType; position: Position }
}

export interface SwapResult {
  valid: boolean
  matches: MatchResult[]
  cascadeCount: number
  scoreGained: number
  board: (Tile | null)[][]
  specialsActivated: boolean
  newSpecials: { position: Position; type: SpecialType }[]
}

export interface LevelObjective {
  type: 'score' | 'collect' | 'clear'
  symbol?: SymbolType
  target: number
  current: number
}

export interface LevelConfig {
  id: number
  chapter: number
  name: string
  rows: number
  cols: number
  maxMoves: number
  maxTime?: number
  targetScore: number
  objectives: LevelObjective[]
  symbols: SymbolType[]
  obstacles?: { row: number; col: number }[]
  frozenTiles?: { row: number; col: number }[]
  starThresholds: [number, number, number]
}

export interface ChapterConfig {
  id: number
  name: string
  subtitle: string
  color: string
  secondaryColor: string
  accentColor: string
  symbol: string
}

export interface HeritageCard {
  id: number
  title: string
  fact: string
  region: string
  icon: string
  unlockedAtLevel: number
}

export interface GameProgress {
  unlockedLevels: number[]
  starRatings: Record<number, number>
  highScores: Record<number, number>
  collectedCards: number[]
  totalStars: number
}

export type GameScreen = 'start' | 'levelSelect' | 'playing' | 'heritageGallery'

export interface SymbolDef {
  type: SymbolType
  name: string
  emoji: string
  color: string
  bgColor: string
  shape: string
}