import type { CSSProperties } from 'react';

export interface LogoProps {
  size?: number;
  className?: string;
  style?: CSSProperties;
}

/**
 * CertHub Logo —— 终端窗口 + 锁图标
 */
export default function Logo({ size = 36, className, style }: LogoProps) {
  return (
    <svg
      className={className}
      style={style}
      width={size}
      height={size}
      viewBox="0 0 64 64"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="CertHub logo"
    >
      <defs>
        <linearGradient id="chLogoBg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="var(--brand)" />
          <stop offset="100%" stopColor="var(--brand-ink)" />
        </linearGradient>
      </defs>
      {/* 圆角方块背景 */}
      <rect
        x="4"
        y="4"
        width="56"
        height="56"
        rx="14"
        fill="url(#chLogoBg)"
      />
      {/* 三色圆点 */}
      <circle cx="14" cy="18" r="2.4" fill="var(--accent)" />
      <circle cx="22" cy="18" r="2.4" fill="var(--lemon)" />
      <circle cx="30" cy="18" r="2.4" fill="#FFFFFF" opacity="0.85" />
      {/* 锁 */}
      <g transform="translate(22 28)">
        <rect x="0" y="8" width="20" height="16" rx="3" fill="#FFFFFF" />
        <path
          d="M4 8 V5 a6 6 0 0 1 12 0 V8"
          fill="none"
          stroke="#FFFFFF"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <circle cx="10" cy="15" r="1.6" fill="var(--brand-ink)" />
        <rect x="9" y="15" width="2" height="4" fill="var(--brand-ink)" rx="0.8" />
      </g>
    </svg>
  );
}
