import {
  GameState,
  GameConfig,
  Direction,
  Position,
  DIRECTION_VECTORS,
  OPPOSITE_DIRECTION,
  Cell,
  LogMessage,
  ItemType,
  positionEquals,
  ActionMode,
} from '@/types';
import { generateLabyrinth } from './generator';

function createLogMessage(type: LogMessage['type'], text: string): LogMessage {
  return {
    id: Math.random().toString(36).substring(2, 9),
    type,
    text,
    timestamp: Date.now(),
  };
}

export function createGame(config: GameConfig = {}): GameState {
  const result = generateLabyrinth(config);

  const startPosition =
    result.config.spawnLocation === 'graveyard'
      ? result.graveyardPosition
      : result.graveyardPosition;

  const player = {
    position: startPosition,
    health: result.config.playerHealth,
    maxHealth: result.config.playerHealth,
    arrows: result.config.playerArrows,
    maxArrows: result.config.playerArrows,
    bombs: result.config.playerBombs,
    maxBombs: result.config.playerBombs,
    inventory: [],
    maxInventorySlots: result.config.arsenalSlots,
    hasGold: false,
    dragonRings: 0,
    bags: 0,
  };

  const arsenalItems: ItemType[] = ['armor', 'double_gun', 'mine_detector', 'cement'];

  const initialLogs: LogMessage[] = [
    createLogMessage('narrative', 'Вы очнулись на старом кладбище.'),
    createLogMessage('narrative', 'Где-то в этом лабиринте спрятано золото...'),
    createLogMessage('info', 'Найдите золото и выход, чтобы победить.'),
  ];

  return {
    labyrinth: result.labyrinth,
    player,
    monsters: result.monsters,
    turn: 0,
    deaths: 0,
    kills: 0,
    ended: false,
    won: false,
    currentScreen: 'game',
    actionMode: 'go',
    logs: initialLogs,
    arsenalItems,
    config: result.config,
  };
}

export function getCell(state: GameState, pos: Position): Cell {
  return state.labyrinth.cells[pos.z][pos.y][pos.x];
}

export function getCurrentCell(state: GameState): Cell {
  return getCell(state, state.player.position);
}

export function canMove(state: GameState, direction: Direction): boolean {
  const cell = getCurrentCell(state);
  const wallType = cell.walls[direction];
  return wallType === 'space' || wallType === 'exit';
}

export function getAvailableDirections(state: GameState): Direction[] {
  const cell = getCurrentCell(state);
  return (['up', 'right', 'down', 'left'] as Direction[]).filter((dir) => {
    const wall = cell.walls[dir];
    return wall === 'space' || wall === 'exit';
  });
}

export function getSensations(state: GameState): LogMessage[] {
  const messages: LogMessage[] = [];
  const { player, labyrinth, monsters } = state;
  const { x, y, z } = player.position;

  // Check adjacent cells for dragons (heat)
  for (const dir of ['up', 'right', 'down', 'left'] as Direction[]) {
    const { dx, dy } = DIRECTION_VECTORS[dir];
    const nx = x + dx;
    const ny = y + dy;

    if (nx < 0 || nx >= labyrinth.width || ny < 0 || ny >= labyrinth.height) continue;

    const adjacentMonsters = monsters.filter(
      (m) => m.position.x === nx && m.position.y === ny && m.position.z === z && m.health > 0
    );

    for (const m of adjacentMonsters) {
      if (m.type === 'dragon') {
        const dirName = getDirectionName(dir);
        messages.push(createLogMessage('heat', `🔥 Чувствуете жар с ${dirName}...`));
      }
      if (m.type === 'archer') {
        const dirName = getDirectionName(dir);
        messages.push(createLogMessage('gaze', `👁️ Чувствуете чей-то взгляд с ${dirName}...`));
      }
    }
  }

  return messages;
}

function getDirectionName(dir: Direction): string {
  const names: Record<Direction, string> = {
    up: 'севера',
    down: 'юга',
    left: 'запада',
    right: 'востока',
  };
  return names[dir];
}

function getDirectionNameTo(dir: Direction): string {
  const names: Record<Direction, string> = {
    up: 'на север',
    down: 'на юг',
    left: 'на запад',
    right: 'на восток',
  };
  return names[dir];
}

