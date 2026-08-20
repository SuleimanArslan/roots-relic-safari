import type { Tile, SymbolType, SpecialType, Position, MatchResult, SwapResult, LevelConfig } from '../types'

let tileCounter = 0

function newTileId(): string {
  return `t${++tileCounter}`
}

export function resetTileCounter() {
  tileCounter = 0
}

function randInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function shuffleArray<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function isAdjacent(a: Position, b: Position): boolean {
  return (Math.abs(a.row - b.row) + Math.abs(a.col - b.col)) === 1
}

export function createBoard(level: LevelConfig): (Tile | null)[][] {
  const { rows, cols, symbols } = level
  const board: (Tile | null)[][] = []

  for (let r = 0; r < rows; r++) {
    board[r] = []
    for (let c = 0; c < cols; c++) {
      const isFrozen = level.frozenTiles?.some(t => t.row === r && t.col === c) ?? false
      const type = symbols[randInt(0, symbols.length - 1)]
      board[r][c] = {
        id: newTileId(),
        type,
        special: 'none',
        frozen: isFrozen,
        row: r,
        col: c,
      }
    }
  }

  // Remove initial matches
  let hasMatches = true
  let attempts = 0
  while (hasMatches && attempts < 100) {
    attempts++
    const matches = findAllMatches(board, rows, cols)
    if (matches.length === 0) {
      hasMatches = false
    } else {
      for (const match of matches) {
        for (const pos of match.positions) {
          if (board[pos.row][pos.col] && !board[pos.row][pos.col]!.frozen) {
            board[pos.row][pos.col]!.type = symbols[randInt(0, symbols.length - 1)]
          }
        }
      }
    }
  }

  return board
}

export function findAllMatches(board: (Tile | null)[][], rows: number, cols: number): MatchResult[] {
  const matches: MatchResult[] = []
  const visited = new Set<string>()

  // Horizontal matches
  for (let r = 0; r < rows; r++) {
    let c = 0
    while (c < cols) {
      const tile = board[r][c]
      if (!tile || tile.frozen) { c++; continue }
      let end = c + 1
      while (end < cols && board[r][end] && board[r][end]!.type === tile.type && !board[r][end]!.frozen) {
        end++
      }
      const length = end - c
      if (length >= 3) {
        const positions: Position[] = []
        for (let i = c; i < end; i++) {
          positions.push({ row: r, col: i })
          visited.add(`${r},${i}`)
        }
        const specialType = getSpecialType(length)
        matches.push({ positions, length, specialCreated: specialType })
      }
      c = end
    }
  }

  // Vertical matches
  for (let c = 0; c < cols; c++) {
    let r = 0
    while (r < rows) {
      const tile = board[r][c]
      if (!tile || tile.frozen) { r++; continue }
      let end = r + 1
      while (end < rows && board[end][c] && board[end][c]!.type === tile.type && !board[end][c]!.frozen) {
        end++
      }
      const length = end - r
      if (length >= 3) {
        const positions: Position[] = []
        for (let i = r; i < end; i++) {
          positions.push({ row: i, col: c })
          visited.add(`${i},${c}`)
        }
        const specialType = getSpecialType(length)
        matches.push({ positions, length, specialCreated: specialType })
      }
      r = end
    }
  }

  return matches
}

function getSpecialType(length: number): SpecialType | undefined {
  if (length === 4) return ['row', 'col'][randInt(0, 1)] as SpecialType
  if (length >= 5) return 'bomb'
  return undefined
}

export function trySwap(
  board: (Tile | null)[][],
  from: Position,
  to: Position,
  rows: number,
  cols: number
): SwapResult | null {
  if (!isAdjacent(from, to)) return null

  const tileA = board[from.row][from.col]
  const tileB = board[to.row][to.col]
  if (!tileA || !tileB) return null
  if (tileA.frozen || tileB.frozen) return null

  // Swap
  board[from.row][from.col] = tileB
  board[to.row][to.col] = tileA
  tileB.row = from.row; tileB.col = from.col
  tileA.row = to.row; tileA.col = to.col

  // Check for matches
  const matches = findAllMatches(board, rows, cols)
  if (matches.length === 0) {
    // Swap back
    board[from.row][from.col] = tileA
    board[to.row][to.col] = tileB
    tileA.row = from.row; tileA.col = from.col
    tileB.row = to.row; tileB.col = to.col
    return { valid: false, matches: [], cascadeCount: 0, scoreGained: 0, board, specialsActivated: false, newSpecials: [] }
  }

  return processMatches(board, matches, rows, cols)
}

