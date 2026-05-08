import { useMemo } from 'react';
import { randomKaomoji, seededKaomoji, type KaomojiMood } from '@utils/kaomoji';

/**
 * 返回一个基于 seed 的稳定颜文字（防止重渲染闪烁）
 * 或随机颜文字（当 seed 未提供）
 */
export function useKaomoji(mood: KaomojiMood = 'happy', seed?: string | number) {
  return useMemo(() => {
    if (seed !== undefined) return seededKaomoji(mood, seed);
    return randomKaomoji(mood);
  }, [mood, seed]);
}
