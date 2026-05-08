import { type CSSProperties, type ReactNode } from 'react';
import styles from './Chip.module.css';

export interface ChipProps {
  children?: ReactNode;
  icon?: ReactNode;
  className?: string;
  style?: CSSProperties;
  mono?: boolean; // 等宽字体
  ghost?: boolean; // 幽灵模式（透明背景）
  onClick?: () => void;
}

/**
 * Chip 芯片 —— 矩形圆角标签，适合展示代码片段、键值对
 *
 * @example
 * <Chip mono icon={<Hash size={12} />}>order-a1b2c3</Chip>
 */
export default function Chip({
  children,
  icon,
  className,
  style,
  mono = false,
  ghost = false,
  onClick,
}: ChipProps) {
  const cls = [
    styles.chip,
    mono && styles.mono,
    ghost && styles.ghost,
    onClick && styles.clickable,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <span className={cls} style={style} onClick={onClick}>
      {icon && <span className={styles.icon}>{icon}</span>}
      {children && <span className={styles.text}>{children}</span>}
    </span>
  );
}
