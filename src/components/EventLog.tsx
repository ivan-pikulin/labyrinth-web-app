import { useEffect, useRef } from 'react';
import { useGameStore } from '@/store/gameStore';
import styles from './EventLog.module.css';

export function EventLog() {
  const logs = useGameStore((s) => s.logs);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [logs]);

  const getLogClass = (type: string): string => {
    switch (type) {
      case 'heat':
        return styles.heat;
      case 'draft':
        return styles.draft;
      case 'gaze':
        return styles.gaze;
      case 'success':
        return styles.success;
      case 'damage':
        return styles.damage;
      case 'death':
        return styles.death;
      case 'victory':
        return styles.victory;
      case 'error':
        return styles.error;
      case 'info':
        return styles.info;
      default:
        return styles.narrative;
    }
  };

  return (
    <div className={styles.container} ref={containerRef}>
      {logs.map((log) => (
        <div key={log.id} className={`${styles.message} ${getLogClass(log.type)}`}>
          {log.text}
        </div>
      ))}
    </div>
  );
}
