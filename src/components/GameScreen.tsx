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
      <Header onOpenSettings={onOpenSettings} />
      <div className={styles.main}>
        <aside className={styles.sidebar}>
          <LabyrinthInfo />
        </aside>
        <div className={styles.center}>
          <EventLog />
          <div className={styles.controls}>
            <DirectionPad />
            <ActionModes />
          </div>
        </div>
        <aside className={styles.sidebar}>
          <PlayerInfo />
        </aside>
      </div>
    </div>
  );
}
