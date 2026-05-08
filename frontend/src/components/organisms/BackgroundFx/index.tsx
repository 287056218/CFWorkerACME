import styles from './BackgroundFx.module.css';

export interface BackgroundFxProps {
  scanlines?: boolean;
  grid?: boolean;
  blobs?: boolean;
  intensity?: 'subtle' | 'normal' | 'strong';
}

/**
 * 背景特效层 —— 固定定位覆盖全屏
 * 包含：
 * - 呼吸光斑（3 个 blob）
 * - 对角网格（淡化版）
 * - 扫描线（仅暗黑模式显眼）
 */
export default function BackgroundFx({
  scanlines = true,
  grid = true,
  blobs = true,
  intensity = 'normal',
}: BackgroundFxProps) {
  return (
    <div
      className={[styles.fx, styles[`intensity-${intensity}`]]
        .filter(Boolean)
        .join(' ')}
      aria-hidden="true"
    >
      {blobs && (
        <>
          <span className={`${styles.blob} ${styles.blob1}`} />
          <span className={`${styles.blob} ${styles.blob2}`} />
          <span className={`${styles.blob} ${styles.blob3}`} />
        </>
      )}
      {grid && <span className={styles.grid} />}
      {scanlines && <span className={styles.scanlines} />}
    </div>
  );
}