// Describe current location
export function describeLocation(state: GameState): LogMessage[] {
  const messages: LogMessage[] = [];
  const cell = getCurrentCell(state);

  messages.push(createLogMessage('narrative', 'Вы в тёмной комнате.'));

  // Building
  if (cell.building) {
    switch (cell.building.type) {
      case 'graveyard':
        messages.push(createLogMessage('narrative', '⚰️ Здесь старое кладбище.'));
        break;
      case 'hospital':
        messages.push(createLogMessage('narrative', '🏥 Вы в госпитале. Здоровье восстановлено!'));
        break;
      case 'arsenal':
        messages.push(createLogMessage('narrative', '🏛️ Вы в арсенале.'));
        break;
      case 'portal':
        messages.push(createLogMessage('narrative', '🌀 Здесь портал!'));
        break;
      case 'mines':
        messages.push(createLogMessage('narrative', '💣 Вы на минном поле!'));
        break;
      case 'lift':
        messages.push(createLogMessage('narrative', '🛗 Здесь лифт.'));
        break;
    }
  }

  // Items
  for (const item of cell.items) {
    if (item.type === 'gold') {
      messages.push(createLogMessage('success', '✨ Здесь блестит ЗОЛОТО!'));
    }
  }

  // Monsters on cell
  for (const monster of cell.monsters) {
    if (monster.health > 0) {
      if (monster.type === 'dragon') {
        messages.push(createLogMessage('heat', `🐉 Здесь дракон! (HP: ${monster.health}/${monster.maxHealth})`));
      } else if (monster.type === 'archer') {
        const archerDir = monster.direction ? getDirectionNameTo(monster.direction) : '';
        messages.push(
          createLogMessage('gaze', `🏹 Здесь лучник! (HP: ${monster.health}/${monster.maxHealth}) Стреляет ${archerDir}`)
        );
      }
    }
  }

  // Sensations from adjacent cells
  messages.push(...getSensations(state));

  return messages;
}

// Handle moving
export function move(state: GameState, direction: Direction): GameState {
  if (state.ended) return state;
  if (!canMove(state, direction)) {
    return addLog(state, 'error', '⚠️ Там стена! Идти нельзя.');
  }

  const { dx, dy } = DIRECTION_VECTORS[direction];
  const newPos: Position = {
    x: state.player.position.x + dx,
    y: state.player.position.y + dy,
    z: state.player.position.z,
  };

  let newState: GameState = {
    ...state,
    player: { ...state.player, position: newPos },
    actionMode: 'go',
  };

  newState = addLog(newState, 'narrative', `> Идёте ${getDirectionNameTo(direction)}...`);

  // Check for exit with gold
  const cell = getCurrentCell(state);
  if (cell.walls[direction] === 'exit') {
    if (state.player.hasGold) {
      newState = addLog(newState, 'victory', '🏆 ПОБЕДА! Вы нашли выход с золотом!');
      return {
        ...newState,
        ended: true,
        won: true,
        currentScreen: 'victory',
      };
    } else {
      newState = addLog(newState, 'info', 'Вы видите выход, но вам нужно золото!');
    }
  }

  // Process cell effects
  newState = processCellEffects(newState);

  // Monster phase
  newState = monsterPhase(newState);

  return { ...newState, turn: newState.turn + 1 };
}

