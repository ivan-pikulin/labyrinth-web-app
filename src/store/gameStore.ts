import { create } from 'zustand';
import { GameState, GameConfig, Direction, ActionMode, ItemType } from '@/types';
import * as engine from '@/game/engine';

interface GameStore extends GameState {
  // Actions
  move: (direction: Direction) => void;
  shoot: (direction: Direction) => void;
  bomb: (direction: Direction) => void;
  build: (direction: Direction) => void;
  setActionMode: (mode: ActionMode) => void;
  takeArsenalItem: (itemType: ItemType) => void;
  leaveArsenal: () => void;
  useLift: (floor: number) => void;
  leaveLift: () => void;
  continueAfterDeath: () => void;
  newGame: (config?: GameConfig) => void;
  performAction: (direction: Direction) => void;
}

export const useGameStore = create<GameStore>((set, get) => ({
  ...engine.createGame(),

  // Debug: expose game state to window for console debugging
  // Use: window.debugGame() in browser console

  move: (direction) => set((state) => engine.move(state, direction)),
  shoot: (direction) => set((state) => engine.shoot(state, direction)),
  bomb: (direction) => set((state) => engine.bomb(state, direction)),
  build: (direction) => set((state) => engine.build(state, direction)),
  setActionMode: (mode) => set((state) => engine.setActionMode(state, mode)),
  takeArsenalItem: (itemType) => set((state) => engine.takeArsenalItem(state, itemType)),
  leaveArsenal: () => set((state) => engine.leaveArsenal(state)),
  useLift: (floor) => set((state) => engine.useLifit(state, floor)),
  leaveLift: () => set((state) => engine.leaveLift(state)),
  continueAfterDeath: () => set((state) => engine.continueAfterDeath(state)),
  newGame: (config) => set(() => engine.newGame(config)),

  performAction: (direction) => {
    const state = get();
    switch (state.actionMode) {
      case 'go':
        set((s) => engine.move(s, direction));
        break;
      case 'shoot':
        set((s) => engine.shoot(s, direction));
        break;
      case 'bomb':
        set((s) => engine.bomb(s, direction));
        break;
      case 'build':
        set((s) => engine.build(s, direction));
        break;
    }
  },
}));

// Debug helper - expose to window for console access
if (typeof window !== 'undefined') {
  const debugGame = () => {
    const state = useGameStore.getState();
    const { player, labyrinth, monsters, turn, deaths, kills, ended, won, actionMode, config } = state;

    console.group('🎮 Game Debug Info');

    console.group('📍 Player');
    console.log('Position:', player.position);
    console.log('Health:', `${player.health}/${player.maxHealth}`);
    console.log('Arrows:', `${player.arrows}/${player.maxArrows}`);
    console.log('Bombs:', `${player.bombs}/${player.maxBombs}`);
    console.log('Has Gold:', player.hasGold);
    console.log('Dragon Rings:', player.dragonRings);
    console.log('Bags:', player.bags);
    console.log('Inventory:', player.inventory);
    console.groupEnd();

    console.group('🏛️ Labyrinth');
    console.log('Size:', `${labyrinth.width}x${labyrinth.height}`);
    console.log('Floors:', labyrinth.floors);
    console.log('Cells array dimensions:', {
      floors: labyrinth.cells.length,
      rows: labyrinth.cells[0]?.length,
      cols: labyrinth.cells[0]?.[0]?.length,
    });
    console.groupEnd();

    console.group('👹 Monsters');
    console.log('Count:', monsters.length);
    monsters.forEach((m, i) => {
      console.log(`  ${i}: ${m.type} at (${m.position.x}, ${m.position.y}, ${m.position.z}) hp:${m.health}`);
    });
    console.groupEnd();

    console.group('⚙️ Game State');
    console.log('Turn:', turn);
    console.log('Deaths:', deaths);
    console.log('Kills:', kills);
    console.log('Ended:', ended);
    console.log('Won:', won);
    console.log('Action Mode:', actionMode);
    console.groupEnd();

    console.group('🔧 Config');
    console.table(config);
    console.groupEnd();

    console.groupEnd();

    return { player, labyrinth, monsters, turn, config };
  };

  const debugCell = (x?: number, y?: number, z?: number) => {
    const state = useGameStore.getState();
    const pos = {
      x: x ?? state.player.position.x,
      y: y ?? state.player.position.y,
      z: z ?? state.player.position.z,
    };

    const floor = state.labyrinth.cells[pos.z];
    if (!floor) {
      console.error('Floor', pos.z, 'does not exist. Available:', state.labyrinth.cells.length);
      return null;
    }
    const row = floor[pos.y];
    if (!row) {
      console.error('Row', pos.y, 'does not exist on floor', pos.z);
      return null;
    }
    const cell = row[pos.x];
    if (!cell) {
      console.error('Cell', pos.x, 'does not exist at row', pos.y, 'floor', pos.z);
      return null;
    }

    console.group(`🔲 Cell at (${pos.x}, ${pos.y}, ${pos.z})`);
    console.log('Walls:', cell.walls);
    console.log('Building:', cell.building);
    console.log('Items:', cell.items);
    console.groupEnd();

    return cell;
  };

  const debugMap = (floor?: number) => {
    const state = useGameStore.getState();
    const z = floor ?? state.player.position.z;
    const { width, height } = state.labyrinth;

    console.log(`🗺️ Map floor ${z} (${width}x${height}):`);

    const symbols: Record<string, string> = {
      graveyard: 'G',
      hospital: 'H',
      arsenal: 'A',
      lift: 'L',
      gold: '$',
      monster: 'M',
      player: '@',
    };

    let map = '';
    for (let y = 0; y < height; y++) {
      let row = '';
      for (let x = 0; x < width; x++) {
        const cell = state.labyrinth.cells[z]?.[y]?.[x];
        if (!cell) {
          row += '?';
          continue;
        }

        // Check what's in the cell
        const isPlayer =
          state.player.position.x === x && state.player.position.y === y && state.player.position.z === z;
        const monster = state.monsters.find(
          (m) => m.position.x === x && m.position.y === y && m.position.z === z && m.health > 0
        );
        const hasGold = cell.items.some((i) => i.type === 'gold');

        if (isPlayer) row += '@';
        else if (monster) row += 'M';
        else if (hasGold) row += '$';
        else if (cell.building) row += symbols[cell.building.type] || 'B';
        else row += '.';
      }
      map += row + '\n';
    }
    console.log(map);
    console.log('Legend: @ player, M monster, $ gold, G graveyard, H hospital, A arsenal, L lift, . empty');
  };

  // Expose to window
  (window as unknown as Record<string, unknown>).debugGame = debugGame;
  (window as unknown as Record<string, unknown>).debugCell = debugCell;
  (window as unknown as Record<string, unknown>).debugMap = debugMap;

  console.log('🎮 Debug commands available: debugGame(), debugCell(x?, y?, z?), debugMap(floor?)');
}
