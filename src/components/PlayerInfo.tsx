import { useGameStore } from '@/store/gameStore';
import { useEffect, useRef, useState } from 'react';
import styles from './SidePanel.module.css';

interface AnimatedValue {
  current: number;
  previous: number;
  changed: 'increase' | 'decrease' | null;
}

function useAnimatedValue(value: number): AnimatedValue {
  const [state, setState] = useState<AnimatedValue>({
    current: value,
    previous: value,
    changed: null,
  });
  const timeoutRef = useRef<number | null>(null);

  useEffect(() => {
    if (value !== state.current) {
      setState({
        current: value,
        previous: state.current,
        changed: value > state.current ? 'increase' : 'decrease',
      });

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = window.setTimeout(() => {
        setState((s) => ({ ...s, changed: null }));
      }, 600);
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [value, state.current]);

  return state;
}

interface IconRowProps {
  filledIcon: string;
  emptyIcon: string;
  current: number;
  max: number;
  changed: 'increase' | 'decrease' | null;
  label: string;
}

function IconRow({ filledIcon, emptyIcon, current, max, changed, label }: IconRowProps) {
  const icons = [];
  for (let i = 0; i < max; i++) {
    const isFilled = i < current;
    const isAnimating = changed && i === current - (changed === 'increase' ? 1 : 0);
    const isLost = changed === 'decrease' && i === current;

    icons.push(
      <span
        key={i}
        className={`${styles.resourceIcon} ${isFilled ? styles.resourceFilled : styles.resourceEmpty} ${isAnimating && changed === 'increase' ? styles.resourceGained : ''} ${isLost ? styles.resourceLost : ''}`}
        aria-label={isFilled ? `${label} ${i + 1}` : `Пусто ${i + 1}`}
      >
        {isFilled ? filledIcon : emptyIcon}
      </span>
    );
  }

  return <div className={styles.resourceRow}>{icons}</div>;
}

export function PlayerInfo() {
  const player = useGameStore((s) => s.player);
  const deaths = useGameStore((s) => s.deaths);
  const kills = useGameStore((s) => s.kills);

  const healthAnim = useAnimatedValue(player.health);
  const arrowsAnim = useAnimatedValue(player.arrows);
  const bombsAnim = useAnimatedValue(player.bombs);

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
        <div className={styles.resourceLabel}>Здоровье</div>
        <IconRow
          filledIcon="❤️"
          emptyIcon="🖤"
          current={player.health}
          max={player.maxHealth}
          changed={healthAnim.changed}
          label="Здоровье"
        />
      </div>

      <div className={styles.divider} />

      <div className={styles.section}>
        <div className={styles.sectionTitle}>Снаряжение</div>

        <div className={styles.resourceLabel}>Стрелы</div>
        <IconRow
          filledIcon="🏹"
          emptyIcon="○"
          current={player.arrows}
          max={player.maxArrows}
          changed={arrowsAnim.changed}
          label="Стрела"
        />

        <div className={styles.resourceLabel}>Бомбы</div>
        <IconRow
          filledIcon="💣"
          emptyIcon="○"
          current={player.bombs}
          max={player.maxBombs}
          changed={bombsAnim.changed}
          label="Бомба"
        />
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
