/**
 * 用户自助 API token 与 API 文档相关
 */
import { apiGet, apiPost } from './request';

export interface ApiTokenInfo {
  flags: number;
  texts?: string;
  configured: boolean;
  fingerprint: string;
  mail: string;
  /** 仅在 reveal=1 时返回 */
  token?: string;
}

export async function fetchApiTokenInfo(reveal = false): Promise<ApiTokenInfo> {
  return await apiGet<ApiTokenInfo>('/account/apitoken', reveal ? { reveal: 1 } : undefined);
}

export async function rotateApiToken(): Promise<ApiTokenInfo & { token: string }> {
  return await apiPost<ApiTokenInfo & { token: string }>('/account/apitoken/rotate');
}
