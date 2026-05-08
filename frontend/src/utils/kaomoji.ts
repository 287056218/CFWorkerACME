/* ============================================================
 * 颜文字（Kaomoji）
 * 按场景分组，可随机抽取
 * ============================================================ */

export type KaomojiMood =
  | 'loading'
  | 'empty'
  | 'success'
  | 'error'
  | 'welcome'
  | 'thinking'
  | 'warning'
  | 'happy';

export const KAOMOJI_POOL: Record<KaomojiMood, string[]> = {
  loading: ['(｡･ω･｡)', '(◕‿◕)', '(｡◕‿◕｡)', '(´｡• ω •｡`)', '(＾▽＾)'],
  empty: ['(´･ω･`)？', '(｡•́︿•̀｡)', 'ヽ(´～｀;)', '(・_・?)', '(￣ε￣@)'],
  success: [
    '(๑•̀ㅂ•́)و✧',
    '(◠‿◠)✿',
    'ヽ(°◇° )ノ',
    '٩(｡•́‿•̀｡)۶',
    '(ﾉ´ヮ`)ﾉ*: ･ﾟ',
  ],
  error: ['(╯°□°）╯', '(；￣Д￣)', '(＞﹏＜)', '(╥﹏╥)', '(´；ω；`)'],
  welcome: [
    '(*ˊᗜˋ*)/ᵗᑋᵃᶰᵏ ᵞᵒᵘ*',
    '(｡•̀ᴗ-)✧',
    '(•̀ᴗ•́)و ̑̑',
    'ʕ•ᴥ•ʔ',
    '(◕‿◕✿)',
  ],
  thinking: ['(・・?)', '(｡ŏ﹏ŏ)', '(￣▽￣*)ゞ', '(・∀・)ノ', '(¬_¬)'],
  warning: ['(°ロ°)', '(⊙_⊙)', '(ﾟДﾟ;)', '(￣ー￣;)', '(╯︵╰,)'],
  happy: ['(◠‿◠)', '(✿◡‿◡)', '(｡♥‿♥｡)', '(*´ω｀*)', '(≧◡≦)'],
};

export function randomKaomoji(mood: KaomojiMood = 'happy'): string {
  const pool = KAOMOJI_POOL[mood] || KAOMOJI_POOL.happy;
  return pool[Math.floor(Math.random() * pool.length)];
}

/**
 * 基于 seed 的稳定选择（同一 seed 返回相同结果，避免渲染闪烁）
 */
export function seededKaomoji(mood: KaomojiMood, seed: number | string): string {
  const pool = KAOMOJI_POOL[mood] || KAOMOJI_POOL.happy;
  const s =
    typeof seed === 'string'
      ? Array.from(seed).reduce((acc, c) => acc + c.charCodeAt(0), 0)
      : seed;
  return pool[s % pool.length];
}
