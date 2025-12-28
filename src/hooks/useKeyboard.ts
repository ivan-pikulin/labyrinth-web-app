import { useEffect } from 'react';
import { Direction } from '@/types';
import { useGameStore } from '@/store/gameStore';

const KEY_TO_DIRECTION: Record<string, Direction> = {
  ArrowUp: 'up',
  ArrowDown: 'down',
  ArrowLeft: 'left',
  ArrowRight: 'right',
};

export function useKeyboard() {
  const currentScreen = useGameStore((s) => s.currentScreen);
  const ended = useGameStore((s) => s.ended);
  const move = useGameStore((s) => s.move);
  const shoot = useGameStore((s) => s.shoot);
  const bomb = useGameStore((s) => s.bomb);
  const build = useGameStore((s) => s.build);
  const leaveArsenal = useGameStore((s) => s.leaveArsenal);
  const leaveLift = useGameStore((s) => s.leaveLift);
  const continueAfterDeath = useGameStore((s) => s.continueAfterDeath);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't process if in input fields
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      // Handle special screens
      if (currentScreen === 'arsenal') {
        if (e.key === 'Escape' || e.key === 'Enter') {
          e.preventDefault();
          leaveArsenal();
        }
        return;
      }

      if (currentScreen === 'lift') {
        if (e.key === 'Escape' || e.key === 'Enter') {
          e.preventDefault();
          leaveLift();
        }
        return;
      }

      if (currentScreen === 'death') {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          continueAfterDeath();
        }
        return;
      }

      if (ended) return;

      // Direction keys
      const direction = KEY_TO_DIRECTION[e.key];
      if (!direction) return;

      e.preventDefault();

      // Determine action based on modifiers
      if (e.shiftKey) {
        shoot(direction);
      } else if (e.ctrlKey || e.metaKey) {
        bomb(direction);
      } else if (e.altKey) {
        build(direction);
      } else {
        move(direction);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    currentScreen,
    ended,
    move,
    shoot,
    bomb,
    build,
    leaveArsenal,
    leaveLift,
    continueAfterDeath,
  ]);
}
