import type { SymbolDef, LevelConfig, ChapterConfig, HeritageCard, SymbolType } from './types'

export const SYMBOLS: SymbolDef[] = [
  { type: 'drum', name: 'Talking Drum', emoji: '🥁', color: '#D4782B', bgColor: '#2D1810', shape: 'drum' },
  { type: 'pottery', name: 'Terracotta Pottery', emoji: '🏺', color: '#C75B39', bgColor: '#2A1410', shape: 'pottery' },
  { type: 'kente', name: 'Kente Weave', emoji: '🔶', color: '#7B3FAF', bgColor: '#1E0F2E', shape: 'kente' },
  { type: 'mask', name: 'Ancestral Mask', emoji: '🎭', color: '#C0392B', bgColor: '#2A0F0D', shape: 'mask' },
  { type: 'leaf', name: 'Savanna Leaf', emoji: '🌿', color: '#2E7D32', bgColor: '#0F1F10', shape: 'leaf' },
  { type: 'baobab', name: 'Golden Baobab', emoji: '🌳', color: '#D4A017', bgColor: '#2A2008', shape: 'baobab' },
  { type: 'gazelle', name: 'Wildlife Gazelle', emoji: '🦌', color: '#D4956A', bgColor: '#2A1A10', shape: 'gazelle' },
  { type: 'granary', name: 'Granary Architecture', emoji: '🏛️', color: '#8D6E63', bgColor: '#1E1510', shape: 'granary' },
  { type: 'crown', name: 'Royal Crown', emoji: '👑', color: '#F1C40F', bgColor: '#2A2408', shape: 'crown' },
  { type: 'relic', name: 'Ancient Relic', emoji: '💎', color: '#1ABC9C', bgColor: '#0A1F1A', shape: 'relic' },
]

export const CHAPTERS: ChapterConfig[] = [
  { id: 1, name: 'West African Roots', subtitle: 'Discover the heartlands of heritage', color: '#8B4513', secondaryColor: '#D4782B', accentColor: '#C0392B', symbol: '🥁' },
  { id: 2, name: 'Eastern Horizons', subtitle: 'Explore the savanna & highlands', color: '#2E7D32', secondaryColor: '#D4A017', accentColor: '#1ABC9C', symbol: '🌿' },
  { id: 3, name: 'Southern Legacies', subtitle: 'Master ancient wisdom', color: '#6A1B9A', secondaryColor: '#F1C40F', accentColor: '#7B3FAF', symbol: '💎' },
]

const ALL_SYMBOLS: SymbolType[] = ['drum','pottery','kente','mask','leaf','baobab','gazelle','granary','crown','relic']

