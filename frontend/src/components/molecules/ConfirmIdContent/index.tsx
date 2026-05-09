import { useEffect, useState } from 'react';
import { Check, Copy } from 'lucide-react';
import { Input } from 'antd';
import { useCopy } from '@hooks/useCopy';
import styles from './ConfirmIdContent.module.css';

export interface ConfirmIdContentProps {
  /** 要求用户输入的目标 ID（通常是订单/证书 UUID） */
  expectId: string;
  /** 输入匹配状态变化回调（用于控制外部按钮 disabled） */
  onMatchChange: (matched: boolean) => void;
  /** 提示语，默认为“请输入完整的订单 ID 以确认操作” */
  hint?: string;
  /** 标签文案，默认为“证书 ID” */
  idLabel?: string;
}

/**
 * 通用的“输入 ID 确认”弹窗内容
 * 显示完整 UUID + 一键复制，要求用户手动输入 ID 才能确认
 */
export default function ConfirmIdContent({
  expectId,
  onMatchChange,
  hint,
  idLabel = '订单 ID',
}: ConfirmIdContentProps) {
  const { copy } = useCopy();
  const [value, setValue] = useState('');
  const [copied, setCopied] = useState(false);

  const matched = value.trim() === expectId;

  useEffect(() => {
    onMatchChange(matched);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [matched]);

  const handleCopy = async () => {
    const ok = await copy(expectId, `${idLabel}已复制`);
    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }
  };

  return (
    <div className={styles.wrap}>
      <div className={styles.hint}>
        {hint || `为了避免误操作，请输入完整的${idLabel}以确认操作。`}
      </div>
      <div className={styles.box}>
        <code className={styles.code}>{expectId}</code>
        <button
          type="button"
          className={[styles.copyBtn, copied && styles.copyBtnDone]
            .filter(Boolean)
            .join(' ')}
          onClick={handleCopy}
          title={`一键复制${idLabel}`}
        >
          {copied ? <Check size={14} /> : <Copy size={14} />}
          <span>{copied ? '已复制' : '复制'}</span>
        </button>
      </div>
      <Input
        autoFocus
        placeholder={`粘贴或输入上方${idLabel}`}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        status={value && !matched ? 'error' : undefined}
        allowClear
      />
      {value && !matched && (
        <div className={styles.error}>ID 不匹配，请检查后重试</div>
      )}
    </div>
  );
}
