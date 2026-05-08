import CryptoJS from 'crypto-js';

/**
 * SHA-256 摘要（十六进制字符串）
 */
export async function sha256(data: string): Promise<string> {
  return CryptoJS.SHA256(data).toString(CryptoJS.enc.Hex);
}

/**
 * HMAC-SHA256（十六进制字符串）
 */
export async function hmac256(data: string, key: string): Promise<string> {
  return CryptoJS.HmacSHA256(data, key).toString(CryptoJS.enc.Hex);
}

/**
 * AES-256-CBC/ECB 加密（输入为十六进制字符串，返回十六进制密文）
 * 与原 crypt-new.js 完全兼容
 */
export async function aes256(data: string, key: string): Promise<string> {
  const keyWord = CryptoJS.enc.Hex.parse(key);
  const dataWord = CryptoJS.enc.Hex.parse(data);
  const encrypted = CryptoJS.AES.encrypt(dataWord, keyWord, {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7,
  });
  return encrypted.toString(CryptoJS.format.Hex);
}

/**
 * XOR 加密（十六进制字符串）
 */
export async function xor256(data: string, key: string): Promise<string> {
  const maxLen = Math.max(data.length, key.length);
  const d = data.padEnd(maxLen, '0');
  const k = key.padEnd(maxLen, '0');
  let out = '';
  for (let i = 0; i < maxLen; i += 2) {
    const dw = parseInt(d.substr(i, 2), 16);
    const kw = parseInt(k.substr(i, 2), 16);
    const sw = dw ^ kw;
    out += sw.toString(16).padStart(2, '0');
  }
  return out;
}

/**
 * 邮箱简单校验
 */
export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/**
 * 邮箱 MD5（用于 Gravatar）
 */
export function emailMD5(email: string): string {
  return CryptoJS.MD5(email.trim().toLowerCase()).toString();
}

/**
 * 生成随机字符串（用作 API Token 等）
 */
export function randomString(len = 32): string {
  const arr = new Uint8Array(len);
  crypto.getRandomValues(arr);
  return Array.from(arr)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
    .slice(0, len);
}

/**
 * 生成 ECC P-256 私钥并编码为 PKCS8 PEM 格式
 */
export async function generateECCP256PEM(): Promise<string> {
  const { privateKey } = await crypto.subtle.generateKey(
    { name: 'ECDSA', namedCurve: 'P-256' },
    true,
    ['sign', 'verify'],
  );
  const keyBuff = await crypto.subtle.exportKey('pkcs8', privateKey);
  const bytes = new Uint8Array(keyBuff);
  // String.fromCharCode 在超大数组时会栈溢出，这里密钥很小，安全
  let binaryStr = '';
  for (let i = 0; i < bytes.length; i++) {
    binaryStr += String.fromCharCode(bytes[i]);
  }
  const base = window.btoa(binaryStr);
  let pem = '-----BEGIN PRIVATE KEY-----\n';
  for (let i = 0; i < base.length; i += 64) {
    pem += base.substring(i, i + 64) + '\n';
  }
  pem += '-----END PRIVATE KEY-----';
  return pem;
}