function processMatches(
  board: (Tile | null)[][],
  initialMatches: MatchResult[],
  rows: number,
  cols: number
): SwapResult {
  let totalScore = 0
  let cascadeCount = 0
  let allMatches = [...initialMatches]
  const newSpecials: { position: Position; type: SpecialType }[] = []

  while (allMatches.length > 0) {
    cascadeCount++

    // Apply specials from previous cascade
    // Activate special tiles that were hit by matches
    for (const match of allMatches) {
      for (const pos of match.positions) {
        const tile = board[pos.row][pos.col]
        if (tile && tile.special !== 'none') {
          const activated = activateSpecial(board, tile, rows, cols)
          if (activated) {
            for (const p of activated) {
              // Don't add already included positions
              if (!allMatches.some(m => m.positions.some(mp => mp.row === p.row && mp.col === p.col))) {
                allMatches.push({ positions: [p], length: 1 })
              }
            }
          }
        }
      }
    }

    // Calculate score for this cascade
    let cascadeScore = 0
    const positionsToRemove = new Set<string>()

    for (const match of allMatches) {
      const baseScore = match.length === 3 ? 50 : match.length === 4 ? 150 : match.length >= 5 ? 300 : 50
      cascadeScore += baseScore + (cascadeCount - 1) * 20

      for (const pos of match.positions) {
        positionsToRemove.add(`${pos.row},${pos.col}`)
      }

      if (match.specialCreated && match.positions.length > 0) {
        const center = match.positions[Math.floor(match.positions.length / 2)]
        newSpecials.push({ position: center, type: match.specialCreated })
      }
    }

    cascadeScore = Math.floor(cascadeScore * (1 + (cascadeCount - 1) * 0.25))
    totalScore += cascadeScore

    // Remove matched tiles
    for (const key of positionsToRemove) {
      const [r, c] = key.split(',').map(Number)
      board[r][c] = null
    }

    // Place new special tiles
    for (const spec of newSpecials) {
      if (board[spec.position.row][spec.position.col] === null) {
        // Need a type for the special tile - pick from neighbors
        const neighbors = getNeighborTypes(board, spec.position, rows, cols)
        const type = neighbors.length > 0 ? neighbors[randInt(0, neighbors.length - 1)] : 'drum' as SymbolType
        board[spec.position.row][spec.position.col] = {
          id: newTileId(),
          type,
          special: spec.type,
          frozen: false,
          row: spec.position.row,
          col: spec.position.col,
        }
      }
    }

    // Apply gravity
    applyGravity(board, rows, cols)

    // Refill empty spaces
    refillBoard(board, rows, cols)

    // Check for new matches
    allMatches = findAllMatches(board, rows, cols)
  }

  return {
    valid: true,
    matches: initialMatches,
    cascadeCount: cascadeCount - 1,
    scoreGained: totalScore,
    board,
    specialsActivated: newSpecials.length > 0,
    newSpecials,
  }
}

function getNeighborTypes(board: (Tile | null)[][], pos: Position, rows: number, cols: number): SymbolType[] {
  const types = new Set<SymbolType>()
  const dirs = [[-1,0],[1,0],[0,-1],[0,1]]
  for (const [dr, dc] of dirs) {
    const nr = pos.row + dr, nc = pos.col + dc
    if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && board[nr][nc]) {
      types.add(board[nr][nc]!.type)
    }
  }
  return Array.from(types)
}