export const LEVELS: LevelConfig[] = [
  // Chapter 1: West African Roots (Levels 1-10, 6x6)
  { id: 1, chapter: 1, name: 'First Steps', rows: 6, cols: 6, maxMoves: 30, targetScore: 500, objectives: [{ type: 'score', target: 500, current: 0 }], symbols: ALL_SYMBOLS.slice(0, 5), starThresholds: [300, 500, 700] },
  { id: 2, chapter: 1, name: 'Drum Circle', rows: 6, cols: 6, maxMoves: 28, targetScore: 700, objectives: [{ type: 'score', target: 700, current: 0 }], symbols: ALL_SYMBOLS.slice(0, 5), starThresholds: [400, 700, 900] },
  { id: 3, chapter: 1, name: 'Pottery Path', rows: 6, cols: 6, maxMoves: 25, targetScore: 900, objectives: [{ type: 'score', target: 900, current: 0 }, { type: 'collect', symbol: 'pottery', target: 8, current: 0 }], symbols: ALL_SYMBOLS.slice(0, 5), starThresholds: [500, 900, 1200] },
  { id: 4, chapter: 1, name: 'Kente Colors', rows: 6, cols: 6, maxMoves: 26, targetScore: 1000, objectives: [{ type: 'score', target: 1000, current: 0 }], symbols: ALL_SYMBOLS.slice(0, 6), starThresholds: [600, 1000, 1300] },
  { id: 5, chapter: 1, name: 'Mask of Wisdom', rows: 6, cols: 6, maxMoves: 24, targetScore: 1200, objectives: [{ type: 'score', target: 1200, current: 0 }, { type: 'collect', symbol: 'mask', target: 6, current: 0 }], symbols: ALL_SYMBOLS.slice(0, 6), starThresholds: [700, 1200, 1600] },
  { id: 6, chapter: 1, name: 'Leaf Harvest', rows: 6, cols: 6, maxMoves: 22, targetScore: 1400, objectives: [{ type: 'score', target: 1400, current: 0 }, { type: 'collect', symbol: 'leaf', target: 10, current: 0 }], symbols: ALL_SYMBOLS.slice(0, 6), starThresholds: [800, 1400, 1800] },
  { id: 7, chapter: 1, name: 'Baobab Grove', rows: 6, cols: 6, maxMoves: 25, targetScore: 1500, objectives: [{ type: 'score', target: 1500, current: 0 }], symbols: ALL_SYMBOLS.slice(0, 7), starThresholds: [900, 1500, 2000] },
  { id: 8, chapter: 1, name: 'Gazelle Run', rows: 6, cols: 6, maxMoves: 20, targetScore: 1800, objectives: [{ type: 'score', target: 1800, current: 0 }, { type: 'collect', symbol: 'gazelle', target: 5, current: 0 }], symbols: ALL_SYMBOLS.slice(0, 7), starThresholds: [1000, 1800, 2400] },
  { id: 9, chapter: 1, name: 'Granary Gates', rows: 6, cols: 6, maxMoves: 22, targetScore: 2000, objectives: [{ type: 'score', target: 2000, current: 0 }], symbols: ALL_SYMBOLS.slice(0, 7), frozenTiles: [{ row: 2, col: 2 }, { row: 3, col: 3 }], starThresholds: [1200, 2000, 2600] },
  { id: 10, chapter: 1, name: 'Roots of Kings', rows: 6, cols: 6, maxMoves: 20, targetScore: 2500, objectives: [{ type: 'score', target: 2500, current: 0 }], symbols: ALL_SYMBOLS.slice(0, 8), starThresholds: [1500, 2500, 3200] },

  // Chapter 2: Eastern Horizons (Levels 11-20, 7x7)
  { id: 11, chapter: 2, name: 'Savanna Dawn', rows: 7, cols: 7, maxMoves: 30, targetScore: 2000, objectives: [{ type: 'score', target: 2000, current: 0 }], symbols: ALL_SYMBOLS.slice(0, 6), starThresholds: [1200, 2000, 2800] },
  { id: 12, chapter: 2, name: 'Highland Trail', rows: 7, cols: 7, maxMoves: 28, targetScore: 2500, objectives: [{ type: 'score', target: 2500, current: 0 }], symbols: ALL_SYMBOLS.slice(0, 6), frozenTiles: [{ row: 3, col: 2 }, { row: 3, col: 3 }, { row: 3, col: 4 }], starThresholds: [1500, 2500, 3300] },
  { id: 13, chapter: 2, name: 'Crown Jewels', rows: 7, cols: 7, maxMoves: 25, targetScore: 3000, objectives: [{ type: 'score', target: 3000, current: 0 }, { type: 'collect', symbol: 'crown', target: 8, current: 0 }], symbols: ALL_SYMBOLS.slice(0, 7), starThresholds: [1800, 3000, 4000] },
  { id: 14, chapter: 2, name: 'Relic Hunt', rows: 7, cols: 7, maxMoves: 26, targetScore: 3200, objectives: [{ type: 'score', target: 3200, current: 0 }, { type: 'collect', symbol: 'relic', target: 5, current: 0 }], symbols: ALL_SYMBOLS.slice(0, 7), starThresholds: [2000, 3200, 4200] },
  { id: 15, chapter: 2, name: 'Kente Valley', rows: 7, cols: 7, maxMoves: 24, targetScore: 3500, objectives: [{ type: 'score', target: 3500, current: 0 }], symbols: ALL_SYMBOLS.slice(0, 7), frozenTiles: [{ row: 1, col: 1 }, { row: 1, col: 5 }, { row: 5, col: 1 }, { row: 5, col: 5 }], starThresholds: [2200, 3500, 4600] },
  { id: 16, chapter: 2, name: 'Drum Summit', rows: 7, cols: 7, maxMoves: 22, targetScore: 3800, objectives: [{ type: 'score', target: 3800, current: 0 }, { type: 'collect', symbol: 'drum', target: 10, current: 0 }], symbols: ALL_SYMBOLS.slice(0, 8), starThresholds: [2400, 3800, 5000] },
  { id: 17, chapter: 2, name: 'Pottery Bazaar', rows: 7, cols: 7, maxMoves: 25, targetScore: 4000, objectives: [{ type: 'score', target: 4000, current: 0 }], symbols: ALL_SYMBOLS.slice(0, 8), frozenTiles: [{ row: 2, col: 3 }, { row: 3, col: 2 }, { row: 3, col: 4 }, { row: 4, col: 3 }], starThresholds: [2500, 4000, 5200] },
  { id: 18, chapter: 2, name: 'Masked Ball', rows: 7, cols: 7, maxMoves: 20, targetScore: 4500, objectives: [{ type: 'score', target: 4500, current: 0 }, { type: 'collect', symbol: 'mask', target: 8, current: 0 }], symbols: ALL_SYMBOLS.slice(0, 8), starThresholds: [2800, 4500, 5800] },
  { id: 19, chapter: 2, name: 'Ancient Baobab', rows: 7, cols: 7, maxMoves: 22, targetScore: 5000, objectives: [{ type: 'score', target: 5000, current: 0 }], symbols: ALL_SYMBOLS.slice(0, 9), frozenTiles: [{ row: 0, col: 3 }, { row: 3, col: 0 }, { row: 3, col: 6 }, { row: 6, col: 3 }], starThresholds: [3000, 5000, 6500] },
  { id: 20, chapter: 2, name: 'East Horizon', rows: 7, cols: 7, maxMoves: 18, targetScore: 5500, objectives: [{ type: 'score', target: 5500, current: 0 }], symbols: ALL_SYMBOLS.slice(0, 9), starThresholds: [3500, 5500, 7200] },

  // Chapter 3: Southern Legacies (Levels 21-30, 8x8)
  { id: 21, chapter: 3, name: 'Southern Gate', rows: 8, cols: 8, maxMoves: 30, targetScore: 4000, objectives: [{ type: 'score', target: 4000, current: 0 }], symbols: ALL_SYMBOLS.slice(0, 7), starThresholds: [2500, 4000, 5500] },
  { id: 22, chapter: 3, name: 'Relic Temple', rows: 8, cols: 8, maxMoves: 28, targetScore: 5000, objectives: [{ type: 'score', target: 5000, current: 0 }, { type: 'collect', symbol: 'relic', target: 8, current: 0 }], symbols: ALL_SYMBOLS.slice(0, 7), starThresholds: [3000, 5000, 6800] },
  { id: 23, chapter: 3, name: 'Crown of Kings', rows: 8, cols: 8, maxMoves: 25, targetScore: 5500, objectives: [{ type: 'score', target: 5500, current: 0 }, { type: 'collect', symbol: 'crown', target: 6, current: 0 }], symbols: ALL_SYMBOLS.slice(0, 8), starThresholds: [3500, 5500, 7500] },
  { id: 24, chapter: 3, name: 'Frozen Legacy', rows: 8, cols: 8, maxMoves: 26, targetScore: 6000, objectives: [{ type: 'score', target: 6000, current: 0 }], symbols: ALL_SYMBOLS.slice(0, 8), frozenTiles: [{ row: 2, col: 2 }, { row: 2, col: 3 }, { row: 3, col: 2 }, { row: 3, col: 3 }, { row: 5, col: 5 }, { row: 5, col: 6 }, { row: 6, col: 5 }, { row: 6, col: 6 }], starThresholds: [3800, 6000, 8000] },
  { id: 25, chapter: 3, name: 'Kente Masters', rows: 8, cols: 8, maxMoves: 24, targetScore: 6500, objectives: [{ type: 'score', target: 6500, current: 0 }, { type: 'collect', symbol: 'kente', target: 10, current: 0 }], symbols: ALL_SYMBOLS.slice(0, 8), starThresholds: [4000, 6500, 8500] },
  { id: 26, chapter: 3, name: 'Drum of Ages', rows: 8, cols: 8, maxMoves: 22, targetScore: 7000, objectives: [{ type: 'score', target: 7000, current: 0 }], symbols: ALL_SYMBOLS.slice(0, 9), frozenTiles: [{ row: 1, col: 1 }, { row: 1, col: 6 }, { row: 6, col: 1 }, { row: 6, col: 6 }], starThresholds: [4500, 7000, 9200] },
  { id: 27, chapter: 3, name: 'Gazelle Plains', rows: 8, cols: 8, maxMoves: 22, targetScore: 7500, objectives: [{ type: 'score', target: 7500, current: 0 }, { type: 'collect', symbol: 'gazelle', target: 8, current: 0 }], symbols: ALL_SYMBOLS.slice(0, 9), starThresholds: [4800, 7500, 9800] },
  { id: 28, chapter: 3, name: 'Baobab Wisdom', rows: 8, cols: 8, maxMoves: 20, targetScore: 8000, objectives: [{ type: 'score', target: 8000, current: 0 }, { type: 'collect', symbol: 'baobab', target: 10, current: 0 }], symbols: ALL_SYMBOLS.slice(0, 9), starThresholds: [5000, 8000, 10500] },
  { id: 29, chapter: 3, name: 'Ancestral Trial', rows: 8, cols: 8, maxMoves: 18, targetScore: 9000, objectives: [{ type: 'score', target: 9000, current: 0 }], symbols: ALL_SYMBOLS.slice(0, 10), frozenTiles: [{ row: 0, col: 0 }, { row: 0, col: 7 }, { row: 7, col: 0 }, { row: 7, col: 7 }, { row: 3, col: 3 }, { row: 3, col: 4 }, { row: 4, col: 3 }, { row: 4, col: 4 }], starThresholds: [5500, 9000, 12000] },
  { id: 30, chapter: 3, name: 'Roots & Relics', rows: 8, cols: 8, maxMoves: 16, targetScore: 10000, objectives: [{ type: 'score', target: 10000, current: 0 }], symbols: ALL_SYMBOLS.slice(0, 10), starThresholds: [6000, 10000, 14000] },
]

