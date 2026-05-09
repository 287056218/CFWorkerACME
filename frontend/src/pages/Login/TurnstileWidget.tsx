import { useEffect, useRef } from 'react';
import { TURNSTILE_SITE_KEY } from '@utils/constants';
import { useTheme } from '@hooks/useTheme';

const TURNSTILE_SRC = 'https://challenges.cloudflare.com/turnstile/v0/api.js';

function loadTurnstileScript(): Promise<void> {
  if (window.__turnstileLoaded && window.turnstile) return Promise.resolve();
  return new Promise((resolve, reject) => {
    const existed = document.querySelector(`script[src="${TURNSTILE_SRC}"]`);
    if (existed) {
      existed.addEventListener('load', () => {
        window.__turnstileLoaded = true;
        resolve();
      });
      return;
    }
    const s = document.createElement('script');
    s.src = TURNSTILE_SRC;
    s.async = true;
    s.defer = true;
    s.onload = () => {
      window.__turnstileLoaded = true;
      resolve();
    };
    s.onerror = () => reject(new Error('Turnstile 加载失败'));
    document.head.appendChild(s);
  });
}

export interface TurnstileWidgetProps {
  onSuccess: (token: string) => void;
  onExpired?: () => void;
  onError?: () => void;
  siteKey?: string;
  className?: string;
}

/**
 * Cloudflare Turnstile 验证码组件（SPA 兼容版）
 */
export default function TurnstileWidget({
  onSuccess,
  onExpired,
  onError,
  siteKey = TURNSTILE_SITE_KEY,
  className,
}: TurnstileWidgetProps) {
  const { theme } = useTheme();
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | null>(null);

  useEffect(() => {
    // 没有 siteKey（如管理员未配置 Turnstile）直接不渲染，避免空 key 卡住整个登录流程
    if (!siteKey) return;

    let mounted = true;

    loadTurnstileScript()
      .then(() => {
        if (!mounted || !containerRef.current || !window.turnstile) return;
        // 重置之前的 widget（防止重复）
        if (widgetIdRef.current) {
          try {
            window.turnstile.remove(widgetIdRef.current);
          } catch {
            /* ignore */
          }
          widgetIdRef.current = null;
        }
        widgetIdRef.current = window.turnstile.render(containerRef.current, {
          sitekey: siteKey,
          theme: theme === 'dark' ? 'dark' : 'light',
          size: 'flexible',
          callback: (t: string) => onSuccess(t),
          'expired-callback': () => onExpired?.(),
          'error-callback': () => onError?.(),
          'refresh-expired': 'auto',
        });
      })
      .catch(() => onError?.());

    return () => {
      mounted = false;
      if (widgetIdRef.current && window.turnstile) {
        try {
          window.turnstile.remove(widgetIdRef.current);
        } catch {
          /* ignore */
        }
        widgetIdRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [theme, siteKey]);

  return <div ref={containerRef} className={className} />;
}
