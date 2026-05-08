import type { ReactNode } from 'react';
import Kaomoji from '../Kaomoji';
import type { KaomojiMood } from '@utils/kaomoji';
import styles from './EmptyState.module.css';

export interface EmptyStateProps {
  mood?: KaomojiMood;
  title?: string;
  description?: string;
  action?: ReactNode;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

/**
 * 空状态组件 —— 大颜文字 + 标题 + 描述 + CTA
 */
export default function EmptyState({
  mood = 'empty',
  title = '这里空空如也',
  description,
  action,
  size = 'md',
  className,
}: EmptyStateProps) {
  const kaomojiSize = size === 'sm' ? 28 : size === 'lg' ? 56 : 42;

  return (
    <div
      className={[styles.wrap, styles[`size-${size}`], className]
        .filter(Boolean)
        .join(' ')}
    >
      <Kaomoji mood={mood} size={kaomojiSize} className={styles.kaomoji} />
      {title && <div className={styles.title}>{title}</div>}
      {description && <div className={styles.desc}>{description}</div>}
      {action && <div className={styles.action}>{action}</div>}
    </div>
  );
}
