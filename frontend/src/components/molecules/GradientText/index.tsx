import type { CSSProperties, ElementType, ReactNode } from 'react';
import styles from './GradientText.module.css';

export interface GradientTextProps {
  children?: ReactNode;
  gradient?: 'brand' | 'brand-accent' | 'sunset' | 'custom';
  customGradient?: string;
  animated?: boolean;
  as?: ElementType;
  className?: string;
  style?: CSSProperties;
}

/**
 * 渐变文字 —— 使用 background-clip: text 实现
 * @example
 * <GradientText gradient="brand-accent" as="h1">CertHub</GradientText>
 */
export default function GradientText({
  children,
  gradient = 'brand',
  customGradient,
  animated = false,
  as: Component = 'span',
  className,
  style,
}: GradientTextProps) {
  const cls = [
    styles.text,
    !customGradient && styles[`g-${gradient}`],
    animated && styles.animated,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const resolvedStyle: CSSProperties = customGradient
    ? { backgroundImage: customGradient, ...style }
    : { ...style };

  return (
    <Component className={cls} style={resolvedStyle}>
      {children}
    </Component>
  );
}
