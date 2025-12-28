import { useState } from 'react';
import { Header } from './Header';
import { EventLog } from './EventLog';
import { DirectionPad } from './DirectionPad';
import { ActionModes } from './ActionModes';
import { LabyrinthInfo } from './LabyrinthInfo';
import { PlayerInfo } from './PlayerInfo';
import { BurgerMenu } from './BurgerMenu';
import styles from './GameScreen.module.css';

interface Props {
  onOpenSettings: () => void;
}

export function GameScreen({ onOpenSettings }: Props) {
  const [mobilePanel, setMobilePanel] = useState<'labyrinth' | 'player' | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const closePanel = () => setMobilePanel(null);

  return (
    <div className={styles.container}>
      {/* Atmospheric background layers */}
      <div className={styles.bgVoid} aria-hidden="true" />
      <div className={styles.bgTexture} aria-hidden="true" />
      <div className={styles.bgVignette} aria-hidden="true" />

      {/* Burger menu */}
      <BurgerMenu
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        onNewGame={onOpenSettings}
      />

      {/* Main content */}
      <div className={styles.content}>
        <Header onMenuOpen={() => setIsMenuOpen(true)} />

        <main className={styles.main}>
          <aside className={styles.sidebar} data-position="left">
            <LabyrinthInfo />
          </aside>

          <div className={styles.center}>
            <EventLog />
            <div className={styles.controls}>
              <DirectionPad
                onOpenLabyrinthInfo={() => setMobilePanel('labyrinth')}
                onOpenPlayerInfo={() => setMobilePanel('player')}
              />
              <ActionModes />
            </div>
          </div>

          <aside className={styles.sidebar} data-position="right">
            <PlayerInfo />
          </aside>
        </main>
      </div>

      {/* Mobile panel overlay */}
      {mobilePanel && (
        <div className={styles.mobileOverlay} onClick={closePanel}>
          <div
            className={styles.mobilePanel}
            onClick={(e) => e.stopPropagation()}
            data-panel={mobilePanel}
          >
            <button className={styles.mobilePanelClose} onClick={closePanel}>
              <span>✕</span>
            </button>
            {mobilePanel === 'labyrinth' ? <LabyrinthInfo /> : <PlayerInfo />}
          </div>
        </div>
      )}

      {/* Corner runes */}
      <span className={styles.cornerRune} data-corner="tl" aria-hidden="true">ᚠ</span>
      <span className={styles.cornerRune} data-corner="tr" aria-hidden="true">ᚢ</span>
      <span className={styles.cornerRune} data-corner="bl" aria-hidden="true">ᚦ</span>
      <span className={styles.cornerRune} data-corner="br" aria-hidden="true">ᚨ</span>
    </div>
  );
}
