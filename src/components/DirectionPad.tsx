import { Direction } from '@/types';
import { useGameStore } from '@/store/gameStore';
import styles from './DirectionPad.module.css';

const DIRECTION_CONFIG: Record<Direction, { icon: string; rune: string; label: string }> = {
  up: { icon: '↑', rune: 'ᚾ', label: 'Север' },
  right: { icon: '→', rune: 'ᚱ', label: 'Восток' },
  down: { icon: '↓', rune: 'ᛊ', label: 'Юг' },
  left: { icon: '←', rune: 'ᚹ', label: 'Запад' },
};

interface Props {
  onOpenLabyrinthInfo?: () => void;
  onOpenPlayerInfo?: () => void;
}

export function DirectionPad({ onOpenLabyrinthInfo, onOpenPlayerInfo }: Props) {
  const performAction = useGameStore((s) => s.performAction);

  const handleClick = (dir: Direction) => {
    performAction(dir);
  };

  const renderButton = (dir: Direction, position: string) => {
    const config = DIRECTION_CONFIG[dir];
    return (
      <button
        className={`${styles.btn} ${styles[position]}`}
        onClick={() => handleClick(dir)}
        title={config.label}
        aria-label={`Двигаться на ${config.label}`}
        data-direction={dir}
      >
        <span className={styles.btnInner}>
          <span className={styles.arrow}>{config.icon}</span>
          <span className={styles.rune}>{config.rune}</span>
        </span>
        <span className={styles.btnGlow} aria-hidden="true" />
      </button>
    );
  };

  return (
    <div className={styles.compassWrapper}>
      {/* Mobile info button - Labyrinth */}
      <button
        className={styles.infoBtn}
        onClick={onOpenLabyrinthInfo}
        aria-label="Информация о лабиринте"
        data-position="left"
      >
        <span className={styles.infoBtnIcon}>🏛️</span>
        <span className={styles.infoBtnRune}>ᛚ</span>
      </button>

      <div className={styles.compass}>
        {/* Outer decorative ring */}
      <div className={styles.outerRing} aria-hidden="true">
        <span className={styles.cardinal} data-dir="n">N</span>
        <span className={styles.cardinal} data-dir="e">E</span>
        <span className={styles.cardinal} data-dir="s">S</span>
        <span className={styles.cardinal} data-dir="w">W</span>
      </div>

      {/* Decorative tick marks */}
      <div className={styles.tickRing} aria-hidden="true">
        {[...Array(12)].map((_, i) => (
          <span
            key={i}
            className={styles.tick}
            style={{ transform: `rotate(${i * 30}deg)` }}
          />
        ))}
      </div>

      {/* Inner compass area */}
      <div className={styles.innerCompass}>
        {/* Direction buttons */}
        <div className={styles.directions}>
          {renderButton('up', 'north')}
          {renderButton('right', 'east')}
          {renderButton('down', 'south')}
          {renderButton('left', 'west')}
        </div>

        {/* Center emblem */}
        <div className={styles.center}>
          <div className={styles.centerOuter}>
            <div className={styles.centerInner}>
              <span className={styles.centerRune}>◈</span>
            </div>
          </div>
          <div className={styles.centerGlow} aria-hidden="true" />
        </div>

        {/* Connecting lines */}
        <svg className={styles.lines} viewBox="0 0 200 200" aria-hidden="true">
          <defs>
            <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="var(--color-gold-dim)" stopOpacity="0" />
              <stop offset="50%" stopColor="var(--color-gold)" stopOpacity="0.6" />
              <stop offset="100%" stopColor="var(--color-gold-dim)" stopOpacity="0" />
            </linearGradient>
          </defs>
          {/* Vertical line */}
          <line x1="100" y1="30" x2="100" y2="170" stroke="url(#lineGradient)" strokeWidth="1" />
          {/* Horizontal line */}
          <line x1="30" y1="100" x2="170" y2="100" stroke="url(#lineGradient)" strokeWidth="1" />
          {/* Diagonal lines */}
          <line x1="50" y1="50" x2="150" y2="150" stroke="url(#lineGradient)" strokeWidth="0.5" opacity="0.4" />
          <line x1="150" y1="50" x2="50" y2="150" stroke="url(#lineGradient)" strokeWidth="0.5" opacity="0.4" />
        </svg>
      </div>

        {/* Decorative corner runes */}
        <span className={styles.cornerDecor} data-corner="tl">ᚠ</span>
        <span className={styles.cornerDecor} data-corner="tr">ᚢ</span>
        <span className={styles.cornerDecor} data-corner="bl">ᚦ</span>
        <span className={styles.cornerDecor} data-corner="br">ᚨ</span>
      </div>

      {/* Mobile info button - Player */}
      <button
        className={styles.infoBtn}
        onClick={onOpenPlayerInfo}
        aria-label="Информация о герое"
        data-position="right"
      >
        <span className={styles.infoBtnIcon}>⚔️</span>
        <span className={styles.infoBtnRune}>ᚺ</span>
      </button>
    </div>
  );
}
