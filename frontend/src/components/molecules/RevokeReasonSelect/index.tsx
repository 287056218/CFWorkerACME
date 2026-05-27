import { useMemo, useState } from 'react';
import { Radio } from 'antd';
import { REVOKE_REASON_OPTIONS, RevokeReason } from '@api/order';
import styles from './RevokeReasonSelect.module.css';

export interface RevokeReasonSelectProps {
  /** 初始选中原因，默认 Unspecified(0) */
  defaultValue?: RevokeReason;
  /** 选择变化回调 */
  onChange: (reason: RevokeReason) => void;
}

/**
 * 证书吊销原因选择器
 * 提供单选按钮组 + 当前选项说明
 */
export default function RevokeReasonSelect({
  defaultValue = RevokeReason.Unspecified,
  onChange,
}: RevokeReasonSelectProps) {
  const [value, setValue] = useState<RevokeReason>(defaultValue);

  const currentDesc = useMemo(() => {
    const found = REVOKE_REASON_OPTIONS.find((o) => o.value === value);
    return found?.desc || '';
  }, [value]);

  return (
    <div className={styles.wrap}>
      <div className={styles.label}>吊销原因（可选）</div>
      <Radio.Group
        value={value}
        onChange={(e) => {
          setValue(e.target.value);
          onChange(e.target.value);
        }}
      >
        {REVOKE_REASON_OPTIONS.map((o) => (
          <Radio key={o.value} value={o.value} style={{ display: 'block', marginBottom: 4 }}>
            {o.label}
          </Radio>
        ))}
      </Radio.Group>
      {currentDesc && <div className={styles.desc}>{currentDesc}</div>}
    </div>
  );
}
