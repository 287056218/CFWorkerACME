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
