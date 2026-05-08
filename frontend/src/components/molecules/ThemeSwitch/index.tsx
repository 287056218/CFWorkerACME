import { Moon, Sun } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '@hooks/useTheme';
import styles from './ThemeSwitch.module.css';

export interface ThemeSwitchProps {
  size?: number;
  className?: string;
}

export default function ThemeSwitch({ size = 38, className }: ThemeSwitchProps) {
  const { theme, toggleTheme, isDark } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={[styles.btn, className].filter(Boolean).join(' ')}
      style={{ width: size, height: size }}
      aria-label={isDark ? '切换到白天模式' : '切换到暗黑模式'}
      title={isDark ? '切换到白天模式' : '切换到暗黑模式'}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={theme}
          className={styles.iconWrap}
          initial={{ opacity: 0, rotate: -90, scale: 0.6 }}
          animate={{ opacity: 1, rotate: 0, scale: 1 }}
          exit={{ opacity: 0, rotate: 90, scale: 0.6 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        >
          {isDark ? <Moon size={18} strokeWidth={2} /> : <Sun size={18} strokeWidth={2} />}
        </motion.span>
      </AnimatePresence>
    </button>
  );
}
