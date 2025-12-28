import { useState } from 'react';
import { GameConfig } from '@/types';
import { useGameStore } from '@/store/gameStore';
import styles from './SettingsScreen.module.css';

interface Props {
  onClose: () => void;
}

export function SettingsScreen({ onClose }: Props) {
  const newGame = useGameStore((s) => s.newGame);

  const [config, setConfig] = useState<GameConfig>({
    width: 0,
    height: 0,
    floors: 0,
    playerHealth: 5,
    playerArrows: 5,
    playerBombs: 2,
    arsenalSlots: 1,
    dragonCount: 2,
    dragonHealth: 5,
    archerCount: 0,
    archerHealth: 5,
    portalCount: 5,
    mineCount: 1,
    hospitalCount: 1,
    arsenalCount: 1,
    seed: 0,
  });

  const [useSeed, setUseSeed] = useState(false);

  const handleChange = (key: keyof GameConfig, value: number) => {
    setConfig((prev) => ({ ...prev, [key]: value }));
  };

  const handleStart = () => {
    const finalConfig: GameConfig = {
      ...config,
      width: config.width === 0 ? undefined : config.width,
      height: config.height === 0 ? undefined : config.height,
      floors: config.floors === 0 ? undefined : config.floors,
      seed: useSeed && config.seed ? config.seed : undefined,
    };
    newGame(finalConfig);
    onClose();
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <h2 className={styles.title}>⚙️ Настройки игры</h2>

        <div className={styles.sections}>
          {/* Лабиринт */}
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Лабиринт</h3>

            <div className={styles.field}>
              <label>Ширина</label>
              <div className={styles.inputGroup}>
                <input
                  type="range"
                  min="0"
                  max="8"
                  value={config.width}
                  onChange={(e) => handleChange('width', Number(e.target.value))}
                />
                <span className={styles.value}>
                  {config.width === 0 ? 'Случайно' : config.width}
                </span>
              </div>
            </div>

            <div className={styles.field}>
              <label>Высота</label>
              <div className={styles.inputGroup}>
                <input
                  type="range"
                  min="0"
                  max="8"
                  value={config.height}
                  onChange={(e) => handleChange('height', Number(e.target.value))}
                />
                <span className={styles.value}>
                  {config.height === 0 ? 'Случайно' : config.height}
                </span>
              </div>
            </div>

            <div className={styles.field}>
              <label>Этажей</label>
              <div className={styles.inputGroup}>
                <input
                  type="range"
                  min="0"
                  max="3"
                  value={config.floors}
                  onChange={(e) => handleChange('floors', Number(e.target.value))}
                />
                <span className={styles.value}>
                  {config.floors === 0 ? 'Случайно' : config.floors}
                </span>
              </div>
            </div>
          </div>

          {/* Игрок */}
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Игрок</h3>

            <div className={styles.field}>
              <label>❤️ Здоровье</label>
              <div className={styles.inputGroup}>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={config.playerHealth}
                  onChange={(e) => handleChange('playerHealth', Number(e.target.value))}
                />
                <span className={styles.value}>{config.playerHealth}</span>
              </div>
            </div>

            <div className={styles.field}>
              <label>🏹 Стрелы</label>
              <div className={styles.inputGroup}>
                <input
                  type="range"
                  min="0"
                  max="20"
                  value={config.playerArrows}
                  onChange={(e) => handleChange('playerArrows', Number(e.target.value))}
                />
                <span className={styles.value}>{config.playerArrows}</span>
              </div>
            </div>

            <div className={styles.field}>
              <label>💣 Бомбы</label>
              <div className={styles.inputGroup}>
                <input
                  type="range"
                  min="0"
                  max="10"
                  value={config.playerBombs}
                  onChange={(e) => handleChange('playerBombs', Number(e.target.value))}
                />
                <span className={styles.value}>{config.playerBombs}</span>
              </div>
            </div>

            <div className={styles.field}>
              <label>🎒 Слоты инвентаря</label>
              <div className={styles.inputGroup}>
                <input
                  type="range"
                  min="1"
                  max="5"
                  value={config.arsenalSlots}
                  onChange={(e) => handleChange('arsenalSlots', Number(e.target.value))}
                />
                <span className={styles.value}>{config.arsenalSlots}</span>
              </div>
            </div>
          </div>

          {/* Монстры */}
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Монстры</h3>

            <div className={styles.field}>
              <label>🐉 Драконы</label>
              <div className={styles.inputGroup}>
                <input
                  type="range"
                  min="0"
                  max="10"
                  value={config.dragonCount}
                  onChange={(e) => handleChange('dragonCount', Number(e.target.value))}
                />
                <span className={styles.value}>{config.dragonCount}</span>
              </div>
            </div>

            <div className={styles.field}>
              <label>❤️ HP дракона</label>
              <div className={styles.inputGroup}>
                <input
                  type="range"
                  min="1"
                  max="20"
                  value={config.dragonHealth}
                  onChange={(e) => handleChange('dragonHealth', Number(e.target.value))}
                />
                <span className={styles.value}>{config.dragonHealth}</span>
              </div>
            </div>

            <div className={styles.field}>
              <label>🏹 Лучники</label>
              <div className={styles.inputGroup}>
                <input
                  type="range"
                  min="0"
                  max="10"
                  value={config.archerCount}
                  onChange={(e) => handleChange('archerCount', Number(e.target.value))}
                />
                <span className={styles.value}>{config.archerCount}</span>
              </div>
            </div>

            <div className={styles.field}>
              <label>❤️ HP лучника</label>
              <div className={styles.inputGroup}>
                <input
                  type="range"
                  min="1"
                  max="20"
                  value={config.archerHealth}
                  onChange={(e) => handleChange('archerHealth', Number(e.target.value))}
                />
                <span className={styles.value}>{config.archerHealth}</span>
              </div>
            </div>
          </div>

          {/* Здания */}
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Здания</h3>

            <div className={styles.field}>
              <label>🌀 Порталы</label>
              <div className={styles.inputGroup}>
                <input
                  type="range"
                  min="0"
                  max="10"
                  value={config.portalCount}
                  onChange={(e) => handleChange('portalCount', Number(e.target.value))}
                />
                <span className={styles.value}>{config.portalCount}</span>
              </div>
            </div>

            <div className={styles.field}>
              <label>💣 Мины</label>
              <div className={styles.inputGroup}>
                <input
                  type="range"
                  min="0"
                  max="5"
                  value={config.mineCount}
                  onChange={(e) => handleChange('mineCount', Number(e.target.value))}
                />
                <span className={styles.value}>{config.mineCount}</span>
              </div>
            </div>

            <div className={styles.field}>
              <label>🏛️ Арсеналы</label>
              <div className={styles.inputGroup}>
                <input
                  type="range"
                  min="0"
                  max="3"
                  value={config.arsenalCount}
                  onChange={(e) => handleChange('arsenalCount', Number(e.target.value))}
                />
                <span className={styles.value}>{config.arsenalCount}</span>
              </div>
            </div>

            <div className={styles.field}>
              <label>🏥 Госпитали</label>
              <div className={styles.inputGroup}>
                <input
                  type="range"
                  min="0"
                  max="3"
                  value={config.hospitalCount}
                  onChange={(e) => handleChange('hospitalCount', Number(e.target.value))}
                />
                <span className={styles.value}>{config.hospitalCount}</span>
              </div>
            </div>
          </div>

          {/* Seed */}
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Seed</h3>

            <div className={styles.checkboxField}>
              <label>
                <input
                  type="checkbox"
                  checked={useSeed}
                  onChange={(e) => setUseSeed(e.target.checked)}
                />
                Использовать seed
              </label>
            </div>

            {useSeed && (
              <div className={styles.field}>
                <label>Значение seed</label>
                <input
                  type="number"
                  className={styles.numberInput}
                  value={config.seed}
                  onChange={(e) => handleChange('seed', Number(e.target.value))}
                  placeholder="Введите число"
                />
              </div>
            )}
          </div>
        </div>

        <div className={styles.buttons}>
          <button className={styles.cancelBtn} onClick={onClose}>
            Отмена
          </button>
          <button className={styles.startBtn} onClick={handleStart}>
            🎮 Начать игру
          </button>
        </div>
      </div>
    </div>
  );
}
