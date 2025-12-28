import { useGameStore } from '@/store/gameStore';
import styles from './Header.module.css';

interface Props {
  onOpenSettings: () => void;
}

export function Header({ onOpenSettings }: Props) {
  const turn = useGameStore((s) => s.turn);

  return (
    <header className={styles.header}>
      <div className={styles.title}>
        <span className={styles.rune}>ᛚ</span>
        <h1>ЛАБИРИНТ</h1>
        <span className={styles.rune}>ᛚ</span>
      </div>
      <div className={styles.info}>
        <span className={styles.turn}>Ход {turn}</span>
        <button
          className={styles.settingsBtn}
          onClick={onOpenSettings}
          title="Настройки / Новая игра"
        >
          ⚙️
        </button>
      </div>
    </header>
  );
}
