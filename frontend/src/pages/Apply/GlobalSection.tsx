import { Segmented, Switch } from 'antd';
import { Cpu, Shield, ZapOff } from 'lucide-react';
import SectionHeader from '@components/Layout/SectionHeader';
import { SIGN_OPTIONS, TYPE_OPTIONS } from '@utils/constants';
import styles from './Apply.module.css';

export interface GlobalSectionProps {
  ca: string;
  autoRenew: boolean;
  encryption: string;
  onChange: (key: string, value: any) => void;
}

export default function GlobalSection({
  ca,
  autoRenew,
  encryption,
  onChange,
}: GlobalSectionProps) {
  return (
    <div className={styles.section}>
      <SectionHeader
        title="全局设置"
        subtitle="选择证书厂商、加密算法和自动续期选项"
      />

      {/* 厂商大卡片 Radio */}
      <div className={styles.field}>
        <label className={styles.fieldLabel}>
          <Shield size={13} /> 证书厂商
        </label>
        <div className={styles.caGrid}>
          {SIGN_OPTIONS.map((opt) => (
            <button
              type="button"
              key={opt.value}
              onClick={() => onChange('ca', opt.value)}
              className={[
                styles.caCard,
                ca === opt.value && styles.caCardActive,
              ]
                .filter(Boolean)
                .join(' ')}
            >
              <div className={styles.caCardTitle}>{opt.label}</div>
              <div className={styles.caCardDesc}>{opt.desc}</div>
              {ca === opt.value && (
                <div className={styles.caCardMark}>✓</div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* 算法 */}
      <div className={styles.field}>
        <label className={styles.fieldLabel}>
          <Cpu size={13} /> 加密算法
        </label>
        <Segmented
          options={TYPE_OPTIONS.map((t) => ({
            label: (
              <div className={styles.algoOption}>
                <span className={styles.algoName}>{t.label}</span>
                <span className={styles.algoDesc}>{t.desc}</span>
              </div>
            ),
            value: t.value,
          }))}
          value={encryption}
          onChange={(v) => onChange('encryption', v)}
          block
          size="large"
        />
      </div>

      {/* 自动续期 */}
      <div className={styles.field}>
        <div className={styles.renewRow}>
          <div>
            <div className={styles.renewTitle}>
              <ZapOff size={14} /> 自动续期
            </div>
            <div className={styles.renewDesc}>
              到期前 7 天自动续期证书，避免中断服务
            </div>
          </div>
          <Switch
            checked={autoRenew}
            onChange={(c) => onChange('auto_renew', c)}
          />
        </div>
      </div>
    </div>
  );
}
