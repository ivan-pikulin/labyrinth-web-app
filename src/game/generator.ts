import {
  Labyrinth,
  Cell,
  Position,
  Direction,
  DIRECTIONS,
  DIRECTION_VECTORS,
  OPPOSITE_DIRECTION,
  WallType,
  Monster,
  GameConfig,
  ResolvedGameConfig,
  Range,
  positionToKey,
} from '@/types';
import { createRandom, Random } from '@/utils/random';

// Helper to check if value is a Range
function isRange(value: unknown): value is Range {
  return typeof value === 'object' && value !== null && 'min' in value && 'max' in value;
}

// Resolve range or number value using random
function resolveRangeValue(value: number | Range | undefined, random: Random, defaultMin: number, defaultMax: number): number {
  if (value === undefined) {
    return random.int(defaultMin, defaultMax);
  }
  if (isRange(value)) {
    return random.int(value.min, value.max);
  }
  return value;
}

// Calculate auto values based on labyrinth size
function calculateAutoValues(width: number, height: number, floors: number) {
  const totalCells = width * height * floors;

  return {
    dragonCount: Math.max(1, Math.floor(totalCells / 15)),
    archerCount: Math.max(0, Math.floor(totalCells / 25)),
    portalCount: Math.max(2, Math.floor(totalCells / 8)),
    mineCount: Math.max(1, Math.floor(totalCells / 20)),
  };
}

function generateId(): string {
  return Math.random().toString(36).substring(2, 9);
}

function createEmptyCell(x: number, y: number, z: number, width: number, height: number): Cell {
  const walls: Record<Direction, WallType> = {
    up: y === 0 ? 'outer_wall' : 'wall',
    down: y === height - 1 ? 'outer_wall' : 'wall',
    left: x === 0 ? 'outer_wall' : 'wall',
    right: x === width - 1 ? 'outer_wall' : 'wall',
  };

  return {
    position: { x, y, z },
    walls,
    items: [],
    monsters: [],
  };
}

// Recursive backtracking maze generator
function generateMaze(
  cells: Cell[][][],
  width: number,
  height: number,
  floors: number,
  random: Random
) {
  for (let z = 0; z < floors; z++) {
    const visited = new Set<string>();

    function carve(x: number, y: number) {
      visited.add(`${x},${y}`);
      const directions = random.shuffle(DIRECTIONS);

      for (const dir of directions) {
        const { dx, dy } = DIRECTION_VECTORS[dir];
        const nx = x + dx;
        const ny = y + dy;

        if (nx < 0 || nx >= width || ny < 0 || ny >= height) continue;
        if (visited.has(`${nx},${ny}`)) continue;

        // Remove wall between current and next cell
        cells[z][y][x].walls[dir] = 'space';
        cells[z][ny][nx].walls[OPPOSITE_DIRECTION[dir]] = 'space';

        carve(nx, ny);
      }
    }

    // Start from random position
    const startX = random.int(0, width - 1);
    const startY = random.int(0, height - 1);
    carve(startX, startY);

    // Add some extra passages for more interesting layout
    const extraPassages = random.int(1, Math.floor((width * height) / 4));
    for (let i = 0; i < extraPassages; i++) {
      const x = random.int(0, width - 1);
      const y = random.int(0, height - 1);
      const dir = random.pick(DIRECTIONS);
      const { dx, dy } = DIRECTION_VECTORS[dir];
      const nx = x + dx;
      const ny = y + dy;

      if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
        if (cells[z][y][x].walls[dir] === 'wall') {
          cells[z][y][x].walls[dir] = 'space';
          cells[z][ny][nx].walls[OPPOSITE_DIRECTION[dir]] = 'space';
        }
      }
    }
  }
}

