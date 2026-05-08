import type { ReactNode } from 'react';
import styles from './Kbd.module.css';

export interface KbdProps {
  children?: ReactNode;
  className?: string;
}

/**
 * 键盘按键样式 —— 模拟物理按键的浮起感
 * @example
 * <Kbd>⌘</Kbd> + <Kbd>K</Kbd>
 */
export default function Kbd({ children, className }: KbdProps) {
  return (
    <kbd className={[styles.kbd, className].filter(Boolean).join(' ')}>
      {children}
    </kbd>
  );
}
