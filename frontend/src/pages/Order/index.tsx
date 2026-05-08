import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { App, Button, Input, Skeleton } from 'antd';
import {
  ArrowLeft,
  Check,
  Copy,
  RefreshCw,
} from 'lucide-react';
import PageShell from '@components/Layout/PageShell';
import TerminalPrompt from '@components/molecules/TerminalPrompt';
import Kaomoji from '@components/molecules/Kaomoji';
import { useCopy } from '@hooks/useCopy';
import { getOrder, operateOrder } from '@api/order';
import type { Order, OrderAction } from '@api/types';
import { FLAG_PULSE, FLAG_COLOR } from '@utils/constants';
import { downloadAsFile, shortenId } from '@utils/format';
import CertInfo from './CertInfo';
import DomainVerify from './DomainVerify';
import OrderActions from './OrderActions';
import OrderProgress from './OrderProgress';
import styles from './Order.module.css';

export default function OrderPage() {
  const { uuid } = useParams<{ uuid: string }>();
  const navigate = useNavigate();
  const { message, modal } = App.useApp();
  const { copy } = useCopy();

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [operating, setOperating] = useState(false);

  const load = async () => {
    if (!uuid) return;
    setLoading(true);
    try {
      const data = await getOrder(uuid);
      setOrder(data);
    } catch {
      setOrder(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [uuid]);

  const handleAction = async (
    action: OrderAction,
    domainName?: string,
    opts?: {
      confirm?: string;
      danger?: boolean;
      filename?: string;
      requireConfirmId?: string;
    },
  ) => {
    if (!uuid) return;

    const run = async () => {
      setOperating(true);
      try {
        const result = await operateOrder(uuid, action, domainName);
        if (action === 'ca_get' || action === 'ca_key') {
          if (result) {
            downloadAsFile(
              result,
              opts?.filename ||
                `${uuid}.${action === 'ca_get' ? 'crt' : 'pem'}`,
            );
            message.success('下载成功 ✨');
          } else {
            message.warning('文件不存在');
          }
        } else if (action === 'cancel' || action === 'modify') {
          message.success('操作成功');
          setTimeout(() => navigate('/certs'), 500);
        } else {
          message.success('操作成功');
          await load();
        }
      } catch {
        /* 拦截器已 toast */
      } finally {
        setOperating(false);
      }
    };

    if (opts?.requireConfirmId) {
      const expectId = opts.requireConfirmId;
      const instance = modal.confirm({
        title: opts.confirm || '危险操作确认',
        icon: null,
        okText: '确认',
        cancelText: '取消',
        width: 480,
        okButtonProps: { danger: !!opts.danger, disabled: true },
        content: (
          <ConfirmIdContent
            expectId={expectId}
            onMatchChange={(matched) =>
              instance.update({
                okButtonProps: { danger: !!opts.danger, disabled: !matched },
              })
            }
          />
        ),
        onOk: run,
      });
      return;
    }

    if (opts?.confirm) {
      modal.confirm({
        title: opts.confirm,
        okText: '确认',
        cancelText: '取消',
        okButtonProps: opts.danger ? { danger: true } : undefined,
        onOk: run,
      });
    } else {
      await run();
    }
  };

  if (loading) {
    return (
      <PageShell>
        <Skeleton active style={{ marginTop: 24 }} />
      </PageShell>
    );
  }

  if (!order) {
    return (
      <PageShell>
        <div className={styles.notFound}>
          <Kaomoji mood="error" size={56} />
          <h2>订单不存在或已被删除</h2>
          <Button onClick={() => navigate('/certs')} icon={<ArrowLeft size={14} />}>
            返回证书列表
          </Button>
        </div>
      </PageShell>
    );
  }

  const pulseStatus = FLAG_PULSE[order.flag] || 'pending';
  const colorVariant = FLAG_COLOR[order.flag] as any;

  return (
    <PageShell>
      {/* 顶部：路径 + 返回 + 复制ID */}
      <div className={styles.greet}>
        <TerminalPrompt
          host="certhub"
          path={`~/order/${shortenId(order.uuid, 6)}`}
          suffix={
            <span className={styles.cmdText}>
              inspect <span className={styles.muted}>// id:{shortenId(order.uuid, 10)}</span>
            </span>
          }
        />
        <div className={styles.topActions}>
          <Button
            size="small"
            icon={<Copy size={12} />}
            onClick={() => copy(order.uuid, '订单ID已复制')}
          >
            复制ID
          </Button>
          <Button
            size="small"
            icon={<RefreshCw size={12} />}
            onClick={load}
            loading={loading}
          >
            刷新
          </Button>
          <Button
            size="small"
            icon={<ArrowLeft size={12} />}
            onClick={() => navigate('/certs')}
          >
            返回
          </Button>
        </div>
      </div>

      {/* 进度条 */}
      <OrderProgress flag={order.flag} />

      {/* 证书信息 */}
      <CertInfo order={order} />

      {/* 域名验证状态（仅在未完成时显示） */}
      {order.flag < 5 && order.flag !== -1 && (
        <DomainVerify
          order={order}
          onVerifySingle={(name) =>
            handleAction('single', name, {
              confirm: `确认触发 ${name} 的单独验证？`,
            })
          }
        />
      )}

      {/* 底部操作栏 */}
      <OrderActions
        order={order}
        operating={operating}
        onAction={handleAction}
      />
    </PageShell>
  );
}

/* ============================================================
 * 内部组件：危险操作确认弹窗内容
 * 显示完整证书 ID + 一键复制，要求用户手动输入 ID 才能确认
 * ============================================================ */
interface ConfirmIdContentProps {
  expectId: string;
  onMatchChange: (matched: boolean) => void;
}

function ConfirmIdContent({ expectId, onMatchChange }: ConfirmIdContentProps) {
  const { copy } = useCopy();
  const [value, setValue] = useState('');
  const [copied, setCopied] = useState(false);

  const matched = value.trim() === expectId;

  useEffect(() => {
    onMatchChange(matched);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [matched]);

  const handleCopy = async () => {
    const ok = await copy(expectId, '证书 ID 已复制');
    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }
  };

  return (
    <div className={styles.confirmIdWrap}>
      <div className={styles.confirmIdHint}>
        为了避免误操作，请输入完整的证书 ID 以确认操作。
      </div>
      <div className={styles.confirmIdBox}>
        <code className={styles.confirmIdCode}>{expectId}</code>
        <button
          type="button"
          className={[
            styles.confirmIdCopyBtn,
            copied && styles.confirmIdCopyBtnDone,
          ]
            .filter(Boolean)
            .join(' ')}
          onClick={handleCopy}
          title="一键复制证书 ID"
        >
          {copied ? <Check size={14} /> : <Copy size={14} />}
          <span>{copied ? '已复制' : '复制'}</span>
        </button>
      </div>
      <Input
        autoFocus
        placeholder="粘贴或输入上方证书 ID"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        status={value && !matched ? 'error' : undefined}
        allowClear
      />
      {value && !matched && (
        <div className={styles.confirmIdError}>ID 不匹配，请检查后重试</div>
      )}
    </div>
  );
}
