import { type CSSProperties, type ReactNode } from 'react';
import styles from './CodeInline.module.css';

export interface CodeInlineProps {
  children?: ReactNode;
  color?: 'default' | 'brand' | 'accent' | 'sakura' | 'lavender';
  className?: string;
  style?: CSSProperties;
  onClick?: () => void;
}

/**
 * 内联代码标签 —— 等宽字体 + 浅色背景 + 圆角
 *
 * @example
 * <CodeInline>acme@certhub</CodeInline>
 */
export default function CodeInline({
  children,
  color = 'default',
  className,
  style,
  onClick,
}: CodeInlineProps) {
  const cls = [
    styles.code,
    styles[`color-${color}`],
    onClick && styles.clickable,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <code className={cls} style={style} onClick={onClick}>
      {children}
    </code>
  );
}
