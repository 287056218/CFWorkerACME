import { Input } from 'antd';
import { Building2, Flag, Info, MapPin, Users } from 'lucide-react';
import SectionHeader from '@components/Layout/SectionHeader';
import Kaomoji from '@components/molecules/Kaomoji';
import styles from './Apply.module.css';

interface SubjectState {
  country?: string;
  province?: string;
  city?: string;
  organization?: string;
  unit?: string;
}

export interface SubjectSectionProps {
  subject: SubjectState;
  onChange: (key: string, value: string) => void;
}

const FIELDS: Array<{
  key: keyof SubjectState;
  label: string;
  placeholder: string;
  icon: React.ReactNode;
}> = [
  {
    key: 'country',
    label: '国家代码',
    placeholder: '如：CN（2 字母 ISO 代码）',
    icon: <Flag size={13} />,
  },
  {
    key: 'province',
    label: '省份',
    placeholder: '如：Beijing',
    icon: <MapPin size={13} />,
  },
  {
    key: 'city',
    label: '城市',
    placeholder: '如：Beijing',
    icon: <MapPin size={13} />,
  },
  {
    key: 'organization',
    label: '组织',
    placeholder: '如：Basic, Ltd.',
    icon: <Building2 size={13} />,
  },
  {
    key: 'unit',
    label: '部门',
    placeholder: '如：Engineering',
    icon: <Users size={13} />,
  },
];

export default function SubjectSection({
  subject,
  onChange,
}: SubjectSectionProps) {
  return (
    <div className={styles.section}>
      <SectionHeader
        title="主体信息（可选）"
        subtitle="证书使用者的组织机构信息，可全部留空"
      />

      <div className={styles.hintBox}>
        <Info size={14} />
        <span>
          主体信息为可选填写项，部分厂商（如 Let&apos;s Encrypt）会忽略此字段。{' '}
          <Kaomoji mood="happy" inline size={12} />
        </span>
      </div>

      <div className={styles.subjectGrid}>
        {FIELDS.map((f) => (
          <div key={f.key} className={styles.field}>
            <label className={styles.fieldLabel}>
              {f.icon}
              <span>{f.label}</span>
            </label>
            <Input
              size="large"
              value={subject[f.key] || ''}
              onChange={(e) => onChange(f.key, e.target.value)}
              placeholder={f.placeholder}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
