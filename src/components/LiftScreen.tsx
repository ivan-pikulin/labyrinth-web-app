import { useGameStore } from '@/store/gameStore';
import styles from './LiftScreen.module.css';

export function LiftScreen() {
  const labyrinth = useGameStore((s) => s.labyrinth);
  const player = useGameStore((s) => s.player);
  const useLift = useGameStore((s) => s.useLift);
  const leaveLift = useGameStore((s) => s.leaveLift);

  const floors = Array.from({ length: labyrinth.floors }, (_, i) => i);

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <h2 className={styles.title}>ᛚ ЛИФТ ᛚ</h2>

        <div className={styles.shaft}>
          {floors.map((floor) => {
            const isCurrent = floor === player.position.z;
            const floorNumber = floor + 1;
            const romanNumerals = ['I', 'II', 'III', 'IV', 'V'];
            const label = romanNumerals[floor] || floorNumber.toString();

            return (
              <button
                key={floor}
                className={`${styles.floorBtn} ${isCurrent ? styles.current : ''}`}
                onClick={() => useLift(floor)}
                disabled={isCurrent}
              >
                <span className={styles.floorLabel}>{label}</span>
                {isCurrent && <span className={styles.marker}>← Сейчас</span>}
              </button>
            );
          })}
        </div>

        <button className={styles.leaveBtn} onClick={leaveLift}>
          Остаться
        </button>
      </div>
    </div>
  );
}
