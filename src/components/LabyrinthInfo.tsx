import { useGameStore } from '@/store/gameStore';
import styles from './SidePanel.module.css';

export function LabyrinthInfo() {
  const labyrinth = useGameStore((s) => s.labyrinth);
  const monsters = useGameStore((s) => s.monsters);
  const config = useGameStore((s) => s.config);

  const aliveMonsters = monsters.filter((m) => m.health > 0);
  const dragons = aliveMonsters.filter((m) => m.type === 'dragon').length;
  const archers = aliveMonsters.filter((m) => m.type === 'archer').length;

  return (
    <div className={styles.panel}>
      <h3 className={styles.title}>Лабиринт</h3>

      <div className={styles.section}>
        <div className={styles.row}>
          <span className={styles.icon}>📐</span>
          <span className={styles.label}>Размер</span>
          <span className={styles.value}>{labyrinth.width}×{labyrinth.height}</span>
        </div>

        {labyrinth.floors > 1 && (
          <div className={styles.row}>
            <span className={styles.icon}>🏛️</span>
            <span className={styles.label}>Этажей</span>
            <span className={styles.value}>{labyrinth.floors}</span>
          </div>
        )}
      </div>

      <div className={styles.divider} />

      <div className={styles.section}>
        <div className={styles.sectionTitle}>Монстры</div>

        {config.dragonCount > 0 && (
          <div className={styles.row}>
            <span className={styles.icon}>🐉</span>
            <span className={styles.label}>Драконы</span>
            <span className={styles.value}>{dragons}/{config.dragonCount}</span>
          </div>
        )}

        {config.archerCount > 0 && (
          <div className={styles.row}>
            <span className={styles.icon}>🏹</span>
            <span className={styles.label}>Лучники</span>
            <span className={styles.value}>{archers}/{config.archerCount}</span>
          </div>
        )}

        {config.dragonCount === 0 && config.archerCount === 0 && (
          <div className={styles.empty}>Нет монстров</div>
        )}
      </div>

      <div className={styles.divider} />

      <div className={styles.section}>
        <div className={styles.sectionTitle}>Здания</div>

        <div className={styles.row}>
          <span className={styles.icon}>🌀</span>
          <span className={styles.label}>Порталы</span>
          <span className={styles.value}>{config.portalCount}</span>
        </div>

        <div className={styles.row}>
          <span className={styles.icon}>💣</span>
          <span className={styles.label}>Мины</span>
          <span className={styles.value}>{config.mineCount}</span>
        </div>

        <div className={styles.row}>
          <span className={styles.icon}>🏛️</span>
          <span className={styles.label}>Арсенал</span>
          <span className={styles.value}>{config.arsenalCount}</span>
        </div>

        <div className={styles.row}>
          <span className={styles.icon}>🏥</span>
          <span className={styles.label}>Госпиталь</span>
          <span className={styles.value}>{config.hospitalCount}</span>
        </div>
      </div>
    </div>
  );
}
