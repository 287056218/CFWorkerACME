import { emailMD5 } from '@utils/crypto';
import { GRAVATAR_BASE } from '@utils/constants';

/**
 * 根据邮箱生成 Gravatar URL
 * @param email 邮箱
 * @param size 头像尺寸，默认 128
 * @param fallback 默认头像类型：identicon | monsterid | wavatar | retro | robohash
 */
export function useGravatar(
  email: string | null | undefined,
  size = 128,
  fallback: 'identicon' | 'monsterid' | 'wavatar' | 'retro' | 'robohash' = 'retro',
): string {
  if (!email) {
    return `${GRAVATAR_BASE}00000000000000000000000000000000?s=${size}&d=${fallback}`;
  }
  const hash = emailMD5(email);
  return `${GRAVATAR_BASE}${hash}?s=${size}&d=${fallback}`;
}

/**
 * 邮箱首字母（用于降级头像）
 */
export function emailInitial(email: string | null | undefined): string {
  if (!email) return '?';
  return email.charAt(0).toUpperCase();
}
