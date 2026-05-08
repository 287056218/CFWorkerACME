import { apiPost } from './request';
import type { ApiResp } from './types';

/**
 * 更新 ACME 私钥
 */
export async function updateAcmeKey(privateKey: string): Promise<boolean> {
  const data = await apiPost<ApiResp>('/acmes/', { privateKey });
  return data.flags === 0;
}

/**
 * 更新 API Token
 */
export async function updateApiToken(privateKey: string): Promise<boolean> {
  const data = await apiPost<ApiResp>('/token/', { privateKey });
  return data.flags === 0;
}

/**
 * 删除账号（需传入邮箱二次确认）
 */
export async function eraseAccount(email: string): Promise<boolean> {
  const data = await apiPost<ApiResp>('/erase/', { email });
  return data.flags === 0;
}