// Process cell effects (buildings, items)
function processCellEffects(state: GameState): GameState {
  let newState = state;
  const cell = getCell(newState, newState.player.position);

  // Building effects
  if (cell.building) {
    switch (cell.building.type) {
      case 'hospital':
        newState = {
          ...newState,
          player: { ...newState.player, health: newState.player.maxHealth },
        };
        newState = addLog(newState, 'success', '🏥 Здоровье полностью восстановлено!');
        break;

      case 'arsenal':
        newState = {
          ...newState,
          player: {
            ...newState.player,
            arrows: newState.player.maxArrows,
            bombs: newState.player.maxBombs,
          },
          currentScreen: 'arsenal',
        };
        newState = addLog(newState, 'success', '🏛️ Стрелы и бомбы пополнены!');
        break;

      case 'portal': {
        const portalIndex = cell.building.portalIndex ?? 0;
        const nextIndex = (portalIndex + 1) % newState.labyrinth.portalPositions.length;
        const nextPortalPos = newState.labyrinth.portalPositions[nextIndex];

        if (nextPortalPos) {
          newState = {
            ...newState,
            player: { ...newState.player, position: nextPortalPos },
          };
          newState = addLog(newState, 'info', '🌀 Портал переносит вас!');
          // Process new cell (but not portal again to avoid infinite loop)
          const nextCell = getCell(newState, nextPortalPos);
          if (nextCell.building?.type === 'mines') {
            newState = processMinesDamage(newState);
          }
        }
        break;
      }

      case 'mines':
        newState = processMinesDamage(newState);
        break;

      case 'lift':
        if (newState.labyrinth.floors > 1) {
          newState = { ...newState, currentScreen: 'lift' };
        }
        break;
    }
  }

  // Pickup items
  for (const item of cell.items) {
    if (item.type === 'gold' && !newState.player.hasGold) {
      newState = { ...newState, player: { ...newState.player, hasGold: true } };
      newState = addLog(newState, 'success', '✨ Вы подобрали ЗОЛОТО!');
    }
    if (item.type === 'dragon_ring') {
      newState = {
        ...newState,
        player: {
          ...newState.player,
          dragonRings: newState.player.dragonRings + 1,
          maxHealth: newState.player.maxHealth + newState.config.dragonRingHealthBonus,
          health: newState.player.health + newState.config.dragonRingHealthBonus,
        },
      };
      newState = addLog(newState, 'success', '💍 Вы подобрали Кольцо Дракона! Максимальное здоровье увеличено!');
    }
    if (item.type === 'bag') {
      newState = {
        ...newState,
        player: {
          ...newState.player,
          bags: newState.player.bags + 1,
          maxInventorySlots: newState.player.maxInventorySlots + newState.config.bagSlotBonus,
        },
      };
      newState = addLog(newState, 'success', '🎒 Вы подобрали Сумку! Новый слот инвентаря!');
    }
  }

  // Remove picked up items from cell
  const cellRef = newState.labyrinth.cells[newState.player.position.z][newState.player.position.y][newState.player.position.x];
  cellRef.items = cellRef.items.filter(
    (item) => item.type !== 'gold' && item.type !== 'dragon_ring' && item.type !== 'bag'
  );

  // Add location description
  const locationLogs = describeLocation(newState);
  for (const log of locationLogs) {
    newState = { ...newState, logs: [...newState.logs, log] };
  }

  return newState;
}

function processMinesDamage(state: GameState): GameState {
  const hasMineDetector = state.player.inventory.some((i) => i.type === 'mine_detector');
  if (hasMineDetector) {
    return addLog(state, 'info', '📡 Миноискатель защитил вас от мин!');
  }
  return applyDamage(state, state.config.mineDamage, '💣 Мина взорвалась!');
}

function applyDamage(state: GameState, damage: number, message: string): GameState {
  let newState = addLog(state, 'damage', message);

  // Check for armor
  const armorIndex = newState.player.inventory.findIndex((i) => i.type === 'armor');
  if (armorIndex !== -1) {
    const newInventory = [...newState.player.inventory];
    newInventory.splice(armorIndex, 1);
    newState = {
      ...newState,
      player: { ...newState.player, inventory: newInventory },
      arsenalItems: [...newState.arsenalItems, 'armor'],
    };
    return addLog(newState, 'info', '🛡️ Броня поглотила урон и разрушилась!');
  }

  // Apply damage
  const newHealth = newState.player.health - damage;
  newState = addLog(newState, 'damage', `Вы получили ${damage} урона. ❤️ ${newHealth}/${newState.player.maxHealth}`);

  // Drop all arsenal items
  if (newState.player.inventory.length > 0) {
    const droppedItems = newState.player.inventory.map((i) => i.type);
    newState = {
      ...newState,
      player: { ...newState.player, inventory: [] },
      arsenalItems: [...newState.arsenalItems, ...droppedItems],
    };
    newState = addLog(newState, 'info', '⚠️ Вы потеряли все предметы! Они вернулись в арсенал.');
  }

  newState = { ...newState, player: { ...newState.player, health: newHealth } };

  // Check for death
  if (newHealth <= 0) {
    newState = handleDeath(newState);
  }

  return newState;
}

