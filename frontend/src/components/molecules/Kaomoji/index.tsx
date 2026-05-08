import type { CSSProperties } from 'react';
import { useKaomoji } from '@hooks/useKaomoji';
import type { KaomojiMood } from '@utils/kaomoji';
import styles from './Kaomoji.module.css';

export interface KaomojiProps {
  mood?: KaomojiMood;
  text?: string; // 手动指定，优先级高于 mood
  seed?: string | number; // 稳定 seed
  size?: number | string;
  color?: string;
  inline?: boolean;
  className?: string;
  style?: CSSProperties;
}

/**
 * 颜文字组件 —— CertHub 的可爱点缀
 * @example
 * <Kaomoji mood="success" size={24} />
 * <Kaomoji text="(´･ω･`)" />
 */
export default function Kaomoji({
  mood = 'happy',
  text,
  seed,
  size,
  color,
  inline = false,
  className,
  style,
}: KaomojiProps) {
  const fallback = useKaomoji(mood, seed);
  const display = text || fallback;

  return (
    <span
      className={[styles.kaomoji, inline && styles.inline, className]
        .filter(Boolean)
        .join(' ')}
      style={{
        fontSize: typeof size === 'number' ? `${size}px` : size,
        color,
        ...style,
      }}
      aria-hidden="true"
    >
      {display}
    </span>
  );
}
