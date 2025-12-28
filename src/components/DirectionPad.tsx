import { Direction } from '@/types';
import { useGameStore } from '@/store/gameStore';
import styles from './DirectionPad.module.css';

export function DirectionPad() {
  const performAction = useGameStore((s) => s.performAction);

  const handleClick = (dir: Direction) => {
    performAction(dir);
  };

  const renderButton = (dir: Direction, icon: string) => {
    return (
      <button
        className={styles.btn}
        onClick={() => handleClick(dir)}
        title={dir}
      >
        <span className={styles.icon}>{icon}</span>
      </button>
    );
  };

  return (
    <div className={styles.container}>
      <div className={styles.row}>
        {renderButton('up', '↑')}
      </div>
      <div className={styles.row}>
        {renderButton('left', '←')}
        <div className={styles.center}>◈</div>
        {renderButton('right', '→')}
      </div>
      <div className={styles.row}>
        {renderButton('down', '↓')}
      </div>
    </div>
  );
}
