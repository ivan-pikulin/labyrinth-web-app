import { useGameStore } from '@/store/gameStore';
import { useState } from 'react';
import { LabyrinthMap } from './LabyrinthMap';
import styles from './VictoryScreen.module.css';

export function VictoryScreen() {
  const turn = useGameStore((s) => s.turn);
  const deaths = useGameStore((s) => s.deaths);
  const kills = useGameStore((s) => s.kills);
  const labyrinth = useGameStore((s) => s.labyrinth);
  const newGame = useGameStore((s) => s.newGame);
  const [showMap, setShowMap] = useState(false);

  return (
    <div className={styles.overlay}>
      <div className={`${styles.modal} ${showMap ? styles.modalWide : ''}`}>
        <div className={styles.stars}>✧ ✧ ✧</div>
        <h2 className={styles.title}>ᚷ ПОБЕДА ᚷ</h2>

        <p className={styles.text}>Вы выбрались из лабиринта!</p>
        <p className={styles.text}>Золото сверкает в ваших руках.</p>

        <div className={styles.divider} />

        <div className={styles.stats}>
          <div className={styles.stat}>
            <span className={styles.statValue}>{turn}</span>
            <span className={styles.statLabel}>ходов</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.statValue}>{deaths}</span>
            <span className={styles.statLabel}>смертей</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.statValue}>{kills}</span>
            <span className={styles.statLabel}>убийств</span>
          </div>
        </div>

        <div className={styles.divider} />

        <div className={styles.mapInfo}>
          <p>Лабиринт: {labyrinth.width}×{labyrinth.height}</p>
          {labyrinth.floors > 1 && <p>Этажей: {labyrinth.floors}</p>}
        </div>

        <button className={styles.mapToggleBtn} onClick={() => setShowMap(!showMap)}>
          {showMap ? '📜 Скрыть карту' : '🗺️ Показать карту'}
        </button>

        {showMap && (
          <div className={styles.mapContainer}>
            <LabyrinthMap />
          </div>
        )}

        <button className={styles.newGameBtn} onClick={() => newGame()}>
          🔄 Новая игра
        </button>
      </div>
    </div>
  );
}
