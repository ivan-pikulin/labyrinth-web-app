import { useGameStore } from '@/store/gameStore';
import styles from './Header.module.css';

interface Props {
  onOpenSettings: () => void;
}

export function Header({ onOpenSettings }: Props) {
  const turn = useGameStore((s) => s.turn);
  const player = useGameStore((s) => s.player);
  const labyrinth = useGameStore((s) => s.labyrinth);

  const floorNumeral = ['I', 'II', 'III', 'IV', 'V'][player.position.z] || (player.position.z + 1);

  return (
    <header className={styles.header}>
      {/* Left decorative runes */}
      <div className={styles.runicDecor} aria-hidden="true">
        <span className={styles.rune}>ᚠ</span>
        <span className={styles.runeLine} />
        <span className={styles.rune}>ᚢ</span>
      </div>

      {/* Center title */}
      <div className={styles.titleGroup}>
        <div className={styles.titleFrame}>
          <span className={styles.cornerRune} data-position="tl">◈</span>
          <span className={styles.cornerRune} data-position="tr">◈</span>
          <span className={styles.cornerRune} data-position="bl">◈</span>
          <span className={styles.cornerRune} data-position="br">◈</span>

          <h1 className={styles.title}>
            <span className={styles.runeAccent}>ᛚ</span>
            ЛАБИРИНТ
            <span className={styles.runeAccent}>ᛚ</span>
          </h1>
        </div>

        <div className={styles.subtitle}>
          <span className={styles.subtitleDivider}>─────</span>
          <span className={styles.subtitleText}>древний путь</span>
          <span className={styles.subtitleDivider}>─────</span>
        </div>
      </div>

      {/* Right info panel */}
      <div className={styles.infoPanel}>
        <div className={styles.statGroup}>
          <div className={styles.stat}>
            <span className={styles.statIcon}>⟐</span>
            <span className={styles.statLabel}>Ход</span>
            <span className={styles.statValue}>{turn}</span>
          </div>

          {labyrinth.floors > 1 && (
            <div className={styles.stat}>
              <span className={styles.statIcon}>⊛</span>
              <span className={styles.statLabel}>Этаж</span>
              <span className={styles.statValue}>{floorNumeral}</span>
            </div>
          )}
        </div>

        <button
          className={styles.settingsBtn}
          onClick={onOpenSettings}
          title="Настройки / Новая игра"
          aria-label="Открыть настройки"
        >
          <span className={styles.settingsIcon}>⚙</span>
          <span className={styles.settingsGlow} aria-hidden="true" />
        </button>
      </div>

      {/* Right decorative runes */}
      <div className={styles.runicDecor} aria-hidden="true">
        <span className={styles.rune}>ᚦ</span>
        <span className={styles.runeLine} />
        <span className={styles.rune}>ᚨ</span>
      </div>
    </header>
  );
}
