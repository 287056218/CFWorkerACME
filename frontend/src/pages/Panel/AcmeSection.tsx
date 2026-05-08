import { useState } from 'react';
import { App, Button, Input } from 'antd';
import { ChevronDown, ChevronRight, KeyRound, RefreshCw, Save } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { updateAcmeKey } from '@api/user';
import { generateECCP256PEM } from '@utils/crypto';
import { randomKaomoji } from '@utils/kaomoji';
import SectionHeader from '@components/Layout/SectionHeader';
import styles from './Panel.module.css';

export interface AcmeSectionProps {
  defaultExpanded?: boolean;
}

export default function AcmeSection({ defaultExpanded = false }: AcmeSectionProps = {}) {
  const { modal, message } = App.useApp();
  const [expanded, setExpanded] = useState(defaultExpanded);
  const [key, setKey] = useState('');
  const [generating, setGenerating] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleGenerate = async () => {
    setGenerating(true);
    try {
      const pem = await generateECCP256PEM();
      setKey(pem);
      message.success(`密钥已生成 ${randomKaomoji('success')}`);
    } catch (e: any) {
      message.error(`生成失败 ${randomKaomoji('error')}`);
    } finally {
      setGenerating(false);
    }
  };

  const handleSave = async () => {
    if (key.trim().length < 20) {
      message.warning('密钥内容太短，请先生成或填写');
      return;
    }
    modal.confirm({
      title: '确认更新 ACME 私钥？',
      content:
        '更新后您将无法使用之前的密钥吊销已申请的证书，此密钥在离开本页面后不可再次查看。',
      okText: '确认更新',
      cancelText: '取消',
      okButtonProps: { danger: true },
      onOk: async () => {
        setSaving(true);
        try {
          const ok = await updateAcmeKey(key);
          if (ok) {
            message.success(`更新成功 ${randomKaomoji('success')}`);
            setKey('');
          }
        } catch {
          /* 拦截器已 toast */
        } finally {
          setSaving(false);
        }
      },
    });
  };

  return (
    <div id="acme-section" className={styles.collapseCard}>
      <button
        type="button"
        className={styles.collapseHeader}
        onClick={() => setExpanded(!expanded)}
      >
        <SectionHeader
          icon={<KeyRound size={16} />}
          title="ACME 账号密钥"
          subtitle="用于 CA 账号签名，不会影响已签发证书"
          compact
        />
        <motion.span
          className={styles.collapseArrow}
          animate={{ rotate: expanded ? 90 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronRight size={18} />
        </motion.span>
      </button>

      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className={styles.collapseBody}
          >
            <div className={styles.collapseInner}>
              <Input.TextArea
                rows={5}
                value={key}
                placeholder="点击下方「随机生成」即可生成新的 ECC P-256 私钥，或留空不更改"
                onChange={(e) => setKey(e.target.value)}
                className={styles.textarea}
              />

              <div className={styles.collapseActions}>
                <Button
                  icon={<RefreshCw size={14} />}
                  onClick={handleGenerate}
                  loading={generating}
                >
                  随机生成
                </Button>
                <Button
                  type="primary"
                  icon={<Save size={14} />}
                  onClick={handleSave}
                  loading={saving}
                >
                  应用更改
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
