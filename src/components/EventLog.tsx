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
  const turn = useGameStore((s) => s.turn);
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
    <div className={styles.chat}>
      {/* Chat header */}
      <div className={styles.chatHeader}>
        <span className={styles.headerLine} />
        <div className={styles.headerContent}>
          <span className={styles.headerRune}>ᛗ</span>
          <span className={styles.headerTitle}>
            Хроники
            <span className={styles.headerDay}>— день {turn + 1}</span>
          </span>
          <span className={styles.headerRune}>ᛗ</span>
        </div>
        <span className={styles.headerLine} />
      </div>

      {/* Chat messages */}
      <div className={styles.chatBody}>
        <div className={styles.chatMessages} ref={containerRef}>
          {logs.length === 0 ? (
            <div className={styles.empty}>
              <span className={styles.emptyIcon}>◈</span>
              <span className={styles.emptyText}>Странствие начинается...</span>
            </div>
          ) : (
            logs.map((log, index) => {
              const isPlayer = log.sender === 'player';
              const isSpecial = log.type === 'death' || log.type === 'victory';

              return (
                <div
                  key={log.id}
                  className={`
                    ${styles.message}
                    ${getLogClass(log.type)}
                    ${isPlayer ? styles.playerMessage : styles.gameMessage}
                    ${isSpecial ? styles.specialMessage : ''}
                  `}
                  style={{ animationDelay: `${Math.min(index * 0.02, 0.3)}s` }}
                >
                  {!isPlayer && !isSpecial && (
                    <span className={styles.messageIcon}>
                      {LOG_ICONS[log.type] || LOG_ICONS.narrative}
                    </span>
                  )}
                  {isSpecial && (
                    <span className={styles.messageIcon}>
                      {LOG_ICONS[log.type]}
                    </span>
                  )}
                  <span className={styles.messageText}>{log.text}</span>
                </div>
              );
            })
          )}
        </div>

        {/* Fade overlay at top */}
        <div className={styles.fadeTop} aria-hidden="true" />
      </div>

      {/* Chat footer */}
      <div className={styles.chatFooter} aria-hidden="true">
        <span className={styles.headerLine} />
        <span className={styles.footerCorner}>◈</span>
        <span className={styles.headerLine} />
      </div>
    </div>
  );
}
