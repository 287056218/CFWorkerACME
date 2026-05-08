/**
 * 全局 Bootstrap 状态：缓存 /bootstrap 的返回结果，供路由守卫、
 * 站点标题、Login 注册 Tab、证书申请验证码等多处共用。
 *
 * 约定：
 *   - refresh() 会强制拉取最新值；
 *   - 应用启动时在 App.tsx 中首次调用 ensureLoaded()；
 *   - 调用方可以订阅 `info` 字段做响应式渲染。
 */

import { create } from 'zustand';
import { fetchBootstrap, type BootstrapInfo } from '@api/system';

interface BootstrapState {
  info: BootstrapInfo | null;
  loading: boolean;
  error: string | null;
  /** 应用启动时调用；若已加载则不重复请求。 */
  ensureLoaded: () => Promise<void>;
  /** 主动刷新（初始化完成、系统配置保存后）。 */
  refresh: () => Promise<void>;
}

async function loadOnce(set: (s: Partial<BootstrapState>) => void) {
  set({ loading: true, error: null });
  try {
    const info = await fetchBootstrap();
    set({ info, loading: false, error: null });
    // 同步站点标题到 document
    if (info?.site_title) {
      try {
        document.title = info.site_title;
      } catch {
        /* SSR safe */
      }
    }
  } catch (e: any) {
    set({
      info: null,
      loading: false,
      error: e?.message ?? '获取系统状态失败',
    });
  }
}

export const useBootstrapStore = create<BootstrapState>((set, get) => ({
  info: null,
  loading: false,
  error: null,

  ensureLoaded: async () => {
    if (get().info || get().loading) return;
    await loadOnce(set);
  },

  refresh: async () => {
    await loadOnce(set);
  },
}));
