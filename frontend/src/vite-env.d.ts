/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_TITLE: string;
  readonly VITE_API_BASE: string;
  readonly VITE_TURNSTILE_SITE_KEY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

declare module '*.svg?react' {
  import type { FunctionComponent, SVGProps } from 'react';
  const SVGComponent: FunctionComponent<SVGProps<SVGSVGElement>>;
  export default SVGComponent;
}

declare module '*.module.css' {
  const classes: { readonly [key: string]: string };
  export default classes;
}

// --- 全局第三方验证码 SDK 注入到 window 的类型声明 ---
// 统一放置，避免在多个组件中 `declare global` 引起类型合并冲突
interface Window {
  turnstile?: {
    render: (el: HTMLElement, options: any) => string;
    reset: (widgetId?: string) => void;
    remove: (widgetId: string) => void;
  };
  hcaptcha?: any;
  grecaptcha?: any;
  __turnstileLoaded?: boolean;
}
