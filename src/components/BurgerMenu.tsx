import styles from './BurgerMenu.module.css';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onNewGame: () => void;
}

export function BurgerMenu({ isOpen, onClose, onNewGame }: Props) {
  if (!isOpen) return null;

  const handleNewGame = () => {
    onNewGame();
    onClose();
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <nav
        className={styles.menu}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Menu header */}
        <div className={styles.menuHeader}>
          <span className={styles.menuRune}>ᛗ</span>
          <span className={styles.menuTitle}>Меню</span>
          <span className={styles.menuRune}>ᛗ</span>
        </div>

        {/* Menu items */}
        <div className={styles.menuItems}>
          <button className={styles.menuItem} onClick={handleNewGame}>
            <span className={styles.menuItemIcon}>⚔</span>
            <span className={styles.menuItemText}>Новая игра</span>
          </button>

          <button className={styles.menuItem} onClick={onClose}>
            <span className={styles.menuItemIcon}>↩</span>
            <span className={styles.menuItemText}>Вернуться к игре</span>
          </button>
        </div>

        {/* Menu footer decoration */}
        <div className={styles.menuFooter}>
          <span className={styles.footerLine} />
          <span className={styles.footerRune}>◈</span>
          <span className={styles.footerLine} />
        </div>
      </nav>
    </div>
  );
}

interface BurgerButtonProps {
  onClick: () => void;
}

export function BurgerButton({ onClick }: BurgerButtonProps) {
  return (
    <button
      className={styles.burgerBtn}
      onClick={onClick}
      aria-label="Открыть меню"
      title="Меню"
    >
      <span className={styles.burgerLine} />
      <span className={styles.burgerLine} />
      <span className={styles.burgerLine} />
    </button>
  );
}