function handleDeath(state: GameState): GameState {
  let newState = addLog(state, 'death', '💀 ВЫ ПОГИБЛИ!');
  newState = addLog(newState, 'narrative', 'Тьма поглотила вас... Но это не конец.');

  // Find graveyard
  let graveyardPos: Position | null = null;
  for (let z = 0; z < state.labyrinth.floors; z++) {
    for (let y = 0; y < state.labyrinth.height; y++) {
      for (let x = 0; x < state.labyrinth.width; x++) {
        if (state.labyrinth.cells[z][y][x].building?.type === 'graveyard') {
          graveyardPos = { x, y, z };
          break;
        }
      }
    }
  }

  if (!graveyardPos) graveyardPos = { x: 0, y: 0, z: 0 };

  const respawnHealth = Math.max(
    1,
    Math.floor((state.player.maxHealth * state.config.respawnHealthPercent) / 100)
  );

  newState = {
    ...newState,
    player: {
      ...newState.player,
      position: graveyardPos,
      health: respawnHealth,
    },
    deaths: newState.deaths + 1,
    currentScreen: 'death',
  };

  newState = addLog(newState, 'info', `Вы очнулись на Кладбище. ❤️ ${respawnHealth}/${newState.player.maxHealth}`);

  return newState;
}

// Monster phase
function monsterPhase(state: GameState): GameState {
  let newState = state;
  const { player, monsters, labyrinth } = newState;

  for (const monster of monsters) {
    if (monster.health <= 0) continue;

    if (monster.type === 'dragon') {
      // Dragon attacks all 4 directions + own cell
      const dragonPos = monster.position;

      // Check if player is on dragon's cell
      if (positionEquals(player.position, dragonPos)) {
        newState = applyDamage(newState, newState.config.dragonDamage, '🔥 Огненное дыхание дракона!');
        continue;
      }

      // Check adjacent cells
      for (const dir of ['up', 'right', 'down', 'left'] as Direction[]) {
        const { dx, dy } = DIRECTION_VECTORS[dir];
        const targetPos: Position = {
          x: dragonPos.x + dx,
          y: dragonPos.y + dy,
          z: dragonPos.z,
        };

        if (
          targetPos.x >= 0 &&
          targetPos.x < labyrinth.width &&
          targetPos.y >= 0 &&
          targetPos.y < labyrinth.height
        ) {
          if (positionEquals(player.position, targetPos)) {
            newState = applyDamage(newState, newState.config.dragonDamage, '🔥 Огненное дыхание дракона!');
          }
        }
      }
    }

    if (monster.type === 'archer' && monster.direction) {
      // Archer shoots in fixed direction
      const archerPos = monster.position;
      const { dx, dy } = DIRECTION_VECTORS[monster.direction];
      let currentX = archerPos.x;
      let currentY = archerPos.y;

      while (true) {
        currentX += dx;
        currentY += dy;

        if (currentX < 0 || currentX >= labyrinth.width || currentY < 0 || currentY >= labyrinth.height) {
          break;
        }

        // Check for walls
        const prevX = currentX - dx;
        const prevY = currentY - dy;
        const prevCell = labyrinth.cells[archerPos.z][prevY][prevX];
        if (prevCell.walls[monster.direction] !== 'space') {
          break;
        }

        // Check if player is hit
        if (
          player.position.x === currentX &&
          player.position.y === currentY &&
          player.position.z === archerPos.z
        ) {
          newState = applyDamage(newState, newState.config.archerDamage, '🏹 Стрела лучника попала в вас!');
          break;
        }
      }
    }
  }

  return newState;
}

