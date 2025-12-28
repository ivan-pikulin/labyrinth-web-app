import { useGameStore } from '@/store/gameStore';
import styles from './StatusBar.module.css';

export function StatusBar() {
  const player = useGameStore((s) => s.player);
  const labyrinth = useGameStore((s) => s.labyrinth);

  const healthSegments = [];
  for (let i = 0; i < player.maxHealth; i++) {
    healthSegments.push(
      <span
        key={i}
        className={`${styles.segment} ${i < player.health ? styles.filled : styles.empty}`}
      />
    );
  }

  const inventoryItems = player.inventory.map((item, i) => {
    const icons: Record<string, string> = {
      armor: '🛡️',
      double_gun: '🔫',
      mine_detector: '📡',
      cement: '🧱',
    };
    return (
      <span key={i} className={styles.inventoryItem} title={item.type}>
        {icons[item.type] || '?'}
      </span>
    );
  });

  return (
    <div className={styles.statusBar}>
      <div className={styles.health}>
        <span className={styles.icon}>♥</span>
        <div className={styles.segments}>{healthSegments}</div>
        <span className={styles.value}>
          {player.health}/{player.maxHealth}
        </span>
      </div>

      <div className={styles.stat}>
        <span className={styles.icon}>🏹</span>
        <span className={styles.value}>{player.arrows}</span>
      </div>

      <div className={styles.stat}>
        <span className={styles.icon}>💣</span>
        <span className={styles.value}>{player.bombs}</span>
      </div>

      <div className={styles.inventory}>
        <span className={styles.icon}>🎒</span>
        {inventoryItems.length > 0 ? (
          inventoryItems
        ) : (
          <span className={styles.empty}>—</span>
        )}
        <span className={styles.slots}>
          ({player.inventory.length}/{player.maxInventorySlots})
        </span>
      </div>

      {player.hasGold && (
        <div className={styles.gold}>
          <span className={styles.icon}>✨</span>
          <span>Золото</span>
        </div>
      )}

      {labyrinth.floors > 1 && (
        <div className={styles.floor}>
          <span className={styles.icon}>🏛️</span>
          <span>Этаж {player.position.z + 1}</span>
        </div>
      )}
    </div>
  );
}
