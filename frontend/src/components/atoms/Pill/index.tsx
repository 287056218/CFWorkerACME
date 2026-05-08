import { type CSSProperties, type ReactNode } from 'react';
import styles from './Pill.module.css';

export type PillVariant =
  | 'brand'
  | 'accent'
  | 'ok'
  | 'warn'
  | 'err'
  | 'info'
  | 'neutral'
  | 'sakura'
  | 'lavender'
  | 'lemon';

export type PillSize = 'xs' | 'sm' | 'md';

export interface PillProps {
  variant?: PillVariant;
  size?: PillSize;
  icon?: ReactNode;
  children?: ReactNode;
  className?: string;
  style?: CSSProperties;
  solid?: boolean; // 填充实色
  outlined?: boolean; // 仅边框
  onClick?: () => void;
}

/**
 * Pill 胶囊标签 —— CertHub 设计语言核心原子
 *
 * @example
 * <Pill variant="brand" size="sm" icon={<Check size={12} />}>已签发</Pill>
 */
export default function Pill({
  variant = 'neutral',
  size = 'sm',
  icon,
  children,
  className,
  style,
  solid = false,
  outlined = false,
  onClick,
}: PillProps) {
  const cls = [
    styles.pill,
    styles[`variant-${variant}`],
    styles[`size-${size}`],
    solid && styles.solid,
    outlined && styles.outlined,
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
