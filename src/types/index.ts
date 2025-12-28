// ===== НАПРАВЛЕНИЯ =====
export type Direction = 'up' | 'right' | 'down' | 'left';

export const DIRECTIONS: Direction[] = ['up', 'right', 'down', 'left'];

export const DIRECTION_VECTORS: Record<Direction, { dx: number; dy: number }> = {
  up: { dx: 0, dy: -1 },
  right: { dx: 1, dy: 0 },
  down: { dx: 0, dy: 1 },
  left: { dx: -1, dy: 0 },
};

export const OPPOSITE_DIRECTION: Record<Direction, Direction> = {
  up: 'down',
  down: 'up',
  left: 'right',
  right: 'left',
};

// ===== СТЕНЫ =====
export type WallType = 'space' | 'wall' | 'outer_wall' | 'exit';

// ===== ЗДАНИЯ =====
export type BuildingType =
  | 'arsenal'
  | 'hospital'
  | 'portal'
  | 'mines'
  | 'lift'
  | 'graveyard';

export interface Building {
  type: BuildingType;
  portalIndex?: number; // для порталов — индекс в цепочке
}

// ===== ПРЕДМЕТЫ =====
export type ItemType =
  | 'gold'
  | 'dragon_ring'
  | 'bag'
  | 'armor'
  | 'double_gun'
  | 'mine_detector'
  | 'cement';

export interface Item {
  type: ItemType;
}

// ===== МОНСТРЫ =====
export type MonsterType = 'dragon' | 'archer';

export interface Monster {
  id: string;
  type: MonsterType;
  health: number;
  maxHealth: number;
  position: Position;
  direction?: Direction; // для лучника — фиксированное направление стрельбы
}

// ===== ПОЗИЦИЯ =====
export interface Position {
  x: number;
  y: number;
  z: number; // этаж
}

// ===== ЯЧЕЙКА ЛАБИРИНТА =====
export interface Cell {
  position: Position;
  walls: Record<Direction, WallType>;
  building?: Building;
  items: Item[];
  monsters: Monster[];
}

// ===== ИГРОК =====
export interface Player {
  position: Position;
  health: number;
  maxHealth: number;
  arrows: number;
  maxArrows: number;
  bombs: number;
  maxBombs: number;
  inventory: Item[];
  maxInventorySlots: number;
  hasGold: boolean;
  dragonRings: number;
  bags: number;
}

// ===== РЕЖИМ ДЕЙСТВИЯ =====
export type ActionMode = 'go' | 'shoot' | 'bomb' | 'build';

// ===== ЛОГ СОБЫТИЙ =====
export type LogMessageType =
  | 'narrative'
  | 'heat'
  | 'draft'
  | 'gaze'
  | 'success'
  | 'damage'
  | 'death'
  | 'victory'
  | 'info'
  | 'error';

export interface LogMessage {
  id: string;
  type: LogMessageType;
  text: string;
  timestamp: number;
}

// ===== ЭКРАНЫ =====
export type ScreenType =
  | 'game'
  | 'arsenal'
  | 'lift'
  | 'victory'
  | 'menu'
  | 'death';

// ===== ЛАБИРИНТ =====
export interface Labyrinth {
  width: number;
  height: number;
  floors: number;
  cells: Cell[][][]; // [z][y][x]
  exitPosition: Position;
  portalPositions: Position[];
}

// ===== НАСТРОЙКИ ИГРЫ =====
export interface GameConfig {
  seed?: number;
  width?: number;
  height?: number;
  floors?: number;
  playerHealth?: number;
  playerArrows?: number;
  playerBombs?: number;
  arsenalSlots?: number;
  dragonCount?: number;
  dragonHealth?: number;
  dragonDamage?: number;
  archerCount?: number;
  archerHealth?: number;
  archerDamage?: number;
  portalCount?: number;
  mineCount?: number;
  mineDamage?: number;
  hospitalCount?: number;
  arsenalCount?: number;
  deathLimit?: number;
  respawnHealthPercent?: number;
  arrowDamage?: number;
  doublegunMultiplier?: number;
  dragonRingHealthBonus?: number;
  bagSlotBonus?: number;
  spawnLocation?: 'graveyard' | 'random';
}

// ===== СОСТОЯНИЕ ИГРЫ =====
export interface GameState {
  labyrinth: Labyrinth;
  player: Player;
  monsters: Monster[];
  turn: number;
  deaths: number;
  kills: number;
  ended: boolean;
  won: boolean;
  currentScreen: ScreenType;
  actionMode: ActionMode;
  logs: LogMessage[];
  arsenalItems: ItemType[];
  config: Required<GameConfig>;
}

// ===== УТИЛИТЫ =====
export function positionEquals(a: Position, b: Position): boolean {
  return a.x === b.x && a.y === b.y && a.z === b.z;
}

export function positionToKey(pos: Position): string {
  return `${pos.x},${pos.y},${pos.z}`;
}
