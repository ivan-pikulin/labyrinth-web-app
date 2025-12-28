import { useGameStore } from '@/store/gameStore';
import styles from './DeathScreen.module.css';

export function DeathScreen() {
  const continueAfterDeath = useGameStore((s) => s.continueAfterDeath);
  const player = useGameStore((s) => s.player);
  const deaths = useGameStore((s) => s.deaths);

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.skull}>💀</div>
        <h2 className={styles.title}>ВЫ ПОГИБЛИ</h2>

        <p className={styles.text}>Тьма поглотила вас...</p>
        <p className={styles.text}>Но это не конец.</p>

        <div className={styles.divider} />

        <div className={styles.info}>
          <p>Возрождение на Кладбище</p>
          <p>
            Здоровье: {player.health}/{player.maxHealth}
          </p>
          <p className={styles.deaths}>Смертей: {deaths}</p>
        </div>

        <button className={styles.continueBtn} onClick={continueAfterDeath}>
          Продолжить
        </button>
      </div>
    </div>
  );
}
