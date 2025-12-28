import { useGameStore } from '@/store/gameStore';
import styles from './SidePanel.module.css';

export function PlayerInfo() {
  const player = useGameStore((s) => s.player);
  const deaths = useGameStore((s) => s.deaths);
  const kills = useGameStore((s) => s.kills);

  const healthSegments = [];
  for (let i = 0; i < player.maxHealth; i++) {
    healthSegments.push(
      <span
        key={i}
        className={`${styles.healthSegment} ${i < player.health ? styles.filled : styles.empty}`}
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
    <div className={styles.panel}>
      <h3 className={styles.title}>Герой</h3>

      <div className={styles.section}>
        <div className={styles.row}>
          <span className={styles.icon}>❤️</span>
          <span className={styles.label}>Здоровье</span>
          <span className={styles.value}>{player.health}/{player.maxHealth}</span>
        </div>
        <div className={styles.healthBar}>{healthSegments}</div>
      </div>

      <div className={styles.divider} />

      <div className={styles.section}>
        <div className={styles.sectionTitle}>Снаряжение</div>

        <div className={styles.row}>
          <span className={styles.icon}>🏹</span>
          <span className={styles.label}>Стрелы</span>
          <span className={styles.value}>{player.arrows}/{player.maxArrows}</span>
        </div>

        <div className={styles.row}>
          <span className={styles.icon}>💣</span>
          <span className={styles.label}>Бомбы</span>
          <span className={styles.value}>{player.bombs}/{player.maxBombs}</span>
        </div>
      </div>

      <div className={styles.divider} />

      <div className={styles.section}>
        <div className={styles.sectionTitle}>
          Инвентарь ({player.inventory.length}/{player.maxInventorySlots})
        </div>

        <div className={styles.inventoryGrid}>
          {inventoryItems.length > 0 ? (
            inventoryItems
          ) : (
            <span className={styles.emptyText}>Пусто</span>
          )}
        </div>
      </div>

      {player.hasGold && (
        <>
          <div className={styles.divider} />
          <div className={`${styles.section} ${styles.goldSection}`}>
            <span className={styles.goldIcon}>✨</span>
            <span className={styles.goldText}>ЗОЛОТО</span>
          </div>
        </>
      )}

      <div className={styles.divider} />

      <div className={styles.section}>
        <div className={styles.sectionTitle}>Статистика</div>

        <div className={styles.row}>
          <span className={styles.icon}>💀</span>
          <span className={styles.label}>Смертей</span>
          <span className={styles.value}>{deaths}</span>
        </div>

        <div className={styles.row}>
          <span className={styles.icon}>⚔️</span>
          <span className={styles.label}>Убийств</span>
          <span className={styles.value}>{kills}</span>
        </div>

        {player.dragonRings > 0 && (
          <div className={styles.row}>
            <span className={styles.icon}>💍</span>
            <span className={styles.label}>Колец</span>
            <span className={styles.value}>{player.dragonRings}</span>
          </div>
        )}

        {player.bags > 0 && (
          <div className={styles.row}>
            <span className={styles.icon}>🎒</span>
            <span className={styles.label}>Сумок</span>
            <span className={styles.value}>{player.bags}</span>
          </div>
        )}
      </div>
    </div>
  );
}
