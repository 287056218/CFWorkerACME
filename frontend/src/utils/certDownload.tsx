/**
 * 证书下载工具：ZIP / PFX
 *
 * 后端在 X-PFX-Password 响应头返回一次性密码，前端 fetch 后读取该 header
 * 并弹窗展示给用户（仅一次，不入库）。
 */
import { App as AntdApp, Modal, Typography } from 'antd';

/** 触发浏览器下载 */
function triggerDownload(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  // 延迟释放给浏览器一个异步抓取窗口
  setTimeout(() => URL.revokeObjectURL(url), 2000);
}

function guessFilenameFromHeaders(
  headers: Headers,
  fallback: string,
): string {
  const disposition = headers.get('Content-Disposition') || '';
  const m = disposition.match(/filename="?([^";]+)"?/i);
  return m ? m[1] : fallback;
}

async function parseErrorResponse(res: Response): Promise<string> {
  try {
    const data = await res.json();
    return data?.texts || data?.message || `HTTP ${res.status}`;
  } catch {
    return `HTTP ${res.status}`;
  }
}

/** 下载证书 ZIP */
export async function downloadCertZip(uuid: string): Promise<void> {
  const res = await fetch(`/ca_zip/?uuid=${encodeURIComponent(uuid)}`, {
    method: 'GET',
    credentials: 'include',
  });
  if (!res.ok) {
    const msg = await parseErrorResponse(res);
    throw new Error(msg);
  }
  const blob = await res.blob();
  const name = guessFilenameFromHeaders(res.headers, `${uuid}.zip`);
  triggerDownload(blob, name);
}

/**
 * 下载证书 PFX，返回随机密码供调用方展示。
 * 密码在响应头 X-PFX-Password 中，仅返回一次。
 */
export async function downloadCertPfx(uuid: string): Promise<string> {
  const res = await fetch(`/ca_pfx/?uuid=${encodeURIComponent(uuid)}`, {
    method: 'GET',
    credentials: 'include',
  });
  if (!res.ok) {
    const msg = await parseErrorResponse(res);
    throw new Error(msg);
  }
  const password = res.headers.get('X-PFX-Password') ?? '';
  const blob = await res.blob();
  const name = guessFilenameFromHeaders(res.headers, `${uuid}.pfx`);
  triggerDownload(blob, name);
  return password;
}

/**
 * 弹窗展示 PFX 密码，提供「复制到剪贴板」。
 */
export function showPfxPasswordModal(password: string): void {
  if (!password) return;
  Modal.info({
    title: 'PFX 密码',
    width: 420,
    content: (
      <div style={{ marginTop: 8 }}>
        <Typography.Paragraph style={{ marginBottom: 6 }}>
          本次生成的随机密码为：
        </Typography.Paragraph>
        <Typography.Paragraph
          copyable={{ text: password }}
          style={{
            fontFamily: 'var(--font-mono, monospace)',
            fontSize: 16,
            padding: '8px 12px',
            background: 'var(--bg-panel, #f5f5f5)',
            borderRadius: 6,
          }}
        >
          {password}
        </Typography.Paragraph>
        <Typography.Text type="warning" style={{ fontSize: 12 }}>
          密码仅显示一次，请立即复制并妥善保存。
        </Typography.Text>
      </div>
    ),
    okText: '我已保存',
  });
}

/** 统一入口：ZIP */
export async function handleDownloadZip(uuid: string, msg: ReturnType<typeof AntdApp.useApp>['message']): Promise<void> {
  try {
    await downloadCertZip(uuid);
    msg.success('ZIP 下载完成');
  } catch (e: any) {
    msg.error(e?.message ?? 'ZIP 下载失败');
  }
}

/** 统一入口：PFX */
export async function handleDownloadPfx(uuid: string, msg: ReturnType<typeof AntdApp.useApp>['message']): Promise<void> {
  try {
    const pwd = await downloadCertPfx(uuid);
    if (pwd) {
      showPfxPasswordModal(pwd);
    } else {
      msg.warning('PFX 下载成功，但未收到密码（浏览器可能阻止读取 X-PFX-Password）');
    }
  } catch (e: any) {
    msg.error(e?.message ?? 'PFX 下载失败');
  }
}