function getRandomEmptyPosition(
  cells: Cell[][][],
  random: Random,
  width: number,
  height: number,
  floors: number,
  occupied: Set<string>
): Position {
  let attempts = 0;
  while (attempts < 1000) {
    const x = random.int(0, width - 1);
    const y = random.int(0, height - 1);
    const z = random.int(0, floors - 1);
    const key = positionToKey({ x, y, z });

    if (!occupied.has(key) && !cells[z][y][x].building) {
      return { x, y, z };
    }
    attempts++;
  }
  // Fallback
  for (let z = 0; z < floors; z++) {
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const key = positionToKey({ x, y, z });
        if (!occupied.has(key) && !cells[z][y][x].building) {
          return { x, y, z };
        }
      }
    }
  }
  return { x: 0, y: 0, z: 0 };
}

export interface GeneratorResult {
  labyrinth: Labyrinth;
  monsters: Monster[];
  graveyardPosition: Position;
  goldPosition: Position;
  config: ResolvedGameConfig;
}

export function generateLabyrinth(userConfig: GameConfig = {}): GeneratorResult {
  const random = createRandom(Date.now());

  // Determine dimensions (handle Range types)
  const width = resolveRangeValue(userConfig.width, random, 3, 6);
  const height = resolveRangeValue(userConfig.height, random, 3, 6);
  const floors = resolveRangeValue(userConfig.floors, random, 1, 2);

  // Calculate auto values based on labyrinth size
  const autoValues = calculateAutoValues(width, height, floors);

  // Build resolved config
  const config: ResolvedGameConfig = {
    width,
    height,
    floors,
    playerHealth: userConfig.playerHealth ?? 5,
    playerArrows: userConfig.playerArrows ?? 5,
    playerBombs: userConfig.playerBombs ?? 2,
    arsenalSlots: userConfig.arsenalSlots ?? 1,
    dragonCount: userConfig.dragonCount ?? autoValues.dragonCount,
    dragonHealth: userConfig.dragonHealth ?? 5,
    dragonDamage: userConfig.dragonDamage ?? 1,
    archerCount: userConfig.archerCount ?? autoValues.archerCount,
    archerHealth: userConfig.archerHealth ?? 5,
    archerDamage: userConfig.archerDamage ?? 1,
    portalCount: userConfig.portalCount ?? autoValues.portalCount,
    mineCount: userConfig.mineCount ?? autoValues.mineCount,
    mineDamage: userConfig.mineDamage ?? 1,
    hospitalCount: userConfig.hospitalCount ?? 1,
    arsenalCount: userConfig.arsenalCount ?? 1,
    deathLimit: userConfig.deathLimit ?? 0,
    respawnHealthPercent: userConfig.respawnHealthPercent ?? 80,
    arrowDamage: userConfig.arrowDamage ?? 1,
    doublegunMultiplier: userConfig.doublegunMultiplier ?? 2,
    dragonRingHealthBonus: userConfig.dragonRingHealthBonus ?? 1,
    bagSlotBonus: userConfig.bagSlotBonus ?? 1,
    spawnLocation: userConfig.spawnLocation ?? 'graveyard',
  };

  // Create empty cells
  const cells: Cell[][][] = [];
  for (let z = 0; z < floors; z++) {
    cells[z] = [];
    for (let y = 0; y < height; y++) {
      cells[z][y] = [];
      for (let x = 0; x < width; x++) {
        cells[z][y][x] = createEmptyCell(x, y, z, width, height);
      }
    }
  }

  // Generate maze
  generateMaze(cells, width, height, floors, random);

  const occupied = new Set<string>();

  // Place buildings
  // 1. Graveyard
  const graveyardPos = getRandomEmptyPosition(cells, random, width, height, floors, occupied);
  cells[graveyardPos.z][graveyardPos.y][graveyardPos.x].building = { type: 'graveyard' };
  occupied.add(positionToKey(graveyardPos));

  // 2. Exit (on outer wall)
  let exitPosition: Position = { x: 0, y: 0, z: 0 };
  {
    const z = random.int(0, floors - 1);
    const side = random.int(0, 3); // 0=up, 1=right, 2=down, 3=left
    let x: number, y: number;
    let direction: Direction;

    switch (side) {
      case 0: // top
        x = random.int(0, width - 1);
        y = 0;
        direction = 'up';
        break;
      case 1: // right
        x = width - 1;
        y = random.int(0, height - 1);
        direction = 'right';
        break;
      case 2: // bottom
        x = random.int(0, width - 1);
        y = height - 1;
        direction = 'down';
        break;
      default: // left
        x = 0;
        y = random.int(0, height - 1);
        direction = 'left';
        break;
    }

    cells[z][y][x].walls[direction] = 'exit';
    exitPosition = { x, y, z };
  }

  // 3. Arsenal
  for (let i = 0; i < config.arsenalCount; i++) {
    const pos = getRandomEmptyPosition(cells, random, width, height, floors, occupied);
    cells[pos.z][pos.y][pos.x].building = { type: 'arsenal' };
    occupied.add(positionToKey(pos));
  }

  // 4. Hospital
  for (let i = 0; i < config.hospitalCount; i++) {
    const pos = getRandomEmptyPosition(cells, random, width, height, floors, occupied);
    cells[pos.z][pos.y][pos.x].building = { type: 'hospital' };
    occupied.add(positionToKey(pos));
  }

  // 5. Mines
  for (let i = 0; i < config.mineCount; i++) {
    const pos = getRandomEmptyPosition(cells, random, width, height, floors, occupied);
    cells[pos.z][pos.y][pos.x].building = { type: 'mines' };
    occupied.add(positionToKey(pos));
  }

  // 6. Portals
  const portalPositions: Position[] = [];
  for (let i = 0; i < config.portalCount; i++) {
    const pos = getRandomEmptyPosition(cells, random, width, height, floors, occupied);
    cells[pos.z][pos.y][pos.x].building = { type: 'portal', portalIndex: i };
    portalPositions.push(pos);
    occupied.add(positionToKey(pos));
  }

  // 7. Lift (only if multiple floors)
  if (floors > 1) {
    const liftX = random.int(0, width - 1);
    const liftY = random.int(0, height - 1);

    for (let z = 0; z < floors; z++) {
      // Only place lift if no building there
      if (!cells[z][liftY][liftX].building) {
        cells[z][liftY][liftX].building = { type: 'lift' };
        occupied.add(positionToKey({ x: liftX, y: liftY, z }));
      }
    }
  }

  // Place Gold
  const goldPos = getRandomEmptyPosition(cells, random, width, height, floors, occupied);
  cells[goldPos.z][goldPos.y][goldPos.x].items.push({ type: 'gold' });

  // Create monsters
  const monsters: Monster[] = [];

  // Dragons
  for (let i = 0; i < config.dragonCount; i++) {
    const pos = getRandomEmptyPosition(cells, random, width, height, floors, occupied);
    const monster: Monster = {
      id: generateId(),
      type: 'dragon',
      health: config.dragonHealth,
      maxHealth: config.dragonHealth,
      position: pos,
    };
    monsters.push(monster);
    cells[pos.z][pos.y][pos.x].monsters.push(monster);
  }

  // Archers
  for (let i = 0; i < config.archerCount; i++) {
    const pos = getRandomEmptyPosition(cells, random, width, height, floors, occupied);
    const monster: Monster = {
      id: generateId(),
      type: 'archer',
      health: config.archerHealth,
      maxHealth: config.archerHealth,
      position: pos,
      direction: random.pick(DIRECTIONS),
    };
    monsters.push(monster);
    cells[pos.z][pos.y][pos.x].monsters.push(monster);
  }

  const labyrinth: Labyrinth = {
    width,
    height,
    floors,
    cells,
    exitPosition,
    portalPositions,
  };

  return {
    labyrinth,
    monsters,
    graveyardPosition: graveyardPos,
    goldPosition: goldPos,
    config,
  };
}
