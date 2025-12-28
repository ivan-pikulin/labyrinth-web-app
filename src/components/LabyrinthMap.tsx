import { useGameStore } from '@/store/gameStore';
import { Cell, Direction } from '@/types';
import { useState } from 'react';
import styles from './LabyrinthMap.module.css';

export function LabyrinthMap() {
  const labyrinth = useGameStore((s) => s.labyrinth);
  const player = useGameStore((s) => s.player);
  const monsters = useGameStore((s) => s.monsters);
  const [currentFloor, setCurrentFloor] = useState(0);

  const floor = labyrinth.cells[currentFloor];
  if (!floor) return null;

  interface IconWithTooltip {
    icon: string;
    tooltip: string;
  }

  const getCellContent = (cell: Cell): IconWithTooltip[] => {
    const icons: IconWithTooltip[] = [];

    // Player position
    if (
      player.position.x === cell.position.x &&
      player.position.y === cell.position.y &&
      player.position.z === currentFloor
    ) {
      icons.push({ icon: '🧙', tooltip: 'Герой' });
    }

    // Monsters
    const cellMonsters = monsters.filter(
      (m) =>
        m.position.x === cell.position.x &&
        m.position.y === cell.position.y &&
        m.position.z === currentFloor &&
        m.health > 0
    );
    for (const m of cellMonsters) {
      icons.push({
        icon: m.type === 'dragon' ? '🐉' : '🏹',
        tooltip: m.type === 'dragon' ? 'Дракон' : 'Лучник',
      });
    }

    // Buildings
    if (cell.building) {
      const buildingData: Record<string, { icon: string; tooltip: string }> = {
        arsenal: { icon: '🏛️', tooltip: 'Арсенал' },
        hospital: { icon: '🏥', tooltip: 'Госпиталь' },
        portal: { icon: '🌀', tooltip: 'Портал' },
        mines: { icon: '💣', tooltip: 'Минное поле' },
        lift: { icon: '🛗', tooltip: 'Лифт' },
        graveyard: { icon: '⚰️', tooltip: 'Кладбище' },
      };
      const data = buildingData[cell.building.type];
      if (data) {
        icons.push(data);
      }
    }

    // Items
    for (const item of cell.items) {
      if (item.type === 'gold') {
        icons.push({ icon: '✨', tooltip: 'Золото' });
      }
    }

    // Exit
    if (
      labyrinth.exitPosition.x === cell.position.x &&
      labyrinth.exitPosition.y === cell.position.y &&
      labyrinth.exitPosition.z === currentFloor
    ) {
      icons.push({ icon: '🚪', tooltip: 'Выход' });
    }

    return icons;
  };

  const getWallClasses = (cell: Cell) => {
    const classes: string[] = [];
    const wallDirs: Direction[] = ['up', 'right', 'down', 'left'];

    for (const dir of wallDirs) {
      const wall = cell.walls[dir];
      if (wall === 'wall' || wall === 'outer_wall') {
        classes.push(styles[`wall${dir.charAt(0).toUpperCase() + dir.slice(1)}`]);
      }
      if (wall === 'exit') {
        classes.push(styles[`exit${dir.charAt(0).toUpperCase() + dir.slice(1)}`]);
      }
    }

    return classes.join(' ');
  };

  return (
    <div className={styles.container}>
      {labyrinth.floors > 1 && (
        <div className={styles.floorSelector}>
          {Array.from({ length: labyrinth.floors }, (_, i) => (
            <button
              key={i}
              className={`${styles.floorBtn} ${currentFloor === i ? styles.active : ''}`}
              onClick={() => setCurrentFloor(i)}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}

      <div
        className={styles.grid}
        style={{
          gridTemplateColumns: `repeat(${labyrinth.width}, 1fr)`,
          gridTemplateRows: `repeat(${labyrinth.height}, 1fr)`,
        }}
      >
        {floor.map((row, y) =>
          row.map((cell, x) => {
            const icons = getCellContent(cell);
            return (
              <div key={`${x}-${y}`} className={`${styles.cell} ${getWallClasses(cell)}`}>
                <span className={styles.content}>
                  {icons.map((item, i) => (
                    <span key={i} className={styles.icon} title={item.tooltip}>
                      {item.icon}
                    </span>
                  ))}
                </span>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
