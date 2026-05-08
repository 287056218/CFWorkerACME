import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/zh-cn';

dayjs.extend(relativeTime);
dayjs.locale('zh-cn');

/**
 * 格式化日期（默认：2025-05-08 12:00:00）
 */
export function fmtDateTime(
  ts: number | string | Date | undefined | null,
  tpl = 'YYYY-MM-DD HH:mm:ss',
): string {
  if (!ts) return '-';
  const d = dayjs(ts);
  if (!d.isValid()) return '-';
  return d.format(tpl);
}

/**
 * 仅格式化日期（2025-05-08）
 */
export function fmtDate(ts: number | string | Date | undefined | null): string {
  return fmtDateTime(ts, 'YYYY-MM-DD');
}

/**
 * 相对时间（2 小时前）
 */
export function fmtRelative(
  ts: number | string | Date | undefined | null,
): string {
  if (!ts) return '-';
  const d = dayjs(ts);
  if (!d.isValid()) return '-';
  return d.fromNow();
}

/**
 * 订单号截断显示（a1b2c3...）
 */
export function shortenId(id: string | undefined | null, prefix = 8): string {
  if (!id) return '-';
  if (id.length <= prefix) return id;
  return `${id.slice(0, prefix)}...`;
}

/**
 * 域名列表摘要
 */
export function summarizeDomains(
  list: Array<{ name: string }> | string[] | undefined,
  maxLen = 36,
): string {
  if (!list || list.length === 0) return '-';
  const names = list.map((x) => (typeof x === 'string' ? x : x.name));
  const joined = names.join(', ');
  if (joined.length <= maxLen) return joined;
  return joined.slice(0, maxLen - 3) + '...';
}

/**
 * 计算剩余天数（可为负数表示已过期）
 */
export function daysUntil(
  target: number | string | Date | undefined | null,
): number {
  if (!target) return 0;
  const diff = dayjs(target).diff(dayjs(), 'day');
  return diff;
}

/**
 * 触发浏览器下载文件
 */
export function downloadAsFile(content: string, filename: string): void {
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([content], { type: 'text/plain' }));
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(a.href);
}

/**
 * 安全 JSON 解析
 */
export function safeJsonParse<T = any>(str: string | undefined | null): T | null {
  if (!str) return null;
  try {
    return JSON.parse(str) as T;
  } catch {
    return null;
  }
}
