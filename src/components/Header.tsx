import styles from './Header.module.css';

interface Props {
  onMenuOpen?: () => void;
}

export function Header({ onMenuOpen }: Props) {
  return (
    <header className={styles.header}>
      {/* Menu button */}
      <button
        className={styles.menuBtn}
        onClick={onMenuOpen}
        aria-label="Открыть меню"
        title="Меню"
      >
        <span className={styles.menuLine} />
        <span className={styles.menuLine} />
        <span className={styles.menuLine} />
      </button>

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

      {/* Right decorative runes (mirror of left) */}
      <div className={styles.runicDecor} aria-hidden="true">
        <span className={styles.rune}>ᚦ</span>
        <span className={styles.runeLine} />
        <span className={styles.rune}>ᚨ</span>
      </div>
    </header>
  );
}
