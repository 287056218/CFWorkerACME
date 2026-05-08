import { useCallback } from 'react';
import { App } from 'antd';
import { randomKaomoji } from '@utils/kaomoji';

/**
 * 复制到剪贴板 hook，成功后显示可爱的 toast
 */
export function useCopy() {
  const { message } = App.useApp();

  const copy = useCallback(
    async (text: string, successMsg?: string): Promise<boolean> => {
      try {
        if (navigator.clipboard && window.isSecureContext) {
          await navigator.clipboard.writeText(text);
        } else {
          // 降级方案
          const ta = document.createElement('textarea');
          ta.value = text;
          ta.style.position = 'fixed';
          ta.style.left = '-9999px';
          document.body.appendChild(ta);
          ta.select();
          document.execCommand('copy');
          document.body.removeChild(ta);
        }
        message.success(
          `${successMsg || '已复制'} ${randomKaomoji('success')}`,
        );
        return true;
      } catch (e) {
        message.error(`复制失败 ${randomKaomoji('error')}`);
        return false;
      }
    },
    [message],
  );

  return { copy };
}
