import { ActionMode } from '@/types';
import { useGameStore } from '@/store/gameStore';
import styles from './ActionModes.module.css';

interface ModeConfig {
  mode: ActionMode;
  icon: string;
  rune: string;
  label: string;
  hotkey: string;
  color: string;
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
      icon: '⟐',
      rune: 'ᚹ',
      label: 'Идти',
      hotkey: '',
      color: 'gold',
      isAvailable: () => true,
    },
    {
      mode: 'shoot',
      icon: '↠',
      rune: 'ᛊ',
      label: 'Стрела',
      hotkey: '⇧',
      color: 'cold',
      getCount: () => player.arrows,
      isAvailable: () => player.arrows > 0,
    },
    {
      mode: 'bomb',
      icon: '✦',
      rune: 'ᚦ',
      label: 'Бомба',
      hotkey: '⌃',
      color: 'fire',
      getCount: () => player.bombs,
      isAvailable: () => player.bombs > 0,
    },
    {
      mode: 'build',
      icon: '▣',
      rune: 'ᛒ',
      label: 'Стена',
      hotkey: '⌥',
      color: 'arcane',
      getCount: () => (player.inventory.some((i) => i.type === 'cement') ? 1 : 0),
      isAvailable: () => player.inventory.some((i) => i.type === 'cement'),
    },
  ];

  return (
    <div className={styles.container}>
      <div className={styles.decorLeft} aria-hidden="true">
        <span className={styles.decorRune}>ᚠ</span>
        <span className={styles.decorLine} />
      </div>

      <div className={styles.orbsContainer}>
        {modes.map((config, index) => {
          const isActive = actionMode === config.mode;
          const isAvailable = config.isAvailable();
          const count = config.getCount?.();

          return (
            <button
              key={config.mode}
              className={`${styles.orb} ${isActive ? styles.active : ''} ${!isAvailable ? styles.disabled : ''}`}
              onClick={() => isAvailable && setActionMode(config.mode)}
              disabled={!isAvailable}
              title={`${config.label}${config.hotkey ? ` (${config.hotkey} + направление)` : ''}`}
              aria-label={config.label}
              data-color={config.color}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Outer ring */}
              <span className={styles.orbRing} aria-hidden="true" />

              {/* Inner orb */}
              <span className={styles.orbInner}>
                <span className={styles.orbIcon}>{config.icon}</span>
                <span className={styles.orbRune}>{config.rune}</span>
              </span>

              {/* Glow effect */}
              <span className={styles.orbGlow} aria-hidden="true" />

              {/* Active indicator */}
              {isActive && <span className={styles.activeRing} aria-hidden="true" />}

              {/* Count badge */}
              {count !== undefined && (
                <span className={styles.count} data-empty={count === 0}>
                  {count}
                </span>
              )}

              {/* Label below */}
              <span className={styles.label}>{config.label}</span>

              {/* Hotkey indicator */}
              {config.hotkey && (
                <span className={styles.hotkey}>{config.hotkey}</span>
              )}
            </button>
          );
        })}
      </div>

      <div className={styles.decorRight} aria-hidden="true">
        <span className={styles.decorLine} />
        <span className={styles.decorRune}>ᚢ</span>
      </div>
    </div>
  );
}
