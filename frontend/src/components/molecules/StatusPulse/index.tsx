import type { CSSProperties } from 'react';
import styles from './StatusPulse.module.css';

export type PulseStatus =
  | 'pending'
  | 'verifying'
  | 'success'
  | 'failed'
  | 'expired'
  | 'idle';

export interface StatusPulseProps {
  status?: PulseStatus;
  size?: number;
  pulse?: boolean;
  className?: string;
  style?: CSSProperties;
}

const STATUS_COLOR: Record<PulseStatus, string> = {
  pending: 'var(--info)',
  verifying: 'var(--warn)',
  success: 'var(--ok)',
  failed: 'var(--err)',
  expired: 'var(--err)',
  idle: 'var(--text-3)',
};

/**
 * StatusPulse —— 脉搏状态指示器
 * 小圆点 + 外扩光环动画
 *
 * @example
 * <StatusPulse status="success" size={10} />
 */
export default function StatusPulse({
  status = 'idle',
  size = 10,
  pulse = true,
  className,
  style,
}: StatusPulseProps) {
  const shouldPulse = pulse && status !== 'idle';

  return (
    <span
      className={[
        styles.wrap,
        shouldPulse && styles.pulsing,
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      style={
        {
          '--pulse-color': STATUS_COLOR[status],
          width: size,
          height: size,
          ...style,
        } as CSSProperties
      }
      aria-label={`status: ${status}`}
    >
      <span className={styles.dot} />
      {shouldPulse && <span className={styles.ring} />}
    </span>
  );
}
