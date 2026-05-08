/**
 * 管理员 - 证书管理 API
 */
import { apiGet, apiPost, http } from './request';

export interface AdminCert {
  uuid: string;
  mail: string;
  sign: number | null;
  type: number | string | null;
  auto: number;
  flag: number;
  time: number;
  next: number;
  main: string;
  list: string;
  text?: string | null;
  has_keys: boolean;
  has_cert: boolean;
}

export interface AdminCertListResp {
  flags: number;
  texts?: string;
  total: number;
  page: number;
  page_size: number;
  items: AdminCert[];
}

export interface AdminCertListQuery {
  page?: number;
  page_size?: number;
  mail?: string;
  domain?: string;
  flag?: number;
  sign?: number;
  next_from?: number;
  next_to?: number;
}

export async function listAdminCerts(
  params?: AdminCertListQuery,
): Promise<AdminCertListResp> {
  return await apiGet<AdminCertListResp>('/admin/certs', params as any);
}

export async function updateAdminCert(
  uuid: string,
  patch: { flag?: number; text?: string },
) {
  const res = await http.patch(`/admin/certs/${uuid}`, patch);
  return res.data;
}

export async function revokeAdminCert(uuid: string) {
  return await apiPost(`/admin/certs/${uuid}/revoke`, {});
}

export async function purgeAdminCert(uuid: string) {
  return await apiPost(`/admin/certs/${uuid}/purge`, {});
}

export async function deleteAdminCert(uuid: string) {
  const res = await http.delete(`/admin/certs/${uuid}`, {
    data: { confirm: uuid },
  });
  return res.data;
}
