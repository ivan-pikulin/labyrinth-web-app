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
