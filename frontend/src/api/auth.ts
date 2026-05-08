import { apiGet, http } from './request';
import { aes256, hmac256, sha256 } from '@utils/crypto';
import type { ApiResp, NonceResp } from './types';

/**
 * 获取 nonce（登录前）
 */
export async function fetchLoginNonce(email: string): Promise<string> {
  const url = `/nonce/?email=${encodeURIComponent(email)}`;
  const res = await http.get<NonceResp>(url);
  if (!res.data.nonce) throw new Error(res.data.texts || '获取 nonce 失败');
  return res.data.nonce;
}

/**
 * 请求邮箱验证码（注册/重置密码）
 * @param inviteCode 仅在注册路径使用，当 REGISTER_CODE 非空时必填
 */
export async function sendMailCode(
  email: string,
  authyToken: string,
  mode: 'register' | 'reset',
  inviteCode?: string,
): Promise<string> {
  const params = new URLSearchParams();
  params.set('email', email);
  params.set('authy', authyToken);
  if (mode === 'register') {
    params.set('setup', '1');
    if (inviteCode) params.set('invite', inviteCode);
  } else {
    params.set('reset', '1');
  }

  const url = `/nonce/?${params.toString()}`;
  const res = await http.get<NonceResp>(url);

  // 识别失败：
  //   1) 后端明确返回 flags === 1 表示业务失败（邮件发送失败 / 未配置等）
  //   2) 兜底：nonce 文案以"失败/异常/错误/未配置/已经被注册/请先完成验证"等字样出现时也抛错，
  //      避免后端漏设 flags 时前端误判成功
  const data: any = res.data || {};
  if (data.flags === 1) {
    throw new Error(data.nonce || data.texts || '发送验证码失败');
  }
  if (data.flags !== 0 && data.flags !== undefined) {
    throw new Error(data.texts || data.nonce || '发送验证码失败');
  }
  const nonceText: string = String(data.nonce ?? '');
  if (/(失败|异常|错误|未配置|已经被注册|请先完成验证|请等|未开放|邀请码)/.test(nonceText)) {
    throw new Error(nonceText);
  }
  return nonceText;
}

/**
 * 登录：返回 true 表示成功（后端会写入 Cookie）
 */
export async function loginUser(email: string, password: string): Promise<boolean> {
  const nonce = await fetchLoginNonce(email);
  const passHash = await sha256(password);
  const passHmac = await hmac256(passHash, nonce);
  const url = `/login/?email=${encodeURIComponent(email)}&token=${passHmac}`;
  const res = await http.get<ApiResp>(url);
  return res.status === 200 && (res.data.flags === 1 || res.data.flags === undefined);
}

/**
 * 注册
 */
export async function registerUser(
  email: string,
  password: string,
  code: string,
): Promise<boolean> {
  const passHash = await sha256(password);
  const codeHash = await sha256(code);
  const mailCode = await hmac256(email, codeHash);
  const passCode = await aes256(passHash, codeHash);
  const url = `/setup/?email=${encodeURIComponent(email)}&codes=${mailCode}&crypt=${passCode}`;
  const res = await http.get<ApiResp>(url);
  return res.status === 200;
}

/**
 * 重置密码
 */
export async function resetPassword(
  email: string,
  newPassword: string,
  code: string,
): Promise<boolean> {
  return registerUser(email, newPassword, code);
}

/**
 * 修改密码（登录态下）
 */
export async function changePassword(
  email: string,
  oldPassword: string,
  newPassword: string,
): Promise<boolean> {
  const oldHash = await sha256(oldPassword);
  const newHash = await sha256(newPassword);
  const url = `/setup/?email=${encodeURIComponent(email)}&crypt=${newHash}&pass=${oldHash}`;
  const res = await http.get<ApiResp>(url);
  return res.status === 200;
}

/**
 * 检查登录状态
 */
export async function checkAuth(): Promise<{
  loggedIn: boolean;
  email?: string;
  isAdmin?: boolean;
  quota?: number;
}> {
  try {
    const data = await apiGet<ApiResp>('/check/');
    if (data.flags === 0) {
      return {
        loggedIn: true,
        email: data.texts,
        isAdmin: Number((data as any).is_admin ?? 0) === 1,
        quota: typeof (data as any).quota === 'number' ? (data as any).quota : -1,
      };
    }
    return { loggedIn: false };
  } catch {
    return { loggedIn: false };
  }
}

/**
 * 退出登录
 */
export async function logoutUser(): Promise<void> {
  try {
    await http.get('/exits/');
  } catch {
    // 忽略错误，继续前端清理
  }
}
