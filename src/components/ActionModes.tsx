import { ActionMode } from '@/types';
import { useGameStore } from '@/store/gameStore';
import styles from './ActionModes.module.css';

interface ModeConfig {
  mode: ActionMode;
  icon: string;
  label: string;
  hotkey: string;
  getCount?: () => number | undefined;
  isAvailable: () => boolean;
}

export function ActionModes() {
  const actionMode = useGameStore((s) => s.actionMode);
  const setActionMode = useGameStore((s) => s.setActionMode);
  const player = useGameStore((s) => s.player);

  const modes: ModeConfig[] = [
    {
      mode: 'go',
      icon: '🚶',
      label: 'Идти',
      hotkey: '',
      isAvailable: () => true,
    },
    {
      mode: 'shoot',
      icon: '🏹',
      label: '',
      hotkey: '⇧',
      getCount: () => player.arrows,
      isAvailable: () => player.arrows > 0,
    },
    {
      mode: 'bomb',
      icon: '💣',
      label: '',
      hotkey: '⌃',
      getCount: () => player.bombs,
      isAvailable: () => player.bombs > 0,
    },
    {
      mode: 'build',
      icon: '🧱',
      label: '',
      hotkey: '⌥',
      getCount: () => (player.inventory.some((i) => i.type === 'cement') ? 1 : 0),
      isAvailable: () => player.inventory.some((i) => i.type === 'cement'),
    },
  ];

  return (
    <div className={styles.container}>
      {modes.map((config) => {
        const isActive = actionMode === config.mode;
        const isAvailable = config.isAvailable();
        const count = config.getCount?.();

        return (
          <button
            key={config.mode}
            className={`${styles.btn} ${isActive ? styles.active : ''} ${!isAvailable ? styles.disabled : ''}`}
            onClick={() => isAvailable && setActionMode(config.mode)}
            disabled={!isAvailable}
            title={`${config.label || config.mode}${config.hotkey ? ` (${config.hotkey} + стрелка)` : ''}`}
          >
            <span className={styles.icon}>{config.icon}</span>
            {config.label && <span className={styles.label}>{config.label}</span>}
            {count !== undefined && <span className={styles.count}>{count}</span>}
            {isActive && <span className={styles.check}>✓</span>}
            {config.hotkey && <span className={styles.hotkey}>{config.hotkey}</span>}
          </button>
        );
      })}
    </div>
  );
}