// Shooting
export function shoot(state: GameState, direction: Direction): GameState {
  if (state.ended) return state;
  if (state.player.arrows <= 0) {
    return addLog(state, 'error', '⚠️ Нет стрел! Посетите Арсенал.');
  }

  let newState: GameState = {
    ...state,
    player: { ...state.player, arrows: state.player.arrows - 1 },
    actionMode: 'go',
  };

  newState = addLog(newState, 'narrative', `> Стреляете ${getDirectionNameTo(direction)}...`);

  const hasDoubleGun = newState.player.inventory.some((i) => i.type === 'double_gun');
  const damage = hasDoubleGun
    ? newState.config.arrowDamage * newState.config.doublegunMultiplier
    : newState.config.arrowDamage;

  // Arrow flight
  const { dx, dy } = DIRECTION_VECTORS[direction];
  let currentX = newState.player.position.x;
  let currentY = newState.player.position.y;
  const currentZ = newState.player.position.z;

  while (true) {
    // Check wall before moving
    const currentCell = newState.labyrinth.cells[currentZ][currentY][currentX];
    if (currentCell.walls[direction] !== 'space') {
      newState = addLog(newState, 'info', '🏹 Стрела ударилась о стену.');
      break;
    }

    currentX += dx;
    currentY += dy;

    if (
      currentX < 0 ||
      currentX >= newState.labyrinth.width ||
      currentY < 0 ||
      currentY >= newState.labyrinth.height
    ) {
      newState = addLog(newState, 'info', '🏹 Стрела улетела в темноту.');
      break;
    }

    // Check for monsters
    const hitMonster = newState.monsters.find(
      (m) =>
        m.position.x === currentX &&
        m.position.y === currentY &&
        m.position.z === currentZ &&
        m.health > 0
    );

    if (hitMonster) {
      hitMonster.health -= damage;
      newState = addLog(
        newState,
        'success',
        `🎯 Попадание! ${hitMonster.type === 'dragon' ? 'Дракон' : 'Лучник'} получает ${damage} урона!`
      );

      if (hitMonster.health <= 0) {
        newState = addLog(newState, 'success', `💀 ${hitMonster.type === 'dragon' ? 'Дракон' : 'Лучник'} убит!`);
        newState = { ...newState, kills: newState.kills + 1 };

        // Drop loot
        const cell = newState.labyrinth.cells[currentZ][currentY][currentX];
        if (hitMonster.type === 'dragon') {
          cell.items.push({ type: 'dragon_ring' });
          newState = addLog(newState, 'success', '💍 Дракон уронил Кольцо Дракона!');
        } else if (hitMonster.type === 'archer') {
          cell.items.push({ type: 'bag' });
          newState = addLog(newState, 'success', '🎒 Лучник уронил Сумку!');
        }

        // Remove monster from cell
        cell.monsters = cell.monsters.filter((m) => m.id !== hitMonster.id);
      } else {
        newState = addLog(
          newState,
          'info',
          `HP: ${hitMonster.health}/${hitMonster.maxHealth}`
        );
      }
      break;
    }
  }

  // Monster phase
  newState = monsterPhase(newState);

  return { ...newState, turn: newState.turn + 1 };
}

// Bomb
export function bomb(state: GameState, direction: Direction): GameState {
  if (state.ended) return state;
  if (state.player.bombs <= 0) {
    return addLog(state, 'error', '⚠️ Нет бомб!');
  }

  let newState: GameState = {
    ...state,
    player: { ...state.player, bombs: state.player.bombs - 1 },
    actionMode: 'go',
  };

  newState = addLog(newState, 'narrative', `> Бросаете бомбу ${getDirectionNameTo(direction)}...`);

  const cell = getCurrentCell(newState);
  const wallType = cell.walls[direction];

  if (wallType === 'wall') {
    // Destroy wall
    const { dx, dy } = DIRECTION_VECTORS[direction];
    const nx = newState.player.position.x + dx;
    const ny = newState.player.position.y + dy;
    const nz = newState.player.position.z;

    cell.walls[direction] = 'space';

    if (nx >= 0 && nx < newState.labyrinth.width && ny >= 0 && ny < newState.labyrinth.height) {
      newState.labyrinth.cells[nz][ny][nx].walls[OPPOSITE_DIRECTION[direction]] = 'space';
    }

    newState = addLog(newState, 'success', '💥 БАБАХ! Стена разрушена!');
  } else if (wallType === 'outer_wall') {
    newState = addLog(newState, 'info', '💥 Взрыв! Но внешняя стена слишком прочная.');
  } else if (wallType === 'exit') {
    newState = addLog(newState, 'info', '💥 Взрыв! Выход неразрушим.');
  } else {
    newState = addLog(newState, 'info', '💥 Взрыв! Но там нет стены.');
  }

  // Monster phase
  newState = monsterPhase(newState);

  return { ...newState, turn: newState.turn + 1 };
}

