import type { CSSProperties, ReactNode } from 'react';
import { motion } from 'framer-motion';
import StatusPulse, { type PulseStatus } from '../StatusPulse';
import styles from './StatCard.module.css';

export interface StatCardProps {
  title: string;
  value: number | string;
  icon?: ReactNode;
  status?: PulseStatus;
  trend?: number[]; // sparkline 数据
  trendColor?: string;
  accent?: 'brand' | 'accent' | 'sakura' | 'lavender' | 'lemon' | 'neutral';
  hint?: string; // 副标题（如"本周新增 3"）
  onClick?: () => void;
  className?: string;
  style?: CSSProperties;
}

function Sparkline({
  data,
  color = 'var(--brand)',
  height = 24,
}: {
  data: number[];
  color?: string;
  height?: number;
}) {
  if (!data || data.length < 2) {
    return <div style={{ height }} />;
  }
  const max = Math.max(...data, 1);
  const barWidth = 100 / data.length;

  return (
    <svg
      width="100%"
      height={height}
      viewBox={`0 0 100 ${height}`}
      preserveAspectRatio="none"
      className={styles.sparkline}
    >
      {data.map((v, i) => {
        const h = Math.max(2, (v / max) * height);
        return (
          <rect
            key={i}
            x={i * barWidth + 0.5}
            y={height - h}
            width={barWidth - 1}
            height={h}
            fill={color}
            rx={1}
            opacity={0.3 + (v / max) * 0.7}
          />
        );
      })}
    </svg>
  );
}

/**
 * StatCard —— 数据统计卡
 * 包含：脉搏点 + 图标 + 标题 + 数字 + sparkline 趋势图
 */
export default function StatCard({
  title,
  value,
  icon,
  status,
  trend,
  trendColor,
  accent = 'brand',
  hint,
  onClick,
  className,
  style,
}: StatCardProps) {
  const accentVar = `var(--${accent === 'neutral' ? 'text-3' : accent})`;

  return (
    <motion.div
      className={[
        styles.card,
        styles[`accent-${accent}`],
        onClick && styles.clickable,
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      style={style}
      onClick={onClick}
      whileHover={onClick ? { y: -3 } : undefined}
      whileTap={onClick ? { scale: 0.98 } : undefined}
    >
      <div className={styles.top}>
        <div className={styles.titleRow}>
          {status && <StatusPulse status={status} size={8} />}
          {icon && <span className={styles.icon}>{icon}</span>}
          <span className={styles.title}>{title}</span>
        </div>
      </div>

      <div className={styles.bottom}>
        <div className={styles.value}>{value}</div>
        {trend && trend.length > 0 && (
          <div className={styles.trend}>
            <Sparkline data={trend} color={trendColor || accentVar} />
          </div>
        )}
      </div>

      {hint && <div className={styles.hint}>{hint}</div>}
    </motion.div>
  );
}
