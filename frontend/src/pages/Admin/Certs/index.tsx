/**
 * 管理员 - 证书管理页面 /admin/certs
 */
import { useEffect, useMemo, useState } from 'react';
import {
  App as AntdApp,
  Button,
  Input,
  Modal,
  Select,
  Space,
  Table,
  Tag,
  Tooltip,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import {
  CheckOutlined,
  CopyOutlined,
  DeleteOutlined,
  EditOutlined,
  FireOutlined,
  ReloadOutlined,
  SearchOutlined,
  StopOutlined,
} from '@ant-design/icons';
import {
  listAdminCerts,
  updateAdminCert,
  revokeAdminCert,
  purgeAdminCert,
  deleteAdminCert,
  type AdminCert,
} from '@api/adminCerts';
import { useCopy } from '@hooks/useCopy';

const FLAG_OPTIONS = [
  { value: -1, label: '失败', color: 'red' },
  { value: 0, label: '待创建', color: 'default' },
  { value: 1, label: '处理中', color: 'processing' },
  { value: 2, label: '待验证', color: 'gold' },
  { value: 3, label: '验证中', color: 'blue' },
  { value: 4, label: '申请中', color: 'cyan' },
  { value: 5, label: '已签发', color: 'green' },
];

function flagTag(flag: number) {
  const opt = FLAG_OPTIONS.find((o) => o.value === flag);
  if (!opt) return <Tag>未知 ({flag})</Tag>;
  return <Tag color={opt.color as any}>{opt.label}</Tag>;
}

const SIGN_LABEL: Record<string, string> = {
  'lets-encrypt': "Let's Encrypt",
  'google-trust': 'Google Trust',
  'bypass-trust': 'BuyPass',
  'zeroca-trust': 'ZeroSSL',
  'sslcom-trust': 'SSL.com',
};

function signLabel(sign: number | null | string): string {
  const v = String(sign ?? '');
  return SIGN_LABEL[v] || v || '-';
}

function parseDomains(list: string): string {
  try {
    const arr = JSON.parse(list) as any[];
    if (!Array.isArray(arr)) return list;
    return arr.map((d: any) => d?.name ?? '').filter(Boolean).join(', ');
  } catch {
    return list;
  }
}

function formatTime(ts?: number | null) {
  if (!ts) return '-';
  try {
    return new Date(ts).toLocaleString('zh-CN', { hour12: false });
  } catch {
    return String(ts);
  }
}

export default function AdminCertsPage() {
  const { message, modal } = AntdApp.useApp();

  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<AdminCert[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);

  const [mailFilter, setMailFilter] = useState('');
  const [domainFilter, setDomainFilter] = useState('');
  const [flagFilter, setFlagFilter] = useState<number | undefined>();

  // 编辑 flag 弹窗
  const [editing, setEditing] = useState<AdminCert | null>(null);
  const [newFlag, setNewFlag] = useState<number>(0);
  const [newText, setNewText] = useState<string>('');

  const fetchList = async () => {
    setLoading(true);
    try {
      const res = await listAdminCerts({
        page,
        page_size: pageSize,
        mail: mailFilter || undefined,
        domain: domainFilter || undefined,
        flag: flagFilter,
      });
      if (res.flags === 0) {
        setData(res.items);
        setTotal(res.total);
      } else {
        message.error(res.texts || '加载失败');
      }
    } catch (e: any) {
      message.error(e?.texts || e?.message || '加载失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, pageSize]);

  const onSearch = () => {
    setPage(1);
    fetchList();
  };

  const openEdit = (r: AdminCert) => {
    setEditing(r);
    setNewFlag(r.flag);
    setNewText('');
  };

  const saveEdit = async () => {
    if (!editing) return;
    try {
      const res: any = await updateAdminCert(editing.uuid, {
        flag: newFlag,
        text: newText || undefined,
      });
      if (res?.flags === 0) {
        message.success('已更新');
        setEditing(null);
        fetchList();
      } else {
        message.error(res?.texts || '更新失败');
      }
    } catch (e: any) {
      message.error(e?.texts || e?.message || '更新失败');
    }
  };

  const doRevoke = (r: AdminCert) => {
    const instance = modal.confirm({
      title: '吊销证书',
      icon: null,
      width: 520,
      content: (
        <ConfirmIdContent
          expectId={r.uuid}
          intro={
            <>
              <p style={{ margin: '0 0 6px' }}>
                即将对该证书发起 ACME 吊销请求。
              </p>
              <p style={{ margin: 0, color: '#b45309' }}>
                不同 CA 对吊销的支持程度不同，失败时会保留原状态。
              </p>
            </>
          }
          onMatchChange={(matched) =>
            instance.update({
              okButtonProps: { danger: true, disabled: !matched },
            })
          }
        />
      ),
      okButtonProps: { danger: true, disabled: true },
      okText: '确认吊销',
      onOk: async () => {
        const res: any = await revokeAdminCert(r.uuid);
        if (res?.flags === 0) {
          message.success('已吊销');
          fetchList();
        } else {
          message.error(res?.texts || '吊销失败');
          throw new Error(res?.texts);
        }
      },
    });
  };

  const doPurge = (r: AdminCert) => {
    const instance = modal.confirm({
      title: '清除密钥',
      icon: null,
      width: 520,
      content: (
        <ConfirmIdContent
          expectId={r.uuid}
          intro={
            <>
              <p style={{ margin: '0 0 6px' }}>
                将清除此订单的 keys/cert 字段，下载将被禁用。
              </p>
              <p style={{ margin: 0, color: '#b45309' }}>此操作不可恢复。</p>
            </>
          }
          onMatchChange={(matched) =>
            instance.update({
              okButtonProps: { danger: true, disabled: !matched },
            })
          }
        />
      ),
      okButtonProps: { danger: true, disabled: true },
      okText: '确认清除',
      onOk: async () => {
        const res: any = await purgeAdminCert(r.uuid);
        if (res?.flags === 0) {
          message.success('已清除');
          fetchList();
        } else {
          message.error(res?.texts || '清除失败');
          throw new Error(res?.texts);
        }
      },
    });
  };

  const doDelete = (r: AdminCert) => {
    const instance = modal.confirm({
      title: '删除订单',
      icon: null,
      width: 520,
      content: (
        <ConfirmIdContent
          expectId={r.uuid}
          intro={
            <p style={{ margin: 0, color: '#b45309' }}>
              物理删除订单，<b>不可恢复</b>。请在下方输入订单 UUID 二次确认：
            </p>
          }
          onMatchChange={(matched) =>
            instance.update({
              okButtonProps: { danger: true, disabled: !matched },
            })
          }
        />
      ),
      okButtonProps: { danger: true, disabled: true },
      okText: '确认删除',
      onOk: async () => {
        const res: any = await deleteAdminCert(r.uuid);
        if (res?.flags === 0) {
          message.success('已删除');
          fetchList();
        } else {
          message.error(res?.texts || '删除失败');
          throw new Error(res?.texts);
        }
      },
    });
  };

  const columns: ColumnsType<AdminCert> = useMemo(
    () => [
      {
        title: 'UUID',
        dataIndex: 'uuid',
        key: 'uuid',
        width: 160,
        render: (v: string) => (
          <Tooltip title={v}>
            <code style={{ fontSize: 12 }}>{v.slice(0, 10)}…</code>
          </Tooltip>
        ),
      },
      {
        title: '所属邮箱',
        dataIndex: 'mail',
        key: 'mail',
        ellipsis: true,
      },
      {
        title: '域名',
        dataIndex: 'list',
        key: 'list',
        ellipsis: true,
        render: (v: string) => (
          <Tooltip title={parseDomains(v)}>
            <span style={{ fontFamily: 'var(--font-mono, monospace)' }}>
              {parseDomains(v)}
            </span>
          </Tooltip>
        ),
      },
      {
        title: 'CA',
        dataIndex: 'sign',
        key: 'sign',
        width: 120,
        render: (v: any) => signLabel(v),
      },
      {
        title: '状态',
        dataIndex: 'flag',
        key: 'flag',
        width: 90,
        render: (v: number) => flagTag(v),
      },
      {
        title: '签发时间',
        dataIndex: 'time',
        key: 'time',
        width: 170,
        render: (v) => formatTime(v),
      },
      {
        title: '到期时间',
        dataIndex: 'next',
        key: 'next',
        width: 170,
        render: (v) => formatTime(v),
      },
      {
        title: '密钥',
        key: 'has_keys',
        width: 64,
        render: (_v, r) =>
          r.has_keys ? <Tag color="green">有</Tag> : <Tag>无</Tag>,
      },
      {
        title: '操作',
        key: 'ops',
        width: 220,
        render: (_v, r) => (
          <Space size={2} wrap>
            <Tooltip title="修改状态">
              <Button
                size="small"
                type="text"
                icon={<EditOutlined />}
                onClick={() => openEdit(r)}
              />
            </Tooltip>
            <Tooltip title="吊销（flag=5 时可用）">
              <Button
                size="small"
                type="text"
                icon={<StopOutlined />}
                disabled={r.flag !== 5 || !r.has_cert}
                onClick={() => doRevoke(r)}
              />
            </Tooltip>
            <Tooltip title="清除 keys/cert">
              <Button
                size="small"
                type="text"
                icon={<FireOutlined />}
                onClick={() => doPurge(r)}
              />
            </Tooltip>
            <Tooltip title="删除订单">
              <Button
                size="small"
                type="text"
                danger
                icon={<DeleteOutlined />}
                onClick={() => doDelete(r)}
              />
            </Tooltip>
          </Space>
        ),
      },
    ],
    [],
  );

  return (
    <div style={{ padding: 24 }}>
      <Space style={{ marginBottom: 16, flexWrap: 'wrap' }} size={8}>
        <Input
          allowClear
          style={{ width: 200 }}
          prefix={<SearchOutlined />}
          placeholder="邮箱"
          value={mailFilter}
          onChange={(e) => setMailFilter(e.target.value)}
          onPressEnter={onSearch}
        />
        <Input
          allowClear
          style={{ width: 200 }}
          placeholder="域名关键字"
          value={domainFilter}
          onChange={(e) => setDomainFilter(e.target.value)}
          onPressEnter={onSearch}
        />
        <Select
          allowClear
          style={{ width: 140 }}
          placeholder="状态筛选"
          value={flagFilter}
          onChange={setFlagFilter}
          options={FLAG_OPTIONS.map((o) => ({
            value: o.value,
            label: o.label,
          }))}
        />
        <Button type="primary" icon={<SearchOutlined />} onClick={onSearch}>
          查询
        </Button>
        <Button icon={<ReloadOutlined />} onClick={() => fetchList()}>
          刷新
        </Button>
      </Space>

      <Table<AdminCert>
        rowKey="uuid"
        loading={loading}
        dataSource={data}
        columns={columns}
        pagination={{
          current: page,
          pageSize,
          total,
          showSizeChanger: true,
          showTotal: (t) => `共 ${t} 条`,
          onChange: (p, s) => {
            setPage(p);
            setPageSize(s);
          },
        }}
        scroll={{ x: 1200 }}
      />

      {/* 修改状态弹窗 =============================================== */}
      <Modal
        open={!!editing}
        title={editing ? `修改证书状态 · ${editing.uuid}` : ''}
        onCancel={() => setEditing(null)}
        onOk={saveEdit}
        destroyOnClose
      >
        <Space direction="vertical" style={{ width: '100%' }}>
          <div>
            <div style={{ fontSize: 12, color: '#6b7280', marginBottom: 4 }}>
              当前状态
            </div>
            {editing ? flagTag(editing.flag) : '-'}
          </div>
          <div>
            <div style={{ fontSize: 12, color: '#6b7280', marginBottom: 4 }}>
              新状态
            </div>
            <Select
              value={newFlag}
              onChange={setNewFlag}
              style={{ width: '100%' }}
              options={FLAG_OPTIONS.map((o) => ({
                value: o.value,
                label: o.label,
              }))}
            />
          </div>
          <div>
            <div style={{ fontSize: 12, color: '#6b7280', marginBottom: 4 }}>
              操作备注（可选，将追加到订单 text）
            </div>
            <Input.TextArea
              rows={3}
              value={newText}
              onChange={(e) => setNewText(e.target.value)}
              placeholder="例如：用户反馈证书异常"
            />
          </div>
        </Space>
      </Modal>
    </div>
  );
}

/* ============================================================
 * 内部组件：危险操作确认弹窗内容
 * 显示完整订单 UUID + 一键复制，要求用户手动输入 UUID 才可确认
 * ============================================================ */
interface ConfirmIdContentProps {
  expectId: string;
  intro?: React.ReactNode;
  onMatchChange: (matched: boolean) => void;
}

function ConfirmIdContent({
  expectId,
  intro,
  onMatchChange,
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
    const ok = await copy(expectId, '订单 UUID 已复制');
    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 8 }}>
      {intro && <div style={{ fontSize: 13, lineHeight: 1.6 }}>{intro}</div>}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          padding: '8px 10px',
          background: 'rgba(0,0,0,0.03)',
          border: '1px dashed rgba(0,0,0,0.12)',
          borderRadius: 8,
        }}
      >
        <code
          style={{
            flex: 1,
            minWidth: 0,
            fontSize: 13,
            fontWeight: 600,
            padding: '4px 8px',
            background: '#fff',
            borderRadius: 6,
            overflowX: 'auto',
            whiteSpace: 'nowrap',
            userSelect: 'all',
          }}
        >
          {expectId}
        </code>
        <Button
          size="small"
          icon={copied ? <CheckOutlined /> : <CopyOutlined />}
          onClick={handleCopy}
          type={copied ? 'primary' : 'default'}
          ghost={copied}
        >
          {copied ? '已复制' : '复制'}
        </Button>
      </div>
      <Input
        autoFocus
        placeholder="粘贴或输入上方订单 UUID"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        status={value && !matched ? 'error' : undefined}
        allowClear
      />
      {value && !matched && (
        <div style={{ fontSize: 12, color: '#dc2626' }}>
          UUID 不匹配，请检查后重试
        </div>
      )}
    </div>
  );
}
