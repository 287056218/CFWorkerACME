import type { CSSProperties } from 'react';
import styles from './Dot.module.css';

export interface DotProps {
  color?:
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
  size?: number;
  className?: string;
  style?: CSSProperties;
}

const COLOR_MAP: Record<NonNullable<DotProps['color']>, string> = {
  brand: 'var(--brand)',
  accent: 'var(--accent)',
  ok: 'var(--ok)',
  warn: 'var(--warn)',
  err: 'var(--err)',
  info: 'var(--info)',
  neutral: 'var(--text-3)',
  sakura: 'var(--sakura)',
  lavender: 'var(--lavender)',
  lemon: 'var(--lemon)',
};

/**
 * 简单圆点（不带脉搏动画）
 */
export default function Dot({
  color = 'brand',
  size = 8,
  className,
  style,
}: DotProps) {
  return (
    <span
      className={[styles.dot, className].filter(Boolean).join(' ')}
      style={{
        width: size,
        height: size,
        backgroundColor: COLOR_MAP[color],
        ...style,
      }}
    />
  );
}