function activateSpecial(board: (Tile | null)[][], tile: Tile, rows: number, cols: number): Position[] | null {
  const positions: Position[] = []
  const specialType = tile.special
  tile.special = 'none' // Consume the special

  switch (specialType) {
    case 'row':
      for (let c = 0; c < cols; c++) {
        if (board[tile.row][c]) positions.push({ row: tile.row, col: c })
      }
      break
    case 'col':
      for (let r = 0; r < rows; r++) {
        if (board[r][tile.col]) positions.push({ row: r, col: tile.col })
      }
      break
    case 'bomb': {
      const dirs = [[-1,-1],[-1,0],[-1,1],[0,-1],[0,1],[1,-1],[1,0],[1,1]]
      for (const [dr, dc] of dirs) {
        const nr = tile.row + dr, nc = tile.col + dc
        if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && board[nr][nc]) {
          positions.push({ row: nr, col: nc })
        }
      }
      break
    }
    case 'rainbow':
      // Remove all tiles of the same type
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          if (board[r][c] && board[r][c]!.type === tile.type) {
            positions.push({ row: r, col: c })
          }
        }
      }
      break
    default:
      return null
  }
  return positions.length > 0 ? positions : null
}

function applyGravity(board: (Tile | null)[][], rows: number, cols: number) {
  for (let c = 0; c < cols; c++) {
    let writeRow = rows - 1
    for (let r = rows - 1; r >= 0; r--) {
      if (board[r][c] !== null) {
        if (r !== writeRow) {
          board[writeRow][c] = board[r][c]
          board[writeRow][c]!.row = writeRow
          board[r][c] = null
        }
        writeRow--
      }
    }
  }
}

function refillBoard(board: (Tile | null)[][], rows: number, cols: number, symbols?: SymbolType[]) {
  const allSymbols: SymbolType[] = symbols || ['drum','pottery','kente','mask','leaf','baobab','gazelle','granary','crown','relic']
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (board[r][c] === null) {
        board[r][c] = {
          id: newTileId(),
          type: allSymbols[randInt(0, allSymbols.length - 1)],
          special: 'none',
          frozen: false,
          row: r,
          col: c,
        }
      }
    }
  }
}

export function hasValidMoves(board: (Tile | null)[][], rows: number, cols: number): boolean {
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const tile = board[r][c]
      if (!tile || tile.frozen) continue
      const dirs = [[0,1],[1,0]]
      for (const [dr, dc] of dirs) {
        const nr = r + dr, nc = c + dc
        if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && board[nr][nc] && !board[nr][nc]!.frozen) {
          // Try swap
          const temp = board[r][c]
          board[r][c] = board[nr][nc]
          board[nr][nc] = temp
          const matches = findAllMatches(board, rows, cols)
          // Swap back
          board[nr][nc] = board[r][c]
          board[r][c] = temp
          if (matches.length > 0) return true
        }
      }
    }
  }
  return false
}

export function shuffleBoard(board: (Tile | null)[][], rows: number, cols: number, symbols: SymbolType[]) {
  const tiles: Tile[] = []
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (board[r][c] && !board[r][c]!.frozen) {
        tiles.push(board[r][c]!)
      }
    }
  }
  const shuffled = shuffleArray(tiles)
  let idx = 0
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (board[r][c] && !board[r][c]!.frozen) {
        board[r][c] = shuffled[idx]
        board[r][c]!.row = r
        board[r][c]!.col = c
        idx++
      }
    }
  }
  // If still no moves, regenerate
  if (!hasValidMoves(board, rows, cols)) {
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        if (board[r][c] && !board[r][c]!.frozen) {
          board[r][c]!.type = symbols[randInt(0, symbols.length - 1)]
        }
      }
    }
  }
}

export function checkWinCondition(level: LevelConfig, score: number, collected: Record<string, number>): boolean {
  for (const obj of level.objectives) {
    if (obj.type === 'score' && score < obj.target) return false
    if (obj.type === 'collect' && (collected[obj.symbol!] || 0) < obj.target) return false
  }
  return true
}

export function calculateStars(score: number, thresholds: [number, number, number]): number {
  if (score >= thresholds[2]) return 3
  if (score >= thresholds[1]) return 2
  if (score >= thresholds[0]) return 1
  return 0
}

export function getCascadeScoreMultiplier(cascadeLevel: number): number {
  return 1 + (cascadeLevel - 1) * 0.25
}