import { apiGet, apiPost } from './request';
import { safeJsonParse } from '@utils/format';
import type {
  ApiResp,
  ApplyPayload,
  Order,
  OrderAction,
  OrderRaw,
} from './types';

/**
 * 申请新证书订单
 * @param captchaToken 当 CERT_CAPTCHA_ENABLED=true 时必填
 * @returns 订单 UUID
 */
export async function applyCert(
  payload: ApplyPayload,
  captchaToken?: string,
): Promise<string> {
  const body: any = { ...payload };
  if (captchaToken) body.captcha_token = captchaToken;
  const data = await apiPost<ApiResp>('/apply/', body);
  if (data.flags !== 0) throw new Error(data.texts || '申请失败');
  return data.order as string;
}

/** 查询申请配额与本月已申请数 */
export async function fetchApplyQuota(): Promise<{
  flags: number;
  texts?: string;
  monthly_limit: number;
  month_used: number;
  quota: number;
  active_certs: number;
}> {
  return await apiGet('/apply/quota');
}

/**
 * 获取订单列表（全部）
 */
export async function listOrders(): Promise<OrderRaw[]> {
  const data = await apiGet<ApiResp>('/order/', { id: 'all' });
  if (data.flags !== 0) throw new Error(data.texts || '获取订单列表失败');
  return (data.order || []) as OrderRaw[];
}

/**
 * 获取单个订单
 */
export async function getOrder(uuid: string): Promise<Order> {
  const data = await apiGet<ApiResp>('/order/', { id: uuid });
  if (data.flags !== 0) throw new Error(data.texts || '获取订单失败');
  const raw = data.order as OrderRaw;
  return {
    ...raw,
    main: safeJsonParse(raw.main) || {},
    list: safeJsonParse(raw.list) || [],
    data: safeJsonParse(raw.data),
  };
}

/**
 * 执行订单操作
 * - ca_get/ca_key 会通过 data.order 返回证书/密钥原文
 * - 其他仅返回操作结果
 */
export async function operateOrder(
  uuid: string,
  action: OrderAction,
  domainName?: string,
): Promise<string> {
  const params: Record<string, any> = { id: uuid, op: action };
  if (domainName) params.cd = domainName;
  const data = await apiGet<ApiResp>('/order/', params);
  if (data.flags !== 0) throw new Error(data.texts || '操作失败');
  return (data.order as string) || '';
}
