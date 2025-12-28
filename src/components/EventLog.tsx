import { useEffect, useRef } from 'react';
import { useGameStore } from '@/store/gameStore';
import styles from './EventLog.module.css';

const LOG_ICONS: Record<string, string> = {
  heat: '🔥',
  draft: '❄',
  gaze: '👁',
  success: '✦',
  damage: '⚔',
  death: '💀',
  victory: '👑',
  error: '⚠',
  info: '◈',
  narrative: '›',
};

export function EventLog() {
  const logs = useGameStore((s) => s.logs);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [logs]);

  const getLogClass = (type: string): string => {
    const classMap: Record<string, string> = {
      heat: styles.heat,
      draft: styles.draft,
      gaze: styles.gaze,
      success: styles.success,
      damage: styles.damage,
      death: styles.death,
      victory: styles.victory,
      error: styles.error,
      info: styles.info,
    };
    return classMap[type] || styles.narrative;
  };

  return (
    <div className={styles.scroll}>
      {/* Scroll top decoration */}
      <div className={styles.scrollTop} aria-hidden="true">
        <span className={styles.scrollEdge} />
        <div className={styles.scrollHeader}>
          <span className={styles.scrollRune}>ᛗ</span>
          <span className={styles.scrollTitle}>Хроники</span>
          <span className={styles.scrollRune}>ᛗ</span>
        </div>
        <span className={styles.scrollEdge} />
      </div>

      {/* Scroll content */}
      <div className={styles.scrollBody}>
        <div className={styles.scrollContent} ref={containerRef}>
          {logs.length === 0 ? (
            <div className={styles.empty}>
              <span className={styles.emptyIcon}>◈</span>
              <span className={styles.emptyText}>Странствие начинается...</span>
            </div>
          ) : (
            logs.map((log, index) => (
              <div
                key={log.id}
                className={`${styles.message} ${getLogClass(log.type)}`}
                style={{ animationDelay: `${Math.min(index * 0.02, 0.3)}s` }}
              >
                <span className={styles.messageIcon}>
                  {LOG_ICONS[log.type] || LOG_ICONS.narrative}
                </span>
                <span className={styles.messageText}>{log.text}</span>
              </div>
            ))
          )}
        </div>

        {/* Fade overlay at top */}
        <div className={styles.fadeTop} aria-hidden="true" />
      </div>

      {/* Scroll bottom decoration */}
      <div className={styles.scrollBottom} aria-hidden="true">
        <span className={styles.scrollEdge} />
        <span className={styles.scrollCorner}>◈</span>
        <span className={styles.scrollEdge} />
      </div>
    </div>
  );
}
