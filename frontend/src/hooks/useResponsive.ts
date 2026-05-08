import { useEffect, useState } from 'react';

const BREAKPOINTS = {
  xs: 480,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  xxl: 1536,
};

export type Breakpoint = keyof typeof BREAKPOINTS;

function getCurrentBreakpoint(): Breakpoint {
  if (typeof window === 'undefined') return 'lg';
  const w = window.innerWidth;
  if (w < BREAKPOINTS.xs) return 'xs';
  if (w < BREAKPOINTS.sm) return 'sm';
  if (w < BREAKPOINTS.md) return 'md';
  if (w < BREAKPOINTS.lg) return 'lg';
  if (w < BREAKPOINTS.xl) return 'xl';
  return 'xxl';
}

/**
 * 检测当前断点 + 常用判断
 */
export function useResponsive() {
  const [bp, setBp] = useState<Breakpoint>(getCurrentBreakpoint);

  useEffect(() => {
    const onResize = () => setBp(getCurrentBreakpoint());
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const isMobile = bp === 'xs' || bp === 'sm' || bp === 'md';
  const isTablet = bp === 'lg';
  const isDesktop = bp === 'xl' || bp === 'xxl';

  return { bp, isMobile, isTablet, isDesktop };
}
