import { useState } from 'react';
import { Check, Copy } from 'lucide-react';
import { useCopy } from '@hooks/useCopy';
import styles from './CopyButton.module.css';

export interface CopyButtonProps {
  text: string;
  size?: number;
  label?: string;
  successMsg?: string;
  className?: string;
}

/**
 * 一键复制按钮 —— 点击后图标切换为✓并持续 1.5s
 */
export default function CopyButton({
  text,
  size = 14,
  label,
  successMsg,
  className,
}: CopyButtonProps) {
  const { copy } = useCopy();
  const [copied, setCopied] = useState(false);

  const handleClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const ok = await copy(text, successMsg);
    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className={[styles.btn, copied && styles.copied, className]
        .filter(Boolean)
        .join(' ')}
      aria-label="复制"
      title="点击复制"
    >
      {copied ? <Check size={size} /> : <Copy size={size} />}
      {label && <span className={styles.label}>{copied ? '已复制' : label}</span>}
    </button>
  );
}
