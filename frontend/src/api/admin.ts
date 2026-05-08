/**
 * 管理员相关 API
 */
import { apiGet, apiPost, http } from './request';

export interface AdminUser {
  mail: string;
  flag: string;
  is_admin: number;
  quota: number;
  time: number | null;
  keys_configured: boolean;
  apis_configured: boolean;
  active_certs: number;
  month_applies: number;
}

export interface AdminUserListResp {
  flags: number;
  texts?: string;
  total: number;
  page: number;
  page_size: number;
  items: AdminUser[];
}

export interface AdminUserListQuery {
  page?: number;
  page_size?: number;
  mail?: string;
  flag?: string;
  is_admin?: 0 | 1;
  quota_min?: number;
  quota_max?: number;
}

/** 用户列表 */
export async function listAdminUsers(
  params?: AdminUserListQuery,
): Promise<AdminUserListResp> {
  return await apiGet<AdminUserListResp>('/admin/users', params as any);
}

/** 更新用户：flag / is_admin / quota */
export async function updateAdminUser(
  mail: string,
  patch: { flag?: string; is_admin?: 0 | 1 | boolean; quota?: number },
) {
  const res = await http.patch(`/admin/users/${encodeURIComponent(mail)}`, patch);
  return res.data;
}

/** 重置密码（pass 为 SHA256 hex） */
export async function resetAdminUserPassword(mail: string, pass: string) {
  return await apiPost(`/admin/users/${encodeURIComponent(mail)}/password`, {
    pass,
  });
}

/** 删除用户（confirm 需等于目标邮箱） */
export async function deleteAdminUser(mail: string, confirm: string) {
  const res = await http.delete(`/admin/users/${encodeURIComponent(mail)}`, {
    data: { confirm },
  });
  return res.data;
}