// Build
export function build(state: GameState, direction: Direction): GameState {
  if (state.ended) return state;

  const hasCement = state.player.inventory.some((i) => i.type === 'cement');
  if (!hasCement) {
    return addLog(state, 'error', '⚠️ Нужен Cement для строительства.');
  }

  let newState = state;
  const cell = getCurrentCell(newState);
  const wallType = cell.walls[direction];

  if (wallType !== 'space') {
    if (wallType === 'exit') {
      return addLog(newState, 'error', '⚠️ Нельзя застроить выход!');
    }
    return addLog(newState, 'error', '⚠️ Там уже стена!');
  }

  // Remove cement from inventory
  const cementIndex = newState.player.inventory.findIndex((i) => i.type === 'cement');
  const newInventory = [...newState.player.inventory];
  newInventory.splice(cementIndex, 1);

  newState = {
    ...newState,
    player: { ...newState.player, inventory: newInventory },
    arsenalItems: [...newState.arsenalItems, 'cement'],
    actionMode: 'go',
  };

  // Build wall
  const { dx, dy } = DIRECTION_VECTORS[direction];
  const nx = newState.player.position.x + dx;
  const ny = newState.player.position.y + dy;
  const nz = newState.player.position.z;

  cell.walls[direction] = 'wall';

  if (nx >= 0 && nx < newState.labyrinth.width && ny >= 0 && ny < newState.labyrinth.height) {
    newState.labyrinth.cells[nz][ny][nx].walls[OPPOSITE_DIRECTION[direction]] = 'wall';
  }

  newState = addLog(newState, 'success', '🧱 Стена построена!');
  newState = addLog(newState, 'info', 'Цемент вернулся в арсенал.');

  // Monster phase
  newState = monsterPhase(newState);

  return { ...newState, turn: newState.turn + 1 };
}

// Arsenal actions
export function takeArsenalItem(state: GameState, itemType: ItemType): GameState {
  if (!state.arsenalItems.includes(itemType)) {
    return addLog(state, 'error', '⚠️ Этого предмета нет в арсенале.');
  }

  if (state.player.inventory.length >= state.player.maxInventorySlots) {
    return addLog(state, 'error', '⚠️ Нет свободных слотов в инвентаре.');
  }

  const newArsenalItems = [...state.arsenalItems];
  const index = newArsenalItems.indexOf(itemType);
  newArsenalItems.splice(index, 1);

  const itemNames: Record<ItemType, string> = {
    armor: '🛡️ Броня',
    double_gun: '🔫 DoubleGun',
    mine_detector: '📡 Миноискатель',
    cement: '🧱 Цемент',
    gold: '✨ Золото',
    dragon_ring: '💍 Кольцо Дракона',
    bag: '🎒 Сумка',
  };

  let newState: GameState = {
    ...state,
    player: {
      ...state.player,
      inventory: [...state.player.inventory, { type: itemType }],
    },
    arsenalItems: newArsenalItems,
  };

  newState = addLog(newState, 'success', `Взяли: ${itemNames[itemType]}`);

  return newState;
}

export function leaveArsenal(state: GameState): GameState {
  return { ...state, currentScreen: 'game' };
}

// Lift actions
export function useLifit(state: GameState, floor: number): GameState {
  if (floor < 0 || floor >= state.labyrinth.floors) {
    return addLog(state, 'error', '⚠️ Такого этажа нет.');
  }

  const newPos: Position = {
    ...state.player.position,
    z: floor,
  };

  let newState: GameState = {
    ...state,
    player: { ...state.player, position: newPos },
    currentScreen: 'game',
  };

  newState = addLog(newState, 'info', `🛗 Вы переместились на этаж ${floor + 1}`);

  // Process new cell effects (mines, etc)
  const cell = getCell(newState, newPos);
  if (cell.building?.type === 'mines') {
    newState = processMinesDamage(newState);
  }

  return newState;
}

export function leaveLift(state: GameState): GameState {
  return { ...state, currentScreen: 'game' };
}

// Death screen continue
export function continueAfterDeath(state: GameState): GameState {
  let newState = { ...state, currentScreen: 'game' as const };
  const locationLogs = describeLocation(newState);
  for (const log of locationLogs) {
    newState = { ...newState, logs: [...newState.logs, log] };
  }
  return newState;
}

// Set action mode
export function setActionMode(state: GameState, mode: ActionMode): GameState {
  return { ...state, actionMode: mode };
}

// Helper to add log
function addLog(state: GameState, type: LogMessage['type'], text: string): GameState {
  return {
    ...state,
    logs: [...state.logs, createLogMessage(type, text)],
  };
}

// New game
export function newGame(config: GameConfig = {}): GameState {
  return createGame(config);
}
