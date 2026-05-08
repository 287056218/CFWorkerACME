import type { ReactNode } from 'react';
import styles from './TerminalPrompt.module.css';

export interface TerminalPromptProps {
  user?: string;
  host?: string;
  path?: string;
  symbol?: string;
  showCursor?: boolean;
  suffix?: ReactNode;
  className?: string;
}

/**
 * 终端提示符 —— `user@host:~/path $ _`
 * CertHub 设计语言核心分子
 */
export default function TerminalPrompt({
  user = 'acme',
  host = 'certhub',
  path = '~',
  symbol = '$',
  showCursor = true,
  suffix,
  className,
}: TerminalPromptProps) {
  return (
    <div
      className={[styles.prompt, className].filter(Boolean).join(' ')}
      aria-label={`terminal prompt ${user}@${host}:${path}`}
    >
      <span className={styles.user}>{user}</span>
      <span className={styles.at}>@</span>
      <span className={styles.host}>{host}</span>
      <span className={styles.colon}>:</span>
      <span className={styles.path}>{path}</span>
      <span className={styles.symbol}>&nbsp;{symbol}&nbsp;</span>
      {suffix && <span className={styles.suffix}>{suffix}</span>}
      {showCursor && <span className={styles.cursor}>▊</span>}
    </div>
  );
}
