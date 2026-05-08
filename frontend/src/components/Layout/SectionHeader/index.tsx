import type { ReactNode } from 'react';
import styles from './SectionHeader.module.css';

export interface SectionHeaderProps {
  icon?: ReactNode;
  title: ReactNode;
  subtitle?: ReactNode;
  extra?: ReactNode;
  className?: string;
  compact?: boolean;
}

/**
 * 章节标题组件 —— 图标 + 标题 + 副标题 + 右侧操作
 */
export default function SectionHeader({
  icon,
  title,
  subtitle,
  extra,
  className,
  compact = false,
}: SectionHeaderProps) {
  return (
    <div
      className={[styles.header, compact && styles.compact, className]
        .filter(Boolean)
        .join(' ')}
    >
      <div className={styles.left}>
        {icon && <span className={styles.icon}>{icon}</span>}
        <div className={styles.textWrap}>
          <h2 className={styles.title}>{title}</h2>
          {subtitle && <div className={styles.subtitle}>{subtitle}</div>}
        </div>
      </div>
      {extra && <div className={styles.extra}>{extra}</div>}
    </div>
  );
}
