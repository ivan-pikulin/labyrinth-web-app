import { Header } from './Header';
import { EventLog } from './EventLog';
import { DirectionPad } from './DirectionPad';
import { ActionModes } from './ActionModes';
import { LabyrinthInfo } from './LabyrinthInfo';
import { PlayerInfo } from './PlayerInfo';
import styles from './GameScreen.module.css';

interface Props {
  onOpenSettings: () => void;
}

export function GameScreen({ onOpenSettings }: Props) {
  return (
    <div className={styles.container}>
      {/* Atmospheric background layers */}
      <div className={styles.bgVoid} aria-hidden="true" />
      <div className={styles.bgTexture} aria-hidden="true" />
      <div className={styles.bgVignette} aria-hidden="true" />

      {/* Main content */}
      <div className={styles.content}>
        <Header onOpenSettings={onOpenSettings} />

        <main className={styles.main}>
          <aside className={styles.sidebar} data-position="left">
            <LabyrinthInfo />
          </aside>

          <div className={styles.center}>
            <EventLog />
            <div className={styles.controls}>
              <DirectionPad />
              <ActionModes />
            </div>
          </div>

          <aside className={styles.sidebar} data-position="right">
            <PlayerInfo />
          </aside>
        </main>
      </div>

      {/* Corner runes */}
      <span className={styles.cornerRune} data-corner="tl" aria-hidden="true">ᚠ</span>
      <span className={styles.cornerRune} data-corner="tr" aria-hidden="true">ᚢ</span>
      <span className={styles.cornerRune} data-corner="bl" aria-hidden="true">ᚦ</span>
      <span className={styles.cornerRune} data-corner="br" aria-hidden="true">ᚨ</span>
    </div>
  );
}
