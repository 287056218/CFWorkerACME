import { Input, Segmented, Switch, Tooltip } from 'antd';
import { Plus, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import SectionHeader from '@components/Layout/SectionHeader';
import Kaomoji from '@components/molecules/Kaomoji';
import type { DomainRowForm } from './index';
import { AUTH_OPTIONS } from '@utils/constants';
import styles from './Apply.module.css';

const MAX_DOMAINS = 10;

export interface DomainSectionProps {
  domains: DomainRowForm[];
  onChange: (domains: DomainRowForm[]) => void;
  defaultRow: () => DomainRowForm;
}

export default function DomainSection({
  domains,
  onChange,
  defaultRow,
}: DomainSectionProps) {
  const updateRow = (id: string, patch: Partial<DomainRowForm>) => {
    onChange(domains.map((d) => (d.id === id ? { ...d, ...patch } : d)));
  };

  const removeRow = (id: string) => {
    if (domains.length === 1) return;
    onChange(domains.filter((d) => d.id !== id));
  };

  const addRow = () => {
    if (domains.length >= MAX_DOMAINS) return;
    onChange([...domains, defaultRow()]);
  };

  return (
    <div className={styles.section}>
      <SectionHeader
        title="域名配置"
        subtitle={`添加您要申请证书的域名（最多 ${MAX_DOMAINS} 个）`}
      />

      <div className={styles.domainList}>
        <AnimatePresence initial={false}>
          {domains.map((d, i) => (
            <motion.div
              key={d.id}
              className={styles.domainRow}
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              <div className={styles.domainHead}>
                <span className={styles.domainIndex}>#{i + 1}</span>
                {domains.length > 1 && (
                  <Tooltip title="删除此域名">
                    <button
                      type="button"
                      className={styles.removeBtn}
                      onClick={() => removeRow(d.id)}
                      aria-label="删除"
                    >
                      <Trash2 size={14} />
                    </button>
                  </Tooltip>
                )}
              </div>

              <Input
                size="large"
                value={d.domain}
                onChange={(e) => updateRow(d.id, { domain: e.target.value })}
                placeholder="example.com"
                className={styles.domainInput}
              />

              <div className={styles.domainControls}>
                <label className={styles.switchLabel}>
                  <Switch
                    size="small"
                    checked={d.wildcard}
                    onChange={(c) => updateRow(d.id, { wildcard: c })}
                  />
                  <span>通配符 (*.)</span>
                </label>
                <label className={styles.switchLabel}>
                  <Switch
                    size="small"
                    checked={d.includeRoot}
                    onChange={(c) => updateRow(d.id, { includeRoot: c })}
                  />
                  <span>包含根域名</span>
                </label>
              </div>

              <Segmented
                options={AUTH_OPTIONS}
                value={d.verification}
                onChange={(v) =>
                  updateRow(d.id, { verification: v as DomainRowForm['verification'] })
                }
                className={styles.verifySeg}
                block
              />
            </motion.div>
          ))}
        </AnimatePresence>

        {domains.length < MAX_DOMAINS ? (
          <button
            type="button"
            className={styles.addBtn}
            onClick={addRow}
          >
            <Plus size={16} />
            <span>
              添加域名 ({domains.length}/{MAX_DOMAINS})
            </span>
          </button>
        ) : (
          <div className={styles.maxHint}>
            <Kaomoji mood="warning" inline size={14} /> 已达最大数量限制
          </div>
        )}
      </div>
    </div>
  );
}
