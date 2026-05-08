import type { CSSProperties } from 'react';
import styles from './Divider.module.css';

export interface DividerProps {
  vertical?: boolean;
  variant?: 'solid' | 'dashed' | 'dotted' | 'gradient';
  className?: string;
  style?: CSSProperties;
  spacing?: number;
}

/**
 * 装饰分割线
 */
export default function Divider({
  vertical = false,
  variant = 'solid',
  className,
  style,
  spacing = 16,
}: DividerProps) {
  const cls = [
    styles.divider,
    vertical ? styles.vertical : styles.horizontal,
    styles[`variant-${variant}`],
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const spacingStyle: CSSProperties = vertical
    ? { margin: `0 ${spacing}px` }
    : { margin: `${spacing}px 0` };

  return <span className={cls} style={{ ...spacingStyle, ...style }} />;
}
