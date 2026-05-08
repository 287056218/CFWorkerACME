import type { ReactNode } from 'react';
import { motion } from 'framer-motion';
import styles from './PageShell.module.css';

export interface PageShellProps {
  children?: ReactNode;
  className?: string;
  maxWidth?: number | string;
  padded?: boolean;
}

/**
 * 页面外壳 —— 统一管理入场动画与内容边距
 */
export default function PageShell({
  children,
  className,
  maxWidth = 2560,
  padded = true,
}: PageShellProps) {
  return (
    <motion.div
      className={[styles.shell, padded && styles.padded, className]
        .filter(Boolean)
        .join(' ')}
      style={{
        maxWidth:
          typeof maxWidth === 'number' ? `${maxWidth}px` : maxWidth,
      }}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
