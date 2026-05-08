/**
 * 证书申请专用的人机验证组件（可切换 Turnstile / hCaptcha / reCAPTCHA v2）
 *
 * 从 /bootstrap 读取 `cert_captcha.{enabled, provider, site_key}`；
 * - enabled=false：不渲染
 * - provider/site_key 动态加载对应脚本与 widget
 *
 * 回调 onToken(token | '') 向父组件抛出当前的 response token。
 */
import { useEffect, useRef } from 'react';
import { useBootstrapStore } from '@stores/useBootstrapStore';
import { useTheme } from '@hooks/useTheme';

declare global {
  interface Window {
    turnstile?: any;
    hcaptcha?: any;
    grecaptcha?: any;
  }
}

const SCRIPTS: Record<string, string> = {
  turnstile: 'https://challenges.cloudflare.com/turnstile/v0/api.js',
  hcaptcha: 'https://js.hcaptcha.com/1/api.js',
  recaptcha: 'https://www.google.com/recaptcha/api.js',
};

function loadScript(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const exist = document.querySelector(`script[src="${src}"]`);
    if (exist) {
      exist.addEventListener('load', () => resolve());
      // 已加载完成
      // @ts-ignore
      if ((exist as any).__loaded) resolve();
      return;
    }
    const s = document.createElement('script');
    s.src = src;
    s.async = true;
    s.defer = true;
    s.onload = () => {
      // @ts-ignore
      s.__loaded = true;
      resolve();
    };
    s.onerror = () => reject(new Error('加载验证码脚本失败'));
    document.head.appendChild(s);
  });
}

export interface CertCaptchaProps {
  onToken: (token: string) => void;
  className?: string;
}

export default function CertCaptcha({ onToken, className }: CertCaptchaProps) {
  const info = useBootstrapStore((s) => s.info);
  const { theme } = useTheme();
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | number | null>(null);

  const enabled = !!info?.cert_captcha?.enabled;
  const provider = info?.cert_captcha?.provider ?? 'turnstile';
  const siteKey = info?.cert_captcha?.site_key ?? '';

  useEffect(() => {
    if (!enabled || !siteKey) return;
    let mounted = true;

    const src = SCRIPTS[provider];
    if (!src) return;

    loadScript(src)
      .then(() => {
        if (!mounted || !containerRef.current) return;
        // 销毁旧 widget
        try {
          if (provider === 'turnstile' && widgetIdRef.current && window.turnstile) {
            window.turnstile.remove(widgetIdRef.current);
          } else if (provider === 'hcaptcha' && widgetIdRef.current != null && window.hcaptcha) {
            window.hcaptcha.reset(widgetIdRef.current);
          } else if (provider === 'recaptcha' && widgetIdRef.current != null && window.grecaptcha) {
            window.grecaptcha.reset(widgetIdRef.current);
          }
        } catch {
          /* ignore */
        }
        widgetIdRef.current = null;

        if (provider === 'turnstile' && window.turnstile) {
          widgetIdRef.current = window.turnstile.render(containerRef.current, {
            sitekey: siteKey,
            theme: theme === 'dark' ? 'dark' : 'light',
            size: 'flexible',
            callback: (t: string) => onToken(t),
            'expired-callback': () => onToken(''),
            'error-callback': () => onToken(''),
            'refresh-expired': 'auto',
          });
        } else if (provider === 'hcaptcha' && window.hcaptcha) {
          widgetIdRef.current = window.hcaptcha.render(containerRef.current, {
            sitekey: siteKey,
            theme: theme === 'dark' ? 'dark' : 'light',
            callback: (t: string) => onToken(t),
            'expired-callback': () => onToken(''),
            'error-callback': () => onToken(''),
          });
        } else if (provider === 'recaptcha' && window.grecaptcha) {
          const doRender = () => {
            widgetIdRef.current = window.grecaptcha.render(containerRef.current!, {
              sitekey: siteKey,
              theme: theme === 'dark' ? 'dark' : 'light',
              callback: (t: string) => onToken(t),
              'expired-callback': () => onToken(''),
              'error-callback': () => onToken(''),
            });
          };
          if (window.grecaptcha?.render) doRender();
          else window.grecaptcha?.ready(doRender);
        }
      })
      .catch(() => onToken(''));

    return () => {
      mounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, provider, siteKey, theme]);

  if (!enabled) return null;
  if (!siteKey) {
    return (
      <div style={{ fontSize: 12, color: '#b45309' }}>
        当前已开启人机验证，但站点尚未配置 site_key，请联系管理员。
      </div>
    );
  }

  return <div ref={containerRef} className={className} />;
}
