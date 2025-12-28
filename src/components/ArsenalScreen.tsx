import { ItemType } from '@/types';
import { useGameStore } from '@/store/gameStore';
import styles from './ArsenalScreen.module.css';

const ITEM_INFO: Record<string, { icon: string; name: string; description: string }> = {
  armor: {
    icon: '🛡️',
    name: 'Armor',
    description: 'Блокирует один урон',
  },
  double_gun: {
    icon: '🔫',
    name: 'DoubleGun',
    description: 'Урон стрел ×2',
  },
  mine_detector: {
    icon: '📡',
    name: 'MineDetector',
    description: 'Защита от мин',
  },
  cement: {
    icon: '🧱',
    name: 'Cement',
    description: 'Строить стены',
  },
};

export function ArsenalScreen() {
  const arsenalItems = useGameStore((s) => s.arsenalItems);
  const player = useGameStore((s) => s.player);
  const takeArsenalItem = useGameStore((s) => s.takeArsenalItem);
  const leaveArsenal = useGameStore((s) => s.leaveArsenal);

  const canTakeItem = player.inventory.length < player.maxInventorySlots;
  const playerItemTypes = player.inventory.map((i) => i.type);

  // Count items in arsenal
  const itemCounts: Record<string, number> = {};
  for (const item of arsenalItems) {
    itemCounts[item] = (itemCounts[item] || 0) + 1;
  }

  const uniqueItems = [...new Set(arsenalItems)] as ItemType[];

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <h2 className={styles.title}>ᚨ АРСЕНАЛ ᚨ</h2>

        <div className={styles.info}>
          <div className={styles.infoItem}>
            🏹 Стрелы пополнены: {player.arrows}/{player.maxArrows}
          </div>
          <div className={styles.infoItem}>
            💣 Бомбы пополнены: {player.bombs}/{player.maxBombs}
          </div>
        </div>

        <div className={styles.divider} />

        <div className={styles.items}>
          {uniqueItems.map((itemType) => {
            const info = ITEM_INFO[itemType];
            if (!info) return null;

            const count = itemCounts[itemType] || 0;
            const hasItem = playerItemTypes.includes(itemType);

            return (
              <button
                key={itemType}
                className={`${styles.itemBtn} ${hasItem ? styles.owned : ''}`}
                onClick={() => takeArsenalItem(itemType)}
                disabled={!canTakeItem || hasItem}
              >
                <span className={styles.itemIcon}>{info.icon}</span>
                <div className={styles.itemInfo}>
                  <span className={styles.itemName}>
                    {info.name} {count > 1 && `(×${count})`}
                  </span>
                  <span className={styles.itemDesc}>{info.description}</span>
                </div>
                {hasItem && <span className={styles.ownedBadge}>У ВАС</span>}
              </button>
            );
          })}

          {uniqueItems.length === 0 && (
            <div className={styles.empty}>Арсенал пуст</div>
          )}
        </div>

        <div className={styles.slots}>
          Слоты: {player.inventory.length}/{player.maxInventorySlots}
        </div>

        <button className={styles.leaveBtn} onClick={leaveArsenal}>
          Уйти
        </button>
      </div>
    </div>
  );
}