export const HERITAGE_CARDS: HeritageCard[] = [
  { id: 1, title: 'The Talking Drum', fact: 'The dundun, or talking drum, from West Africa mimics the tone and rhythm of human speech. It was used for communication across villages.', region: 'West Africa', icon: '🥁', unlockedAtLevel: 1 },
  { id: 2, title: 'Terracotta Legacy', fact: 'Ancient Nok terracotta sculptures from Nigeria (1500 BCE) are among the oldest known figurative art in sub-Saharan Africa.', region: 'Nigeria', icon: '🏺', unlockedAtLevel: 3 },
  { id: 3, title: 'Kente Weaving', fact: 'Kente cloth from Ghana is woven by hand on horizontal looms. Each pattern tells a story — only royalty originally wore certain designs.', region: 'Ghana', icon: '🔶', unlockedAtLevel: 5 },
  { id: 4, title: 'Ancestral Masks', fact: 'Masks in African traditions are not mere decoration — they are vessels for ancestral spirits during ceremonies and rites of passage.', region: 'Various', icon: '🎭', unlockedAtLevel: 8 },
  { id: 5, title: 'The Baobab Tree', fact: 'The baobab, or "Tree of Life", can live over 2,000 years. Its fruit is a superfood, and its trunk stores thousands of liters of water.', region: 'Madagascar & Africa', icon: '🌳', unlockedAtLevel: 10 },
  { id: 6, title: 'Great Zimbabwe', fact: 'Great Zimbabwe was a medieval city built from massive stone blocks without mortar. It was a center of trade and power from the 11th-15th centuries.', region: 'Zimbabwe', icon: '🏛️', unlockedAtLevel: 12 },
  { id: 7, title: 'Ethiopian Crowns', fact: 'Ethiopian royal crowns are handcrafted from gold and silver, often featuring icons of saints and intricate filigree work.', region: 'Ethiopia', icon: '👑', unlockedAtLevel: 15 },
  { id: 8, title: 'Savanna Wildlife', fact: 'The African savanna is home to the "Big Five" — lion, leopard, elephant, rhino, and buffalo — along with countless antelope species like the gazelle.', region: 'East Africa', icon: '🦌', unlockedAtLevel: 18 },
  { id: 9, title: 'Dogon Architecture', fact: 'The Dogon people of Mali build their granaries with conical thatched roofs and mud-brick walls, perfectly designed for the arid climate.', region: 'Mali', icon: '🏛️', unlockedAtLevel: 20 },
  { id: 10, title: 'Benin Bronzes', fact: 'The Benin Bronzes are a collection of intricate metal plaques and sculptures that adorned the royal palace of the Kingdom of Benin (modern Nigeria).', region: 'Nigeria', icon: '💎', unlockedAtLevel: 22 },
  { id: 11, title: 'Marrakech Markets', fact: 'The souks of Marrakech have been centers of trade for over a millennium, with artisans crafting leather, metalwork, and textiles.', region: 'Morocco', icon: '🔶', unlockedAtLevel: 25 },
  { id: 12, title: 'Swahili Coast', fact: 'The Swahili coast was a network of trade cities connecting Africa, Arabia, and Asia from the 8th century, blending Bantu, Arab, and Persian cultures.', region: 'East Africa', icon: '🌿', unlockedAtLevel: 27 },
  { id: 13, title: 'Nubian Pyramids', fact: 'The Kingdom of Kush built more pyramids than Egypt — over 200 small, steep pyramids at sites like Meroë in present-day Sudan.', region: 'Sudan', icon: '🏛️', unlockedAtLevel: 28 },
  { id: 14, title: 'Griot Tradition', fact: 'Griots are West African oral historians, storytellers, and musicians who preserve genealogies and histories spanning centuries.', region: 'West Africa', icon: '🥁', unlockedAtLevel: 29 },
  { id: 15, title: 'Ubuntu Philosophy', fact: 'Ubuntu — "I am because we are" — is a Southern African philosophy emphasizing community, interconnectedness, and shared humanity.', region: 'Southern Africa', icon: '💎', unlockedAtLevel: 30 },
]

export const STORAGE_KEY = 'roots_relics_progress'

export const SYMBOL_BG_COLORS: Record<SymbolType, string> = {
  drum: '#D4782B', pottery: '#C75B39', kente: '#7B3FAF', mask: '#C0392B',
  leaf: '#2E7D32', baobab: '#D4A017', gazelle: '#D4956A', granary: '#8D6E63',
  crown: '#F1C40F', relic: '#1ABC9C',
}

export const SCORE_VALUES: Record<number, number> = {
  3: 50, 4: 150, 5: 300, 6: 500,
}

export function getDefaultProgress() {
  return {
    unlockedLevels: [1],
    starRatings: {} as Record<number, number>,
    highScores: {} as Record<number, number>,
    collectedCards: [] as number[],
    totalStars: 0,
  }
}