import { useState } from 'react';
import { GameConfig, Range } from '@/types';
import { useGameStore } from '@/store/gameStore';
import styles from './SettingsScreen.module.css';

type SettingsTab = 'labyrinth' | 'player' | 'monsters' | 'buildings';

interface TabConfig {
  id: SettingsTab;
  label: string;
  icon: string;
}

const TABS: TabConfig[] = [
  { id: 'labyrinth', label: 'Лабиринт', icon: '🏛️' },
  { id: 'player', label: 'Игрок', icon: '⚔️' },
  { id: 'monsters', label: 'Монстры', icon: '🐉' },
  { id: 'buildings', label: 'Здания', icon: '🏰' },
];

interface RangeValue {
  min: number;
  max: number;
  useRange: boolean;
}

interface Props {
  onClose: () => void;
}

export function SettingsScreen({ onClose }: Props) {
  const newGame = useGameStore((s) => s.newGame);
  const [activeTab, setActiveTab] = useState<SettingsTab>('labyrinth');

  // Range values for labyrinth dimensions
  const [widthRange, setWidthRange] = useState<RangeValue>({ min: 3, max: 6, useRange: true });
  const [heightRange, setHeightRange] = useState<RangeValue>({ min: 3, max: 6, useRange: true });
  const [floorsRange, setFloorsRange] = useState<RangeValue>({ min: 1, max: 2, useRange: true });

  const [config, setConfig] = useState<Omit<GameConfig, 'width' | 'height' | 'floors'>>({
    playerHealth: 5,
    playerArrows: 5,
    playerBombs: 2,
    arsenalSlots: 1,
    dragonCount: undefined, // auto
    dragonHealth: 5,
    archerCount: undefined, // auto
    archerHealth: 5,
    portalCount: undefined, // auto
    mineCount: undefined, // auto
    hospitalCount: 1,
    arsenalCount: 1,
  });

  const handleChange = (key: keyof typeof config, value: number | undefined) => {
    setConfig((prev) => ({ ...prev, [key]: value }));
  };

  const handleRangeChange = (
    setter: React.Dispatch<React.SetStateAction<RangeValue>>,
    field: 'min' | 'max',
    value: number
  ) => {
    setter((prev) => {
      const newValue = { ...prev, [field]: value };
      // Ensure min <= max
      if (field === 'min' && value > prev.max) {
        newValue.max = value;
      } else if (field === 'max' && value < prev.min) {
        newValue.min = value;
      }
      return newValue;
    });
  };

  const toggleRangeMode = (setter: React.Dispatch<React.SetStateAction<RangeValue>>) => {
    setter((prev) => ({
      ...prev,
      useRange: !prev.useRange,
      // When switching to single value, use min as the value
      max: prev.useRange ? prev.min : prev.max,
    }));
  };

  const getRangeOrValue = (range: RangeValue): number | Range | undefined => {
    if (range.useRange) {
      return { min: range.min, max: range.max };
    }
    return range.min;
  };

  const handleStart = () => {
    const finalConfig: GameConfig = {
      ...config,
      width: getRangeOrValue(widthRange),
      height: getRangeOrValue(heightRange),
      floors: getRangeOrValue(floorsRange),
    };
    newGame(finalConfig);
    onClose();
  };

  const renderRangeField = (
    label: string,
    range: RangeValue,
    setter: React.Dispatch<React.SetStateAction<RangeValue>>,
    minLimit: number,
    maxLimit: number
  ) => (
    <div className={styles.field}>
      <div className={styles.fieldHeader}>
        <label>{label}</label>
        <button
          className={`${styles.rangeToggle} ${range.useRange ? styles.rangeToggleActive : ''}`}
          onClick={() => toggleRangeMode(setter)}
          type="button"
        >
          {range.useRange ? '↔️' : '•'}
        </button>
      </div>
      {range.useRange ? (
        <div className={styles.rangeInputs}>
          <div className={styles.rangeBound}>
            <span className={styles.boundLabel}>от</span>
            <input
              type="range"
              min={minLimit}
              max={maxLimit}
              value={range.min}
              onChange={(e) =>
                handleRangeChange(setter, 'min', Number(e.target.value))
              }
            />
            <span className={styles.boundValue}>{range.min}</span>
          </div>
          <div className={styles.rangeBound}>
            <span className={styles.boundLabel}>до</span>
            <input
              type="range"
              min={minLimit}
              max={maxLimit}
              value={range.max}
              onChange={(e) =>
                handleRangeChange(setter, 'max', Number(e.target.value))
              }
            />
            <span className={styles.boundValue}>{range.max}</span>
          </div>
        </div>
      ) : (
        <div className={styles.inputGroup}>
          <input
            type="range"
            min={minLimit}
            max={maxLimit}
            value={range.min}
            onChange={(e) => setter((prev) => ({ ...prev, min: Number(e.target.value), max: Number(e.target.value) }))}
          />
          <span className={styles.value}>{range.min}</span>
        </div>
      )}
    </div>
  );

  const renderAutoField = (
    label: string,
    key: keyof typeof config,
    min: number,
    max: number
  ) => {
    const value = config[key];
    const isAuto = value === undefined;

    return (
      <div className={styles.field}>
        <div className={styles.fieldHeader}>
          <label>{label}</label>
          <button
            className={`${styles.autoToggle} ${isAuto ? styles.autoToggleActive : ''}`}
            onClick={() => handleChange(key, isAuto ? Math.floor((min + max) / 2) : undefined)}
            type="button"
          >
            {isAuto ? 'Авто' : 'Ручн.'}
          </button>
        </div>
        {!isAuto && (
          <div className={styles.inputGroup}>
            <input
              type="range"
              min={min}
              max={max}
              value={value}
              onChange={(e) => handleChange(key, Number(e.target.value))}
            />
            <span className={styles.value}>{value}</span>
          </div>
        )}
        {isAuto && (
          <div className={styles.autoHint}>
            Количество определяется размером лабиринта
          </div>
        )}
      </div>
    );
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'labyrinth':
        return (
          <div className={styles.tabContent}>
            {renderRangeField('Ширина', widthRange, setWidthRange, 2, 8)}
            {renderRangeField('Высота', heightRange, setHeightRange, 2, 8)}
            {renderRangeField('Этажей', floorsRange, setFloorsRange, 1, 3)}
          </div>
        );

      case 'player':
        return (
          <div className={styles.tabContent}>
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
        );

      case 'monsters':
        return (
          <div className={styles.tabContent}>
            {renderAutoField('🐉 Драконы', 'dragonCount', 0, 10)}

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

            {renderAutoField('🏹 Лучники', 'archerCount', 0, 10)}

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
        );

      case 'buildings':
        return (
          <div className={styles.tabContent}>
            {renderAutoField('🌀 Порталы', 'portalCount', 0, 10)}
            {renderAutoField('💣 Мины', 'mineCount', 0, 5)}

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
        );
    }
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        {/* Header */}
        <div className={styles.header}>
          <h2 className={styles.title}>
            <span className={styles.titleIcon}>⚙️</span>
            Настройки игры
          </h2>
          <button className={styles.closeBtn} onClick={onClose} aria-label="Закрыть">
            ✕
          </button>
        </div>

        {/* Tabs */}
        <div className={styles.tabs}>
          {TABS.map((tab) => (
            <button
              key={tab.id}
              className={`${styles.tab} ${activeTab === tab.id ? styles.tabActive : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <span className={styles.tabIcon}>{tab.icon}</span>
              <span className={styles.tabLabel}>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Content */}
        <div className={styles.content}>
          {renderTabContent()}
        </div>

        {/* Footer */}
        <div className={styles.footer}>
          <button className={styles.cancelBtn} onClick={onClose}>
            Отмена
          </button>
          <button className={styles.startBtn} onClick={handleStart}>
            Начать игру
          </button>
        </div>
      </div>
    </div>
  );
}
